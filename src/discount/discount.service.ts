import { Injectable, BadRequestException } from '@nestjs/common';
import { ApplyDiscountDto, Campaign, CartItem } from './dto/index';
import { DiscountCategory, DiscountType } from './interfaces/index';

@Injectable()
export class DiscountService {
  applyDiscount(dto: ApplyDiscountDto): number {
    const { cart, campaigns } = dto;

    // 1️⃣ เช็กว่าตะกร้ามีสินค้า
    if (!cart?.length) throw new BadRequestException('Cart is empty');

    // 2️⃣ ยอดรวมก่อนลด
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    let currentTotal = total;

    // 3️⃣ ลำดับการใช้ส่วนลด
    const orderedCategories: DiscountCategory[] = [
      DiscountCategory.COUPON,
      DiscountCategory.ON_TOP,
      DiscountCategory.SEASONAL,
    ];

    // 4️⃣ วนทีละหมวดส่วนลด (ตามลำดับ)
    for (const category of orderedCategories) {
      const applicable = campaigns.filter((c) => c.category === category);
      if (!applicable.length) continue;

      // 🚫 ห้ามใช้ Fixed และ Percentage พร้อมกันในหมวดเดียว
      const types = new Set(applicable.map((c) => c.discountType));
      if (types.size > 1) {
        throw new BadRequestException(
          `Cannot apply multiple discount types in ${category}`,
        );
      }

      for (const campaign of applicable) {
        // 🟢 On Top แบบ % → ลดเฉพาะหมวดหมู่สินค้า
        if (
          category === DiscountCategory.ON_TOP &&
          campaign.discountType === DiscountType.PERCENTAGE &&
          campaign.itemCategory
        ) {
          const categoryTotal = cart
            .filter((i) => i.category === campaign.itemCategory)
            .reduce((sum, i) => sum + i.price, 0);
          const discount = categoryTotal * (campaign.value / 100);
          currentTotal -= discount;
        } else if (
          category === DiscountCategory.ON_TOP &&
          campaign.discountType == DiscountType.FIXED
        ) {
          /// Fixed On Top Discount Point
          const maxPointDiscount = total * 0.2;
          const pointDiscount = Math.min(campaign.value, maxPointDiscount);
          currentTotal -= pointDiscount;
        }
        // 🟡 Fixed Discount (เช่น ลด 100 บาท)
        else if (campaign.discountType === DiscountType.FIXED) {
          // 💡 Seasonal แบบ Step เช่น "ลด 40 ทุก 300"
          if (category === DiscountCategory.SEASONAL && campaign.stepAmount) {
            const steps = Math.floor(currentTotal / campaign.stepAmount);
            const discount = steps * campaign.value;
            currentTotal -= discount;
          } else {
            currentTotal -= campaign.value;
          }
        }

        // 🔵 Percentage discount ปกติ (ลดทั้งตะกร้า)
        else if (campaign.discountType === DiscountType.PERCENTAGE) {
          currentTotal -= currentTotal * (campaign.value / 100);
        }

        // ✂️ ห้ามติดลบ
        if (currentTotal < 0) currentTotal = 0;
      }
    }
    // ✂️ ห้ามติดลบอีกครั้ง
    if (currentTotal < 0) currentTotal = 0;

    return currentTotal;
  }
}
