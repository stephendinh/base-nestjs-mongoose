import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

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
  @IsString()
  sort?: string;

  @ApiPropertyOptional({
    example: `[{"property":"name","value":"someone","strategy":"exact"}]`,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
