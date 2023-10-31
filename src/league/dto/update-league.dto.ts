import { IsArray, IsBoolean, IsDate, IsNumber, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLeagueDto {
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
  @IsNumber()
  totalMatches: number;

  @ApiProperty({
    description: 'Number of matches won in the league.',
    example: 7,
  })
  @IsNumber()
  matchesWon: number;

  @ApiProperty({
    description: 'Number of matches tied in the league.',
    example: 2,
  })
  @IsNumber()
  matchesTied: number;

  @ApiProperty({
    description: 'Number of matches lost in the league.',
    example: 1,
  })
  @IsNumber()
  matchesLost: number;

  @ApiProperty({ description: 'Total points in the league.', example: 23 })
  @IsNumber()
  points: number;

  @ApiProperty({
    description: 'List of id participants in the league.',
    type: [String],
    example: [],
  })
  @IsArray()
  participants: string[];

  @ApiProperty({
    description: 'The date the league was created.',
    type: String,
    format: 'date-time',
    example: '2023-10-28T09:08:06.757Z',
  })
  @Type(() => Date)
  @IsDate()
  createdAt: Date;
}
