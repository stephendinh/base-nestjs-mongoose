import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { EPaymentMethod } from './types/payment-method.enum';
import { EOrderStatus } from './types/shipping-status.enum';
import { User } from './user.schema';
import { ProductItem } from './product-Item.schema';
import { BaseDocument } from './types/document.base';

export declare type OrderDocument = Order & BaseDocument;

export class ItemOrder {
  @Prop({ required: true, type: Types.ObjectId, ref: ProductItem.name })
  product: ProductItem;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;
}

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ required: true, enum: EPaymentMethod, default: EPaymentMethod.CASH })
  paymentMethod: EPaymentMethod;

  @Prop({ required: true })
  shippingAddress: string;

  @Prop()
  shippingFree: number;

  @Prop({ enum: EOrderStatus, default: EOrderStatus.PENDING })
  status: EOrderStatus;

  @Prop({ type: Types.ObjectId, ref: User.name })
  user: User;

  @Prop({ required: true })
  subTotal: number;

  @Prop()
  items: ItemOrder[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
