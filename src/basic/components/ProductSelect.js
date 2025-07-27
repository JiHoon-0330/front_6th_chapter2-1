import { PRODUCT_SELECT_ID } from '../utils/selector';

export const ProductSelect = () => {
  const productSelect = document.createElement('select');
  productSelect.id = PRODUCT_SELECT_ID;
  productSelect.className =
    'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';

  return productSelect;
};
