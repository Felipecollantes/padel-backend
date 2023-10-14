import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMatchDto {
  @IsString()
  leagueId: string;

  @IsArray()
  teamOnePlayersIds: string[];

  @IsArray()
  teamTwoPlayersIds: string[];

  @IsBoolean()
  @IsOptional()
  isCompleted: boolean;

  @IsBoolean()
  @IsOptional()
  isCancelled: boolean;

  @IsDate()
  @IsOptional()
  startTime: Date;

  @IsNumber()
  @IsOptional()
  setsWonByTeamOne: number;

  @IsNumber()
  @IsOptional()
  setsWonByTeamTwo: number;

  @IsNumber()
  @IsOptional()
  gamesWonByTeamOne: number;

  @IsNumber()
  @IsOptional()
  gamesWonByTeamTwo: number;
}
