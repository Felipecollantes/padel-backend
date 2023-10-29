import {
  IsArray,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLeagueDto {

  @ApiProperty({
    description: 'The name of the league.',
    example: 'Champions League'
  })
  @IsString({ message: 'El nombre es obligatorio.' })
  name: string;

  @ApiProperty({
    description: 'List of participants in the league.',
    example: [],
    type: [String],
    required: false
  })
  @IsArray()
  @IsOptional()
  participants?: string[];
}
