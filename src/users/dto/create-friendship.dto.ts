import { IsString } from 'class-validator';

export class CreateFriendshipDto {
  @IsString()
  idUser: string;

  @IsString()
  idFriendship: string;
}
