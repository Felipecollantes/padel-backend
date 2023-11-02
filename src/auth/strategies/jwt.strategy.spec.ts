import { JwtStrategy } from './jwt.strategy';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository: Repository<User>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let configService: ConfigService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('SECRET'),
          },
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('validate', () => {
    it('should validate and return the user based on JWT payload', async () => {
      const user = new User();
      user.id = 'some-uuid';
      user.isActive = true;

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);

      const result = await jwtStrategy.validate({ id: user.id });
      expect(result).toEqual(user);
    });

    it('should throw an UnauthorizedException if no user is found', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      await expect(jwtStrategy.validate({ id: 'invalid-uuid' })).rejects.toThrow(UnauthorizedException);
    });

    it('should throw an UnauthorizedException if user is not active', async () => {
      const user = new User();
      user.id = 'some-uuid';
      user.isActive = false;

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);

      await expect(jwtStrategy.validate({ id: user.id })).rejects.toThrow(UnauthorizedException);
    });

    it('should throw an error if there is a database error', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockRejectedValue(new Error('Database error'));

      await expect(jwtStrategy.validate({ id: 'some-uuid' })).rejects.toThrow('Database error');
    });
  });
});
