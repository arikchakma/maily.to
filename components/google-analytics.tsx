'use client';

import Script from 'next/script';

type Props = {
  GA_TRACKING_ID: string;
};

export function GoogleAnalytics(props: Props) {
  const { GA_TRACKING_ID } = props;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
        window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', "${GA_TRACKING_ID}");
        `}
      </Script>
    </>
  );
}
