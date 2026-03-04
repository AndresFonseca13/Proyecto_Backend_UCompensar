import { IsBoolean, IsString } from 'class-validator';

export class CreateLikeDto {
  @IsString()
  userId: string;
  @IsBoolean()
  Isliked: boolean;
  @IsString()
  publicationId: string;
}
