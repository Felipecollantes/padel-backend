import { IsArray, IsDate, IsUUID, ValidationOptions, registerDecorator } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateMatchDto {
  @ApiProperty({
    default: '18b0618f-1bf1-4106-993c-8b23d1cd356f',
    description: 'League id',
  })
  @IsUUID('4')
  leagueId: string;

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

  @ApiProperty({
    default: '2023-10-29T17:09:49.000Z',
    description: 'Match is cancelled or not',
  })
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDate()
  @IsFutureDate({ message: 'The start time must be in the future.' })
  startTime: Date;
}

export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isFutureDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'object' && value instanceof Date && value.getTime() > new Date().getTime();
        },
        defaultMessage() {
          return 'La fecha de ser en el futuro';
        },
      },
    });
  };
}
