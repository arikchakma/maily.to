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
import { GoogleAnalytics } from './components/google-analytics';

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

export const meta: Route.MetaFunction = () => [
  { title: 'Maily - Open-source editor for crafting emails' },
  {
    name: 'description',
    content:
      'Craft beautiful emails effortlessly with Maily, the powerful email editor that ensures impeccable communication across all major clients.',
  },
  { name: 'twitter:creator', content: '@imarikchakma' },
  {
    name: 'twitter:title',
    content: 'Maily - Open-source editor for crafting emails',
  },
  { name: 'twitter:card', content: 'summary_large_image' },
  {
    name: 'twitter:description',
    content:
      'Craft beautiful emails effortlessly with Maily, the powerful email editor that ensures impeccable communication across all major clients.',
  },
  { name: 'twitter:image', content: 'https://maily.to/og-image.png' },
  { name: 'og:site_name', content: 'Maily' },
  {
    name: 'og:title',
    content: 'Maily - Open-source editor for crafting emails',
  },
  {
    name: 'og:description',
    content:
      'Craft beautiful emails effortlessly with Maily, the powerful email editor that ensures impeccable communication across all major clients.',
  },
  { name: 'og:image', content: 'https://maily.to/og-image.png' },
  { name: 'og:image:width', content: '1200' },
  { name: 'og:image:height', content: '630' },
  { name: 'og:image:alt', content: 'Maily Preview' },
  { name: 'theme-color', content: '#ffffff' },
  // Indexing
  { name: 'robots', content: 'index, follow' },
  {
    name: 'googlebot',
    content:
      'index, follow, max-video-preview: -1, max-image-preview: large, max-snippet: -1',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <GoogleAnalytics />

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
