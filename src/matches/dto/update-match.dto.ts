import { IsUUID, IsBoolean, IsOptional, IsArray, IsNumber, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMatchDto {
  @ApiProperty({ example: '371d951d-d8b0-4912-860e-74ba0be1af56' })
  @IsUUID()
  id: string;

  @ApiProperty({ example: '18b0618f-1bf1-4106-993c-8b23d1cd356f' })
  @IsUUID()
  leagueId: string;

  @ApiProperty({ example: '2023-10-28T14:15:22Z', required: false })
  @IsOptional()
  startTime?: Date | null;

  @ApiProperty({ example: false })
  @IsBoolean()
  isCompleted: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  isCancelled: boolean;

  @ApiProperty({
    default: '[' +
      '"6dc29adb-517a-4a2d-ae36-0b96a4def775",' +
      '"5yu80adb-517a-4a2d-ae36-0b96a4def432"' +
      ']',
    description: 'Array id participants'
  })
  @IsArray()
  teamOnePlayersIds: string[];

  @ApiProperty({
    default: '[' +
      '"6dc29adb-517a-4a2d-ae36-0b96a4def775",' +
      '"5yu80adb-517a-4a2d-ae36-0b96a4def432"' +
      ']',
    description: 'Array id participants'
  })
  @IsArray()
  teamTwoPlayersIds: string[];

  @ApiProperty({ example: 0 })
  @IsNumber()
  setsWonByTeamOne: number;

  @ApiProperty({ example: 0 })
  @IsNumber()
  setsWonByTeamTwo: number;

  @ApiProperty({ example: 0 })
  @IsNumber()
  gamesWonByTeamOne: number;

  @ApiProperty({ example: 0 })
  @IsNumber()
  gamesWonByTeamTwo: number;
}
