import { IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  content: string;
  @IsString()
  userId: string;
  @IsString()
  publicationId: string;
}
