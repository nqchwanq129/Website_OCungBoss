'use client';

import { PageRecovery } from '../components/PageRecovery';
import { PublicLayout } from '../components/PublicLayout';

export default function ErrorPage({ retry }: { error: unknown; retry: () => void }) {
  return (
    <PublicLayout>
      <PageRecovery kind="error" retry={retry} />
    </PublicLayout>
  );
}
