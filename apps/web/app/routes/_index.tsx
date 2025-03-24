import { Icons } from '~/components/icons';
import type { Route } from './+types/_index';
import { Link } from 'react-router';
import { ArrowUpRightIcon, StarIcon } from 'lucide-react';

export function headers(_: Route.HeadersArgs) {
  return {
    'Cache-Control': 'max-age=3600, s-maxage=86400',
  };
}

export default function Home(props: Route.ComponentProps) {
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
    'List',
    'Quote',
    'Code',
    'Section',
    'Columns',
    'Repeat',
    'Show',
    'Social',
  ];

  const comingSoon = ['Video', 'Table', 'Countdown'];

  return (
    <>
      <div className="border-b-8 border-t-8 border-b-black border-t-black">
        <div className="relative mx-auto max-w-[1050px] px-7 sm:px-10">
          <div className="flex items-center justify-start gap-4 py-10 md:py-14 lg:py-20">
            <div className="flex-grow">
              <h1 className="mb-2 text-6xl font-black sm:text-7xl md:mb-3 md:text-8xl lg:mb-4 lg:text-9xl">
                maily.to
              </h1>
              <p className="text-md md:text-2xl lg:text-3xl">
                Open-source editor for crafting emails.
              </p>
              <div className="mt-4 flex flex-col items-stretch gap-2 sm:flex-row md:mt-8 lg:mt-10">
                <Link
                  className="flex min-h-[72px] items-center justify-center gap-3 rounded-xl bg-black px-7 py-3 text-2xl font-medium text-white transition-all hover:bg-red-500 focus:outline-0"
                  to="/playground"
                >
                  <Icons.pencil />
                  Open Editor
                </Link>

                <a
                  className="flex items-center justify-center gap-2 rounded-xl border-4 border-black bg-white px-5 py-3 text-2xl font-medium text-black transition-colors hover:border-red-500 hover:bg-red-500 hover:text-white focus:outline-0"
                  href="https://github.com/arikchakma/maily.to"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icons.github />
                  <span className="hidden sm:inline-block">View on Github</span>
                  <span className="sm:hidden">Github</span>
                </a>
              </div>
            </div>
            <div className="hidden flex-shrink-0 lg:flex">
              <img
                alt="Maily Icon"
                className="h-[240px] w-[240px] lg:h-[270px] lg:w-[270px]"
                loading="eager"
                src="/brand/icon.svg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-b-8 border-b-black py-24">
        <div className="mx-auto max-w-[1050px] px-7">
          <h2 className="mb-4 text-3xl font-bold md:mb-6 md:text-4xl lg:text-6xl">
            Designing Emails is{' '}
            <span className="text-red-500 line-through">&nbsp;Hard&nbsp;</span>{' '}
            Easy
          </h2>
          <p className="mb-14 text-xl leading-relaxed sm:text-3xl sm:leading-relaxed">
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

          <h2 className="mb-4 text-3xl font-bold md:mb-6 md:text-4xl lg:text-6xl">
            Pre-Designed Components
          </h2>
          <p className="mb-9 text-xl leading-relaxed sm:text-3xl sm:leading-relaxed">
            Here is a list of pre-designed components that you can use to build
            your emails. We are adding more components as we speak.
          </p>
          <ul className="flex flex-wrap gap-2 md:gap-3">
            {components.map((component) => (
              <li key={component}>
                <span className="block rounded-xl border-4 border-black bg-transparent px-4 py-2 text-base font-medium text-black md:px-6 md:py-3 md:text-2xl">
                  {component}
                </span>
              </li>
            ))}

            {comingSoon.map((component) => (
              <li key={component}>
                <span className="relative flex overflow-hidden rounded-xl border-4 border-gray-300 bg-transparent px-4 py-2 pr-12 text-base font-medium text-gray-300 sm:pr-14 md:px-6 md:py-3 md:text-2xl">
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
          <h2 className="mb-6 text-4xl font-bold sm:text-6xl">
            <span className="text-red-400 line-through">
              &nbsp;So Many&nbsp;
            </span>{' '}
            Not Many Stars
          </h2>
          <p className="mb-4 text-xl leading-relaxed sm:text-3xl sm:leading-relaxed">
            I just launched the project —— thus, not many stars.
          </p>
          <p className="mb-7 text-xl leading-relaxed sm:text-3xl sm:leading-relaxed">
            Please do{' '}
            <a
              className="underline underline-offset-8 hover:text-red-500"
              href="https://github.com/arikchakma/maily.to"
              rel="noopener noreferrer"
              target="_blank"
            >
              leave a star on GitHub
            </a>{' '}
            if you like the project. Also, I would love to hear from you if you
            have any feedback or suggestions.
          </p>

          <div className="flex flex-col gap-3 md:flex-row">
            <a
              className="inline-flex min-h-[56px] items-center justify-center rounded-lg border-black bg-red-300 px-5 py-2 text-lg font-medium transition-colors hover:bg-red-400 md:text-xl lg:rounded-xl lg:py-4 lg:text-2xl"
              href="https://github.com/arikchakma/maily.to"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="mr-3 inline-flex items-center">
                <StarIcon className="mr-1 h-5 w-5 fill-current md:mr-2 md:h-7 md:w-7" />
                <span className="line-through">&nbsp;100k&nbsp;</span>
              </span>
              GitHub Stars
            </a>

            <Link
              className="flex items-center justify-center gap-2 rounded-lg border-4 border-black bg-white px-5 py-2 text-lg font-medium text-black transition-colors hover:bg-black hover:text-white md:text-xl lg:rounded-xl lg:py-3 lg:text-2xl"
              to="/playground"
            >
              <Icons.pencil />
              Open Editor
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-black py-8 text-white">
        <div className="mx-auto max-w-[1050px] px-7 sm:px-10">
          <p className="text-center text-lg text-white">
            <a
              className="hidden items-center hover:text-red-300 sm:inline-flex"
              href="https://github.com/arikchakma/maily.to"
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub
              <ArrowUpRightIcon className="ml-2 inline-block h-5 text-red-300" />
            </a>
            <span className="mx-3 hidden sm:inline-block">·</span>
            <a
              className="hidden items-center hover:text-red-300 sm:inline-flex"
              href="https://twitter.com/imarikchakma"
              rel="noopener noreferrer"
              target="_blank"
            >
              Twitter
              <ArrowUpRightIcon className="ml-2 inline-block h-5 text-red-300" />
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
