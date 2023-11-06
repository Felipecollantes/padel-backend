import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Matches,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LeagueUsersResponseDto {
  @ApiProperty({
    description: 'The unique ID of the user.',
    example: 'fb00f78d-a930-45b9-b810-9f12f7ea6596',
  })
  @IsUUID('4')
  usersId: string;

  @ApiProperty({
    description: 'Total number of matches played by the user in the league.',
    example: 10,
  })
  @IsInt({ message: 'El total de partidos debe ser un número entero.' })
  @Min(0, { message: 'El número total de partidos no puede ser negativo.' })
  totalMatches: number;

  @ApiProperty({
    description: 'Number of matches won by the user in the league.',
    example: 7,
  })
  @IsInt({ message: 'El número de partidos ganados debe ser un número entero.' })
  @Min(0, { message: 'El número de partidos ganados no puede ser negativo.' })
  matchesWon: number;

  @ApiProperty({
    description: 'Number of matches tied by the user in the league.',
    example: 2,
  })
  @IsInt({ message: 'El número de partidos empatados debe ser un número entero.' })
  @Min(0, { message: 'El número de partidos empatados no puede ser negativo.' })
  matchesTied: number;

  @ApiProperty({
    description: 'Number of matches lost by the user in the league.',
    example: 1,
  })
  @IsInt({ message: 'El número de partidos perdidos debe ser un número entero.' })
  @Min(0, { message: 'El número de partidos perdidos no puede ser negativo.' })
  matchesLost: number;

  @ApiProperty({
    description: 'Total points earned by the user in the league.',
    example: 23,
  })
  @IsNumber()
  points: number;

  @ApiProperty({
    description: 'The email of the user.',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'El email debe ser un correo válido.' }) // Asegúrate de añadir este decorador
  email: string;

  @ApiProperty({ description: 'The name of the user.', example: 'John' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 carácteres' })
  @Matches(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/, { message: 'El nombre solo puede contener letras.' })
  name: string;

  @ApiProperty({ description: 'The surname of the user.', example: 'Doe' })
  @IsString()
  @IsNotEmpty({ message: 'El apellido no puede estar vacío.' })
  @MinLength(3, { message: 'El apellido debe tener al menos 3 carácteres' })
  @Matches(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/, { message: 'El apellido solo puede contener letras.' })
  surname: string;

  @ApiProperty({
    description: 'Indicates whether the user is active in the league.',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;
}
