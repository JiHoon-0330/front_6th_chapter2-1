import { getProducts } from '../utils/reducer';
import { selector } from '../utils/selector';
import { html } from '../utils/html';
import { calculateCartSummary } from './cartCalculation';
import { applyDiscounts } from './discounts';
import { updateCartDisplay } from './cartDisplay';
import { updateStockDisplay } from './stockDisplay';
import { updateBonusPointsDisplay } from './points';

// 장바구니 아이템 가격 업데이트 함수
export function updateCartItemPrices() {
  const cartItems = selector.cartItems.children;
  const products = getProducts();
  Array.from(cartItems).forEach((cartItem) => {
    const itemId = cartItem.id;
    const product = products.find((p) => p.id === itemId);
    if (product) {
      const priceDiv = cartItem.querySelector('.text-lg');
      const nameDiv = cartItem.querySelector('h3');
      if (product.onSale && product.suggestSale) {
        priceDiv.innerHTML = html`<span class="line-through text-gray-400"
            >₩${product.originalVal.toLocaleString()}</span
          >
          <span class="text-purple-600"
            >₩${product.val.toLocaleString()}</span
          >`;
        nameDiv.textContent = `⚡💝${product.name}`;
      } else if (product.onSale) {
        priceDiv.innerHTML = html`<span class="line-through text-gray-400"
            >₩${product.originalVal.toLocaleString()}</span
          >
          <span class="text-red-500">₩${product.val.toLocaleString()}</span>`;
        nameDiv.textContent = `⚡${product.name}`;
      } else if (product.suggestSale) {
        priceDiv.innerHTML = html`<span class="line-through text-gray-400"
            >₩${product.originalVal.toLocaleString()}</span
          >
          <span class="text-blue-500">₩${product.val.toLocaleString()}</span>`;
        nameDiv.textContent = `💝${product.name}`;
      } else {
        priceDiv.textContent = `₩${product.val.toLocaleString()}`;
        nameDiv.textContent = product.name;
      }
    }
  });
  updateCartAndDisplay();
}

// 장바구니 및 표시 업데이트 함수
export function updateCartAndDisplay() {
  // 장바구니 요약 정보 계산
  const cartSummary = calculateCartSummary();
  const { itemCnt, subTot, totalAmt, originalTotal, itemDiscounts, products } =
    cartSummary;

  // 할인 적용
  const discountResult = applyDiscounts(
    itemCnt,
    subTot,
    totalAmt,
    originalTotal
  );
  const { finalTotalAmt, discRate } = discountResult;

  // 장바구니 UI 업데이트
  updateCartDisplay(
    itemCnt,
    subTot,
    finalTotalAmt,
    discRate,
    originalTotal,
    itemDiscounts,
    products
  );

  // 재고 상태 표시 업데이트
  updateStockDisplay(products);

  // 보너스 포인트 렌더링
  updateBonusPointsDisplay({ itemCnt, totalAmt: finalTotalAmt });
}
