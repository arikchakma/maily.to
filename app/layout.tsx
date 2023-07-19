import './globals.css';

import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://maily.to'),
  title: 'Maily - Elevate Your Email Experience',
  description:
    'Craft beautiful emails effortlessly with Maily, the powerful email editor that ensures impeccable communication across all major clients.',
  themeColor: '#ffffff',
  twitter: {
    creator: '@imarikchakma',
    title: 'Maily - Elevate Your Email Experience',
    card: 'summary_large_image',
  },
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/favicon.svg',
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
    title: 'Maily - Elevate Your Email Experience',
    description:
      'Craft beautiful emails effortlessly with Maily, the powerful email editor that ensures impeccable communication across all major clients.',
    type: 'website',
    url: 'https://maily.to',
    locale: 'en-US',
    images: {
      url: '/og.png',
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
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
