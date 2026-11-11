'use client';

import { useState } from 'react';
import { AccountLayout } from '../../../components/AccountLayout';
import { Alert } from '../../../components/Alert';
import { EmptyState } from '../../../components/EmptyState';
import { Select } from '../../../components/Select';
import {
  FIXTURE_ACTORS,
  FIXTURE_PETS,
  canActorAccessTarget,
  type FixtureActorId,
  type PetFixtureId,
} from '../../../lib/fixtures';

const ACTORS: readonly FixtureActorId[] = ['UA', 'UB', 'U0', 'G', 'UL', 'UD', 'AP', 'AM'];
const READ_MODES = [
  { id: 'normal', label: 'Bình thường' },
  { id: 'empty', label: 'Rỗng' },
  { id: 'error', label: 'Lỗi' },
];

export function AccountLayoutPlayground() {
  const [actorId, setActorId] = useState<FixtureActorId>('UA');
  const [selectedPetId, setSelectedPetId] = useState<PetFixtureId | null>(FIXTURE_ACTORS.UA.defaultPetId);
  const [mode, setMode] = useState(READ_MODES[0]);
  const [longName, setLongName] = useState(false);
  const actor = FIXTURE_ACTORS[actorId];
  const allowedPetIds = actor.ownedPetIds.filter(
    (id) => canActorAccessTarget(actorId, id === 'PA' ? 'pet_PA' : 'pet_PB').allowed,
  );
  const currentId = allowedPetIds.find((id) => id === selectedPetId);
  const pet = currentId && mode.id === 'normal' ? FIXTURE_PETS[currentId] : null;
  const name = pet
    ? `${pet.name}${longName ? ' — người bạn bốn chân được cả gia đình yêu thương và chăm sóc mỗi ngày' : ''}`
    : '';

  return (
    <AccountLayout
      title="Hồ sơ thú cưng"
      petSelector={
        <section className="shell-card" aria-label="Điều khiển account mẫu">
          <p>Preview bố cục · dữ liệu và tài khoản giả. Không xác thực, không lưu hồ sơ hoặc gửi dữ liệu đi.</p>
          <div className="control-grid">
            <Select
              id="account-actor"
              label="Tài khoản mẫu"
              value={actorId}
              onChange={(event) => {
                const next = ACTORS.find((id) => id === event.target.value);
                if (next) {
                  setActorId(next);
                  setSelectedPetId(FIXTURE_ACTORS[next].defaultPetId);
                  setMode(READ_MODES[0]);
                }
              }}
            >
              {ACTORS.map((id) => (
                <option key={id} value={id}>
                  {FIXTURE_ACTORS[id].label}
                </option>
              ))}
            </Select>
            <Select
              id="account-pet"
              label="Chọn thú cưng mẫu"
              value={currentId ?? ''}
              onChange={(event) => {
                setSelectedPetId(allowedPetIds.find((id) => id === event.target.value) ?? null);
              }}
            >
              <option value="">Chưa chọn thú cưng</option>
              {allowedPetIds.map((id) => (
                <option key={id} value={id}>
                  {FIXTURE_PETS[id].name} ({id})
                </option>
              ))}
            </Select>
            <Select
              id="account-mode"
              label="Dữ liệu hồ sơ mẫu"
              value={mode.id}
              onChange={(event) => {
                const next = READ_MODES.find((item) => item.id === event.target.value);
                if (next) setMode(next);
              }}
            >
              {READ_MODES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </Select>
          </div>
          <label className="account-long-option">
            <input type="checkbox" checked={longName} onChange={(event) => setLongName(event.target.checked)} />
            Tên và hành động dài (mẫu)
          </label>
          <p role="status">
            Ngữ cảnh mẫu: {actor.id} · {currentId ?? 'chưa chọn pet'} · {mode.label}
          </p>
        </section>
      }
      profile={
        pet && (
          <section className="shell-card account-pet-card" aria-labelledby="account-pet-title">
            <span className="account-pet-mark" aria-hidden="true">
              🐾
            </span>
            <h2 id="account-pet-title">{name}</h2>
            <p>
              {pet.species === 'cho' ? 'Chó' : 'Mèo'} · {pet.breedName}
            </p>
            <dl className="account-facts">
              <div>
                <dt>Cân nặng</dt>
                <dd>{pet.weightKg === null ? 'Chưa có dữ liệu' : `${pet.weightKg.toLocaleString('vi-VN')} kg`}</dd>
              </div>
              <div>
                <dt>Ngày sinh</dt>
                <dd>
                  {pet.birthPrecision === 'unknown'
                    ? 'Chưa rõ'
                    : `${pet.birthDate}${pet.birthPrecision === 'estimated' ? ' (ước tính)' : ''}`}
                </dd>
              </div>
            </dl>
            <p>Hồ sơ chăm sóc mặc định là riêng tư. Trang này chỉ minh họa dữ liệu giả.</p>
          </section>
        )
      }
      quickActions={
        pet && (
          <>
            <a href="#account-journal">Nhật ký sức khỏe của {name} (mẫu)</a>
            <a href="#account-calendar">Lịch chăm sóc &amp; nhắc việc cho {name} (mẫu)</a>
            <a href="#account-ration">Tính khẩu phần cho {name} (mẫu)</a>
          </>
        )
      }
    >
      {!currentId || mode.id === 'empty' ? (
        <EmptyState
          kind="empty"
          title="Chưa có hồ sơ để hiển thị"
          message="Chọn tài khoản và thú cưng thuộc chính tài khoản mẫu ở phía trên. Không có dữ liệu hồ sơ cũ được giữ lại trên màn hình này."
          action={{ label: 'Về preview layout', href: '/preview#public-layout' }}
        />
      ) : mode.id === 'error' ? (
        <Alert
          variant="error"
          title="Không tải được hồ sơ mẫu"
          message="Dữ liệu hồ sơ và hành động của lần xem trước đã được bỏ khỏi màn hình. Bạn có thể thử lại với đúng thú cưng đang chọn."
          retryLabel="Thử tải lại hồ sơ mẫu"
          onRetry={() => setMode(READ_MODES[0])}
        />
      ) : (
        pet && (
          <>
            <section className="shell-card" aria-labelledby="account-details-title">
              <h2 id="account-details-title">Thông tin cơ bản của {name}</h2>
              <p>
                <strong>Ghi chú riêng (mẫu):</strong> {pet.privateNote}
              </p>
              <p>
                Hồ sơ {pet.id} · chủ {pet.ownerId} · phiên bản {pet.version}
              </p>
            </section>
            <section
              id="account-journal"
              className="shell-card account-anchor"
              tabIndex={-1}
              aria-labelledby="account-journal-title"
            >
              <h2 id="account-journal-title">Nhật ký sức khỏe của {name}</h2>
              <p>
                Ngữ cảnh hồ sơ {pet.id}; cân nặng mẫu hiện tại:{' '}
                {pet.weightKg === null ? 'chưa có' : `${pet.weightKg.toLocaleString('vi-VN')} kg`}. Chưa có nhật ký chi
                tiết trong preview bố cục.
              </p>
            </section>
            <section
              id="account-calendar"
              className="shell-card account-anchor"
              tabIndex={-1}
              aria-labelledby="account-calendar-title"
            >
              <h2 id="account-calendar-title">Lịch chăm sóc cho {name}</h2>
              <p>
                Ngữ cảnh hồ sơ {pet.id}. Chưa có lịch nhắc trong preview; không suy lịch tiêm hoặc tự gửi thông báo từ
                dữ liệu mẫu.
              </p>
            </section>
            <section
              id="account-ration"
              className="shell-card account-anchor"
              tabIndex={-1}
              aria-labelledby="account-ration-title"
            >
              <h2 id="account-ration-title">Khẩu phần cho {name}</h2>
              <p>Ngữ cảnh hồ sơ {pet.id}. Đây là đích minh họa hành động nhanh; chưa tính hoặc khuyên khẩu phần ăn.</p>
            </section>
          </>
        )
      )}
    </AccountLayout>
  );
}
