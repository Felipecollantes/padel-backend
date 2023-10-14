import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'

export class CreateLeagueDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  totalMatches?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  matchesWon?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  matchesTied?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  matchesLost?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  points?: number;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  participants?: string[];
}
