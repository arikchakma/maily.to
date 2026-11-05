function isChrome(): boolean {
  return (
    typeof navigator !== 'undefined' && /chrome/i.test(navigator.userAgent)
  );
}

export function isSafari(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    /safari/i.test(navigator.userAgent) &&
    !isChrome()
  );
}
