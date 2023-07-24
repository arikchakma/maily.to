type PlaygroundLayoutProps = {
  children: React.ReactNode;
};

export const metadata = {
  title: 'Playground - Maily',
};

export default async function PlaygroundLayout(props: PlaygroundLayoutProps) {
  return (
    <>
      {props.children}
    </>
  );
}
