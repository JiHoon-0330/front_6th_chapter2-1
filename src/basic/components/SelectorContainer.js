import { appendChildren } from '../utils/appendChildren';

export const SelectorContainer = ({ children }) => {
  const selectorContainer = document.createElement('div');
  selectorContainer.className = 'mb-6 pb-6 border-b border-gray-200';

  appendChildren(selectorContainer, children);

  return selectorContainer;
};
