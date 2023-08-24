import { IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number) // Transform string limit from url to number
  limit?: number;

  @IsOptional()
  @Min(0)
  @Type(() => Number) // Transform string limit from url to number
  offset?: number;
}
