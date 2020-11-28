import { Module, HttpModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorController } from './author/author.controller';
import { AuthorService } from './author/author.service';
import { AuthorModule } from './author/author.module';

@Module({
  imports: [AuthorModule, HttpModule],
  controllers: [AppController, AuthorController],
  providers: [AppService, AuthorService, ConfigService],
})
export class AppModule {}
