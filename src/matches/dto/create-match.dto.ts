import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMatchDto {
  @ApiProperty({
    default: '18b0618f-1bf1-4106-993c-8b23d1cd356f',
    description: 'League id'
  })
  @IsString()
  leagueId: string;

  @ApiProperty({
    default: '6dc29adb-517a-4a2d-ae36-0b96a4def775',
    description: 'Array id participants'
  })
  @IsArray()
  teamOnePlayersIds: string[];

  @ApiProperty({
    default: '6dc29adb-517a-4a2d-ae36-0b96a4def775',
    description: 'Array id participants'
  })
  @IsArray()
  teamTwoPlayersIds: string[];

  @ApiProperty({
    default: false,
    description: 'Match is completed or not'
  })
  @IsBoolean()
  @IsOptional()
  isCompleted: boolean;

  @ApiProperty({
    default: false,
    description: 'Match is cancelled or not'
  })
  @IsBoolean()
  @IsOptional()
  isCancelled: boolean;

  @ApiProperty({
    default: false,
    description: 'Match is cancelled or not'
  })
  @IsDate()
  @IsOptional()
  startTime: Date;

  @ApiProperty({
    default: 12,
    description: 'Total sets won by team one'
  })
  @IsNumber()
  @IsOptional()
  setsWonByTeamOne: number;

  @ApiProperty({
    default: 8,
    description: 'Total sets won by team two'
  })
  @IsNumber()
  @IsOptional()
  setsWonByTeamTwo: number;

  @ApiProperty({
    default: 2,
    description: 'Total games won by team one'
  })
  @IsNumber()
  @IsOptional()
  gamesWonByTeamOne: number;

  @ApiProperty({
    default: 1,
    description: 'Total games won by team two'
  })
  @IsNumber()
  @IsOptional()
  gamesWonByTeamTwo: number;
}
