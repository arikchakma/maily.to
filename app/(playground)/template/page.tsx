import { AppEditor } from '@/components/app-editor';

export const dynamic = 'force-dynamic';

type EditorPageProps = {
  params?: {
    templateId: string;
  };
};

export default async function EditorPage(props: EditorPageProps) {
  return <AppEditor params={props.params} />;
}
