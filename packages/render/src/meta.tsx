import { createElement } from 'react';

export type MetaDescriptor =
  | {
      charSet: 'utf-8';
    }
  | {
      title: string;
    }
  | {
      name: string;
      content: string;
    }
  | {
      property: string;
      content: string;
    }
  | {
      httpEquiv: string;
      content: string;
    }
  | {
      tagName: 'meta' | 'link';
      [attribute: string]: string;
    }
  | {
      [name: string]: string;
    };

export type MetaDescriptors = MetaDescriptor[];

export function meta(meta: MetaDescriptors) {
  return (
    meta
      // only filter unique meta tags
      // so that we don't have duplicate meta tags
      .filter((meta, index, self) => {
        const meta_hash = has(meta);
        return (
          index ===
          self.findIndex((t) => {
            return has(t) === meta_hash;
          })
        );
      })
      .map(processMeta)
      .filter(Boolean) as JSX.Element[]
  );
}

function processMeta(meta: MetaDescriptor) {
  if ('charSet' in meta) {
    return <meta charSet={meta.charSet} />;
  }

  if ('title' in meta) {
    return <title>{meta.title}</title>;
  }

  if ('name' in meta && 'content' in meta) {
    return <meta name={meta.name} content={meta.content} />;
  }

  if ('property' in meta && 'content' in meta) {
    return <meta property={meta.property} content={meta.content} />;
  }

  if ('httpEquiv' in meta && 'content' in meta) {
    return <meta httpEquiv={meta.httpEquiv} content={meta.content} />;
  }

  if ('tagName' in meta) {
    const { tagName, ...attributes } = meta;
    return createElement(tagName, attributes);
  }

  const tagAttributes = Object.entries(meta).reduce(
    (acc, [key, value]) => ({ ...acc, [key]: value }),
    {}
  );
  return <meta {...tagAttributes} />;
}

/**
 * hash the meta object to string
 * so that we can filter out duplicates
 * for that we have to sort the object keys
 * and then stringify it and hash it
 */
function has(meta: MetaDescriptor) {
  const sortedMeta = Object.keys(meta)
    .sort()
    .reduce((acc, key) => {
      const _key = key as keyof MetaDescriptor;
      acc[_key] = meta[_key];
      return acc;
    }, {} as MetaDescriptor);

  return JSON.stringify(sortedMeta);
}
