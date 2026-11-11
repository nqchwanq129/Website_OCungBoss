'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '../../components/Button';
import { ConfirmDialog } from '../../components/ConfirmDialog';

const NOTE = 'Ghi chú chăm sóc Bơ — lịch ăn uống, vận động và những điều cần trao đổi trong lần khám tiếp theo';

export function ConfirmDialogPlayground() {
  const [open, setOpen] = useState(false);
  const [exists, setExists] = useState(true);
  const [simulateError, setSimulateError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  async function deleteNote() {
    setAttempts((count) => count + 1);
    await new Promise<void>((resolve) => {
      timerRef.current = window.setTimeout(resolve, 1200);
    });
    if (simulateError && attempts === 0) throw new Error('SIMULATED_FAILURE');
    setExists(false);
  }

  return (
    <section id="confirm-dialog" className="shell-card" aria-labelledby="confirm-dialog-title">
      <h2 id="confirm-dialog-title">ConfirmDialog · xác nhận trước khi xóa</h2>
      <p>Thử Hủy, Esc hoặc xác nhận xóa ghi chú giả. Thay đổi chỉ tồn tại trong phiên preview này.</p>
      {exists && <p className="confirm-note">{NOTE}</p>}
      <label className="confirm-error-option">
        <input type="checkbox" checked={simulateError} onChange={(event) => setSimulateError(event.target.checked)} />
        Mô phỏng lỗi lần thử đầu
      </label>
      <div className="action-button-bar">
        <Button
          id="confirm-trigger"
          variant="secondary"
          onClick={() => {
            if (exists) {
              setAttempts(0);
              setOpen(true);
            } else setExists(true);
          }}
        >
          {exists ? 'Xóa ghi chú mẫu' : 'Khôi phục ghi chú mẫu'}
        </Button>
      </div>
      <p role="status">{exists ? 'Ghi chú mẫu vẫn được giữ.' : 'Đã xóa ghi chú mẫu.'}</p>
      <p>Lần thử mô phỏng: {attempts}</p>
      {open && (
        <ConfirmDialog
          title="Xóa ghi chú này?"
          description={`Bạn sắp xóa “${NOTE}”. Thao tác này không thể hoàn tác trong hộp thoại. Đây là dữ liệu giả; bạn có thể khôi phục từ preview.`}
          confirmLabel="Xác nhận xóa"
          onConfirm={deleteNote}
          onClose={() => setOpen(false)}
          errorMessage="Lỗi mô phỏng: chưa xóa được ghi chú. Nội dung vẫn được giữ nguyên."
        />
      )}
    </section>
  );
}
