import { IsNotEmpty, IsOptional } from 'class-validator';

export class JoinRoomInput {
  @IsOptional()
  token: string;

  @IsNotEmpty()
  room: string;
}
