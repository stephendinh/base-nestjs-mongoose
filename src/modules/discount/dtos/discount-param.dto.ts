import { IsGreaterThanCurrentDate } from '@common/decorators/date/is-greater-current-date.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { Types } from 'mongoose';

export class DiscountParamsDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @Max(99.99)
  @Min(1)
  percent: number;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsMongoId({ each: true })
  products: Types.ObjectId[];

  @ApiProperty()
  @IsNotEmpty()
  @IsGreaterThanCurrentDate()
  start_date: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsGreaterThanCurrentDate()
  end_date: Date;
}
