import { IsBoolean } from 'class-validator';

export class UpdateLikeDto {
  @IsBoolean()
  Isliked: boolean;
}
