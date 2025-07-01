import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';
import { DiscountCategory } from '../interfaces/discount-category.enum';
import { DiscountType} from '../interfaces/discount-type.enum'

export class CartItem {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  category: string;
}

export class Campaign {
  @IsString()
  name: string;

  @IsEnum(DiscountCategory)
  category: DiscountCategory; // Coupon | On Top | Seasonal

  @IsEnum(DiscountType)
  discountType: DiscountType; // Fixed | Percentage

  @IsNumber()
  value: number;

  @IsString()
  itemCategory?: string; // For On Top Percentage

  @IsNumber()
  stepAmount?: number; // For Seasonal
}


export class ApplyDiscountDto {
  @IsArray()
  cart: CartItem[];

  @IsArray()
  campaigns: Campaign[];
}
