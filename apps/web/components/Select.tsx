import type { ComponentPropsWithRef } from 'react';
import { FieldFrame } from './Field';

export type SelectProps = ComponentPropsWithRef<'select'> & {
  id: string;
  label: string;
  error?: string;
  placeholder?: string;
};

export function Select({ id, label, error, placeholder, children, ...props }: SelectProps) {
  return (
    <FieldFrame {...props} id={id} label={label} error={error}>
      {(attributes) => (
        <select {...props} {...attributes}>
          {placeholder !== undefined && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>
      )}
    </FieldFrame>
  );
}
