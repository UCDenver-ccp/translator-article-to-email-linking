import { Module, HttpModule } from '@nestjs/common';
import { AuthorService } from './author.service';

@Module({
  imports: [HttpModule],
  providers: [AuthorService],
  exports: [],
})
export class AuthorModule {}
