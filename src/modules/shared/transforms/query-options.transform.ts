import { Directions } from '@common/constants/directions.constant';
import { SearchStrategy } from '@common/constants/search-strategy.constant';
import { SortOrder } from 'mongoose';

export function stringToSortObject(value: string): {
  [key: string]: SortOrder;
} {
  const sort = {};
  value = value ? JSON.parse(value) : null;
  if (value && Array.isArray(value)) {
    value.forEach((sortElement) => {
      if (
        !sortElement.property ||
        !sortElement.direction ||
        !Object.values(Directions).includes(sortElement.direction)
      )
        return;
      sort[sortElement.property] = sortElement.direction;
    });
  }
  return sort;
}

export function stringToSearchObject(value: string): { [key: string]: string } {
  const search = {};
  value = value ? JSON.parse(value) : null;
  if (value && Array.isArray(value)) {
    value.forEach((searchElement) => {
      if (!searchElement.property || !searchElement.value) return;
      search[searchElement.property] =
        searchElement.strategy === SearchStrategy.EXACT
          ? searchElement.value
          : { $regex: searchElement.value };
    });
  }
  return search;
}
