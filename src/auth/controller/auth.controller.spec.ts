import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { LoginUserDto } from '../dto/login-user/login-user.dto';
import { LoginUserResponseDto } from '../dto/response-login-user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const authServiceMock = {
      login: jest.fn((dto: LoginUserDto) => {
        const responseDto = new LoginUserResponseDto();
        responseDto.id = 'some-uuid';
        responseDto.email = dto.email;
        responseDto.name = 'Felipe';
        responseDto.surname = 'Test';
        responseDto.isActive = true;
        responseDto.createdAt = new Date();
        responseDto.lastLogin = new Date();
        responseDto.elo = 1200;
        responseDto.roles = ['user'];
        responseDto.token = 'mockAccessToken';
        return Promise.resolve(responseDto);
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('loginUser', () => {
    let loginUserDto: LoginUserDto;
    let result: LoginUserResponseDto;

    beforeEach(async () => {
      loginUserDto = new LoginUserDto();
      loginUserDto.email = 'felipetest@gmail.com';
      loginUserDto.password = 'Abc123456';

      result = await controller.loginUser(loginUserDto);
    });

    it('should return an instance of LoginUserResponseDto', async () => {
      expect(result).toBeInstanceOf(LoginUserResponseDto);
    });

    it('should return a response containing a token', async () => {
      expect(result.token).toBeDefined();
    });

    it('should return a response with the expected email', async () => {
      expect(result.email).toBe(loginUserDto.email);
    });

    it('should call AuthService.login with the correct DTO', async () => {
      expect(authService.login).toHaveBeenCalledWith(loginUserDto);
    });

    it('should call AuthService.login exactly once', async () => {
      expect(authService.login).toHaveBeenCalledTimes(1);
    });
  });
});
