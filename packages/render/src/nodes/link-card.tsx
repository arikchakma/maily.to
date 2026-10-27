import { is } from '@maily-to/shared';
import { Column, Img, Row } from '@react-email/components';

import { getSafeHref } from '../lib/link';
import { resolveVariableText } from '../lib/resolve-variable';
import { shouldSuppressMarginBottom } from '../lib/spacing';
import { ANTIALIASED, getNodeStyle } from '../lib/styles';
import type { NodeRenderer } from '../node';

export const linkCard: NodeRenderer = (node, ctx) => {
  if (!is.linkCard(node)) {
    return null;
  }

  const { badgeText, description, image, link, linkTitle, subTitle, title } =
    node.attrs;
  const href = (link ? getSafeHref(resolveVariableText(link, ctx)) : '') || '#';
  const alt = title || 'Link card';

  return (
    <a
      href={href}
      rel="noopener noreferrer"
      style={{
        border: '1px solid #eaeaea',
        borderRadius: '10px',
        color: 'inherit',
        display: 'block',
        marginBottom: shouldSuppressMarginBottom(ctx) ? '0' : '20px',
        textDecoration: 'none',
        ...getNodeStyle(node.attrs?.style),
      }}
      target="_blank"
    >
      {image ? (
        <Row style={{ marginBottom: '6px' }}>
          <Column style={{ height: '100%', width: '100%' }}>
            <Img
              alt={alt}
              src={image}
              style={{
                borderRadius: '10px 10px 0 0',
                height: '100%',
                objectFit: 'cover',
                width: '100%',
              }}
              title={alt}
            />
          </Column>
        </Row>
      ) : null}

      <Row style={{ marginBottom: '0', marginTop: '0', padding: '15px' }}>
        <Column style={{ verticalAlign: 'top' }}>
          <Row align="left" style={{ marginBottom: '8px', marginTop: '0' }}>
            <Column>
              <p
                style={{
                  ...ANTIALIASED,
                  color: '#111827',
                  fontSize: '18px',
                  fontWeight: '600',
                  lineHeight: '24px',
                  margin: '0',
                  textAlign: 'left',
                }}
              >
                {title}
                {badgeText ? (
                  <span
                    style={{
                      backgroundColor: '#f3f4f6',
                      borderRadius: '8px',
                      color: '#6b7280',
                      fontSize: '12px',
                      fontWeight: '600',
                      lineHeight: '12px',
                      marginLeft: '6px',
                      padding: '4px 8px',
                    }}
                  >
                    {badgeText}
                  </span>
                ) : null}
                {subTitle && !badgeText ? (
                  <span
                    style={{
                      color: '#6b7280',
                      fontSize: '12px',
                      fontWeight: 'normal',
                      lineHeight: '12px',
                      marginLeft: '6px',
                    }}
                  >
                    {subTitle}
                  </span>
                ) : null}
              </p>
            </Column>
          </Row>

          <p
            style={{
              color: '#374151',
              fontSize: '16px',
              lineHeight: '24px',
              marginBottom: '0',
              marginTop: '0',
            }}
          >
            {description}{' '}
            {linkTitle ? (
              <a
                href={href}
                rel="noopener noreferrer"
                style={{
                  color: '#111827',
                  fontSize: '14px',
                  fontWeight: '600',
                  textDecoration: 'underline',
                }}
                target="_blank"
              >
                {linkTitle}
              </a>
            ) : null}
          </p>
        </Column>
      </Row>
    </a>
  );
};
