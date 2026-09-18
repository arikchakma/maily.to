import type { InlineStyle } from '@maily-to/shared';
import {
  DATA_NODE_TYPE_KEY,
  MAILY_NODE_TYPES,
  mergeInlineStyles,
  parseInlineStyles,
  stringifyInlineStyles,
} from '@maily-to/shared';

import { getWrapperStyle } from './style';
import { getSingleCell, isBodyTable } from './table';

const HIDDEN_SELECTORS = ['[data-skip-in-text="true"]', '.preheader'].join(',');

const INHERITED_PROPERTIES = new Set([
  'color',
  'direction',
  'fontFamily',
  'fontSize',
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'letterSpacing',
  'lineHeight',
  'listStyle',
  'listStyleType',
  'textAlign',
  'textIndent',
  'textTransform',
  'whiteSpace',
  'wordSpacing',
]);

function getRules(document: Document) {
  const rules: CSSStyleRule[] = [];

  for (const source of document.querySelectorAll('style')) {
    const sheet = window.document.createElement('style');
    sheet.textContent = source.textContent;
    window.document.head.append(sheet);

    for (const rule of Array.from(sheet.sheet?.cssRules ?? [])) {
      if (rule instanceof CSSStyleRule) {
        rules.push(rule);
      }
    }

    sheet.remove();
  }

  return rules;
}

function setRuleStyles(document: Document) {
  const declared = new Map<Element, InlineStyle>();

  for (const rule of getRules(document)) {
    const style = parseInlineStyles(rule.style.cssText);

    for (const element of document.querySelectorAll(rule.selectorText)) {
      declared.set(element, { ...declared.get(element), ...style });
    }
  }

  const authored = new Map<Element, InlineStyle>();
  for (const [element] of declared) {
    authored.set(
      element,
      parseInlineStyles(element.getAttribute('style') ?? '')
    );
  }

  for (const [element, style] of declared) {
    for (const [property, value] of Object.entries(style)) {
      if (!INHERITED_PROPERTIES.has(property)) {
        continue;
      }

      for (
        let ancestor = element.parentElement;
        ancestor && ancestor !== document.body;
        ancestor = ancestor.parentElement
      ) {
        const above =
          authored.get(ancestor)?.[property] ??
          declared.get(ancestor)?.[property];

        if (above === undefined) {
          continue;
        }
        if (above === value) {
          delete style[property];
        }
        break;
      }
    }
  }

  for (const [element, style] of declared) {
    const merged = stringifyInlineStyles(
      mergeInlineStyles(style, authored.get(element) ?? {})
    );

    if (merged) {
      element.setAttribute('style', merged);
    }
  }
}

function removeHidden(document: Document) {
  for (const element of document.querySelectorAll(HIDDEN_SELECTORS)) {
    element.remove();
  }

  for (const element of document.querySelectorAll<HTMLElement>('[style]')) {
    if (element.style.display === 'none') {
      element.remove();
    }
  }
}

function getSoleImage(anchor: HTMLElement) {
  const images = anchor.querySelectorAll('img');

  return images.length === 1 && anchor.textContent?.trim() === ''
    ? images[0]
    : null;
}

function getSpacingAsMargin(style: InlineStyle): InlineStyle {
  const moved: InlineStyle = {};

  for (const [property, value] of Object.entries(style)) {
    const key = property.startsWith('padding')
      ? property.replace('padding', 'margin')
      : property;

    moved[key as keyof InlineStyle] = value;
  }

  return moved;
}

function setLinkedImages(document: Document) {
  for (const anchor of document.querySelectorAll<HTMLElement>('a[href]')) {
    const image = getSoleImage(anchor);
    if (!image) {
      continue;
    }

    const anchorStyle = anchor.getAttribute('style');
    if (anchorStyle) {
      image.setAttribute(
        'style',
        stringifyInlineStyles(
          mergeInlineStyles(
            getSpacingAsMargin(parseInlineStyles(anchorStyle)),
            parseInlineStyles(image.getAttribute('style') ?? '')
          )
        )
      );
      anchor.removeAttribute('style');
    }

    image.setAttribute('data-external-link', anchor.getAttribute('href') ?? '');
    anchor.removeAttribute('href');
  }
}

function getBodyWrapper(document: Document): HTMLElement | null {
  for (const table of document.body.querySelectorAll<HTMLElement>('table')) {
    if (
      !(table.style.maxWidth || !isBodyTable(table)) &&
      getSingleCell(table)
    ) {
      return table;
    }
  }

  return null;
}

/**
 * Every HTML document has exactly one `<body>` and it is the document, so its
 * style has to reach the body node however the source wrote it. React Email
 * splits that style in two — background on `<body>`, the rest on an inner cell,
 * because Yahoo and AOL drop body styles — so the wrapper it writes is merged
 * in and unwrapped rather than surviving as a stray table.
 */
function getBodyStyle(document: Document): string | null {
  const authored = parseInlineStyles(document.body.getAttribute('style') ?? '');
  const wrapper = getBodyWrapper(document);
  const cell = wrapper ? getSingleCell(wrapper) : null;

  if (!(wrapper && cell)) {
    return stringifyInlineStyles(authored) || null;
  }

  const merged = mergeInlineStyles(
    authored,
    parseInlineStyles(getWrapperStyle(wrapper) ?? '')
  );
  wrapper.replaceWith(...Array.from(cell.childNodes));

  return stringifyInlineStyles(merged) || null;
}

export function getNormalizedHtml(html: string) {
  const parsed = new DOMParser().parseFromString(html, 'text/html');
  if (!parsed.body) {
    return html;
  }

  setRuleStyles(parsed);
  removeHidden(parsed);
  setLinkedImages(parsed);

  const style = getBodyStyle(parsed);
  if (!style) {
    return parsed.body.innerHTML;
  }

  const wrapper = parsed.createElement('div');
  wrapper.setAttribute(DATA_NODE_TYPE_KEY, MAILY_NODE_TYPES.BODY);
  wrapper.setAttribute('style', style);
  wrapper.append(...Array.from(parsed.body.childNodes));

  return wrapper.outerHTML;
}
