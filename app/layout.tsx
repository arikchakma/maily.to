import './globals.css';

import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';

import { config } from '@/lib/config';
import { Toaster } from '@/components/ui/toaster';
import { GoogleAnalytics } from '@/components/google-analytics';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://maily.to'),
  title: 'Maily - Open-source editor for crafting emails',
  description:
    'Craft beautiful emails effortlessly with Maily, the powerful email editor that ensures impeccable communication across all major clients.',
  themeColor: '#ffffff',
  twitter: {
    creator: '@imarikchakma',
    title: 'Maily - Open-source editor for crafting emails',
    card: 'summary_large_image',
  },
  icons: {
    icon: [
      {
        url: '/brand/logo.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/brand/logo.svg',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    siteName: 'Maily',
    title: 'Maily - Open-source editor for crafting emails',
    description:
      'Craft beautiful emails effortlessly with Maily, the powerful email editor that ensures impeccable communication across all major clients.',
    type: 'website',
    url: 'https://maily.to',
    locale: 'en-US',
    images: {
      url: '/og.jpg',
      width: 1200,
      height: 630,
      alt: 'Maily Preview',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <main>
          {children}
          {config.googleTrackingId && (
            <GoogleAnalytics GA_TRACKING_ID={config.googleTrackingId} />
          )}
          <Toaster />
          <Analytics />
        </main>
      </body>
    </html>
  );
}
