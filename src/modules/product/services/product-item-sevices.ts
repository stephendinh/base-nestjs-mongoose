import { Injectable } from '@nestjs/common';
import { ProductItemRepo } from '../repositories/product-item.repository';
import { CreateProductItemDto } from '../dtos/add-product-item.dto';
import { ExceptionFactory } from '@common/exceptions/exception.factory';
import { ExceptionCodes } from '@common/exceptions/constants/exception-codes.enum';
import { ProductService } from './products.services';
import { ProductRepository } from '../repositories/products.repository';
import { response } from '@modules/shared/transforms/responses.transform';
import { ProductItemResponseDto } from '../dtos/product-item-response.dto';

@Injectable()
export class ProductItemService {
  constructor(
    private readonly productItemRepo: ProductItemRepo,
    private readonly productRepo: ProductRepository,
    private readonly productService: ProductService,
  ) {}

  async create(createProductItemDto: CreateProductItemDto, productId: string) {
    const { color, SKU, qty_in_stock, thumbnail, price } = createProductItemDto;

    const product = await this.productService.findProductById(productId);
    if (!product) {
      throw ExceptionFactory.create(
        ExceptionCodes.DOCUMENT_NOT_FOUND,
        `product with id ${productId} is not found`,
      );
    }

    const item = await this.productItemRepo.findOneByConditions({
      color,
      product: productId,
    });

    if (item) {
      throw ExceptionFactory.create(
        ExceptionCodes.BAD_REQUEST,
        `product has already had color ${color}`,
      );
    }
    const productItems = product.data.productItems;

    const newProductItem = await this.productItemRepo.create({
      SKU,
      qty_in_stock,
      thumbnail,
      price,
      color,
      product: product.data._id,
    });
    productItems.push(newProductItem._id);

    const updatedProduct = await this.productRepo.update(product.data._id, {
      productItems: productItems,
    });

    return response({ plain: updatedProduct, cls: ProductItemResponseDto });
  }
}
