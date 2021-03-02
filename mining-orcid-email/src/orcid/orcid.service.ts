import { Injectable } from '@nestjs/common';
import { OrcidClient } from './orcid.client';
import { OrcidEmailResponseInterface } from './dto/orcid.email.interface';
import { parse, validate } from 'fast-xml-parser';

@Injectable()
export class OrcidService {

  constructor(private readonly orcidClient: OrcidClient) {}

  retrieveEmail(orcidEmailResponse: string): OrcidEmailResponseInterface {
    let name, email;
    if(validate(orcidEmailResponse) === true) { //optional (it'll return an object in case it's not valid)
      const orcidJson = parse(orcidEmailResponse, {});
      if (
          orcidJson['email:emails'] &&
          orcidJson['email:emails']['email:email'] &&
          orcidJson['email:emails']['email:email']['email:email']
      ) {
        email = orcidJson['email:emails']['email:email']['email:email'];
        if (
            orcidJson['email:emails'] &&
            orcidJson['email:emails']['email:email'] &&
            orcidJson['email:emails']['email:email']['common:source'] &&
            orcidJson['email:emails']['email:email']['common:source']['common:source-name']
        ) {
          name = orcidJson['email:emails']['email:email']['common:source']['common:source-name'];
        }
      } else if (
          orcidJson['email:emails'] &&
          orcidJson['email:emails']['email:email']
        ) {
        const entries = orcidJson['email:emails']['email:email']
        for (let index = 0; index < entries.length; index++) {
          const entry = entries[index];
          let currentEmail = '';
          let currentName = '';
          if (entry['email:email']) {
            currentEmail = entry['email:email']
          }
          if (
            entry['common:source'] &&
            entry['common:source']['common:source-name']
          ) {
            currentName = entry['common:source']['common:source-name']
          }
          if (!name) {
            name = currentName;
          } else {
            if (name !== currentName) {
              name = `${name}, ${currentName}`
            }
          }
          if (!email) {
            email = currentEmail;
          } else {
            if (email !== currentEmail) {
              email = `${email}, ${currentEmail}`
            }
          }
          if (name && email) {
            console.log(`Found: Email: ${email}, name: ${name}`)
            break
          }
        }
      }
    }
    return {
      name,
      email,
    }
  }

  async getOrcidEmail(orcid: string) {
    const response = await this.orcidClient.getOrcIdEmail(orcid);
    if (response) {
      const emailObj = this.retrieveEmail(response);
      return emailObj;
    }
    return {
      name: '',
      email: '',
    }
  }

  retrieveOrcid(orcidResponse: string): string {
    if(validate(orcidResponse) === true) { //optional (it'll return an object in case it's not valid)
      const orcidJson = parse(orcidResponse, {});
      if (
        orcidJson['search:search'] &&
        orcidJson['search:search']['search:result'] &&
        orcidJson['search:search']['search:result']['common:orcid-identifier'] &&
        orcidJson['search:search']['search:result']['common:orcid-identifier']['common:path']
      ) {
        const orcid = orcidJson['search:search']['search:result']['common:orcid-identifier']['common:path'];
        return orcid
      }
    }
    return ''
  }

  async getOrcId(pubMedId: number): Promise<string> {
    const orcidResponse = await this.orcidClient.getOrcId(pubMedId);
    const orcid = this.retrieveOrcid(orcidResponse)
    return orcid;
  }
}
