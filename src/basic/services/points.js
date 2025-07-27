import { QUANTITY_THRESHOLDS } from '../utils/constants';
import { calculateBasePoints, calculateTotalPoints } from '../utils/points';
import { isTuesday } from '../utils/date';
import { getProducts } from '../utils/reducer';
import { selector } from '../utils/selector';
import { html } from '../utils/html';

// 제품 세트 확인 함수
export function checkProductSet() {
  const prodList = getProducts();
  let hasKeyboard = false;
  let hasMouse = false;
  let hasMonitorArm = false;

  for (const node of selector.cartItems.children) {
    const product = prodList.find((p) => p.id === node.id);
    if (!product) continue;

    if (product.id === 'p1') {
      hasKeyboard = true;
    } else if (product.id === 'p2') {
      hasMouse = true;
    } else if (product.id === 'p3') {
      hasMonitorArm = true;
    }
  }

  return { hasKeyboard, hasMouse, hasMonitorArm };
}

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

// 보너스 포인트 표시 업데이트 함수
export function updateBonusPointsDisplay({ itemCnt, totalAmt }) {
  if (selector.cartItems.children.length === 0) {
    if (selector.loyaltyPoints) {
      selector.loyaltyPoints.style.display = 'none';
    }
    return;
  }

  // 제품 세트 확인
  const { hasKeyboard, hasMouse, hasMonitorArm } = checkProductSet();

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

  const ptsTag = selector.loyaltyPoints;
  if (ptsTag) {
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
  } else {
    console.warn('Loyalty points element not found');
  }
}
