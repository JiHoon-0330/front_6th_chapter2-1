import { QUANTITY_THRESHOLDS } from '../utils/constants';
import { getProducts } from '../utils/reducer';
import { selector } from '../utils/selector';
import { isLowStock } from '../utils/stock';

// 재고 부족 상품 목록 생성 함수
export function getLowStockItems(prodList) {
  return prodList
    .filter((product) => isLowStock(product.q))
    .map((product) => product.name);
}

// 장바구니 아이템 정보 추출 함수
export function getCartItemInfo(cartItem, prodList) {
  const currentItem = prodList.find((product) => product.id === cartItem.id);
  const quantityElement = cartItem.querySelector('.quantity-number');
  const quantity = parseInt(quantityElement.textContent);
  const itemTotal = currentItem.val * quantity;

  return { currentItem, quantity, itemTotal };
}

// 개별 할인 정보 계산 함수
export function calculateIndividualDiscount(quantity, currentItem) {
  if (quantity >= QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT) {
    const discountRate = currentItem.discountRate;
    if (discountRate > 0) {
      return {
        discountRate,
        discountInfo: { name: currentItem.name, discount: discountRate * 100 },
      };
    }
  }
  return { discountRate: 0, discountInfo: null };
}

// 가격 스타일 업데이트 함수
export function updatePriceStyles(cartItem, quantity) {
  const priceElems = cartItem.querySelectorAll('.text-lg, .text-xs');
  priceElems.forEach((elem) => {
    if (elem.classList.contains('text-lg')) {
      elem.style.fontWeight =
        quantity >= QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT ? 'bold' : 'normal';
    }
  });
}

// 장바구니 아이템별 계산 함수
export function calculateCartItem(cartItem, prodList) {
  const { currentItem, quantity, itemTotal } = getCartItemInfo(
    cartItem,
    prodList
  );
  const { discountRate, discountInfo } = calculateIndividualDiscount(
    quantity,
    currentItem
  );

  // UI 업데이트 (비즈니스 로직과 분리되어야 하지만 일단 유지)
  updatePriceStyles(cartItem, quantity);

  return {
    quantity,
    itemTotal,
    discountedTotal: itemTotal * (1 - discountRate),
    discountInfo,
  };
}

// 장바구니 요약 정보 계산 함수
export function calculateCartSummary() {
  const prodList = getProducts();
  const cartItems = selector.cartItems.children;
  const lowStockItems = getLowStockItems(prodList);

  let itemCount = 0;
  let subtotal = 0;
  let totalAmount = 0;
  const itemDiscounts = [];

  // 장바구니 아이템별 계산
  Array.from(cartItems).forEach((cartItem) => {
    const cartItemResult = calculateCartItem(cartItem, prodList);

    itemCount += cartItemResult.quantity;
    subtotal += cartItemResult.itemTotal;
    totalAmount += cartItemResult.discountedTotal;

    if (cartItemResult.discountInfo) {
      itemDiscounts.push(cartItemResult.discountInfo);
    }
  });

  return {
    itemCnt: itemCount,
    subTot: subtotal,
    totalAmt: totalAmount,
    originalTotal: subtotal,
    itemDiscounts,
    lowStockItems,
    prodList,
  };
}
