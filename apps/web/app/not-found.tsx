import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="shell-container hero-panel">
      <h1>Không tìm thấy trang</h1>
      <p>Đường dẫn này chưa có nội dung.</p>
      <Link href="/">Về trang chủ</Link>
    </section>
  );
}
