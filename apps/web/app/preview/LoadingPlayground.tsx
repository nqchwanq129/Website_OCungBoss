'use client';

import { useEffect, useState } from 'react';
import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { LoadingState } from '../../components/LoadingState';
import { Select } from '../../components/Select';

type Outcome = 'success' | 'empty' | 'error';
type ViewState = 'idle' | 'loading' | Outcome;

export function LoadingPlayground() {
  const [outcome, setOutcome] = useState<Outcome>('success');
  const [view, setView] = useState<ViewState>('idle');

  useEffect(() => {
    if (view !== 'loading') return;
    const timeout = window.setTimeout(() => setView(outcome), 1500);
    return () => window.clearTimeout(timeout);
  }, [outcome, view]);

  return (
    <section id="loading" className="shell-card loading-preview" aria-labelledby="loading-title">
      <h2 id="loading-title">Skeleton và trạng thái tải</h2>
      <p>Chọn kết quả giả rồi bắt đầu; skeleton tự kết thúc và không gọi API.</p>
      <Select
        id="loading-outcome"
        name="loadingOutcome"
        label="Kết quả tải mẫu"
        value={outcome}
        disabled={view === 'loading'}
        onChange={(event) => setOutcome(event.target.value as Outcome)}
      >
        <option value="success">Tải thành công</option>
        <option value="empty">Không có dữ liệu</option>
        <option value="error">Lỗi tải</option>
      </Select>
      <div className="action-button-bar">
        <Button pending={view === 'loading'} onClick={() => setView('loading')}>
          Tải dữ liệu giả
        </Button>
      </div>
      <div className="loading-result">
        {view === 'loading' ? (
          <LoadingState regionLabel="Nội dung mẫu đang tải" statusLabel="Đang tải bài viết mẫu." />
        ) : view === 'success' ? (
          <Alert variant="success" title="Bài viết đã sẵn sàng" message="Nội dung mẫu đã được hiển thị." />
        ) : view === 'empty' ? (
          <EmptyState
            kind="empty"
            title="Chưa có gợi ý phù hợp"
            message="Kết quả tải thành công nhưng danh sách mẫu hiện không có mục nào."
            action={{ label: 'Xem nội dung mẫu', href: '/preview#cards' }}
          />
        ) : view === 'error' ? (
          <Alert
            variant="error"
            title="Không tải được bài viết mẫu"
            message="Lỗi mô phỏng; dữ liệu chưa được tải."
            retryLabel="Thử tải lại"
            onRetry={() => setView('loading')}
          />
        ) : (
          <p>Chưa bắt đầu tải dữ liệu mẫu.</p>
        )}
      </div>
    </section>
  );
}
