import { UserStatus } from '@database/schemas/types/user-status.enum';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { IsDefined, IsEnum, IsMongoId, IsString } from 'class-validator';

export class UserResponseDto {
  @ApiResponseProperty()
  @Expose({ name: 'id' })
  @IsMongoId()
  @Transform((data) => (data.obj._id ? data.obj._id.toString() : data.value))
  _id: string;

  @ApiResponseProperty()
  @Expose()
  @IsDefined()
  @IsString()
  email: string;

  @IsString()
  @Exclude()
  password: string;

  @ApiResponseProperty()
  @Expose()
  @IsDefined()
  @IsString()
  firstName: string;

  @ApiResponseProperty()
  @Expose()
  @IsDefined()
  @IsString()
  lastName: string;

  @ApiResponseProperty()
  @Expose()
  @IsDefined()
  @IsString()
  fullName: string;

  @ApiResponseProperty({ enum: UserStatus })
  @Expose()
  @IsDefined()
  @IsEnum(UserStatus)
  status: UserStatus;
}
