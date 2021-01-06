import { Injectable, HttpService, Logger, HttpStatus, HttpException } from '@nestjs/common';
import { ConfigService} from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Method } from 'axios';
import { SSL_OP_EPHEMERAL_RSA } from 'constants';

@Injectable()
export class OrcidClient {
  private readonly baseUrl: string;
  public readonly logger: Logger;

  constructor(private httpService: HttpService, private configService: ConfigService) {
    this.baseUrl = 'https://pub.orcid.org/v';
    this.logger = new Logger(OrcidClient.name);
  }

  public async makeRequest(
    method: Method,
    url: string,
    token: string,
    data: any = {},
    contentType = 'application/json',
  ) {
    try {
      const res: any = await this.httpService
        .request({
          method,
          url,
          data,
          headers: {
            'content-type': contentType,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(data.getHeaders ? data.getHeaders() : {}),
          },
        })
        .toPromise();

      return res.data;
    } catch (error) {
      let status: number = null;
      let errorData: any = null;

      const { response } = error;
      if (response) {
        status = response.status;
        errorData = response.data;
      } else if (error.toJSON) {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        errorData = error.toJSON();
      } else {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        errorData = error;
      }

      this.logger.error(errorData, `Error with ${method} request to Orcid. Url: ${url}`);

      throw new HttpException(errorData, status);
    }
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  public async getOrcIdEmail(orcId: string) {
    //orcId = '0000-0003-1455-3370';
    if (orcId) {
      const url = `https://pub.orcid.org/v2.1/${orcId}/email`;
      const token = this.configService.get('ORCID_AUTH_KEY');
      //console.log(`token: ${process.env.ORCID_AUTH_KEY}`);
      let numRetries = 0;
      while (numRetries < 5) {
        try {
          const response = await this.makeRequest('GET', url, token);
          return response;
        } catch (error) {
          console.log(error)
          console.log(`retry: ${numRetries}`)
          ++numRetries;
          this.sleep(100);
        }
      }
    }
    return undefined;
  }

  public async getOrcId(pubMedId: number) {
    const url = `https://pub.orcid.org/v3.0/search/?q=pmid-self:${pubMedId}`;
    const token = this.configService.get('ORCID_AUTH_KEY');
    let responseReceived = false;
    let numRetries = 0;
    while (numRetries < 5) {
      try {
        const response = await this.makeRequest('GET', url, token);
        if (numRetries > 1) {
          console.log(`pubmed id: ${pubMedId} done.`)
        }
        return response;
      } catch (error) {
        console.log(`retrying ${pubMedId}: ${numRetries}`)
        ++numRetries;
        this.sleep(100);
      }
    }
  }
}
