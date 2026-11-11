import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <header className="site-header">
        <a className="brand" href="#main-content" aria-label="OCungBoss — về nội dung chính">
          OCungBoss
        </a>
        <div className="header-right">
          <span className="tagline">Hiểu boss hơn mỗi ngày</span>
          <Link href="/preview" className="nav-pill">
            Preview Fixtures (/preview)
          </Link>
        </div>
      </header>

      <main id="main-content" className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Chăm sóc chó mèo dễ dàng hơn</p>
          <h1>Cùng bạn chăm boss bằng kiến thức đáng tin cậy</h1>
          <p className="intro">
            OCungBoss đang xây dựng một không gian tiếng Việt để bạn tra cứu kiến thức và quản lý hành trình chăm sóc
            thú cưng.
          </p>
          <p className="status" role="status">
            Khung website và bộ dữ liệu ảo frontend đã sẵn sàng. Bạn có thể mở{' '}
            <Link href="/preview">trang Preview Fixtures (/preview)</Link> để thử các vai trò, trạng thái và kịch bản
            tương tác.
          </p>
        </div>

        <aside className="welcome-card" aria-labelledby="welcome-title">
          <span className="paw" aria-hidden="true">
            🐾
          </span>
          <h2 id="welcome-title">Chào mừng bạn đến với OCungBoss</h2>
          <p>Nền tảng dành cho những người luôn muốn điều tốt nhất cho người bạn bốn chân.</p>
        </aside>
      </main>

      <footer>© 2026 OCungBoss</footer>
    </>
  );
}
