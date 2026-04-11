const GA_ID_PATTERN = /^G-[A-Z0-9]+$/;

export function GoogleAnalytics() {
  const trackingId = import.meta.env.VITE_GA_TRACKING_ID;

  if (!trackingId || !GA_ID_PATTERN.test(trackingId)) {
    return null;
  }

  const scriptUrl = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;

  return (
    <>
      <script async src={scriptUrl} />
      <script
        dangerouslySetInnerHTML={{
          __html: /*html*/ `
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
