import {
  stringToSearchObject,
  stringToSortObject,
} from '@modules/shared/transforms/query-options.transform';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsObject, IsOptional, Min } from 'class-validator';
import { SortOrder } from 'mongoose';

export class QueryOptionsRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  pageSize?: number;

  @ApiPropertyOptional({
    example: `[{"property":"createdAt","direction":"asc"}]`,
  })
  @IsOptional()
  @IsObject()
  @Transform((data) => stringToSortObject(data.value))
  sort?: { [key: string]: SortOrder };

  @ApiPropertyOptional({
    example: `[{"property":"name","value":"someone","strategy":"exact"}]`,
  })
  @IsOptional()
  @IsObject()
  @Transform((data) => stringToSearchObject(data.value))
  search?: { [key: string]: string };
}
