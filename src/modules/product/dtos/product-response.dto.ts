import { BaseDataResponseDto } from '@common/dtos/base.data.response.dto';
import { ProductItem } from '@database/schemas/product-Item.schema';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsDefined, IsArray } from 'class-validator';

export class ProductResponseDto extends BaseDataResponseDto {
  @ApiResponseProperty()
  @Expose()
  name: string;

  @ApiResponseProperty()
  @Expose()
  brand: string;

  @ApiResponseProperty()
  @Expose()
  description: string;

  @ApiResponseProperty()
  @Expose()
  thumbnail: string;

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
  productItems: ProductItem[];
}
