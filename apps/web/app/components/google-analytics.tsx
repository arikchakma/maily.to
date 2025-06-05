export function GoogleAnalytics() {
  const trackingId = import.meta.env.VITE_GA_TRACKING_ID;
  const scriptUrl = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;

  return (
    <>
      <script async src={scriptUrl} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${trackingId}');
        `,
        }}
      />
    </>
  );
}
