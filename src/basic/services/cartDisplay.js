import { QUANTITY_THRESHOLDS, POINTS } from '../utils/constants';
import { createDiscountInfo } from '../utils/percentage';
import { isTuesday } from '../utils/date';
import { selector } from '../utils/selector';
import { html } from '../utils/html';

// 장바구니 요약 상세 정보 업데이트 함수
export function updateCartSummary(
  itemCnt,
  subTot,
  finalTotalAmt,
  itemDiscounts,
  products
) {
  const summaryDetails = selector.summaryDetails;
  summaryDetails.innerHTML = '';

  if (subTot > 0) {
    const cartItems = selector.cartItems.children;
    Array.from(cartItems).forEach((cartItem) => {
      const curItem = products.find((product) => product.id === cartItem.id);
      const qtyElem = cartItem.querySelector('.quantity-number');
      const q = parseInt(qtyElem.textContent);
      const itemTotal = curItem.val * q;
      summaryDetails.innerHTML += html`
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${curItem.name} x ${q}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    });

    summaryDetails.innerHTML += html`
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subTot.toLocaleString()}</span>
      </div>
    `;

    // 할인 정보 표시
    if (itemCnt >= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
      summaryDetails.innerHTML += html`
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs"
            >🎉 대량구매 할인 (${QUANTITY_THRESHOLDS.BULK_PURCHASE}개
            이상)</span
          >
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else if (itemDiscounts.length > 0) {
      itemDiscounts.forEach(function (item) {
        summaryDetails.innerHTML += html`
          <div
            class="flex justify-between text-sm tracking-wide text-green-400"
          >
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }

    if (isTuesday) {
      if (finalTotalAmt > 0) {
        summaryDetails.innerHTML += html`
          <div
            class="flex justify-between text-sm tracking-wide text-purple-400"
          >
            <span class="text-xs">🌟 화요일 추가 할인</span>
            <span class="text-xs">-10%</span>
          </div>
        `;
      }
    }

    summaryDetails.innerHTML += html`
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }
}

// 총 금액 업데이트 함수
export function updateCartTotal(finalTotalAmt) {
  const sum = selector.cartTotal;
  if (!sum) {
    console.warn('Cart total element not found');
    return;
  }

  const totalDiv = sum.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = `₩${Math.round(finalTotalAmt).toLocaleString()}`;
  } else {
    console.warn('Total div element not found within cart total');
  }
}

// 포인트 정보 업데이트 함수
export function updateLoyaltyPoints(finalTotalAmt) {
  const loyaltyPointsDiv = selector.loyaltyPoints;
  if (!loyaltyPointsDiv) {
    console.warn('Loyalty points element not found');
    return;
  }

  const points = Math.floor(finalTotalAmt / POINTS.BASE_RATE);
  if (points > 0) {
    loyaltyPointsDiv.textContent = `적립 포인트: ${points}p`;
    loyaltyPointsDiv.style.display = 'block';
  } else {
    loyaltyPointsDiv.textContent = '적립 포인트: 0p';
    loyaltyPointsDiv.style.display = 'block';
  }
}

// 할인 정보 업데이트 함수
export function updateDiscountInfo(discRate, finalTotalAmt, originalTotal) {
  const discountInfoDiv = selector.discountInfo;
  discountInfoDiv.innerHTML = '';
  if (discRate > 0 && finalTotalAmt > 0) {
    const discountInfo = createDiscountInfo(originalTotal, discRate);
    discountInfoDiv.innerHTML = html`
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400"
            >총 할인율</span
          >
          <span class="text-sm font-medium text-green-400"
            >${discountInfo.discountRateFormatted}</span
          >
        </div>
        <div class="text-2xs text-gray-300">
          ₩${Math.round(discountInfo.discountAmount).toLocaleString()}
          할인되었습니다
        </div>
      </div>
    `;
  }
}

// 헤더 아이템 카운트 업데이트 함수
export function updateHeaderItemCount(itemCnt) {
  const itemCountElement = selector.headerItemCount;
  if (itemCountElement) {
    const previousCount = parseInt(
      itemCountElement.textContent.match(/\d+/) || 0
    );
    itemCountElement.textContent = `🛍️ ${itemCnt} items in cart`;
    if (previousCount !== itemCnt) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }
}

// 장바구니 표시 업데이트 함수
export function updateCartDisplay(
  itemCnt,
  subTot,
  finalTotalAmt,
  discRate,
  originalTotal,
  itemDiscounts,
  products
) {
  // 헤더 아이템 카운트 업데이트
  updateHeaderItemCount(itemCnt);

  // 요약 상세 정보 업데이트
  updateCartSummary(itemCnt, subTot, finalTotalAmt, itemDiscounts, products);

  // 총 금액 업데이트
  updateCartTotal(finalTotalAmt);

  // 포인트 정보 업데이트
  updateLoyaltyPoints(finalTotalAmt);

  // 할인 정보 업데이트
  updateDiscountInfo(discRate, finalTotalAmt, originalTotal);
}
