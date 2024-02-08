'use client';

import * as NProgress from 'nprogress';
import NextTopLoader from 'nextjs-toploader';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

export function TopLoader() {
  return (
    <>
      <NextTopLoader showSpinner={false} />
      <Suspense fallback={null}>
        <FinishingLoader />
      </Suspense>
    </>
  );
}

function FinishingLoader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    NProgress.done();
  }, [pathname, router, searchParams]);
  return null;
}
