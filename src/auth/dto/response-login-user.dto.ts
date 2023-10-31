import { IsEmail, IsUUID, IsBoolean, IsString, IsNumber, IsArray, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserResponseDto {
  @ApiProperty({ description: 'The unique ID of the user.' })
  @IsUUID('4')
  id: string;

  @ApiProperty({ description: 'The email of the user.' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The first name of the user.' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The surname of the user.' })
  @IsString()
  surname: string;

  @ApiProperty({ description: 'Indicates whether the user is active.' })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: 'The date the user was created.',
    type: String,
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The date of the last login of the user.',
    type: String,
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  lastLogin: Date;

  @ApiProperty({ description: 'The ELO rating of the user.' })
  @IsNumber()
  elo: number;

  @ApiProperty({
    description: 'The roles assigned to the user.',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  roles: string[];

  @ApiProperty({ description: 'The authentication token for the user.' })
  @IsString()
  token: string;
}
