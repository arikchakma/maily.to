import NextLink from 'next/link';
import { Balancer } from 'react-wrap-balancer';

type NavigationType = {};

export function Navigation(props: NavigationType) {
  return (
    <header className="mt-14">
      <div className="rounded-md border px-5 py-4">
        <p className="sm:text-lg">
          <Balancer>
            You can create an account to save email templates as well. It&apos;s
            free and easy to use.
          </Balancer>
        </p>

        <div className="mt-5 flex items-stretch gap-2">
          <NextLink
            href="/login"
            className="flex items-center justify-center gap-3 rounded-xl bg-black px-5 py-1.5 font-medium text-white transition-all hover:bg-red-500 focus:outline-0"
          >
            Login
          </NextLink>
          <NextLink
            href="/signup"
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-black bg-white px-4 py-1.5 font-medium text-black transition-colors hover:border-red-500 hover:bg-red-500 hover:text-white focus:outline-0"
          >
            Sign up
          </NextLink>
        </div>
      </div>
    </header>
  );
}
