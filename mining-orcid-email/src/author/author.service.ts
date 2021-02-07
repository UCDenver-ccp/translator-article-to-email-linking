import { Injectable, HttpService, Logger } from '@nestjs/common';
import { OrcidService } from '../orcid/orcid.service';
import { PubMedService } from '../pubmed/pubmed.service';
import { AuthorDto } from './dto/author-input.dto';
import { AuthorResponseInterface } from './dto/author-response.interface';
import { toDisk } from 'objects-to-csv';

@Injectable()
export class AuthorService {
  constructor(
    private readonly httpService: HttpService, 
    private readonly orcidService: OrcidService,
    private readonly pubMedService: PubMedService,
  ) {}
  logger = new Logger(AuthorService.name);

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async writeToCsv(entries) {
    const ObjectsToCsv = require('objects-to-csv');
    const result = [];
    const map = new Map();
    for (const item of entries) {
        console.log(item)
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
    await csv.toDisk('./list.csv', { append: true });

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
	  for (let i = 0; i < pubMedIds.length; i++) {
      const pubMedId = pubMedIds[i];
      const orcId = await this.orcidService.getOrcId(pubMedId);
      if (orcId) {
        console.log(orcId)
      } else {
        authorsNoOrcids.push(pubMedId)
      }
      const { name, email } = await this.orcidService.getOrcidEmail(orcId);
      const authorEntry = { name, email, orcId };
      if (name || email) {
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
          pubMedId: pubMedIds[i],
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
