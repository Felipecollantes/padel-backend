import 'reflect-metadata';
import { validate } from 'class-validator';
import { LeagueUsersResponseDto } from './response-league_users.dto';
import { plainToClass } from 'class-transformer';

describe('LeagueUsersResponseDto', () => {
  it('should validate that usersId is a string', async () => {
    const dto = new LeagueUsersResponseDto();
    dto.usersId = 'fb00f78d-a930-45b9-b810-9f12f7ea6596';
    dto.email = 'user@example.com';
    dto.name = 'John';
    dto.surname = 'Doe';
    dto.isActive = true;
    dto.totalMatches = 10;
    dto.matchesWon = 7;
    dto.matchesTied = 2;
    dto.matchesLost = 1;
    dto.points = 23;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation when usersId is not a uuid', async () => {
    const dto = new LeagueUsersResponseDto();
    dto.usersId = 'invalid-uuid';
    dto.email = 'user@example.com';
    dto.name = 'John';
    dto.surname = 'Doe';
    dto.isActive = true;
    dto.totalMatches = 10;
    dto.matchesWon = 7;
    dto.matchesTied = 2;
    dto.matchesLost = 1;
    dto.points = 23;

    const errors = await validate(dto);
    expect(errors).not.toHaveLength(0);
    const idError = errors.find((error) => error.property === 'usersId');
    expect(idError).toBeDefined();
    expect(idError.constraints.isUuid).toBeDefined();
  });

  it('should fail validation when totalMatches is not a number', async () => {
    const dto = new LeagueUsersResponseDto();
    dto.totalMatches = 'invalid' as any;
    dto.usersId = 'fb00f78d-a930-45b9-b810-9f12f7ea6596';
    dto.email = 'user@example.com';
    dto.name = 'John';
    dto.surname = 'Doe';
    dto.isActive = true;
    dto.matchesWon = 7;
    dto.matchesTied = 2;
    dto.matchesLost = 1;
    dto.points = 23;

    const errors = await validate(dto);
    expect(errors).not.toHaveLength(0);
    const idError = errors.find((error) => error.property === 'totalMatches');
    expect(idError).toBeDefined();
    expect(idError.constraints.isInt).toBeDefined();
  });

  it('should fail validation when isActive is not a boolean', async () => {
    const dto = new LeagueUsersResponseDto();
    dto.isActive = 'not-a-boolean' as any;
    dto.usersId = 'fb00f78d-a930-45b9-b810-9f12f7ea6596';
    dto.email = 'user@example.com';
    dto.name = 'John';
    dto.surname = 'Doe';
    dto.totalMatches = 10;
    dto.matchesWon = 7;
    dto.matchesTied = 2;
    dto.matchesLost = 1;
    dto.points = 23;

    const errors = await validate(dto);
    expect(errors).not.toHaveLength(0);
    const idError = errors.find((error) => error.property === 'isActive');
    expect(idError.constraints).toBeDefined();
    expect(idError.constraints.isBoolean).toBeDefined();
  });

  it('should fail validation when email is not a valid email address', async () => {
    const dto = plainToClass(LeagueUsersResponseDto, {
      email: 'invalid-email',
      usersId: 'fb00f78d-a930-45b9-b810-9f12f7ea6596',
      name: 'John',
      surname: 'Doe',
      isActive: true,
      totalMatches: 10,
      matchesWon: 7,
      matchesTied: 2,
      matchesLost: 1,
      points: 23,
    });

    const errors = await validate(dto);
    expect(errors).not.toHaveLength(0);
    const idError = errors.find((error) => error.property === 'email');
    expect(idError.constraints).toBeDefined();
    expect(idError.constraints.isEmail).toBeDefined();
  });

  it('should fail validation when totalMatches is negative', async () => {
    const dto = new LeagueUsersResponseDto();
    dto.totalMatches = -10;
    dto.usersId = 'fb00f78d-a930-45b9-b810-9f12f7ea6596';
    dto.email = 'user@example.com';
    dto.name = 'John';
    dto.surname = 'Doe';
    dto.isActive = true;
    dto.matchesWon = 7;
    dto.matchesTied = 2;
    dto.matchesLost = 1;
    dto.points = 23;

    const errors = await validate(dto);
    expect(errors).not.toHaveLength(0);
    const idError = errors.find((error) => error.property === 'totalMatches');
    expect(idError.constraints).toBeDefined();
    expect(idError.constraints.min).toBeDefined();
  });

  it('should validate isActive is a boolean', async () => {
    const dto = new LeagueUsersResponseDto();
    dto.isActive = false;
    dto.usersId = 'fb00f78d-a930-45b9-b810-9f12f7ea6596';
    dto.email = 'user@example.com';
    dto.name = 'John';
    dto.surname = 'Doe';
    dto.totalMatches = 10;
    dto.matchesWon = 7;
    dto.matchesTied = 2;
    dto.matchesLost = 1;
    dto.points = 23;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation when matchesWon is not an integer', async () => {
    const dto = new LeagueUsersResponseDto();
    dto.matchesWon = 7.5;
    dto.usersId = 'fb00f78d-a930-45b9-b810-9f12f7ea6596';
    dto.email = 'user@example.com';
    dto.name = 'John';
    dto.surname = 'Doe';
    dto.isActive = true;
    dto.totalMatches = 10;
    dto.matchesTied = 2;
    dto.matchesLost = 1;
    dto.points = 23;

    const errors = await validate(dto);
    expect(errors).not.toHaveLength(0);
    const idError = errors.find((error) => error.property === 'matchesWon');
    expect(idError.constraints.isInt).toBeDefined();
  });

  it('should fail validation when name is empty', async () => {
    const dto = new LeagueUsersResponseDto();
    dto.name = null;
    dto.usersId = 'fb00f78d-a930-45b9-b810-9f12f7ea6596';
    dto.email = 'user@example.com';
    dto.surname = 'Doe';
    dto.isActive = true;
    dto.totalMatches = 10;
    dto.matchesWon = 7;
    dto.matchesTied = 2;
    dto.matchesLost = 1;
    dto.points = 23;

    const errors = await validate(dto);
    expect(errors).not.toHaveLength(0);
    const idError = errors.find((error) => error.property === 'name');
    expect(idError.constraints.isNotEmpty).toBeDefined();
  });

  it('should fail validation when surname is empty', async () => {
    const dto = new LeagueUsersResponseDto();
    dto.surname = '';
    dto.usersId = 'fb00f78d-a930-45b9-b810-9f12f7ea6596';
    dto.email = 'user@example.com';
    dto.name = 'John';
    dto.isActive = true;
    dto.totalMatches = 10;
    dto.matchesWon = 7;
    dto.matchesTied = 2;
    dto.matchesLost = 1;
    dto.points = 23;

    const errors = await validate(dto);
    expect(errors).not.toHaveLength(0);
    expect(errors.some((e) => e.property === 'surname')).toBeTruthy();
    const idError = errors.find((error) => error.property === 'surname');
    expect(idError.constraints.isNotEmpty).toBeDefined();
  });
});
