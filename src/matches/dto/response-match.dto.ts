import { IsArray, IsBoolean, IsDate, IsNumber, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';


export class PlayerDto {
  @ApiProperty({ description: 'The unique ID of the user.', example: 'fb00f78d-a930-45b9-b810-9f12f7ea6596' })
  @IsUUID('4')
  id: string;

  @ApiProperty({
    example: "Pablo",
    description: "First name of the player."
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: "Surname test",
    description: "Surname of the player."
  })
  @IsString()
  surname: string;
}


export class MatchResponseDto {
  @ApiProperty({
    example: "371d951d-d8b0-4912-860e-74ba0be1af56",
    description: "Unique identifier for the match."
  })
  @IsString()
  id: string;

  @ApiProperty({
    example: "18b0618f-1bf1-4106-993c-8b23d1cd356f",
    description: "Unique identifier for the league this match belongs to."
  })
  @IsString()
  leagueId: string;

  @ApiProperty({
    type: Date,
    example: null,
    description: "Scheduled start time for the match."
  })
  @Type(() => Date)
  @IsDate()
  startTime: Date;

  @ApiProperty({
    example: false,
    description: "Indicates whether the match is completed."
  })
  @IsBoolean()
  isCompleted: boolean;

  @ApiProperty({
    example: false,
    description: "Indicates if the match is cancelled."
  })
  @IsBoolean()
  isCancelled: boolean;

  @ApiProperty({
    type: [PlayerDto],
    description: "List of players in team one for this match."
  })
  @IsArray()
  teamOnePlayers: PlayerDto[];

  @ApiProperty({
    type: [PlayerDto],
    description: "List of players in team two for this match."
  })
  @IsArray()
  teamTwoPlayers: PlayerDto[];

  @ApiProperty({
    example: 0,
    description: "Number of sets won by team one."
  })
  @IsNumber()
  setsWonByTeamOne: number;

  @ApiProperty({
    example: 0,
    description: "Number of sets won by team two."
  })
  @IsNumber()
  setsWonByTeamTwo: number;

  @ApiProperty({
    example: 0,
    description: "Number of games won by team one."
  })
  @IsNumber()
  gamesWonByTeamOne: number;

  @ApiProperty({
    example: 0,
    description: "Number of games won by team two."
  })
  @IsNumber()
  gamesWonByTeamTwo: number;
}


