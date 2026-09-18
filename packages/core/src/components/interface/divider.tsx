export type DividerProps = {
  type?: 'horizontal' | 'vertical';
};

export function Divider(props: DividerProps) {
  const { type = 'vertical' } = props;

  return <div data-mly-divider="" data-type={type} role="separator" />;
}
