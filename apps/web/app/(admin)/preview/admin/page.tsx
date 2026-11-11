import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Preview admin layout | OCungBoss',
  robots: { index: false, follow: false },
};
export default function AdminPreviewPage() {
  return (
    <>
      <h1>Bài viết &amp; nội dung (mẫu)</h1>
      <p>Khung admin theo Stitch, chỉ là bảng minh họa; không phải CMS đã triển khai.</p>
      <div className="table-scroll" role="region" aria-label="Bảng nội dung mẫu có thể cuộn ngang" tabIndex={0}>
        <table className="layout-table">
          <caption>Nội dung giả để kiểm khung quản trị</caption>
          <thead>
            <tr>
              {['Tiêu đề', 'Danh mục', 'Tác giả mẫu', 'Trạng thái', 'Ghi chú'].map((title) => (
                <th key={title} scope="col">
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Chăm sóc chó mèo mỗi ngày — tiêu đề dài để kiểm bố cục</th>
              <td>Kiến thức mẫu</td>
              <td>Ban biên tập mẫu</td>
              <td>Bản nháp mẫu</td>
              <td>Không có thao tác xuất bản hoặc dữ liệu người dùng.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
