import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from './product.schema';
import { BaseDocument } from './types/document.base';

export declare type ProductItemDocument = ProductItem & BaseDocument;

@Schema({ timestamps: true })
export class ProductItem extends Document {
  @Prop()
  color: string;

  @Prop()
  SKU: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Product' })
  product: Product;

  @Prop()
  qty_in_stock: number;

  @Prop()
  thumbnail: string;

  @Prop()
  price: number;
}
export const ProductItemSchema = SchemaFactory.createForClass(ProductItem);
