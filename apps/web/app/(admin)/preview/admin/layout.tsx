'use client';
import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { AdminLayout } from '../../../../components/AdminLayout';
import { Select } from '../../../../components/Select';
import { FIXTURE_ACTORS, type FixtureActor } from '../../../../lib/fixtures';
const PRESETS: readonly { id: string; label: string; actor: FixtureActor }[] = [
  { id: 'full', label: 'AM · Đủ capability mẫu', actor: FIXTURE_ACTORS.AM },
  {
    id: 'editor',
    label: 'AM · Chỉ biên tập nội dung và không có quyền kiểm duyệt',
    actor: { ...FIXTURE_ACTORS.AM, capabilities: ['content.edit'] },
  },
  { id: 'reviewer', label: 'AM · Chỉ kiểm duyệt', actor: { ...FIXTURE_ACTORS.AM, capabilities: ['content.review'] } },
  { id: 'pending', label: 'AP · Chưa qua MFA', actor: FIXTURE_ACTORS.AP },
  { id: 'user', label: 'UA · Thành viên thường', actor: FIXTURE_ACTORS.UA },
  { id: 'locked', label: 'ADMIN bị khóa (mẫu)', actor: { ...FIXTURE_ACTORS.AM, accountStatus: 'locked' } },
];
export default function AdminPreviewLayout({ children }: { children: ReactNode }) {
  const [preset, setPreset] = useState(PRESETS[0]);
  return (
    <AdminLayout
      actor={preset.actor}
      controls={
        <>
          <Select
            id="admin-preset"
            label="Vai trò / capability mẫu"
            value={preset.id}
            onChange={(event) => {
              const next = PRESETS.find((item) => item.id === event.target.value);
              if (next) setPreset(next);
            }}
          >
            {PRESETS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </Select>
          <Link href="/preview#public-layout">Về preview layout</Link>
        </>
      }
    >
      {children}
    </AdminLayout>
  );
}
