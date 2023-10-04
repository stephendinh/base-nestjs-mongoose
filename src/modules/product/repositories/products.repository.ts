import { PaginationResponseDto } from '@common/dtos/pagination.response.dto';
import { QueryOptionsRequestDto } from '@common/dtos/query-options.request.dto';
import { ExceptionCodes } from '@common/exceptions/constants/exception-codes.enum';
import { ExceptionFactory } from '@common/exceptions/exception.factory';
import { Product, ProductDocument } from '@database/schemas/product.schema';
import { BaseRepository } from '@modules/shared/base/repository.base';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, Types } from 'mongoose';

@Injectable()
export class ProductRepository extends BaseRepository<ProductDocument> {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {
    super(productModel);
  }

  async findOneByConditions(
    conditions: FilterQuery<ProductDocument> = {},
    projection?: ProjectionType<ProductDocument>,
  ): Promise<ProductDocument> {
    const document = await this.productModel.findOne(
      { ...conditions, deletedAt: null },
      projection,
      { lean: true },
    );
    return document as ProductDocument;
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

    const documents = this.productModel
      .find({ ...conditions, ...search })
      .populate('productItems');
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

  async findOneById(
    id: Types.ObjectId | string,
    projection?: ProjectionType<ProductDocument>,
  ): Promise<ProductDocument> {
    const document = await this.productModel
      .findById(id, projection, {
        lean: true,
      })
      .populate('productItems');
    if (!document || document.deletedAt) {
      throw ExceptionFactory.create(
        ExceptionCodes.DOCUMENT_NOT_FOUND,
        `${this.productModel.modelName} not found`,
      );
    }
    return document as ProductDocument;
  }
}
