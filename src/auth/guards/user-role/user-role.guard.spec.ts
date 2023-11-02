import { UserRoleGuard } from './user-role.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { Test } from '@nestjs/testing';

describe('UserRoleGuard', () => {
  let guard: UserRoleGuard;
  let reflector: Reflector;
  let context: ExecutionContext;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserRoleGuard,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<UserRoleGuard>(UserRoleGuard);
    reflector = module.get<Reflector>(Reflector);

    context = {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn(() => ({})), // Retorna un objeto vacío por defecto
      })),
      getClass: jest.fn(),
      getHandler: jest.fn(),
    } as unknown as ExecutionContext;
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should activate if no roles are required', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(undefined);
    expect(guard.canActivate(context)).toBe(true);
  });

  // TODO hacer estos tests, no sale bien

  // it('should throw BadRequestException if user not found in request', async () => {
  //   jest.spyOn(reflector, 'get').mockReturnValue(['admin']);
  //   jest.spyOn(context.switchToHttp(), 'getRequest').mockReturnValueOnce({ user: null });
  //   console.log('==>', guard.canActivate(context));
  //   await expect(guard.canActivate(context)).rejects.toThrow(new BadRequestException('User not found'));
  // });

  // it('should activate if user has a valid role', async () => {
  //   jest.spyOn(reflector, 'get').mockReturnValue(['admin']);
  //   jest.spyOn(context.switchToHttp(), 'getRequest').mockReturnValueOnce({
  //     user: { roles: ['admin'], name: 'TestUser' },
  //   });
  //   await expect(guard.canActivate(context)).resolves.toBe(true);
  // });

  // it('should throw ForbiddenException if user does not have a valid role', async () => {
  //   jest.spyOn(reflector, 'get').mockReturnValue(['admin']);
  //   jest.spyOn(context.switchToHttp(), 'getRequest').mockReturnValueOnce({
  //     user: { roles: ['user'], name: 'TestUser' },
  //   });
  //   await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  // });

  // // Asegurarse de que los roles están indefinidos o vacíos en el mock cuando sea necesario
  // it('should throw ForbiddenException if user roles is empty', async () => {
  //   jest.spyOn(reflector, 'get').mockReturnValue(['admin']);
  //   jest.spyOn(context.switchToHttp(), 'getRequest').mockReturnValueOnce({
  //     user: { roles: [], name: 'TestUser' },
  //   });
  //   await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  // });

  // it('should throw ForbiddenException if user roles is undefined', async () => {
  //   jest.spyOn(reflector, 'get').mockReturnValue(['admin']);
  //   jest.spyOn(context.switchToHttp(), 'getRequest').mockReturnValueOnce({
  //     user: { name: 'TestUser' }, // Simula que la propiedad roles no está definida
  //   });
  //   await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  // });
});
