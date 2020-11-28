import { Module, HttpModule } from '@nestjs/common';
import { AuthorService } from './author.service';
import { OrcidModule } from './../orcid/orcid.module';

@Module({
  imports: [HttpModule, OrcidModule],
  providers: [AuthorService],
  exports: [OrcidModule],
})
export class AuthorModule {}
