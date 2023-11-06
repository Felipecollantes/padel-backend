import { IsUUID, IsBoolean, IsOptional, IsArray, IsDate, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsFutureDate } from './create-match.dto';
import { Transform } from 'class-transformer';

export class UpdateMatchDto {
  @ApiProperty({ example: '371d951d-d8b0-4912-860e-74ba0be1af56' })
  @IsUUID('4')
  id: string;

  @ApiProperty({ example: '18b0618f-1bf1-4106-993c-8b23d1cd356f' })
  @IsUUID('4')
  leagueId: string;

  @ApiProperty({ example: '2023-10-28T14:15:22Z', required: false })
  @IsOptional()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDate()
  @IsFutureDate({ message: 'The start time must be in the future.' })
  startTime?: Date | null;

  @ApiProperty({ example: false })
  @IsBoolean()
  isCompleted: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  isCancelled: boolean;

  @ApiProperty({
    default: '[' + '"6dc29adb-517a-4a2d-ae36-0b96a4def775",' + '"5yu80adb-517a-4a2d-ae36-0b96a4def432"' + ']',
    description: 'Array id participants',
  })
  @IsArray()
  @IsUUID(4, { each: true })
  teamOnePlayersIds: string[];

  @ApiProperty({
    default: '[' + '"6dc29adb-517a-4a2d-ae36-0b96a4def775",' + '"5yu80adb-517a-4a2d-ae36-0b96a4def432"' + ']',
    description: 'Array id participants',
  })
  @IsArray()
  @IsUUID(4, { each: true })
  teamTwoPlayersIds: string[];

  @ApiProperty({ example: 0 })
  @IsInt({ message: 'El total de sets debe ser un número entero.' })
  @Min(0, { message: 'El número total de sets no puede ser negativo.' })
  setsWonByTeamOne: number;

  @ApiProperty({ example: 0 })
  @IsInt({ message: 'El total de sets debe ser un número entero.' })
  @Min(0, { message: 'El número total de sets no puede ser negativo.' })
  setsWonByTeamTwo: number;

  @ApiProperty({ example: 0 })
  @IsInt({ message: 'El total de juegos debe ser un número entero.' })
  @Min(0, { message: 'El número total de juegos no puede ser negativo.' })
  gamesWonByTeamOne: number;

  @ApiProperty({ example: 0 })
  @IsInt({ message: 'El total de juegos debe ser un número entero.' })
  @Min(0, { message: 'El número total de juegos no puede ser negativo.' })
  gamesWonByTeamTwo: number;
}
