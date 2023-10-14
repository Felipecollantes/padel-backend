import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'

export class LoginUserDto {
  @ApiProperty({
    default: 'felipetest@gmail.com',
    description: 'User email'
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
}
