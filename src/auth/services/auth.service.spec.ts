import { AuthService } from './auth.service';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userRepository: Repository<User>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let jwtService: JwtService;

  const mockUserRepository = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(authService.login({ email: 'notfound@example.com', password: 'Test1234' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const user = new User();
      user.password = 'hashedpassword';
      user.email = 'test@example.com';
      user.id = 'some-uuid';

      mockUserRepository.findOne.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);

      await expect(authService.login({ email: 'test@example.com', password: 'wrongpassword' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return a LoginUserResponseDto with a valid token if credentials are valid', async () => {
      const user = new User();
      user.password = 'hashedpassword';
      user.email = 'test@example.com';
      user.id = 'some-uuid';
      user.name = 'Test';
      user.surname = 'User';
      user.isActive = true;
      user.createdAt = new Date();
      user.lastLogin = new Date();
      user.elo = 1200;
      user.roles = ['user'];

      mockUserRepository.findOne.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
      mockJwtService.sign.mockReturnValue('signed-jwt-token');

      const result = await authService.login({ email: 'test@example.com', password: 'Test1234' });

      expect(result).toEqual(
        expect.objectContaining({
          email: 'test@example.com',
          token: 'signed-jwt-token',
        }),
      );
    });

    it('should update the last login date on successful authentication', async () => {
      // Configuración de un usuario mock y sus expectativas
      const mockUser = {
        id: 'some-uuid',
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test',
        surname: 'User',
        isActive: true,
        createdAt: new Date(),
        lastLogin: new Date(),
        elo: 1200,
        roles: ['user'],
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
      mockUserRepository.update.mockResolvedValue(true); // Simula una actualización exitosa

      await authService.login({ email: 'test@example.com', password: 'Test1234' });

      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser.id, expect.any(Object));
    });

    it('should handle database errors gracefully', async () => {
      mockUserRepository.findOne.mockRejectedValue(new Error('Database error'));

      await expect(authService.login({ email: 'test@example.com', password: 'Test1234' })).rejects.toThrow(
        'Database error',
      );
    });
  });
});
