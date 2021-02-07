import { Module, HttpModule } from '@nestjs/common';
import { AuthorService } from './author.service';
import { OrcidModule } from './../orcid/orcid.module';
import { PubMedModule } from './../pubmed/pubmed.module';

@Module({
  imports: [HttpModule, OrcidModule, PubMedModule],
  providers: [AuthorService],
  exports: [OrcidModule, PubMedModule],
})
export class AuthorModule {}
