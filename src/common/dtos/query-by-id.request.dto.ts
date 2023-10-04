import { IsMongoId, IsNotEmpty } from 'class-validator';

export class QueryByIdDto {
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}
