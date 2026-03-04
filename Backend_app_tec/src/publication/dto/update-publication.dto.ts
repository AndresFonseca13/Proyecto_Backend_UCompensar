import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdatePublicationDto {
  @IsOptional()
  @IsString()
  name?: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsOptional()
  @IsString()
  img?: string;
  @IsOptional()
  @IsInt()
  price?: number;
  @IsOptional()
  @IsString()
  brandId?: string;
  @IsOptional()
  @IsString()
  userId?: string;
}
