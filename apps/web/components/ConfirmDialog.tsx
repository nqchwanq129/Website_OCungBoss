'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Alert } from './Alert';
import { Button } from './Button';

export type ConfirmDialogProps = {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  errorMessage?: string;
};

export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  onConfirm,
  onClose,
  errorMessage = 'Chưa hoàn tất thao tác. Bạn có thể thử lại hoặc hủy để quay về.',
}: ConfirmDialogProps) {
  const id = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmingRef = useRef(false);
  const mountedRef = useRef(false);
  const [state, setState] = useState<'idle' | 'pending' | 'error'>('idle');
  const pending = state === 'pending';

  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger = document.activeElement;
    mountedRef.current = true;
    dialog?.showModal();
    cancelRef.current?.focus();
    return () => {
      mountedRef.current = false;
      dialog?.close();
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus();
    };
  }, []);

  function cancel() {
    if (!confirmingRef.current) onClose();
  }

  async function confirm() {
    if (confirmingRef.current) return;
    confirmingRef.current = true;
    setState('pending');
    try {
      await onConfirm();
      if (mountedRef.current) onClose();
    } catch {
      if (mountedRef.current) {
        setState('error');
        cancelRef.current?.focus();
      }
    } finally {
      confirmingRef.current = false;
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="confirm-dialog"
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
      onCancel={(event) => {
        event.preventDefault();
        cancel();
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (document.activeElement === (event.shiftKey ? first : last)) {
          event.preventDefault();
          (event.shiftKey ? last : first)?.focus();
        }
      }}
    >
      <p className="eyebrow">Xác nhận thao tác</p>
      <h2 id={`${id}-title`}>{title}</h2>
      <p id={`${id}-description`}>{description}</p>
      {state === 'error' && <Alert variant="error" title="Chưa hoàn tất" message={errorMessage} />}
      <p role="status" aria-atomic="true">
        {pending ? 'Đang xử lý, vui lòng chờ kết quả.' : ''}
      </p>
      <div className="action-button-bar">
        <Button ref={cancelRef} variant="secondary" aria-disabled={pending} onClick={cancel}>
          Hủy
        </Button>
        <Button className="btn-danger" pending={pending} onClick={confirm}>
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}
