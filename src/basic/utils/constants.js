// 타이밍 관련 상수
export const TIMING = {
  LIGHTNING_DELAY_MAX: 10000,
  LIGHTNING_INTERVAL: 30000,
  SUGGEST_DELAY_MAX: 15000,
  SUGGEST_INTERVAL: 45000,
};

// 할인율 관련 상수
export const DISCOUNT_RATES = {
  LIGHTNING_SALE: 0.2,
  SUGGEST_SALE: 0.1,
  BULK_PURCHASE: 0.25,
  TUESDAY_SPECIAL: 0.1,
};

// 수량 임계값 관련 상수
export const QUANTITY_THRESHOLDS = {
  INDIVIDUAL_DISCOUNT: 10,
  BULK_PURCHASE: 30,
  BONUS_20: 20,
  BONUS_10: 10,
};

// 포인트 관련 상수
export const POINTS = {
  BASE_RATE: 1000,
  KEYBOARD_MOUSE_SET: 50,
  FULL_SET: 100,
  BULK_PURCHASE_30: 100,
  BULK_PURCHASE_20: 50,
  BULK_PURCHASE_10: 20,
};

// 제품 ID 상수
export const PRODUCT_IDS = {
  KEYBOARD: 'p1',
  MOUSE: 'p2',
  MONITOR_ARM: 'p3',
  LAPTOP_POUCH: 'p4',
  SPEAKER: 'p5',
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
