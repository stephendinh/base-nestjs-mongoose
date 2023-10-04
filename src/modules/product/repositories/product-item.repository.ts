import {
  ProductItem,
  ProductItemDocument,
} from '@database/schemas/product-Item.schema';
import { BaseRepository } from '@modules/shared/base/repository.base';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType } from 'mongoose';

@Injectable()
export class ProductItemRepo extends BaseRepository<ProductItemDocument> {
  constructor(
    @InjectModel(ProductItem.name)
    private readonly productItemModel: Model<ProductItemDocument>,
  ) {
    super(productItemModel);
  }

  async findOneByConditions(
    conditions: FilterQuery<ProductItemDocument> = {},
    projection?: ProjectionType<ProductItemDocument>,
  ): Promise<ProductItemDocument> {
    const document = await this.productItemModel.findOne(
      { ...conditions, deletedAt: null },
      projection,
      { lean: true },
    );
    return document as ProductItemDocument;
  }
}
