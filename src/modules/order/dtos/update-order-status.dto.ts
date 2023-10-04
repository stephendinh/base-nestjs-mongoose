import { EOrderStatus } from '@database/schemas/types/shipping-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateOrderStatusDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(EOrderStatus)
  status: EOrderStatus;
}
