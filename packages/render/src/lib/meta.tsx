/**
 * Descriptor for a single meta element to inject into the `<head>`.
 * Supports the same shapes as Remix/React-Router's MetaDescriptor:
 * charSet, title, name/content, property/content, httpEquiv/content,
 * tagName ('meta' | 'link'), and a catch-all for arbitrary attrs.
 */
export type MetaDescriptor =
  | { charSet: 'utf-8' }
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string }
  | { httpEquiv: string; content: string }
  | { tagName: 'meta' | 'link'; [attr: string]: string }
  | { [name: string]: string };

/**
 * Deduplication key for a meta descriptor. Uses a sorted-key JSON hash
 * so `{ name: 'a', content: 'b' }` and `{ content: 'b', name: 'a' }`
 * produce the same key.
 */
function hash(descriptor: MetaDescriptor): string {
  const sorted = Object.keys(descriptor)
    .sort()
    .reduce<Record<string, string>>((acc, key) => {
      acc[key] = (descriptor as Record<string, string>)[key];
      return acc;
    }, {});

  return JSON.stringify(sorted);
}

/**
 * Converts MetaDescriptor objects into React elements for the `<head>`.
 * Duplicates (by sorted-key JSON hash) are skipped.
 */
export function meta(descriptors: MetaDescriptor[]): React.ReactNode[] {
  const seen = new Set<string>();
  const elements: React.ReactNode[] = [];

  for (const descriptor of descriptors) {
    const key = hash(descriptor);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);

    const element = process(descriptor, key);
    if (element) {
      elements.push(element);
    }
  }

  return elements;
}

function process(descriptor: MetaDescriptor, key: string): React.ReactNode {
  if ('charSet' in descriptor) {
    return <meta key={key} charSet={descriptor.charSet} />;
  }

  if ('title' in descriptor) {
    return <title key={key}>{descriptor.title}</title>;
  }

  if ('tagName' in descriptor) {
    const { tagName, ...attrs } = descriptor;
    if (tagName === 'link') {
      return <link key={key} {...attrs} />;
    }

    return <meta key={key} {...attrs} />;
  }

  // name/content, property/content, httpEquiv/content, and catch-all
  const attrs = descriptor as Record<string, string>;

  if ('httpEquiv' in attrs) {
    const { httpEquiv, ...rest } = attrs;
    return <meta key={key} httpEquiv={httpEquiv} {...rest} />;
  }

  return <meta key={key} {...attrs} />;
}
