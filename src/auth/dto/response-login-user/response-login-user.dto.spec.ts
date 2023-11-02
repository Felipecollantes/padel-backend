import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { LoginUserResponseDto } from './response-login-user.dto';

describe('LoginUserResponseDto', () => {
  it('should validate all fields for a valid response', async () => {
    const responseDto = plainToClass(LoginUserResponseDto, {
      id: 'fb00f78d-a930-45b9-b810-9f12f7ea6596', // UUID v4
      email: 'user@example.com',
      name: 'John',
      surname: 'Doe',
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      elo: 1500,
      roles: ['user'],
      token: 'some-token-string',
    });

    const errors: ValidationError[] = await validate(responseDto);
    expect(errors.length).toBe(0);
  });

  // Test for invalid UUID
  it('should fail validation for an invalid UUID', async () => {
    const responseDto = plainToClass(LoginUserResponseDto, {
      id: 'invalid-uuid',
      email: 'user@example.com',
      name: 'John',
      surname: 'Doe',
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      elo: 1500,
      roles: ['user'],
      token: 'some-token-string',
    });

    const errors: ValidationError[] = await validate(responseDto);
    const idError = errors.find((error) => error.property === 'id');
    expect(idError).toBeDefined();
    expect(idError.constraints).toHaveProperty('isUuid');
  });

  // Test for invalid email
  it('should fail validation for an invalid email', async () => {
    const responseDto = plainToClass(LoginUserResponseDto, {
      email: 'invalid-email',
      id: 'fb00f78d-a930-45b9-b810-9f12f7ea6596', // UUID v4
      name: 'John',
      surname: 'Doe',
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      elo: 1500,
      roles: ['user'],
      token: 'some-token-string',
    });

    const errors: ValidationError[] = await validate(responseDto);
    const emailError = errors.find((error) => error.property === 'email');
    expect(emailError).toBeDefined();
    expect(emailError.constraints).toHaveProperty('isEmail');
  });
});
