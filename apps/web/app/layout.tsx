import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { PublicLayout } from '../components/PublicLayout';

import './globals.css';

export const metadata: Metadata = {
  title: 'OCungBoss — Đồng hành cùng boss',
  description: 'Kiến thức và công cụ chăm sóc chó, mèo dành cho người Việt.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="vi" data-scroll-behavior="smooth">
      <body>
        <PublicLayout>{children}</PublicLayout>
      </body>
    </html>
  );
}
