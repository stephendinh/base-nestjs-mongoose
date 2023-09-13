import { PaginationResponseDto } from '@common/dtos/pagination.response.dto';
import { QueryOptionsRequestDto } from '@common/dtos/query-options.request.dto';
import { FilterQuery, ProjectionType, QueryOptions, Types } from 'mongoose';

export interface BaseRepositoryInterface<T> {
  create(dto: T | any): Promise<T>;

  findOneById(
    id: Types.ObjectId | string,
    projection?: ProjectionType<T>,
  ): Promise<T>;

  findOneByConditions(
    conditions?: FilterQuery<T>,
    projection?: ProjectionType<T>,
  ): Promise<T>;

  findAll(
    conditions?: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<Array<T>>;

  update(id: Types.ObjectId | string, dto: Partial<T>): Promise<T>;

  softDelete(id: Types.ObjectId | string): Promise<boolean>;

  permanentlyDelete(id: Types.ObjectId | string): Promise<boolean>;

  paginate<T>(
    conditions?: FilterQuery<T>,
    options?: QueryOptionsRequestDto,
  ): Promise<{ data: T[]; spec: PaginationResponseDto }>;
}
