export function isChrome(): boolean {
  return (
    typeof navigator !== 'undefined' && /chrome/i.test(navigator.userAgent)
  );
}

export function isFirefox(): boolean {
  return (
    typeof navigator !== 'undefined' && /firefox/i.test(navigator.userAgent)
  );
}

export function isSafari(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    /safari/i.test(navigator.userAgent) &&
    !isChrome() // Chrome's UA string contains 'Safari'
  );
}

export function isEdge(): boolean {
  return typeof navigator !== 'undefined' && /edg/i.test(navigator.userAgent);
}

export function isIE(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    (/trident/i.test(navigator.userAgent) || /msie/i.test(navigator.userAgent))
  );
}

export function isOpera(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    (/opr/i.test(navigator.userAgent) || /opera/i.test(navigator.userAgent))
  );
}

export function isMacOS(): boolean {
  const platform = typeof navigator === 'object' ? navigator.platform : '';
  return /Mac|iPod|iPhone|iPad/.test(platform);
}
