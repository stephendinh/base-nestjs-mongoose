import { Discount, DiscountSchema } from '@database/schemas/discount.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscountRepo } from './repositories/discount.repository';
import { DiscountService } from './services/discount.service';
import { DiscountController } from './controllers/discount.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Discount.name, schema: DiscountSchema },
    ]),
  ],
  controllers: [DiscountController],
  providers: [DiscountRepo, DiscountService],
})
export class DiscountModule {}
