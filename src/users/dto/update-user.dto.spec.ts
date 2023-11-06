import { UpdateUserDto } from './update-user.dto';
import { validate } from 'class-validator';

describe('UpdateUserDto', () => {
  it('should validate current password', async () => {
    const dto = new UpdateUserDto();
    dto.currentPassword = 'NewPass@123';
    const errors = await validate(dto);
    expect(errors.find((e) => e.property === 'currentPassword')).toBeUndefined();
  });

  it('should accept boolean value for updateActive', async () => {
    const dto = new UpdateUserDto();
    dto.updateActive = true;
    const errors = await validate(dto);
    expect(errors.find((e) => e.property === 'updateActive')).toBeUndefined();
  });

  it('should accept numbers for updateElo', async () => {
    const dto = new UpdateUserDto();
    dto.updateElo = 1500;
    const errors = await validate(dto);
    expect(errors.find((e) => e.property === 'updateElo')).toBeUndefined();
  });

  it('should accept an array of strings for updateRoles', async () => {
    const dto = new UpdateUserDto();
    dto.updateRoles = ['user', 'admin'];
    const errors = await validate(dto);
    expect(errors.find((e) => e.property === 'updateRoles')).toBeUndefined();
  });

  it('should be valid when optional fields are omitted', async () => {
    const dto = new UpdateUserDto();
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should handle null values for optional fields', async () => {
    const dto = new UpdateUserDto();
    dto.updateActive = null;
    dto.updateElo = null;
    dto.updateRoles = null;
    const errors = await validate(dto);
    expect(errors.find((e) => e.property === 'updateActive')).toBeUndefined();
    expect(errors.find((e) => e.property === 'updateElo')).toBeUndefined();
    expect(errors.find((e) => e.property === 'updateRoles')).toBeUndefined();
  });

  it('should allow partial updates', async () => {
    const dto = new UpdateUserDto();
    dto.updateActive = true;
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should ignore non-updatable fields', async () => {
    const dto = new UpdateUserDto();
    (dto as any).id = 'new-id';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should handle updates to null values for optional fields', async () => {
    const dto = new UpdateUserDto();
    dto.updateActive = null;
    const errors = await validate(dto);
    expect(errors.find((e) => e.property === 'updateActive')).toBeUndefined();
  });

  //   it('should convert and validate types correctly', async () => {
  //     const dto = new UpdateUserDto();
  //     dto.updateElo = '1500' as any;
  //     const errors = await validate(dto);
  //     expect(errors.find((e) => e.property === 'updateElo')).toBeUndefined();
  //   });
});
