// 선택 상태 관리 리듀서
export const selectionReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_LAST_SELECTED_PRODUCT':
      return action.payload.productId;

    case 'CLEAR_LAST_SELECTED_PRODUCT':
      return null;

    default:
      return state;
  }
};

// 액션 생성자들
export const setLastSelectedProduct = (productId) => ({
  type: 'SET_LAST_SELECTED_PRODUCT',
  payload: { productId },
});

export const clearLastSelectedProduct = () => ({
  type: 'CLEAR_LAST_SELECTED_PRODUCT',
});

// 선택 상태 관련 셀렉터들
export const selectLastSelectedProduct = (state) => state;

// 간단한 셀렉터 래퍼 (상태를 받아서 처리)
export const getLastSelectedProduct = (state) =>
  selectLastSelectedProduct(state);
