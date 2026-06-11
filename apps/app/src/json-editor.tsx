import { json as jsonLang } from '@codemirror/lang-json';
import { foldGutter, syntaxHighlighting } from '@codemirror/language';
import CodeMirror from '@uiw/react-codemirror';
import type { ReactCodeMirrorProps } from '@uiw/react-codemirror';

import { editorLightHighlightStyle, editorLightTheme } from './migration-theme';

type JsonEditorProps = {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  height?: string;
};

const READ_ONLY_BASIC_SETUP = {
  lineNumbers: true,
  foldGutter: false,
  highlightActiveLine: false,
  highlightActiveLineGutter: false,
};

const EDITABLE_BASIC_SETUP = {
  lineNumbers: true,
  foldGutter: false,
  highlightActiveLine: true,
  bracketMatching: true,
  closeBrackets: true,
  tabSize: 2,
};

function createFoldGutterMarker(open: boolean) {
  const div = document.createElement('div');
  div.style.cssText =
    'display:flex;align-items:center;justify-content:center;height:100%;width:100%;cursor:pointer;opacity:0.7';

  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  icon.setAttribute('viewBox', '0 0 24 24');
  icon.setAttribute('fill', 'none');
  icon.setAttribute('stroke', 'currentColor');
  icon.setAttribute('stroke-width', '2');
  icon.setAttribute('stroke-linecap', 'round');
  icon.setAttribute('stroke-linejoin', 'round');
  icon.setAttribute('width', '16');
  icon.setAttribute('height', '16');
  if (open) {
    icon.style.transform = 'rotate(90deg)';
  }

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'm9 18 6-6-6-6');
  icon.appendChild(path);

  div.appendChild(icon);
  div.addEventListener('mouseenter', () => {
    div.style.opacity = '1';
  });
  div.addEventListener('mouseleave', () => {
    div.style.opacity = '0.7';
  });

  return div;
}

const EXTENSIONS = [
  editorLightTheme,
  syntaxHighlighting(editorLightHighlightStyle),
  jsonLang(),
  foldGutter({ markerDOM: createFoldGutterMarker }),
];

export function JsonEditor(props: JsonEditorProps) {
  const { value, onChange, readOnly = false, height } = props;

  const cmProps: ReactCodeMirrorProps = {
    value,
    extensions: EXTENSIONS,
    basicSetup: readOnly ? READ_ONLY_BASIC_SETUP : EDITABLE_BASIC_SETUP,
    height,
  };

  if (readOnly) {
    cmProps.readOnly = true;
    cmProps.editable = false;
  } else {
    cmProps.onChange = onChange;
  }

  return <CodeMirror {...cmProps} />;
}
