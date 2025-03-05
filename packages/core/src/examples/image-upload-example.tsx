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
            text: "Bienvenue dans l'exemple de téléchargement d'images. Vous pouvez:",
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
                    text: "Glisser-déposer une image n'importe où dans l'éditeur",
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
                    text: 'Cliquer sur "Click or drop image here" pour sélectionner une image',
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
                    text: 'Coller une image depuis le presse-papier',
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
            text: "Voici un exemple d'image vide que vous pouvez remplacer:",
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
            text: "Essayez de glisser-déposer une image sur l'image vide ci-dessus!",
          },
        ],
      },
    ],
  });

  // Cette fonction téléchargerait normalement l'image sur votre serveur ou stockage cloud
  const handleImageUpload = async (file: Blob): Promise<string> => {
    // Simuler un délai de téléchargement
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Dans une implémentation réelle, vous téléchargeriez le fichier sur votre serveur
    // et retourneriez l'URL de l'image téléchargée
    // Pour cet exemple, nous allons créer une URL d'objet local
    return URL.createObjectURL(file);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Exemple de téléchargement d'images
      </h1>
      <p className="mb-4">
        Glissez et déposez une image dans l'éditeur ci-dessous, ou collez une
        image depuis votre presse-papier.
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
