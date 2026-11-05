const userAgent = navigator.userAgent.toLowerCase();

export const isWebKit =
  typeof CSS !== 'undefined' &&
  Boolean(CSS.supports?.('-webkit-backdrop-filter:none'));

export const isFirefox = !isWebKit && userAgent.includes('firefox');
