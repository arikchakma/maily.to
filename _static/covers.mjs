import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

const WIDTH = 3840;
const HEIGHT = 1800;
const STATIC_DIR = fileURLToPath(new URL('.', import.meta.url));
const COLUMN_TOP = 280;
const WORDMARK_SIZE = 160;

const KEYWORDS = [
  'await',
  'const',
  'export',
  'from',
  'function',
  'import',
  'return',
  'type',
];

const COVERS = [
  {
    name: 'core',
    tab: 'app/editor.tsx',
    side: 'editor',
    wordmark: 'core',
    tagline:
      'The editor kernel — nodes, marks, commands,<br />and the headless UI that composes them.',
    code: `import { Editor, Toolbar } from '@maily-to/core';

<Editor.Root content={document}>
  <Toolbar.Root>
    <Toolbar.CommonActions />
    <Toolbar.Align />
    <Toolbar.Direction />
  </Toolbar.Root>

  <Editor.Frame>
    <Editor.Content />
    <Editor.BubbleMenus />
    <Editor.DragContextHandle />
  </Editor.Frame>
</Editor.Root>;`,
  },
  {
    name: 'render',
    tab: 'app/send.ts',
    side: 'server',
    wordmark: 'render',
    tagline:
      'Turn a Maily document into email-safe HTML.<br />The document carries its own styling.',
    code: `const html = await render(document, {
  variables: {
    firstName: 'Ada',
    items: [{ id: 1 }],
    cta: 'https://example.com',
  },
});

const text = await renderText(document);

const themed = await render(document, {
  theme: BASIC_NODE_THEME,
  preview: 'Your weekly digest',
});`,
  },
  {
    name: 'shared',
    tab: 'app/document.ts',
    side: 'contracts',
    wordmark: 'shared',
    tagline:
      'The document, style, and theme contracts<br />every Maily package speaks.',
    code: `const theme: NodeThemeOptions = {
  ...BASIC_NODE_THEME,
  body: { backgroundColor: '#ffffff' },
  container: { maxWidth: '600px' },
  button: { backgroundColor: '#4f46e5', color: '#ffffff' },
  link: { color: '#2563eb' },
  paragraph: { fontSize: '15px', lineHeight: '24px' },
  blockquote: { borderLeftColor: '#e5e7eb' },
  heading: { fontWeight: '600' },
  table: { borderColor: '#e5e7eb' },
  tableCell: { padding: '8px 12px' },
};`,
  },
  {
    name: 'migration',
    tab: 'app/load.ts',
    side: 'v1 → v2',
    wordmark: 'migration',
    tagline:
      'Carry a v1 document into the v2 schema,<br />with every warning it raised.',
    code: `const { json, warnings } = migrate(stored);

for (const warning of warnings) {
  console.warn(warning.nodeType, warning.field, warning.message);
}

const document = requireContentMigration(stored)
  ? json
  : stored;

if (warnings.length > 0) {
  reportMigrationWarnings(warnings);
}`,
  },
  {
    name: 'extension-variable',
    tab: 'app/extensions.ts',
    side: 'extension',
    wordmark: 'variable',
    tagline:
      'Template variables in the editor.<br />Type <span class="brand">{{</span> to insert one.',
    code: `VariableExtension.configure({
  variables: [
    { id: 'firstName' },
    { id: 'lastName' },
    { id: 'email', required: false },
    { id: 'currentDate', hideDefaultValue: true },
  ],
});

VariableExtension.configure({
  variables: ({ query, editor }) => {
    return getVariables({ query, editor });
  },
});`,
  },
  {
    name: 'extension-ai-actions',
    tab: 'app/extensions.ts',
    side: 'extension',
    wordmark: 'ai-actions',
    tagline:
      'Rewrite, summarize, and expand a selection.<br />The model stays yours.',
    code: `AIActions.configure({
  transform: async (params, ctx) => {
    const stream = await getAIStream(params.action, {
      text: params.text,
      signal: ctx.signal,
    });

    let result = '';

    for await (const chunk of stream) {
      result += chunk;
      ctx.write(result);
    }
  },
});`,
  },
  {
    name: 'extension-inline-suggestion',
    tab: 'app/extensions.ts',
    side: 'extension',
    wordmark: 'inline-suggestion',
    tagline:
      'Ghost-text autocomplete in the editor.<br />Accepted with <span class="brand">Tab</span>.',
    code: `InlineSuggestion.configure({
  suggest: async (text, ctx) => {
    const completion = await getCompletion(text, {
      signal: ctx.signal,
    });

    return completion;
  },
  triggerKey: ' ',
  acceptKey: 'Tab',
  debounceTime: 250,
});

const { currentSuggestion } = editor.storage.inlineSuggestion;`,
  },
];

function getEscaped(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function getHighlighted(code) {
  const pattern = new RegExp(
    [
      `(//[^\\n]*)`,
      `('[^'\\n]*')`,
      `\\b(${KEYWORDS.join('|')})\\b`,
      `(=>|[{}()\\[\\];:,.=<>])`,
    ].join('|'),
    'g'
  );

  let html = '';
  let cursor = 0;

  for (const match of code.matchAll(pattern)) {
    const [token, comment, string, keyword] = match;
    const className = comment
      ? 'note'
      : string
        ? 'str'
        : keyword
          ? 'kw'
          : 'punc';

    html += getEscaped(code.slice(cursor, match.index));
    html += `<span class="${className}">${getEscaped(token)}</span>`;
    cursor = match.index + token.length;
  }

  return html + getEscaped(code.slice(cursor));
}

function getDocument(props) {
  const { cover } = props;

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${cover.name} cover</title>
    <style>
      :root {
        --brand: #f13f35;
        --ink: #1f2937;
        --muted: #a5a9ae;
        --punc: #9aa4ad;
        --string: #a3603f;
        --hair: #f1f2f3;
      }

      * { margin: 0; padding: 0; box-sizing: border-box; }

      html, body {
        width: ${WIDTH}px;
        height: ${HEIGHT}px;
        background: #fff;
      }

      body {
        font-family: 'Geist Mono', monospace;
        font-variant-ligatures: none;
        -webkit-font-smoothing: antialiased;
      }

      .column {
        position: absolute;
        top: ${COLUMN_TOP}px;
        left: 1092px;
        width: 1656px;
      }

      .wordmark {
        font-family: 'Departure Mono', monospace;
        font-size: ${WORDMARK_SIZE}px;
        line-height: 1;
        letter-spacing: -0.05em;
        white-space: nowrap;
        color: var(--brand);
        -webkit-text-stroke: 8px var(--brand);
        paint-order: stroke fill;
      }

      .tagline {
        margin-top: 60px;
        font-family: 'Geist', sans-serif;
        font-size: 76px;
        line-height: 1.42;
        letter-spacing: -0.015em;
        color: #111;
      }

      .brand { color: var(--brand); }

      .panel {
        position: absolute;
        top: 820px;
        left: 1092px;
        width: 1656px;
        bottom: 0;
        border: 3px solid var(--brand);
        border-bottom: 0;
        background: #fff;
        overflow: hidden;
      }

      .tab {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        padding: 30px 44px;
        font-size: 38px;
        line-height: 1;
        color: var(--muted);
        border-bottom: 3px solid var(--hair);
      }

      .side {
        font-size: 30px;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--brand);
      }

      .code {
        padding: 44px;
        font-size: 40px;
        line-height: 2;
        color: var(--ink);
        white-space: pre;
      }

      .fade {
        position: absolute;
        inset: auto 0 0 0;
        z-index: 2;
        height: 460px;
        background: linear-gradient(
          to top,
          #fff 8%,
          rgba(255, 255, 255, 0)
        );
      }

      .kw { color: var(--brand); }
      .str { color: var(--string); }
      .punc { color: var(--punc); }
      .note { color: var(--muted); }
    </style>
  </head>
  <body>
    <div class="column">
      <div class="wordmark">${cover.wordmark}</div>

      <div class="tagline">${cover.tagline}</div>

    </div>

    <div class="panel">
      <div class="tab">${getEscaped(cover.tab)}<span class="side">${cover.side}</span></div>
      <div class="code">${getHighlighted(cover.code)}</div>
    </div>

    <div class="fade"></div>
  </body>
</html>`;
}

async function main() {
  const workDir = await mkdtemp(join(tmpdir(), 'maily-covers-'));
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
  });

  for (const cover of COVERS) {
    const file = join(workDir, `${cover.name}.html`);
    await writeFile(file, getDocument({ cover }), 'utf8');
    await page.goto(`file://${file}`);
    await page.screenshot({
      path: join(STATIC_DIR, `${cover.name}.jpg`),
      quality: 92,
      type: 'jpeg',
    });
    console.log(`rendered _static/${cover.name}.jpg`);
  }

  await browser.close();
  await rm(workDir, { recursive: true, force: true });
}

await main();
