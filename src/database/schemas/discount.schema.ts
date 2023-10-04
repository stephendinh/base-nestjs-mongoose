import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from './product.schema';
import { BaseDocument } from './types/document.base';

export declare type DiscountDocument = Discount & BaseDocument;

@Schema({ timestamps: true })
export class Discount extends Document {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  percent: number;

  @Prop({ type: [Types.ObjectId], ref: Product.name })
  products: Product[];

  @Prop({ required: true })
  start_date: Date;

  @Prop({ required: true })
  end_date: Date;

  @Prop({ required: true, default: false })
  isActive: boolean;

  @Prop({ required: true, default: false })
  isPublish: boolean;
}

export const DiscountSchema = SchemaFactory.createForClass(Discount);
