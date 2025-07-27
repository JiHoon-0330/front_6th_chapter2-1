import { productsReducer } from './products.js';
import { selectionReducer } from './selection.js';
import {
  getProducts as getProductsFromState,
  getProductById as getProductByIdFromState,
  getAvailableProducts as getAvailableProductsFromState,
  getLowStockProducts as getLowStockProductsFromState,
  getOutOfStockProducts as getOutOfStockProductsFromState,
} from './products.js';
import { getLastSelectedProduct as getLastSelectedProductFromState } from './selection.js';

// 리듀서 결합
let state = {
  products: productsReducer(undefined, { type: 'INIT' }),
  lastSelectedProduct: selectionReducer(undefined, { type: 'INIT' }),
};

// 디스패치
export const dispatch = (action) => {
  state = {
    ...state,
    products: productsReducer(state.products, action),
    lastSelectedProduct: selectionReducer(state.lastSelectedProduct, action),
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
} from './products.js';

export {
  setLastSelectedProduct,
  clearLastSelectedProduct,
} from './selection.js';

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
