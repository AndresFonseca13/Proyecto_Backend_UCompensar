import { IsInt, IsString } from 'class-validator';

export class CreatePublicationDto {
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsString()
  img: string;
  @IsInt()
  price: number;
  @IsString()
  brandId: string;
  @IsString()
  userId: string;
}
