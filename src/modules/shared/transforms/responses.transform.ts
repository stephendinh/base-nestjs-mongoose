import { AppResponseDto } from '@common/dtos/app.response.dto';
import { PaginationResponseDto } from '@common/dtos/pagination.response.dto';
import { ClassConstructor, plainToInstance } from 'class-transformer';

export function response<T extends Record<string, any>, V extends Array<any>>(
  data: {
    plain: V;
    cls?: ClassConstructor<T>;
  },
  options?: {
    pagination?: PaginationResponseDto;
    description?: string;
  },
): AppResponseDto<T[]>;

export function response<T extends Record<string, any>, V>(
  data: {
    plain: V;
    cls?: ClassConstructor<T>;
  },
  options?: {
    pagination?: PaginationResponseDto;
    description?: string;
  },
): AppResponseDto<T>;

export function response<V>(
  data: V,
  options?: {
    pagination?: PaginationResponseDto;
    description?: string;
  },
): AppResponseDto<V>;

export function response<T extends Record<string, any>, V>(
  data:
    | {
        plain: V;
        cls?: ClassConstructor<T>;
      }
    | V,
  options?: {
    pagination?: PaginationResponseDto;
    description?: string;
  },
): AppResponseDto<T | T[] | V> {
  return {
    meta: {
      pagination: options?.pagination || null,
      description: options?.description || null,
      isCachingData: false,
      timestamp: new Date(),
    },
    data:
      data instanceof Object && data.cls
        ? plainToInstance(data.cls, data.plain)
        : (data as V),
  };
}
