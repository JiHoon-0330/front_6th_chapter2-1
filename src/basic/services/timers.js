import { TIMING, DISCOUNT_RATES } from '../utils/constants';
import {
  dispatch,
  getLastSelectedProduct,
  getProducts,
  lightningSale,
  suggestSale,
} from '../utils/reducer';

// 번개세일 타이머 시작 함수
export function startLightningSaleTimer({
  updateProductSelectOptions,
  updateCartItemPrices,
}) {
  const lightningDelay = Math.random() * TIMING.LIGHTNING_DELAY_MAX;
  setTimeout(() => {
    setInterval(function () {
      const prodList = getProducts();

      // 상품 목록이 비어있는 경우 처리
      if (!prodList || prodList.length === 0) {
        console.warn('No products available for lightning sale');
        return;
      }

      const luckyIdx = Math.floor(Math.random() * prodList.length);
      const luckyItem = prodList[luckyIdx];

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
export function startSuggestSaleTimer({
  updateProductSelectOptions,
  updateCartItemPrices,
}) {
  setTimeout(function () {
    setInterval(function () {
      const lastSel = getLastSelectedProduct();
      if (lastSel) {
        const prodList = getProducts();
        const suggest = prodList.find(
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
export function startPromotionTimers({
  updateProductSelectOptions,
  updateCartItemPrices,
}) {
  startLightningSaleTimer({ updateProductSelectOptions, updateCartItemPrices });
  startSuggestSaleTimer({ updateProductSelectOptions, updateCartItemPrices });
}
