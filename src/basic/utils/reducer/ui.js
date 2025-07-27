import { selector } from '../selector';

// DOM 조작 액션들을 처리하는 리듀서
export const uiReducer = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_SELECTOR_OPTIONS':
      updateSelectorOptions(action.payload.products);
      return state;

    case 'UPDATE_SELECTOR_BORDER_COLOR':
      updateSelectorBorderColor(action.payload.color);
      return state;

    case 'UPDATE_CART_TOTAL':
      updateCartTotal(action.payload.totalAmount);
      return state;

    case 'UPDATE_CART_ITEM_COUNT':
      updateCartItemCount(action.payload.itemCount);
      return state;

    case 'UPDATE_CART_SUMMARY':
      updateCartSummary(action.payload.summary);
      return state;

    case 'UPDATE_LOYALTY_POINTS':
      updateLoyaltyPoints(action.payload.points, action.payload.details);
      return state;

    case 'UPDATE_DISCOUNT_INFO':
      updateDiscountInfo(
        action.payload.discountRate,
        action.payload.savedAmount
      );
      return state;

    case 'UPDATE_STOCK_STATUS':
      updateStockStatus(action.payload.message);
      return state;

    case 'TOGGLE_TUESDAY_SPECIAL':
      toggleTuesdaySpecial(action.payload.visible);
      return state;

    case 'UPDATE_CART_ITEM_PRICES':
      updateCartItemPrices(action.payload.cartItems, action.payload.products);
      return state;

    case 'ADD_CART_ITEM':
      addCartItem(action.payload.item);
      return state;

    case 'REMOVE_CART_ITEM':
      removeCartItem(action.payload.productId);
      return state;

    case 'UPDATE_CART_ITEM_QUANTITY':
      updateCartItemQuantity(action.payload.productId, action.payload.quantity);
      return state;

    case 'TOGGLE_MANUAL_OVERLAY':
      toggleManualOverlay();
      return state;

    case 'TOGGLE_MANUAL_COLUMN':
      toggleManualColumn();
      return state;

    case 'SET_MANUAL_OVERLAY_HIDDEN':
      setManualOverlayHidden(action.payload.hidden);
      return state;

    case 'SET_MANUAL_COLUMN_TRANSLATED':
      setManualColumnTranslated(action.payload.translated);
      return state;

    default:
      return state;
  }
};

// DOM 조작 함수들
function updateSelectorOptions(products) {
  selector.productSelect.innerHTML = '';

  let totalStock = 0;
  for (let idx = 0; idx < products.length; idx++) {
    totalStock += products[idx].q;
  }

  for (let i = 0; i < products.length; i++) {
    const item = products[i];
    const opt = document.createElement('option');
    opt.value = item.id;

    let discountText = '';
    if (item.onSale) discountText += ' ⚡SALE';
    if (item.suggestSale) discountText += ' 💝추천';

    if (item.q === 0) {
      opt.textContent =
        item.name + ' - ' + item.val + '원 (품절)' + discountText;
      opt.disabled = true;
      opt.className = 'text-gray-400';
    } else {
      if (item.onSale && item.suggestSale) {
        opt.textContent =
          '⚡💝' +
          item.name +
          ' - ' +
          item.originalVal +
          '원 → ' +
          item.val +
          '원 (25% SUPER SALE!)';
        opt.className = 'text-purple-600 font-bold';
      } else if (item.onSale) {
        opt.textContent =
          '⚡' +
          item.name +
          ' - ' +
          item.originalVal +
          '원 → ' +
          item.val +
          '원 (20% SALE!)';
        opt.className = 'text-red-500 font-bold';
      } else if (item.suggestSale) {
        opt.textContent =
          '💝' +
          item.name +
          ' - ' +
          item.originalVal +
          '원 → ' +
          item.val +
          '원 (5% 추천할인!)';
        opt.className = 'text-blue-500 font-bold';
      } else {
        opt.textContent = item.name + ' - ' + item.val + '원' + discountText;
      }
    }
    selector.productSelect.appendChild(opt);
  }

  if (totalStock < 50) {
    selector.productSelect.style.borderColor = 'orange';
  } else {
    selector.productSelect.style.borderColor = '';
  }
}

function updateSelectorBorderColor(color) {
  selector.productSelect.style.borderColor = color;
}

function updateCartTotal(totalAmount) {
  const sum = selector.cartTotal;
  const totalDiv = sum.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = '₩' + Math.round(totalAmount).toLocaleString();
  }
}

function updateCartItemCount(itemCount) {
  selector.headerItemCount.textContent = '🛍️ ' + itemCount + ' items in cart';
}

function updateCartSummary(summary) {
  const summaryDetails = selector.summaryDetails;
  summaryDetails.innerHTML = summary;
}

function updateLoyaltyPoints(points, details) {
  const loyaltyPointsDiv = selector.loyaltyPoints;
  if (loyaltyPointsDiv) {
    if (points > 0) {
      loyaltyPointsDiv.innerHTML =
        '<div>적립 포인트: <span class="font-bold">' +
        points +
        'p</span></div>' +
        '<div class="text-2xs opacity-70 mt-1">' +
        details.join(', ') +
        '</div>';
      loyaltyPointsDiv.style.display = 'block';
    } else {
      loyaltyPointsDiv.textContent = '적립 포인트: 0p';
      loyaltyPointsDiv.style.display = 'block';
    }
  }
}

function updateDiscountInfo(discountRate, savedAmount) {
  const discountInfoDiv = selector.discountInfo;
  discountInfoDiv.innerHTML = '';
  if (discountRate > 0 && savedAmount > 0) {
    discountInfoDiv.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discountRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }
}

function updateStockStatus(message) {
  selector.stockStatus.textContent = message;
}

function toggleTuesdaySpecial(visible) {
  const tuesdaySpecial = selector.tuesdaySpecial;
  if (visible) {
    tuesdaySpecial.classList.remove('hidden');
  } else {
    tuesdaySpecial.classList.add('hidden');
  }
}

function updateCartItemPrices(cartItems, products) {
  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    let product = null;
    for (let productIdx = 0; productIdx < products.length; productIdx++) {
      if (products[productIdx].id === itemId) {
        product = products[productIdx];
        break;
      }
    }

    if (product) {
      const priceDiv = cartItems[i].querySelector('.text-lg');
      const nameDiv = cartItems[i].querySelector('h3');

      if (product.onSale && product.suggestSale) {
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-purple-600">₩' +
          product.val.toLocaleString() +
          '</span>';
        nameDiv.textContent = '⚡💝' + product.name;
      } else if (product.onSale) {
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-red-500">₩' +
          product.val.toLocaleString() +
          '</span>';
        nameDiv.textContent = '⚡' + product.name;
      } else if (product.suggestSale) {
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalVal.toLocaleString() +
          '</span> <span class="text-blue-500">₩' +
          product.val.toLocaleString() +
          '</span>';
        nameDiv.textContent = '💝' + product.name;
      } else {
        priceDiv.textContent = '₩' + product.val.toLocaleString();
        nameDiv.textContent = product.name;
      }
    }
  }
}

function addCartItem(item) {
  const newItem = document.createElement('div');
  newItem.id = item.id;
  newItem.className =
    'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';
  newItem.innerHTML = `
    <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
      <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
    </div>
    <div>
      <h3 class="text-base font-normal mb-1 tracking-tight">${item.onSale && item.suggestSale ? '⚡💝' : item.onSale ? '⚡' : item.suggestSale ? '💝' : ''}${item.name}</h3>
      <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
      <p class="text-xs text-black mb-3">${item.onSale || item.suggestSale ? '<span class="line-through text-gray-400">₩' + item.originalVal.toLocaleString() + '</span> <span class="' + (item.onSale && item.suggestSale ? 'text-purple-600' : item.onSale ? 'text-red-500' : 'text-blue-500') + '">₩' + item.val.toLocaleString() + '</span>' : '₩' + item.val.toLocaleString()}</p>
      <div class="flex items-center gap-4">
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${item.id}" data-change="-1">−</button>
        <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${item.id}" data-change="1">+</button>
      </div>
    </div>
    <div class="text-right">
      <div class="text-lg mb-2 tracking-tight tabular-nums">${item.onSale || item.suggestSale ? '<span class="line-through text-gray-400">₩' + item.originalVal.toLocaleString() + '</span> <span class="' + (item.onSale && item.suggestSale ? 'text-purple-600' : item.onSale ? 'text-red-500' : 'text-blue-500') + '">₩' + item.val.toLocaleString() + '</span>' : '₩' + item.val.toLocaleString()}</div>
      <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${item.id}">Remove</a>
    </div>
  `;
  selector.cartItems.appendChild(newItem);
}

function removeCartItem(productId) {
  const itemElem = document.getElementById(productId);
  if (itemElem) {
    itemElem.remove();
  }
}

function updateCartItemQuantity(productId, quantity) {
  const itemElem = document.getElementById(productId);
  if (itemElem) {
    const qtyElem = itemElem.querySelector('.quantity-number');
    if (qtyElem) {
      qtyElem.textContent = quantity;
    }
  }
}

function toggleManualOverlay() {
  const manualOverlay = document.querySelector('.fixed.inset-0');
  if (manualOverlay) {
    manualOverlay.classList.toggle('hidden');
  }
}

function toggleManualColumn() {
  const manualColumn = document.querySelector('.fixed.right-0');
  if (manualColumn) {
    manualColumn.classList.toggle('translate-x-full');
  }
}

function setManualOverlayHidden(hidden) {
  const manualOverlay = document.querySelector('.fixed.inset-0');
  if (manualOverlay) {
    if (hidden) {
      manualOverlay.classList.add('hidden');
    } else {
      manualOverlay.classList.remove('hidden');
    }
  }
}

function setManualColumnTranslated(translated) {
  const manualColumn = document.querySelector('.fixed.right-0');
  if (manualColumn) {
    if (translated) {
      manualColumn.classList.add('translate-x-full');
    } else {
      manualColumn.classList.remove('translate-x-full');
    }
  }
}

// 액션 생성자들
export const updateSelectorOptionsAction = (products) => ({
  type: 'UPDATE_SELECTOR_OPTIONS',
  payload: { products },
});

export const updateSelectorBorderColorAction = (color) => ({
  type: 'UPDATE_SELECTOR_BORDER_COLOR',
  payload: { color },
});

export const updateCartTotalAction = (totalAmount) => ({
  type: 'UPDATE_CART_TOTAL',
  payload: { totalAmount },
});

export const updateCartItemCountAction = (itemCount) => ({
  type: 'UPDATE_CART_ITEM_COUNT',
  payload: { itemCount },
});

export const updateCartSummaryAction = (summary) => ({
  type: 'UPDATE_CART_SUMMARY',
  payload: { summary },
});

export const updateLoyaltyPointsAction = (points, details) => ({
  type: 'UPDATE_LOYALTY_POINTS',
  payload: { points, details },
});

export const updateDiscountInfoAction = (discountRate, savedAmount) => ({
  type: 'UPDATE_DISCOUNT_INFO',
  payload: { discountRate, savedAmount },
});

export const updateStockStatusAction = (message) => ({
  type: 'UPDATE_STOCK_STATUS',
  payload: { message },
});

export const toggleTuesdaySpecialAction = (visible) => ({
  type: 'TOGGLE_TUESDAY_SPECIAL',
  payload: { visible },
});

export const updateCartItemPricesAction = (cartItems, products) => ({
  type: 'UPDATE_CART_ITEM_PRICES',
  payload: { cartItems, products },
});

export const addCartItemAction = (item) => ({
  type: 'ADD_CART_ITEM',
  payload: { item },
});

export const removeCartItemAction = (productId) => ({
  type: 'REMOVE_CART_ITEM',
  payload: { productId },
});

export const updateCartItemQuantityAction = (productId, quantity) => ({
  type: 'UPDATE_CART_ITEM_QUANTITY',
  payload: { productId, quantity },
});

export const toggleManualOverlayAction = () => ({
  type: 'TOGGLE_MANUAL_OVERLAY',
});

export const toggleManualColumnAction = () => ({
  type: 'TOGGLE_MANUAL_COLUMN',
});

export const setManualOverlayHiddenAction = (hidden) => ({
  type: 'SET_MANUAL_OVERLAY_HIDDEN',
  payload: { hidden },
});

export const setManualColumnTranslatedAction = (translated) => ({
  type: 'SET_MANUAL_COLUMN_TRANSLATED',
  payload: { translated },
});
