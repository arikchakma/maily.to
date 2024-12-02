import { Fragment, type CSSProperties } from 'react';
import {
  Text,
  Html,
  Head,
  Body,
  Font,
  Container,
  Link,
  Heading,
  Hr,
  Button,
  Img,
  Preview,
  Row,
  Column,
  Section,
} from '@react-email/components';
import { renderAsync as reactEmailRenderAsync } from '@react-email/render';
import type { JSONContent } from '@tiptap/core';
import { deepMerge } from '@antfu/utils';
import { generateKey } from './utils';

interface NodeOptions {
  parent?: JSONContent;
  prev?: JSONContent;
  next?: JSONContent;

  payloadValue?: PayloadValue;
}

export interface MarkType {
  [key: string]: any;
  type: string;
  attrs?: Record<string, any> | undefined;
}

const allowedSpacers = ['sm', 'md', 'lg', 'xl'] as const;
export type AllowedSpacers = (typeof allowedSpacers)[number];

const spacers: Record<AllowedSpacers, string> = {
  sm: '8px',
  md: '16px',
  lg: '32px',
  xl: '64px',
};

const antialiased: CSSProperties = {
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
};

const allowedHeadings = ['h1', 'h2', 'h3'] as const;
type AllowedHeadings = (typeof allowedHeadings)[number];

const headings: Record<AllowedHeadings, CSSProperties> = {
  h1: {
    fontSize: '36px',
    lineHeight: '40px',
    fontWeight: 800,
  },
  h2: {
    fontSize: '30px',
    lineHeight: '36px',
    fontWeight: 700,
  },
  h3: {
    fontSize: '24px',
    lineHeight: '38px',
    fontWeight: 600,
  },
};

const allowedLogoSizes = ['sm', 'md', 'lg'] as const;
type AllowedLogoSizes = (typeof allowedLogoSizes)[number];

const logoSizes: Record<AllowedLogoSizes, string> = {
  sm: '40px',
  md: '48px',
  lg: '64px',
};

export interface ThemeOptions {
  colors?: Partial<{
    heading: string;
    paragraph: string;
    horizontal: string;
    footer: string;
    blockquoteBorder: string;
    codeBackground: string;
    codeText: string;
    linkCardTitle: string;
    linkCardDescription: string;
    linkCardBadgeText: string;
    linkCardBadgeBackground: string;
    linkCardSubTitle: string;
  }>;
  fontSize?: Partial<{
    paragraph: string;
    footer: {
      size: string;
      lineHeight: string;
    };
  }>;
}

export interface MailyConfig {
  /**
   * The preview text is the snippet of text that is pulled into the inbox
   * preview of an email client, usually right after the subject line.
   *
   * Default: `undefined`
   */
  preview?: string;
  /**
   * The theme object allows you to customize the colors and font sizes of the
   * rendered email.
   *
   * Default:
   * ```js
   * {
   *   colors: {
   *     heading: '#111827',
   *     paragraph: '#374151',
   *     horizontal: '#EAEAEA',
   *     footer: '#64748B',
   *   },
   *   fontSize: {
   *     paragraph: '15px',
   *     footer: {
   *       size: '14px',
   *       lineHeight: '24px',
   *     },
   *   },
   * }
   * ```
   *
   * @example
   * ```js
   * const maily = new Maily(content, {
   *   theme: {
   *     colors: {
   *       heading: '#111827',
   *     },
   *     fontSize: {
   *       footer: {
   *         size: '14px',
   *         lineHeight: '24px',
   *       },
   *     },
   *   },
   * });
   * ```
   */
  theme?: Partial<ThemeOptions>;
}

const DEFAULT_RENDER_OPTIONS: RenderOptions = {
  pretty: false,
  plainText: false,
};

const DEFAULT_THEME: ThemeOptions = {
  colors: {
    heading: '#111827',
    paragraph: '#374151',
    horizontal: '#EAEAEA',
    footer: '#64748B',
    blockquoteBorder: '#D1D5DB',
    codeBackground: '#EFEFEF',
    codeText: '#111827',
    linkCardTitle: '#111827',
    linkCardDescription: '#6B7280',
    linkCardBadgeText: '#111827',
    linkCardBadgeBackground: '#FEF08A',
    linkCardSubTitle: '#6B7280',
  },
  fontSize: {
    paragraph: '15px',
    footer: {
      size: '14px',
      lineHeight: '24px',
    },
  },
};

const CODE_FONT_FAMILY =
  'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
export const DEFAULT_SECTION_BACKGROUND_COLOR = '#ffffff';
export const DEFAULT_SECTION_ALIGN = 'left';
export const DEFAULT_SECTION_BORDER_WIDTH = 1;
export const DEFAULT_SECTION_BORDER_COLOR = '#000000';

export const DEFAULT_SECTION_MARGIN_TOP = 0;
export const DEFAULT_SECTION_MARGIN_RIGHT = 0;
export const DEFAULT_SECTION_MARGIN_BOTTOM = 0;
export const DEFAULT_SECTION_MARGIN_LEFT = 0;

export const DEFAULT_SECTION_PADDING_TOP = 5;
export const DEFAULT_SECTION_PADDING_RIGHT = 5;
export const DEFAULT_SECTION_PADDING_BOTTOM = 5;
export const DEFAULT_SECTION_PADDING_LEFT = 5;

export const DEFAULT_COLUMNS_WIDTH = '100%';
export const DEFAULT_COLUMNS_GAP = 8;

export const DEFAULT_COLUMN_BACKGROUND_COLOR = 'transparent';
export const DEFAULT_COLUMN_BORDER_RADIUS = 0;
export const DEFAULT_COLUMN_BORDER_WIDTH = 0;
export const DEFAULT_COLUMN_BORDER_COLOR = 'transparent';

export const DEFAULT_COLUMN_PADDING_TOP = 0;
export const DEFAULT_COLUMN_PADDING_RIGHT = 0;
export const DEFAULT_COLUMN_PADDING_BOTTOM = 0;
export const DEFAULT_COLUMN_PADDING_LEFT = 0;

export interface RenderOptions {
  /**
   * The options object allows you to customize the output of the rendered
   * email.
   * - `pretty` - If `true`, the output will be formatted with indentation and
   *  line breaks.
   * - `plainText` - If `true`, the output will be plain text instead of HTML.
   * This is useful for testing purposes.
   *
   * Default: `pretty` - `false`, `plainText` - `false`
   */
  pretty?: boolean;
  plainText?: boolean;
}

export type VariableFormatter = (options: {
  variable: string;
  fallback?: string;
}) => string;
export type VariableValues = Map<string, string>;
export type LinkValues = Map<string, string>;

export type PayloadValue = Record<string, any> | boolean;
export type PayloadValues = Map<string, PayloadValue>;

export class Maily {
  private readonly content: JSONContent;
  private config: MailyConfig = {
    theme: DEFAULT_THEME,
  };

  private variableFormatter: VariableFormatter = ({ variable, fallback }) => {
    return fallback
      ? `{{${variable},fallback=${fallback}}}`
      : `{{${variable}}}`;
  };

  private shouldReplaceVariableValues = false;
  private variableValues: VariableValues = new Map();
  private linkValues: LinkValues = new Map();
  private openTrackingPixel: string | undefined;
  private payloadValues: PayloadValues = new Map();

  constructor(content: JSONContent = { type: 'doc', content: [] }) {
    this.content = content;
  }

  setPreviewText(preview?: string) {
    this.config.preview = preview;
  }

  setTheme(theme: Partial<ThemeOptions>) {
    this.config.theme = deepMerge(this.config.theme || DEFAULT_THEME, theme);
  }

  setVariableFormatter(formatter: VariableFormatter) {
    this.variableFormatter = formatter;
  }

  /**
   * `setVariableValue` will set the variable value.
   * It will also set `shouldReplaceVariableValues` to `true`.
   *
   * @param variable - The variable name
   * @param value - The variable value
   */
  setVariableValue(variable: string, value: string) {
    if (!this.shouldReplaceVariableValues) {
      this.shouldReplaceVariableValues = true;
    }

    this.variableValues.set(variable, value);
  }

  /**
   * `setVariableValues` will set the variable values.
   * It will also set `shouldReplaceVariableValues` to `true`.
   *
   * @param values - The variable values
   *
   * @example
   * ```js
   * const maily = new Maily(content);
   * maily.setVariableValues({
   *  name: 'John Doe',
   *  email: 'john@doe.com',
   * });
   * ```
   */
  setVariableValues(values: Record<string, string>) {
    if (!this.shouldReplaceVariableValues) {
      this.shouldReplaceVariableValues = true;
    }

    Object.entries(values).forEach(([variable, value]) => {
      this.setVariableValue(variable, value);
    });
  }

  setLinkValue(link: string, value: string) {
    this.linkValues.set(link, value);
  }

  setLinkValues(values: Record<string, string>) {
    Object.entries(values).forEach(([link, value]) => {
      this.setLinkValue(link, value);
    });
  }

  setPayloadValue(key: string, value: PayloadValue) {
    if (!this.shouldReplaceVariableValues) {
      this.shouldReplaceVariableValues = true;
    }

    this.payloadValues.set(key, value);
  }

  setPayloadValues(values: Record<string, PayloadValue>) {
    Object.entries(values).forEach(([key, value]) => {
      this.setPayloadValue(key, value);
    });
  }

  /**
   * `setOpenTrackingPixel` will set the open tracking pixel.
   *
   * @param pixel - The open tracking pixel
   */
  setOpenTrackingPixel(pixel?: string) {
    this.openTrackingPixel = pixel;
  }

  /**
   * `setShouldReplaceVariableValues` will determine whether to replace the
   * variable values or not. Otherwise, it will just return the formatted variable.
   *
   * Default: `false`
   */
  setShouldReplaceVariableValues(shouldReplace: boolean) {
    this.shouldReplaceVariableValues = shouldReplace;
  }

  getAllLinks() {
    const nodes = this.content.content || [];
    const links = new Set<string>();

    const isValidLink = (href: string) => {
      return (
        href &&
        this.isValidUrl(href) &&
        !href.startsWith('#') &&
        !href.startsWith('mailto:') &&
        !href.startsWith('tel:') &&
        typeof href === 'string'
      );
    };

    const extractLinksFromNode = (node: JSONContent) => {
      if (node.type === 'button') {
        const originalLink = node.attrs?.url;
        if (isValidLink(originalLink) && originalLink) {
          links.add(originalLink);
        }
      } else if (node.content) {
        node.content.forEach((childNode) => {
          if (childNode.marks) {
            childNode.marks.forEach((mark) => {
              const originalLink = mark.attrs?.href;
              if (mark.type === 'link' && isValidLink(originalLink)) {
                links.add(originalLink);
              }
            });
          }
          if (childNode.content) {
            extractLinksFromNode(childNode);
          }
        });
      }
    };

    nodes.forEach((childNode) => {
      extractLinksFromNode(childNode);
    });

    return links;
  }

  private isValidUrl(href: string) {
    try {
      const _ = new URL(href);
      return true;
    } catch (err) {
      return false;
    }
  }

  async render(
    options: RenderOptions = DEFAULT_RENDER_OPTIONS
  ): Promise<string> {
    const markup = this.markup();
    return reactEmailRenderAsync(markup, options);
  }

  /**
   * `markup` will render the JSON content into React Email markup.
   * and return the raw React Tree.
   */
  markup() {
    const nodes = this.content.content || [];
    const jsxNodes = nodes.map((node, index) => {
      const nodeOptions: NodeOptions = {
        prev: nodes[index - 1],
        next: nodes[index + 1],
        parent: node,
      };

      const component = this.renderNode(node, nodeOptions);
      if (!component) {
        return null;
      }

      return <Fragment key={generateKey()}>{component}</Fragment>;
    });

    const { preview } = this.config;

    const markup = (
      <Html>
        <Head>
          <Font
            fallbackFontFamily="sans-serif"
            fontFamily="Inter"
            fontStyle="normal"
            fontWeight={400}
            webFont={{
              url: 'https://rsms.me/inter/font-files/Inter-Regular.woff2?v=3.19',
              format: 'woff2',
            }}
          />
          <style
            dangerouslySetInnerHTML={{
              __html: `blockquote,h1,h2,h3,img,li,ol,p,ul{margin-top:0;margin-bottom:0}@media only screen and (max-width:425px){.tab-row-full{width:100%!important}.tab-col-full{display:block!important;width:100%!important}.tab-pad{padding:0!important}}`,
            }}
          />

          <meta content="width=device-width" name="viewport" />
          <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
          <meta name="x-apple-disable-message-reformatting" />
          <meta
            // http://www.html-5.com/metatags/format-detection-meta-tag.html
            // It will prevent iOS from automatically detecting possible phone numbers in a block of text
            content="telephone=no,address=no,email=no,date=no,url=no"
            name="format-detection"
          />
          <meta content="light" name="color-scheme" />
          <meta content="light" name="supported-color-schemes" />
        </Head>
        <Body
          style={{
            margin: 0,
          }}
        >
          {preview ? (
            <Preview id="__react-email-preview">{preview}</Preview>
          ) : null}
          <Container
            style={{
              maxWidth: '600px',
              minWidth: '300px',
              width: '100%',
              marginLeft: 'auto',
              marginRight: 'auto',
              padding: '0.5rem',
            }}
          >
            {jsxNodes}
          </Container>
          {this.openTrackingPixel ? (
            <Img
              alt=""
              src={this.openTrackingPixel}
              style={{
                display: 'none',
                width: '1px',
                height: '1px',
              }}
            />
          ) : null}
        </Body>
      </Html>
    );

    return markup;
  }

  private getMarginOverrideConditions(
    node: JSONContent,
    options?: NodeOptions
  ) {
    const { parent, prev, next } = options || {};

    const isNextSpacer = next?.type === 'spacer';
    const isPrevSpacer = prev?.type === 'spacer';

    const isParentListItem = parent?.type === 'listItem';

    const isLastSectionElement = parent?.type === 'section' && !next;
    const isFirstSectionElement = parent?.type === 'section' && !prev;

    const isLastColumnElement = parent?.type === 'column' && !next;
    const isFirstColumnElement = parent?.type === 'column' && !prev;

    const isFirstForElement = parent?.type === 'for' && !prev;
    const isLastForElement = parent?.type === 'for' && !next;

    const isFirstShowElement = parent?.type === 'show' && !prev;
    const isLastShowElement = parent?.type === 'show' && !next;

    return {
      isNextSpacer,
      isPrevSpacer,
      isLastSectionElement,
      isFirstSectionElement,
      isParentListItem,
      isLastColumnElement,
      isFirstColumnElement,
      isFirstForElement,
      isLastForElement,
      isFirstShowElement,
      isLastShowElement,

      shouldRemoveTopMargin:
        isPrevSpacer ||
        isFirstSectionElement ||
        isFirstColumnElement ||
        isFirstForElement ||
        isFirstShowElement,
      shouldRemoveBottomMargin:
        isNextSpacer ||
        isLastSectionElement ||
        isLastColumnElement ||
        isLastForElement ||
        isLastShowElement,
    };
  }

  // `getMappedContent` will call corresponding node type
  // and return text content
  private getMappedContent(
    node: JSONContent,
    options?: NodeOptions
  ): JSX.Element[] {
    const allNodes = node.content || [];
    return allNodes
      .map((childNode, index) => {
        const component = this.renderNode(childNode, {
          ...options,
          next: allNodes[index + 1],
          prev: allNodes[index - 1],
        });
        if (!component) {
          return null;
        }

        return <Fragment key={generateKey()}>{component}</Fragment>;
      })
      .filter((n) => n !== null) as JSX.Element[];
  }

  // `renderNode` will call the method of the corresponding node type
  private renderNode(
    node: JSONContent,
    options: NodeOptions = {}
  ): JSX.Element | null {
    const type = node.type || '';

    if (type in this) {
      // @ts-expect-error - `this` is not assignable to type 'never'
      return this[type]?.(node, options) as JSX.Element;
    }

    throw new Error(`Node type "${type}" is not supported.`);
  }

  // `renderMark` will call the method of the corresponding mark type
  private renderMark(node: JSONContent): JSX.Element {
    // It will wrap the text with the corresponding mark type
    const text = node?.text || <>&nbsp;</>;
    const marks = node?.marks || [];

    return marks.reduce(
      (acc, mark) => {
        const type = mark.type;
        if (type in this) {
          // @ts-expect-error - `this` is not assignable to type 'never'
          return this[type]?.(mark, acc) as JSX.Element;
        }

        throw new Error(`Mark type "${type}" is not supported.`);
      },
      <>{text}</>
    );
  }

  private paragraph(node: JSONContent, options?: NodeOptions): JSX.Element {
    const { attrs } = node;
    const alignment = attrs?.textAlign || 'left';
    const { isParentListItem, shouldRemoveBottomMargin } =
      this.getMarginOverrideConditions(node, options);

    return (
      <Text
        style={{
          textAlign: alignment,
          marginBottom:
            isParentListItem || shouldRemoveBottomMargin ? '0px' : '20px',
          marginTop: '0px',
          fontSize: this.config.theme?.fontSize?.paragraph,
          color: this.config.theme?.colors?.paragraph,
          ...antialiased,
        }}
      >
        {node.content ? (
          this.getMappedContent(node, {
            ...options,
            parent: node,
          })
        ) : (
          <>&nbsp;</>
        )}
      </Text>
    );
  }

  private text(node: JSONContent, _?: NodeOptions): JSX.Element {
    const text = node.text || '&nbsp';
    if (node.marks) {
      return this.renderMark(node);
    }

    return <>{text}</>;
  }

  private bold(_: MarkType, text: JSX.Element): JSX.Element {
    return <strong>{text}</strong>;
  }

  private italic(_: MarkType, text: JSX.Element): JSX.Element {
    return <em>{text}</em>;
  }

  private underline(_: MarkType, text: JSX.Element): JSX.Element {
    return <u>{text}</u>;
  }

  private strike(_: MarkType, text: JSX.Element): JSX.Element {
    return <s style={{ textDecoration: 'line-through' }}>{text}</s>;
  }

  private textStyle(mark: MarkType, text: JSX.Element): JSX.Element {
    const { attrs } = mark;
    const { color = this.config.theme?.colors?.paragraph } = attrs || {};

    return (
      <span
        style={{
          color,
        }}
      >
        {text}
      </span>
    );
  }

  private link(mark: MarkType, text: JSX.Element): JSX.Element {
    const { attrs } = mark;
    let href = attrs?.href || '#';
    const target = attrs?.target || '_blank';
    const rel = attrs?.rel || 'noopener noreferrer nofollow';

    // If the href value is provided, use it to replace the link
    // Otherwise, use the original link
    if (
      typeof this.linkValues === 'object' ||
      typeof this.variableValues === 'object'
    ) {
      href = this.linkValues.get(href) || this.variableValues.get(href) || href;
    }

    return (
      <Link
        href={href}
        rel={rel}
        style={{
          fontWeight: 500,
          textDecoration: 'underline',
          color: this.config.theme?.colors?.heading,
        }}
        target={target}
      >
        {text}
      </Link>
    );
  }

  private heading(node: JSONContent, options?: NodeOptions): JSX.Element {
    const { attrs } = node;

    const level = `h${Number(attrs?.level) || 1}`;
    const alignment = attrs?.textAlign || 'left';
    const { shouldRemoveBottomMargin } = this.getMarginOverrideConditions(
      node,
      options
    );
    const { fontSize, lineHeight, fontWeight } =
      headings[level as AllowedHeadings];

    return (
      <Heading
        // @ts-expect-error - `this` is not assignable to type 'never'
        as={level}
        style={{
          textAlign: alignment,
          color: this.config.theme?.colors?.heading,
          marginBottom: shouldRemoveBottomMargin ? '0' : '12px',
          marginTop: 0,
          fontSize,
          lineHeight,
          fontWeight,
        }}
      >
        {this.getMappedContent(node, {
          ...options,
          parent: node,
        })}
      </Heading>
    );
  }

  private variable(node: JSONContent, options?: NodeOptions): JSX.Element {
    const { payloadValue } = options || {};
    const { id: variable, fallback } = node.attrs || {};

    const shouldShow = this.shouldShow(node, options);
    if (!shouldShow || !variable) {
      return <></>;
    }

    let formattedVariable = this.variableFormatter({
      variable,
      fallback,
    });

    // If `shouldReplaceVariableValues` is true, replace the variable values
    // Otherwise, just return the formatted variable
    if (this.shouldReplaceVariableValues) {
      formattedVariable =
        (typeof payloadValue === 'object'
          ? payloadValue[variable]
          : payloadValue) ??
        this.variableValues.get(variable) ??
        fallback ??
        formattedVariable;
    }

    if (node?.marks) {
      return this.renderMark({
        text: formattedVariable,
        marks: node.marks,
      });
    }

    return <>{formattedVariable}</>;
  }

  private horizontalRule(_: JSONContent, __?: NodeOptions): JSX.Element {
    return (
      <Hr
        style={{
          marginTop: '32px',
          marginBottom: '32px',
        }}
      />
    );
  }

  private orderedList(node: JSONContent, options?: NodeOptions): JSX.Element {
    const { shouldRemoveBottomMargin } = this.getMarginOverrideConditions(
      node,
      options
    );

    return (
      <Container>
        <ol
          style={{
            marginTop: '0px',
            marginBottom: shouldRemoveBottomMargin ? '0' : '20px',
            paddingLeft: '26px',
            listStyleType: 'decimal',
          }}
        >
          {this.getMappedContent(node, {
            ...options,
            parent: node,
          })}
        </ol>
      </Container>
    );
  }

  private bulletList(node: JSONContent, options?: NodeOptions): JSX.Element {
    const { parent, next } = options || {};
    const { shouldRemoveBottomMargin } = this.getMarginOverrideConditions(
      node,
      {
        parent,
        next,
      }
    );

    return (
      <Container
        style={{
          maxWidth: '100%',
        }}
      >
        <ul
          style={{
            marginTop: '0px',
            marginBottom: shouldRemoveBottomMargin ? '0' : '20px',
            paddingLeft: '26px',
            listStyleType: 'disc',
          }}
        >
          {this.getMappedContent(node, {
            ...options,
            parent: node,
          })}
        </ul>
      </Container>
    );
  }

  private listItem(node: JSONContent, options?: NodeOptions): JSX.Element {
    return (
      <li
        style={{
          marginBottom: '8px',
          paddingLeft: '6px',
          ...antialiased,
        }}
      >
        {this.getMappedContent(node, { ...options, parent: node })}
      </li>
    );
  }

  private button(node: JSONContent, options?: NodeOptions): JSX.Element {
    const { attrs } = node;
    const {
      text,
      url,
      variant,
      buttonColor,
      textColor,
      borderRadius,
      // @TODO: Update the attribute to `textAlign`
      alignment = 'left',
    } = attrs || {};

    const shouldShow = this.shouldShow(node, options);
    if (!shouldShow) {
      return <></>;
    }

    let radius: string | undefined = '0px';
    if (borderRadius === 'round') {
      radius = '9999px';
    } else if (borderRadius === 'smooth') {
      radius = '6px';
    }

    const { shouldRemoveBottomMargin } = this.getMarginOverrideConditions(
      node,
      options
    );

    const href =
      this.linkValues.get(url) || this.variableValues.get(url) || url;

    return (
      <Container
        style={{
          textAlign: alignment,
          maxWidth: '100%',
          marginBottom: shouldRemoveBottomMargin ? '0px' : '20px',
        }}
      >
        <Button
          href={href}
          style={{
            color: String(textColor),
            backgroundColor:
              variant === 'filled' ? String(buttonColor) : 'transparent',
            borderColor: String(buttonColor),
            padding: variant === 'filled' ? '12px 34px' : '10px 34px',
            borderWidth: '2px',
            borderStyle: 'solid',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 500,
            borderRadius: radius,
          }}
        >
          {text}
        </Button>
      </Container>
    );
  }

  private spacer(node: JSONContent, options?: NodeOptions): JSX.Element {
    const { attrs } = node;
    const { height = 'auto' } = attrs || {};

    const shouldShow = this.shouldShow(node, options);
    if (!shouldShow) {
      return <></>;
    }

    return (
      <Container
        style={{
          height: spacers[height as AllowedSpacers] || height,
        }}
      />
    );
  }

  private hardBreak(_: JSONContent, __?: NodeOptions): JSX.Element {
    return <br />;
  }

  private logo(node: JSONContent, options?: NodeOptions): JSX.Element {
    const { attrs } = node;
    const {
      src,
      alt,
      title,
      size,
      // @TODO: Update the attribute to `textAlign`
      alignment = 'left',
    } = attrs || {};

    const shouldShow = this.shouldShow(node, options);
    if (!shouldShow) {
      return <></>;
    }

    const { shouldRemoveBottomMargin } = this.getMarginOverrideConditions(
      node,
      options
    );

    return (
      <Row
        style={{
          marginTop: '0px',
          marginBottom: shouldRemoveBottomMargin ? '0px' : '32px',
        }}
      >
        <Column align={alignment}>
          <Img
            alt={alt || title || 'Logo'}
            src={src}
            style={{
              width: logoSizes[size as AllowedLogoSizes] || size,
              height: logoSizes[size as AllowedLogoSizes] || size,
            }}
            title={title || alt || 'Logo'}
          />
        </Column>
      </Row>
    );
  }

  private image(node: JSONContent, options?: NodeOptions): JSX.Element {
    const { attrs } = node;
    const {
      src,
      alt,
      title,
      width = 'auto',
      alignment = 'center',
      externalLink = '',
    } = attrs || {};

    const shouldShow = this.shouldShow(node, options);
    if (!shouldShow) {
      return <></>;
    }

    const { shouldRemoveBottomMargin } = this.getMarginOverrideConditions(
      node,
      options
    );

    const wi = width === 'auto' ? 'auto' : Number(width);

    const mainImage = (
      <Img
        alt={alt || title || 'Image'}
        src={src}
        style={{
          height: 'auto',
          width: '100%',
          outline: 'none',
          border: 'none',
          textDecoration: 'none',
        }}
        height="auto"
        width={wi}
        title={title || alt || 'Image'}
      />
    );

    return (
      <Row
        style={{
          marginTop: '0px',
          marginBottom: shouldRemoveBottomMargin ? '0px' : '32px',
        }}
      >
        <Column align={alignment}>
          {externalLink ? (
            <a
              href={externalLink}
              rel="noopener noreferrer"
              style={{
                display: 'block',
                maxWidth: '100%',
                textDecoration: 'none',
              }}
              target="_blank"
            >
              {mainImage}
            </a>
          ) : (
            mainImage
          )}
        </Column>
      </Row>
    );
  }

  private footer(node: JSONContent, options?: NodeOptions): JSX.Element {
    const { attrs } = node;
    const { textAlign = 'left' } = attrs || {};

    const { shouldRemoveBottomMargin } = this.getMarginOverrideConditions(
      node,
      options
    );

    return (
      <Text
        style={{
          fontSize: this.config.theme?.fontSize?.footer?.size,
          lineHeight: this.config.theme?.fontSize?.footer?.lineHeight,
          color: this.config.theme?.colors?.footer,
          marginTop: '0px',
          marginBottom: shouldRemoveBottomMargin ? '0px' : '20px',
          textAlign,
          ...antialiased,
        }}
      >
        {this.getMappedContent(node, {
          ...options,
          parent: node,
        })}
      </Text>
    );
  }

  private blockquote(node: JSONContent, options?: NodeOptions): JSX.Element {
    const { isPrevSpacer, shouldRemoveBottomMargin } =
      this.getMarginOverrideConditions(node, options);

    return (
      <blockquote
        style={{
          borderLeftWidth: '4px',
          borderLeftStyle: 'solid',
          borderLeftColor: this.config.theme?.colors?.blockquoteBorder,
          paddingLeft: '16px',
          marginLeft: '0px',
          marginRight: '0px',
          marginTop: isPrevSpacer ? '0px' : '20px',
          marginBottom: shouldRemoveBottomMargin ? '0px' : '20px',
        }}
      >
        {this.getMappedContent(node, {
          ...options,
          parent: node,
        })}
      </blockquote>
    );
  }
  private code(_: MarkType, text: JSX.Element): JSX.Element {
    return (
      <code
        style={{
          backgroundColor: this.config.theme?.colors?.codeBackground,
          color: this.config.theme?.colors?.codeText,
          padding: '2px 4px',
          borderRadius: '6px',
          fontFamily: CODE_FONT_FAMILY,
          fontWeight: 400,
          letterSpacing: 0,
        }}
      >
        {text}
      </code>
    );
  }
  private linkCard(node: JSONContent, options?: NodeOptions): JSX.Element {
    const { attrs } = node;
    const { shouldRemoveBottomMargin } = this.getMarginOverrideConditions(
      node,
      options
    );

    const { title, description, link, linkTitle, image, badgeText, subTitle } =
      attrs || {};
    const href =
      this.linkValues.get(link) || this.variableValues.get(link) || link || '#';

    return (
      <a
        href={href}
        rel="noopener noreferrer"
        style={{
          border: '1px solid #eaeaea',
          borderRadius: '10px',
          textDecoration: 'none',
          color: 'inherit',
          display: 'block',
          marginBottom: shouldRemoveBottomMargin ? '0px' : '20px',
        }}
        target="_blank"
      >
        {image ? (
          <Row
            style={{
              marginBottom: '6px',
            }}
          >
            <Column
              style={{
                width: '100%',
                height: '100%',
              }}
            >
              <Img
                alt={title || 'Link Card'}
                src={image}
                style={{
                  borderRadius: '10px 10px 0 0',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                title={title || 'Link Card'}
              />
            </Column>
          </Row>
        ) : null}

        <Row
          style={{
            padding: '15px',
            marginTop: 0,
            marginBottom: 0,
          }}
        >
          <Column
            style={{
              verticalAlign: 'top',
            }}
          >
            <Row
              align={undefined}
              style={{
                marginBottom: '8px',
                marginTop: '0px',
              }}
              width="auto"
            >
              <Column>
                <Text
                  style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: this.config.theme?.colors?.linkCardTitle,
                    margin: '0px',
                    ...antialiased,
                  }}
                >
                  {title}
                </Text>
              </Column>
              {badgeText || subTitle ? (
                <Column
                  style={{
                    paddingLeft: '6px',
                    verticalAlign: 'middle',
                  }}
                >
                  {badgeText ? (
                    <span
                      style={{
                        fontWeight: 600,
                        color: this.config.theme?.colors?.linkCardBadgeText,
                        padding: '4px 8px',
                        borderRadius: '8px',
                        backgroundColor:
                          this.config.theme?.colors?.linkCardBadgeBackground,
                        fontSize: '12px',
                        lineHeight: '12px',
                      }}
                    >
                      {badgeText}
                    </span>
                  ) : null}{' '}
                  {subTitle && !badgeText ? (
                    <span
                      style={{
                        fontWeight: 'normal',
                        color: this.config.theme?.colors?.linkCardSubTitle,
                        fontSize: '12px',
                        lineHeight: '12px',
                      }}
                    >
                      {subTitle}
                    </span>
                  ) : null}
                </Column>
              ) : null}
            </Row>
            <Text
              style={{
                fontSize: '16px',
                color: this.config.theme?.colors?.linkCardDescription,
                marginTop: '0px',
                marginBottom: '0px',
                ...antialiased,
              }}
            >
              {description}{' '}
              {linkTitle ? (
                <a
                  href={href}
                  rel="noopener noreferrer"
                  style={{
                    color: this.config.theme?.colors?.linkCardTitle,
                    fontSize: '14px',
                    fontWeight: 600,
                    textDecoration: 'underline',
                  }}
                >
                  {linkTitle}
                </a>
              ) : null}
            </Text>
          </Column>
        </Row>
      </a>
    );
  }

  private section(node: JSONContent, options?: NodeOptions): JSX.Element {
    const { attrs } = node;
    const {
      borderRadius = 0,
      backgroundColor = DEFAULT_SECTION_BACKGROUND_COLOR,
      align = DEFAULT_SECTION_ALIGN,
      borderWidth = DEFAULT_SECTION_BORDER_WIDTH,
      borderColor = DEFAULT_SECTION_BORDER_COLOR,

      marginTop = DEFAULT_SECTION_MARGIN_TOP,
      marginRight = DEFAULT_SECTION_MARGIN_RIGHT,
      marginBottom = DEFAULT_SECTION_MARGIN_BOTTOM,
      marginLeft = DEFAULT_SECTION_MARGIN_LEFT,

      paddingTop = DEFAULT_SECTION_PADDING_TOP,
      paddingRight = DEFAULT_SECTION_PADDING_RIGHT,
      paddingBottom = DEFAULT_SECTION_PADDING_BOTTOM,
      paddingLeft = DEFAULT_SECTION_PADDING_LEFT,
    } = attrs || {};

    const shouldShow = this.shouldShow(node, options);
    if (!shouldShow) {
      return <></>;
    }

    return (
      <Row
        style={{
          marginTop,
          marginRight,
          marginBottom,
          marginLeft,
        }}
      >
        <Column
          align={align}
          style={{
            borderColor,
            borderWidth,
            borderStyle: 'solid',
            backgroundColor,
            borderRadius,

            paddingTop,
            paddingRight,
            paddingBottom,
            paddingLeft,
          }}
        >
          {this.getMappedContent(node, {
            ...options,
            parent: node,
          })}
        </Column>
      </Row>
    );
  }

  private columns(node: JSONContent, options?: NodeOptions): JSX.Element {
    const { attrs } = node;

    const shouldShow = this.shouldShow(node, options);
    if (!shouldShow) {
      return <></>;
    }

    const [newNode, totalWidth] = this.adjustColumnsContent(node);

    return (
      <Row
        width={`${totalWidth}%`}
        style={{
          margin: 0,
          padding: 0,
          width: `${totalWidth}%`,
        }}
        className="tab-row-full"
      >
        {this.getMappedContent(newNode, {
          ...options,
          parent: newNode,
        })}
      </Row>
    );
  }

  private adjustColumnsContent(node: JSONContent): [JSONContent, number] {
    const { content = [] } = node;
    const totalWidth = 100;
    const columnsWithWidth = content.filter(
      (c) => c.type === 'column' && Boolean(Number(c.attrs?.width || 0))
    );
    const autoWidthColumns = content.filter(
      (c) =>
        c.type === 'column' && (c.attrs?.width === 'auto' || !c.attrs?.width)
    );

    const totalWidthUsed = columnsWithWidth.reduce(
      (acc, c) => acc + Number(c.attrs?.width),
      0
    );

    const remainingWidth = totalWidth - totalWidthUsed;
    const measuredWidth = remainingWidth / autoWidthColumns.length;

    const gap = node.attrs?.gap || DEFAULT_COLUMNS_GAP;

    return [
      {
        ...node,
        content: content.map((c, index) => {
          const isAutoWidthColumn =
            c.type === 'column' &&
            (c.attrs?.width === 'auto' || !c.attrs?.width);
          const isFirstColumn = index === 0;
          const isLastColumn = index === content.length - 1;

          return {
            ...c,
            attrs: {
              ...c.attrs,
              width: isAutoWidthColumn ? measuredWidth : c.attrs?.width,

              isFirstColumn,
              isLastColumn,
              index,

              paddingLeft: isFirstColumn ? 0 : gap / 2,
              paddingRight: isLastColumn ? 0 : gap / 2,
            },
          };
        }),
      },
      autoWidthColumns.length === 0
        ? Math.min(totalWidth, totalWidthUsed)
        : totalWidth,
    ];
  }

  private column(node: JSONContent, options?: NodeOptions): JSX.Element {
    const { attrs } = node;
    const {
      width,
      verticalAlign = 'top',
      paddingLeft = 0,
      paddingRight = 0,
    } = attrs || {};

    return (
      <Column
        width={`${Number(width)}%`}
        style={{
          width: `${Number(width)}%`,
          margin: 0,
          verticalAlign,
        }}
        className="tab-col-full"
      >
        <Section
          style={{
            margin: 0,
            paddingLeft,
            paddingRight,
          }}
          className="tab-pad"
        >
          {this.getMappedContent(node, {
            ...options,
            parent: node,
          })}
        </Section>
      </Column>
    );
  }

  private for(node: JSONContent, options?: NodeOptions): JSX.Element {
    const { attrs } = node;
    const { each = '' } = attrs || {};

    const shouldShow = this.shouldShow(node, options);
    if (!shouldShow) {
      return <></>;
    }

    let { payloadValue } = options || {};
    payloadValue = typeof payloadValue === 'object' ? payloadValue : {};

    const values = this.payloadValues.get(each) ?? payloadValue[each] ?? [];
    if (!Array.isArray(values)) {
      throw new Error(`Payload value for each "${each}" is not an array`);
    }

    return (
      <>
        {values.map((value) => {
          return (
            <Fragment key={generateKey()}>
              {this.getMappedContent(node, {
                ...options,
                parent: node,
                payloadValue: value,
              })}
            </Fragment>
          );
        })}
      </>
    );
  }

  private shouldShow(node: JSONContent, options?: NodeOptions): boolean {
    const showIfKey = node?.attrs?.showIfKey ?? '';
    if (!showIfKey) {
      return true;
    }

    let { payloadValue } = options || {};
    payloadValue = typeof payloadValue === 'object' ? payloadValue : {};
    return !!(this.payloadValues.get(showIfKey) ?? payloadValue[showIfKey]);
  }
}
