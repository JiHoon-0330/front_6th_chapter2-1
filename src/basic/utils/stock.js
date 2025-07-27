/**
 * 재고/품절 관련 유틸리티
 */
import { STOCK } from './constants';

/**
 * 재고 부족 여부
 */
export function isLowStock(qty) {
  return qty > 0 && qty < STOCK.LOW_STOCK_THRESHOLD;
}

/**
 * 품절 여부
 */
export function isSoldOut(qty) {
  return qty === 0;
}

/**
 * 전체 재고 부족 여부
 */
export function isTotalLowStock(totalStock) {
  return totalStock < STOCK.TOTAL_LOW_STOCK;
}
