import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SEED — Rooted in Quality',
  description: 'Premium fashion, technical outerwear, and lifestyle shopping experience rooted in authentic quality. Instant WhatsApp ordering.',
  icons: {
    icon: '/seed-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col font-sans antialiased bg-white text-neutral-900 selection:bg-seed selection:text-black">
        {children}
      </body>
    </html>
  );
}
