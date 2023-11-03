import { validate } from 'class-validator';
import 'reflect-metadata';
import { LeagueResponseDto } from './response-league.dto';

describe('LeagueResponseDto', () => {
  it('should validate with no errors for valid data', async () => {
    const dto = new LeagueResponseDto();
    dto.id = 'fb00f78d-a930-45b9-b810-9f12f7ea6596';
    dto.name = 'Champions League';
    dto.isActive = true;
    dto.totalMatches = 10;
    dto.participants = [];
    dto.createdAt = new Date();
    dto.matches = [];

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation when id is not a valid UUID', async () => {
    const dto = new LeagueResponseDto();
    dto.id = 'invalid-uuid';
    dto.name = 'Champions League';
    dto.isActive = true;
    dto.totalMatches = 10;
    dto.participants = [];
    dto.createdAt = new Date();
    dto.matches = [];

    const errors = await validate(dto);
    expect(errors).not.toHaveLength(0);
    const idError = errors.find((error) => error.property === 'id');
    expect(idError).toBeDefined();
    expect(idError.constraints.isUuid).toBeDefined();
  });

  it('should fail validation when name is empty', async () => {
    const dto = new LeagueResponseDto();
    dto.id = 'fb00f78d-a930-45b9-b810-9f12f7ea6596';
    dto.name = '';
    dto.isActive = true;
    dto.totalMatches = 10;
    dto.participants = [];
    dto.createdAt = new Date();
    dto.matches = [];

    const errors = await validate(dto);
    expect(errors).not.toHaveLength(0);
    const idError = errors.find((error) => error.property === 'name');
    expect(idError.constraints.isNotEmpty).toBeDefined();
  });

  it('should fail validation when totalMatches is negative', async () => {
    const dto = new LeagueResponseDto();
    dto.totalMatches = -1;
    dto.id = 'fb00f78d-a930-45b9-b810-9f12f7ea6596';
    dto.name = 'Champions League';
    dto.isActive = true;
    dto.participants = [];
    dto.createdAt = new Date();
    dto.matches = [];

    const errors = await validate(dto);
    expect(errors).not.toHaveLength(0);
    const idError = errors.find((error) => error.property === 'totalMatches');
    expect(idError.constraints).toBeDefined();
    expect(idError.constraints.min).toBeDefined();
  });

  it('should fail validation when participants is not an array', async () => {
    const dto = new LeagueResponseDto();
    dto.participants = {} as any;
    dto.id = 'fb00f78d-a930-45b9-b810-9f12f7ea6596';
    dto.name = 'Champions League';
    dto.isActive = true;
    dto.totalMatches = 10;
    dto.createdAt = new Date();
    dto.matches = [];

    const errors = await validate(dto);
    expect(errors).not.toHaveLength(0);
    const idError = errors.find((error) => error.property === 'participants');
    expect(idError.constraints.isArray).toBeDefined();
  });

  it('should fail validation when createdAt is not a date', async () => {
    const dto = new LeagueResponseDto();
    dto.createdAt = 'not-a-date' as any;
    dto.id = 'fb00f78d-a930-45b9-b810-9f12f7ea6596';
    dto.name = 'Champions League';
    dto.isActive = true;
    dto.totalMatches = 10;
    dto.participants = [];
    dto.matches = [];

    const errors = await validate(dto);
    expect(errors).not.toHaveLength(0);
    const idError = errors.find((error) => error.property === 'createdAt');
    expect(idError.constraints.isDate).toBeDefined();
  });

  it('should fail validation when matches is not an array', async () => {
    const dto = new LeagueResponseDto();
    dto.matches = {} as any;
    dto.id = 'fb00f78d-a930-45b9-b810-9f12f7ea6596';
    dto.name = 'Champions League';
    dto.isActive = true;
    dto.totalMatches = 10;
    dto.participants = [];
    dto.createdAt = new Date();

    const errors = await validate(dto);
    expect(errors).not.toHaveLength(0);
    const idError = errors.find((error) => error.property === 'matches');
    expect(idError.constraints.isArray).toBeDefined();
  });
});
