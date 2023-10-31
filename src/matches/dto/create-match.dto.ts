import { IsArray, IsDate, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateMatchDto {
  @ApiProperty({
    default: '18b0618f-1bf1-4106-993c-8b23d1cd356f',
    description: 'League id',
  })
  @IsString()
  leagueId: string;

  @ApiProperty({
    default: '[' + '"6dc29adb-517a-4a2d-ae36-0b96a4def775",' + '"5yu80adb-517a-4a2d-ae36-0b96a4def432"' + ']',
    description: 'Array id participants',
  })
  @IsArray()
  teamOnePlayersIds: string[];

  @ApiProperty({
    default: '[' + '"6dc29adb-517a-4a2d-ae36-0b96a4def775",' + '"5yu80adb-517a-4a2d-ae36-0b96a4def432"' + ']',
    description: 'Array id participants',
  })
  @IsArray()
  teamTwoPlayersIds: string[];

  @ApiProperty({
    default: '2023-10-29T17:09:49.000Z',
    description: 'Match is cancelled or not',
  })
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDate()
  startTime: Date;
}
