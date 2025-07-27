import { html } from '../utils/html';
import {
  CART_TOTAL_ID,
  DISCOUNT_INFO_ID,
  LOYALTY_POINTS_ID,
  POINTS_NOTICE_ID,
  SUMMARY_DETAILS_ID,
  TUESDAY_SPECIAL_ID,
} from '../utils/selector';

export const RightColumn = () => {
  const rightColumn = document.createElement('div');
  rightColumn.className = 'bg-black text-white p-8 flex flex-col';
  rightColumn.innerHTML = html`
    <h2 class="text-xs font-medium mb-5 tracking-extra-wide uppercase">
      Order Summary
    </h2>
    <div class="flex-1 flex flex-col">
      <div id="${SUMMARY_DETAILS_ID}" class="space-y-3"></div>
      <div class="mt-auto">
        <div id="${DISCOUNT_INFO_ID}" class="mb-4"></div>
        <div id="${CART_TOTAL_ID}" class="pt-5 border-t border-white/10">
          <div class="flex justify-between items-baseline">
            <span class="text-sm uppercase tracking-wider">Total</span>
            <div class="text-2xl tracking-tight">₩0</div>
          </div>
          <div
            id="${LOYALTY_POINTS_ID}"
            class="text-xs text-blue-400 mt-2 text-right"
          >
            적립 포인트: 0p
          </div>
        </div>
        <div
          id="${TUESDAY_SPECIAL_ID}"
          class="mt-4 p-3 bg-white/10 rounded-lg hidden"
        >
          <div class="flex items-center gap-2">
            <span class="text-2xs">🎉</span>
            <span class="text-xs uppercase tracking-wide"
              >Tuesday Special 10% Applied</span
            >
          </div>
        </div>
      </div>
    </div>
    <button
      class="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30"
    >
      Proceed to Checkout
    </button>
    <p class="mt-4 text-2xs text-white/60 text-center leading-relaxed">
      Free shipping on all orders.<br />
      <span id="${POINTS_NOTICE_ID}">Earn loyalty points with purchase.</span>
    </p>
  `;

  return rightColumn;
};
