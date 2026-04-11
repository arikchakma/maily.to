import { HighlightStyle } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';
import { EditorView } from '@uiw/react-codemirror';

export const editorLightTheme = EditorView.theme(
  {
    '&': {},
    '&.cm-focused': {
      outline: 'none',
    },
    '.cm-content': {},
    '.cm-lineNumbers .cm-gutterElement': {
      color: '#6b7280',
      minWidth: '24px',
    },
    '.cm-scroller': {},
    '.cm-scroller::-webkit-scrollbar': {},
    '.cm-activeLine': {
      borderRadius: '0 4px 4px 0',
      backgroundColor: '#43434310',
    },
    '.cm-activeLineGutter': {
      backgroundColor: '#43434310',
    },
    '.cm-lineNumbers .cm-activeLineGutter': {
      borderRadius: '4px 0 0 4px',
    },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': {
      backgroundColor: '#60a5fa40',
    },
    '&.cm-focused .cm-selectionMatch': {
      backgroundColor: '#60a5fa40',
    },
    '.cm-cursor': {
      borderColor: '#18181b',
    },
    '.cm-gutters': {
      backgroundColor: 'white',
      borderRight: 'none',
    },
    '.cm-line': {
      color: '#374151',
    },
    '.cm-foldPlaceholder': {
      border: 'none',
      backgroundColor: 'transparent',
    },
    '& .cm-foldGutter .cm-gutterElement': {
      paddingLeft: '2px',
    },
    '&.cm-focused .cm-matchingBracket': {
      backgroundColor: '#70707052',
    },
  },
  {
    dark: false,
  }
);

export const editorLightHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: '#2563eb' },
  { tag: t.operator, color: '#d97706' },
  { tag: t.variableName, color: '#c026d3' },
  { tag: t.number, color: '#2563eb' },
  { tag: t.string, color: '#dc2626' },
  { tag: t.punctuation, color: '#6b7280' },
  { tag: t.typeName, color: '#c026d3' },
  { tag: t.attributeName, color: '#dc2626' },
  { tag: t.name, color: '#18181b' },
  { tag: t.comment, color: '#9ca3af' },
  { tag: t.paren, color: '#6b7280' },
  { tag: t.propertyName, color: '#1f2937' },
]);
