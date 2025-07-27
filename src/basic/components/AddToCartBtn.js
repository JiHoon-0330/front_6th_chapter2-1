export const createAddToCartBtn = () => {
  const addToCartBtn = document.createElement('button');
  addToCartBtn.id = 'add-to-cart';
  addToCartBtn.className =
    'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';
  addToCartBtn.textContent = 'Add to Cart';

  return addToCartBtn;
};
