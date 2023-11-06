import { validate } from 'class-validator';
import { CreateFriendshipDto } from './create-friendship.dto';

describe('CreateFriendshipDto', () => {
  it('should validate that idUser and idFriendship are UUIDs', async () => {
    const dto = new CreateFriendshipDto();
    dto.idUser = '0dc8b593-3290-4af4-9689-2a4d9c6cd0b6';
    dto.idFriendship = '1e0f601f-c8d7-4f49-95e8-ee3098a95f9b';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if idUser is not a UUID', async () => {
    const dto = new CreateFriendshipDto();
    dto.idUser = 'not-a-uuid';
    dto.idFriendship = '1e0f601f-c8d7-4f49-95e8-ee3098a95f9b';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints.isUuid).toBeDefined();
  });

  it('should fail validation if idFriendship is not a UUID', async () => {
    const dto = new CreateFriendshipDto();
    dto.idUser = '0dc8b593-3290-4af4-9689-2a4d9c6cd0b6';
    dto.idFriendship = 'not-a-uuid';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints.isUuid).toBeDefined();
  });
});
