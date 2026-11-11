import type { Metadata } from 'next';
import { AccountLayoutPlayground } from './AccountLayoutPlayground';

export const metadata: Metadata = {
  title: 'Preview account layout | OCungBoss',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

export default function AccountLayoutPreviewPage() {
  return <AccountLayoutPlayground />;
}
