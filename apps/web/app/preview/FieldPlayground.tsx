'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Button } from '../../components/Button';
import { Field } from '../../components/Field';

export function FieldPlayground() {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState('chua-hop-le');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({ email: 'Email mẫu chưa hợp lệ.' });
  const [checked, setChecked] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({
      name: nameRef.current?.value.trim() ? undefined : 'Nhập biệt danh mẫu, không chỉ khoảng trắng.',
      email: emailRef.current?.validity.valid ? undefined : 'Nhập email mẫu hợp lệ, ví dụ sen@ocungboss.test.',
    });
    setChecked(true);
  }

  return (
    <section id="fields" className="shell-card field-preview" aria-labelledby="fields-title">
      <h2 id="fields-title">Field · label và lỗi accessible</h2>
      <p>Form thử có lỗi ban đầu. Chỉ nhập dữ liệu giả; kiểm tra không gửi hoặc lưu dữ liệu.</p>
      <form aria-label="Thử Field" noValidate onSubmit={handleSubmit}>
        <Field
          ref={nameRef}
          id="field-name"
          name="sampleName"
          label="Biệt danh mẫu"
          defaultValue="Bơ"
          autoComplete="nickname"
          required
          error={errors.name}
          aria-describedby="field-name-help"
        />
        <p id="field-name-help">Nhập biệt danh giả để thử giữ nội dung khi có lỗi.</p>
        <Field
          ref={emailRef}
          id="field-email"
          name="sampleEmail"
          label="Email mẫu"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
          aria-describedby="field-email-help field-email-help field-email-error"
        />
        <p id="field-email-help">Dùng địa chỉ giả như sen@ocungboss.test.</p>
        <div className="action-button-bar">
          <Button type="submit">Kiểm tra mẫu</Button>
          <Button variant="secondary" onClick={() => emailRef.current?.focus()}>
            Focus email
          </Button>
        </div>
      </form>
      <p role="status">
        {checked
          ? errors.name || errors.email
            ? 'Mẫu còn lỗi; dữ liệu đã nhập được giữ nguyên.'
            : 'Mẫu hợp lệ; không gửi dữ liệu.'
          : 'Email đang có lỗi minh họa.'}
      </p>
    </section>
  );
}
