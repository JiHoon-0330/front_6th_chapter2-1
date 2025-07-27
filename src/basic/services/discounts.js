import { DISCOUNT_RATES, QUANTITY_THRESHOLDS } from '../utils/constants';
import {
  calculateDiscountedPrice,
  calculateDiscountRate,
} from '../utils/percentage';
import { isTuesday } from '../utils/date';
import { selector } from '../utils/selector';

// 할인 적용 함수
export function applyDiscounts(itemCnt, subTot, totalAmt, originalTotal) {
  let discRate = 0;
  let finalTotalAmt = totalAmt;

  // 대량구매 할인 적용
  if (itemCnt >= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
    finalTotalAmt = calculateDiscountedPrice(
      subTot,
      DISCOUNT_RATES.BULK_PURCHASE
    );
    discRate = DISCOUNT_RATES.BULK_PURCHASE;
  } else {
    discRate = calculateDiscountRate(subTot, finalTotalAmt);
  }

  // 화요일 할인 적용
  const tuesdaySpecial = selector.tuesdaySpecial;
  if (isTuesday() && finalTotalAmt > 0) {
    finalTotalAmt = calculateDiscountedPrice(
      finalTotalAmt,
      DISCOUNT_RATES.TUESDAY_SPECIAL
    );
    discRate = calculateDiscountRate(originalTotal, finalTotalAmt);
    tuesdaySpecial.classList.remove('hidden');
  } else {
    tuesdaySpecial.classList.add('hidden');
  }

  return {
    finalTotalAmt,
    discRate,
  };
}
