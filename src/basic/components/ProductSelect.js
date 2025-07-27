export const createProductSelect = () => {
  const productSelect = document.createElement('select');
  productSelect.id = 'product-select';
  productSelect.className =
    'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';

  return productSelect;
};
