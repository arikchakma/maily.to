import { Metadata } from 'next';
import { cookies } from 'next/headers';
import type { ReactNode } from 'react';
import { EditorProvider } from '@/stores/editor-store';
import {
  MAILY_API_KEY,
  MAILY_ENDPOINT,
  MAILY_PROVIDER,
} from '@/utils/constants';

interface PlaygroundLayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: 'Playground | Maily',
  description:
    'Try out Maily, the Open-source editor for crafting emails.',
  twitter: {
    creator: '@imarikchakma',
    title: 'Playground | Maily',
    description:
      'Try out Maily, the Open-source editor for crafting emails.',
    card: 'summary_large_image',
  },
  openGraph: {
    title: 'Playground | Maily',
    description:
      'Try out Maily, the Open-source editor for crafting emails.',
    images: {
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Maily Preview',
    },
  },
};

export default function PlaygroundLayout(props: PlaygroundLayoutProps) {
  const { children } = props;

  const cookieStore = cookies();
  const apiKey = cookieStore.get(MAILY_API_KEY)?.value;
  const endpoint = cookieStore.get(MAILY_ENDPOINT)?.value;
  const provider = cookieStore.get(MAILY_PROVIDER)?.value;

  return (
    <EditorProvider apiKey={apiKey} endpoint={endpoint} provider={provider}>
      {children}
    </EditorProvider>
  );
}
