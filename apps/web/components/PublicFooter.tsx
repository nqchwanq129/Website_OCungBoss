import Link from 'next/link';

export function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="shell-container">
        <div className="public-footer-grid">
          <section aria-labelledby="footer-about">
            <h2 id="footer-about">Ở Cùng Boss</h2>
            <p>Hiểu boss hơn mỗi ngày. Kiến thức và công cụ chăm sóc chó mèo dành cho người Việt.</p>
            <Link href="/">Trang chủ</Link>
          </section>
          <section aria-labelledby="footer-social">
            <h2 id="footer-social">Kết nối cộng đồng</h2>
            <p>Kênh mẫu · chưa có địa chỉ chính thức</p>
            <ul>
              {['Facebook', 'Instagram', 'YouTube'].map((label) => (
                <li key={label}>{label} (mẫu)</li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="footer-policy">
            <h2 id="footer-policy">Chính sách &amp; Hỗ trợ</h2>
            <p>Các trang sau chưa được mở:</p>
            <ul>
              {[
                'Về Ở Cùng Boss',
                'Liên hệ hợp tác',
                'Điều khoản sử dụng',
                'Chính sách bảo mật',
                'Quy chuẩn nội dung thú y',
              ].map((label) => (
                <li key={label}>{label} (mẫu)</li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="footer-content">
            <h2 id="footer-content">Chuyên mục &amp; Công cụ chăm sóc</h2>
            <p>Các mục sau chưa được mở:</p>
            <ul>
              {[
                'Cẩm nang dinh dưỡng',
                'Bệnh thường gặp',
                'Hành vi & Huấn luyện',
                'Thư viện giống',
                'Tính khẩu phần dinh dưỡng',
                'Lịch tiêm nhắc lại',
              ].map((label) => (
                <li key={label}>{label} (mẫu)</li>
              ))}
            </ul>
          </section>
        </div>
        <p className="footer-disclaimer">
          Thông tin chăm sóc thú cưng chỉ mang tính tham khảo, không thay thế chẩn đoán hoặc phác đồ điều trị của bác sĩ
          thú y.
        </p>
        <p>© 2026 Ở Cùng Boss · Giao diện dùng dữ liệu mẫu</p>
      </div>
    </footer>
  );
}
