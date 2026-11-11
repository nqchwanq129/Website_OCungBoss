import { Breadcrumb } from '../../components/Breadcrumb';
import { FIXTURE_ARTICLES } from '../../lib/fixtures';

export function BreadcrumbPlayground() {
  return (
    <section id="breadcrumbs" className="shell-card" aria-labelledby="breadcrumbs-title">
      <h2 id="breadcrumbs-title">Breadcrumb · biết mình đang ở đâu</h2>
      <p>
        Ba ví dụ phân cấp công khai, tài khoản và quản trị. Các mục cha mở khu vực mẫu đang có; mục cuối là vị trí đang
        minh họa.
      </p>
      <div className="breadcrumb-examples">
        <section aria-labelledby="breadcrumb-public-title">
          <h3 id="breadcrumb-public-title">Công khai mẫu</h3>
          <Breadcrumb
            label="Đường dẫn công khai mẫu"
            ancestors={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Nội dung mẫu', href: '/preview#cards' },
            ]}
            currentLabel={FIXTURE_ARTICLES.PUB.title}
          />
        </section>
        <section aria-labelledby="breadcrumb-account-title">
          <h3 id="breadcrumb-account-title">Tài khoản mẫu</h3>
          <Breadcrumb
            label="Đường dẫn tài khoản mẫu"
            ancestors={[
              { label: 'Preview', href: '/preview' },
              { label: 'Dữ liệu tài khoản mẫu', href: '/preview#fixtures' },
            ]}
            currentLabel="Hồ sơ thú cưng mẫu — ghi chú chăm sóc và lịch sinh hoạt dành riêng cho boss có tên rất dài"
          />
        </section>
        <section aria-labelledby="breadcrumb-admin-title">
          <h3 id="breadcrumb-admin-title">Quản trị mẫu</h3>
          <Breadcrumb
            label="Đường dẫn quản trị mẫu"
            ancestors={[
              { label: 'Preview', href: '/preview' },
              { label: 'Dữ liệu quản trị mẫu', href: '/preview#fixtures' },
            ]}
            currentLabel="Kiểm duyệt nội dung mẫu có tiêu đề dài liên tục ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
          />
        </section>
      </div>
    </section>
  );
}
