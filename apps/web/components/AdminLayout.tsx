'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { hasUiCapability, type FixtureActor, type UiCapability } from '../lib/fixtures';
import { Alert } from './Alert';
import { Field } from './Field';
import { ResponsiveNavigation } from './ResponsiveNavigation';

const ROUTES: readonly { href: string; label: string; capability: UiCapability }[] = [
  { href: '/preview/admin', label: 'Bài viết & nội dung (mẫu)', capability: 'content.edit' },
  { href: '/preview/admin/review', label: 'Kiểm duyệt nội dung (mẫu)', capability: 'content.review' },
];
export function AdminLayout({
  actor,
  controls,
  children,
}: {
  actor: FixtureActor;
  controls: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const allowedRoutes =
    actor.accountStatus === 'active' ? ROUTES.filter((route) => hasUiCapability(actor, route.capability)) : [];
  const visibleRoutes = allowedRoutes.filter((route) =>
    route.label.toLocaleLowerCase('vi').includes(query.trim().toLocaleLowerCase('vi')),
  );
  const allowed = allowedRoutes.some((route) => route.href === pathname);
  return (
    <div className="admin-shell">
      <a className="skip-link" href="#main-content">
        Bỏ qua điều hướng tới nội dung chính
      </a>
      <aside className="admin-sidebar" aria-label="Thanh điều hướng quản trị">
        <Link href="/preview#public-layout" className="brand-mark">
          Ở Cùng Boss · Quản trị mẫu
        </Link>
        <ResponsiveNavigation id="admin-navigation" className="admin-navigation" label="Menu quản trị">
          <nav aria-label="Điều hướng quản trị">
            {visibleRoutes.map((route) => (
              <Link key={route.href} href={route.href} aria-current={pathname === route.href ? 'page' : undefined}>
                {route.label}
              </Link>
            ))}
            {!visibleRoutes.length && <p>Không có mục phù hợp với quyền hoặc bộ lọc mẫu.</p>}
          </nav>
        </ResponsiveNavigation>
      </aside>
      <div className="admin-workspace">
        <header className="admin-header">
          <div className="admin-search">
            <Field
              id="admin-search"
              label="Lọc menu quản trị mẫu"
              type="search"
              maxLength={100}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <p role="status">{visibleRoutes.length} mục điều hướng mẫu</p>
          </div>
          <div className="admin-controls">{controls}</div>
        </header>
        <main id="main-content" className="admin-main" tabIndex={-1}>
          {allowed ? (
            children
          ) : (
            <section>
              <h1>Không có quyền truy cập mẫu</h1>
              <Alert
                variant="error"
                title="Truy cập bị từ chối"
                message="Vai trò, MFA hoặc capability mẫu chưa đáp ứng. Chọn preset phù hợp hoặc dùng một mục menu được phép; đây không phải xác thực server."
              />
            </section>
          )}
        </main>
        <footer className="admin-footer">
          © 2026 Ở Cùng Boss · Preview quản trị, dữ liệu giả, không gọi API hoặc lưu thay đổi.
        </footer>
      </div>
    </div>
  );
}
