import { EPaymentMethod } from '@database/schemas/types/payment-method.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';

class ItemDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId({ each: true })
  product: string;

  @ApiProperty()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  price: number;
}

export class CreateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  shippingAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  subTotal: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  shippingFree: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: ItemDto[];

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(EPaymentMethod)
  paymentMethod: EPaymentMethod;
}
