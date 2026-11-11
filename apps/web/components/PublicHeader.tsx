'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import { Field } from './Field';

const HOME_TITLE = 'Cùng bạn chăm boss bằng kiến thức đáng tin cậy';
const MEMBER_NAME = 'Nguyễn Hoàng Minh Anh — người bạn của những chú chó và mèo';

export function PublicHeader() {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const [previousPath, setPreviousPath] = useState(pathname);
  const [member, setMember] = useState(false);
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState<string | null>(null);
  const menu = useRef<HTMLButtonElement>(null);
  const brand = useRef<HTMLAnchorElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const open = openPath === pathname;
  const found = !!searched && HOME_TITLE.toLocaleLowerCase('vi').includes(searched.toLocaleLowerCase('vi'));

  if (previousPath !== pathname) {
    setPreviousPath(pathname);
    setOpenPath(null);
  }

  useEffect(() => {
    const desktop = matchMedia('(min-width: 1024px)');
    function resize() {
      setOpenPath(null);
      if (!desktop.matches && panel.current?.contains(document.activeElement)) menu.current?.focus();
      if (desktop.matches && document.activeElement === menu.current) brand.current?.focus();
    }
    desktop.addEventListener('change', resize);
    return () => desktop.removeEventListener('change', resize);
  }, []);

  return (
    <header
      className="shell-header public-header"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          event.preventDefault();
          setOpenPath(null);
          menu.current?.focus();
        }
      }}
    >
      <div className="shell-container public-header-inner">
        <Link
          ref={brand}
          href="/"
          className="brand-mark"
          aria-label="OCungBoss — Trang chủ"
          onClick={() => setOpenPath(null)}
        >
          <span className="brand-badge" aria-hidden="true">
            OB
          </span>
          <span>Ở Cùng Boss</span>
        </Link>
        <Button
          ref={menu}
          variant="secondary"
          className="public-menu"
          aria-expanded={open}
          aria-controls="public-navigation"
          onClick={() => setOpenPath(open ? null : pathname)}
        >
          Menu
        </Button>
        <div ref={panel} id="public-navigation" className={`public-navigation${open ? ' is-open' : ''}`}>
          <nav aria-label="Điều hướng chính">
            <Link
              href="/"
              className="nav-pill"
              aria-current={pathname === '/' ? 'page' : undefined}
              onClick={() => setOpenPath(null)}
            >
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
                {found && (
                  <Link href="/" onClick={() => setOpenPath(null)}>
                    {HOME_TITLE}
                  </Link>
                )}
              </div>
            )}
          </div>
          <div className="header-account">
            <p>{member ? MEMBER_NAME : 'Bạn đang xem với tư cách khách'}</p>
            <Button onClick={() => setMember(!member)}>{member ? 'Đăng xuất (mẫu)' : 'Đăng nhập (mẫu)'}</Button>
            <small role="status">{member ? 'Thành viên mô phỏng' : 'Khách'} · Không xác thực tài khoản thật</small>
          </div>
        </div>
      </div>
    </header>
  );
}
