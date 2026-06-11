export const TRUSTED_COMPANIES = [
  {
    name: 'Novu',
    url: 'https://novu.co?ref=maily.to',
    image: '/images/novu-logo.png',
  },
  {
    name: 'roadmap.sh',
    url: 'https://roadmap.sh?ref=maily.to',
    image: '/images/roadmapsh-logo.svg',
  },
  {
    name: 'AhaSend',
    url: 'https://ahasend.com?ref=maily.to',
    image: '/images/ahasend-logo.png',
  },
];

export function TrustedBy() {
  return (
    <div className="mt-8 flex items-center gap-6">
      <p className="shrink-0 text-base text-zinc-600">Trusted by</p>
      <div className="flex items-center gap-6">
        {TRUSTED_COMPANIES.map((company) => (
          <a
            className="grayscale hover:grayscale-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            key={company.name}
            href={company.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            <img alt={company.name} className="h-6" src={company.image} />
          </a>
        ))}
      </div>
    </div>
  );
}
