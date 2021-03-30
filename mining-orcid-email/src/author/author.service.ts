import { Injectable, HttpService, Logger } from '@nestjs/common';
import { OrcidService } from '../orcid/orcid.service';
import { PubMedService } from '../pubmed/pubmed.service';
import { AuthorDto } from './dto/author-input.dto';
import { csvEntry, csvLine } from './dto/csv-entry.interface';
import { AuthorResponseInterface } from './dto/author-response.interface';
import { toDisk } from 'objects-to-csv';

@Injectable()
export class AuthorService {

  public csvMap;

  constructor(
    private readonly httpService: HttpService, 
    private readonly orcidService: OrcidService,
    private readonly pubMedService: PubMedService,
  ) {
    this.csvMap = new Map<string, csvEntry>();
    this.createCSVMap(this.csvMap);
  }
  logger = new Logger(AuthorService.name);

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async createCSVMap(csvMap) {
    let csv= require('fast-csv');
    let fs = require('fs');
    let es = require('event-stream');

    const filePath = 'OA04_Affiliations_100000_With_Emails.csv';
    let lineNr = 0;
    let headers;
    let s = fs.createReadStream(filePath)
      .pipe(es.split())
      .pipe(es.mapSync(function(line){
          // pause the readstream
          s.pause();
          if (lineNr === 0) {
            headers = line.split(",");
          } else {
            const obj = <csvLine>{};
            const currentline = line.split(",");
            for(let j=0;j<headers.length;j++){
              obj[headers[j]] = currentline[j];
            }
            if (obj) {
              const { PMID, Email, Affiliation, Department, Institution } = obj;
              if (PMID) {
                const csvMapEntry = csvMap.get(PMID);
                if (csvMapEntry) {
                  csvMapEntry.Email += `,${Email}`;
                } else {
                  csvMap.set(PMID, {Email, Affiliation, Department, Institution});
                }
              }
            }
          }
          lineNr += 1;
          // resume the readstream, possibly from a callback
          s.resume();
      })
      .on('error', function(err){
          console.log('Error while reading file.', err);
      })
      .on('end', function(){
        console.log(`Read entire file: ${csvMap.size}`);
      })
    );
  }

  async writeToCsv(entries) {
    const ObjectsToCsv = require('objects-to-csv');
    const result = [];
    const map = new Map();
    for (const item of entries) {
        if(!map.has(item.pubMedId)){
            map.set(item.pubMedId, true);    // set any value to Map
            result.push({
              pubMedId: item.pubMedId,
              orcId: item.orcId,
              name: item.name,
              email: item.email,
              title: item.Title,
              lastAuthor: item.LastAuthor,
              authorList: item.AuthorList,
              source: item.SO,
              doi: item.DOI,
              issn: item.ISSN,
              fullJournalName: item.FullJournalName,
            });
        }
    }
    const csv = new ObjectsToCsv(result);
    await csv.toDisk('./AuthorEmails.csv', { append: true });
  }

  async getAuthors(data: AuthorDto): Promise<AuthorResponseInterface> {
    // talk to orcid here.
    // orcid client -> getAuthorInfo()
    // output -> processsed to send response to the API call.
    const pubMedIds = data.pubMedIds
    const entries = [];
    let authorsNoOrcids = [];
    if (!pubMedIds) {
      const authorResponse = {} as AuthorResponseInterface;
      return authorResponse;
    }
    const authorResponses = []
    let name, email;
	  for (let i = 0; i < pubMedIds.length; i++) {
      const pubMedId = pubMedIds[i];
      email = '';
      name = '';
      const orcId = await this.orcidService.getOrcId(pubMedId);
      if (orcId) {
        const orcidResponse = await this.orcidService.getOrcidEmail(orcId);
        name = orcidResponse.name;
        email = orcidResponse.email;
      }
      if (!email) {
        // Find the email in the CSV map.
        const csvMapEntry = this.csvMap.get(pubMedId.toString());
        if (csvMapEntry) {
          email = csvMapEntry.Email;
        } else {
          authorsNoOrcids.push(pubMedId);
          this.sleep(100);
          continue;
        }
      }
      // Have we found a name or email yet?
      if (name || email) {
        const authorEntry = { name, email, orcId };
        const { FullJournalName, Title, ISSN, DOI, LastAuthor, AuthorList, SO } = await this.pubMedService.getPublicationInfo(pubMedId, 'docsum');
        const csvEntry = {
          pubMedId,
          name,
          email,
          orcId,
          Title,
          ISSN,
          DOI,
          LastAuthor,
          AuthorList,
          SO,
          FullJournalName,
        }
        entries.push(csvEntry);
        const entry = {
          authors: [authorEntry],
          pubMedId: pubMedId,
          title: Title,
          issn: ISSN,
          doi: DOI,
          lastAuthor: LastAuthor,
          so: SO,
          fullJournalName: FullJournalName,
          authorList: AuthorList,
        }
        authorResponses.push(entry)
      }
      this.sleep(100);
    }
    await this.writeToCsv(entries);
    const authorResponse = {
      authorsWithOrcid: authorResponses,
      authorsWithoutOrcid: authorsNoOrcids,
    };
    return authorResponse;
  }
}
