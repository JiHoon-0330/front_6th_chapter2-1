import { TIMING, DISCOUNT_RATES } from '../utils/constants';
import {
  dispatch,
  getLastSelectedProduct,
  getProducts,
  lightningSale,
  suggestSale,
} from '../utils/reducer';
import { updateProductSelectOptions } from './productSelect';
import { updateCartItemPrices } from './cartService';

// 번개세일 타이머 시작 함수
export function startLightningSaleTimer() {
  const lightningDelay = Math.random() * TIMING.LIGHTNING_DELAY_MAX;
  setTimeout(() => {
    setInterval(function () {
      const products = getProducts();

      // 상품 목록이 비어있는 경우 처리
      if (!products || products.length === 0) {
        console.warn('No products available for lightning sale');
        return;
      }

      const luckyIdx = Math.floor(Math.random() * products.length);
      const luckyItem = products[luckyIdx];

      if (luckyItem && luckyItem.q > 0 && !luckyItem.onSale) {
        dispatch(lightningSale(luckyItem.id));
        alert(
          `⚡번개세일! ${luckyItem.name}이(가) ${DISCOUNT_RATES.LIGHTNING_SALE * 100}% 할인 중입니다!`
        );
        updateProductSelectOptions();
        updateCartItemPrices();
      }
    }, TIMING.LIGHTNING_INTERVAL);
  }, lightningDelay);
}

// 추천세일 타이머 시작 함수
export function startSuggestSaleTimer() {
  setTimeout(function () {
    setInterval(function () {
      const lastSel = getLastSelectedProduct();
      if (lastSel) {
        const products = getProducts();
        const suggest = products.find(
          (product) =>
            product.id !== lastSel && product.q > 0 && !product.suggestSale
        );
        if (suggest) {
          alert(
            `💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 ${DISCOUNT_RATES.SUGGEST_SALE * 100}% 추가 할인!`
          );
          dispatch(suggestSale(suggest.id));
          updateProductSelectOptions();
          updateCartItemPrices();
        }
      }
    }, TIMING.SUGGEST_INTERVAL);
  }, Math.random() * TIMING.SUGGEST_DELAY_MAX);
}

// 프로모션 타이머 시작 함수
export function startPromotionTimers() {
  startLightningSaleTimer();
  startSuggestSaleTimer();
}
