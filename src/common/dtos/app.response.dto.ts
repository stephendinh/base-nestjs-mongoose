import { ApiResponseProperty } from '@nestjs/swagger';
import { IsDefined, ValidateNested } from 'class-validator';
import { MetaResponseDto } from './meta.response.dto';
export class AppResponseDto<T> {
  @ApiResponseProperty({ type: MetaResponseDto })
  @IsDefined()
  @ValidateNested()
  meta: MetaResponseDto;

  @ApiResponseProperty()
  @IsDefined()
  data: T;
}
