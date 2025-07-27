import { POINTS, QUANTITY_THRESHOLDS } from './constants';
import { isTuesday } from './date';

export function calculateBasePoints(amount) {
  return Math.floor(amount / POINTS.BASE_RATE);
}

/**
 * 화요일 포인트 2배 적용
 */
export function applyTuesdayBonus(basePoints, date = new Date()) {
  return isTuesday(date) ? basePoints * POINTS.TUESDAY_MULTIPLIER : basePoints;
}

/**
 * 세트/대량구매 등 추가 포인트 계산
 */
export function calculateExtraPoints({
  itemCnt,
  hasKeyboard,
  hasMouse,
  hasMonitorArm,
}) {
  let extra = 0;
  if (hasKeyboard && hasMouse) extra += POINTS.KEYBOARD_MOUSE_SET;
  if (hasKeyboard && hasMouse && hasMonitorArm) extra += POINTS.FULL_SET;
  if (itemCnt >= QUANTITY_THRESHOLDS.BULK_PURCHASE) extra += POINTS.BULK_30;
  else if (itemCnt >= QUANTITY_THRESHOLDS.BONUS_20) extra += POINTS.BULK_20;
  else if (itemCnt >= QUANTITY_THRESHOLDS.BONUS_10) extra += POINTS.BULK_10;
  return extra;
}

/**
 * 최종 포인트 계산
 */
export function calculateTotalPoints({
  amount,
  itemCnt,
  hasKeyboard,
  hasMouse,
  hasMonitorArm,
  date = new Date(),
}) {
  const base = calculateBasePoints(amount);
  const tuesday = applyTuesdayBonus(base, date);
  const extra = calculateExtraPoints({
    itemCnt,
    hasKeyboard,
    hasMouse,
    hasMonitorArm,
  });
  return tuesday + extra;
}
