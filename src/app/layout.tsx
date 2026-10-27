import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SeedCart | Multi-Category E-Commerce Store',
  description: 'Shop curated fashion, electronics, cosmetics, home decor, and lifestyle products with instant WhatsApp checkout.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col font-sans antialiased bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
