import { is } from '@maily-to/shared';
import { Column, Img, Row, Text } from '@react-email/components';

import { resolveVariableText } from '../lib/resolve-variable';
import { shouldSuppressMarginBottom } from '../lib/spacing';
import { ANTIALIASED } from '../lib/styles';
import { shouldShow } from '../lib/visibility';
import type { NodeRenderer } from '../node';

export const linkCard: NodeRenderer = (node, ctx) => {
  if (!is.linkCard(node)) {
    return null;
  }

  if (!shouldShow(node, ctx)) {
    return null;
  }

  const { title, description, link, linkTitle, image, subTitle, badgeText } =
    node.attrs;
  const theme = ctx.config.theme.linkCard;

  const resolvedLink = link ? resolveVariableText(link, ctx) : '';
  const href = resolvedLink || '#';

  return (
    <a
      href={href}
      rel="noopener noreferrer"
      style={{
        border: `1px solid ${theme?.borderColor ?? '#eaeaea'}`,
        borderRadius: 10,
        textDecoration: 'none',
        color: 'inherit',
        display: 'block',
        marginBottom: shouldSuppressMarginBottom(ctx) ? 0 : 20,
      }}
      target="_blank"
    >
      {image ? (
        <Row style={{ marginBottom: 6 }}>
          <Column style={{ width: '100%', height: '100%' }}>
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

      <Row style={{ padding: 15, marginTop: 0, marginBottom: 0 }}>
        <Column style={{ verticalAlign: 'top' }}>
          <Row
            style={{ marginBottom: 8, marginTop: 0 }}
            width="100%"
            align="left"
          >
            <Column>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: theme?.titleColor ?? '#111827',
                  margin: 0,
                  textAlign: 'left',
                  ...ANTIALIASED,
                }}
              >
                {title}
                {badgeText && (
                  <span
                    style={{
                      fontWeight: 600,
                      color: theme?.badgeTextColor ?? '#6B7280',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      backgroundColor: theme?.badgeBackgroundColor ?? '#F3F4F6',
                      fontSize: '12px',
                      lineHeight: '12px',
                      marginLeft: '6px',
                    }}
                  >
                    {badgeText}
                  </span>
                )}
                {subTitle && !badgeText && (
                  <span
                    style={{
                      fontWeight: 'normal',
                      color: theme?.subTitleColor ?? '#6B7280',
                      fontSize: 12,
                      lineHeight: '12px',
                      marginLeft: '6px',
                    }}
                  >
                    {subTitle}
                  </span>
                )}
              </Text>
            </Column>
          </Row>
          <Text
            style={{
              fontSize: 16,
              color: theme?.descriptionColor ?? '#374151',
              marginTop: 0,
              marginBottom: 0,
            }}
          >
            {description}{' '}
            {linkTitle ? (
              <a
                href={href}
                rel="noopener noreferrer"
                style={{
                  color: theme?.titleColor ?? '#111827',
                  fontSize: 14,
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
};
