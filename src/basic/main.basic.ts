import { CartItems } from './components/cart/cart-items';
import { AddToCartBtn } from './components/grid/add-to-cart-button';
import { GridContainer } from './components/grid/grid-container';
import { LeftColumn } from './components/grid/left-column';
import { ProductSelect } from './components/product-select/product-select';
import { RightColumn } from './components/grid/right-column';
import { SelectorContainer } from './components/grid/selector-container';
import { StockStatus } from './components/grid/stock-status';
import { Header } from './components/header';
import { ManualColumn } from './components/manual/manual-column';
import { ManualOverlay } from './components/manual/manual-overlay';
import { ManualToggle } from './components/manual/manual-toggle';
import {
  applyLightningSale,
  applySuggestSale,
  findProduct,
  getProductCount,
  getProducts,
  hasAllSale,
  hasLightningSale,
  hasSuggestSale,
  isLowStock,
  isSoldOut,
  isLowTotalQuantity,
} from './model/products';
import { appendChildren } from './utils/append-children';
import { CART_ITEMS_ID, selectById, STOCK_STATUS_ID } from './utils/selector';
import { ProductSelectOption } from './components/product-select/product-select-option';
import { renderHeaderItemCount } from './render/header';
import { getCartTotalCount } from './model/cart';
import { renderDiscountInfo } from './render/discount-info';

let bonusPts = 0;
let lastSel: unknown;
let finalTotalPrice = 0;
const PRODUCT_ONE = 'p1';
const p2 = 'p2';
const product_3 = 'p3';
const p4 = 'p4';
const PRODUCT_5 = 'p5';

function main() {
  finalTotalPrice = 0;

  const root = document.getElementById('app');

  if (!root) {
    throw new Error('root not found');
  }

  appendChildren(root, [
    Header(),
    GridContainer({
      children: [
        LeftColumn({
          children: [
            SelectorContainer({
              children: [ProductSelect(), AddToCartBtn(), StockStatus()],
            }),
            CartItems(),
          ],
        }),
        RightColumn(),
      ],
    }),
    ManualToggle(),
    ManualOverlay({
      children: [ManualColumn()],
    }),
  ]);

  handleCalculateCartStuff();
  const lightningDelay = Math.random() * 10000;
  setTimeout(() => {
    setInterval(function () {
      const productCount = getProductCount();
      const products = getProducts();
      const randomIndex = Math.floor(Math.random() * productCount);
      const currentProduct = products[randomIndex];

      if (!isSoldOut(currentProduct) && !hasLightningSale(currentProduct)) {
        applyLightningSale(currentProduct.id);
        alert(
          '⚡번개세일! ' + currentProduct.name + '이(가) 20% 할인 중입니다!'
        );
        updateProductSelect();
        doUpdatePricesInCart();
      }
    }, 30000);
  }, lightningDelay);
  setTimeout(function () {
    setInterval(function () {
      if (lastSel) {
        const productCount = getProductCount();
        const products = getProducts();

        let suggest = null;
        for (let k = 0; k < productCount; k++) {
          const product = products[k];
          if (product.id !== lastSel) {
            if (product.quantity > 0) {
              if (!hasSuggestSale(product)) {
                suggest = product;
                break;
              }
            }
          }
        }
        if (suggest) {
          alert(
            '💝 ' +
              suggest.name +
              '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'
          );
          applySuggestSale(suggest.id);
          updateProductSelect();
          doUpdatePricesInCart();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

export function updateProductSelect() {
  updateOptions();
  updateBorderColor();
}

function updateOptions() {
  const productSelect = selectById<HTMLSelectElement>('product-select');
  const prevSelected = productSelect.value;
  const products = getProducts();
  productSelect.innerHTML = products.map(ProductSelectOption).join('');
  productSelect.value = prevSelected;
}

function updateBorderColor() {
  const productSelect = selectById<HTMLSelectElement>('product-select');
  productSelect.style.borderColor = isLowTotalQuantity() ? 'orange' : '';
}

export function handleCalculateCartStuff() {
  const cartTotalCount = getCartTotalCount();

  let savedAmount;
  let points;
  let previousCount;
  let stockMsg;
  finalTotalPrice = 0;

  let originalTotal = finalTotalPrice;
  const cartDisp = selectById(CART_ITEMS_ID);

  const cartItems = cartDisp.children;
  let productTotal = 0;
  const itemDiscounts = [];

  for (let i = 0; i < cartItems.length; i++) {
    const curItem = findProduct(cartItems[i].id);

    const quantity =
      +cartItems[i].querySelector('.quantity-number').textContent;
    const cartItemTotal = curItem.price * quantity;
    let disc = 0;
    productTotal += cartItemTotal;
    const itemDiv = cartItems[i];
    const priceElems = itemDiv.querySelectorAll('.text-lg, .text-xs');
    priceElems.forEach(function (elem) {
      if (elem.classList.contains('text-lg')) {
        elem.style.fontWeight = quantity >= 10 ? 'bold' : 'normal';
      }
    });
    if (quantity >= 10) {
      if (curItem.id === PRODUCT_ONE) {
        disc = 10 / 100;
      } else {
        if (curItem.id === p2) {
          disc = 15 / 100;
        } else {
          if (curItem.id === product_3) {
            disc = 20 / 100;
          } else {
            if (curItem.id === p4) {
              disc = 5 / 100;
            } else {
              if (curItem.id === PRODUCT_5) {
                disc = 25 / 100;
              }
            }
          }
        }
      }
      if (disc > 0) {
        itemDiscounts.push({ name: curItem.name, discount: disc * 100 });
      }
    }
    finalTotalPrice += cartItemTotal * (1 - disc);
  }
  let discountRate = 0;
  originalTotal = productTotal;
  if (cartTotalCount >= 30) {
    finalTotalPrice = (productTotal * 75) / 100;
    discountRate = 25 / 100;
  } else {
    discountRate = (productTotal - finalTotalPrice) / productTotal;
  }
  const today = new Date();
  const isTuesday = today.getDay() === 2;
  const tuesdaySpecial = document.getElementById('tuesday-special');
  if (isTuesday) {
    if (finalTotalPrice > 0) {
      finalTotalPrice = (finalTotalPrice * 90) / 100;
      discountRate = 1 - finalTotalPrice / originalTotal;
      tuesdaySpecial.classList.remove('hidden');
    } else {
      tuesdaySpecial.classList.add('hidden');
    }
  } else {
    tuesdaySpecial.classList.add('hidden');
  }

  // 헤더 카운트
  renderHeaderItemCount(cartTotalCount);

  // 주문내역 요약
  const summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';
  if (productTotal > 0) {
    const productCount = getProductCount();
    const products = getProducts();
    for (let i = 0; i < cartItems.length; i++) {
      let curItem;
      for (let j = 0; j < productCount; j++) {
        const product = products[j];
        if (product.id === cartItems[i].id) {
          curItem = product;
          break;
        }
      }
      const qtyElem = cartItems[i].querySelector('.quantity-number');
      const q = parseInt(qtyElem.textContent);
      const itemTotal = curItem.val * q;
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${curItem.name} x ${q}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    }
    summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${productTotal.toLocaleString()}</span>
      </div>
    `;
    if (cartTotalCount >= 30) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else if (itemDiscounts.length > 0) {
      itemDiscounts.forEach(function (item) {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }
    if (isTuesday) {
      if (finalTotalPrice > 0) {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-purple-400">
            <span class="text-xs">🌟 화요일 추가 할인</span>
            <span class="text-xs">-10%</span>
          </div>
        `;
      }
    }
    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }
  const sum = selectById('cart-total');
  const totalDiv = sum.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = '₩' + Math.round(finalTotalPrice).toLocaleString();
  }
  const loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (loyaltyPointsDiv) {
    points = Math.floor(finalTotalPrice / 1000);
    if (points > 0) {
      loyaltyPointsDiv.textContent = '적립 포인트: ' + points + 'p';
      loyaltyPointsDiv.style.display = 'block';
    } else {
      loyaltyPointsDiv.textContent = '적립 포인트: 0p';
      loyaltyPointsDiv.style.display = 'block';
    }
  }

  renderDiscountInfo({
    discountRate,
    originalTotal,
    finalTotalPrice,
  });
  // const discountInfoDiv = document.getElementById('discount-info');
  // discountInfoDiv.innerHTML = '';
  // if (discountRate > 0 && finalTotalPrice > 0) {
  //   savedAmount = originalTotal - finalTotalPrice;
  //   discountInfoDiv.innerHTML = `
  //     <div class="bg-green-500/20 rounded-lg p-3">
  //       <div class="flex justify-between items-center mb-1">
  //         <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
  //         <span class="text-sm font-medium text-green-400">${(discountRate * 100).toFixed(1)}%</span>
  //       </div>
  //       <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
  //     </div>
  //   `;
  // }
  const itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = '🛍️ ' + cartTotalCount + ' items in cart';
    if (previousCount !== cartTotalCount) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }
  stockMsg = '';
  const productCount = getProductCount();
  const products = getProducts();
  for (let stockIdx = 0; stockIdx < productCount; stockIdx++) {
    const product = products[stockIdx];
    if (product.quantity < 5) {
      if (product.quantity > 0) {
        stockMsg =
          stockMsg +
          product.name +
          ': 재고 부족 (' +
          product.quantity +
          '개 남음)\n';
      } else {
        stockMsg = stockMsg + product.name + ': 품절\n';
      }
    }
  }
  const stockInfo = selectById(STOCK_STATUS_ID);
  stockInfo.textContent = stockMsg;
  updateStockStatus();
  doRenderBonusPoints();
}

const doRenderBonusPoints = function () {
  const cartDisp = selectById(CART_ITEMS_ID);
  const cartTotalCount = getCartTotalCount();

  if (cartDisp.children.length === 0) {
    document.getElementById('loyalty-points').style.display = 'none';
    return;
  }
  const basePoints = Math.floor(finalTotalPrice / 1000);
  let finalPoints = 0;
  const pointsDetail = [];
  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push('기본: ' + basePoints + 'p');
  }
  if (new Date().getDay() === 2) {
    if (basePoints > 0) {
      finalPoints = basePoints * 2;
      pointsDetail.push('화요일 2배');
    }
  }
  let hasKeyboard = false;
  let hasMouse = false;
  let hasMonitorArm = false;
  const productCount = getProductCount();
  const products = getProducts();
  for (const node of cartDisp.children) {
    let product = null;
    for (let pIdx = 0; pIdx < productCount; pIdx++) {
      const _product = products[pIdx];
      if (_product.id === node.id) {
        product = _product;
        break;
      }
    }
    if (!product) continue;
    if (product.id === PRODUCT_ONE) {
      hasKeyboard = true;
    } else if (product.id === p2) {
      hasMouse = true;
    } else if (product.id === product_3) {
      hasMonitorArm = true;
    }
  }
  if (hasKeyboard && hasMouse) {
    finalPoints = finalPoints + 50;
    pointsDetail.push('키보드+마우스 세트 +50p');
  }
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints = finalPoints + 100;
    pointsDetail.push('풀세트 구매 +100p');
  }

  if (cartTotalCount >= 30) {
    finalPoints = finalPoints + 100;
    pointsDetail.push('대량구매(30개+) +100p');
  } else {
    if (cartTotalCount >= 20) {
      finalPoints = finalPoints + 50;
      pointsDetail.push('대량구매(20개+) +50p');
    } else {
      if (cartTotalCount >= 10) {
        finalPoints = finalPoints + 20;
        pointsDetail.push('대량구매(10개+) +20p');
      }
    }
  }
  bonusPts = finalPoints;
  const ptsTag = document.getElementById('loyalty-points');
  if (ptsTag) {
    if (bonusPts > 0) {
      ptsTag.innerHTML =
        '<div>적립 포인트: <span class="font-bold">' +
        bonusPts +
        'p</span></div>' +
        '<div class="text-2xs opacity-70 mt-1">' +
        pointsDetail.join(', ') +
        '</div>';
      ptsTag.style.display = 'block';
    } else {
      ptsTag.textContent = '적립 포인트: 0p';
      ptsTag.style.display = 'block';
    }
  }
};

function updateStockStatus() {
  const products = getProducts();
  const stockStatus = products
    .reduce<string[]>((acc, product) => {
      if (isSoldOut(product)) {
        acc.push(`${product.name}: 품절`);
      }

      if (isLowStock(product)) {
        acc.push(`${product.name}: 재고 부족 (${product.quantity}개 남음)`);
      }

      return acc;
    }, [])
    .join('\n');

  selectById(STOCK_STATUS_ID).textContent = stockStatus;
}

function doUpdatePricesInCart() {
  const cartItems = cartDisp.children;
  const productCount = getProductCount();
  const products = getProducts();

  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    let product = null;
    for (let productIdx = 0; productIdx < productCount; productIdx++) {
      const _product = products[productIdx];
      if (_product.id === itemId) {
        product = _product;
        break;
      }
    }

    if (product) {
      const priceDiv = cartItems[i].querySelector('.text-lg');
      const nameDiv = cartItems[i].querySelector('h3');
      if (hasAllSale(product)) {
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalPrice.toLocaleString() +
          '</span> <span class="text-purple-600">₩' +
          product.price.toLocaleString() +
          '</span>';
        nameDiv.textContent = '⚡💝' + product.name;
      } else if (hasLightningSale(product)) {
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalPrice.toLocaleString() +
          '</span> <span class="text-red-500">₩' +
          product.price.toLocaleString() +
          '</span>';
        nameDiv.textContent = '⚡' + product.name;
      } else if (hasSuggestSale(product)) {
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalPrice.toLocaleString() +
          '</span> <span class="text-blue-500">₩' +
          product.price.toLocaleString() +
          '</span>';
        nameDiv.textContent = '💝' + product.name;
      } else {
        priceDiv.textContent = '₩' + product.price.toLocaleString();
        nameDiv.textContent = product.name;
      }
    }
  }
  handleCalculateCartStuff();
}

main();
