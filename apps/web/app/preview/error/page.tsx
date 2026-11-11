import type { Metadata } from 'next';
import { RenderFailurePlayground } from './RenderFailurePlayground';

export const metadata: Metadata = {
  title: 'Preview lỗi render | OCungBoss',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

export default async function ErrorPreviewPage({ searchParams }: { searchParams: Promise<{ fail?: string }> }) {
  if ((await searchParams).fail === '1') throw new Error('SIMULATED_RENDER_FAILURE');
  return <RenderFailurePlayground />;
}
