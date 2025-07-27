import { CartItems } from '../components/CartItems';
import { GridContainer } from '../components/GridContainer';
import { Header } from '../components/Header';
import { LeftColumn } from '../components/LeftColumn';
import { ManualColumn } from '../components/ManualColumn';
import { ManualOverlay } from '../components/ManualOverlay';
import { ManualToggle } from '../components/ManualToggle';
import { RightColumn } from '../components/RightColumn';
import { SelectorContainer } from '../components/SelectorContainer';
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
import { ProductSelect } from '../components/ProductSelect';
import { AddToCartBtn } from '../components/AddToCartBtn';
import { StockStatus } from '../components/StockStatus';
import { appendChildren } from '../utils/appendChildren';

// UI 초기화 및 이벤트 설정 함수
export function initializeUI() {
  const root = document.getElementById('app');

  if (!root) {
    throw new Error('app element not found');
  }

  appendChildren(root, [
    Header(),
    GridContainer({
      children: [
        LeftColumn({
          children: [
            SelectorContainer({
              children: [
                ProductSelect(),
                AddToCartBtn({ onClick: handleAddItemToCart }),
                StockStatus(),
              ],
            }),
            CartItems({ onClick: handleQuantityChange }),
          ],
        }),
        RightColumn(),
      ],
    }),
    ManualToggle({
      onClick: () => {
        dispatch(toggleManualOverlayAction());
        dispatch(toggleManualColumnAction());
      },
    }),
    ManualOverlay({
      onClick: () => {
        dispatch(setManualOverlayHiddenAction(true));
        dispatch(setManualColumnTranslatedAction(true));
      },
      children: [ManualColumn()],
    }),
  ]);
}

// 초기 앱 상태 설정 함수
export function initializeAppState() {
  updateProductSelectOptions();
  updateCartAndDisplay();
}
