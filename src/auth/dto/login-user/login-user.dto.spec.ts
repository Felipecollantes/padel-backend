import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { LoginUserDto } from './login-user.dto';

describe('LoginUserDto', () => {
  it('should fail validation for an invalid email', async () => {
    const dto = plainToClass(LoginUserDto, {
      email: 'not-an-email',
      password: 'ValidPass123!',
    });

    const errors = await validate(dto);
    const emailError = errors.find((error) => error.property === 'email');
    expect(emailError).toBeDefined();
    expect(emailError.constraints).toHaveProperty('isEmail');
  });

  it('should fail validation for a password that is too short', async () => {
    const dto = plainToClass(LoginUserDto, {
      email: 'test@example.com',
      password: '123', // Too short
    });

    const errors = await validate(dto);
    const passwordError = errors.find((error) => error.property === 'password');
    expect(passwordError).toBeDefined();
    expect(passwordError.constraints).toHaveProperty('minLength');
  });

  it('should fail validation for a password without required characters', async () => {
    const dto = plainToClass(LoginUserDto, {
      email: 'test@example.com',
      password: 'alllowercase', // No uppercase letters or numbers
    });

    const errors = await validate(dto);
    const passwordError = errors.find((error) => error.property === 'password');
    expect(passwordError).toBeDefined();
    expect(passwordError.constraints).toHaveProperty('matches');
  });

  it('should pass validation for a valid dto', async () => {
    const dto = plainToClass(LoginUserDto, {
      email: 'felipetest@gmail.com',
      password: 'Abc123456', // Valid
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
