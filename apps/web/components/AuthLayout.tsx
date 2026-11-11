import { useId, type ReactNode } from 'react';
import { Breadcrumb } from './Breadcrumb';

export function AuthLayout({ title, children }: { title: string; children: ReactNode }) {
  const id = useId();

  return (
    <div className="shell-container auth-shell">
      <Breadcrumb ancestors={[{ label: 'Trang chủ', href: '/' }]} currentLabel={title} />
      <div className="auth-grid">
        <section className="auth-form-panel" aria-labelledby={`${id}-title`}>
          <h1 id={`${id}-title`}>{title}</h1>
          {children}
        </section>
        <aside className="auth-intro" aria-labelledby={`${id}-intro`}>
          <p className="eyebrow">Đồng hành cùng boss</p>
          <h2 id={`${id}-intro`}>Một tài khoản, cả hành trình chăm boss</h2>
          <p className="intro">
            Chăm chút mỗi ngày, từ hồ sơ từng bé đến nhật ký sức khỏe, khẩu phần ăn và lịch chăm sóc.
          </p>
          <ul>
            <li>
              <h3>Hồ sơ riêng cho từng bé</h3>
              <p>Hiểu thói quen, cân nặng và những lưu ý riêng của người bạn bốn chân.</p>
            </li>
            <li>
              <h3>Nhật ký &amp; theo dõi sức khỏe</h3>
              <p>Nhìn lại hành trình ăn uống, vận động và chăm sóc mỗi ngày.</p>
            </li>
            <li>
              <h3>Lịch chăm sóc</h3>
              <p>Sắp xếp các việc cần làm để dành nhiều thời gian bên boss hơn.</p>
            </li>
            <li>
              <h3>Kiến thức cho người chăm boss</h3>
              <p>Thông tin tham khảo không thay thế tư vấn hoặc điều trị của bác sĩ thú y.</p>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
