'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Alert } from '../../../components/Alert';
import { Button } from '../../../components/Button';
import { Field } from '../../../components/Field';
import { Select } from '../../../components/Select';
import { FIXTURE_ACTORS } from '../../../lib/fixtures';

const CONTEXTS = [
  { id: 'login', label: 'Đăng nhập' },
  { id: 'register', label: 'Đăng ký' },
  { id: 'verify', label: 'Xác minh email / gửi lại' },
  { id: 'forgot', label: 'Quên mật khẩu' },
  { id: 'reset', label: 'Đặt lại mật khẩu' },
  { id: 'mfa', label: 'MFA quản trị' },
];
const ERROR =
  'Phản hồi lỗi mẫu đủ dài để kiểm tra bố cục: chưa thể hoàn tất thao tác. Nội dung bạn đang nhập vẫn được giữ để bạn kiểm tra và thử lại, kể cả khi màn hình hẹp hoặc chữ được phóng to.';

export function AuthLayoutPlayground() {
  const [context, setContext] = useState(CONTEXTS[0]);
  const [simulateError, setSimulateError] = useState(false);
  const [view, setView] = useState<'idle' | 'pending' | 'error' | 'success'>('idle');
  const firstField = useRef<HTMLInputElement>(null);
  const submit = useRef<HTMLButtonElement>(null);
  const mode = context.id;
  const email = ['login', 'register', 'verify', 'forgot'].includes(mode);
  const password = ['login', 'register', 'reset'].includes(mode);
  const confirm = mode === 'register' || mode === 'reset';

  useEffect(() => {
    if (view !== 'pending') return;
    const timeout = window.setTimeout(() => setView(simulateError ? 'error' : 'success'), 1000);
    return () => window.clearTimeout(timeout);
  }, [simulateError, view]);

  useEffect(() => {
    if (view === 'error') firstField.current?.focus();
    if (view === 'success') submit.current?.focus();
  }, [view]);

  return (
    <>
      <p>Preview bố cục · chỉ nhập dữ liệu giả. Không tạo tài khoản, gửi email hoặc kiểm tra mật khẩu/mã MFA.</p>
      <Select
        id="auth-context"
        label="Ngữ cảnh form mẫu"
        value={mode}
        disabled={view === 'pending'}
        onChange={(event) => {
          const next = CONTEXTS.find((item) => item.id === event.target.value);
          if (next) {
            setContext(next);
            setView('idle');
          }
        }}
      >
        {CONTEXTS.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </Select>
      <label className="auth-error-option">
        <input
          type="checkbox"
          checked={simulateError}
          disabled={view === 'pending'}
          onChange={(event) => {
            setSimulateError(event.target.checked);
            setView('idle');
          }}
        />
        Mô phỏng lỗi dài sau khi gửi
      </label>
      <form
        key={mode}
        className="auth-preview-form"
        aria-labelledby="auth-form-title"
        aria-busy={view === 'pending'}
        onSubmit={(event) => {
          event.preventDefault();
          if (view !== 'pending') setView('pending');
        }}
      >
        <h2 id="auth-form-title">{context.label} (mẫu)</h2>
        {mode === 'verify' && (
          <p>Email chưa xác minh (mẫu). Thử gửi lại để xem không gian phản hồi; không đọc hoặc tạo token.</p>
        )}
        {mode === 'mfa' && <p>Bước riêng cho ADMIN sau đăng nhập chính. Mẫu này không cấp quyền quản trị.</p>}
        {email && (
          <Field
            ref={firstField}
            id="auth-email"
            label="Email"
            type="email"
            defaultValue={FIXTURE_ACTORS[mode === 'verify' ? 'U0' : 'UA'].email ?? ''}
            autoComplete="email"
            required
            readOnly={view === 'pending'}
            error={view === 'error' ? ERROR : undefined}
          />
        )}
        {password && (
          <Field
            ref={!email ? firstField : undefined}
            id="auth-password"
            label={mode === 'reset' ? 'Mật khẩu mới' : 'Mật khẩu'}
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            placeholder="Chỉ nhập mật khẩu giả"
            required
            readOnly={view === 'pending'}
            error={!email && view === 'error' ? ERROR : undefined}
          />
        )}
        {confirm && (
          <Field
            id="auth-confirm"
            label="Xác nhận mật khẩu"
            type="password"
            autoComplete="new-password"
            required
            readOnly={view === 'pending'}
          />
        )}
        {mode === 'mfa' && (
          <Field
            ref={firstField}
            id="auth-mfa"
            label="Mã MFA quản trị (mẫu)"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            readOnly={view === 'pending'}
            error={view === 'error' ? ERROR : undefined}
          />
        )}
        <Button ref={submit} type="submit" pending={view === 'pending'}>
          {mode === 'verify' ? 'Gửi lại email xác minh (mẫu)' : `${context.label} (mẫu)`}
        </Button>
        {view === 'success' && (
          <Alert
            variant="success"
            title="Đã hoàn tất mô phỏng"
            message="Đây chỉ là phản hồi để xem bố cục; không tạo phiên, thay mật khẩu, gửi email hoặc cấp quyền thật."
          />
        )}
      </form>
      {view === 'pending' && <p role="status">Đang mô phỏng phản hồi, không gửi yêu cầu mạng.</p>}
      <p className="auth-policy-note">Điều khoản sử dụng và chính sách bảo mật: trang nội dung đang được hoàn thiện.</p>
      <Link href="/preview#public-layout">Về preview layout</Link>
    </>
  );
}
