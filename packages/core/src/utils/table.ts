export function getSingleCell(element: HTMLElement): HTMLElement | null {
  if (isDataTable(element)) {
    return null;
  }

  const cells = element.querySelectorAll<HTMLElement>(
    ':scope > tbody > tr > td'
  );

  return cells.length === 1 ? cells[0] : null;
}

function isDataTable(element: HTMLElement): boolean {
  const border = element.getAttribute('border');

  return (
    element.querySelector(':scope > thead, :scope > tbody > tr > th') !==
      null ||
    (border !== null && border !== '0')
  );
}

export function isBodyTable(element: HTMLElement): boolean {
  return element.parentElement?.tagName === 'BODY';
}
