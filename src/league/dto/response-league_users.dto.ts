import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class LeagueUsersResponseDto {
  @IsString()
  usersId: string;

  @IsNumber()
  totalMatches: number;

  @IsNumber()
  matchesWon: number;

  @IsNumber()
  matchesTied: number;

  @IsNumber()
  matchesLost: number;

  @IsNumber()
  points: number;

  @IsString()
  email: string;

  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsBoolean()
  isActive: boolean
}