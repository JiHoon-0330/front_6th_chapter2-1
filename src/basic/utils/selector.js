export const CART_ITEMS_ID = 'cart-items';

export const PRODUCT_SELECT_ID = 'product-select';

export const STOCK_STATUS_ID = 'stock-status';

export const selector = {
  get cartItems() {
    return document.getElementById(CART_ITEMS_ID);
  },
  get productSelect() {
    return document.getElementById(PRODUCT_SELECT_ID);
  },
  get stockStatus() {
    return document.getElementById(STOCK_STATUS_ID);
  },
};
