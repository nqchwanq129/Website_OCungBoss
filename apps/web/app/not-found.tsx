import { PageRecovery } from '../components/PageRecovery';
import { PublicLayout } from '../components/PublicLayout';

export default function NotFound() {
  return (
    <PublicLayout>
      <PageRecovery kind="not-found" />
    </PublicLayout>
  );
}
