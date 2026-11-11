'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Button } from '../../components/Button';
import { Field } from '../../components/Field';
import { Select } from '../../components/Select';

export function SelectPlayground() {
  const petRef = useRef<HTMLSelectElement>(null);
  const noteRef = useRef<HTMLInputElement>(null);
  const [pet, setPet] = useState('');
  const [errors, setErrors] = useState<{ pet?: string; note?: string }>({ pet: 'Chọn thú cưng mẫu.' });
  const [checked, setChecked] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({
      pet: petRef.current?.validity.valid ? undefined : 'Chọn thú cưng mẫu.',
      note: noteRef.current?.value.trim() ? undefined : 'Nhập ghi chú mẫu.',
    });
    setChecked(true);
  }

  return (
    <section id="selects" className="shell-card field-preview" aria-labelledby="selects-title">
      <h2 id="selects-title">Select · lựa chọn native</h2>
      <p>Chỉ dùng dữ liệu giả. Thử bàn phím, lựa chọn dài và giữ lựa chọn khi ghi chú còn lỗi.</p>
      <form aria-label="Thử Select" noValidate onSubmit={handleSubmit}>
        <Select
          ref={petRef}
          id="select-pet"
          name="samplePet"
          label="Thú cưng mẫu"
          placeholder="Chọn thú cưng"
          required
          value={pet}
          onChange={(event) => setPet(event.target.value)}
          error={errors.pet}
          aria-describedby="select-pet-help select-pet-help select-pet-error"
        >
          <option value="PA">Mỡ — Corgi</option>
          <option value="PB">Mây — Mèo nhà với tên hiển thị rất dài để kiểm tra lựa chọn trên màn hình nhỏ</option>
        </Select>
        <p id="select-pet-help">Chọn hồ sơ giả; mục “Chọn thú cưng” không phải lựa chọn hợp lệ.</p>
        <Select id="select-frequency" name="sampleFrequency" label="Tần suất mẫu" defaultValue="weekly">
          <option value="daily">Hằng ngày</option>
          <option value="weekly">Hằng tuần</option>
        </Select>
        <Select
          id="select-disabled"
          name="sampleDisabled"
          label="Lựa chọn chưa khả dụng"
          defaultValue="locked"
          disabled
        >
          <option value="locked">Chưa khả dụng</option>
        </Select>
        <Field ref={noteRef} id="select-note" name="sampleNote" label="Ghi chú mẫu" required error={errors.note} />
        <div className="action-button-bar">
          <Button type="submit">Kiểm tra lựa chọn</Button>
          <Button variant="secondary" onClick={() => petRef.current?.focus()}>
            Focus lựa chọn
          </Button>
        </div>
      </form>
      <p role="status">
        {checked
          ? errors.pet || errors.note
            ? 'Mẫu còn lỗi; lựa chọn được giữ nguyên.'
            : 'Mẫu hợp lệ; không gửi dữ liệu.'
          : 'Chưa chọn thú cưng mẫu.'}
      </p>
    </section>
  );
}
