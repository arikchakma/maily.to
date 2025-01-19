import type { Route } from './+types/template';
import { Link, redirect, useFetcher } from 'react-router';
import { createSupabaseServerClient } from '~/lib/supabase/server';
import { Editor } from '@maily-to/core';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { PreviewTextInfo } from '~/components/preview-text-info';
import {
  ArrowLeftIcon,
  ArrowUpRight,
  ClipboardCopyIcon,
  CogIcon,
  EyeIcon,
  PlusIcon,
  SaveIcon,
  SendIcon,
  SettingsIcon,
  XIcon,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { render } from '@maily-to/render';
import { EmailEditor } from '~/components/email-editor';
import type { Editor as TiptapEditor } from '@tiptap/core';
import { toast } from 'sonner';
import { useCopyToClipboard } from '~/hooks/use-copy-to-clipboard';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Playground | Maily' },
    {
      name: 'description',
      content: 'Try out Maily, the Open-source editor for crafting emails.',
    },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const json = formData.get('json');

  console.log(json);

  if (!json) {
    return {
      status: 400,
      message: 'No JSON provided',
    };
  }

  const html = await render(JSON.parse(json.toString()), {
    pretty: true,
  });
  console.log(html);
  return { html };
}

export async function loader(args: Route.LoaderArgs) {
  const { request, params } = args;
  const { templateId } = params;

  const headers = new Headers();
  const supabase = createSupabaseServerClient(request, headers);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login', { headers });
  }

  const { data: template } = await supabase
    .from('mails')
    .select('*')
    .eq('id', templateId)
    .eq('user_id', user.id)
    .single();

  if (!template) {
    return redirect('/templates');
  }

  return { template };
}

export default function TemplatePage(props: Route.ComponentProps) {
  const { loaderData } = props;
  const { template } = loaderData;

  const fetcher = useFetcher();

  const [subject, setSubject] = useState(template?.title);
  const [previewText, setPreviewText] = useState(template?.preview_text || '');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [replyTo, setReplyTo] = useState('');
  const [editor, setEditor] = useState<TiptapEditor | null>(null);
  const [_, copy] = useCopyToClipboard();

  return (
    <div>
      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 p-4">
        <div className="flex items-stretch gap-0.5 rounded-lg border border-gray-200 bg-white p-0.5">
          <Button className="size-7 px-2" variant="ghost" size="sm">
            <ArrowLeftIcon className="mly-stroke-[2.5] size-3 shrink-0" />
            <span className="sr-only">Back</span>
          </Button>

          <div className="flex h-7 min-w-40 max-w-52 items-center justify-start rounded-md border px-2 pr-3 text-sm">
            <span className="truncate">{template?.title}</span>
          </div>

          <Button className="size-7 px-2" variant="ghost" size="sm">
            <PlusIcon className="mly-stroke-[2.5] size-3 shrink-0" />
            <span className="sr-only">New Email</span>
          </Button>
          <Button className="size-7 px-2" variant="ghost" size="sm">
            <SettingsIcon className="mly-stroke-[2.5] size-3 shrink-0" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
        <div className="flex items-stretch gap-0.5 rounded-lg border border-gray-200 bg-white p-0.5">
          <fetcher.Form
            method="post"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData();
              formData.set('json', JSON.stringify(editor?.getJSON()));

              fetcher.submit(formData, {
                method: 'post',
              });
            }}
          >
            <Button
              className="size-7 px-2"
              variant="ghost"
              size="sm"
              type="submit"
            >
              <ClipboardCopyIcon className="mly-stroke-[2.5] size-3 shrink-0" />
              <span className="sr-only">Copy Email</span>
            </Button>
          </fetcher.Form>

          <Button className="size-7 px-2" variant="ghost" size="sm">
            <EyeIcon className="mly-stroke-[2.5] size-3 shrink-0" />
            <span className="sr-only">Preview Email</span>
          </Button>
          <Button className="size-7 px-2" variant="ghost" size="sm">
            <SendIcon className="mly-stroke-[2.5] size-3 shrink-0" />
            <span className="sr-only">Send Email</span>
          </Button>
          <Button className="h-7 gap-2 px-2 font-normal" size="sm">
            <SaveIcon className="mly-stroke-[2.5] size-3 shrink-0" />
            <span className="text-sm">Save Email</span>
          </Button>
        </div>
      </div>

      <EmailEditor
        template={template}
        subject={subject}
        setSubject={setSubject}
        previewText={previewText}
        setPreviewText={setPreviewText}
        from={from}
        setFrom={setFrom}
        to={to}
        setTo={setTo}
        replyTo={replyTo}
        setReplyTo={setReplyTo}
        setEditor={setEditor}
      />
    </div>
  );
}
