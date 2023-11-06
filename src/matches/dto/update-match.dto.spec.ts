import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateMatchDto } from './update-match.dto';

describe('UpdateMatchDto', () => {
  it('should validate a proper UpdateMatchDto without errors', async () => {
    const dto = plainToInstance(UpdateMatchDto, {
      id: '371d951d-d8b0-4912-860e-74ba0be1af56',
      leagueId: '18b0618f-1bf1-4106-993c-8b23d1cd356f',
      startTime: new Date(new Date().getTime() + 3600 * 1000), // 1 hour in the future
      isCompleted: false,
      isCancelled: false,
      teamOnePlayersIds: ['6dc29adb-517a-4a2d-ae36-0b96a4def775', 'fb00f78d-a930-45b9-b810-9f12f7ea6596'],
      teamTwoPlayersIds: ['6dc29adb-517a-4a2d-ae36-0b96a4def775', 'fb00f78d-a930-45b9-b810-9f12f7ea6596'],
      setsWonByTeamOne: 0,
      setsWonByTeamTwo: 0,
      gamesWonByTeamOne: 0,
      gamesWonByTeamTwo: 0,
    });

    const errors = await validate(dto);
    console.log(errors);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation when UUID fields are not valid UUIDs', async () => {
    const dto = plainToInstance(UpdateMatchDto, {
      id: 'not-a-valid-uuid',
      leagueId: 'also-not-a-valid-uuid',
      startTime: new Date(new Date().getTime() + 3600 * 1000), // 1 hour in the future
      isCompleted: false,
      isCancelled: false,
      teamOnePlayersIds: ['6dc29adb-517a-4a2d-ae36-0b96a4def775', 'fb00f78d-a930-45b9-b810-9f12f7ea6596'],
      teamTwoPlayersIds: ['6dc29adb-517a-4a2d-ae36-0b96a4def775', 'fb00f78d-a930-45b9-b810-9f12f7ea6596'],
      setsWonByTeamOne: 0,
      setsWonByTeamTwo: 0,
      gamesWonByTeamOne: 0,
      gamesWonByTeamTwo: 0,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(2);
  });

  // Test for startTime being in the past
  it('should fail validation when startTime is in the past', async () => {
    const dto = plainToInstance(UpdateMatchDto, {
      startTime: new Date('2000-01-01T00:00:00.000Z'),
      id: '371d951d-d8b0-4912-860e-74ba0be1af56',
      leagueId: '18b0618f-1bf1-4106-993c-8b23d1cd356f',
      isCompleted: false,
      isCancelled: false,
      teamOnePlayersIds: ['6dc29adb-517a-4a2d-ae36-0b96a4def775', 'fb00f78d-a930-45b9-b810-9f12f7ea6596'],
      teamTwoPlayersIds: ['6dc29adb-517a-4a2d-ae36-0b96a4def775', 'fb00f78d-a930-45b9-b810-9f12f7ea6596'],
      setsWonByTeamOne: 0,
      setsWonByTeamTwo: 0,
      gamesWonByTeamOne: 0,
      gamesWonByTeamTwo: 0,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
  });

  it('should fail validation if isCompleted is not a boolean', async () => {
    const dto = plainToInstance(UpdateMatchDto, {
      id: '371d951d-d8b0-4912-860e-74ba0be1af56',
      leagueId: '18b0618f-1bf1-4106-993c-8b23d1cd356f',
      isCancelled: false,
      teamOnePlayersIds: ['6dc29adb-517a-4a2d-ae36-0b96a4def775', 'fb00f78d-a930-45b9-b810-9f12f7ea6596'],
      teamTwoPlayersIds: ['6dc29adb-517a-4a2d-ae36-0b96a4def775', 'fb00f78d-a930-45b9-b810-9f12f7ea6596'],
      setsWonByTeamOne: 0,
      setsWonByTeamTwo: 0,
      gamesWonByTeamOne: 0,
      gamesWonByTeamTwo: 0,
      isCompleted: 'yes',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints.isBoolean).toBeDefined();
  });

  it('should fail validation if isCancelled is not a boolean', async () => {
    const dto = plainToInstance(UpdateMatchDto, {
      id: '371d951d-d8b0-4912-860e-74ba0be1af56',
      leagueId: '18b0618f-1bf1-4106-993c-8b23d1cd356f',
      isCompleted: false,
      teamOnePlayersIds: ['6dc29adb-517a-4a2d-ae36-0b96a4def775', 'fb00f78d-a930-45b9-b810-9f12f7ea6596'],
      teamTwoPlayersIds: ['6dc29adb-517a-4a2d-ae36-0b96a4def775', 'fb00f78d-a930-45b9-b810-9f12f7ea6596'],
      setsWonByTeamOne: 0,
      setsWonByTeamTwo: 0,
      gamesWonByTeamOne: 0,
      gamesWonByTeamTwo: 0,
      isCancelled: 'no',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints.isBoolean).toBeDefined();
  });
});

// Tests for array fields
describe('Array fields validation', () => {
  it('should fail validation if teamOnePlayersIds is not an array', async () => {
    const dto = plainToInstance(UpdateMatchDto, {
      id: '371d951d-d8b0-4912-860e-74ba0be1af56',
      leagueId: '18b0618f-1bf1-4106-993c-8b23d1cd356f',
      isCompleted: false,
      isCancelled: false,
      teamTwoPlayersIds: ['6dc29adb-517a-4a2d-ae36-0b96a4def775', 'fb00f78d-a930-45b9-b810-9f12f7ea6596'],
      setsWonByTeamOne: 0,
      setsWonByTeamTwo: 0,
      gamesWonByTeamOne: 0,
      gamesWonByTeamTwo: 0,
      teamOnePlayersIds: 'not-an-array',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints.isArray).toBeDefined();
  });

  it('should fail validation if teamTwoPlayersIds is not an array', async () => {
    const dto = plainToInstance(UpdateMatchDto, {
      id: '371d951d-d8b0-4912-860e-74ba0be1af56',
      leagueId: '18b0618f-1bf1-4106-993c-8b23d1cd356f',
      isCompleted: false,
      isCancelled: false,
      teamOnePlayersIds: ['6dc29adb-517a-4a2d-ae36-0b96a4def775', 'fb00f78d-a930-45b9-b810-9f12f7ea6596'],
      setsWonByTeamOne: 0,
      setsWonByTeamTwo: 0,
      gamesWonByTeamOne: 0,
      gamesWonByTeamTwo: 0,
      teamTwoPlayersIds: 'not-an-array',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints.isArray).toBeDefined();
  });
});

// Tests for number fields
describe('Number fields validation', () => {
  it('should fail validation if setsWonByTeamOne is not an integer', async () => {
    const dto = plainToInstance(UpdateMatchDto, {
      id: '371d951d-d8b0-4912-860e-74ba0be1af56',
      leagueId: '18b0618f-1bf1-4106-993c-8b23d1cd356f',
      isCompleted: false,
      isCancelled: false,
      teamOnePlayersIds: ['6dc29adb-517a-4a2d-ae36-0b96a4def775', 'fb00f78d-a930-45b9-b810-9f12f7ea6596'],
      teamTwoPlayersIds: ['6dc29adb-517a-4a2d-ae36-0b96a4def775', 'fb00f78d-a930-45b9-b810-9f12f7ea6596'],
      setsWonByTeamTwo: 0,
      gamesWonByTeamOne: 0,
      gamesWonByTeamTwo: 0,
      setsWonByTeamOne: 1.5,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints.isInt).toBeDefined();
  });

  it('should fail validation if setsWonByTeamTwo is not an integer', async () => {
    const dto = plainToInstance(UpdateMatchDto, {
      id: '371d951d-d8b0-4912-860e-74ba0be1af56',
      leagueId: '18b0618f-1bf1-4106-993c-8b23d1cd356f',
      isCompleted: false,
      isCancelled: false,
      teamOnePlayersIds: ['6dc29adb-517a-4a2d-ae36-0b96a4def775', 'fb00f78d-a930-45b9-b810-9f12f7ea6596'],
      teamTwoPlayersIds: ['6dc29adb-517a-4a2d-ae36-0b96a4def775', 'fb00f78d-a930-45b9-b810-9f12f7ea6596'],
      setsWonByTeamOne: 0,
      gamesWonByTeamOne: 0,
      gamesWonByTeamTwo: 0,
      setsWonByTeamTwo: 1.5,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints.isInt).toBeDefined();
  });

  it('should fail validation if gamesWonByTeamOne is not an integer', async () => {
    const dto = plainToInstance(UpdateMatchDto, {
      id: '371d951d-d8b0-4912-860e-74ba0be1af56',
      leagueId: '18b0618f-1bf1-4106-993c-8b23d1cd356f',
      isCompleted: false,
      isCancelled: false,
      teamOnePlayersIds: ['6dc29adb-517a-4a2d-ae36-0b96a4def775', 'fb00f78d-a930-45b9-b810-9f12f7ea6596'],
      teamTwoPlayersIds: ['6dc29adb-517a-4a2d-ae36-0b96a4def775', 'fb00f78d-a930-45b9-b810-9f12f7ea6596'],
      setsWonByTeamOne: 0,
      setsWonByTeamTwo: 0,
      gamesWonByTeamTwo: 0,
      gamesWonByTeamOne: 'two',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints.isInt).toBeDefined();
  });

  it('should fail validation if gamesWonByTeamTwo is not an integer', async () => {
    const dto = plainToInstance(UpdateMatchDto, {
      id: '371d951d-d8b0-4912-860e-74ba0be1af56',
      leagueId: '18b0618f-1bf1-4106-993c-8b23d1cd356f',
      isCompleted: false,
      isCancelled: false,
      teamOnePlayersIds: ['6dc29adb-517a-4a2d-ae36-0b96a4def775', 'fb00f78d-a930-45b9-b810-9f12f7ea6596'],
      teamTwoPlayersIds: ['6dc29adb-517a-4a2d-ae36-0b96a4def775', 'fb00f78d-a930-45b9-b810-9f12f7ea6596'],
      setsWonByTeamOne: 0,
      setsWonByTeamTwo: 0,
      gamesWonByTeamOne: 0,
      gamesWonByTeamTwo: 'two',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints.isInt).toBeDefined();
  });

  // Remember to test for optional fields being absent
  it('should validate successfully when optional fields are absent', async () => {
    const dto = plainToInstance(UpdateMatchDto, {
      id: '371d951d-d8b0-4912-860e-74ba0be1af56',
      leagueId: '18b0618f-1bf1-4106-993c-8b23d1cd356f',
      startTime: new Date(new Date().getTime() + 3600 * 1000), // 1 hour in the future
      isCompleted: false,
      isCancelled: false,
      teamOnePlayersIds: ['6dc29adb-517a-4a2d-ae36-0b96a4def775', 'fb00f78d-a930-45b9-b810-9f12f7ea6596'],
      teamTwoPlayersIds: ['6dc29adb-517a-4a2d-ae36-0b96a4def775', 'fb00f78d-a930-45b9-b810-9f12f7ea6596'],
      setsWonByTeamOne: 0,
      setsWonByTeamTwo: 0,
      gamesWonByTeamOne: 0,
      gamesWonByTeamTwo: 0,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation when player IDs are not valid UUIDs', async () => {
    const dto = plainToInstance(UpdateMatchDto, {
      teamOnePlayersIds: ['invalid-uuid', 'another-invalid-uuid'],
      id: '371d951d-d8b0-4912-860e-74ba0be1af56',
      leagueId: '18b0618f-1bf1-4106-993c-8b23d1cd356f',
      startTime: new Date(new Date().getTime() + 3600 * 1000), // 1 hour in the future
      isCompleted: false,
      isCancelled: false,
      teamTwoPlayersIds: ['6dc29adb-517a-4a2d-ae36-0b96a4def775', 'fb00f78d-a930-45b9-b810-9f12f7ea6596'],
      setsWonByTeamOne: 0,
      setsWonByTeamTwo: 0,
      gamesWonByTeamOne: 0,
      gamesWonByTeamTwo: 0,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
  });
});
