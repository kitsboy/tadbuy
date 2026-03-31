import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TadBuy Metrics — BTC-First Ad Analytics',
  description: 'Bitcoin-denominated ad analytics and cost-of-value calculator. Fix the money, fix the world.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-midnight text-white min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
