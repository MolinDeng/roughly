import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Analytics } from '@vercel/analytics/react';

const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Roughly',
  description: 'Whiteboard with hand-drawn, sketchy look',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body
        className={cn('min-h-screen antialiased grainy', montserrat.className)}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
