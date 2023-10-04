import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export declare type RestaurentDocument = Restaurant & Document;

class Address {
  @Prop()
  building: string;

  @Prop()
  street: string;

  @Prop()
  zipCode: string;

  @Prop()
  coord: number[];
}

@Schema({ timestamps: true })
export class Restaurant extends Document {
  @Prop()
  address: Address;

  @Prop()
  borough: string;

  @Prop()
  name: string;
}
