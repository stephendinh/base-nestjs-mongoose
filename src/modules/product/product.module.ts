import { Module } from '@nestjs/common';
import { ProductController } from './controllers/products.controller';
import { ProductRepository } from './repositories/products.repository';
import { ProductService } from './services/products.services';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '@database/schemas/product.schema';
import { ProductItemService } from './services/product-item-sevices';
import { ProductItemRepo } from './repositories/product-item.repository';
import {
  ProductItem,
  ProductItemSchema,
} from '@database/schemas/product-Item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: ProductItem.name, schema: ProductItemSchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductItemService,
    ProductRepository,
    ProductItemRepo,
  ],
})
export class ProductModule {}
