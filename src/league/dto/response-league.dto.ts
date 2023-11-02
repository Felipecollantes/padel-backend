import { IsArray, IsBoolean, IsDate, IsInt, IsNotEmpty, IsString, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { LeagueUsersResponseDto } from './response-league_users.dto';
import { MatchResponseDto } from 'src/matches/dto/response-match.dto';

export class LeagueResponseDto {
  @ApiProperty({
    description: 'The unique ID of the league.',
    example: 'fb00f78d-a930-45b9-b810-9f12f7ea6596',
  })
  @IsUUID('4')
  id: string;

  @ApiProperty({
    description: 'The name of the league.',
    example: 'Champions League',
  })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Indicates whether the league is active.',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: 'Total number of matches in the league.',
    example: 10,
  })
  @IsInt({ message: 'El total de partidos debe ser un número entero.' })
  @Min(0, { message: 'El número total de partidos no puede ser negativo.' })
  totalMatches: number;

  // @ApiProperty({
  //   description: 'Number of matches won in the league.',
  //   example: 7,
  // })
  // @IsNumber()
  // matchesWon: number;

  // @ApiProperty({
  //   description: 'Number of matches tied in the league.',
  //   example: 2,
  // })
  // @IsNumber()
  // matchesTied: number;

  // @ApiProperty({
  //   description: 'Number of matches lost in the league.',
  //   example: 1,
  // })
  // @IsNumber()
  // matchesLost: number;

  // @ApiProperty({ description: 'Total points in the league.', example: 23 })
  // @IsNumber()
  // points: number;

  @ApiProperty({
    description: 'List of participants in the league.',
    type: [String],
    example: [],
  })
  @IsArray()
  participants: LeagueUsersResponseDto[];

  @ApiProperty({
    description: 'The date the league was created.',
    type: String,
    format: 'date-time',
    example: '2023-10-28T09:08:06.757Z',
  })
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'List of matches in the league.',
    type: [String],
    example: [],
  })
  @IsArray()
  matches: MatchResponseDto[];
}
