// 서비스 import
import { initializeUI, initializeAppState } from './services/initialization';
import { startPromotionTimers } from './services/timers';
import { updateProductSelectOptions } from './services/productSelect';
import {
  updateCartAndDisplay,
  updateCartItemPrices,
} from './services/cartService';
import { addItemToCart, handleQuantityChange } from './services/cartOperations';

// 메인 함수
function main() {
  initializeUI({
    addItemToCart: () => addItemToCart({ updateCartAndDisplay }),
    handleQuantityChange: (event) =>
      handleQuantityChange(event, {
        updateCartAndDisplay,
        updateProductSelectOptions,
      }),
  });
  initializeAppState({ updateProductSelectOptions, updateCartAndDisplay });
  startPromotionTimers({ updateProductSelectOptions, updateCartItemPrices });
}

// 앱 시작
main();
