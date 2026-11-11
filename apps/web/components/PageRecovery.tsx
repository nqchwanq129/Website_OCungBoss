'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { Alert } from './Alert';

type RecoveryProps = { kind: 'not-found' } | { kind: 'error'; retry: () => void };

export function PageRecovery(props: RecoveryProps) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, [props.kind]);
  return (
    <section className="shell-container hero-panel recovery-panel" aria-labelledby="recovery-title">
      <h1 id="recovery-title" ref={heading} tabIndex={-1}>
        {props.kind === 'not-found' ? 'Không tìm thấy trang' : 'Không thể hiển thị trang'}
      </h1>
      {props.kind === 'not-found' ? (
        <p>Đường dẫn này chưa có nội dung hoặc không còn khả dụng.</p>
      ) : (
        <Alert
          variant="error"
          title="Có lỗi khi hiển thị nội dung"
          message="Bạn có thể thử lại hoặc quay về trang chủ. Nếu lỗi vẫn còn, trang sẽ tiếp tục hiển thị thông báo này."
          retryLabel="Thử lại trang"
          onRetry={props.retry}
        />
      )}
      <p>
        <Link href="/">Về trang chủ</Link>
      </p>
    </section>
  );
}
