import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <section className="hero" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="eyebrow">Chăm sóc chó mèo dễ dàng hơn</p>
          <h1 id="home-title">Cùng bạn chăm boss bằng kiến thức đáng tin cậy</h1>
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
      </section>
    </>
  );
}
