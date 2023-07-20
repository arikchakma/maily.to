import NextImage from 'next/image';
import IconImage from '@/public/brand/icon.svg';

import { Editor } from '@/components/editor';
import { EditorPreview } from '@/components/editor-preview';
import { buttonVariants } from '@/components/editor/components/base-button';
import { cn } from '@/components/editor/utils/tailwind';
import { PencilIcon } from '@/app/PencilIcon';

import { GitHubIcon } from './GitHubIcon';

const components = [
  'Logo',
  'Buttons and Variants',
  'Variables',
  'Text Formatting',
  'Image',
  'Alignment',
  'Divider',
  'Spacer',
  'Footer',
];

const comingSoon = [
  'Quote',
  'Code',
  'Social',
  'Video',
  'Table',
  'List',
  'Columns',
  'Countdown',
  'Social',
];

export default function LandingPage() {
  return (
    <div>
      <div className="border-b-8 border-t-8 border-b-black border-t-black">
        <div className="mx-auto max-w-[1050px] px-7 sm:px-10">
          <div className="flex items-center justify-start gap-4 py-10 md:py-14 lg:py-20">
            <div className="flex-grow" data-hero-text="">
              <h1 className="mb-2 text-7xl font-black md:mb-3 md:text-8xl lg:mb-4 lg:text-9xl">
                maily.to
              </h1>
              <p className="text-md md:text-2xl lg:text-3xl">
                Open-source editor for crafting emails.
              </p>
              <div className="mt-4 flex flex-col items-stretch gap-2 sm:flex-row md:mt-8 lg:mt-10">
                <button className="flex items-center justify-center gap-3 rounded-xl bg-black px-7 py-3 text-2xl font-medium text-white hover:bg-red-500 focus:outline-0">
                  <PencilIcon />
                  Open Editor
                </button>

                <button className="flex items-center justify-center gap-2 rounded-xl border-4 border-black bg-white px-5 py-3 text-2xl font-medium text-black transition-colors hover:border-red-500 hover:bg-red-500 hover:text-white focus:outline-0">
                  <GitHubIcon />
                  View on Github
                </button>
              </div>
            </div>
            <div className="hidden flex-shrink-0 sm:flex">
              <NextImage
                src={IconImage}
                alt="Icon"
                className="h-[270px] w-[270px]"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-b-8 border-b-black py-24">
        <div className="mx-auto max-w-[1050px] px-7">
          <h2 className="mb-6 text-6xl font-bold">
            Designing Emails is{' '}
            <span className="line-through">&nbsp;Hard&nbsp;</span> Easy
          </h2>
          <p className="mb-14 text-3xl leading-relaxed">
            Maily is a free and{' '}
            <span className="rounded-md bg-gray-200 px-2 py-1">
              open-source editor
            </span>
            &nbsp; that makes it hassle-free to craft{' '}
            <span className="rounded-md bg-gray-200 px-2 py-1">
              beautiful emails
            </span>{' '}
            . It comes with a set of{' '}
            <span className="rounded-md bg-gray-200 px-2 py-1">
              pre-built components
            </span>{' '}
            and{' '}
            <span className="rounded-md bg-gray-200 px-2 py-1">
              opinionated design
            </span>{' '}
            that you can use to build your emails.
          </p>

          <h2 className="mb-6 text-6xl font-bold">Pre-Designed Components</h2>
          <p className="mb-9 text-3xl leading-relaxed">
            Here is a list of pre-designed components that you can use to build
            your emails. We are adding more components as we speak.
          </p>
          <ul className="flex flex-wrap gap-3">
            {components.map((component) => (
              <li>
                <span className="block rounded-xl border-4 border-black bg-transparent px-6 py-3 text-2xl font-medium text-black">
                  {component}
                </span>
              </li>
            ))}

            {comingSoon.map((component) => (
              <li>
                <span className="relative flex overflow-hidden rounded-xl border-4 border-gray-300 bg-transparent px-6 py-3 pr-14 text-2xl font-medium text-gray-300">
                  {component}
                  <span className="absolute right-0 top-0 ml-1.5 rounded-bl-xl bg-gray-100 p-1 px-2 pl-3 text-xs text-gray-800">
                    soon
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-black py-8 text-white">
        <div className="mx-auto max-w-[1050px] px-7 sm:px-10">
          <p className="text-center text-lg text-white">
            MIT Licensed © 2023
            <span className="mx-3">·</span>
            <a href="/docs/installation" className="hover:text-red-300 inline-flex items-center">
              GitHub
              <img src="/arrow.svg" className="h-3 inline-block ml-2" alt="GitHub" />
            </a>
            <span className="mx-3">·</span>
            <a href="/docs/installation" className="hover:text-red-300 inline-flex items-center">
              Twitter
              <img src="/arrow.svg" className="h-3 inline-block ml-2" alt="Twitter" />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
