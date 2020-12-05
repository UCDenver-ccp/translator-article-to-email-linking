import { Module, HttpModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrcidClient } from './orcid.client';
import { OrcidService } from './orcid.service';

@Module({
  imports: [HttpModule],
  providers: [OrcidClient, OrcidService, ConfigService],
  exports: [OrcidService],
})
export class OrcidModule {}
