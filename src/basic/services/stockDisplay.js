import { selector } from '../utils/selector';
import { isLowStock, isSoldOut } from '../utils/stock';

// 재고 상태 메시지 생성 함수
export function generateStockStatusMessage(prodList) {
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
  const stockMsg = generateStockStatusMessage(prodList);

  if (selector.stockStatus) {
    selector.stockStatus.textContent = stockMsg;
  } else {
    console.warn('Stock status element not found');
  }
}
