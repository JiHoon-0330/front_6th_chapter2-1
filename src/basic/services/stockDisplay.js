import { selector } from '../utils/selector';
import { isLowStock, isSoldOut } from '../utils/stock';

// 재고 상태 메시지 생성 함수
export function generateStockStatusMessage(prodList) {
  if (!prodList || !Array.isArray(prodList)) {
    console.warn('Invalid product list provided to generateStockStatusMessage');
    return '';
  }

  return prodList
    .filter((item) => isLowStock(item.q) || isSoldOut(item.q))
    .map((item) => {
      if (isLowStock(item.q)) {
        return `${item.name}: 재고 부족 (${item.q}개 남음)\n`;
      } else if (isSoldOut(item.q)) {
        return `${item.name}: 품절\n`;
      }
      return '';
    })
    .join('');
}

// 재고 상태 표시 업데이트 함수
export function updateStockDisplay(prodList) {
  if (!prodList) {
    console.warn('Product list is required for stock display update');
    return;
  }

  const stockMsg = generateStockStatusMessage(prodList);

  if (!selector.stockStatus) {
    console.warn('Stock status element not found');
    return;
  }

  try {
    selector.stockStatus.textContent = stockMsg;
  } catch (error) {
    console.error('Failed to update stock status display:', error);
  }
}
