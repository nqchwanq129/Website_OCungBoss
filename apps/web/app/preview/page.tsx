import type { Metadata } from 'next';
import Link from 'next/link';
import { FixturePlayground } from './FixturePlayground';

export const metadata: Metadata = {
  title: 'Preview dữ liệu ảo & kịch bản tương tác | OCungBoss',
  description:
    'Trang kiểm thử cục bộ (/preview) cho bộ dữ liệu ảo, vai trò người dùng, trạng thái đọc/ghi và 74 mã ca P01–Q01 của OCungBoss.',
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

          <FixturePlayground />
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
