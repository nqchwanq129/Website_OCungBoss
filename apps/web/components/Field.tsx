import type { AriaAttributes, ComponentPropsWithRef, ReactNode } from 'react';

export type FieldProps = ComponentPropsWithRef<'input'> & {
  id: string;
  label: string;
  error?: string;
};

export function Field({ id, label, error, ...props }: FieldProps) {
  return (
    <FieldFrame {...props} id={id} label={label} error={error}>
      {(attributes) => <input {...props} {...attributes} />}
    </FieldFrame>
  );
}

type ControlAttributes = Pick<AriaAttributes, 'aria-invalid' | 'aria-describedby'> & { id: string };

export function FieldFrame({
  id,
  label,
  error,
  children,
  ...props
}: ControlAttributes & {
  label: string;
  error?: string;
  children: (attributes: ControlAttributes) => ReactNode;
}) {
  if (!id || /\s/.test(id) || !label.trim()) {
    throw new Error('Field requires an id without whitespace and a non-empty label');
  }
  const message = error?.trim();
  const errorId = `${id}-error`;
  const descriptions = new Set(props['aria-describedby']?.split(/\s+/).filter(Boolean));
  if (message) descriptions.add(errorId);
  else descriptions.delete(errorId);

  return (
    <div className="field-group">
      <label htmlFor={id}>{label}</label>
      {children({
        id,
        'aria-invalid': message ? true : props['aria-invalid'],
        'aria-describedby': [...descriptions].join(' ') || undefined,
      })}
      {message && (
        <p id={errorId} className="field-error" role="alert">
          {message}
        </p>
      )}
    </div>
  );
}
