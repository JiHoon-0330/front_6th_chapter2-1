/**
 * 상품 관련 유틸리티
 */

/**
 * 장바구니에 키보드, 마우스, 모니터암이 모두 있는지 확인
 */
export function hasFullSet(cartItems, prodList) {
  let hasKeyboard = false,
    hasMouse = false,
    hasMonitorArm = false;
  for (const node of cartItems) {
    const product = prodList.find((p) => p.id === node.id);
    if (!product) continue;
    if (product.id === 'p1') hasKeyboard = true;
    else if (product.id === 'p2') hasMouse = true;
    else if (product.id === 'p3') hasMonitorArm = true;
  }
  return { hasKeyboard, hasMouse, hasMonitorArm };
}
