'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Button } from '../../components/Button';
import { Field } from '../../components/Field';

export function ButtonPlayground() {
  const submitRef = useRef<HTMLButtonElement>(null);
  const [pending, setPending] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [submits, setSubmits] = useState(0);
  const [message, setMessage] = useState('Chưa gửi mẫu.');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setSubmits((value) => value + 1);
    setMessage('Đang xử lý dữ liệu mẫu.');
    setTimeout(() => {
      setPending(false);
      setMessage('Đã hoàn tất mẫu.');
    }, 1000);
  }

  return (
    <section id="buttons" className="shell-card button-preview" aria-labelledby="buttons-title">
      <h2 id="buttons-title">Button · primary / secondary</h2>
      <p>Thử click, submit và khóa gửi lặp. Chỉ mô phỏng trong bộ nhớ, không lưu hoặc gửi dữ liệu.</p>
      <form aria-label="Thử Button" onSubmit={handleSubmit}>
        <Field id="button-example" label="Nhãn mẫu" defaultValue="Bơ" autoComplete="off" />
        <div className="action-button-bar">
          <Button onClick={() => setClicks((value) => value + 1)}>Đếm click</Button>
          <Button ref={submitRef} type="submit" pending={pending} name="intent" value="sample">
            Gửi mẫu
          </Button>
          <Button variant="secondary" onClick={() => submitRef.current?.focus()}>
            Focus nút gửi
          </Button>
          <Button variant="secondary" disabled>
            Chưa khả dụng
          </Button>
          <Button variant="secondary" onClick={() => setClicks((value) => value + 1)}>
            Nhãn dài để thử xuống dòng: chăm sóc boss mỗi ngày bằng bàn phím và chuột
          </Button>
        </div>
      </form>
      <p role="status">
        Số click: {clicks}. Số lần gửi: {submits}. {message}
      </p>
    </section>
  );
}
