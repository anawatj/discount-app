import { Body, Controller, Post } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { ApplyDiscountDto } from './dto/apply-discount.dto';

@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  calculate(@Body() dto: ApplyDiscountDto) {
    const finalPrice = this.discountService.applyDiscount(dto);
    return { finalPrice };
  }
}
