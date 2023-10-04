import { BaseDataResponseDto } from '@common/dtos/base.data.response.dto';
import { EPaymentMethod } from '@database/schemas/types/payment-method.enum';
import { EOrderStatus } from '@database/schemas/types/shipping-status.enum';
import { User } from '@database/schemas/user.schema';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsArray, IsDefined } from 'class-validator';

export class OrderResponseDto extends BaseDataResponseDto {
  @ApiResponseProperty()
  @Expose()
  paymentMethod: EPaymentMethod;

  @ApiResponseProperty()
  @Expose()
  shippingAddress: string;

  @ApiResponseProperty()
  @Expose()
  shippingFree: string;

  @ApiResponseProperty()
  @Expose()
  status: EOrderStatus;
  @ApiResponseProperty()
  @Expose()
  @Transform((data) => {
    return data.value
      ? {
          id: data.value._id.toString(),
          ...data.value,
        }
      : {};
  })
  user: User;

  @ApiResponseProperty()
  @Expose()
  subTotal: number;

  @ApiResponseProperty()
  @Expose()
  @IsDefined()
  @IsArray()
  @Transform((data) =>
    data.value.map((item) => {
      console.log('item123', item);
      return {
        product: {
          _id: item.product._id.toString(),
          thumbnail: item.product.thumbnail,
          color: item.product.color,
        },
        quantity: item.quantity,
        price: item.price,
      };
    }),
  )
  items: any[];
}
