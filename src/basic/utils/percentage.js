/**
 * 퍼센트 관련 유틸리티 함수들
 */

/**
 * 할인율을 적용한 가격 계산
 * @param {number} originalPrice - 원래 가격
 * @param {number} discountRate - 할인율 (0~1 사이의 값)
 * @returns {number} 할인된 가격
 */
export function calculateDiscountedPrice(originalPrice, discountRate) {
  return Math.round(originalPrice * (1 - discountRate));
}

/**
 * 할인율을 적용한 가격 계산 (소수점 반올림 없음)
 * @param {number} originalPrice - 원래 가격
 * @param {number} discountRate - 할인율 (0~1 사이의 값)
 * @returns {number} 할인된 가격
 */
export function calculateDiscountedPriceWithoutRounding(
  originalPrice,
  discountRate
) {
  return originalPrice * (1 - discountRate);
}

/**
 * 할인율을 퍼센트 문자열로 변환
 * @param {number} discountRate - 할인율 (0~1 사이의 값)
 * @param {number} decimalPlaces - 소수점 자릿수 (기본값: 1)
 * @returns {string} 퍼센트 문자열 (예: "25.0%")
 */
export function formatDiscountRate(discountRate, decimalPlaces = 1) {
  return `${(discountRate * 100).toFixed(decimalPlaces)}%`;
}

/**
 * 할인율을 퍼센트 문자열로 변환 (소수점 없이)
 * @param {number} discountRate - 할인율 (0~1 사이의 값)
 * @returns {string} 퍼센트 문자열 (예: "25%")
 */
export function formatDiscountRateInteger(discountRate) {
  return `${Math.round(discountRate * 100)}%`;
}

/**
 * 할인 금액 계산
 * @param {number} originalPrice - 원래 가격
 * @param {number} discountedPrice - 할인된 가격
 * @returns {number} 할인 금액
 */
export function calculateDiscountAmount(originalPrice, discountedPrice) {
  return originalPrice - discountedPrice;
}

/**
 * 할인율 계산
 * @param {number} originalPrice - 원래 가격
 * @param {number} discountedPrice - 할인된 가격
 * @returns {number} 할인율 (0~1 사이의 값)
 */
export function calculateDiscountRate(originalPrice, discountedPrice) {
  if (originalPrice === 0) return 0;
  return (originalPrice - discountedPrice) / originalPrice;
}

/**
 * 할인 정보 객체 생성
 * @param {number} originalPrice - 원래 가격
 * @param {number} discountRate - 할인율 (0~1 사이의 값)
 * @returns {object} 할인 정보 객체
 */
export function createDiscountInfo(originalPrice, discountRate) {
  const discountedPrice = calculateDiscountedPrice(originalPrice, discountRate);
  const discountAmount = calculateDiscountAmount(
    originalPrice,
    discountedPrice
  );

  return {
    originalPrice,
    discountedPrice,
    discountRate,
    discountAmount,
    discountRateFormatted: formatDiscountRate(discountRate),
    discountRateFormattedInteger: formatDiscountRateInteger(discountRate),
  };
}
