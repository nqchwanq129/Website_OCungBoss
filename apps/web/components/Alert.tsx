import { useId } from 'react';
import { Button } from './Button';

export type AlertVariant = 'error' | 'success' | 'info';

export type AlertProps = {
  variant: AlertVariant;
  title: string;
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
};

const VARIANT_LABELS: Record<AlertVariant, string> = {
  error: 'Lỗi',
  success: 'Thành công',
  info: 'Thông tin',
};

export function Alert({ variant, title, message, retryLabel, onRetry }: AlertProps) {
  const id = useId();

  return (
    <section className={`status-alert status-alert-${variant}`} aria-labelledby={`alert-${id}-title`}>
      <div className="status-alert-copy" role={variant === 'error' ? 'alert' : 'status'} aria-atomic="true">
        <p className="status-alert-kind">{VARIANT_LABELS[variant]}</p>
        <h3 id={`alert-${id}-title`}>{title}</h3>
        <p>{message}</p>
      </div>
      {onRetry && retryLabel && (
        <Button variant="secondary" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </section>
  );
}
