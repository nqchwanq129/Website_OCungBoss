import type { ReactNode } from 'react';
import { PublicLayout } from '../../components/PublicLayout';
export default function PreviewLayout({ children }: { children: ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>;
}
