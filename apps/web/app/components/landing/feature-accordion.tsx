import { useState } from 'react';

import { cn } from '~/lib/classname';

const FEATURES = [
  {
    title: 'Drop-in blocks for every element',
    description:
      'Buttons, images, columns, variables, social links. Pick a block and it just works. No table layouts or inline styles.',
  },
  {
    title: 'Clean HTML output',
    description:
      'Renders to production-ready email HTML that works across Gmail, Outlook, Apple Mail, and every major client.',
  },
  {
    title: 'AI-powered writing',
    description:
      'Generate content, tweak copy, and get inline suggestions as you type. Plug in any AI provider and the extension handles the rest.',
  },
  {
    title: 'Fully customizable theme',
    description:
      'Override colors, fonts, spacing, and every visual detail to match your brand. Ship emails that look like yours.',
  },
] as const;

export function FeatureAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="flex flex-col">
      {FEATURES.map((feature, index) => {
        const isOpen = openIndex === index;
        const isLast = index === FEATURES.length - 1;

        return (
          <button
            key={feature.title}
            type="button"
            className={cn(
              'flex flex-col border-b-4 border-black py-5 text-left',
              isLast ? 'border-b-0' : ''
            )}
            onClick={() => setOpenIndex(index)}
          >
            <h3 className="text-xl font-semibold md:text-2xl">
              {feature.title}
            </h3>
            {isOpen && (
              <p className="mt-2 text-lg leading-relaxed text-balance sm:text-xl sm:leading-relaxed">
                {feature.description}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}
