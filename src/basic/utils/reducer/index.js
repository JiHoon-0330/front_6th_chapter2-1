import { productsReducer } from './products';
import { selectionReducer } from './selection';
import { uiReducer } from './ui';
import {
  getProducts as getProductsFromState,
  getProductById as getProductByIdFromState,
  getAvailableProducts as getAvailableProductsFromState,
  getLowStockProducts as getLowStockProductsFromState,
  getOutOfStockProducts as getOutOfStockProductsFromState,
} from './products';
import { getLastSelectedProduct as getLastSelectedProductFromState } from './selection';

// 리듀서 결합
let state = {
  products: productsReducer(undefined, { type: 'INIT' }),
  lastSelectedProduct: selectionReducer(undefined, { type: 'INIT' }),
  ui: uiReducer(undefined, { type: 'INIT' }),
};

// 디스패치
export const dispatch = (action) => {
  state = {
    ...state,
    products: productsReducer(state.products, action),
    lastSelectedProduct: selectionReducer(state.lastSelectedProduct, action),
    ui: uiReducer(state.ui, action),
  };
};

// 모든 액션 생성자들을 다시 export
export {
  updateProductQuantity,
  setProductSale,
  setProductSuggestSale,
  resetProductSales,
  lightningSale,
  suggestSale,
} from './products';

export { setLastSelectedProduct, clearLastSelectedProduct } from './selection';

export {
  updateSelectorOptionsAction,
  updateSelectorBorderColorAction,
  updateCartTotalAction,
  updateCartItemCountAction,
  updateCartSummaryAction,
  updateLoyaltyPointsAction,
  updateDiscountInfoAction,
  updateStockStatusAction,
  toggleTuesdaySpecialAction,
  updateCartItemPricesAction,
  addCartItemAction,
  removeCartItemAction,
  updateCartItemQuantityAction,
  toggleManualOverlayAction,
  toggleManualColumnAction,
  setManualOverlayHiddenAction,
  setManualColumnTranslatedAction,
} from './ui';

// 전역 상태를 전달하는 셀렉터 래퍼들
export const getProducts = () => getProductsFromState(state.products);
export const getProductById = (productId) =>
  getProductByIdFromState(state.products, productId);
export const getAvailableProducts = () =>
  getAvailableProductsFromState(state.products);
export const getLowStockProducts = () =>
  getLowStockProductsFromState(state.products);
export const getOutOfStockProducts = () =>
  getOutOfStockProductsFromState(state.products);
export const getLastSelectedProduct = () =>
  getLastSelectedProductFromState(state.lastSelectedProduct);
