import { IsBoolean } from 'class-validator';

export class ApprovedItemDto {
  @IsBoolean()
  approved: boolean;
}
