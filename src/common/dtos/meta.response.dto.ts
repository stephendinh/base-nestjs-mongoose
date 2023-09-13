import { ApiResponseProperty } from '@nestjs/swagger';
import { PaginationResponseDto } from './pagination.response.dto';
import {
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class MetaResponseDto {
  @ApiResponseProperty({ type: PaginationResponseDto })
  @IsOptional()
  @ValidateNested()
  pagination?: PaginationResponseDto;

  @ApiResponseProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiResponseProperty()
  @IsOptional()
  @IsBoolean()
  isCachingData: boolean;

  @ApiResponseProperty()
  @IsDate()
  timestamp: Date;
}
