import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseDocument } from './types/document.base';
import { Document, Types } from 'mongoose';
import { ProductItem } from './product-Item.schema';
import { Review } from './product-review.schema';

export declare type ProductDocument = Product & BaseDocument;

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop()
  name: string;

  @Prop()
  brand: string;

  @Prop()
  shortBio: string;

  @Prop()
  slug: string;

  @Prop()
  description: string;

  @Prop()
  thumbnail: string;

  @Prop({ type: [Types.ObjectId], ref: Review.name })
  reviews: Review[];

  @Prop({ type: [Types.ObjectId], ref: ProductItem.name })
  productItems: ProductItem[];
}
export const ProductSchema = SchemaFactory.createForClass(Product);
