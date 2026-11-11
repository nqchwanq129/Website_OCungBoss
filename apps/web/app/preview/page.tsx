import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { Field } from '../../components/Field';
import { LoadingState } from '../../components/LoadingState';
import { ButtonPlayground } from './ButtonPlayground';
import { CardPlayground } from './CardPlayground';
import { ConfirmDialogPlayground } from './ConfirmDialogPlayground';
import { AlertPlayground } from './AlertPlayground';
import { FieldPlayground } from './FieldPlayground';
import { FixturePlayground } from './FixturePlayground';
import { LoadingPlayground } from './LoadingPlayground';
import { PaginationPlayground } from './PaginationPlayground';
import { SelectPlayground } from './SelectPlayground';

export const metadata: Metadata = {
  title: 'Preview dữ liệu ảo & kịch bản tương tác | OCungBoss',
  description:
    'Preview local cho CSS tokens Warm Earth, dữ liệu ảo, vai trò người dùng và 74 mã ca P01–Q01 của OCungBoss.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PreviewPage() {
  return (
    <div className="shell-page">
      <header className="shell-header">
        <div className="shell-container shell-header-inner">
          <Link href="/" className="brand-mark" aria-label="OCungBoss — Trang chủ">
            <span className="brand-badge" aria-hidden="true">
              OB
            </span>
            <span>OCungBoss</span>
          </Link>

          <nav aria-label="Điều hướng khu vực preview">
            <ul className="nav-list">
              <li>
                <Link href="/" className="nav-pill">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/preview" className="nav-pill" aria-current="page">
                  Preview Fixtures (/preview)
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main id="main-content" className="shell-main" tabIndex={-1}>
        <div className="shell-container">
          <section className="hero-panel preview-hero" aria-labelledby="preview-title">
            <p className="eyebrow">Task 9 · Dữ liệu ảo &amp; Kịch bản tương tác Frontend</p>
            <h1 id="preview-title" className="hero-title">
              Bộ điều khiển dữ liệu ảo &amp; mô phỏng trạng thái UI
            </h1>
            <p className="hero-lead">
              Kiểm chứng trực tiếp 8 vai trò (<code>G</code>, <code>U0</code>, <code>UA</code>, <code>UB</code>,{' '}
              <code>AP</code>, <code>AM</code>, <code>UL</code>, <code>UD</code>), biến thể dữ liệu đọc (bình thường,
              rỗng, dài, chậm, lỗi, không quyền), 7 thao tác tương tác mô phỏng và danh mục 74 mã ca{' '}
              <code>P01–Q01</code> ngay trên trình duyệt mà không cần API hay cơ sở dữ liệu thật.
            </p>
          </section>

          <section id="design-tokens" className="shell-card token-preview" aria-labelledby="tokens-title">
            <h2 id="tokens-title">CSS tokens · Warm Earth</h2>
            <p>
              Màu, chữ và kích thước từ thiết kế đã chọn. Font dùng tên và fallback trên máy; trang này không tải font,
              ảnh hoặc CDN bên ngoài.
            </p>

            <h3>Palette</h3>
            <ul className="token-grid" aria-label="Palette Warm Earth">
              {['primary', 'secondary', 'canvas', 'border', 'surface', 'heading', 'body'].map((token) => (
                <li key={token}>
                  <div className="token-swatch" style={{ backgroundColor: `var(--${token})` }} aria-hidden="true" />
                  <code>--{token}</code>
                </li>
              ))}
            </ul>

            <h3>Typography</h3>
            <ul className="token-grid" aria-label="Kiểu chữ">
              {[
                'display-lg-mobile',
                'display-lg',
                'headline-lg-mobile',
                'headline-lg',
                'headline-md',
                'headline-sm',
                'body-lg',
                'body-md',
                'body-sm',
                'label-lg',
                'label-md',
                'label-sm',
              ].map((role) => (
                <li key={role}>
                  <code>{role}</code>
                  <p
                    style={{
                      fontFamily: role.startsWith('body') ? 'var(--font-body)' : 'var(--font-heading)',
                      fontSize: `var(--font-size-${role})`,
                      lineHeight: `var(--line-height-${role})`,
                      fontWeight: `var(--font-weight-${role})`,
                      letterSpacing: `var(--letter-spacing-${role}, normal)`,
                    }}
                  >
                    Chăm boss mỗi ngày
                  </p>
                </li>
              ))}
            </ul>

            <h3>Spacing</h3>
            <ul className="token-grid" aria-label="Khoảng cách">
              {[
                'space-xs',
                'space-sm',
                'space-md',
                'space-lg',
                'space-xl',
                'gutter',
                'margin',
                'margin-mobile',
                'gutter-mobile',
              ].map((token) => (
                <li key={token}>
                  <code>--{token}</code>
                  <div className="token-spacing-sample" style={{ width: `var(--${token})` }} aria-hidden="true" />
                </li>
              ))}
            </ul>

            <h3>Radius</h3>
            <ul className="token-grid" aria-label="Bo góc">
              {['default', 'lg', 'xl', 'full'].map((radius) => (
                <li key={radius}>
                  <div
                    className="token-radius-sample"
                    style={{ borderRadius: `var(--radius-${radius})` }}
                    aria-hidden="true"
                  />
                  <code>--radius-{radius}</code>
                </li>
              ))}
            </ul>

            <h3>Breakpoint</h3>
            <ul className="token-grid" aria-label="Breakpoint">
              {['sm · 640px', 'md · 768px', 'lg · 1024px', 'xl · 1280px'].map((breakpoint) => (
                <li key={breakpoint}>
                  <code>{breakpoint}</code>
                </li>
              ))}
            </ul>

            <h3>Chữ, placeholder và viền control</h3>
            <Field
              id="token-example"
              label="Tên hồ sơ mẫu"
              type="text"
              placeholder="Nhập tên boss để thử"
              autoComplete="off"
            />
            <a className="btn-primary" href="#fixtures">
              Thử dữ liệu ảo
            </a>
          </section>

          <ButtonPlayground />
          <FieldPlayground />
          <SelectPlayground />
          <CardPlayground />
          <AlertPlayground />
          <LoadingPlayground />
          <ConfirmDialogPlayground />
          <Suspense
            fallback={<LoadingState regionLabel="Đang mở danh sách ca mẫu" statusLabel="Đang đọc bộ lọc mẫu." />}
          >
            <PaginationPlayground />
          </Suspense>

          <div id="fixtures">
            <FixturePlayground />
          </div>
        </div>
      </main>

      <footer className="shell-footer">
        <div className="shell-container">
          <p className="disclaimer-box">
            <strong>Miễn trừ trách nhiệm thú y &amp; lưu ý dữ liệu ảo:</strong> Toàn bộ nội dung trên trang{' '}
            <code>/preview</code> là dữ liệu giả lập phục vụ phát triển giao diện; thông tin chăm sóc thú cưng chỉ mang
            tính tham khảo, không thay thế chẩn đoán hoặc phác đồ điều trị của bác sĩ thú y.
          </p>
        </div>
      </footer>
    </div>
  );
}
