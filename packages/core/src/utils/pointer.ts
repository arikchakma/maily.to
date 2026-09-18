type CapturePointerOptions = {
  element: Element;
  pointerId: number;
};

export function capturePointer(options: CapturePointerOptions): boolean {
  const { element, pointerId } = options;

  try {
    element.setPointerCapture(pointerId);

    return true;
  } catch {
    return false;
  }
}

export function releasePointer(options: CapturePointerOptions): boolean {
  const { element, pointerId } = options;

  try {
    element.releasePointerCapture(pointerId);

    return true;
  } catch {
    return false;
  }
}
