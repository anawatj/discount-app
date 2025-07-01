import { Module } from '@nestjs/common';
import { DiscountController } from './discount/discount.controller';
import { DiscountService } from './discount/discount.service';

@Module({
  imports: [],
  controllers: [DiscountController],
  providers: [DiscountService],
})
export class AppModule {}
