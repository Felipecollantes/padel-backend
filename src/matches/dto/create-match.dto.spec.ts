import { validate } from 'class-validator';
import { CreateMatchDto } from './create-match.dto';

describe('CreateMatchDto', () => {
  it('should validate leagueId is a UUID', async () => {
    const dto = new CreateMatchDto();
    dto.leagueId = 'fb00f78d-a930-45b9-b810-9f12f7ea6596';
    dto.teamOnePlayersIds = ['fb00f78d-a930-45b9-b810-9f12f7ea6596', 'fb00f78d-a930-45b9-b810-9f12f7ea6596'];
    dto.teamTwoPlayersIds = ['fb00f78d-a930-45b9-b810-9f12f7ea6596', 'fb00f78d-a930-45b9-b810-9f12f7ea6596'];
    dto.startTime = new Date('2090-10-29T17:09:49.000Z');

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation when leagueId is not a string', async () => {
    const dto = new CreateMatchDto();
    dto.leagueId = 123 as any; // intentionally wrong type
    dto.teamOnePlayersIds = ['6dc29adb-517a-4a2d-ae36-0b96a4def775', '5yu80adb-517a-4a2d-ae36-0b96a4def432'];
    dto.teamTwoPlayersIds = ['6dc29adb-517a-4a2d-ae36-0b96a4def775', '5yu80adb-517a-4a2d-ae36-0b96a4def432'];
    dto.startTime = new Date('2090-10-29T17:09:49.000Z');

    const errors = await validate(dto);
    expect(errors).not.toHaveLength(0);
    const idError = errors.find((error) => error.property === 'leagueId');
    expect(idError.constraints).toBeDefined();
    expect(idError.constraints.isUuid).toBeDefined();
  });

  it('should validate teamOnePlayersIds is an array of UUIDs', async () => {
    const dto = new CreateMatchDto();
    dto.leagueId = '18b0618f-1bf1-4106-993c-8b23d1cd356f';
    dto.teamOnePlayersIds = ['6dc29adb-517a-4a2d-ae36-0b96a4def775', 'invalid-uuid'];
    dto.teamTwoPlayersIds = ['6dc29adb-517a-4a2d-ae36-0b96a4def775', '5yu80adb-517a-4a2d-ae36-0b96a4def432'];
    dto.startTime = new Date('2023-10-29T17:09:49.000Z');

    const errors = await validate(dto);
    expect(errors).not.toHaveLength(0);
    const teamOneError = errors.find((error) => error.property === 'teamOnePlayersIds');
    expect(teamOneError).toBeDefined();
    expect(teamOneError.constraints.isUuid).toBeDefined();
  });

  it('should validate startTime is a date', async () => {
    const dto = new CreateMatchDto();
    dto.leagueId = '18b0618f-1bf1-4106-993c-8b23d1cd356f';
    dto.teamOnePlayersIds = ['6dc29adb-517a-4a2d-ae36-0b96a4def775', '5yu80adb-517a-4a2d-ae36-0b96a4def432'];
    dto.teamTwoPlayersIds = ['6dc29adb-517a-4a2d-ae36-0b96a4def775', '5yu80adb-517a-4a2d-ae36-0b96a4def432'];
    dto.startTime = 'invalid-date' as any; // intentionally wrong type

    const errors = await validate(dto);
    expect(errors).not.toHaveLength(0);
    const startTimeError = errors.find((error) => error.property === 'startTime');
    expect(startTimeError.constraints).toBeDefined();
    expect(startTimeError.constraints.isDate).toBeDefined();
  });

  it('should fail validation when leagueId is missing', async () => {
    const dto = new CreateMatchDto();
    // No setteamos el leagueId para simular que falta.
    dto.teamOnePlayersIds = ['6dc29adb-517a-4a2d-ae36-0b96a4def775', '5yu80adb-517a-4a2d-ae36-0b96a4def432'];
    dto.teamTwoPlayersIds = ['6dc29adb-517a-4a2d-ae36-0b96a4def775', '5yu80adb-517a-4a2d-ae36-0b96a4def432'];
    dto.startTime = new Date('2023-10-29T17:09:49.000Z');

    const errors = await validate(dto);
    expect(errors).not.toHaveLength(0);
    expect(errors[0].property).toBe('leagueId');
    expect(errors[0].constraints).toBeDefined();
    expect(errors[0].constraints.isUuid).toBeDefined();
  });

  it('should fail validation when teamOnePlayersIds contains non-UUIDs', async () => {
    const dto = new CreateMatchDto();
    dto.leagueId = '18b0618f-1bf1-4106-993c-8b23d1cd356f';
    dto.teamOnePlayersIds = ['invalid-uuid', 'another-invalid-uuid'];
    dto.teamTwoPlayersIds = ['6dc29adb-517a-4a2d-ae36-0b96a4def775', '5yu80adb-517a-4a2d-ae36-0b96a4def432'];
    dto.startTime = new Date('2023-10-29T17:09:49.000Z');

    const errors = await validate(dto);
    expect(errors).not.toHaveLength(0);
    expect(errors[0].property).toBe('teamOnePlayersIds');
    expect(errors[0].constraints.isUuid).toBeDefined();
  });

  it('should fail validation when startTime is in the past', async () => {
    const dto = new CreateMatchDto();
    dto.leagueId = '18b0618f-1bf1-4106-993c-8b23d1cd356f';
    dto.teamOnePlayersIds = ['6dc29adb-517a-4a2d-ae36-0b96a4def775', 'fb00f78d-a930-45b9-b810-9f12f7ea6596'];
    dto.teamTwoPlayersIds = ['6dc29adb-517a-4a2d-ae36-0b96a4def775', 'fb00f78d-a930-45b9-b810-9f12f7ea6596'];
    dto.startTime = new Date('2000-01-01T00:00:00.000Z'); // Fecha en el pasado

    const errors = await validate(dto);
    console.log(errors);
    expect(errors).not.toHaveLength(0);
    const idError = errors.find((error) => error.property === 'startTime');
    expect(idError.property).toBe('startTime');
  });
});
