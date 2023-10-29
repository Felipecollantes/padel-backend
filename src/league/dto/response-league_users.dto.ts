import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LeagueUsersResponseDto {

  @ApiProperty({ description: 'The unique ID of the user.', example: 'fb00f78d-a930-45b9-b810-9f12f7ea6596' })
  @IsString()
  usersId: string;

  @ApiProperty({ description: 'Total number of matches played by the user in the league.', example: 10 })
  @IsNumber()
  totalMatches: number;

  @ApiProperty({ description: 'Number of matches won by the user in the league.', example: 7 })
  @IsNumber()
  matchesWon: number;

  @ApiProperty({ description: 'Number of matches tied by the user in the league.', example: 2 })
  @IsNumber()
  matchesTied: number;

  @ApiProperty({ description: 'Number of matches lost by the user in the league.', example: 1 })
  @IsNumber()
  matchesLost: number;

  @ApiProperty({ description: 'Total points earned by the user in the league.', example: 23 })
  @IsNumber()
  points: number;

  @ApiProperty({ description: 'The email of the user.', example: 'user@example.com' })
  @IsString()
  email: string;

  @ApiProperty({ description: 'The name of the user.', example: 'John' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The surname of the user.', example: 'Doe' })
  @IsString()
  surname: string;

  @ApiProperty({ description: 'Indicates whether the user is active in the league.', example: true })
  @IsBoolean()
  isActive: boolean;
}
