'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from './Button';
import { Field } from './Field';
import { ResponsiveNavigation } from './ResponsiveNavigation';

const HOME_TITLE = 'Cùng bạn chăm boss bằng kiến thức đáng tin cậy';
const MEMBER_NAME = 'Nguyễn Hoàng Minh Anh — người bạn của những chú chó và mèo';

export function PublicHeader() {
  const pathname = usePathname();
  const [member, setMember] = useState(false);
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState<string | null>(null);
  const found = !!searched && HOME_TITLE.toLocaleLowerCase('vi').includes(searched.toLocaleLowerCase('vi'));

  return (
    <header className="shell-header public-header">
      <div className="shell-container public-header-inner">
        <Link href="/" className="brand-mark" aria-label="OCungBoss — Trang chủ">
          <span className="brand-badge" aria-hidden="true">
            OB
          </span>
          <span>Ở Cùng Boss</span>
        </Link>
        <ResponsiveNavigation id="public-navigation" className="public-navigation">
          <nav aria-label="Điều hướng chính">
            <Link href="/" className="nav-pill" aria-current={pathname === '/' ? 'page' : undefined}>
              Trang chủ
            </Link>
          </nav>
          <div className="header-search">
            <form
              role="search"
              aria-label="Tìm kiếm mẫu"
              onSubmit={(event) => {
                event.preventDefault();
                setSearched(query.trim());
              }}
            >
              <Field
                id="public-search"
                label="Tìm kiếm nội dung (mẫu)"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                required
                maxLength={100}
                placeholder="Tìm bài viết, giống…"
              />
              <Button type="submit" variant="secondary">
                Tìm
              </Button>
            </form>
            {searched !== null && (
              <div className="header-search-result">
                <p role="status">{found ? '1 kết quả mẫu.' : 'Không có kết quả mẫu.'}</p>
                {found && <Link href="/">{HOME_TITLE}</Link>}
              </div>
            )}
          </div>
          <div className="header-account">
            <p>{member ? MEMBER_NAME : 'Bạn đang xem với tư cách khách'}</p>
            <Button onClick={() => setMember(!member)}>{member ? 'Đăng xuất (mẫu)' : 'Đăng nhập (mẫu)'}</Button>
            <small role="status">{member ? 'Thành viên mô phỏng' : 'Khách'} · Không xác thực tài khoản thật</small>
          </div>
        </ResponsiveNavigation>
      </div>
    </header>
  );
}
