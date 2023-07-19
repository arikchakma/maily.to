import NextImage from 'next/image';
import NextLink from 'next/link';
import Balancer from 'react-wrap-balancer';

import { buttonVariants } from '@/components/editor/components/base-button';
import { cn } from '@/components/editor/utils/tailwind';

import PreviewImage from '../public/preview.png';

export default function LandingPage() {
  return (
    <div className="h-screen overflow-hidden">
      <div className="-xs:px-5 mx-auto flex h-screen max-w-[1440px] flex-col px-10">
        <header className="-sm:pt-10 flex items-center justify-center pb-8 pt-16">
          <h1 className="text-xl font-semibold tracking-tight text-gray-800">
            maily.to
          </h1>
        </header>

        <div className="flex flex-col items-center py-24">
          <h1 className="mx-auto mt-2 max-w-lg bg-gradient-to-br from-gray-800 to-gray-500 bg-clip-text text-center text-6xl font-bold leading-[58px] tracking-tight text-transparent">
            <Balancer>Elevate Your Email Experience</Balancer>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-center text-gray-600">
            <Balancer ratio={0.85}>
              Craft beautiful emails effortlessly with Maily, the powerful email
              editor that ensures impeccable communication across all major
              clients.
            </Balancer>
          </p>
          <NextLink
            href="/playground"
            className={cn(buttonVariants({}), 'mt-8 bg-gray-800')}
          >
            Try Maily Now →
          </NextLink>
        </div>

        <NextImage
          src={PreviewImage}
          alt="Maily Preview"
          className="mx-auto rounded-xl border drop-shadow-2xl"
          priority
        />
      </div>
      <div className="masking-pattern absolute inset-0 -z-10 bg-[url(/grid.svg)] bg-center" />
    </div>
  );
}
