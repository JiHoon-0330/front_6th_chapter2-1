// 서비스 import
import { initializeUI, initializeAppState } from './services/initialization';
import { startPromotionTimers } from './services/timers';

// 메인 함수
function main() {
  initializeUI();
  initializeAppState();
  startPromotionTimers();
}

// 앱 시작
main();
