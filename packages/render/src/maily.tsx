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
} from '@react-email/components';
import {
  render as reactEmailRender,
  renderAsync as reactEmailRenderAsync,
} from '@react-email/render';
import type { JSONContent } from '@tiptap/core';
import { generateKey } from './utils';

interface NodeOptions {
  parent?: JSONContent;
  prev?: JSONContent;
  next?: JSONContent;
}

export interface RenderOptions {
  pretty?: boolean;
  plainText?: boolean;
}

export interface ThemeOptions {
  colors?: {
    heading?: string;
    paragraph?: string;
    horizontal?: string;
    footer?: string;
  };
  fontSize?: {
    paragraph?: string;
    footer?: {
      size?: string;
      lineHeight?: string;
    };
  };
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

export interface MailyConfig {
  /**
   * The options object allows you to customize the output of the rendered
   * email.
   * - `pretty` - If `true`, the output will be formatted with indentation and
   *  line breaks.
   * - `plainText` - If `true`, the output will be plain text instead of HTML.
   * This is useful for testing purposes.
   *
   * Default: `{ pretty: false, plainText: false }`
   *
   * @example
   * ```js
   * const maily = new Maily(content, {
   *  options: {
   *   pretty: true,
   *   plainText: true,
   * },
   * });
   * ```
   */
  options?: RenderOptions;
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

  /**
   * The variable formatter function allows you to customize the format of
   * variables in the rendered email.
   * - `variable` - The variable name.
   * - `fallback` - The fallback value.
   *
   * Default: `{{variable,fallback=${fallback}}}`
   *
   * @example
   * ```js
   * const maily = new Maily(content, {
   *  variableFormatter: ({ variable, fallback }) => {
   *   return `{{${variable},fallback=${fallback}}}`;
   *  },
   * });
   * ```
   */
  variableFormatter?: (options: {
    variable: string;
    fallback: string;
  }) => string;
  /**
   * The variable values object allows you to replace the variable with a
   * specific value.
   *
   * Default: `undefined`
   */
  variableValues?: Record<string, string>;
}

export class Maily {
  private readonly content: JSONContent;
  private config: MailyConfig = {
    options: {
      pretty: false,
      plainText: false,
    },
    theme: {
      colors: {
        heading: 'rgb(17, 24, 39)',
        paragraph: 'rgb(55, 65, 81)',
        horizontal: 'rgb(234, 234, 234)',
        footer: 'rgb(100, 116, 139)',
      },
      fontSize: {
        paragraph: '15px',
        footer: {
          size: '14px',
          lineHeight: '24px',
        },
      },
    },

    // The default variable formatter will format the variable as
    // `{{variable,fallback=${fallback}}}`
    variableFormatter: (options) => {
      const { variable, fallback } = options;
      return `{{${variable},fallback=${fallback}}}`;
    },
  };

  constructor(
    content: JSONContent = { type: 'doc', content: [] },
    config: Partial<MailyConfig> = {}
  ) {
    this.content = content;
    this.config = {
      ...this.config,
      ...config,
    };
  }

  render(): string {
    const options = this.config.options || {};
    const markup = this.markup();

    return reactEmailRender(markup, options);
  }

  async renderAsync(): Promise<string> {
    const options = this.config.options || {};
    const markup = this.markup();

    return reactEmailRenderAsync(markup, options);
  }

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
        </Head>
        {preview ? <Preview>{preview}</Preview> : null}
        <Body>
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
      ?.filter((n) => n !== null) as JSX.Element[];
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
    const href = attrs?.href || '#';
    const target = attrs?.target || '_blank';
    const rel = attrs?.rel || 'noopener noreferrer nofollow';

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

    let formattedVariable = this.config.variableFormatter?.({
      variable,
      fallback,
    });

    // If a variable value is provided, use it to replace the variable
    if (typeof this.config.variableValues === 'object') {
      formattedVariable =
        this.config.variableValues[variable] || formattedVariable;
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
      <Container>
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

  private button(node: JSONContent, _?: NodeOptions): JSX.Element {
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

    return (
      <Container
        style={{
          textAlign: alignment,
        }}
      >
        <Button
          href={url}
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
      alignment,
    } = attrs || {};

    let margin: CSSProperties = {
      marginRight: 'auto',
    };
    if (alignment === 'center') {
      margin = {
        marginRight: 'auto',
        marginLeft: 'auto',
      };
    } else if (alignment === 'right') {
      margin = {
        marginLeft: 'auto',
      };
    }

    const { next } = options || {};
    const isNextSpacer = next?.type === 'spacer';

    return (
      <Img
        alt={alt || title || 'Logo'}
        src={src}
        style={{
          width: logoSizes[size as AllowedLogoSizes] || size,
          height: logoSizes[size as AllowedLogoSizes] || size,
          ...margin,
          marginBottom: isNextSpacer ? '0px' : '32px',
        }}
        title={title || alt || 'Logo'}
      />
    );
  }

  private image(node: JSONContent, options?: NodeOptions): JSX.Element {
    const { attrs } = node;
    const { src, alt, title } = attrs || {};

    const { next } = options || {};
    const isNextSpacer = next?.type === 'spacer';

    return (
      <Img
        alt={alt || title || 'Image'}
        src={src}
        style={{
          height: 'auto',
          width: 'auto',
          maxWidth: '100%',
          marginBottom: isNextSpacer ? '0px' : '32px',
          marginTop: '0px',
        }}
        title={title || alt || 'Image'}
      />
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
}
