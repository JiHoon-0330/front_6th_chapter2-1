import { ADD_TO_CART_BUTTON_ID } from '../utils/selector';

export const createAddToCartBtn = ({ onClick }) => {
  const addToCartBtn = document.createElement('button');
  addToCartBtn.id = ADD_TO_CART_BUTTON_ID;
  addToCartBtn.className =
    'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';
  addToCartBtn.textContent = 'Add to Cart';
  addToCartBtn.onclick = onClick;

  return addToCartBtn;
};
