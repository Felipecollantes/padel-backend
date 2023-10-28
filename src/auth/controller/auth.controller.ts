import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginUserDto } from '../dto/login-user.dto';
import { ApiTags } from '@nestjs/swagger'
import { LoginUserResponseDto } from '../dto/response-login-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto): Promise<LoginUserResponseDto> {
    return this.authService.login(loginUserDto);
  }
}
