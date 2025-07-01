import { DiscountService } from '../../src/discount/discount.service';
import { DiscountCategory, DiscountType } from '../../src/discount/interfaces';

describe('DiscountService', () => {
  let service: DiscountService;

  beforeEach(() => {
    service = new DiscountService();
  });
  it('should apply Coupon percentage to specific category', () => {
    const dto = {
      cart: [
        { name: 'Shirt', price: 1000, category: 'Clothing' },
        { name: 'Laptop', price: 2000, category: 'Electronics' },
      ],
      campaigns: [
        {
          name: 'CLOTH10',
          category: DiscountCategory.COUPON,
          discountType: DiscountType.PERCENTAGE,
          value: 10,
        },
      ],
    };
    const result = service.applyDiscount(dto);
    // ลด 10% จาก 3000 = 3000-300
    expect(result).toBe(2700);
  });
  it('should apply Coupon Fixed to specific category', () => {
    const dto = {
      cart: [
        { name: 'Shirt', price: 350, category: 'Clothing' },
        { name: 'Laptop', price: 250, category: 'Electronics' },
      ],
      campaigns: [
        {
          name: 'CLOTH10',
          category: DiscountCategory.COUPON,
          discountType: DiscountType.FIXED,
          value: 50,
        },
      ],
    };
    const result = service.applyDiscount(dto);
    // ลด 50 จาก 600 = 600-50
    expect(result).toBe(550);
  });
  // ✅ กรณี On Top Percentage (ลดเฉพาะหมวด Clothing)
  it('should apply On Top percentage to specific category', () => {
    const dto = {
      cart: [
        { name: 'Shirt', price: 1000, category: 'Clothing' },
        { name: 'Laptop', price: 2000, category: 'Electronics' },
      ],
      campaigns: [
        {
          name: 'CLOTH10',
          category: DiscountCategory.ON_TOP,
          discountType: DiscountType.PERCENTAGE,
          value: 10,
          itemCategory: 'Clothing',
        },
      ],
    };
    const result = service.applyDiscount(dto);
    // ลด 10% จาก 1000 = 100 → 3000 - 100 = 2900
    expect(result).toBe(2900);
  });

  // ✅ กรณีใช้แต้ม (จำกัด 20% จากยอดเต็ม)
  it('should apply point discount capped at 20% of total', () => {
    const dto = {
      cart: [
        { name: 'Item1', price: 1000, category: 'Clothing' },
        { name: 'Item2', price: 1000, category: 'Electronics' },
      ],
      campaigns: [
        {
          name: 'CLOTH10',
          category: DiscountCategory.ON_TOP,
          discountType: DiscountType.FIXED,
          value: 500, // 20% ของ 2000 = 400 → ใช้ได้แค่ 400
        },
      ],
    };
    const result = service.applyDiscount(dto);
    expect(result).toBe(1600);
  });

  // ✅ Seasonal ลด 40 ทุก 300 บาท
  it('should apply seasonal discount for every 300 THB', () => {
    const dto = {
      cart: [
        { name: 'Item1', price: 900, category: 'Accessories' },
        { name: 'Item2', price: 600, category: 'Accessories' },
      ],
      campaigns: [
        {
          name: 'SEASON40',
          category: DiscountCategory.SEASONAL,
          discountType: DiscountType.FIXED,
          value: 40,
          stepAmount: 300,
        },
      ],
    };
    const result = service.applyDiscount(dto);
    // 900+600 = 1500 → 5 steps → 5 x 40 = 200 → 1300
    expect(result).toBe(1300);
  });

  // ✅ combo
  it('should apply On Top %, and Seasonal discounts together', () => {
    const dto = {
      cart: [
        { name: 'Shirt', price: 900, category: 'Clothing' },
        { name: 'Bag', price: 1500, category: 'Accessories' },
      ],
      campaigns: [
        {
          name: 'CLOTH10',
          category: DiscountCategory.ON_TOP,
          discountType: DiscountType.PERCENTAGE,
          value: 10,
          itemCategory: 'Clothing',
        },
        {
          name: 'SEASON40',
          category: DiscountCategory.SEASONAL,
          discountType: DiscountType.FIXED,
          value: 40,
          stepAmount: 300,
        }
      ]
    };
    const result = service.applyDiscount(dto);
    // Total = 2400
    // On Top 10% ของ 900 = 90 → 2310
    // Seasonal = 6 steps → 8 x 40 = 320 → 1990
    expect(result).toBe(2030);
  });

  // ❌ Reject multiple discount types in same category (ผิดกติกา)
  it('should throw error if multiple discount types in same category', () => {
    const dto = {
      cart: [{ name: 'Item', price: 500, category: 'Accessories' }],
      campaigns: [
        {
          name: 'COUPON10%',
          category: DiscountCategory.COUPON,
          discountType: DiscountType.PERCENTAGE,
          value: 10,
        },
        {
          name: 'COUPON50฿',
          category: DiscountCategory.COUPON,
          discountType: DiscountType.FIXED,
          value: 50,
        },
      ],
    };
    expect(() => service.applyDiscount(dto)).toThrow();
  });
});
