import { appendChildren } from '../utils/appendChildren';

export const LeftColumn = ({ children }) => {
  const leftColumn = document.createElement('div');
  leftColumn.className = 'bg-white border border-gray-200 p-8 overflow-y-auto';

  appendChildren(leftColumn, children);

  return leftColumn;
};
