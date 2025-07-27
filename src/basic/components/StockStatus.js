import { STOCK_STATUS_ID } from '../utils/selector';

export const StockStatus = () => {
  const stockStatus = document.createElement('div');
  stockStatus.id = STOCK_STATUS_ID;
  stockStatus.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';

  return stockStatus;
};
