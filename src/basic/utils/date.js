/**
 * 날짜/요일 관련 유틸리티
 */
import { DAYS } from './constants';

/**
 * 화요일 여부
 */
export function isTuesday(date = new Date()) {
  return date.getDay() === DAYS.TUESDAY;
}

/**
 * 요일 이름 반환 (0: 일요일 ~ 6: 토요일)
 */
export function getDayName(date = new Date()) {
  return ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
}
