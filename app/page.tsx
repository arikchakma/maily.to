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
                <button className="flex items-center justify-center gap-3 rounded-xl bg-black px-7 py-3 text-2xl font-medium text-white hover:bg-red-500 focus:outline-0 transition-all">
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
            <span className="text-red-500 line-through">&nbsp;Hard&nbsp;</span>{' '}
            Easy
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

      <div className="border-b-8 border-b-black py-24">
        <div className="mx-auto max-w-[1050px] px-7">
          <h2 className="mb-6 text-6xl font-bold">
            <span className="text-red-400 line-through">
              &nbsp;So Many&nbsp;
            </span>{' '}
            Not Many Stars
          </h2>
          <p className="mb-4 text-3xl leading-relaxed">
            I just launched the project —— thus, not many stars.
          </p>
          <p className="mb-7 text-3xl leading-relaxed">
            Please do{' '}
            <a
              href="#"
              className="underline underline-offset-8 hover:text-red-500"
            >
              leave a star on GitHub
            </a>{' '}
            if you like the project. Also, I would love to hear from you if you
            have any feedback or suggestions.
          </p>

          <div className='flex gap-3'>
            <a
              href="https://github.com/arikchakma/maily.to"
              data-github-link=""
              target="_blank"
              className="inline-flex items-center justify-center rounded-lg border-black bg-red-300 px-5 py-2 text-lg font-medium hover:bg-red-400 md:text-xl lg:rounded-xl lg:py-4 lg:text-2xl transition-colors"
            >
              <span className="mr-3 inline-flex items-center">
                <img
                  src="/star.svg"
                  alt="Hero Image"
                  className="mr-1 h-5 md:mr-2 md:h-7"
                />{' '}
                <span className="line-through">&nbsp;100k&nbsp;</span>
              </span>
              GitHub Stars
            </a>

            <a href="/docs/installation"
               className="bg-white gap-2 justify-center text-black flex items-center font-medium text-lg md:text-xl lg:text-2xl border-4 border-black rounded-lg lg:rounded-xl py-2 lg:py-3 px-5 hover:bg-black hover:text-white transition-colors">
              <PencilIcon />
              Open Editor
            </a>
          </div>
        </div>
      </div>

      <div className="bg-black py-8 text-white">
        <div className="mx-auto max-w-[1050px] px-7 sm:px-10">
          <p className="text-center text-lg text-white">
            MIT Licensed © 2023
            <span className="mx-3">·</span>
            <a
              href="/docs/installation"
              className="inline-flex items-center hover:text-red-300"
            >
              GitHub
              <img
                src="/arrow.svg"
                className="ml-2 inline-block h-3"
                alt="GitHub"
              />
            </a>
            <span className="mx-3">·</span>
            <a
              href="/docs/installation"
              className="inline-flex items-center hover:text-red-300"
            >
              Twitter
              <img
                src="/arrow.svg"
                className="ml-2 inline-block h-3"
                alt="Twitter"
              />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
