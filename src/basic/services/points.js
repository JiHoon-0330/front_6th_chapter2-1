import { PRODUCT_IDS, QUANTITY_THRESHOLDS } from '../utils/constants';
import { calculateBasePoints, calculateTotalPoints } from '../utils/points';
import { isTuesday } from '../utils/date';
import { selector } from '../utils/selector';
import { html } from '../utils/html';
import { hasProducts } from './cartOperations';

// 보너스 포인트 계산 함수
export function calculateBonusPoints(
  totalAmt,
  itemCnt,
  hasKeyboard,
  hasMouse,
  hasMonitorArm
) {
  return calculateTotalPoints({
    amount: totalAmt,
    itemCnt,
    hasKeyboard,
    hasMouse,
    hasMonitorArm,
  });
}

// 포인트 상세 정보 생성 함수
export function generatePointsDetail(
  totalAmt,
  itemCnt,
  hasKeyboard,
  hasMouse,
  hasMonitorArm
) {
  const pointsDetail = [];
  const basePoints = calculateBasePoints(totalAmt);

  if (basePoints > 0) {
    pointsDetail.push(`기본: ${basePoints}p`);
  }

  if (isTuesday() && basePoints > 0) {
    pointsDetail.push('화요일 2배');
  }

  if (hasKeyboard && hasMouse) {
    pointsDetail.push('키보드+마우스 세트 +50p');
  }
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    pointsDetail.push('풀세트 구매 +100p');
  }
  if (itemCnt >= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
    pointsDetail.push('대량구매(30개+) +100p');
  } else if (itemCnt >= QUANTITY_THRESHOLDS.BONUS_20) {
    pointsDetail.push('대량구매(20개+) +50p');
  } else if (itemCnt >= QUANTITY_THRESHOLDS.BONUS_10) {
    pointsDetail.push('대량구매(10개+) +20p');
  }

  return pointsDetail;
}

// 포인트 계산 비즈니스 로직
export function calculatePointsForDisplay({ itemCnt, totalAmt }) {
  if (selector.cartItems.children.length === 0) {
    return { finalPoints: 0, pointsDetail: [] };
  }

  const [hasKeyboard, hasMouse, hasMonitorArm] = hasProducts(
    PRODUCT_IDS.KEYBOARD,
    PRODUCT_IDS.MOUSE,
    PRODUCT_IDS.MONITOR_ARM
  );

  // 포인트 계산
  const finalPoints = calculateBonusPoints(
    totalAmt,
    itemCnt,
    hasKeyboard,
    hasMouse,
    hasMonitorArm
  );

  // 포인트 상세 정보 생성
  const pointsDetail = generatePointsDetail(
    totalAmt,
    itemCnt,
    hasKeyboard,
    hasMouse,
    hasMonitorArm
  );

  return { finalPoints, pointsDetail };
}

// 포인트 UI 업데이트 로직
export function updatePointsUI({ finalPoints, pointsDetail }) {
  const ptsTag = selector.loyaltyPoints;
  if (!ptsTag) {
    console.warn('Loyalty points element not found');
    return;
  }

  if (finalPoints > 0) {
    ptsTag.innerHTML = html`<div>
        적립 포인트: <span class="font-bold">${finalPoints}p</span>
      </div>
      <div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>`;
    ptsTag.style.display = 'block';
  } else {
    ptsTag.textContent = '적립 포인트: 0p';
    ptsTag.style.display = 'block';
  }
}

// 보너스 포인트 표시 업데이트 함수
export function updateBonusPointsDisplay({ itemCnt, totalAmt }) {
  if (selector.cartItems.children.length === 0) {
    if (selector.loyaltyPoints) {
      selector.loyaltyPoints.style.display = 'none';
    }
    return;
  }

  // 비즈니스 로직: 포인트 계산
  const { finalPoints, pointsDetail } = calculatePointsForDisplay({
    itemCnt,
    totalAmt,
  });

  // UI 로직: 포인트 표시 업데이트
  updatePointsUI({ finalPoints, pointsDetail });
}
