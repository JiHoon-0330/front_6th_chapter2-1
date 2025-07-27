import { appendChildren } from '../utils/appendChildren';

export const ManualOverlay = ({ onClick, children }) => {
  const manualOverlay = document.createElement('div');
  manualOverlay.className =
    'fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300';
  manualOverlay.onclick = onClick;

  appendChildren(manualOverlay, children);

  return manualOverlay;
};
