'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';

export function LayoutPlayground() {
  const [error, setError] = useState(false);
  return (
    <section id="public-layout" className="shell-card" aria-labelledby="layout-title">
      <h2 id="layout-title">Public layout · Header, Menu và Footer</h2>
      <p>
        <Link href="/preview/error">Xem lỗi render và recovery mẫu</Link>
      </p>
      <p>
        <Link href="/preview/admin">Xem Admin layout · capability và menu mẫu</Link>
      </p>
      <p>
        <Link href="/preview/auth">Xem Auth layout · sáu ngữ cảnh form mẫu</Link>
      </p>
      <p>
        <Link href="/preview/account">Xem Account layout · hồ sơ và hành động nhanh mẫu</Link>
      </p>
      <p>
        Thử Menu dưới 1024px, tìm “boss” hoặc từ không có kết quả; đăng nhập/đăng xuất mẫu và tên thành viên dài. Các
        trang chưa triển khai không xuất hiện trong menu.
      </p>
      <Button variant="secondary" onClick={() => setError(true)}>
        Mô phỏng lỗi nội dung layout
      </Button>
      {error && (
        <Alert
          variant="error"
          title="Không tải được nội dung mẫu"
          message="Bố cục và điều hướng vẫn dùng được. Đây là lỗi giả lập, không gọi máy chủ."
          retryLabel="Thử lại nội dung layout"
          onRetry={() => setError(false)}
        />
      )}
      <div className="table-scroll" role="region" aria-label="Bảng lịch chăm sóc mẫu có thể cuộn ngang" tabIndex={0}>
        <table className="layout-table">
          <caption>Bảng minh họa vùng cuộn riêng của public layout</caption>
          <thead>
            <tr>
              {['Thú cưng', 'Công việc chăm sóc', 'Thời gian dự kiến', 'Người phụ trách', 'Ghi chú'].map((title) => (
                <th scope="col" key={title}>
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Milo (mẫu)</th>
              <td>Kiểm tra lịch chăm sóc định kỳ</td>
              <td>Ngày mai, 09:00</td>
              <td>Nguyễn Hoàng Minh Anh (mẫu)</td>
              <td>Đây là dữ liệu giả, không có nhắc lịch thật.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
