import test from 'node:test';
import assert from 'node:assert/strict';
import { getPageHref, getPagination } from './pagination.ts';

test('pagination clamps bounds and produces the correct slice for empty, single and multiple pages', () => {
  assert.deepEqual(getPagination(0, null), { page: 1, pageCount: 0, start: 0, end: 0, corrected: false });
  assert.equal(getPagination(0, '9').page, 1);
  assert.deepEqual(getPagination(13, '2'), { page: 2, pageCount: 2, start: 12, end: 13, corrected: false });
  assert.deepEqual(getPagination(13, '999'), { page: 2, pageCount: 2, start: 12, end: 13, corrected: true });
  assert.equal(getPagination(12, '2').page, 1);
  assert.equal(getPagination(74, '7').end, 74);
});

test('malformed, fractional and unsafe page inputs fall back to page one', () => {
  for (const input of ['', '0', '-1', '1.5', '1e2', ' 2 ', 'NaN', 'Infinity', '01', '9007199254740992']) {
    assert.equal(getPagination(74, input).page, 1, input);
    assert.equal(getPagination(74, input).corrected, true, input);
  }
  assert.equal(
    getPagination(Number.MAX_SAFE_INTEGER, String(Number.MAX_SAFE_INTEGER), 1).page,
    Number.MAX_SAFE_INTEGER,
  );
});

test('page links change only trang and preserve Unicode, special characters and repeated filters', () => {
  const query = new URLSearchParams([
    ['q', 'Bơ & Mây + #'],
    ['loai', 'cho'],
    ['sapXep', 'ma-giam'],
    ['tag', 'a'],
    ['tag', 'b'],
    ['trang', '2'],
    ['trang', '3'],
    ['redirect', '//example.test'],
  ]).toString();
  const href = getPageHref(query, 4, 'pagination');
  assert(href.startsWith('?'));
  const url = new URL(href, 'https://fixture.test/preview');
  assert.equal(url.origin, 'https://fixture.test');
  assert.equal(url.pathname, '/preview');
  assert.equal(url.searchParams.get('q'), 'Bơ & Mây + #');
  assert.equal(url.searchParams.get('loai'), 'cho');
  assert.equal(url.searchParams.get('sapXep'), 'ma-giam');
  assert.deepEqual(url.searchParams.getAll('tag'), ['a', 'b']);
  assert.deepEqual(url.searchParams.getAll('trang'), ['4']);
  assert.equal(url.hash, '#pagination');
  assert.deepEqual(new URLSearchParams(query).getAll('trang'), ['2', '3']);
});

test('invalid pagination configuration cannot create invalid page links', () => {
  for (const total of [-1, 1.5, Infinity, Number.MAX_SAFE_INTEGER + 1]) assert.throws(() => getPagination(total, null));
  for (const size of [0, -1, 1.5, Infinity]) assert.throws(() => getPagination(10, null, size));
  for (const page of [0, -1, 1.5, Infinity, NaN]) assert.throws(() => getPageHref('', page));
});
