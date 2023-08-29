import { IsNumber, IsOptional } from 'class-validator';

export class UserLeagueStatsDto {
  @IsNumber()
  @IsOptional()
  matchesPlayed?: number;

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
}
