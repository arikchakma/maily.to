export default async function sitemap() {
  const routes = ['', '/playground'].map((route) => ({
    url: `https://maily.to${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  return [...routes];
}
