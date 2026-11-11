import type { ReactNode } from 'react';
import { Breadcrumb } from './Breadcrumb';

export function AccountLayout({
  title,
  petSelector,
  profile,
  quickActions,
  children,
}: {
  title: string;
  petSelector: ReactNode;
  profile: ReactNode;
  quickActions: ReactNode;
  children: ReactNode;
}) {
  const hasProfile = Boolean(profile || quickActions);

  return (
    <div className="shell-container account-layout">
      <Breadcrumb ancestors={[{ label: 'Trang chủ', href: '/' }]} currentLabel={title} />
      <h1>{title}</h1>
      <p className="intro">Thông tin nền tảng cho hành trình chăm sóc từng bé — hồ sơ, nhật ký và lịch chăm sóc.</p>
      <div className="account-pet-selector">{petSelector}</div>
      <div className={`account-grid${hasProfile ? '' : ' account-grid-full'}`}>
        {hasProfile && (
          <div className="account-profile-column">
            {profile}
            {quickActions && (
              <nav className="shell-card account-quick-actions" aria-label="Hành động nhanh">
                {quickActions}
              </nav>
            )}
          </div>
        )}
        <div className="account-content">{children}</div>
      </div>
    </div>
  );
}
