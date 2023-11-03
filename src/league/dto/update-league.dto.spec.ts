import { validate } from 'class-validator';
import { UpdateLeagueDto } from './update-league.dto';
import 'reflect-metadata';

describe('UpdateLeagueDto', () => {
  it('should validate with no errors for valid data', async () => {
    const dto = new UpdateLeagueDto();
    dto.id = 'fb00f78d-a930-45b9-b810-9f12f7ea6596';
    dto.name = 'Champions League';
    dto.isActive = true;
    dto.totalMatches = 10;
    dto.participants = ['user-uuid'];
    dto.createdAt = new Date('2023-10-28T09:08:06.757Z');

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation when id is not a valid UUID', async () => {
    const dto = new UpdateLeagueDto();
    dto.id = 'invalid-uuid';
    dto.name = 'Champions League';
    dto.isActive = true;
    dto.totalMatches = 10;
    dto.participants = ['user-uuid'];
    dto.createdAt = new Date('2023-10-28T09:08:06.757Z');

    const errors = await validate(dto);
    expect(errors).not.toHaveLength(0);
    const idError = errors.find((error) => error.property === 'id');
    expect(idError).toBeDefined();
    expect(idError.constraints.isUuid).toBeDefined();
  });

  it('should fail validation when name is empty', async () => {
    const dto = new UpdateLeagueDto();
    dto.name = '';
    dto.id = 'fb00f78d-a930-45b9-b810-9f12f7ea6596';
    dto.isActive = true;
    dto.totalMatches = 10;
    dto.participants = ['user-uuid'];
    dto.createdAt = new Date('2023-10-28T09:08:06.757Z');

    const errors = await validate(dto);
    expect(errors).not.toHaveLength(0);
    const idError = errors.find((error) => error.property === 'name');
    expect(idError.constraints.isNotEmpty).toBeDefined();
  });

  it('should fail validation when totalMatches is negative', async () => {
    const dto = new UpdateLeagueDto();
    dto.totalMatches = -1;
    dto.id = 'fb00f78d-a930-45b9-b810-9f12f7ea6596';
    dto.name = 'Champions League';
    dto.isActive = true;
    dto.participants = ['user-uuid'];
    dto.createdAt = new Date('2023-10-28T09:08:06.757Z');

    const errors = await validate(dto);
    expect(errors).not.toHaveLength(0);
    const idError = errors.find((error) => error.property === 'totalMatches');
    expect(idError.constraints).toBeDefined();
    expect(idError.constraints.min).toBeDefined();
  });

  it('should fail validation when participants is not an array of strings', async () => {
    const dto = new UpdateLeagueDto();
    dto.participants = {} as any;
    dto.id = 'fb00f78d-a930-45b9-b810-9f12f7ea6596';
    dto.name = 'Champions League';
    dto.isActive = true;
    dto.totalMatches = 10;
    dto.createdAt = new Date('2023-10-28T09:08:06.757Z');

    const errors = await validate(dto);
    expect(errors).not.toHaveLength(0);
    const idError = errors.find((error) => error.property === 'participants');
    expect(idError.constraints.isArray).toBeDefined();
  });

  it('should fail validation when createdAt is not a date', async () => {
    const dto = new UpdateLeagueDto();
    dto.createdAt = 'not-a-date' as any;
    dto.id = 'fb00f78d-a930-45b9-b810-9f12f7ea6596';
    dto.name = 'Champions League';
    dto.isActive = true;
    dto.totalMatches = 10;
    dto.participants = ['user-uuid'];

    const errors = await validate(dto);
    expect(errors).not.toHaveLength(0);
    const idError = errors.find((error) => error.property === 'createdAt');
    expect(idError.constraints.isDate).toBeDefined();
  });
});
