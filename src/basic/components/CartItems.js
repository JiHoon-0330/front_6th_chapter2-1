import { CART_ITEMS_ID } from '../utils/selector';

export const CartItems = ({ onClick }) => {
  const cartItems = document.createElement('div');
  cartItems.id = CART_ITEMS_ID;
  cartItems.onclick = onClick;

  return cartItems;
};
