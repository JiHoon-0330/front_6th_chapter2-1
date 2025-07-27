import { createAddToCartBtn } from './components/AddToCartBtn';
import { createCartItems } from './components/CartItems';
import { createGridContainer } from './components/GridContainer';
import { createHeader } from './components/Header';
import { createLeftColumn } from './components/LeftColumn';
import { createManualColumn } from './components/ManualColumn';
import { createManualOverlay } from './components/ManualOverlay';
import { createManualToggle } from './components/ManualToggle';
import { createProductSelect } from './components/ProductSelect';
import { createRightColumn } from './components/RightColumn';
import { createSelectorContainer } from './components/SelectorContainer';
import { createStockStatus } from './components/StockStatus';
import { html } from './utils/html';
import {
  TIMING,
  DISCOUNT_RATES,
  QUANTITY_THRESHOLDS,
  POINTS,
} from './utils/constants';
import { calculateBasePoints, calculateTotalPoints } from './utils/points';
import {
  calculateDiscountedPrice,
  calculateDiscountRate,
  createDiscountInfo,
} from './utils/percentage';
import { isTuesday } from './utils/date';
import { isLowStock, isSoldOut, isTotalLowStock } from './utils/stock';
import {
  dispatch,
  getLastSelectedProduct,
  getProducts,
  lightningSale,
  setLastSelectedProduct,
  setManualColumnTranslatedAction,
  setManualOverlayHiddenAction,
  suggestSale,
  toggleManualColumnAction,
  toggleManualOverlayAction,
  updateProductQuantity,
} from './utils/reducer';
import { selector } from './utils/selector';

function main() {
  const root = document.getElementById('app');
  const header = createHeader();
  const gridContainer = createGridContainer();
  const leftColumn = createLeftColumn();
  const selectorContainer = createSelectorContainer();
  const rightColumn = createRightColumn();
  const sel = createProductSelect();
  const addBtn = createAddToCartBtn({ onClick: handleClickAddToCartBtn });
  const stockInfo = createStockStatus();

  selectorContainer.appendChild(sel);
  selectorContainer.appendChild(addBtn);
  selectorContainer.appendChild(stockInfo);
  leftColumn.appendChild(selectorContainer);

  const cartDisp = createCartItems({ onClick: handleClickQuantityChange });
  leftColumn.appendChild(cartDisp);

  const manualOverlay = createManualOverlay({
    onClick: () => {
      dispatch(setManualOverlayHiddenAction(true));
      dispatch(setManualColumnTranslatedAction(true));
    },
  });
  const manualToggle = createManualToggle({
    onClick: () => {
      dispatch(toggleManualOverlayAction());
      dispatch(toggleManualColumnAction());
    },
  });
  const manualColumn = createManualColumn();

  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);
  manualOverlay.appendChild(manualColumn);
  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);

  onUpdateSelectOptions();
  handleCalculateCartStuff();
  const lightningDelay = Math.random() * TIMING.LIGHTNING_DELAY_MAX;
  setTimeout(() => {
    setInterval(function () {
      const prodList = getProducts();
      const luckyIdx = Math.floor(Math.random() * prodList.length);
      const luckyItem = prodList[luckyIdx];
      if (luckyItem.q > 0 && !luckyItem.onSale) {
        dispatch(lightningSale(luckyItem.id));
        alert(
          `⚡번개세일! ${luckyItem.name}이(가) ${DISCOUNT_RATES.LIGHTNING_SALE * 100}% 할인 중입니다!`
        );
        onUpdateSelectOptions();
        doUpdatePricesInCart();
      }
    }, TIMING.LIGHTNING_INTERVAL);
  }, lightningDelay);
  setTimeout(function () {
    setInterval(function () {
      const lastSel = getLastSelectedProduct();
      if (lastSel) {
        const prodList = getProducts();
        const suggest = prodList.find(
          (product) =>
            product.id !== lastSel && product.q > 0 && !product.suggestSale
        );
        if (suggest) {
          alert(
            `💝 ${suggest.name}은(는) 어떠세요? 지금 구매하시면 ${DISCOUNT_RATES.SUGGEST_SALE * 100}% 추가 할인!`
          );
          dispatch(suggestSale(suggest.id));
          onUpdateSelectOptions();
          doUpdatePricesInCart();
        }
      }
    }, TIMING.SUGGEST_INTERVAL);
  }, Math.random() * TIMING.SUGGEST_DELAY_MAX);
}

// 상수 정의
const SELECT_OPTION_STYLES = {
  SOLD_OUT: 'text-gray-400',
  SUPER_SALE: 'text-purple-600 font-bold',
  LIGHTNING_SALE: 'text-red-500 font-bold',
  SUGGEST_SALE: 'text-blue-500 font-bold',
  NORMAL: '',
};

const STOCK_BORDER_COLORS = {
  LOW_STOCK: 'orange',
  NORMAL: '',
};

// 옵션 텍스트 생성 함수
function createOptionText(item) {
  const discountText = createDiscountText(item);

  if (isSoldOut(item.q)) {
    return `${item.name} - ${item.val}원 (품절)${discountText}`;
  }

  return createSaleOptionText(item);
}

// 할인 텍스트 생성 함수
function createDiscountText(item) {
  let discountText = '';
  if (item.onSale) discountText += ' ⚡SALE';
  if (item.suggestSale) discountText += ' 💝추천';
  return discountText;
}

// 세일 옵션 텍스트 생성 함수
function createSaleOptionText(item) {
  if (item.onSale && item.suggestSale) {
    return `⚡💝${item.name} - ${item.originalVal}원 → ${item.val}원 (${DISCOUNT_RATES.BULK_PURCHASE * 100}% SUPER SALE!)`;
  }

  if (item.onSale) {
    return `⚡${item.name} - ${item.originalVal}원 → ${item.val}원 (${DISCOUNT_RATES.LIGHTNING_SALE * 100}% SALE!)`;
  }

  if (item.suggestSale) {
    return `💝${item.name} - ${item.originalVal}원 → ${item.val}원 (${DISCOUNT_RATES.SUGGEST_SALE * 100}% 추천할인!)`;
  }

  return `${item.name} - ${item.val}원`;
}

// 옵션 스타일 결정 함수
function getOptionStyle(item) {
  if (isSoldOut(item.q)) {
    return SELECT_OPTION_STYLES.SOLD_OUT;
  }

  if (item.onSale && item.suggestSale) {
    return SELECT_OPTION_STYLES.SUPER_SALE;
  }

  if (item.onSale) {
    return SELECT_OPTION_STYLES.LIGHTNING_SALE;
  }

  if (item.suggestSale) {
    return SELECT_OPTION_STYLES.SUGGEST_SALE;
  }

  return SELECT_OPTION_STYLES.NORMAL;
}

// 옵션 생성 함수
function createOptionElement(item) {
  const option = document.createElement('option');
  option.value = item.id;
  option.textContent = createOptionText(item);
  option.className = getOptionStyle(item);

  if (isSoldOut(item.q)) {
    option.disabled = true;
  }

  return option;
}

// 재고 상태에 따른 테두리 색상 설정 함수
function updateStockBorderStyle(totalStock) {
  const borderColor = isTotalLowStock(totalStock)
    ? STOCK_BORDER_COLORS.LOW_STOCK
    : STOCK_BORDER_COLORS.NORMAL;

  selector.productSelect.style.borderColor = borderColor;
}

function onUpdateSelectOptions() {
  const prodList = getProducts();
  const totalStock = prodList.reduce((sum, product) => sum + product.q, 0);

  // 기존 옵션들 제거
  selector.productSelect.innerHTML = '';

  // 새로운 옵션들 생성 및 추가
  prodList.forEach((item) => {
    const optionElement = createOptionElement(item);
    selector.productSelect.appendChild(optionElement);
  });

  // 재고 상태에 따른 테두리 스타일 업데이트
  updateStockBorderStyle(totalStock);
}

function handleCalculateCartStuff() {
  let points;
  let previousCount;
  let itemCnt = 0;
  let totalAmt = 0;
  let originalTotal = 0;
  const prodList = getProducts();

  const cartItems = selector.cartItems.children;
  let subTot = 0;
  const itemDiscounts = [];
  const lowStockItems = [];
  prodList.forEach((product) => {
    if (isLowStock(product.q)) {
      lowStockItems.push(product.name);
    }
  });
  Array.from(cartItems).forEach((cartItem) => {
    const curItem = prodList.find((product) => product.id === cartItem.id);
    const qtyElem = cartItem.querySelector('.quantity-number');
    const q = parseInt(qtyElem.textContent);
    const itemTot = curItem.val * q;
    let disc = 0;
    itemCnt += q;
    subTot += itemTot;
    const itemDiv = cartItem;
    const priceElems = itemDiv.querySelectorAll('.text-lg, .text-xs');
    priceElems.forEach(function (elem) {
      if (elem.classList.contains('text-lg')) {
        elem.style.fontWeight =
          q >= QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT ? 'bold' : 'normal';
      }
    });
    if (q >= QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT) {
      disc = curItem.discountRate;
      if (disc > 0) {
        itemDiscounts.push({ name: curItem.name, discount: disc * 100 });
      }
    }
    totalAmt += itemTot * (1 - disc);
  });
  originalTotal = subTot;

  // 대량구매 할인 적용
  let discRate = 0;
  if (itemCnt >= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
    totalAmt = calculateDiscountedPrice(subTot, DISCOUNT_RATES.BULK_PURCHASE);
    discRate = DISCOUNT_RATES.BULK_PURCHASE;
  } else {
    discRate = calculateDiscountRate(subTot, totalAmt);
  }

  // 화요일 할인 적용
  const tuesdaySpecial = selector.tuesdaySpecial;
  if (isTuesday() && totalAmt > 0) {
    totalAmt = calculateDiscountedPrice(
      totalAmt,
      DISCOUNT_RATES.TUESDAY_SPECIAL
    );
    discRate = calculateDiscountRate(originalTotal, totalAmt);
    tuesdaySpecial.classList.remove('hidden');
  } else {
    tuesdaySpecial.classList.add('hidden');
  }
  selector.headerItemCount.textContent = `🛍️ ${itemCnt} items in cart`;
  const summaryDetails = selector.summaryDetails;
  summaryDetails.innerHTML = '';
  if (subTot > 0) {
    Array.from(cartItems).forEach((cartItem) => {
      const curItem = prodList.find((product) => product.id === cartItem.id);
      const qtyElem = cartItem.querySelector('.quantity-number');
      const q = parseInt(qtyElem.textContent);
      const itemTotal = curItem.val * q;
      summaryDetails.innerHTML += html`
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${curItem.name} x ${q}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    });
    summaryDetails.innerHTML += html`
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subTot.toLocaleString()}</span>
      </div>
    `;
    if (itemCnt >= 30) {
      summaryDetails.innerHTML += html`
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else if (itemDiscounts.length > 0) {
      itemDiscounts.forEach(function (item) {
        summaryDetails.innerHTML += html`
          <div
            class="flex justify-between text-sm tracking-wide text-green-400"
          >
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }
    if (isTuesday) {
      if (totalAmt > 0) {
        summaryDetails.innerHTML += html`
          <div
            class="flex justify-between text-sm tracking-wide text-purple-400"
          >
            <span class="text-xs">🌟 화요일 추가 할인</span>
            <span class="text-xs">-10%</span>
          </div>
        `;
      }
    }
    summaryDetails.innerHTML += html`
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }
  const sum = selector.cartTotal;
  const totalDiv = sum.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = `₩${Math.round(totalAmt).toLocaleString()}`;
  }
  const loyaltyPointsDiv = selector.loyaltyPoints;
  if (loyaltyPointsDiv) {
    points = Math.floor(totalAmt / POINTS.BASE_RATE);
    if (points > 0) {
      loyaltyPointsDiv.textContent = `적립 포인트: ${points}p`;
      loyaltyPointsDiv.style.display = 'block';
    } else {
      loyaltyPointsDiv.textContent = '적립 포인트: 0p';
      loyaltyPointsDiv.style.display = 'block';
    }
  }
  const discountInfoDiv = selector.discountInfo;
  discountInfoDiv.innerHTML = '';
  if (discRate > 0 && totalAmt > 0) {
    const discountInfo = createDiscountInfo(originalTotal, discRate);
    discountInfoDiv.innerHTML = html`
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400"
            >총 할인율</span
          >
          <span class="text-sm font-medium text-green-400"
            >${discountInfo.discountRateFormatted}</span
          >
        </div>
        <div class="text-2xs text-gray-300">
          ₩${Math.round(discountInfo.discountAmount).toLocaleString()}
          할인되었습니다
        </div>
      </div>
    `;
  }
  const itemCountElement = selector.headerItemCount;
  if (itemCountElement) {
    previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = `🛍️ ${itemCnt} items in cart`;
    if (previousCount !== itemCnt) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }
  const stockMsg = prodList
    .filter((item) => isLowStock(item.q) || isSoldOut(item.q))
    .map((item) => {
      if (isLowStock(item.q)) {
        return `${item.name}: 재고 부족 (${item.q}개 남음)\n`;
      } else if (isSoldOut(item.q)) {
        return `${item.name}: 품절\n`;
      }
      return '';
    })
    .join('');
  selector.stockStatus.textContent = stockMsg;
  handleStockInfoUpdate();
  doRenderBonusPoints({ itemCnt, totalAmt });
}
const doRenderBonusPoints = function ({ itemCnt, totalAmt }) {
  if (selector.cartItems.children.length === 0) {
    selector.loyaltyPoints.style.display = 'none';
    return;
  }

  const prodList = getProducts();

  // 제품 세트 확인
  let hasKeyboard = false;
  let hasMouse = false;
  let hasMonitorArm = false;
  for (const node of selector.cartItems.children) {
    const product = prodList.find((p) => p.id === node.id);
    if (!product) continue;

    if (product.id === 'p1') {
      hasKeyboard = true;
    } else if (product.id === 'p2') {
      hasMouse = true;
    } else if (product.id === 'p3') {
      hasMonitorArm = true;
    }
  }

  // 포인트 계산 유틸 함수 사용
  const finalPoints = calculateTotalPoints({
    amount: totalAmt,
    itemCnt,
    hasKeyboard,
    hasMouse,
    hasMonitorArm,
  });

  // 포인트 상세 정보 생성
  const pointsDetail = [];
  const basePoints = calculateBasePoints(totalAmt);
  if (basePoints > 0) {
    pointsDetail.push(`기본: ${basePoints}p`);
  }

  if (isTuesday() && basePoints > 0) {
    pointsDetail.push('화요일 2배');
  }

  if (hasKeyboard && hasMouse) {
    pointsDetail.push('키보드+마우스 세트 +50p');
  }
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    pointsDetail.push('풀세트 구매 +100p');
  }
  if (itemCnt >= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
    pointsDetail.push('대량구매(30개+) +100p');
  } else if (itemCnt >= QUANTITY_THRESHOLDS.BONUS_20) {
    pointsDetail.push('대량구매(20개+) +50p');
  } else if (itemCnt >= QUANTITY_THRESHOLDS.BONUS_10) {
    pointsDetail.push('대량구매(10개+) +20p');
  }

  const ptsTag = selector.loyaltyPoints;
  if (ptsTag) {
    if (finalPoints > 0) {
      ptsTag.innerHTML = html`<div>
          적립 포인트: <span class="font-bold">${finalPoints}p</span>
        </div>
        <div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>`;
      ptsTag.style.display = 'block';
    } else {
      ptsTag.textContent = '적립 포인트: 0p';
      ptsTag.style.display = 'block';
    }
  }
};
const handleStockInfoUpdate = function () {
  let infoMsg;
  infoMsg = '';
  const prodList = getProducts();

  prodList.forEach(function (item) {
    if (isLowStock(item.q)) {
      infoMsg = `${infoMsg}${item.name}: 재고 부족 (${item.q}개 남음)\n`;
    } else if (isSoldOut(item.q)) {
      infoMsg = `${infoMsg}${item.name}: 품절\n`;
    }
  });
  selector.stockStatus.textContent = infoMsg;
};
function doUpdatePricesInCart() {
  const cartItems = selector.cartItems.children;
  const prodList = getProducts();
  Array.from(cartItems).forEach((cartItem) => {
    const itemId = cartItem.id;
    const product = prodList.find((p) => p.id === itemId);
    if (product) {
      const priceDiv = cartItem.querySelector('.text-lg');
      const nameDiv = cartItem.querySelector('h3');
      if (product.onSale && product.suggestSale) {
        priceDiv.innerHTML = html`<span class="line-through text-gray-400"
            >₩${product.originalVal.toLocaleString()}</span
          >
          <span class="text-purple-600"
            >₩${product.val.toLocaleString()}</span
          >`;
        nameDiv.textContent = `⚡💝${product.name}`;
      } else if (product.onSale) {
        priceDiv.innerHTML = html`<span class="line-through text-gray-400"
            >₩${product.originalVal.toLocaleString()}</span
          >
          <span class="text-red-500">₩${product.val.toLocaleString()}</span>`;
        nameDiv.textContent = `⚡${product.name}`;
      } else if (product.suggestSale) {
        priceDiv.innerHTML = html`<span class="line-through text-gray-400"
            >₩${product.originalVal.toLocaleString()}</span
          >
          <span class="text-blue-500">₩${product.val.toLocaleString()}</span>`;
        nameDiv.textContent = `💝${product.name}`;
      } else {
        priceDiv.textContent = `₩${product.val.toLocaleString()}`;
        nameDiv.textContent = product.name;
      }
    }
  });
  handleCalculateCartStuff();
}
main();

function handleClickAddToCartBtn() {
  const selItem = selector.productSelect.value;
  const prodList = getProducts();
  const hasItem = prodList.some((product) => product.id === selItem);
  if (!selItem || !hasItem) {
    return;
  }
  const itemToAdd = prodList.find((product) => product.id === selItem);
  if (itemToAdd && itemToAdd.q > 0) {
    const item = document.getElementById(itemToAdd['id']);
    if (item) {
      const qtyElem = item.querySelector('.quantity-number');
      const newQty = parseInt(qtyElem['textContent']) + 1;
      if (newQty <= itemToAdd.q + parseInt(qtyElem.textContent)) {
        qtyElem.textContent = newQty;
        dispatch(updateProductQuantity(itemToAdd.id, -1));
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
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
      selector.cartItems.appendChild(newItem);
      dispatch(updateProductQuantity(itemToAdd.id, -1));
    }
    handleCalculateCartStuff();
    dispatch(setLastSelectedProduct(selItem));
  }
}

function handleClickQuantityChange(event) {
  const tgt = event.target;
  if (
    tgt.classList.contains('quantity-change') ||
    tgt.classList.contains('remove-item')
  ) {
    const prodId = tgt.dataset.productId;
    const itemElem = document.getElementById(prodId);
    const prodList = getProducts();
    const prod = prodList.find((product) => product.id === prodId);
    if (tgt.classList.contains('quantity-change')) {
      const qtyChange = parseInt(tgt.dataset.change);
      const qtyElem = itemElem.querySelector('.quantity-number');
      const currentQty = parseInt(qtyElem.textContent);
      const newQty = currentQty + qtyChange;
      if (newQty > 0 && newQty <= prod.q + currentQty) {
        qtyElem.textContent = newQty;
        dispatch(updateProductQuantity(prodId, -qtyChange));
      } else if (newQty <= 0) {
        dispatch(updateProductQuantity(prodId, currentQty));
        itemElem.remove();
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (tgt.classList.contains('remove-item')) {
      const qtyElem = itemElem.querySelector('.quantity-number');
      const remQty = parseInt(qtyElem.textContent);
      dispatch(updateProductQuantity(prodId, remQty));
      itemElem.remove();
    }
    handleCalculateCartStuff();
    onUpdateSelectOptions();
  }
}
