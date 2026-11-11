export type PaginationState = {
  page: number;
  pageCount: number;
  start: number;
  end: number;
  corrected: boolean;
};

export function getPagination(totalItems: number, pageInput: string | null, pageSize = 12): PaginationState {
  if (!Number.isSafeInteger(totalItems) || totalItems < 0 || !Number.isSafeInteger(pageSize) || pageSize < 1) {
    throw new Error('Pagination requires a non-negative integer total and a positive integer page size');
  }
  const requested = pageInput === null ? 1 : Number(pageInput);
  const valid = pageInput === null || (/^[1-9]\d*$/.test(pageInput) && Number.isSafeInteger(requested));
  const pageCount = Math.ceil(totalItems / pageSize);
  const page = Math.min(valid ? requested : 1, Math.max(1, pageCount));
  const start = (page - 1) * pageSize;
  return {
    page,
    pageCount,
    start,
    end: Math.min(start + pageSize, totalItems),
    corrected: pageInput !== null && (!valid || page !== requested),
  };
}

export function getPageHref(query: string, page: number, anchorId?: string): string {
  if (!Number.isSafeInteger(page) || page < 1) throw new Error('Page links require a positive integer page');
  const params = new URLSearchParams(query);
  params.set('trang', String(page));
  return `?${params.toString()}${anchorId ? `#${encodeURIComponent(anchorId)}` : ''}`;
}
