import { Injectable } from '@nestjs/common';
import { OrcidClient } from './orcid.client';

@Injectable()
export class OrcidService {

  constructor(private readonly orcidClient: OrcidClient) {}

  async getOrcidEmail(orcid: string) {
    const response = await this.orcidClient.getOrcidEmail(orcid);
    const { email, path } = response;
    console.log(response)
    return response;
  }

  async getOrcId(pubMedId: number) {
    const response = await this.orcidClient.getOrcId(pubMedId);
    // TODO: parse the response here.
    return response;
  }
}
