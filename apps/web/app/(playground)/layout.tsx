import { cookies } from 'next/headers';
import type { ReactNode } from 'react';
import { EditorProvider } from '@/stores/editor-store';
import { ENVELOPE_API_KEY, ENVELOPE_ENDPOINT } from '@/utils/constants';

interface PlaygroundLayoutProps {
  children: ReactNode;
}

export const metadata = {
  title: 'Playground - Maily',
};

export default function PlaygroundLayout(props: PlaygroundLayoutProps) {
  const { children } = props;

  const cookieStore = cookies();
  const apiKey = cookieStore.get(ENVELOPE_API_KEY)?.value;
  const endpoint = cookieStore.get(ENVELOPE_ENDPOINT)?.value;

  return (
    <EditorProvider apiKey={apiKey} endpoint={endpoint}>
      {children}
    </EditorProvider>
  );
}
