import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import { BaseButton } from '../components/base-button';
import { Input } from '../components/input';
import { Popover, PopoverContent, PopoverTrigger } from '../components/popover';
import { Textarea } from '../components/textarea';
import { cn } from '../utils/classname';

export const allowedAdvertisementLayout = [
  'left-image',
  // TODO: Implement it later
  // 'right-image',
] as const;

const items = {
  layout(props: NodeViewProps) {
    return allowedAdvertisementLayout.map((layout) => ({
      name: layout,
      isActive: props.node.attrs.layout === layout,
      onClick: () => {
        props.updateAttributes({
          layout,
        });
      },
    }));
  },
};

export function AdvertisementComponent(props: NodeViewProps) {
  const {
    layout,
    title,
    description,
    link,
    linkTitle,
    image,
    badgeText,
    subTitle,
  } = props.node.attrs;
  const { getPos, editor } = props;

  return (
    <NodeViewWrapper
      className={`react-component ${
        props.selected && 'ProseMirror-selectednode'
      }`}
      draggable="true"
      data-drag-handle=""
    >
      <Popover open={props.selected}>
        <PopoverTrigger asChild>
          <div
            tabIndex={-1}
            onClick={(e) => {
              e.preventDefault();
              const pos = getPos();
              editor.commands.setNodeSelection(pos);
            }}
          >
            <div className="mly-no-prose mly-flex mly-flex-col mly-gap-2 mly-border mly-border-gray-300 mly-p-2">
              <div className="mly-flex mly-items-stretch">
                {image && (
                  <div className="mly-relative mly-aspect-[4/5] mly-w-[160px] mly-shrink-0">
                    <img
                      src={image}
                      alt="advertisement"
                      className="mly-no-prose mly-absolute mly-inset-0 !mly-mb-0 mly-h-full mly-w-full mly-object-cover"
                    />
                  </div>
                )}
                <div
                  className={cn(
                    'mly-flex mly-flex-col',
                    image ? 'mly-p-2.5' : ''
                  )}
                >
                  <div className="!mly-mb-1 mly-flex mly-items-center mly-gap-1.5">
                    <h2 className="!mly-mb-0 !mly-text-lg mly-font-semibold">
                      {title}
                    </h2>
                    {badgeText && (
                      <span className="!mly-font-base text-xs mly-rounded-md mly-bg-yellow-200 mly-px-2 mly-py-1 mly-font-semibold mly-leading-none">
                        {badgeText}
                      </span>
                    )}{' '}
                    {subTitle && !badgeText && (
                      <span className="!mly-font-base text-xs mly-rounded-md mly-font-semibold mly-leading-none mly-text-gray-400">
                        {subTitle}
                      </span>
                    )}
                  </div>
                  <p className="!mly-my-0 !mly-text-base mly-text-gray-500">
                    {description}
                  </p>
                  {linkTitle ? (
                    <a
                      href={link}
                      className="mly-mt-5 mly-text-sm mly-font-semibold"
                    >
                      {linkTitle}
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="mly-flex mly-w-96 mly-flex-col mly-gap-2"
          sideOffset={10}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div className="mly-w-full mly-space-y-1">
            <p className="mly-text-xs mly-font-normal mly-text-slate-400">
              Layout
            </p>
            <div className="mly-flex mly-gap-1">
              {items.layout(props).map((item, index) => (
                <BaseButton
                  key={index}
                  data-state={item.isActive ? 'true' : 'false'}
                  variant="ghost"
                  className="mly-grow mly-font-normal mly-capitalize"
                  size="sm"
                  onClick={item.onClick}
                  type="button"
                >
                  {item.name}
                </BaseButton>
              ))}
            </div>
          </div>

          <label className="mly-w-full mly-space-y-1">
            <span className="mly-text-xs mly-font-normal mly-text-slate-400">
              Image
            </span>
            <Input
              placeholder="Add Image"
              type="url"
              value={image}
              onChange={(e) => {
                props.updateAttributes({
                  image: e.target.value,
                });
              }}
            />
          </label>

          <label className="mly-w-full mly-space-y-1">
            <span className="mly-text-xs mly-font-normal mly-text-slate-400">
              Title
            </span>
            <Input
              placeholder="Add title"
              value={title}
              onChange={(e) => {
                props.updateAttributes({
                  title: e.target.value,
                });
              }}
            />
          </label>

          <label className="mly-w-full mly-space-y-1">
            <span className="mly-text-xs mly-font-normal mly-text-slate-400">
              Description
            </span>
            <Textarea
              placeholder="Add description here"
              value={description}
              onChange={(e) => {
                props.updateAttributes({
                  description: e.target.value,
                });
              }}
            />
          </label>

          <div className="mly-grid mly-grid-cols-2 mly-gap-2">
            <label className="mly-w-full mly-space-y-1">
              <span className="mly-text-xs mly-font-normal mly-text-slate-400">
                Link Title
              </span>
              <Input
                placeholder="Add link title here"
                value={linkTitle}
                onChange={(e) => {
                  props.updateAttributes({
                    linkTitle: e.target.value,
                  });
                }}
              />
            </label>

            <label className="mly-w-full mly-space-y-1">
              <span className="mly-text-xs mly-font-normal mly-text-slate-400">
                Link
              </span>
              <Input
                placeholder="Add link here"
                value={link}
                onChange={(e) => {
                  props.updateAttributes({
                    link: e.target.value,
                  });
                }}
              />
            </label>
          </div>

          <div className="mly-grid mly-grid-cols-2 mly-gap-2">
            <label className="mly-w-full mly-space-y-1">
              <span className="mly-text-xs mly-font-normal mly-text-slate-400">
                Badge Text
              </span>
              <Input
                placeholder="Add badge text here"
                value={badgeText}
                onChange={(e) => {
                  props.updateAttributes({
                    badgeText: e.target.value,
                  });
                }}
              />
            </label>

            <label className="mly-w-full mly-space-y-1">
              <span className="mly-text-xs mly-font-normal mly-text-slate-400">
                Sub Title
              </span>
              <Input
                placeholder="Add sub title here"
                value={subTitle}
                onChange={(e) => {
                  props.updateAttributes({
                    subTitle: e.target.value,
                  });
                }}
              />
            </label>
          </div>
        </PopoverContent>
      </Popover>
    </NodeViewWrapper>
  );
}
