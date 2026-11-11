'use client';

import { useState } from 'react';
import { Alert, type AlertVariant } from '../../components/Alert';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';

type EmptyMode = 'empty' | 'no-results' | 'content';

const ALERT_MESSAGES: Record<AlertVariant, { title: string; message: string }> = {
  error: {
    title: 'Chưa tải được nội dung mẫu',
    message: 'Lần thử tải dữ liệu giả bị lỗi. Có thể thử lại.',
  },
  success: {
    title: 'Đã cập nhật lựa chọn mẫu',
    message: 'Trạng thái giao diện đã thay đổi trong bộ nhớ preview.',
  },
  info: {
    title: 'Preview dùng dữ liệu giả',
    message: 'Các trạng thái dưới đây không gửi dữ liệu ra ngoài.',
  },
};

export function AlertPlayground() {
  const [variant, setVariant] = useState<AlertVariant>('info');
  const [retryCount, setRetryCount] = useState(0);
  const [emptyMode, setEmptyMode] = useState<EmptyMode>('empty');

  return (
    <section id="alerts" className="shell-card alert-preview" aria-labelledby="alerts-title">
      <h2 id="alerts-title">Alert và empty state</h2>
      <p>Đổi trạng thái để thử thông báo và hành động bằng bàn phím.</p>
      <div className="action-button-bar" role="group" aria-label="Chọn loại thông báo mẫu">
        {(['info', 'success', 'error'] as const).map((kind) => (
          <Button key={kind} variant={variant === kind ? 'primary' : 'secondary'} onClick={() => setVariant(kind)}>
            {kind === 'info' ? 'Thông tin' : kind === 'success' ? 'Thành công' : 'Lỗi'}
          </Button>
        ))}
      </div>
      <Alert
        variant={variant}
        title={ALERT_MESSAGES[variant].title}
        message={
          variant === 'error' && retryCount > 0
            ? `Thử lại lần ${retryCount} vẫn gặp lỗi.`
            : ALERT_MESSAGES[variant].message
        }
        retryLabel={variant === 'error' ? 'Thử lại dữ liệu mẫu' : undefined}
        onRetry={variant === 'error' ? () => setRetryCount((count) => count + 1) : undefined}
      />

      <div className="action-button-bar" role="group" aria-label="Chọn trạng thái dữ liệu mẫu">
        <Button variant={emptyMode === 'empty' ? 'primary' : 'secondary'} onClick={() => setEmptyMode('empty')}>
          Chưa có dữ liệu
        </Button>
        <Button
          variant={emptyMode === 'no-results' ? 'primary' : 'secondary'}
          onClick={() => setEmptyMode('no-results')}
        >
          Không có kết quả
        </Button>
      </div>
      {emptyMode === 'content' ? (
        <p className="empty-state-result">Danh sách gợi ý mẫu đang hiển thị.</p>
      ) : emptyMode === 'empty' ? (
        <EmptyState
          kind="empty"
          title="Chưa có bài viết đã lưu"
          message="Lưu một bài viết để nội dung xuất hiện trong danh sách này."
          action={{ label: 'Xem bài viết gợi ý', href: '/preview#cards' }}
        />
      ) : (
        <EmptyState
          kind="no-results"
          title="Không tìm thấy bài viết phù hợp"
          message="Không có kết quả cho bộ lọc mẫu hiện tại."
          action={{ label: 'Xóa bộ lọc', onClick: () => setEmptyMode('content') }}
        />
      )}
    </section>
  );
}
