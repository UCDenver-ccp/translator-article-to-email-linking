import { Injectable } from '@nestjs/common';
import { OrcidClient } from './orcid.client';

@Injectable()
export class OrcidService {

  constructor(private readonly orcidClient: OrcidClient) {}

  async getOrcidEmail(orcid: string) {
    return this.orcidClient.getOrcidEmail(orcid);
  }
}
