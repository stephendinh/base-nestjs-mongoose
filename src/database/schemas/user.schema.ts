import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserStatus } from './types/user-status.enum';
import { BaseDocument } from './types/document.base';
import { EUserRoles } from './types/roles.enum';

export declare type UserDocument = User & BaseDocument;

@Schema({ timestamps: true })
export class User extends BaseDocument {
  @Prop({ required: true, trim: true, unique: true })
  email: string;

  @Prop({ required: true, trim: true })
  password: string;

  @Prop({ index: true })
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ required: true, enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Prop({ required: true, default: false })
  isVerified: boolean;

  @Prop({ required: true, enum: EUserRoles, default: EUserRoles.USER })
  role: EUserRoles;
}

export const UserSchema = SchemaFactory.createForClass(User);
