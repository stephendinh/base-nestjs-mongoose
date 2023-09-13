import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserStatus } from './types/user-status.enum';
import { BaseDocument } from './types/document.base';

export declare type UserDocument = User & BaseDocument;

@Schema({ timestamps: true })
export class User extends BaseDocument {
  @Prop({ required: true, trim: true, unique: true })
  email: string;

  @Prop({ required: true, trim: true })
  password: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  fullName: string;

  @Prop({ required: true, enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;
}

export const UserSchema = SchemaFactory.createForClass(User);
