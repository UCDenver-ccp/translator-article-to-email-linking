import { Controller, Get, Body } from '@nestjs/common';
import { AuthorResponseInterface } from './dto/author-response.interface';
import { AuthorDto } from './dto/author-input.dto';
import { AuthorService } from './author.service';

@Controller('author')
export class AuthorController {
  constructor(private authorService: AuthorService) {}

  @Get()
  async findAll(@Body() data: AuthorDto): Promise<AuthorResponseInterface> {
    return await this.authorService.getAuthors(data);
  }
}
