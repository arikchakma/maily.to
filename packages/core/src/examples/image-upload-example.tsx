import { JSONContent } from '@tiptap/react';
import { useState } from 'react';
import { Editor } from '../editor';

export function ImageUploadExample() {
  const [content, setContent] = useState<JSONContent>({
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Welcome to the image upload example. You can:',
          },
        ],
      },
      {
        type: 'bulletList',
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Drag and drop an image anywhere in the editor',
                  },
                ],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Click on "Click or drop image here" to select an image',
                  },
                ],
              },
            ],
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Paste an image from the clipboard',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: "Here's an example of an empty image that you can replace:",
          },
        ],
      },
      {
        type: 'image',
        attrs: {
          src: '',
        },
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Try to drag and drop an image onto the empty image above!',
          },
        ],
      },
    ],
  });

  // This function would normally upload the image to your server or cloud storage
  const handleImageUpload = async (file: Blob): Promise<string> => {
    // Simulate an upload delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real implementation, you would upload the file to your server
    // and return the URL of the uploaded image
    // For this example, we'll create a local object URL
    return URL.createObjectURL(file);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Image Upload Example</h1>
      <p className="mb-4">
        Drag and drop an image into the editor below, or paste an image from
        your clipboard.
      </p>
      <Editor
        contentJson={content}
        onUpdate={(editor) => setContent(editor.getJSON())}
        onImageUpload={handleImageUpload}
        config={{
          hasMenuBar: true,
          spellCheck: false,
        }}
      />
    </div>
  );
}
