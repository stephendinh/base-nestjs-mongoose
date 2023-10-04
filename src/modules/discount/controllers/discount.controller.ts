import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DiscountService } from '../services/discount.service';
import { DiscountResponseDto } from '../dtos/discount-response.dto';
import { ApiResponse } from '@common/decorators/api-response.decorator';
import { DiscountParamsDto } from '../dtos/discount-param.dto';
import { QueryOptionsRequestDto } from '@common/dtos/query-options.request.dto';
import { FindAllDiscountDto } from '../dtos/find-all-discount.dto';

@ApiTags('Discount')
@ApiBearerAuth()
@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @ApiOperation({ summary: 'create a discount' })
  @ApiResponse(DiscountResponseDto)
  @Post()
  async createDiscount(@Body() createDiscountDto: DiscountParamsDto) {
    return this.discountService.createDiscount(createDiscountDto);
  }

  @ApiOperation({ summary: 'create a discount' })
  @ApiResponse([DiscountResponseDto])
  @Get()
  async getListDiscount(
    @Query() query: FindAllDiscountDto,
    @Query() options: QueryOptionsRequestDto,
  ) {
    const discounts = await this.discountService.findAllProducts(
      query,
      options,
    );
    return discounts;
  }
}
