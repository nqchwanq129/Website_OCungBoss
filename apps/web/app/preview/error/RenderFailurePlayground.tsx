'use client';

import { useRouter } from 'next/navigation';
import { Button } from '../../../components/Button';

export function RenderFailurePlayground() {
  const router = useRouter();
  return (
    <section className="shell-container hero-panel">
      <h1>Thử lỗi render mẫu</h1>
      <p>
        Nút dưới gây lỗi render server bằng dữ liệu giả. Khi URL còn ?fail=1, retry vẫn lỗi; bỏ query lỗi rồi thử lại để
        khôi phục mẫu.
      </p>
      <p>Kiểm thông báo người dùng bằng bản production local. Chế độ dev có thể hiện màn debug riêng của Next.js.</p>
      <Button onClick={() => router.push('/preview/error?fail=1')}>Gây lỗi render mẫu</Button>
    </section>
  );
}
