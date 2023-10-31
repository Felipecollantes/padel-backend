import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @IsString()
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
