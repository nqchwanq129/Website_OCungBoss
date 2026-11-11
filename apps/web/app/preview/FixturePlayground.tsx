'use client';

import { useState } from 'react';
import {
  ALL_UI_CAPABILITIES,
  FIXTURE_ACTORS,
  FIXTURE_ARTICLES,
  FIXTURE_DATASET_PRESETS,
  FIXTURE_PETS,
  FIXTURE_VERSIONS,
  FRONTEND_CASE_FIXTURES,
  INTERACTIVE_ACTION_LABELS,
  resolveReadScenario,
  simulateInteractiveAction,
  type ExportJobStatus,
  type FixtureActorId,
  type FixtureTargetKind,
  type FixtureVersionId,
  type FrontendCaseArea,
  type InteractiveActionKind,
  type MutationOutcomeMode,
  type ReadScenarioMode,
  type UiCapability,
  type UploadSimInput,
} from '../../lib/fixtures';

const ACTOR_IDS: readonly FixtureActorId[] = ['G', 'U0', 'UA', 'UB', 'AP', 'AM', 'UL', 'UD'];

const READ_MODES: readonly ReadScenarioMode[] = [
  'normal',
  'empty',
  'long',
  'slow',
  'error',
  'forbidden',
  'not_found',
  'session_expired',
  'removed',
];

const TARGET_OPTIONS: readonly { readonly id: FixtureTargetKind; readonly label: string }[] = [
  { id: 'public_content', label: 'Bài viết đã xuất bản (PUB)' },
  { id: 'draft_content', label: 'Bản nháp biên tập (DRAFT)' },
  { id: 'hidden_content', label: 'Bài viết đã gỡ / lưu trữ (HID)' },
  { id: 'pet_PA', label: 'Hồ sơ thú cưng PA — Mỡ (Chủ: UA)' },
  { id: 'pet_PB', label: 'Hồ sơ thú cưng PB — Mây (Chủ: UB)' },
  { id: 'admin_module', label: 'Phân hệ quản trị (/admin/*)' },
];

const OUTCOME_MODES: readonly { readonly id: MutationOutcomeMode; readonly label: string }[] = [
  { id: 'success', label: 'Thành công tiêu chuẩn (success)' },
  { id: 'slow_success', label: 'Thành công mạng chậm (slow_success · 950ms)' },
  { id: 'pending', label: 'Đang gửi / Khóa nút gửi lặp (pending)' },
  { id: 'error', label: 'Lỗi mô phỏng · Giữ nguyên bản nháp (error)' },
  { id: 'conflict', label: 'Xung đột phiên bản V1 → V2 (conflict)' },
];

const UPLOAD_PRESETS: readonly { readonly id: string; readonly label: string; readonly file: UploadSimInput }[] = [
  {
    id: 'valid-pdf',
    label: 'Hợp lệ: so-tiem-chung-mo-2026.pdf (PDF · 1.2 MB · Tài liệu riêng)',
    file: {
      fileName: 'so-tiem-chung-mo-2026.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 1_240_000,
      kind: 'private-document',
    },
  },
  {
    id: 'valid-jpg',
    label: 'Hợp lệ: anh-corgi-cong-vien.jpg (JPEG · 850 KB · Ảnh công khai)',
    file: {
      fileName: 'anh-corgi-cong-vien.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 850_000,
      kind: 'public-image',
    },
  },
  {
    id: 'invalid-exe',
    label: 'Từ chối: tep-la-khong-hop-le.exe (Sai MIME)',
    file: {
      fileName: 'tep-la-khong-hop-le.exe',
      mimeType: 'application/x-msdownload',
      sizeBytes: 512_000,
      kind: 'private-document',
    },
  },
  {
    id: 'oversize-png',
    label: 'Từ chối: anh-goc-qua-nang.png (PNG · 7.5 MB > giới hạn 5 MB)',
    file: {
      fileName: 'anh-goc-qua-nang.png',
      mimeType: 'image/png',
      sizeBytes: 7_864_320,
      kind: 'public-image',
    },
  },
];

const ACTION_BUTTONS: readonly InteractiveActionKind[] = [
  'create',
  'update',
  'delete',
  'save',
  'chat',
  'upload',
  'export',
];

const INITIAL_DRAFT = 'Ghi chú cân nặng bé Mỡ sáng nay: 11.35 kg, ăn uống bình thường.';
const INITIAL_COMMITTED = 'Ghi chú đã lưu: 11.25 kg (phiên bản V2).';

export function FixturePlayground() {
  const [actorId, setActorId] = useState<FixtureActorId>('UA');
  const [targetKind, setTargetKind] = useState<FixtureTargetKind>('pet_PA');
  const [requiredCap, setRequiredCap] = useState<UiCapability>('content.edit');
  const [readMode, setReadMode] = useState<ReadScenarioMode>('normal');
  const [baseVersion, setBaseVersion] = useState<FixtureVersionId>('V2');
  const [outcomeMode, setOutcomeMode] = useState<MutationOutcomeMode>('success');
  const [draftValue, setDraftValue] = useState<string>(INITIAL_DRAFT);
  const [committedValue, setCommittedValue] = useState<string>(INITIAL_COMMITTED);
  const [activePetOverride, setActivePetOverride] = useState<string | null | undefined>(undefined);
  const [aiKillSwitch, setAiKillSwitch] = useState<boolean>(false);
  const [uploadPresetId, setUploadPresetId] = useState<string>('valid-pdf');
  const [exportStatusOverride, setExportStatusOverride] = useState<ExportJobStatus>('ready');
  const [caseAreaFilter, setCaseAreaFilter] = useState<'all' | FrontendCaseArea>('all');
  const [lastResult, setLastResult] = useState(() =>
    simulateInteractiveAction({
      action: 'save',
      actorId: 'UA',
      targetKind: 'pet_PA',
      baseVersion: 'V2',
      outcomeMode: 'success',
      draftValue: INITIAL_DRAFT,
      committedValue: INITIAL_COMMITTED,
    }),
  );

  const currentActor = FIXTURE_ACTORS[actorId];
  const effectiveDefaultPet = activePetOverride === undefined ? currentActor.defaultPetId : activePetOverride;
  const resolvedRead = resolveReadScenario({
    mode: readMode,
    actorId,
    targetKind,
    requiredCapability: requiredCap,
  });

  const selectedUploadPreset = UPLOAD_PRESETS.find((item) => item.id === uploadPresetId) ?? UPLOAD_PRESETS[0];

  const filteredCases =
    caseAreaFilter === 'all'
      ? FRONTEND_CASE_FIXTURES
      : FRONTEND_CASE_FIXTURES.filter((item) => item.area === caseAreaFilter);

  function handleRunAction(action: InteractiveActionKind) {
    const result = simulateInteractiveAction({
      action,
      actorId,
      targetKind,
      baseVersion,
      outcomeMode,
      draftValue,
      committedValue,
      requiredCapability: requiredCap,
      aiKillSwitchEnabled: aiKillSwitch,
      uploadFile: selectedUploadPreset.file,
      exportStatusOverride,
    });
    setLastResult(result);
    setCommittedValue(result.committedValue);
    if (result.state === 'success' && (action === 'chat' || action === 'upload' || action === 'delete')) {
      setDraftValue(result.preservedDraft);
    }
    if (action === 'delete' && result.state === 'success') {
      setActivePetOverride(result.nextDefaultPetId);
    }
    if (result.state === 'success') {
      setBaseVersion(result.nextVersion);
    }
  }

  function handleResetFixture() {
    setActorId('UA');
    setTargetKind('pet_PA');
    setRequiredCap('content.edit');
    setReadMode('normal');
    setBaseVersion('V2');
    setOutcomeMode('success');
    setDraftValue(INITIAL_DRAFT);
    setCommittedValue(INITIAL_COMMITTED);
    setActivePetOverride(undefined);
    setAiKillSwitch(false);
    setUploadPresetId('valid-pdf');
    setExportStatusOverride('ready');
    setLastResult(
      simulateInteractiveAction({
        action: 'save',
        actorId: 'UA',
        targetKind: 'pet_PA',
        baseVersion: 'V2',
        outcomeMode: 'success',
        draftValue: INITIAL_DRAFT,
        committedValue: INITIAL_COMMITTED,
      }),
    );
  }

  return (
    <div className="fixture-playground">
      <div className="preview-banner" role="note" aria-label="Thông báo môi trường preview dữ liệu ảo">
        <strong>Chế độ Preview Dữ liệu ảo (Local Fixture):</strong> Mọi tài khoản (`.test`), hồ sơ thú cưng (`PA`/`PB`),
        bài viết (`PUB`/`DRAFT`/`HID`) và phản hồi thao tác dưới đây chỉ chạy trong bộ nhớ trình duyệt. Tải lại trang
        (F5) hoặc bấm <em>Khôi phục fixture gốc</em> sẽ đưa toàn bộ trạng thái về mặc định. Không nhập mật khẩu hoặc dữ
        liệu nhạy cảm thật.
      </div>

      <section className="shell-card" aria-labelledby="control-panel-heading">
        <div className="section-header-row">
          <h2 id="control-panel-heading">1. Chọn vai trò (Actor), mục tiêu truy cập &amp; chế độ dữ liệu đọc (S)</h2>
          <button type="button" className="btn-secondary" onClick={handleResetFixture}>
            Khôi phục fixture gốc
          </button>
        </div>

        <div className="control-grid">
          <div className="field-group">
            <label htmlFor="actor-select">Vai trò / Phiên thử nghiệm (Actor)</label>
            <select
              id="actor-select"
              value={actorId}
              onChange={(e) => {
                setActorId(e.target.value as FixtureActorId);
                setActivePetOverride(undefined);
              }}
            >
              {ACTOR_IDS.map((id) => (
                <option key={id} value={id}>
                  {FIXTURE_ACTORS[id].label}
                </option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label htmlFor="target-select">Thực thể / Khu vực đích</label>
            <select
              id="target-select"
              value={targetKind}
              onChange={(e) => setTargetKind(e.target.value as FixtureTargetKind)}
            >
              {TARGET_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label htmlFor="read-mode-select">Kịch bản dữ liệu đọc (State S)</label>
            <select
              id="read-mode-select"
              value={readMode}
              onChange={(e) => setReadMode(e.target.value as ReadScenarioMode)}
            >
              {READ_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {FIXTURE_DATASET_PRESETS[mode].label}
                </option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label htmlFor="capability-select">Capability kiểm tra (khi đích là /admin/*)</label>
            <select
              id="capability-select"
              value={requiredCap}
              onChange={(e) => setRequiredCap(e.target.value as UiCapability)}
            >
              {ALL_UI_CAPABILITIES.map((cap) => (
                <option key={cap} value={cap}>
                  {cap}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="actor-meta-strip" aria-label="Thông tin tóm tắt của actor đang chọn">
          <span>
            <strong>Role:</strong> {currentActor.role}
          </span>
          <span>
            <strong>Trạng thái TK:</strong> {currentActor.accountStatus}
          </span>
          <span>
            <strong>Bước MFA:</strong> {currentActor.adminAuthStep}
          </span>
          <span>
            <strong>Email giả:</strong> {currentActor.email ?? 'Chưa đăng nhập'}
          </span>
          <span>
            <strong>Pet sở hữu:</strong>{' '}
            {currentActor.ownedPetIds.length > 0 ? currentActor.ownedPetIds.join(', ') : 'Không có'}
          </span>
          <span>
            <strong>Pet mặc định:</strong> {effectiveDefaultPet ?? 'Không chọn'}
          </span>
          <span>
            <strong>Capabilities:</strong> {currentActor.capabilities.length}/12
          </span>
        </div>
      </section>

      <section className="shell-card" aria-labelledby="read-state-heading">
        <div className="section-header-row">
          <h2 id="read-state-heading">2. Kết quả hiển thị kịch bản đọc (State S: {resolvedRead.status})</h2>
          <span className={`state-pill state-${resolvedRead.status}`}>
            Trạng thái: {resolvedRead.status.toUpperCase()}
          </span>
        </div>

        <p className="scenario-headline">{resolvedRead.headline}</p>
        <p className="scenario-message">{resolvedRead.message}</p>

        {resolvedRead.status === 'loading' && (
          <div className="skeleton-panel" role="status" aria-live="polite">
            <p>
              Đang tải dữ liệu mô phỏng ({resolvedRead.simulatedDelayMs}ms)... Khung chiều cao được giữ cố định để tránh
              lệch bố cục.
            </p>
            <div className="skeleton-bar" />
            <div className="skeleton-bar short" />
          </div>
        )}

        {resolvedRead.canRetry && (
          <div className="retry-row">
            <button type="button" className="btn-primary" onClick={() => setReadMode('normal')}>
              Thử tải lại (Chuyển về Bình thường)
            </button>
          </div>
        )}

        {resolvedRead.items.length > 0 && (
          <ul className="fixture-item-list">
            {resolvedRead.items.map((item) => (
              <li key={item.id} className="fixture-item-card">
                <div className="fixture-item-top">
                  <span className="species-chip">{item.speciesLabel}</span>
                  <span className="status-chip">{item.statusBadge}</span>
                  <span className="metric-chip">{item.metricText}</span>
                </div>
                <h3>{item.title}</h3>
                <p className="long-safe-text">{item.subtitle}</p>
              </li>
            ))}
          </ul>
        )}

        {resolvedRead.wideTableHeaders.length > 0 && resolvedRead.wideTableRows.length > 0 && (
          <div className="table-scroll" role="region" aria-label="Bảng dữ liệu rộng cuộn ngang an toàn" tabIndex={0}>
            <table className="fixture-table">
              <thead>
                <tr>
                  {resolvedRead.wideTableHeaders.map((header) => (
                    <th key={header} scope="col">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {resolvedRead.wideTableRows.map((row, rowIndex) => (
                  <tr key={row[0] ?? rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={`${row[0] ?? rowIndex}-${cellIndex}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="shell-card" aria-labelledby="mutation-heading">
        <div className="section-header-row">
          <h2 id="mutation-heading">
            3. Mô phỏng 7 thao tác tương tác (State M: Thêm, Sửa, Xóa, Lưu, Chat, Upload, Export)
          </h2>
          <span className={`state-pill state-${lastResult.state}`}>{lastResult.simulationBadge}</span>
        </div>

        <div className="control-grid">
          <div className="field-group">
            <label htmlFor="version-select">Phiên bản bản ghi đang mở (Version)</label>
            <select
              id="version-select"
              value={baseVersion}
              onChange={(e) => setBaseVersion(e.target.value as FixtureVersionId)}
            >
              <option value="V2">V2 — Hiện hành ({FIXTURE_VERSIONS.V2.updatedAtUtc})</option>
              <option value="V1">V1 — Bản cũ (mô phỏng xung đột V1 → V2)</option>
            </select>
          </div>

          <div className="field-group">
            <label htmlFor="outcome-select">Chế độ phản hồi khi bấm nút</label>
            <select
              id="outcome-select"
              value={outcomeMode}
              onChange={(e) => setOutcomeMode(e.target.value as MutationOutcomeMode)}
            >
              {OUTCOME_MODES.map((mode) => (
                <option key={mode.id} value={mode.id}>
                  {mode.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label htmlFor="upload-preset-select">Mẫu tệp thử cho nút Upload</label>
            <select
              id="upload-preset-select"
              value={uploadPresetId}
              onChange={(e) => setUploadPresetId(e.target.value)}
            >
              {UPLOAD_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label htmlFor="export-status-select">Trạng thái thử cho nút Export</label>
            <select
              id="export-status-select"
              value={exportStatusOverride}
              onChange={(e) => setExportStatusOverride(e.target.value as ExportJobStatus)}
            >
              <option value="ready">ready (Tải xuống sẵn sàng)</option>
              <option value="queued">queued (Đang xếp hàng đợi)</option>
              <option value="processing">processing (Đang đóng gói)</option>
              <option value="failed">failed (Lỗi tạo gói — cho thử lại)</option>
              <option value="expired">expired (Hết hạn link tải)</option>
            </select>
          </div>
        </div>

        <div className="toggle-row">
          <label className="checkbox-label" htmlFor="ai-kill-switch">
            <input
              id="ai-kill-switch"
              type="checkbox"
              checked={aiKillSwitch}
              onChange={(e) => setAiKillSwitch(e.target.checked)}
            />
            <span>Bật kill-switch trợ lý AI (`disabled` — chặn nút Chat nhưng giữ nguyên câu hỏi nháp)</span>
          </label>
        </div>

        <div className="field-group">
          <label htmlFor="draft-input">
            Nội dung nháp / Câu hỏi AI đang nhập (được bảo toàn khi lỗi hoặc xung đột V1 → V2)
          </label>
          <textarea id="draft-input" rows={2} value={draftValue} onChange={(e) => setDraftValue(e.target.value)} />
        </div>

        <div className="action-button-bar" role="group" aria-label="Các nút thao tác tương tác mô phỏng">
          {ACTION_BUTTONS.map((action) => (
            <button key={action} type="button" className="btn-action" onClick={() => handleRunAction(action)}>
              {INTERACTIVE_ACTION_LABELS[action]}
            </button>
          ))}
        </div>

        <div className="mutation-feedback-box" role="status" aria-live="polite">
          <p>
            <strong>Thao tác vừa chạy:</strong> {lastResult.actionLabel} · <strong>Trạng thái UI:</strong>{' '}
            <code>{lastResult.state}</code> · <strong>Trạng thái nghiệp vụ:</strong>{' '}
            <code>{lastResult.businessState}</code> · <strong>Khóa gửi lặp:</strong>{' '}
            <code>{lastResult.submitBlocked ? 'Có' : 'Không'}</code>
          </p>
          <p className="feedback-message">{lastResult.message}</p>
          <div className="comparison-grid">
            <div>
              <strong>Giá trị đã lưu (Committed):</strong>
              <p className="long-safe-text">{committedValue}</p>
            </div>
            <div>
              <strong>Bản nháp giữ lại (Preserved Draft):</strong>
              <p className="long-safe-text">{draftValue || '(Trống sau khi hoàn tất)'}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="shell-card" aria-labelledby="entities-heading">
        <h2 id="entities-heading">4. Thực thể mẫu chuẩn (PA, PB, PUB, DRAFT, HID)</h2>
        <div className="entity-summary-grid">
          {Object.values(FIXTURE_PETS).map((pet) => (
            <article key={pet.id} className="fixture-item-card">
              <div className="fixture-item-top">
                <span className="species-chip">Pet {pet.id}</span>
                <span className="status-chip">Chủ: {pet.ownerId}</span>
                <span className="metric-chip">{pet.version}</span>
              </div>
              <h3>
                {pet.name} ({pet.breedName})
              </h3>
              <p>
                Cân nặng: {pet.weightKg ?? 'Chưa rõ'} kg · Sinh: {pet.birthDate} ({pet.birthPrecision}) · Chia sẻ rút
                gọn: {pet.publicSnapshotAllowed ? 'Bật' : 'Tắt'}
              </p>
            </article>
          ))}
          {Object.values(FIXTURE_ARTICLES).map((article) => (
            <article key={article.id} className="fixture-item-card">
              <div className="fixture-item-top">
                <span className="species-chip">Bài {article.id}</span>
                <span className="status-chip">{article.status}</span>
                <span className="metric-chip">{article.readingMinutes} phút đọc</span>
              </div>
              <h3>{article.title}</h3>
              <p>{article.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="shell-card" aria-labelledby="cases-heading">
        <div className="section-header-row">
          <h2 id="cases-heading">
            5. Ma trận 74 mã ca kiểm chứng frontend (P01–Q01 · Hiển thị {filteredCases.length}/
            {FRONTEND_CASE_FIXTURES.length})
          </h2>
          <div className="field-group inline-filter">
            <label htmlFor="case-area-filter">Lọc nhóm màn hình</label>
            <select
              id="case-area-filter"
              value={caseAreaFilter}
              onChange={(e) => setCaseAreaFilter(e.target.value as 'all' | FrontendCaseArea)}
            >
              <option value="all">Tất cả 74 mã ca (P01–Q01)</option>
              <option value="public-content-search">Public, Nội dung, Thư viện &amp; Tìm kiếm (P01–P24)</option>
              <option value="auth-account-personal">Auth, Tài khoản, Thú cưng &amp; Đã lưu (U01–U11, C01–C03)</option>
              <option value="tools-journal-schedule-notifications">
                Công cụ, Nhật ký, Lịch &amp; Thông báo (F01–J05)
              </option>
              <option value="community-places-ai">Cộng đồng, Địa điểm, Sự kiện &amp; Trợ lý AI (L01–I02)</option>
              <option value="admin-data-seo-qa">Quản trị, Quyền dữ liệu, SEO &amp; QA (A01–Q01)</option>
            </select>
          </div>
        </div>

        <div className="table-scroll" role="region" aria-label="Bảng 74 mã ca kiểm chứng frontend" tabIndex={0}>
          <table className="fixture-table">
            <thead>
              <tr>
                <th scope="col">Mã ca</th>
                <th scope="col">Route / Phạm vi</th>
                <th scope="col">Task</th>
                <th scope="col">Actors</th>
                <th scope="col">State</th>
                <th scope="col">Đầu vào &amp; Thao tác</th>
                <th scope="col">Kết quả kỳ vọng</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((item) => (
                <tr key={item.code}>
                  <td>
                    <strong>{item.code}</strong>
                  </td>
                  <td>
                    <code>{item.routePattern}</code>
                  </td>
                  <td>{item.taskRange}</td>
                  <td>{item.actors.join(', ')}</td>
                  <td>{item.stateModel}</td>
                  <td>{item.inputSummary}</td>
                  <td>{item.expectedOutcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
