// 상품 관리 리듀서
const initialProducts = [
  {
    id: 'p1',
    name: '버그 없애는 키보드',
    val: 10000,
    originalVal: 10000,
    q: 50,
    onSale: false,
    suggestSale: false,
    discountRate: 0.1,
  },
  {
    id: 'p2',
    name: '생산성 폭발 마우스',
    val: 20000,
    originalVal: 20000,
    q: 30,
    onSale: false,
    suggestSale: false,
    discountRate: 0.15,
  },
  {
    id: 'p3',
    name: '거북목 탈출 모니터암',
    val: 30000,
    originalVal: 30000,
    q: 20,
    onSale: false,
    suggestSale: false,
    discountRate: 0.2,
  },
  {
    id: 'p4',
    name: '에러 방지 노트북 파우치',
    val: 15000,
    originalVal: 15000,
    q: 0,
    onSale: false,
    suggestSale: false,
    discountRate: 0.05,
  },
  {
    id: 'p5',
    name: '코딩할 때 듣는 Lo-Fi 스피커',
    val: 25000,
    originalVal: 25000,
    q: 10,
    onSale: false,
    suggestSale: false,
    discountRate: 0.25,
  },
];

export const productsReducer = (state = initialProducts, action) => {
  switch (action.type) {
    case 'ADD_PRODUCT':
      return [...state, action.payload];

    case 'UPDATE_PRODUCT_QUANTITY':
      return state.map((product) =>
        product.id === action.payload.productId
          ? { ...product, q: product.q + action.payload.quantityChange }
          : product
      );

    case 'SET_PRODUCT_SALE':
      return state.map((product) =>
        product.id === action.payload.productId
          ? {
              ...product,
              val: action.payload.newPrice,
              onSale: action.payload.onSale,
            }
          : product
      );

    case 'SET_PRODUCT_SUGGEST_SALE':
      return state.map((product) =>
        product.id === action.payload.productId
          ? {
              ...product,
              val: action.payload.newPrice,
              suggestSale: action.payload.suggestSale,
            }
          : product
      );

    case 'RESET_PRODUCT_SALES':
      return state.map((product) => ({
        ...product,
        val: product.originalVal,
        onSale: false,
        suggestSale: false,
      }));

    case 'LIGHTNING_SALE':
      return state.map((product) =>
        product.id === action.payload.productId
          ? {
              ...product,
              val: Math.round((product.originalVal * 80) / 100),
              onSale: true,
            }
          : product
      );

    case 'SUGGEST_SALE':
      return state.map((product) =>
        product.id === action.payload.productId
          ? {
              ...product,
              val: Math.round((product.val * (100 - 5)) / 100),
              suggestSale: true,
            }
          : product
      );

    default:
      return state;
  }
};

// 액션 생성자들
export const updateProductQuantity = (productId, quantityChange) => ({
  type: 'UPDATE_PRODUCT_QUANTITY',
  payload: { productId, quantityChange },
});

export const setProductSale = (productId, newPrice, onSale) => ({
  type: 'SET_PRODUCT_SALE',
  payload: { productId, newPrice, onSale },
});

export const setProductSuggestSale = (productId, newPrice, suggestSale) => ({
  type: 'SET_PRODUCT_SUGGEST_SALE',
  payload: { productId, newPrice, suggestSale },
});

export const resetProductSales = () => ({
  type: 'RESET_PRODUCT_SALES',
});

export const lightningSale = (productId) => ({
  type: 'LIGHTNING_SALE',
  payload: { productId },
});

export const suggestSale = (productId) => ({
  type: 'SUGGEST_SALE',
  payload: { productId },
});

// 상품 관련 셀렉터들
export const selectAllProducts = (state) => state;
export const selectProductById = (state, productId) =>
  state.find((product) => product.id === productId);
export const selectAvailableProducts = (state) =>
  state.filter((product) => product.q > 0);
export const selectLowStockProducts = (state) =>
  state.filter((product) => product.q < 5 && product.q > 0);
export const selectOutOfStockProducts = (state) =>
  state.filter((product) => product.q === 0);

// 간단한 셀렉터 래퍼들 (상태를 받아서 처리)
export const getProducts = (state) => selectAllProducts(state);
export const getProductById = (state, productId) =>
  selectProductById(state, productId);
export const getAvailableProducts = (state) => selectAvailableProducts(state);
export const getLowStockProducts = (state) => selectLowStockProducts(state);
export const getOutOfStockProducts = (state) => selectOutOfStockProducts(state);
