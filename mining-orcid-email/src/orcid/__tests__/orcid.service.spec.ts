import { Test, TestingModule } from '@nestjs/testing';
import { OrcidClient } from '../orcid.client';
import { OrcidService } from '../orcid.service';
import { OrcidModule } from '../orcid.module';
import { orcidEmailResponseNoEmail, orcidResponse } from '../../../test/test.fixtures';


describe('OrcidService', () => {
    let client: OrcidClient;
    let service: OrcidService;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [OrcidModule],
      }).compile();
  
      client = module.get<OrcidClient>(OrcidClient);
      service = module.get<OrcidService>(OrcidService);
    });
  
    afterEach(() => {
      jest.resetAllMocks();
    });
  
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    describe('#getOrcId', () => {
        beforeEach(() => {
            jest.spyOn(client, 'getOrcId').mockResolvedValue(orcidResponse);
        });

        it('should return parsed orcid', async () => {
            const pubMedId = 22368089;
            const orcId = await service.getOrcId(pubMedId);
            console.log(orcId)
            expect(orcId).toEqual('0000-0002-4256-9639');
        });
        it('should return empty orcid', async () => {
            jest.spyOn(client, 'getOrcId').mockResolvedValue("incorrect xml");
            const pubMedId = 22368089;
            const orcId = await service.getOrcId(pubMedId);
            console.log(orcId)
            expect(orcId).toEqual('');
        });
    });
    describe('#getEmailFromOrcId', () => {
        beforeEach(() => {
            jest.spyOn(client, 'getOrcIdEmail').mockResolvedValue(orcidEmailResponseNoEmail);
        });

        it('should return empty object', async () => {
            const orcId = '0000-0002-4256-9639';
            const orcIdResponse = await service.getOrcidEmail(orcId);
            expect(orcIdResponse).toEqual({
                name: '',
                email: '',
            });
        });
        it('should return valid orcid response object', async () => {
            jest.spyOn(client, 'getOrcId').mockResolvedValue("incorrect xml");
            const pubMedId = 22368089;
            const orcId = await service.getOrcId(pubMedId);
            console.log(orcId)
            expect(orcId).toEqual('');
        });
    });
});
