import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  IsArray,
  IsOptional,
} from 'class-validator';
import { User } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty({
    default: 'felipetest@gmail.com',
    description: 'Email user'
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    default: 'Abc123456',
    description: 'Password user'
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty({
    default: 'Felipe',
    description: 'Name user'
  })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({
    default: 'test',
    description: 'Username user'
  })
  @IsString()
  @MinLength(1)
  surname: string;

  @ApiProperty({
    default: [],
    description: 'Friendship empty'
  })
  @IsArray()
  @IsOptional()
  friendship: User[];
}
