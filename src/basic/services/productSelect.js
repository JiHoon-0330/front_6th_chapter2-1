import { DISCOUNT_RATES } from '../utils/constants';
import { getProducts } from '../utils/reducer';
import { selector } from '../utils/selector';
import { isSoldOut, isTotalLowStock } from '../utils/stock';

// 상수 정의
const SELECT_OPTION_STYLES = {
  SOLD_OUT: 'text-gray-400',
  SUPER_SALE: 'text-purple-600 font-bold',
  LIGHTNING_SALE: 'text-red-500 font-bold',
  SUGGEST_SALE: 'text-blue-500 font-bold',
  NORMAL: '',
};

const STOCK_BORDER_COLORS = {
  LOW_STOCK: 'orange',
  NORMAL: '',
};

// 옵션 텍스트 생성 함수
export function formatProductOptionText(item) {
  const discountText = formatDiscountText(item);

  if (isSoldOut(item.q)) {
    return `${item.name} - ${item.val}원 (품절)${discountText}`;
  }

  return formatSaleOptionText(item);
}

// 할인 텍스트 생성 함수
function formatDiscountText(item) {
  let discountText = '';
  if (item.onSale) discountText += ' ⚡SALE';
  if (item.suggestSale) discountText += ' 💝추천';
  return discountText;
}

// 세일 옵션 텍스트 생성 함수
function formatSaleOptionText(item) {
  if (item.onSale && item.suggestSale) {
    return `⚡💝${item.name} - ${item.originalVal}원 → ${item.val}원 (${DISCOUNT_RATES.BULK_PURCHASE * 100}% SUPER SALE!)`;
  }

  if (item.onSale) {
    return `⚡${item.name} - ${item.originalVal}원 → ${item.val}원 (${DISCOUNT_RATES.LIGHTNING_SALE * 100}% SALE!)`;
  }

  if (item.suggestSale) {
    return `💝${item.name} - ${item.originalVal}원 → ${item.val}원 (${DISCOUNT_RATES.SUGGEST_SALE * 100}% 추천할인!)`;
  }

  return `${item.name} - ${item.val}원`;
}

// 옵션 스타일 결정 함수
function getProductOptionStyle(item) {
  if (isSoldOut(item.q)) {
    return SELECT_OPTION_STYLES.SOLD_OUT;
  }

  if (item.onSale && item.suggestSale) {
    return SELECT_OPTION_STYLES.SUPER_SALE;
  }

  if (item.onSale) {
    return SELECT_OPTION_STYLES.LIGHTNING_SALE;
  }

  if (item.suggestSale) {
    return SELECT_OPTION_STYLES.SUGGEST_SALE;
  }

  return SELECT_OPTION_STYLES.NORMAL;
}

// 옵션 생성 함수
function createProductOptionElement(item) {
  const option = document.createElement('option');
  option.value = item.id;
  option.textContent = formatProductOptionText(item);
  option.className = getProductOptionStyle(item);

  if (isSoldOut(item.q)) {
    option.disabled = true;
  }

  return option;
}

// 재고 상태에 따른 테두리 색상 설정 함수
function updateProductSelectBorderStyle(totalStock) {
  const borderColor = isTotalLowStock(totalStock)
    ? STOCK_BORDER_COLORS.LOW_STOCK
    : STOCK_BORDER_COLORS.NORMAL;

  selector.productSelect.style.borderColor = borderColor;
}

// 상품 선택 옵션 업데이트 함수
export function updateProductSelectOptions() {
  const prodList = getProducts();
  const totalStock = prodList.reduce((sum, product) => sum + product.q, 0);

  // 기존 옵션들 제거
  selector.productSelect.innerHTML = '';

  // 새로운 옵션들 생성 및 추가
  prodList.forEach((item) => {
    const optionElement = createProductOptionElement(item);
    selector.productSelect.appendChild(optionElement);
  });

  // 재고 상태에 따른 테두리 스타일 업데이트
  updateProductSelectBorderStyle(totalStock);
}
