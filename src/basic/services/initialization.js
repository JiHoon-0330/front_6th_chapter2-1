import { createAddToCartBtn } from '../components/AddToCartBtn';
import { createCartItems } from '../components/CartItems';
import { createGridContainer } from '../components/GridContainer';
import { createHeader } from '../components/Header';
import { createLeftColumn } from '../components/LeftColumn';
import { createManualColumn } from '../components/ManualColumn';
import { createManualOverlay } from '../components/ManualOverlay';
import { createManualToggle } from '../components/ManualToggle';
import { createProductSelect } from '../components/ProductSelect';
import { createRightColumn } from '../components/RightColumn';
import { createSelectorContainer } from '../components/SelectorContainer';
import { createStockStatus } from '../components/StockStatus';
import {
  dispatch,
  setManualColumnTranslatedAction,
  setManualOverlayHiddenAction,
  toggleManualColumnAction,
  toggleManualOverlayAction,
} from '../utils/reducer';
import { updateProductSelectOptions } from './productSelect';
import { updateCartAndDisplay } from './cartService';
import { handleAddItemToCart, handleQuantityChange } from './cartOperations';

// UI 초기화 및 이벤트 설정 함수
export function initializeUI() {
  const root = document.getElementById('app');
  const header = createHeader();
  const gridContainer = createGridContainer();
  const leftColumn = createLeftColumn();
  const selectorContainer = createSelectorContainer();
  const rightColumn = createRightColumn();
  const sel = createProductSelect();
  const addBtn = createAddToCartBtn({ onClick: handleAddItemToCart });
  const stockInfo = createStockStatus();

  selectorContainer.appendChild(sel);
  selectorContainer.appendChild(addBtn);
  selectorContainer.appendChild(stockInfo);
  leftColumn.appendChild(selectorContainer);

  const cartDisp = createCartItems({ onClick: handleQuantityChange });
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
}

// 초기 앱 상태 설정 함수
export function initializeAppState() {
  updateProductSelectOptions();
  updateCartAndDisplay();
}
