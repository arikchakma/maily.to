/**
 * This plugin is a modified version of the package
 * LINK: https://www.npmjs.com/package/echo-drag-handle-plugin.
 * The original package was not working as expected while migrating.
 *
 * I will be building a new version from scratch for the drag handle plugin
 * for better usability and compatibility for me.
 * Until then, I will be using this modified version.
 */

import {
  SelectionRange,
  Selection,
  PluginKey,
  Plugin,
  EditorState,
} from '@tiptap/pm/state';
import tippy, { Instance, Tippy } from 'tippy.js';
import {
  ySyncPluginKey,
  absolutePositionToRelativePosition,
} from 'y-prosemirror';
import { NodeRange } from '@tiptap/pm/model';
import { ResolvedPos, Node as TNode } from '@tiptap/pm/model';
import { Mapping } from '@tiptap/pm/transform';
import { Editor } from '@tiptap/core';
import { Props as TippyProps } from 'tippy.js';

function getSelectionRanges(
  state: ResolvedPos,
  range: ResolvedPos,
  depth?: number
): SelectionRange[] {
  const ranges: SelectionRange[] = [];
  const root = state.node(0);
  depth =
    typeof depth === 'number' && depth >= 0
      ? depth
      : state.sameParent(range)
        ? Math.max(0, state.sharedDepth(range.pos) - 1)
        : state.sharedDepth(range.pos);
  const nodeRange = new NodeRange(state, range, depth);
  const startIndex =
    nodeRange.depth === 0 ? 0 : root.resolve(nodeRange.start).posAtIndex(0);
  nodeRange.parent.forEach((size, offset) => {
    const from = startIndex + offset;
    const to = from + size.nodeSize;
    if (from < nodeRange.start || from >= nodeRange.end) return;
    const selectionRange = new SelectionRange(
      root.resolve(from),
      root.resolve(to)
    );
    ranges.push(selectionRange);
  });
  return ranges;
}

class NodeRangeBookmark {
  anchor: number;
  head: number;
  constructor(anchor: number, head: number) {
    this.anchor = anchor;
    this.head = head;
  }
  map(mapping: Mapping) {
    return new NodeRangeBookmark(
      mapping.map(this.anchor),
      mapping.map(this.head)
    );
  }
  resolve(doc: TNode) {
    const e = doc.resolve(this.anchor);
    const o = doc.resolve(this.head);
    return new NodeRangeSelection(e, o);
  }
}

class NodeRangeSelection extends Selection {
  depth: number | undefined;

  constructor(t: ResolvedPos, e: ResolvedPos, o?: number, s: number = 1) {
    const { doc: r } = t;
    const n = t === e;
    const i = t.pos === r.content.size && e.pos === r.content.size;
    const a = n && !i ? r.resolve(e.pos + (s > 0 ? 1 : -1)) : e;
    const c = n && i ? r.resolve(t.pos - (s > 0 ? 1 : -1)) : t;
    const d = getSelectionRanges(c.min(a), c.max(a), o);
    super(
      a.pos >= t.pos ? d[0].$from : d[d.length - 1].$to,
      a.pos >= t.pos ? d[d.length - 1].$to : d[0].$from,
      d
    );
    this.depth = o;
  }
  get $to() {
    return this.ranges[this.ranges.length - 1].$to;
  }
  eq(other: Selection): boolean {
    return (
      other instanceof NodeRangeSelection &&
      other.$from.pos === this.$from.pos &&
      other.$to.pos === this.$to.pos
    );
  }
  // @ts-ignore
  map(doc: TNode, mapping: Mapping) {
    const o = doc.resolve(mapping.map(this.anchor));
    const s = doc.resolve(mapping.map(this.head));
    return new NodeRangeSelection(o, s);
  }
  toJSON() {
    return { type: 'nodeRange', anchor: this.anchor, head: this.head };
  }
  get isForwards() {
    return this.head >= this.anchor;
  }
  get isBackwards() {
    return !this.isForwards;
  }
  extendBackwards() {
    const { doc: t } = this.$from;
    if (this.isForwards && this.ranges.length > 1) {
      const t = this.ranges.slice(0, -1);
      const e = t[0].$from;
      const o = t[t.length - 1].$to;
      return new NodeRangeSelection(e, o, this.depth);
    }
    const e = this.ranges[0];
    const o = t.resolve(Math.max(0, e.$from.pos - 1));
    return new NodeRangeSelection(this.$anchor, o, this.depth);
  }
  extendForwards() {
    const { doc: t } = this.$from;
    if (this.isBackwards && this.ranges.length > 1) {
      const t = this.ranges.slice(1);
      const e = t[0].$from;
      const o = t[t.length - 1].$to;
      return new NodeRangeSelection(o, e, this.depth);
    }
    const e = this.ranges[this.ranges.length - 1];
    const o = t.resolve(Math.min(t.content.size, e.$to.pos + 1));
    return new NodeRangeSelection(this.$anchor, o, this.depth);
  }
  static fromJSON(doc: TNode, json: any) {
    return new NodeRangeSelection(
      doc.resolve(json.anchor),
      doc.resolve(json.head)
    );
  }
  static create(
    doc: TNode,
    anchor: number,
    head: number,
    depth?: number,
    bias: number = 1
  ) {
    return new this(doc.resolve(anchor), doc.resolve(head), depth, bias);
  }
  // @ts-ignore
  getBookmark(): NodeRangeBookmark {
    return new NodeRangeBookmark(this.anchor, this.head);
  }
}

function cloneElement(node: HTMLElement) {
  const clonedNode = node.cloneNode(true) as HTMLElement;
  const originalElements = [
    node,
    ...Array.from(node.getElementsByTagName('*')),
  ];
  const clonedElements = [
    clonedNode,
    ...Array.from(clonedNode.getElementsByTagName('*')),
  ];

  originalElements.forEach((element, index) => {
    const clonedElement = clonedElements[index];

    if (
      clonedElement instanceof HTMLElement &&
      element instanceof HTMLElement
    ) {
      clonedElement.style.cssText = (function (element: HTMLElement) {
        let styles = '';
        const computedStyles = getComputedStyle(element);
        for (let i = 0; i < computedStyles.length; i += 1) {
          styles += `${computedStyles[i]}:${computedStyles.getPropertyValue(computedStyles[i])};`;
        }
        return styles;
      })(element);
    }
  });

  return clonedNode;
}

function getComputedStyles(node: Element, property: any) {
  return window.getComputedStyle(node)[property];
}
function minMax(value = 0, min = 0, max = 0) {
  return Math.min(Math.max(value, min), max);
}
function removeNode(node: HTMLElement) {
  if (node.parentNode !== null && node.parentNode !== undefined) {
    node.parentNode.removeChild(node);
  }
}

export type FindElementNextToCoords = {
  x: number;
  y: number;
  direction?: 'left' | 'right';
  editor: Editor;
};

const findElementNextToCoords = (options: FindElementNextToCoords) => {
  const { x, y, direction, editor } = options;
  let resultElement = null;
  let resultNode = null;
  let d = null;
  let l = x;
  for (; null === resultNode && l < window.innerWidth && l > 0; ) {
    const elements = document.elementsFromPoint(l, y);
    const index = elements.findIndex((el) =>
      el.classList.contains('ProseMirror')
    );
    const filteredElements = elements.slice(0, index);
    if (filteredElements.length > 0) {
      const element = filteredElements[0];
      resultElement = element;
      d = editor.view.posAtDOM(element, 0);
      if (d >= 0) {
        resultNode = editor.state.doc.nodeAt(Math.max(d - 1, 0));
        if (resultNode === null || resultNode.isText) {
          resultNode = editor.state.doc.nodeAt(Math.max(d - 1, 0));
        }
        if (!resultNode) {
          resultNode = editor.state.doc.nodeAt(Math.max(d, 0));
        }
        break;
      }
    }
    if (direction === 'left') {
      l -= 1;
    } else {
      l += 1;
    }
  }
  return { resultElement, resultNode, pos: d !== null ? d : null };
};

function getSelectionRangesNearCursor(e: MouseEvent, t: Editor) {
  const { doc: n } = t.view.state,
    o = findElementNextToCoords({
      editor: t,
      x: e.clientX,
      y: e.clientY,
      direction: 'right',
    });
  if (!o.resultNode || null === o.pos) return [];
  const r = e.clientX,
    i = (function (e, t, n) {
      const o = parseInt(getComputedStyles(e.dom, 'paddingLeft'), 10),
        r = parseInt(getComputedStyles(e.dom, 'paddingRight'), 10),
        i = parseInt(getComputedStyles(e.dom, 'borderLeftWidth'), 10),
        s = parseInt(getComputedStyles(e.dom, 'borderLeftWidth'), 10),
        d = e.dom.getBoundingClientRect();
      return { left: minMax(t, d.left + o + i, d.right - r - s), top: n };
    })(t.view, r, e.clientY),
    s = t.view.posAtCoords(i);
  if (!s) return [];
  const { pos: d } = s;
  if (!n.resolve(d).parent) return [];
  const a = n.resolve(o.pos),
    p = n.resolve(o.pos + 1);
  return getSelectionRanges(a, p, 0);
}
const getPreviousNodeStartPosition = (e: TNode, t: number) => {
  const n = e.resolve(t),
    { depth: o } = n;
  if (0 === o) return t;
  return n.pos - n.parentOffset - 1;
};
const getAncestorNodeAtDepth = (e: TNode, t: number) => {
  const n = e.nodeAt(t),
    o = e.resolve(t);
  let { depth: r } = o,
    i = n;
  for (; r > 0; ) {
    const e = o.node(r);
    (r -= 1), 0 === r && (i = e);
  }
  return i;
};
const getOuterNode = (doc: EditorState, pos: number) => {
  const n = ySyncPluginKey.getState(doc);
  return n
    ? absolutePositionToRelativePosition(pos, n.type, n.binding.mapping)
    : null;
};

// @ts-ignore
const getOuterNodePos = (e, t) => {
  let n = t;
  for (; n && n.parentNode && n.parentNode !== e.dom; ) n = n.parentNode;
  return n;
};

type DragHandlePluginOptions = {
  pluginKey?: PluginKey | string;
  element: HTMLElement;
  editor: Editor;
  tippyOptions?: Partial<TippyProps>;
  onNodeChange?: (data: {
    editor: Editor;
    node: TNode | null;
    pos: number;
  }) => void;
};

export const dragHandlePluginDefaultKey = new PluginKey('dragHandle');
export function DragHandlePlugin(
  options: DragHandlePluginOptions
): Plugin<{ locked: boolean }> {
  const {
    pluginKey: e = dragHandlePluginDefaultKey,
    element,
    editor,
    tippyOptions,
    onNodeChange,
  } = options;

  const container = document.createElement('div');
  let tippyInstance: Instance | null = null;
  let x = false;
  let currentNode: TNode | null = null;
  let lastNodePos = -1;
  element.addEventListener('dragstart', (e) => {
    const { view } = editor;
    if (!e.dataTransfer) return;
    const { empty, $from, $to } = view.state.selection;
    const s = getSelectionRangesNearCursor(e, editor);
    const d = getSelectionRanges($from, $to, 0);
    const c = d.some((e) =>
      s.find((t) => t.$from === e.$from && t.$to === e.$to)
    );
    const u = empty || !c ? s : d;
    if (!u.length) return;
    const { tr: g } = view.state;
    const h = document.createElement('div');
    const y = u[0].$from.pos;
    const v = u[u.length - 1].$to.pos;
    const C = NodeRangeSelection.create(view.state.doc, y, v);
    const E = C.content();
    u.forEach((e) => {
      const t = cloneElement(view?.nodeDOM(e.$from.pos) as HTMLElement);
      h.append(t);
    });
    h.style.position = 'absolute';
    h.style.top = '-10000px';
    document.body.append(h);
    e.dataTransfer.clearData();
    e.dataTransfer.setDragImage(h, 0, 0);
    view.dragging = { slice: E, move: true };
    g.setSelection(C as unknown as Selection);
    view.dispatch(g);
    document.addEventListener('drop', () => removeNode(h), { once: true });
    setTimeout(() => {
      element && (element.style.pointerEvents = 'none');
    }, 0);
  });
  element.addEventListener('dragend', () => {
    element && (element.style.pointerEvents = 'auto');
  });

  return new Plugin({
    key: typeof e === 'string' ? new PluginKey(e) : e,
    state: {
      init: () => ({ locked: false }) as { locked: boolean },
      apply(e, t, n, o) {
        const l = e.getMeta('lockDragHandle');
        const a = e.getMeta('hideDragHandle');
        if ((undefined !== l && (x = l), a && tippyInstance)) {
          return (
            tippyInstance?.hide(),
            (x = false),
            (currentNode = null),
            (lastNodePos = -1),
            null == onNodeChange ||
              onNodeChange({ editor: editor, node: null, pos: -1 }),
            t
          );
        }
        if (e.docChanged && -1 !== lastNodePos && element && tippyInstance) {
          const t = e.mapping.map(lastNodePos);
          t !== lastNodePos &&
            ((lastNodePos = t), getOuterNode(o, lastNodePos));
        }
        return t;
      },
    },
    view: (e) => {
      var t;
      return (
        (element.draggable = true),
        (element.style.pointerEvents = 'auto'),
        null === (t = editor.view.dom.parentElement) ||
          undefined === t ||
          t.appendChild(container),
        container.appendChild(element),
        (container.style.pointerEvents = 'none'),
        (container.style.position = 'absolute'),
        (container.style.top = '0'),
        (container.style.left = '0'),
        (tippyInstance = tippy(e.dom, {
          getReferenceClientRect: null,
          interactive: true,
          trigger: 'manual',
          placement: 'left-start',
          hideOnClick: false,
          duration: 100,
          zIndex: 10,
          popperOptions: {
            modifiers: [
              { name: 'flip', enabled: false },
              {
                name: 'preventOverflow',
                options: { rootBoundary: 'document', mainAxis: false },
              },
            ],
          },
          ...tippyOptions,
          appendTo: container,
          content: element,
        })),
        {
          update(t, n) {
            if (!element || !tippyInstance) return;
            if (
              ((element.draggable = !x),
              e.state.doc.eq(n.doc) || -1 === lastNodePos)
            )
              return;
            let o = e.nodeDOM(lastNodePos) as HTMLElement;
            if (((o = getOuterNodePos(e, o)), o === e.dom)) return;
            if (1 !== (null == o ? undefined : o.nodeType)) return;
            const r = e.posAtDOM(o, 0),
              s = getAncestorNodeAtDepth(editor.state.doc, r);
            if (s !== currentNode) {
              const t = getPreviousNodeStartPosition(editor.state.doc, r);
              (currentNode = s),
                (lastNodePos = t),
                getOuterNode(e.state, lastNodePos),
                null == onNodeChange ||
                  onNodeChange({
                    editor: editor,
                    node: currentNode as TNode,
                    pos: lastNodePos,
                  }),
                tippyInstance.setProps({
                  getReferenceClientRect: () => o?.getBoundingClientRect(),
                }),
                tippyInstance.show();
            }
          },
          destroy() {
            null == tippyInstance || tippyInstance.destroy(),
              element && removeNode(container);
          },
        }
      );
    },
    props: {
      handleDOMEvents: {
        mouseleave: (e, event) => (
          x ||
            (event.target &&
              !container.contains(event?.relatedTarget as Node) &&
              (null == tippyInstance || tippyInstance.hide(),
              (currentNode = null),
              (lastNodePos = -1),
              null == onNodeChange ||
                onNodeChange({ editor: editor, node: null, pos: -1 }))),
          false
        ),
        mousemove(e, t) {
          if (!element || !tippyInstance || x) return false;
          const n = findElementNextToCoords({
            x: t.clientX,
            y: t.clientY,
            direction: 'right',
            editor: editor,
          });
          if (!n.resultElement) return false;
          let o = n.resultElement;
          if (((o = getOuterNodePos(e, o)), o === e.dom)) return false;
          if (1 !== (null == o ? undefined : o.nodeType)) return false;
          const r = e.posAtDOM(o, 0),
            s = getAncestorNodeAtDepth(editor.state.doc, r);
          if (s !== currentNode) {
            const t = getPreviousNodeStartPosition(editor.state.doc, r);
            (currentNode = s),
              (lastNodePos = t),
              getOuterNode(e.state, lastNodePos),
              null == onNodeChange ||
                onNodeChange({
                  editor: editor,
                  node: currentNode,
                  pos: lastNodePos,
                }),
              tippyInstance.setProps({
                getReferenceClientRect: () => o.getBoundingClientRect(),
              }),
              tippyInstance.show();
          }
          return false;
        },
      },
    },
  });
}
