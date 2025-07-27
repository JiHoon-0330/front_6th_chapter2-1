// 시간 관련 상수
export const TIMING = {
  LIGHTNING_DELAY_MAX: 10000,
  LIGHTNING_INTERVAL: 30000,
  SUGGEST_INTERVAL: 60000,
  SUGGEST_DELAY_MAX: 20000,
};

// 할인율 상수
export const DISCOUNT_RATES = {
  LIGHTNING_SALE: 0.2, // 20%
  SUGGEST_SALE: 0.05, // 5%
  BULK_PURCHASE: 0.25, // 25%
  TUESDAY_SPECIAL: 0.1, // 10%
};

// 수량 기준 상수
export const QUANTITY_THRESHOLDS = {
  INDIVIDUAL_DISCOUNT: 10,
  BULK_PURCHASE: 30,
  BONUS_20: 20,
  BONUS_10: 10,
};

// 포인트 상수
export const POINTS = {
  BASE_RATE: 1000, // 1000원당 1포인트
  TUESDAY_MULTIPLIER: 2, // 화요일 2배
  KEYBOARD_MOUSE_SET: 50, // 키보드+마우스 세트
  FULL_SET: 100, // 풀세트
  BULK_30: 100, // 30개+
  BULK_20: 50, // 20개+
  BULK_10: 20, // 10개+
};

// 재고 관련 상수
export const STOCK = {
  LOW_STOCK_THRESHOLD: 5, // 5개 미만 재고 부족
  TOTAL_LOW_STOCK: 50, // 전체 재고 50개 미만
};

// 요일 상수
export const DAYS = {
  TUESDAY: 2,
};
