import { Injectable, HttpService, Logger } from '@nestjs/common';
import { OrcidService } from '../orcid/orcid.service';
import { AuthorDto } from './dto/author-input.dto';
import { AuthorResponseInterface } from './dto/author-response.interface';
import { toDisk } from 'objects-to-csv';

@Injectable()
export class AuthorService {
  constructor(
    private readonly httpService: HttpService, 
    private readonly orcidService: OrcidService
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
            });
        }
    }
    //console.log(result)
    const csv = new ObjectsToCsv(result);
    await csv.toDisk('./list.csv', { append: true });

  }

  async getAuthors(data: AuthorDto): Promise<AuthorResponseInterface[]> {
    // talk to orcid here.
    // orcid client -> getAuthorInfo()
    // output -> processsed to send response to the API call.
    const pubMedIds = data.pubMedIds
    const entries = [];
    if (!pubMedIds) {
      return [];
    }
    const authorResponses = []
	  for (let i = 0; i < pubMedIds.length; i++) {
      const pubMedId = pubMedIds[i];
      const orcId = await this.orcidService.getOrcId(pubMedId);
      if (orcId) {
        console.log(orcId)
      }
      //console.log(`pubmed id: ${pubMedIds[i]}, orcid: ${orcId}`)
      const { name, email } = await this.orcidService.getOrcidEmail(orcId);
      const authorEntry = { name, email, orcId };
      if (name || email) {
        const csvEntry = { pubMedId, name, email, orcId };
        entries.push(csvEntry);
      }
      const entry = {
        authors: [authorEntry],
        pubMedId: pubMedIds[i],
        pmcId: 0,
        title: '',
      }
      authorResponses.push(entry)
      this.sleep(100);
    }
    await this.writeToCsv(entries);
    return authorResponses;
  }
}
