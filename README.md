##### Assignment Discount

    - Discription Playtium Assignment

##### Create By Anawat Jarusiripot

##### ✅ Install dependencies

    - npm install

##### ▶️ Run server (Dev)

    - npm run start:dev

##### 🧪 Run tests

    - npm run test

##### 📊 Test coverage

    - npm run test:cov

##### 🔗 API Endpoint

#### POST /discount

### คำนวณราคาหลังหักส่วนลดทั้งหมด

## 📥 Request Payload

# json

{
"cart": [
{ "name": "Shirt", "price": 900, "category": "Clothing" },
{ "name": "Headphones", "price": 1500,"category":"Electronics" }
],
"campaigns": [
{
"name": "WELCOME10",
"category": "Coupon",
"discountType": "Percentage",
"value": 10
},
{
"name": "CLOTH10",
"category": "On Top",
"discountType": "Percentage",
"value": 10,
"itemCategory": "Clothing"
},
{
"name": "SEASONAL40",
"category": "Seasonal",
"discountType": "Fixed",
"value": 40,
"stepAmount": 300
}
]
}

## 📤 Response

# json

{
"finalPrice": 1830
}

##### 🔗 API Endpoint

#### POST /discount

### คำนวณราคาหลังหักส่วนลด discount Point

## 📥 Request Payload

# json

{
"cart": [
{ "name": "T-Shirt:", "price": 350, "category": "Clothing" },
{ "name": "Hoodie::", "price": 250, "category": "Clothing" },
{ "name": "Belt:", "price": 230, "category": "Accessories" }
],
"campaigns": [
{
"name": "WELCOME10",
"category": "On Top",
"discountType": "Fixed",
"value":68
}]
}

## 📤 Response

# json

{
"finalPrice": 762
}

##### 🔗 API Endpoint

#### POST /discount

### คำนวณราคาหลังหักส่วนลด coupon fixed

## 📥 Request Payload

# json

{
"cart": [
{ "name": "T-Shirt", "price": 350, "category": "Clothing" },
{ "name": "Hat", "price": 250, "category": "Clothing" }
],
"campaigns": [
{
"name": "WELCOME10",
"category": "Coupon",
"discountType": "Fixed",
"value":50
}]
}

## 📤 Response

# json

{
"finalPrice": 550
}

##### 📚 Campaign Object Format

#### Field Description

    - name ชื่อโปรโมชั่น
    - category COUPON | ON_TOP | SEASONAL
    - discountType FIXED | PERCENTAGE
    - value จำนวนลด (บาท หรือ %)
    - itemCategory (ใช้เฉพาะ On Top) หมวดหมู่สินค้าที่จะลด
    - stepAmount (ใช้เฉพาะ Seasonal) เช่น 300 → ลดทุก 300 บาท

##### ⚠️ Rules Validation

    - ❌ ห้ามใช้ Fixed กับ Percentage ในหมวดเดียวกัน

    - ✅ หากใช้แต้มเกิน 20% ของยอดรวม ระบบจะตัดให้ไม่เกิน

    - ✅ Seasonal ลดตามยอดสุดท้ายหลังจากใช้ Coupon + On Top แล้วเท่านั้น

##### 🧪 Example Test Case

    - expect(service.applyDiscount(data)).toBe(1830);

##### 🛠 Tech Stack

    - NestJS

    - TypeScript

    - Jest (Unit Test)

    - Class Validator / DTO

    - Swagger (optional)
