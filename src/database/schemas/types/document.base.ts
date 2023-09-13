import { Prop } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';

export class BaseDocument extends Document {
  @Prop({
    type: Types.ObjectId,
    required: true,
    default: () => {
      return new Types.ObjectId();
    },
  })
  _id: ObjectId;

  @Prop({ default: null })
  deletedAt: Date;
}
