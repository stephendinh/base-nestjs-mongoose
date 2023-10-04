import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class TestSocketDto {
  @ApiProperty()
  @IsOptional()
  mEvent?: string;

  @ApiProperty()
  @IsOptional()
  id?: string;

  @ApiProperty()
  @IsNotEmpty()
  data: string;
}
