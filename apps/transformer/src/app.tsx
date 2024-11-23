import { useEffect, useState } from 'react';

import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/themes/prism.css';

import { Transformer } from '@maily-to/transformer';

const defaultCode = `<Container
  style={{
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '600px',
    minWidth: '300px',
    padding: '0.5rem',
    width: '100%',
  }}
>
  <Heading
    as="h1"
    style={{
      color: '#111827',
      fontSize: '36px',
      fontWeight: 800,
      lineHeight: '40px',
      marginBottom: '12px',
      marginTop: 0,
      textAlign: 'left',
    }}
  >
    Hello World
  </Heading>
  <Img
    src="https://example.com/image.jpg"
    alt="Example"
    style={{
      maxWidth: '100%',
      height: 'auto'
    }}
  />
  <Hr style={{ margin: '1rem 0' }} />
  <Text
    style={{
      color: '#374151',
      fontSize: '15px',
      marginBottom: '20px',
      marginTop: '0px',
      textAlign: 'left',
    }}
  >
    This is just a simple paragraph text
  </Text>
</Container>`;

export function App() {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');

  const [transformer] = useState(() => new Transformer());

  const handleCodeChange = async (newCode: string) => {
    setCode(newCode);
    setOutput(JSON.stringify(await transformer.transform(newCode), null, 2));
  };

  useEffect(() => {
    handleCodeChange(defaultCode);
  }, []);

  return (
    <div className="min-h-screen">
      <div className="border-b border-gray-300 p-4">
        <h1 className="text-2xl font-medium">Maily Transformer</h1>
      </div>

      <div className="grid grid-cols-2">
        <div className="border-r border-gray-300 bg-white p-6">
          <h2 className="mb-4 text-xl font-medium">Input JSX</h2>
          <div className="overflow-hidden">
            <Editor
              value={code}
              onValueChange={handleCodeChange}
              highlight={(code) => highlight(code, languages.jsx, 'jsx')}
              padding={16}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 14,
                minHeight: '500px',
                backgroundColor: '#f8f9fa',
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6">
          <h2 className="mb-4 text-xl font-medium">AST Output</h2>
          <pre className="bg-gray-50 p-4 text-sm">{output}</pre>
        </div>
      </div>
    </div>
  );
}
