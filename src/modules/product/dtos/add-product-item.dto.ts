import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateProductItemDto {
  @ApiProperty()
  @IsNotEmpty()
  color: string;

  @ApiProperty()
  @IsNotEmpty()
  SKU: string;

  @ApiProperty()
  @IsNotEmpty()
  qty_in_stock: number;

  @ApiProperty()
  @IsNotEmpty()
  thumbnail: number;

  @ApiProperty()
  @IsNotEmpty()
  price: number;
}
