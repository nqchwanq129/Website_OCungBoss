import { Fragment } from 'react';
import Link from 'next/link';
import { getPageHref, type PaginationState } from '../lib/pagination';

export type PaginationProps = {
  state: Pick<PaginationState, 'page' | 'pageCount'>;
  query: string;
  anchorId?: string;
  label?: string;
};

export function Pagination({ state: { page, pageCount }, query, anchorId, label = 'Phân trang' }: PaginationProps) {
  if (pageCount === 0) return null;
  const pages = [...new Set([1, page - 1, page, page + 1, pageCount])]
    .filter((value) => value >= 1 && value <= pageCount)
    .sort((a, b) => a - b);

  return (
    <nav className="pagination" aria-label={label}>
      <ul className="pagination-items">
        <li>
          {page > 1 ? (
            <Link href={getPageHref(query, page - 1, anchorId)} rel="prev" aria-label="Trang trước">
              Trước
            </Link>
          ) : (
            <span aria-disabled="true">Trước</span>
          )}
        </li>
        {pages.map((number, index) => (
          <Fragment key={number}>
            {index > 0 && number - pages[index - 1] > 1 && <li aria-hidden="true">…</li>}
            <li>
              {number === page ? (
                <span aria-current="page" aria-label={`Trang ${number}, trang hiện tại`}>
                  {number}
                </span>
              ) : (
                <Link href={getPageHref(query, number, anchorId)} aria-label={`Trang ${number}`}>
                  {number}
                </Link>
              )}
            </li>
          </Fragment>
        ))}
        <li>
          {page < pageCount ? (
            <Link href={getPageHref(query, page + 1, anchorId)} rel="next" aria-label="Trang sau">
              Sau
            </Link>
          ) : (
            <span aria-disabled="true">Sau</span>
          )}
        </li>
      </ul>
    </nav>
  );
}
