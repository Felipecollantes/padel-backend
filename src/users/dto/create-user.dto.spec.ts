import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  it('should validate the email is correct', async () => {
    const dto = new CreateUserDto();
    dto.email = 'felipetest@gmail.com';
    dto.password = 'Abc123456';
    dto.name = 'Felipe';
    dto.surname = 'Test';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation when email is invalid', async () => {
    const dto = new CreateUserDto();
    dto.email = 'invalid-email';
    dto.password = 'Abc123456';
    dto.name = 'Felipe';
    dto.surname = 'Test';

    const errors = await validate(dto);
    expect(errors).not.toHaveLength(0);
    const emailError = errors.find((error) => error.property === 'email');
    expect(emailError.constraints).toBeDefined();
    expect(emailError.constraints.isEmail).toBeDefined();
  });

  it('should fail validation when password does not meet complexity requirements', async () => {
    const dto = new CreateUserDto();
    dto.email = 'felipetest@gmail.com';
    dto.password = 'abc'; // Invalid password
    dto.name = 'Felipe';
    dto.surname = 'Test';

    const errors = await validate(dto);
    expect(errors).not.toHaveLength(0);
    const passwordError = errors.find((error) => error.property === 'password');
    expect(passwordError.constraints).toBeDefined();
    expect(passwordError.constraints.minLength).toBeDefined();
    expect(passwordError.constraints.matches).toBeDefined();
  });

  it('should fail validation when name is not alphabetic', async () => {
    const dto = new CreateUserDto();
    dto.email = 'felipetest@gmail.com';
    dto.password = 'Abc123456';
    dto.name = '123'; // Invalid name
    dto.surname = 'Test';

    const errors = await validate(dto);
    expect(errors).not.toHaveLength(0);
    const nameError = errors.find((error) => error.property === 'name');
    expect(nameError.constraints).toBeDefined();
    expect(nameError.constraints.matches).toBeDefined();
  });

  it('should fail validation when surname is not alphabetic', async () => {
    const dto = new CreateUserDto();
    dto.email = 'felipetest@gmail.com';
    dto.password = 'Abc123456';
    dto.name = 'Felipe';
    dto.surname = '12345'; // Invalid surname

    const errors = await validate(dto);
    expect(errors).not.toHaveLength(0);
    const surnameError = errors.find((error) => error.property === 'surname');
    expect(surnameError.constraints).toBeDefined();
    expect(surnameError.constraints.matches).toBeDefined();
  });

  it('should fail validation if password is too short', async () => {
    const dto = new CreateUserDto();
    dto.email = 'felipetest@gmail.com';
    dto.password = 'Abc1'; // Too short
    dto.name = 'Felipe';
    dto.surname = 'Test';

    const errors = await validate(dto);
    expect(errors).not.toHaveLength(0);
    const passwordError = errors.find((error) => error.property === 'password');
    expect(passwordError.constraints.minLength).toBeDefined();
  });

  it('should fail validation if password is too long', async () => {
    const dto = new CreateUserDto();
    dto.email = 'felipetest@gmail.com';
    // Too long
    dto.password = 'Abc1234567890Abc1234567890Abc1234567890Abc1234567890Abc123';
    dto.name = 'Felipe';
    dto.surname = 'Test';

    const errors = await validate(dto);
    expect(errors).not.toHaveLength(0);
    const passwordError = errors.find((error) => error.property === 'password');
    expect(passwordError.constraints.maxLength).toBeDefined();
  });

  it('should fail validation if name contains only white spaces', async () => {
    const dto = new CreateUserDto();
    dto.email = 'felipetest@gmail.com';
    dto.password = 'Abc123456';
    dto.name = '   '; // Invalid name
    dto.surname = 'Test';

    const errors = await validate(dto);
    expect(errors).not.toHaveLength(0);
    const nameError = errors.find((error) => error.property === 'name');
    expect(nameError.constraints.matches).toBeDefined();
  });
});
