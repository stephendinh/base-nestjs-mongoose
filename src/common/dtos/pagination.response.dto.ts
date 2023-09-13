import { ApiResponseProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber } from 'class-validator';

export class PaginationResponseDto {
  @ApiResponseProperty()
  @IsDefined()
  @IsNumber()
  currentPage: number;

  @ApiResponseProperty()
  @IsDefined()
  @IsNumber()
  pageSize: number;

  @ApiResponseProperty()
  @IsDefined()
  @IsNumber()
  total: number;
}
