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
    const { pubMedIds } = data;
    if (!pubMedIds) {
      return [];
    }
	  for (let i = 0; i < pubMedIds.length; i++) {
      console.log(pubMedIds[i]);
      const orcId = await this.orcidService.getOrcId(pubMedIds[i]);
      console.log(`orcid: ${orcId}`)
      const authorEmail = await this.orcidService.getOrcidEmail(orcId);
    }
    const author = {
      firstName: 'A.',
      lastName: 'Crocker-Buque',
      email: 'pkind@ed.ac.uk',
    };
    const authorResponse = {
      authors: [author],
      orcId: '0000-0002-4256-9639',
      pubMedId: 22368089,
      pmcId: 3539452,
      title: 'The Development and Activity-Dependent Expression of Aggrecan in the Cat Visual Cortex',
    }
    //console.log(`response: ${JSON.stringify(response, null, 2)}`);
    return [authorResponse];
  }
}
