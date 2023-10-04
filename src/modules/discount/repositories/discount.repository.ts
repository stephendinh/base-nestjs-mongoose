import { PaginationResponseDto } from '@common/dtos/pagination.response.dto';
import { QueryOptionsRequestDto } from '@common/dtos/query-options.request.dto';
import { Discount, DiscountDocument } from '@database/schemas/discount.schema';
import { BaseRepository } from '@modules/shared/base/repository.base';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType } from 'mongoose';

@Injectable()
export class DiscountRepo extends BaseRepository<DiscountDocument> {
  constructor(
    @InjectModel(Discount.name)
    private readonly discountModel: Model<DiscountDocument>,
  ) {
    super(discountModel);
  }
  async findOneByConditions(
    conditions: FilterQuery<DiscountDocument> = {},
    projection?: ProjectionType<DiscountDocument>,
  ): Promise<DiscountDocument> {
    const document = await this.discountModel.findOne(
      { ...conditions, deletedAt: null },
      projection,
      { lean: true },
    );

    return document as DiscountDocument;
  }

  async paginate<T>(
    conditions?: FilterQuery<T>,
    queryOptions?: QueryOptionsRequestDto,
  ): Promise<{ data: T[]; spec: PaginationResponseDto }> {
    const { page, pageSize, sort, search } = queryOptions;
    if (!page || (pageSize !== 0 && !pageSize)) {
      throw new InternalServerErrorException(
        `Use findAll() instead of paginate()`,
      );
    }

    const documents = this.discountModel
      .find({ ...conditions, ...search })
      .populate('products');
    const total = await documents.clone().countDocuments();

    if (pageSize >= 1) {
      documents.limit(pageSize);
      if (page >= 0) documents.skip((page - 1) * pageSize);
    }
    documents.sort(sort);

    return {
      data: await documents.lean(),
      spec: {
        currentPage: page,
        pageSize: pageSize,
        total,
      },
    };
  }
}
