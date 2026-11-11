import type { ReactNode } from 'react';
import { PublicLayout } from '../../components/PublicLayout';
export default function HomeLayout({ children }: { children: ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>;
}
