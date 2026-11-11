import { useId } from 'react';
import { Button } from './Button';

type EmptyStateAction =
  { label: string; href: string; onClick?: never } | { label: string; onClick: () => void; href?: never };

export type EmptyStateProps = {
  kind: 'empty' | 'no-results';
  title: string;
  message: string;
  action: EmptyStateAction;
};

export function EmptyState({ kind, title, message, action }: EmptyStateProps) {
  const id = useId();

  return (
    <section className="empty-state" aria-labelledby={`empty-state-${id}-${kind}-title`}>
      <span className="empty-state-mark" aria-hidden="true">
        {kind === 'empty' ? '—' : '⌕'}
      </span>
      <h3 id={`empty-state-${id}-${kind}-title`}>{title}</h3>
      <p>{message}</p>
      {action.href ? (
        <a className="btn-primary empty-state-action" href={action.href}>
          {action.label}
        </a>
      ) : (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </section>
  );
}
