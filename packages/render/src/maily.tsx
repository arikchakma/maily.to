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
} from '@react-email/components';
import {
  render as reactEmailRender,
  renderAsync as reactEmailRenderAsync,
} from '@react-email/render';
import type { JSONContent } from '@tiptap/core';
import merge from 'lodash/merge';
import { generateKey } from './utils';

interface NodeOptions {
  parent?: JSONContent;
  prev?: JSONContent;
  next?: JSONContent;
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
  colors?: {
    heading?: string;
    paragraph?: string;
    horizontal?: string;
    footer?: string;
    blockquoteBorder?: string;
    codeBackground?: string;
    codeText?: string;
  };
  fontSize?: {
    paragraph?: string;
    footer?: {
      size?: string;
      lineHeight?: string;
    };
  };
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
   *     heading: 'rgb(17, 24, 39)',
   *     paragraph: 'rgb(55, 65, 81)',
   *     horizontal: 'rgb(234, 234, 234)',
   *     footer: 'rgb(100, 116, 139)',
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
   *       heading: 'rgb(17, 24, 39)',
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
  theme?: ThemeOptions;
}

const DEFAULT_RENDER_OPTIONS: RenderOptions = {
  pretty: false,
  plainText: false,
};

const DEFAULT_THEME: ThemeOptions = {
  colors: {
    heading: 'rgb(17, 24, 39)',
    paragraph: 'rgb(55, 65, 81)',
    horizontal: 'rgb(234, 234, 234)',
    footer: 'rgb(100, 116, 139)',
    blockquoteBorder: 'rgb(209, 213, 219)',
    codeBackground: 'rgb(239, 239, 239)',
    codeText: 'rgb(17, 24, 39)',
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
  private variableValues: VariableValues = new Map<string, string>();
  private linkValues: LinkValues = new Map<string, string>();
  private openTrackingPixel: string | undefined;

  constructor(content: JSONContent = { type: 'doc', content: [] }) {
    this.content = content;
  }

  setPreviewText(preview?: string) {
    this.config.preview = preview;
  }

  setTheme(theme?: ThemeOptions) {
    this.config.theme = merge(this.config.theme, theme);
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

  renderSync(options: RenderOptions = DEFAULT_RENDER_OPTIONS): string {
    const markup = this.markup();
    return reactEmailRender(markup, options);
  }

  async renderAsync(
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
              __html: `blockquote,h1,h2,h3,img,li,ol,p,ul{margin-top:0;margin-bottom:0}`,
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
        <Body>
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

  // `getMappedContent` will call corresponding node type
  // and return text content
  private getMappedContent(
    node: JSONContent,
    options?: NodeOptions
  ): JSX.Element[] {
    return node.content
      ?.map((childNode) => {
        const component = this.renderNode(childNode, options);
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
    const text = node.text || <>&nbsp;</>;
    const marks = node.marks || [];

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

    const { parent, next } = options || {};
    const isParentListItem = parent?.type === 'listItem';
    const isNextSpacer = next?.type === 'spacer';

    return (
      <Text
        style={{
          textAlign: alignment,
          marginBottom: isParentListItem || isNextSpacer ? '0px' : '20px',
          marginTop: '0px',
          fontSize: this.config.theme?.fontSize?.paragraph,
          color: this.config.theme?.colors?.paragraph,
          ...antialiased,
        }}
      >
        {node.content ? this.getMappedContent(node) : <>&nbsp;</>}
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
    const { next, prev } = options || {};

    const level = `h${Number(attrs?.level) || 1}`;
    const alignment = attrs?.textAlign || 'left';
    const isNextSpacer = next?.type === 'spacer';
    const isPrevSpacer = prev?.type === 'spacer';

    const { fontSize, lineHeight, fontWeight } =
      headings[level as AllowedHeadings];

    return (
      <Heading
        // @ts-expect-error - `this` is not assignable to type 'never'
        as={level}
        style={{
          textAlign: alignment,
          color: this.config.theme?.colors?.heading,
          marginBottom: isNextSpacer ? '0px' : '12px',
          marginTop: isPrevSpacer ? '0px' : '0px',
          fontSize,
          lineHeight,
          fontWeight,
        }}
      >
        {this.getMappedContent(node)}
      </Heading>
    );
  }

  private variable(node: JSONContent, _?: NodeOptions): JSX.Element {
    const { id: variable, fallback } = node.attrs || {};

    let formattedVariable = this.variableFormatter({
      variable,
      fallback,
    });

    // If `shouldReplaceVariableValues` is true, replace the variable values
    // Otherwise, just return the formatted variable
    if (this.shouldReplaceVariableValues) {
      formattedVariable =
        this.variableValues.get(variable) || fallback || formattedVariable;
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

  private orderedList(node: JSONContent, _?: NodeOptions): JSX.Element {
    return (
      <Container>
        <ol
          style={{
            marginTop: '0px',
            marginBottom: '20px',
            paddingLeft: '26px',
            listStyleType: 'decimal',
          }}
        >
          {this.getMappedContent(node)}
        </ol>
      </Container>
    );
  }

  private bulletList(node: JSONContent, _?: NodeOptions): JSX.Element {
    return (
      <Container
        style={{
          maxWidth: '100%',
        }}
      >
        <ul
          style={{
            marginTop: '0px',
            marginBottom: '20px',
            paddingLeft: '26px',
            listStyleType: 'disc',
          }}
        >
          {this.getMappedContent(node)}
        </ul>
      </Container>
    );
  }

  private listItem(node: JSONContent, options?: NodeOptions): JSX.Element {
    return (
      <Container
        style={{
          maxWidth: '100%',
        }}
      >
        <li
          style={{
            marginBottom: '8px',
            paddingLeft: '6px',
            ...antialiased,
          }}
        >
          {this.getMappedContent(node, { ...options, parent: node })}
        </li>
      </Container>
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

    let radius: string | undefined = '0px';
    if (borderRadius === 'round') {
      radius = '9999px';
    } else if (borderRadius === 'smooth') {
      radius = '6px';
    }

    const { next } = options || {};
    const isNextSpacer = next?.type === 'spacer';

    const href =
      this.linkValues.get(url) || this.variableValues.get(url) || url;

    return (
      <Container
        style={{
          textAlign: alignment,
          maxWidth: '100%',
          marginBottom: isNextSpacer ? '0px' : '20px',
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

  private spacer(node: JSONContent, _?: NodeOptions): JSX.Element {
    const { attrs } = node;
    const { height = 'auto' } = attrs || {};

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

    const { next } = options || {};
    const isNextSpacer = next?.type === 'spacer';

    return (
      <Row
        style={{
          marginTop: '0px',
          marginBottom: isNextSpacer ? '0px' : '32px',
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
      height = 'auto',
      alignment = 'center',
      externalLink = '',
    } = attrs || {};

    const { next } = options || {};
    const isNextSpacer = next?.type === 'spacer';

    const mainImage = (
      <Img
        alt={alt || title || 'Image'}
        src={src}
        style={{
          height,
          width,
          maxWidth: '100%',
          outline: 'none',
          border: 'none',
          textDecoration: 'none',
        }}
        title={title || alt || 'Image'}
      />
    );

    return (
      <Row
        style={{
          marginTop: '0px',
          marginBottom: isNextSpacer ? '0px' : '32px',
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

    const { next } = options || {};
    const isNextSpacer = next?.type === 'spacer';

    return (
      <Text
        style={{
          fontSize: this.config.theme?.fontSize?.footer?.size,
          lineHeight: this.config.theme?.fontSize?.footer?.lineHeight,
          color: this.config.theme?.colors?.footer,
          marginTop: '0px',
          marginBottom: isNextSpacer ? '0px' : '20px',
          textAlign,
          ...antialiased,
        }}
      >
        {this.getMappedContent(node)}
      </Text>
    );
  }

  private blockquote(node: JSONContent, options?: NodeOptions): JSX.Element {
    const { next, prev } = options || {};
    const isNextSpacer = next?.type === 'spacer';
    const isPrevSpacer = prev?.type === 'spacer';

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
          marginBottom: isNextSpacer ? '0px' : '20px',
        }}
      >
        {this.getMappedContent(node)}
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
}
