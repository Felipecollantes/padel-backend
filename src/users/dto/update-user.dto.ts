import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must have a Uppercase, lowercase letter and a number',
  })
  @IsOptional()
  currentPassword?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  updateActive?: boolean;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  updateElo?: number;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  updateRoles?: string[];
}
