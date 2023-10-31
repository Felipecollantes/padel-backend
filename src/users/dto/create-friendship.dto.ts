import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFriendshipDto {
  @ApiProperty({
    default: '0dc8b593-3290-4af4-9689-2a4d9c6cd0b6',
    description: 'UUID first user',
  })
  @IsString()
  idUser: string;

  @ApiProperty({
    default: '1e0f601f-c8d7-4f49-95e8-ee3098a95f9b',
    description: 'UUID second user',
  })
  @IsString()
  idFriendship: string;
}
