import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class Review extends Document {
  @Prop()
  rating: number;

  @Prop()
  comment: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  user: User;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
