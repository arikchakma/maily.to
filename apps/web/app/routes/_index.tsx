import {
  AlignCenterIcon,
  BracesIcon,
  Code2Icon,
  Columns3Icon,
  EyeIcon,
  ImageIcon,
  LayoutIcon,
  ListIcon,
  MinusIcon,
  MessageSquareTextIcon,
  MousePointerClickIcon,
  MoveVerticalIcon,
  PanelBottomIcon,
  PlayIcon,
  QuoteIcon,
  Repeat2Icon,
  Share2Icon,
  SparklesIcon,
  StarIcon,
  TableIcon,
  TagIcon,
  TimerIcon,
  TypeIcon,
} from 'lucide-react';
import { Link } from 'react-router';

import { Icons } from '~/components/icons';
import { FeatureAccordion } from '~/components/landing/feature-accordion';
import { TrustedBy } from '~/components/landing/trusted-by';

import type { Route } from './+types/_index';

export function headers(_: Route.HeadersArgs) {
  return {
    'Cache-Control': 'max-age=3600, s-maxage=86400',
  };
}

export default function Home(_props: Route.ComponentProps) {
  return (
    <main>
      <div className="border-y-8 border-black">
        <div className="relative mx-auto max-w-5xl px-7 py-10 sm:px-10 md:py-14 lg:py-20">
          <div className="flex items-center justify-start gap-4">
            <div className="grow">
              <h1 className="mb-3 text-6xl font-semibold tracking-tight sm:text-7xl md:mb-4 md:text-8xl lg:mb-5 lg:text-9xl">
                maily
              </h1>
              <p className="text-lg md:text-2xl lg:text-3xl">
                Open-source editor for crafting emails.
              </p>
              <div className="mt-4 flex flex-col items-stretch gap-2 sm:flex-row md:mt-8 lg:mt-10">
                <Link
                  className="flex min-h-[72px] items-center justify-center gap-3 bg-black px-7 py-3 text-2xl font-medium text-white transition-colors hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  to="/playground"
                >
                  <Icons.pencil aria-hidden="true" />
                  Open Editor
                </Link>

                <a
                  className="flex items-center justify-center gap-2 border-4 border-black bg-white px-5 py-3 text-2xl font-medium text-black transition-colors hover:border-ink hover:bg-ink hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  href="https://github.com/arikchakma/maily.to"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icons.github aria-hidden="true" />
                  <span className="hidden sm:inline-block">View on GitHub</span>
                  <span className="sm:hidden">GitHub</span>
                </a>
              </div>

              <TrustedBy />
            </div>
            <div className="hidden shrink-0 lg:flex">
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
        <div className="mx-auto max-w-5xl px-7 sm:px-10">
          <h2 className="mb-4 text-3xl font-semibold tracking-tight md:mb-4 md:text-4xl lg:text-6xl">
            Designing Emails is{' '}
            <span className="text-ink line-through">&nbsp;Hard&nbsp;</span> Easy
          </h2>
          <p className="mb-14 text-xl leading-relaxed sm:text-3xl sm:leading-relaxed">
            Maily is a free and{' '}
            <span className="bg-ink-dim px-2 py-1 text-black">
              open-source editor
            </span>
            &nbsp; that makes it hassle-free to craft{' '}
            <span className="bg-ink-dim px-2 py-1 text-black">
              beautiful emails
            </span>
            . It comes with a set of{' '}
            <span className="bg-ink-dim px-2 py-1 text-black">
              pre-built components
            </span>{' '}
            and{' '}
            <span className="bg-ink-dim px-2 py-1 text-black">
              opinionated design
            </span>{' '}
            that you can use to build your emails.
          </p>

          <h2 className="mb-4 text-3xl font-semibold tracking-tight md:mb-4 md:text-4xl lg:text-6xl">
            Pre-Designed Components
          </h2>
          <p className="mb-9 text-xl leading-relaxed sm:text-3xl sm:leading-relaxed">
            Here is a list of pre-designed components that you can use to build
            your emails. We are adding more components as we speak.
          </p>
          <ul className="flex flex-wrap gap-2 md:gap-3">
            {EDITOR_COMPONENTS.map((component) => {
              const Icon = component.icon;
              return (
                <li key={component.name}>
                  <span className="flex items-center gap-2 border-2 border-black px-4 py-2 text-base font-medium md:px-5 md:py-2.5 md:text-lg">
                    <Icon className="size-4 shrink-0 text-ink md:size-5" />
                    {component.name}
                  </span>
                </li>
              );
            })}

            {COMING_SOON_COMPONENTS.map((component) => {
              const Icon = component.icon;
              return (
                <li key={component.name}>
                  <span className="flex items-center gap-2 border-2 border-zinc-300 px-4 py-2 text-base font-medium text-zinc-300 md:px-5 md:py-2.5 md:text-lg">
                    <Icon className="size-4 shrink-0 md:size-5" />
                    {component.name}
                    <span className="ml-1 bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">
                      soon
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="border-b-8 border-b-black py-24">
        <div className="mx-auto max-w-5xl px-7 sm:px-10">
          <h2 className="mb-4 text-3xl font-semibold tracking-tight md:mb-4 md:text-4xl lg:text-6xl">
            What Maily actually does
          </h2>
          <p className="mb-10 text-xl leading-relaxed text-balance sm:text-3xl sm:leading-relaxed">
            A block-based editor that outputs clean, responsive HTML emails. No
            bloat, no rabbit holes.
          </p>

          <FeatureAccordion />
        </div>
      </div>

      <div className="border-b-8 border-b-black py-24">
        <div className="mx-auto max-w-5xl px-7 sm:px-10">
          <h2 className="mb-4 text-3xl font-semibold tracking-tight md:text-4xl lg:text-6xl">
            Loved by the community
          </h2>
          <p className="mb-4 text-xl leading-relaxed sm:text-3xl sm:leading-relaxed">
            Trusted by teams at Novu, roadmap.sh, AhaSend, and more. What
            started as a side project now powers emails at companies around the
            world.
          </p>
          <p className="mb-7 text-xl leading-relaxed sm:text-3xl sm:leading-relaxed">
            Please do{' '}
            <a
              className="underline underline-offset-8 transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
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
              className="inline-flex min-h-[56px] items-center justify-center border-black bg-ink/40 px-5 py-2 text-lg font-medium transition-colors hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black md:text-xl lg:py-4 lg:text-2xl"
              href="https://github.com/arikchakma/maily.to"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="mr-3 inline-flex items-center">
                <StarIcon
                  className="mr-1 h-5 w-5 fill-current md:mr-2 md:h-7 md:w-7"
                  aria-hidden="true"
                />
                3.5k+
              </span>
              GitHub Stars
            </a>

            <Link
              className="flex items-center justify-center gap-2 border-4 border-black bg-white px-5 py-2 text-lg font-medium text-black transition-colors hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black md:text-xl lg:py-3 lg:text-2xl"
              to="/playground"
            >
              <Icons.pencil aria-hidden="true" />
              Open Editor
            </Link>
          </div>
        </div>
      </div>

      <footer className="bg-black text-white">
        <div className="mx-auto max-w-5xl px-7 pt-16 pb-8 sm:px-10">
          <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
            <div>
              <p className="mb-1 text-4xl font-semibold text-white">maily.to</p>
              <p className="mb-4 text-base text-zinc-300">
                by{' '}
                <a
                  href="https://arikko.dev"
                  rel="noopener noreferrer"
                  target="_blank"
                  className="underline underline-offset-2 hover:no-underline"
                >
                  Arik Chakma
                </a>
              </p>

              <p className="max-w-sm text-base leading-relaxed text-balance text-zinc-300">
                Open-source editor for crafting beautiful emails. Built with
                Tiptap, React, and a lot of care for the details.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wide text-zinc-400 uppercase">
                Links
              </h3>
              <ul className="flex flex-col gap-3 text-base text-zinc-300">
                <li>
                  <Link
                    className="transition-colors hover:text-white"
                    to="/playground"
                  >
                    Playground
                  </Link>
                </li>
                <li>
                  <a
                    className="transition-colors hover:text-white"
                    href="https://github.com/arikchakma/maily.to"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    className="transition-colors hover:text-white"
                    href="https://www.npmjs.com/package/@maily-to/core"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    npm
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wide text-zinc-400 uppercase">
                Connect
              </h3>
              <ul className="flex flex-col gap-3 text-base text-zinc-300">
                <li>
                  <a
                    className="transition-colors hover:text-white"
                    href="https://x.com/imarikchakma"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    X (Twitter)
                  </a>
                </li>
                <li>
                  <a
                    className="transition-colors hover:text-white"
                    href="https://github.com/arikchakma"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-zinc-800 pt-6">
            <p className="text-sm text-zinc-400">
              Maily &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

const EDITOR_COMPONENTS = [
  { name: 'Logo', icon: TagIcon },
  { name: 'Buttons and Variants', icon: MousePointerClickIcon },
  { name: 'Variables', icon: BracesIcon },
  { name: 'Text Formatting', icon: TypeIcon },
  { name: 'Image', icon: ImageIcon },
  { name: 'Alignment', icon: AlignCenterIcon },
  { name: 'Divider', icon: MinusIcon },
  { name: 'Spacer', icon: MoveVerticalIcon },
  { name: 'Footer', icon: PanelBottomIcon },
  { name: 'List', icon: ListIcon },
  { name: 'Quote', icon: QuoteIcon },
  { name: 'Code', icon: Code2Icon },
  { name: 'Section', icon: LayoutIcon },
  { name: 'Columns', icon: Columns3Icon },
  { name: 'Repeat', icon: Repeat2Icon },
  { name: 'Show', icon: EyeIcon },
  { name: 'Social', icon: Share2Icon },
  { name: 'AI Extension', icon: SparklesIcon },
  { name: 'Inline Suggestion', icon: MessageSquareTextIcon },
];

const COMING_SOON_COMPONENTS = [
  { name: 'Video', icon: PlayIcon },
  { name: 'Table', icon: TableIcon },
  { name: 'Countdown', icon: TimerIcon },
];
