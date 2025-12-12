import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryItemDto {
  @IsOptional()
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  location: string;
  @IsOptional()
  @IsString()
  category: string;

  //   @Transform(({ value }) => parseInt(value))
  //   @IsNumber()
  //   year: number;
}
