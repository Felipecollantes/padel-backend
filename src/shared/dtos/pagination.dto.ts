import { IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger'


export class PaginationDto {
  @ApiProperty({
    default: 10,
    description: 'How many users do you need?'
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number) // Transform string limit from url to number
  limit?: number;

  @ApiProperty({
    default: 0,
    description: 'How many users do you want to skip?'
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number) // Transform string limit from url to number
  offset?: number;
}
