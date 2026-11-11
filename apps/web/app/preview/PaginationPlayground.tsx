'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { Field } from '../../components/Field';
import { Pagination } from '../../components/Pagination';
import { Select } from '../../components/Select';
import { FRONTEND_CASE_FIXTURES, type FrontendCaseArea } from '../../lib/fixtures';
import { getPageHref, getPagination } from '../../lib/pagination';

const AREA_OPTIONS: readonly { value: 'all' | FrontendCaseArea; label: string }[] = [
  { value: 'all', label: 'Tất cả nhóm' },
  { value: 'public-content-search', label: 'Nội dung và tìm kiếm' },
  { value: 'auth-account-personal', label: 'Tài khoản và thú cưng' },
  { value: 'tools-journal-schedule-notifications', label: 'Công cụ, nhật ký và lịch' },
  { value: 'community-places-ai', label: 'Cộng đồng, địa điểm và AI' },
  { value: 'admin-data-seo-qa', label: 'Quản trị và kiểm tra' },
];
const FILTER_KEYS = ['q', 'loai', 'sapXep', 'trang'];

export function PaginationPlayground() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const rawQuery = params.get('q') ?? '';
  const q = Array.from(rawQuery.trim()).slice(0, 200).join('');
  const rawArea = params.get('loai');
  const area = AREA_OPTIONS.find((option) => option.value === rawArea)?.value ?? 'all';
  const rawSort = params.get('sapXep');
  const sort = rawSort === 'ma-giam' ? 'ma-giam' : 'ma-tang';
  const filtered = FRONTEND_CASE_FIXTURES.filter(
    (item) =>
      (area === 'all' || item.area === area) &&
      `${item.code} ${item.inputSummary}`.toLocaleLowerCase('vi').includes(q.toLocaleLowerCase('vi')),
  ).sort((a, b) => a.code.localeCompare(b.code) * (sort === 'ma-giam' ? -1 : 1));
  const paging = getPagination(filtered.length, params.get('trang'));
  const corrected =
    paging.corrected ||
    q !== rawQuery ||
    (rawArea !== null && area !== rawArea) ||
    (rawSort !== null && sort !== rawSort) ||
    FILTER_KEYS.some((key) => params.getAll(key).length > 1);
  if (q) params.set('q', q);
  else params.delete('q');
  params.set('loai', area);
  params.set('sapXep', sort);
  const extraParams = new URLSearchParams(Array.from(params).filter(([name]) => !FILTER_KEYS.includes(name)));

  return (
    <section id="pagination" className="shell-card" aria-labelledby="pagination-title">
      <h2 id="pagination-title">Pagination · bộ lọc đi cùng từng trang</h2>
      <p>
        Danh sách ca mô phỏng có sẵn, 12 mục mỗi trang. Bộ lọc và trang được lưu trong địa chỉ để mở lại hoặc chia sẻ.
      </p>
      <form
        key={searchParams.toString()}
        action="/preview#pagination"
        method="get"
        className="pagination-filters"
        onSubmit={(event) => {
          event.preventDefault();
          const next = new URLSearchParams();
          for (const [name, value] of new FormData(event.currentTarget)) {
            if (typeof value === 'string') next.append(name, value);
          }
          router.push(getPageHref(next.toString(), 1, 'pagination'));
        }}
      >
        {Array.from(extraParams).map(([name, value], index) => (
          <input key={`${name}-${index}`} type="hidden" name={name} value={value} />
        ))}
        <input type="hidden" name="trang" value="1" />
        <Field id="pagination-search" name="q" label="Tìm ca mẫu" type="search" defaultValue={q} maxLength={200} />
        <Select id="pagination-area" name="loai" label="Nhóm luồng mẫu" defaultValue={area}>
          {AREA_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Select id="pagination-sort" name="sapXep" label="Sắp xếp ca mẫu" defaultValue={sort}>
          <option value="ma-tang">Mã ca tăng dần</option>
          <option value="ma-giam">Mã ca giảm dần</option>
        </Select>
        <Button type="submit">Áp dụng bộ lọc</Button>
      </form>
      {corrected && (
        <>
          <Alert
            variant="info"
            title="Đã điều chỉnh lựa chọn không hợp lệ"
            message={`Đang dùng bộ lọc hợp lệ và trang ${paging.page}.`}
          />
          <Link href={getPageHref(params.toString(), paging.page, 'pagination')}>Dùng địa chỉ hợp lệ</Link>
        </>
      )}
      <p role="status" className="pagination-summary">
        {filtered.length > 0
          ? `${filtered.length} kết quả · Trang ${paging.page}/${paging.pageCount} · Hiển thị ${paging.start + 1}–${paging.end}.`
          : 'Không có kết quả phù hợp.'}
      </p>
      {filtered.length > 0 ? (
        <ul className="pagination-results" aria-label="Danh sách ca mẫu">
          {filtered.slice(paging.start, paging.end).map((item) => (
            <li key={item.code}>
              <span className="pagination-code">{item.code}</span>
              <p>{item.inputSummary}</p>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          kind="no-results"
          title="Không tìm thấy ca mẫu"
          message="Thử từ khóa khác hoặc bỏ điều kiện tìm kiếm."
          action={{
            label: 'Xóa bộ lọc mẫu',
            onClick: () => router.push(getPageHref(extraParams.toString(), 1, 'pagination')),
          }}
        />
      )}
      <Pagination state={paging} query={params.toString()} anchorId="pagination" label="Phân trang ca mẫu" />
    </section>
  );
}
