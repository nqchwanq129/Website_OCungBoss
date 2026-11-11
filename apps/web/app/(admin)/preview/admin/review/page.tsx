import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Preview kiểm duyệt | OCungBoss', robots: { index: false, follow: false } };
export default function ReviewPreviewPage() {
  return (
    <>
      <h1>Kiểm duyệt nội dung (mẫu)</h1>
      <p>Đích minh họa cần content.review; không tải hàng chờ hoặc thực hiện kiểm duyệt thật.</p>
    </>
  );
}
