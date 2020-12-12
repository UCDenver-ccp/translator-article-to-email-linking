import { Injectable, HttpService, Logger, HttpStatus, HttpException } from '@nestjs/common';
import { ConfigService} from '@nestjs/config';
import { Method } from 'axios';

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
  
  public async getOrcidEmail(orcId: string) {
      const url = `https://pub.orcid.org/v2.1/${orcId}/email`;
      const token = this.configService.get('ORCID_AUTH_KEY');
      //console.log(`token: ${process.env.ORCID_AUTH_KEY}`);
      const response = await this.makeRequest('GET', url, token);
      let xmlParser = require('xml2json');
      const jsonOutput = xmlParser.toJson(response);
      console.log(jsonOutput);
      return response;
  }

  public async getOrcId(pubMedId: number) {
    const url = `https://pub.orcid.org/v3.0/search/?q=pmid-self:${pubMedId}`;
    const token = this.configService.get('ORCID_AUTH_KEY');
    const response = await this.makeRequest('GET', url, token);
    console.log(`orcid response: ${response}`);
    return response;
  }
}
