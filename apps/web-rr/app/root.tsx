import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';

import type { Route } from './+types/root';
import '@maily-to/core/style.css';
import stylesheet from './app.css?url';
import { Toaster } from 'sonner';
import { NavigationLoadingBar } from './components/navigation-loader';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/query-client';

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
  { rel: 'stylesheet', href: stylesheet },
  {
    rel: 'icon',
    type: 'image/svg+xml',
    href: '/brand/logo.svg',
  },
  {
    rel: 'icon',
    href: '/brand/logo.svg',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Twitter */}
        <meta name="twitter:creator" content="@imarikchakma" />
        <meta
          name="twitter:title"
          content="Maily - Open-source editor for crafting emails"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:description"
          content="Create, preview, and manage emails with Maily – your open-source solution for modern email editing."
        />
        <meta name="twitter:image" content="https://maily.to/og-image.png" />

        {/* Open Graph */}
        <meta property="og:site_name" content="Maily" />
        <meta
          property="og:title"
          content="Maily - Open-source editor for crafting emails"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://maily.to" />
        <meta property="og:locale" content="en-US" />
        <meta property="og:image" content="https://maily.to/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Maily Preview" />

        {/* Robots */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="googlebot" content="max-video-preview: -1" />
        <meta name="googlebot" content="max-image-preview: large" />
        <meta name="googlebot" content="max-snippet: -1" />

        {/* Icons */}
        <link rel="icon" type="image/svg+xml" href="/brand/logo.svg" />
        <link rel="icon" href="/brand/logo.svg" />

        <meta name="theme-color" content="#ffffff" />

        <Meta />
        <Links />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <>
            {children}
            <ScrollRestoration />
            <Scripts />
            <Toaster />
            <NavigationLoadingBar />
          </>
        </QueryClientProvider>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
