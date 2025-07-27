export const CART_ITEMS_ID = 'cart-items';

export const PRODUCT_SELECT_ID = 'product-select';

export const STOCK_STATUS_ID = 'stock-status';

export const SUMMARY_DETAILS_ID = 'summary-details';

export const HEADER_ITEM_COUNT_ID = 'item-count';

export const LOYALTY_POINTS_ID = 'loyalty-points';

export const DISCOUNT_INFO_ID = 'discount-info';

export const CART_TOTAL_ID = 'cart-total';

export const TUESDAY_SPECIAL_ID = 'tuesday-special';

export const ADD_TO_CART_BUTTON_ID = 'add-to-cart';

export const POINTS_NOTICE_ID = 'points-notice';

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
  get summaryDetails() {
    return document.getElementById(SUMMARY_DETAILS_ID);
  },
  get headerItemCount() {
    return document.getElementById(HEADER_ITEM_COUNT_ID);
  },
  get loyaltyPoints() {
    return document.getElementById(LOYALTY_POINTS_ID);
  },
  get discountInfo() {
    return document.getElementById(DISCOUNT_INFO_ID);
  },
  get cartTotal() {
    return document.getElementById(CART_TOTAL_ID);
  },
  get tuesdaySpecial() {
    return document.getElementById(TUESDAY_SPECIAL_ID);
  },
  get addToCartBtn() {
    return document.getElementById(ADD_TO_CART_BUTTON_ID);
  },
  get pointsNotice() {
    return document.getElementById(POINTS_NOTICE_ID);
  },
};
