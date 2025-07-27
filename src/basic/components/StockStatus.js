export const createStockStatus = () => {
  const stockStatus = document.createElement('div');
  stockStatus.id = 'stock-status';
  stockStatus.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';

  return stockStatus;
};
