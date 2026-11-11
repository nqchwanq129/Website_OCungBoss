import type { Metadata } from 'next';
import { AuthLayout } from '../../../components/AuthLayout';
import { AuthLayoutPlayground } from './AuthLayoutPlayground';

export const metadata: Metadata = {
  title: 'Preview auth layout | OCungBoss',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

export default function AuthLayoutPreviewPage() {
  return (
    <AuthLayout title="Không gian tài khoản">
      <AuthLayoutPlayground />
    </AuthLayout>
  );
}
