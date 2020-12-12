import { Injectable, HttpService, Logger } from '@nestjs/common';
import { OrcidService } from '../orcid/orcid.service';
import { AuthorDto } from './dto/author-input.dto';
import { AuthorResponseInterface } from './dto/author-response.interface';

@Injectable()
export class AuthorService {
  constructor(
    private readonly httpService: HttpService, 
    private readonly orcidService: OrcidService
  ) {}
  logger = new Logger(AuthorService.name);

  async getAuthors(data: AuthorDto): Promise<AuthorResponseInterface[]> {
    // talk to orcid here.
    // orcid client -> getAuthorInfo()
    // output -> processsed to send response to the API call.
    const pubMedIds = data.pubMedIds
    if (!pubMedIds) {
      return [];
    }
    const authorResponses = []
	  for (let i = 0; i < pubMedIds.length; i++) {
      const orcId = await this.orcidService.getOrcId(pubMedIds[i]);
      if (orcId) {
        console.log(orcId)
      }
      //console.log(`pubmed id: ${pubMedIds[i]}, orcid: ${orcId}`)
      const { name, email } = await this.orcidService.getOrcidEmail(orcId);
      const entry = {
        authors: [{name, email, orcId}],
        pubMedId: pubMedIds[i],
        pmcId: 0,
        title: '',
      }
      authorResponses.push(entry)
    }
    return authorResponses;
  }
}
