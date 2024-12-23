import { IsString, IsEmail, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    default: 'felipetest@gmail.com',
    description: 'Email user',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    default: 'Abc123456',
    description: 'Password user',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty({
    default: 'Felipe',
    description: 'Name user',
  })
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 carácteres' })
  @Matches(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/, { message: 'El nombre solo puede contener letras.' })
  name: string;

  @ApiProperty({
    default: 'test',
    description: 'Username user',
  })
  @IsString()
  @MinLength(3, { message: 'El apellido debe tener al menos 3 carácteres' })
  @Matches(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/, { message: 'El nombre solo puede contener letras.' })
  surname: string;
}
