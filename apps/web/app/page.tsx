import { EditorPreview } from '@/components/editor-preview';
import { Toaster } from 'sonner';

export default function Home() {
  return (
    <div className="max-w-xl mx-auto w-full">
      <EditorPreview />
      <Toaster richColors />
    </div>
  );
}
