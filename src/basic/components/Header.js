import { html } from '../utils/html';
import { HEADER_ITEM_COUNT_ID } from '../utils/selector';

export const Header = () => {
  const headerElement = document.createElement('div');
  headerElement.className = 'mb-8';
  headerElement.innerHTML = html`
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">
      🛒 Hanghae Online Store
    </h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
    <p
      id="${HEADER_ITEM_COUNT_ID}"
      class="text-sm text-gray-500 font-normal mt-3"
    >
      🛍️ 0 items in cart
    </p>
  `;

  return headerElement;
};
