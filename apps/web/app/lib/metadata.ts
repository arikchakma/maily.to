// this code is originally from the Next.js source code
// https://github.com/vercel/next.js/blob/main/packages/next/src/build/webpack/loaders/metadata/resolve-route-data.ts#L5

type RobotsFile = {
  // Apply rules for all
  rules:
    | {
        userAgent?: string | string[] | undefined;
        allow?: string | string[] | undefined;
        disallow?: string | string[] | undefined;
        crawlDelay?: number | undefined;
      }
    // Apply rules for specific user agents
    | Array<{
        userAgent: string | string[];
        allow?: string | string[] | undefined;
        disallow?: string | string[] | undefined;
        crawlDelay?: number | undefined;
      }>;
  sitemap?: string | string[] | undefined;
  host?: string | undefined;
};

export type Restriction = {
  relationship: 'allow' | 'deny';
  content: string;
};

export type Videos = {
  title: string;
  thumbnail_loc: string;
  description: string;
  content_loc?: string | undefined;
  player_loc?: string | undefined;
  duration?: number | undefined;
  expiration_date?: Date | string | undefined;
  rating?: number | undefined;
  view_count?: number | undefined;
  publication_date?: Date | string | undefined;
  family_friendly?: 'yes' | 'no' | undefined;
  restriction?: Restriction | undefined;
  platform?: Restriction | undefined;
  requires_subscription?: 'yes' | 'no' | undefined;
  uploader?:
    | {
        info?: string | undefined;
        content?: string | undefined;
      }
    | undefined;
  live?: 'yes' | 'no' | undefined;
  tag?: string | undefined;
};

type SitemapFile = Array<{
  url: string;
  lastModified?: string | Date | undefined;
  changeFrequency?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never'
    | undefined;
  priority?: number | undefined;
  alternates?:
    | {
        languages?: Record<string, string>;
      }
    | undefined;
  images?: string[] | undefined;
  videos?: Videos[] | undefined;
}>;

export function resolveRobots(data: RobotsFile): string {
  let content = '';
  const rules = Array.isArray(data.rules) ? data.rules : [data.rules];
  for (const rule of rules) {
    const userAgent = resolveArray(rule.userAgent || ['*']);
    for (const agent of userAgent) {
      content += `User-Agent: ${agent}\n`;
    }
    if (rule.allow) {
      const allow = resolveArray(rule.allow);
      for (const item of allow) {
        content += `Allow: ${item}\n`;
      }
    }
    if (rule.disallow) {
      const disallow = resolveArray(rule.disallow);
      for (const item of disallow) {
        content += `Disallow: ${item}\n`;
      }
    }
    if (rule.crawlDelay) {
      content += `Crawl-delay: ${rule.crawlDelay}\n`;
    }
    content += '\n';
  }
  if (data.host) {
    content += `Host: ${data.host}\n`;
  }
  if (data.sitemap) {
    const sitemap = resolveArray(data.sitemap);
    // TODO-METADATA: support injecting sitemap url into robots.txt
    sitemap.forEach((item) => {
      content += `Sitemap: ${item}\n`;
    });
  }

  return content;
}

function resolveArray<T>(value: T | T[]): T[] {
  if (Array.isArray(value)) {
    return value as any;
  }
  return [value] as any;
}

export function resolveSitemap(data: SitemapFile): string {
  const hasAlternates = data.some(
    (item) => Object.keys(item.alternates ?? {}).length > 0
  );
  const hasImages = data.some((item) => Boolean(item.images?.length));
  const hasVideos = data.some((item) => Boolean(item.videos?.length));

  let content = '';
  content += '<?xml version="1.0" encoding="UTF-8"?>\n';
  content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
  if (hasImages) {
    content += ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"';
  }
  if (hasVideos) {
    content += ' xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"';
  }
  if (hasAlternates) {
    content += ' xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
  } else {
    content += '>\n';
  }
  for (const item of data) {
    content += '<url>\n';
    content += `<loc>${item.url}</loc>\n`;

    const languages = item.alternates?.languages;
    if (languages && Object.keys(languages).length) {
      // Since sitemap is separated from the page rendering, there's not metadataBase accessible yet.
      // we give the default setting that won't effect the languages resolving.
      for (const language in languages) {
        content += `<xhtml:link rel="alternate" hreflang="${language}" href="${
          languages[language as keyof typeof languages]
        }" />\n`;
      }
    }
    if (item.images?.length) {
      for (const image of item.images) {
        content += `<image:image>\n<image:loc>${image}</image:loc>\n</image:image>\n`;
      }
    }
    if (item.videos?.length) {
      for (const video of item.videos) {
        const videoFields = [
          `<video:video>`,
          `<video:title>${video.title}</video:title>`,
          `<video:thumbnail_loc>${video.thumbnail_loc}</video:thumbnail_loc>`,
          `<video:description>${video.description}</video:description>`,
          video.content_loc &&
            `<video:content_loc>${video.content_loc}</video:content_loc>`,
          video.player_loc &&
            `<video:player_loc>${video.player_loc}</video:player_loc>`,
          video.duration &&
            `<video:duration>${video.duration}</video:duration>`,
          video.view_count &&
            `<video:view_count>${video.view_count}</video:view_count>`,
          video.tag && `<video:tag>${video.tag}</video:tag>`,
          video.rating && `<video:rating>${video.rating}</video:rating>`,
          video.expiration_date &&
            `<video:expiration_date>${video.expiration_date}</video:expiration_date>`,
          video.publication_date &&
            `<video:publication_date>${video.publication_date}</video:publication_date>`,
          video.family_friendly &&
            `<video:family_friendly>${video.family_friendly}</video:family_friendly>`,
          video.requires_subscription &&
            `<video:requires_subscription>${video.requires_subscription}</video:requires_subscription>`,
          video.live && `<video:live>${video.live}</video:live>`,
          video.restriction &&
            `<video:restriction relationship="${video.restriction.relationship}">${video.restriction.content}</video:restriction>`,
          video.platform &&
            `<video:platform relationship="${video.platform.relationship}">${video.platform.content}</video:platform>`,
          video.uploader &&
            `<video:uploader${video.uploader.info && ` info="${video.uploader.info}"`}>${video.uploader.content}</video:uploader>`,
          `</video:video>\n`,
        ].filter(Boolean);
        content += videoFields.join('\n');
      }
    }
    if (item.lastModified) {
      const serializedDate =
        item.lastModified instanceof Date
          ? item.lastModified.toISOString()
          : item.lastModified;

      content += `<lastmod>${serializedDate}</lastmod>\n`;
    }

    if (item.changeFrequency) {
      content += `<changefreq>${item.changeFrequency}</changefreq>\n`;
    }

    if (typeof item.priority === 'number') {
      content += `<priority>${item.priority}</priority>\n`;
    }

    content += '</url>\n';
  }

  content += '</urlset>\n';

  return content;
}
