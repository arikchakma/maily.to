import fs from 'node:fs/promises';
import { resolveRobots, resolveSitemap } from '~/lib/metadata';

console.log('🆕 Generating metadata files...');

console.log('📄 Generating robots.txt...');
const robots = {
  rules: [
    {
      userAgent: '*',
    },
  ],
  sitemap: 'https://maily.to/sitemap.xml',
  host: 'https://maily.to',
};

const robotsTxt = resolveRobots(robots);
const publicPath = 'public/robots.txt';
await fs.writeFile(publicPath, robotsTxt);
console.log(`📄 Generated robots.txt at ${publicPath}`);

console.log('📄 Generating sitemap.xml...');
const routes = ['', '/playground'].map((route) => ({
  url: `https://maily.to${route}`,
  lastModified: new Date().toISOString().split('T')[0],
}));

const sitemap = resolveSitemap(routes);
const sitemapPath = 'public/sitemap.xml';
await fs.writeFile(sitemapPath, sitemap);
console.log(`📄 Generated sitemap.xml at ${sitemapPath}`);
