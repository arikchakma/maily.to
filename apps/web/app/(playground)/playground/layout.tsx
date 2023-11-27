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

export const metadata = {
  title: 'Playground - Maily',
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
