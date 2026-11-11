'use client';

import Image from 'next/image';
import { useState } from 'react';

type CardImageProps = { imageSrc: string; imageAlt: string } | { imageSrc?: undefined; imageAlt?: never };

export type ContentCardProps = CardImageProps & {
  title: string;
  href: string;
  category: string;
  summary: string;
  dateLabel: string;
  readingMinutes: number;
  saved: boolean;
  onToggleSave: () => void;
};

export function ContentCard({
  title,
  href,
  category,
  summary,
  dateLabel,
  readingMinutes,
  saved,
  onToggleSave,
  imageSrc,
  imageAlt,
}: ContentCardProps) {
  return (
    <article className="content-card">
      <a className="content-card-link" href={href}>
        {imageSrc ? <CardImage key={imageSrc} src={imageSrc} alt={imageAlt} /> : <CardImage />}
        <div className="content-card-copy">
          <p className="content-card-category">{category}</p>
          <h3>{title}</h3>
          <p className="content-card-summary">{summary}</p>
          <p className="content-card-meta">
            <time>{dateLabel}</time>
            <span aria-hidden="true">·</span>
            <span>{readingMinutes} phút đọc</span>
          </p>
        </div>
      </a>
      <button
        className="content-card-save"
        type="button"
        aria-label={`${saved ? 'Bỏ lưu' : 'Lưu'} bài viết: ${title}`}
        aria-pressed={saved}
        onClick={onToggleSave}
      >
        <span aria-hidden="true">{saved ? '♥' : '♡'}</span>
        {saved ? 'Đã lưu' : 'Lưu bài viết'}
      </button>
    </article>
  );
}

function CardImage({ src, alt }: { src?: string; alt?: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="content-card-media">
      {src && !failed ? (
        <Image
          src={src}
          alt={alt ?? ''}
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
          unoptimized={src.endsWith('.svg')}
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="content-card-image-fallback"
          role="img"
          aria-label={src ? `Không tải được ảnh: ${alt}` : 'Bài viết chưa có ảnh minh họa'}
        >
          <svg aria-hidden="true" viewBox="0 0 48 48">
            <path d="M12 20c-4 0-6 4-6 8s3 8 7 8c3 0 4-3 7-3h8c3 0 4 3 7 3 4 0 7-4 7-8s-2-8-6-8c-3 0-5 2-8 2h-8c-3 0-5-2-8-2Zm2-7a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm9-5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm12 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-6-5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
          </svg>
          <span>{src ? 'Ảnh tạm thời không khả dụng' : 'Bài viết chưa có ảnh'}</span>
        </div>
      )}
    </div>
  );
}
