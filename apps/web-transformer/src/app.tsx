import { useEffect, useState } from 'react';

import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/themes/prism.css';

import { Parser, Transformer } from '@maily-to/transformer';
import { Editor as Maily, type MailyEditor } from '@maily-to/core';
import { renderMarkup } from '@maily-to/render';
import { useRef } from 'react';

const defaultCode = `<Html>
  <Head>
  </Head>
  <Body
    style={{
      margin: 0,
    }}
  >
    <Container
      style={{
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: "600px",
        minWidth: "300px",
        padding: "0.5rem",
        width: "100%",
      }}
    >
      <Text
        style={{
          MozOsxFontSmoothing: "grayscale",
          WebkitFontSmoothing: "antialiased",
          color: "#374151",
          fontSize: "15px",
          marginBottom: "20px",
          marginTop: "0px",
          textAlign: "left",
        }}
      >
        This is just a normal paragraph
      </Text>
    </Container>
  </Body>
</Html>`;

export function App() {
  const [code, setCode] = useState('');

  const [editor, setEditor] = useState<MailyEditor>();

  const containerRef = useRef<HTMLDivElement>(null);

  const [defaultContent, setDefaultContent] = useState<any>();
  const [parsedOutput, setParsedOutput] = useState('');
  const [mailyJSONOutput, setMailyJSONOutput] = useState('');
  const [jsxOutput, setJSXOutput] = useState('');

  const [parentTab, setParentTab] = useState<'maily' | 'jsx'>('maily');

  const [activeTab, setActiveTab] = useState<
    'maily' | 'maily-json' | 'parsed-json' | 'maily-markup'
  >('maily-markup');

  const handleCodeChange = async (newCode: string) => {
    setCode(newCode);
    const parser = new Parser();
    const transformer = new Transformer();

    setParsedOutput(JSON.stringify(await parser.parse(newCode), null, 2));

    const mailyJSON = await transformer.transform(newCode);
    setMailyJSONOutput(JSON.stringify(mailyJSON, null, 2));

    setDefaultContent(mailyJSON);
    editor?.commands?.setContent(mailyJSON);
  };

  const handleMailyChange = async (editor: MailyEditor) => {
    const json = editor.getJSON();
    setMailyJSONOutput(JSON.stringify(json, null, 2));
    const jsx = await renderMarkup(json);

    const prettier = await import('prettier/standalone');
    const formattedJSX = await prettier.format(jsx, {
      parser: 'acorn',
      plugins: [
        await import('prettier/plugins/acorn'),
        (await import('prettier/plugins/estree')).default,
      ],
    });

    setJSXOutput(formattedJSX);
  };

  useEffect(() => {
    handleCodeChange(defaultCode);
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="border-b border-gray-300 p-4">
        <h1 className="font-mono text-2xl font-bold tracking-tight">
          Maily Transformer
        </h1>
      </div>

      <div className="grid h-full grid-cols-2">
        <div className="flex flex-col border-r border-gray-300 bg-white">
          <div className="flex items-center border-b border-gray-200">
            <button
              className="flex cursor-pointer items-center border-r border-gray-200 p-2 px-3 font-mono leading-none data-[active=true]:bg-zinc-900 data-[active=true]:text-white"
              onClick={() => {
                setParentTab('maily');
                setActiveTab('maily-markup');
              }}
              data-active={parentTab === 'maily'}
            >
              Maily
            </button>

            <button
              className="flex cursor-pointer items-center border-r border-gray-200 p-2 px-3 font-mono leading-none data-[active=true]:bg-zinc-900 data-[active=true]:text-white"
              onClick={() => {
                setParentTab('jsx');
                setActiveTab('maily-json');
              }}
              data-active={parentTab === 'jsx'}
            >
              JSX
            </button>
          </div>

          <div className="relative grow" ref={containerRef}>
            <div className="absolute inset-0 overflow-y-scroll">
              {parentTab === 'jsx' && (
                <Editor
                  value={code}
                  onValueChange={handleCodeChange}
                  highlight={(code) => highlight(code, languages.jsx, 'jsx')}
                  padding={16}
                  tabSize={2}
                  style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 14,
                    minHeight: '500px',
                    backgroundColor: '#f8f9fa',
                  }}
                />
              )}

              {parentTab === 'maily' && (
                <Maily
                  config={{
                    hasMenuBar: false,
                    bodyClassName: '!mt-0 font-sans border-none',
                    contentClassName: 'mx-auto',
                  }}
                  onCreate={handleMailyChange}
                  onUpdate={handleMailyChange}
                  bubbleMenuAppendTo={containerRef}
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col bg-white">
          <div className="flex items-center border-b border-gray-200">
            {parentTab === 'maily' && (
              <button
                className="flex cursor-pointer items-center border-r border-gray-200 p-2 px-3 font-mono leading-none data-[active=true]:bg-zinc-900 data-[active=true]:text-white"
                onClick={() => setActiveTab('maily-markup')}
                data-active={activeTab === 'maily-markup'}
              >
                Maily Markup
              </button>
            )}

            <button
              className="flex cursor-pointer items-center border-r border-gray-200 p-2 px-3 font-mono leading-none data-[active=true]:bg-zinc-900 data-[active=true]:text-white"
              onClick={() => setActiveTab('maily-json')}
              data-active={activeTab === 'maily-json'}
            >
              Maily JSON
            </button>

            {parentTab === 'jsx' && (
              <>
                <button
                  className="flex cursor-pointer items-center border-r border-gray-200 p-2 px-3 font-mono leading-none data-[active=true]:bg-zinc-900 data-[active=true]:text-white"
                  onClick={() => setActiveTab('parsed-json')}
                  data-active={activeTab === 'parsed-json'}
                >
                  AST Output (Parsed)
                </button>

                <button
                  className="flex cursor-pointer items-center border-r border-gray-200 p-2 px-3 font-mono leading-none data-[active=true]:bg-zinc-900 data-[active=true]:text-white"
                  onClick={async () => {
                    setActiveTab('maily');
                    await handleCodeChange(code);
                  }}
                  data-active={activeTab === 'maily'}
                >
                  Maily Preview
                </button>
              </>
            )}
          </div>

          <div className="relative grow">
            <div className="absolute inset-0 overflow-y-scroll">
              <pre className="bg-gray-50 p-4 text-sm">
                {activeTab === 'maily-json' && mailyJSONOutput}
                {activeTab === 'parsed-json' &&
                  parentTab === 'jsx' &&
                  parsedOutput}
                {activeTab === 'maily-markup' &&
                  parentTab === 'maily' &&
                  jsxOutput}
                {activeTab === 'maily' && parentTab === 'jsx' && (
                  <Maily
                    contentJson={defaultContent}
                    onCreate={setEditor}
                    onUpdate={setEditor}
                    config={{
                      hasMenuBar: false,
                      bodyClassName: '!mt-0 font-sans',
                    }}
                  />
                )}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
