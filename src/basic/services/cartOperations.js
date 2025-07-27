import {
  getProducts,
  updateProductQuantity,
  setLastSelectedProduct,
  dispatch,
} from '../utils/reducer';
import { selector } from '../utils/selector';
import { html } from '../utils/html';
import { updateCartAndDisplay } from './cartService';
import { updateProductSelectOptions } from './productSelect';

// 아이템 선택 검증 함수
function validateItemSelection() {
  const selItem = selector.productSelect.value;
  const prodList = getProducts();
  const hasItem = prodList.some((product) => product.id === selItem);

  if (!selItem || !hasItem) {
    return null;
  }

  const itemToAdd = prodList.find((product) => product.id === selItem);
  if (!itemToAdd || itemToAdd.q <= 0) {
    return null;
  }

  return itemToAdd;
}

// 기존 아이템 수량 증가 함수
export function updateExistingItemQuantity(itemToAdd) {
  const item = document.getElementById(itemToAdd.id);
  if (!item) {
    return false;
  }

  const qtyElem = item.querySelector('.quantity-number');
  const newQty = parseInt(qtyElem.textContent) + 1;

  if (newQty <= itemToAdd.q + parseInt(qtyElem.textContent)) {
    qtyElem.textContent = newQty;
    dispatch(updateProductQuantity(itemToAdd.id, -1));
    return true;
  } else {
    alert('재고가 부족합니다.');
    return false;
  }
}

// 장바구니 아이템 요소 생성 함수
export function createCartItemElement(itemToAdd) {
  const newItem = document.createElement('div');
  newItem.id = itemToAdd.id;
  newItem.className =
    'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';
  newItem.innerHTML = html`
    <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
      <div
        class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"
      ></div>
    </div>
    <div>
      <h3 class="text-base font-normal mb-1 tracking-tight">
        ${itemToAdd.onSale && itemToAdd.suggestSale
          ? '⚡💝'
          : itemToAdd.onSale
            ? '⚡'
            : itemToAdd.suggestSale
              ? '💝'
              : ''}${itemToAdd.name}
      </h3>
      <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
      <p class="text-xs text-black mb-3">
        ${itemToAdd.onSale || itemToAdd.suggestSale
          ? html`<span class="line-through text-gray-400"
                >₩${itemToAdd.originalVal.toLocaleString()}</span
              >
              <span
                class="${itemToAdd.onSale && itemToAdd.suggestSale
                  ? 'text-purple-600'
                  : itemToAdd.onSale
                    ? 'text-red-500'
                    : 'text-blue-500'}"
                >₩${itemToAdd.val.toLocaleString()}</span
              >`
          : `₩${itemToAdd.val.toLocaleString()}`}
      </p>
      <div class="flex items-center gap-4">
        <button
          class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
          data-product-id="${itemToAdd.id}"
          data-change="-1"
        >
          −
        </button>
        <span
          class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums"
          >1</span
        >
        <button
          class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
          data-product-id="${itemToAdd.id}"
          data-change="1"
        >
          +
        </button>
      </div>
    </div>
    <div class="text-right">
      <div class="text-lg mb-2 tracking-tight tabular-nums">
        ${itemToAdd.onSale || itemToAdd.suggestSale
          ? html`<span class="line-through text-gray-400"
                >₩${itemToAdd.originalVal.toLocaleString()}</span
              >
              <span
                class="${itemToAdd.onSale && itemToAdd.suggestSale
                  ? 'text-purple-600'
                  : itemToAdd.onSale
                    ? 'text-red-500'
                    : 'text-blue-500'}"
                >₩${itemToAdd.val.toLocaleString()}</span
              >`
          : `₩${itemToAdd.val.toLocaleString()}`}
      </div>
      <a
        class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
        data-product-id="${itemToAdd.id}"
        >Remove</a
      >
    </div>
  `;

  return newItem;
}

// 장바구니에 아이템 추가 함수
export function handleAddItemToCart() {
  const itemToAdd = validateItemSelection();
  if (!itemToAdd) {
    return;
  }

  const isUpdated = updateExistingItemQuantity(itemToAdd);
  if (isUpdated) {
    updateCartAndDisplay();
    dispatch(setLastSelectedProduct(itemToAdd.id));
    return;
  }

  const newItem = createCartItemElement(itemToAdd);
  selector.cartItems.appendChild(newItem);
  dispatch(updateProductQuantity(itemToAdd.id, -1));
  updateCartAndDisplay();
  dispatch(setLastSelectedProduct(itemToAdd.id));
}

// 수량 변경 이벤트 검증 함수
export function validateQuantityChangeEvent(event) {
  const tgt = event.target;
  if (
    !tgt.classList.contains('quantity-change') &&
    !tgt.classList.contains('remove-item')
  ) {
    return null;
  }

  const prodId = tgt.dataset.productId;
  const itemElem = document.getElementById(prodId);
  const prodList = getProducts();
  const prod = prodList.find((product) => product.id === prodId);

  if (!itemElem || !prod) {
    return null;
  }

  return { tgt, prodId, itemElem, prod };
}

// 수량 증가 처리 함수
export function handleQuantityIncrease(prodId, itemElem, prod) {
  const qtyElem = itemElem.querySelector('.quantity-number');
  const currentQty = parseInt(qtyElem.textContent);
  const newQty = currentQty + 1;

  if (newQty <= prod.q + currentQty) {
    qtyElem.textContent = newQty;
    dispatch(updateProductQuantity(prodId, -1));
    return true;
  } else {
    alert('재고가 부족합니다.');
    return false;
  }
}

// 수량 감소 처리 함수
export function handleQuantityDecrease(prodId, itemElem) {
  const qtyElem = itemElem.querySelector('.quantity-number');
  const currentQty = parseInt(qtyElem.textContent);
  const newQty = currentQty - 1;

  if (newQty > 0) {
    qtyElem.textContent = newQty;
    dispatch(updateProductQuantity(prodId, 1));
    return true;
  } else {
    dispatch(updateProductQuantity(prodId, currentQty));
    itemElem.remove();
    return false;
  }
}

// 아이템 제거 처리 함수
export function handleItemRemoval(prodId, itemElem) {
  const qtyElem = itemElem.querySelector('.quantity-number');
  const remQty = parseInt(qtyElem.textContent);
  dispatch(updateProductQuantity(prodId, remQty));
  itemElem.remove();
}

// 수량 변경 이벤트 처리 함수
export function handleQuantityChange(event) {
  const eventData = validateQuantityChangeEvent(event);
  if (!eventData) {
    return;
  }

  const { tgt, prodId, itemElem, prod } = eventData;

  if (tgt.classList.contains('quantity-change')) {
    const qtyChange = parseInt(tgt.dataset.change);
    if (qtyChange > 0) {
      handleQuantityIncrease(prodId, itemElem, prod);
    } else {
      handleQuantityDecrease(prodId, itemElem);
    }
  } else if (tgt.classList.contains('remove-item')) {
    handleItemRemoval(prodId, itemElem);
  }
  updateCartAndDisplay();
  updateProductSelectOptions();
}

export function hasProducts(...productIds) {
  const cartItemIds = new Set(
    Array.from(selector.cartItems.children).map((cartItem) => cartItem.id)
  );
  return productIds.map((productId) => cartItemIds.has(productId));
}
