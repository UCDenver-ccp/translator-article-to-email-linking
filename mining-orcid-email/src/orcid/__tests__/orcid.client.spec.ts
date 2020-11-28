import { HttpException, HttpModule, HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { AxiosError } from 'axios';
import { OrcidClient } from '../orcid.client';
import { ConfigService } from '@nestjs/config';

describe('OrcidClient', () => {
  let client: OrcidClient;
  let httpService: HttpService;
  let getRequestUri: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [OrcidClient, ConfigService],
    }).compile();

    client = module.get<OrcidClient>(OrcidClient);
    httpService = module.get<HttpService>(HttpService);
    getRequestUri = 'https://pub.orcid.org';

    jest.spyOn(client.logger, 'error').mockImplementation(() => {
      return;
    });
  });

  it('should be defined', () => {
    expect(client).toBeDefined();
  });

  describe('makeRequest method', () => {
    it("should compose request's options and call httpService", async () => {
      const testData = { message: 'test data' };

      jest
        .spyOn(httpService, 'request')
        .mockImplementation(() => of({ data: { message: 'Orcid Test Response' } } as any));

      const res: any = await client.makeRequest('GET', getRequestUri, 'JWT orcid-test-token', testData);

      expect(res).toStrictEqual({ message: 'Orcid Test Response' });
      expect(httpService.request).toHaveBeenCalledTimes(1);
      expect(httpService.request).toHaveBeenCalledWith({
        data: testData,
        headers: {
          Authorization: 'Bearer JWT orcid-test-token',
          'content-type': 'application/json',
        },
        method: 'GET',
        url: 'https://pub.orcid.org',
      });
    });

    describe('when Axios is not able to make a request', () => {
      it('should log the error and throw HttpException', async () => {
        const error = {
          toJSON: jest.fn().mockReturnValue({
            name: 'Error',
            message: 'connect ECONNREFUSED 127.0.0.1:3000',
            response: undefined,
            config: { headers: { Authorization: 'orcid auth token' } },
          }),
        };

        jest.spyOn(httpService, 'request').mockImplementation(() => of(Promise.reject(error) as any));

        await expect(
          client.makeRequest('GET', getRequestUri, 'token', { message: 'test data' }),
        ).rejects.toThrowError();

        expect(error.toJSON).toHaveBeenCalledTimes(1);
        expect(client.logger.error).toHaveBeenCalledWith(
          {
            config: { headers: { Authorization: 'orcid auth token' } },
            message: 'connect ECONNREFUSED 127.0.0.1:3000',
            name: 'Error',
            response: undefined,
          },
          'Error with GET request to Orcid. Url: https://pub.orcid.org',
        );
      });
    });

    describe('when a general exception is thrown', () => {
      it('should log the error and throw HttpException', async () => {
        const error: Error = {
          name: 'Test Error Name',
          message: 'Tests Error Message',
          stack: 'Tests Error Stack',
        };

        jest.spyOn(httpService, 'request').mockImplementation(() => of(Promise.reject(error) as any));

        await expect(
          client.makeRequest('GET', getRequestUri, 'token', { message: 'test data' }),
        ).rejects.toThrowError();

        expect(client.logger.error).toHaveBeenCalledWith(
          { message: 'Tests Error Message', name: 'Test Error Name', stack: 'Tests Error Stack' },
          'Error with GET request to Orcid. Url: https://pub.orcid.org',
        );
      });
    });

    describe('when Front rejects the request', () => {
      it('should log the error and throw HttpException', async () => {
        const err: AxiosError<any> = {
          name: 'Error',
          message: '400 Bad Request',
          response: {
            status: 400,
            data: { errors: [{ message: 'Orcid Test Error' }] },
            statusText: 'Bad Request',
            config: undefined,
            headers: undefined,
          },
          config: undefined,
          isAxiosError: false,
          toJSON: jest.fn(),
        };

        jest.spyOn(httpService, 'request').mockImplementation(() => of(Promise.reject(err) as any));

        await expect(
          client.makeRequest('GET', getRequestUri, 'token', { message: 'test data' }),
        ).rejects.toStrictEqual(new HttpException(err.response.data, err.response.status));

        expect(client.logger.error).toHaveBeenCalledWith(
          { errors: [{ message: 'Orcid Test Error' }] },
          'Error with GET request to Orcid. Url: https://pub.orcid.org',
        );
      });
    });

    describe('when Front resolves the request', () => {
      it('should forward response data', async () => {
        const orcidRes: any = { data: { message: 'Test response' } };

        jest.spyOn(httpService, 'request').mockImplementation(() => of(orcidRes as any));

        const res: any = await client.makeRequest('GET', getRequestUri, 'token', { message: 'test data' });

        expect(res).toBe(orcidRes.data);
      });
    });
  });
});
