'use client';

import { useState } from 'react';
import { ContentCard } from '../../components/ContentCard';
import { FIXTURE_ARTICLES } from '../../lib/fixtures';

const article = FIXTURE_ARTICLES.PUB;

export function CardPlayground() {
  const [saved, setSaved] = useState(false);

  return (
    <section id="cards" className="shell-card card-preview" aria-labelledby="cards-title">
      <h2 id="cards-title">Card nội dung</h2>
      <p>Ảnh minh họa tự tạo và trạng thái lưu chỉ chạy trong preview; không lưu hoặc gửi dữ liệu.</p>
      <div className="content-card-grid">
        <ContentCard
          title={article.title}
          href="/preview#fixtures"
          category="Chăm sóc cơ bản · Chó con"
          summary={article.summary}
          dateLabel="8 tháng 11, 2026"
          readingMinutes={article.readingMinutes}
          imageSrc="/fixtures/card-puppy.svg"
          imageAlt="Minh họa chú chó con nâu trên nền màu ấm"
          saved={saved}
          onToggleSave={() => setSaved(!saved)}
        />
        <ContentCard
          title="Tiêu đề mẫu dài để kiểm tra cách xuống dòng và giữ lưới gọn trên màn hình điện thoại hẹp"
          href="/preview#fixtures"
          category="Gợi ý chăm sóc"
          summary="Bài mẫu chưa có ảnh; phần giữ chỗ vẫn giữ đúng tỷ lệ để bố cục không nhảy."
          dateLabel="8 tháng 11, 2026"
          readingMinutes={4}
          saved={false}
          onToggleSave={() => {}}
        />
      </div>
    </section>
  );
}
