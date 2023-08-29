import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateLeagueDto {
  @IsString()
  name: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  totalMatches?: number;

  @IsNumber()
  @IsOptional()
  matchesWon?: number;

  @IsNumber()
  @IsOptional()
  matchesTied?: number;

  @IsNumber()
  @IsOptional()
  matchesLost?: number;

  @IsNumber()
  @IsOptional()
  points?: number;

  @IsArray()
  @IsOptional()
  participants?: string[];
}
