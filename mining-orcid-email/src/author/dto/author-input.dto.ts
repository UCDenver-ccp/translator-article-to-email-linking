import { IsNotEmptyObject } from 'class-validator';

export class AuthorDto {
    @IsNotEmptyObject()
    pubMedIds: number[];
}