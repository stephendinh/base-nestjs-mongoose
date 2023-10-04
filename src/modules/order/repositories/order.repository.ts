import { PaginationResponseDto } from '@common/dtos/pagination.response.dto';
import { QueryOptionsRequestDto } from '@common/dtos/query-options.request.dto';
import { Order, OrderDocument } from '@database/schemas/order.schema';
import { ProductItem } from '@database/schemas/product-Item.schema';
import { BaseRepository } from '@modules/shared/base/repository.base';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { ETypeOfTime } from '../interfaces';

@Injectable()
export class OrderRepository extends BaseRepository<OrderDocument> {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
  ) {
    super(orderModel);
  }
  async paginate<T>(
    conditions?: FilterQuery<OrderDocument>,
    queryOptions?: QueryOptionsRequestDto,
  ): Promise<{ data: T[]; spec: PaginationResponseDto }> {
    const { page, pageSize, sort, search } = queryOptions;
    if (!page || (pageSize !== 0 && !pageSize)) {
      throw new InternalServerErrorException(
        `Use findAll() instead of paginate()`,
      );
    }

    const documents = this.orderModel
      .find({ ...conditions, ...search })
      .populate('user', '_id firstName lastName email')
      .populate({
        path: 'items',
        populate: {
          path: 'product',
          model: ProductItem.name,
        },
      });
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

  async totalOrderUserByTime(userId: string, typeOfTime: ETypeOfTime) {
    let group = { _id: {} };
    switch (typeOfTime) {
      case ETypeOfTime.month:
        group = {
          _id: {
            month: '$month',
          },
        };
        break;
      case ETypeOfTime.week:
        group = {
          _id: {
            week: '$week',
          },
        };
        break;
      case ETypeOfTime.week:
        group = {
          _id: {
            year: '$year',
          },
        };
        break;
    }
    return this.orderModel.aggregate([
      {
        $match: { user: userId, status: 'processing' },
      },
      {
        $project: {
          _id: 1,
          status: 1,
          subTotal: 1,
          week: { $week: '$createdAt' },
          month: { $month: '$createdAt' },
        },
      },
      {
        $group: {
          _id: group._id,
          totalOrderAmount: { $sum: '$subTotal' },
        },
      },
      {
        $project: {
          _id: 0,
          week: '$_id.week',
          month: '$_id.month',
          year: '$_id.year',
          totalOrderAmount: 1,
        },
      },
      {
        $sort: {
          year: 1,
          month: 1,
          week: 1,
        },
      },
    ]);
  }
}
