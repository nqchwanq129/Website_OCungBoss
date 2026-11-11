import type { ComponentPropsWithRef } from 'react';

export type ButtonProps = ComponentPropsWithRef<'button'> & {
  variant?: 'primary' | 'secondary';
  pending?: boolean;
};

export function Button({
  variant = 'primary',
  pending = false,
  disabled,
  type = 'button',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={`btn-${variant} ${className}`.trim()}
      disabled={pending || disabled}
      aria-busy={pending || props['aria-busy']}
    >
      {pending ? 'Đang xử lý…' : children}
    </button>
  );
}
