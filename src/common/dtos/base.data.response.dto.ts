import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsMongoId } from 'class-validator';

export abstract class BaseDataResponseDto {
  @ApiResponseProperty()
  @Expose({ name: 'id' })
  @IsMongoId()
  @Transform((data) => (data.obj._id ? data.obj._id.toString() : data.value))
  _id: string;

  @ApiResponseProperty()
  @Expose()
  createdAt: Date;

  @ApiResponseProperty()
  @Expose()
  updatedAt: Date;
}
