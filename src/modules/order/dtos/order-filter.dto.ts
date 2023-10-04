import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ETypeOfTime } from '../interfaces';

export class OrderFilterDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ETypeOfTime)
  typeOfTime: ETypeOfTime;
}
