import NextImage from 'next/image';
import IconImage from '@/public/brand/icon.svg';
import { GithubIcon } from 'lucide-react';

import { Editor } from '@/components/editor';
import { EditorPreview } from '@/components/editor-preview';
import { buttonVariants } from '@/components/editor/components/base-button';
import { cn } from '@/components/editor/utils/tailwind';

export default function LandingPage() {
  return (
    <div className="pb-10">
      <div className="mx-auto flex max-w-[680px] flex-col px-10">
        <header className="flex items-center gap-3 pb-8 pt-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-md border border-gray-200 bg-gray-100">
            <NextImage
              src={IconImage}
              alt="Icon"
              className="h-12 w-12"
              priority
            />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-800">
              maily.to
            </h1>
            <p>Editor to help you craft emails.</p>
          </div>

          <a
            href="https://github.com/arikchakma/maily.to"
            target="_blank"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'icon' }),
              'ml-auto text-gray-600 hover:text-gray-800'
            )}
          >
            <GithubIcon className="h-6 w-6" />
          </a>
        </header>

        <EditorPreview />
      </div>
    </div>
  );
}
