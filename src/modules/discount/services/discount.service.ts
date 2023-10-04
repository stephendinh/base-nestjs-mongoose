import { Injectable, Query } from '@nestjs/common';
import { DiscountRepo } from '../repositories/discount.repository';
import { DiscountParamsDto } from '../dtos/discount-param.dto';
import { ExceptionFactory } from '@common/exceptions/exception.factory';
import { ExceptionCodes } from '@common/exceptions/constants/exception-codes.enum';
import { FindAllDiscountDto } from '../dtos/find-all-discount.dto';
import { QueryOptionsRequestDto } from '@common/dtos/query-options.request.dto';
import { AppResponseDto } from '@common/dtos/app.response.dto';
import { DiscountResponseDto } from '../dtos/discount-response.dto';
import { response } from '@modules/shared/transforms/responses.transform';

@Injectable()
export class DiscountService {
  constructor(private readonly discountRepo: DiscountRepo) {}

  async createDiscount(createDiscountDto: DiscountParamsDto) {
    const { name, description, percent, products, start_date, end_date } =
      createDiscountDto;
    const discount = await this.discountRepo.findOneByConditions({ name });
    if (discount) {
      throw ExceptionFactory.create(
        ExceptionCodes.BAD_REQUEST,
        `Discount with name ${name} already exists`,
      );
    }

    await this.discountRepo.create({
      name,
      description,
      percent,
      products,
      start_date,
      end_date,
    });
    return {
      message: 'Update success fully',
    };
  }

  async findAllProducts(
    @Query() query: FindAllDiscountDto,
    @Query() options: QueryOptionsRequestDto,
  ): Promise<AppResponseDto<DiscountResponseDto[]>> {
    const discountsResponsePagination = await this.discountRepo.paginate(
      query,
      options,
    );
    return response(
      { plain: discountsResponsePagination.data, cls: DiscountResponseDto },
      {
        pagination: discountsResponsePagination.spec,
        description: 'description',
      },
    );
  }

  //   async findDiscountToActive(): Promise<DiscountDocument[]> {
  //     const currentDate = new Date();
  //     const products = await this.discountRepo.findAll({
  //       start_date: { $gt: currentDate },
  //       start
  //     });
  //   }
}
