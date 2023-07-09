import './globals.css';

export const metadata = {
  title: 'Mailbox',
  description: 'Opinionated email design system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
