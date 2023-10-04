import { BaseDataResponseDto } from '@common/dtos/base.data.response.dto';
import { Product } from '@database/schemas/product.schema';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsArray, IsDefined, IsString } from 'class-validator';

export class DiscountResponseDto extends BaseDataResponseDto {
  @ApiResponseProperty()
  @Expose()
  @IsDefined()
  @IsString()
  name: string;

  @ApiResponseProperty()
  @Expose()
  @IsDefined()
  @IsString()
  description: string;

  @ApiResponseProperty()
  @Expose()
  @IsDefined()
  @IsString()
  percent: number;

  @ApiResponseProperty()
  @Expose()
  @IsDefined()
  @IsArray()
  @Transform((data) =>
    data.value.map((item) => {
      return item
        ? {
            id: item._id.toString(),
            ...item,
          }
        : {};
    }),
  )
  products: Product[];

  @ApiResponseProperty()
  @Expose()
  @IsDefined()
  @IsString()
  start_date: Date;

  @ApiResponseProperty()
  @Expose()
  @IsDefined()
  @IsString()
  end_date: Date;

  @ApiResponseProperty()
  @Expose()
  @IsDefined()
  @IsString()
  isActive: boolean;

  @ApiResponseProperty()
  @Expose()
  @IsDefined()
  @IsString()
  isPublish: boolean;
}
