import { IsString, IsNumber, Min, Max } from 'class-validator';

export class CreateItemDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  @Max(1000000)
  price: number;

  @IsString()
  location: string;

  @IsString()
  category: string;
}
