import type { ReactNode } from 'react';
import { PublicHeader } from './PublicHeader';
import { PublicFooter } from './PublicFooter';

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="shell-page">
      <a className="skip-link" href="#main-content">
        Bỏ qua điều hướng tới nội dung chính
      </a>
      <PublicHeader />
      <main id="main-content" className="shell-main public-main" tabIndex={-1}>
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
