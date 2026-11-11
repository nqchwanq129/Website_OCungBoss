export type FixtureActorId = 'G' | 'U0' | 'UA' | 'UB' | 'AP' | 'AM' | 'UL' | 'UD';

export type FixtureRole = 'GUEST' | 'USER' | 'ADMIN';

export type AuthAccountStatus = 'guest' | 'pending' | 'active' | 'locked' | 'deletion_pending';

export type AdminAuthStep = 'none' | 'primary_only' | 'mfa_verified';

export type TokenFixtureState = 'valid' | 'invalid' | 'expired' | 'consumed';

export type UiCapability =
  | 'content.edit'
  | 'content.review'
  | 'library.manage'
  | 'affiliate.manage'
  | 'community.moderate'
  | 'places.verify'
  | 'marketing.manage'
  | 'support.read'
  | 'security.manage'
  | 'ai.manage'
  | 'analytics.read'
  | 'settings.manage';

export type PetFixtureId = 'PA' | 'PB';

export type ContentFixtureId = 'PUB' | 'DRAFT' | 'HID';

export type FixtureVersionId = 'V1' | 'V2';

export type CmsContentStatus = 'draft' | 'in_review' | 'scheduled' | 'published' | 'archived';

export type CommunityPostStatus = 'pending' | 'approved' | 'hidden' | 'deleted';

export type MediaAssetStatus = 'pending' | 'ready' | 'quarantined' | 'deleted';

export type CalendarOccurrenceStatus = 'pending' | 'done' | 'snoozed' | 'canceled' | 'missed';

export type ConsentState = 'off' | 'on';

export type ExportJobStatus = 'queued' | 'processing' | 'ready' | 'failed' | 'expired';

export type DeletionRequestStatus = 'queued' | 'processing' | 'completed' | 'failed';

export type AiConversationStatus = 'idle' | 'generating' | 'partial' | 'stopped' | 'error' | 'disabled';

export type ReadScenarioMode =
  'normal' | 'empty' | 'long' | 'slow' | 'error' | 'forbidden' | 'not_found' | 'session_expired' | 'removed';

export type InteractiveActionKind = 'create' | 'update' | 'delete' | 'save' | 'chat' | 'upload' | 'export';

export type MutationOutcomeMode = 'success' | 'pending' | 'slow_success' | 'error' | 'conflict';

export type MutationResultState = 'pending' | 'success' | 'error' | 'conflict' | 'forbidden';

export interface FixtureActor {
  readonly id: FixtureActorId;
  readonly label: string;
  readonly role: FixtureRole;
  readonly email: string | null;
  readonly publicHandle: string | null;
  readonly accountStatus: AuthAccountStatus;
  readonly adminAuthStep: AdminAuthStep;
  readonly ownedPetIds: readonly PetFixtureId[];
  readonly defaultPetId: PetFixtureId | null;
  readonly capabilities: readonly UiCapability[];
  readonly aiConsent: ConsentState;
  readonly historyConsent: ConsentState;
  readonly marketingConsent: ConsentState;
}

export interface FixturePet {
  readonly id: PetFixtureId;
  readonly ownerId: 'UA' | 'UB';
  readonly name: string;
  readonly species: 'cho' | 'meo';
  readonly breedName: string;
  readonly sex: 'male' | 'female' | 'unknown';
  readonly birthDate: string;
  readonly birthPrecision: 'exact' | 'estimated' | 'unknown';
  readonly weightKg: number | null;
  readonly neutered: 'yes' | 'no' | 'unknown';
  readonly privateNote: string;
  readonly publicSnapshotAllowed: boolean;
  readonly version: FixtureVersionId;
}

export interface FixtureArticle {
  readonly id: ContentFixtureId;
  readonly slug: string;
  readonly title: string;
  readonly summary: string;
  readonly species: 'cho' | 'meo' | 'chung';
  readonly categorySlug: string;
  readonly status: CmsContentStatus;
  readonly authorName: string;
  readonly reviewerName: string | null;
  readonly sourceCitation: string | null;
  readonly readingMinutes: number;
  readonly updatedAtUtc: string;
  readonly version: FixtureVersionId;
}

export interface FixtureVersionMeta {
  readonly id: FixtureVersionId;
  readonly revision: number;
  readonly updatedAtUtc: string;
  readonly isStale: boolean;
  readonly note: string;
}

export interface FixtureDatasetItem {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly speciesLabel: string;
  readonly statusBadge: string;
  readonly metricText: string;
}

export interface FixtureDatasetPreset {
  readonly mode: ReadScenarioMode;
  readonly label: string;
  readonly status: 'loading' | 'ready' | 'empty' | 'error' | 'forbidden' | 'not_found' | 'session_expired' | 'removed';
  readonly simulatedDelayMs: number;
  readonly canRetry: boolean;
  readonly notice: string;
  readonly items: readonly FixtureDatasetItem[];
  readonly wideTableHeaders: readonly string[];
  readonly wideTableRows: readonly (readonly string[])[];
}

export type FixtureTargetKind =
  'public_content' | 'draft_content' | 'hidden_content' | 'pet_PA' | 'pet_PB' | 'admin_module';

export interface ResolveReadScenarioInput {
  readonly mode: ReadScenarioMode;
  readonly actorId: FixtureActorId;
  readonly targetKind: FixtureTargetKind;
  readonly requiredCapability?: UiCapability;
}

export interface ResolvedReadScenario {
  readonly status: FixtureDatasetPreset['status'];
  readonly actor: FixtureActor;
  readonly targetKind: FixtureTargetKind;
  readonly simulatedDelayMs: number;
  readonly canRetry: boolean;
  readonly headline: string;
  readonly message: string;
  readonly items: readonly FixtureDatasetItem[];
  readonly wideTableHeaders: readonly string[];
  readonly wideTableRows: readonly (readonly string[])[];
}

export interface UploadSimInput {
  readonly fileName: string;
  readonly mimeType: 'image/jpeg' | 'image/png' | 'image/webp' | 'application/pdf' | 'application/x-msdownload';
  readonly sizeBytes: number;
  readonly kind: 'public-image' | 'private-image' | 'private-document';
}

export interface InteractiveActionSimulationInput {
  readonly action: InteractiveActionKind;
  readonly actorId: FixtureActorId;
  readonly targetKind: FixtureTargetKind;
  readonly baseVersion: FixtureVersionId;
  readonly outcomeMode: MutationOutcomeMode;
  readonly draftValue: string;
  readonly committedValue: string;
  readonly requiredCapability?: UiCapability;
  readonly aiKillSwitchEnabled?: boolean;
  readonly uploadFile?: UploadSimInput;
  readonly exportStatusOverride?: ExportJobStatus;
}

export interface InteractiveActionSimulationResult {
  readonly action: InteractiveActionKind;
  readonly actionLabel: string;
  readonly state: MutationResultState;
  readonly businessState: string;
  readonly message: string;
  readonly submitBlocked: boolean;
  readonly preservedDraft: string;
  readonly committedValue: string;
  readonly nextVersion: FixtureVersionId;
  readonly nextDefaultPetId: PetFixtureId | null;
  readonly simulatedDelayMs: number;
  readonly simulationBadge: string;
}

export type FrontendCaseArea =
  | 'public-content-search'
  | 'auth-account-personal'
  | 'tools-journal-schedule-notifications'
  | 'community-places-ai'
  | 'admin-data-seo-qa';

export interface FrontendCaseFixture {
  readonly code: string;
  readonly area: FrontendCaseArea;
  readonly routePattern: string;
  readonly taskRange: string;
  readonly actors: readonly FixtureActorId[];
  readonly stateModel: 'S' | 'M' | 'S+M';
  readonly inputSummary: string;
  readonly expectedOutcome: string;
}

export const ALL_UI_CAPABILITIES: readonly UiCapability[] = [
  'content.edit',
  'content.review',
  'library.manage',
  'affiliate.manage',
  'community.moderate',
  'places.verify',
  'marketing.manage',
  'support.read',
  'security.manage',
  'ai.manage',
  'analytics.read',
  'settings.manage',
] as const;

export const FIXTURE_VERSIONS: Readonly<Record<FixtureVersionId, FixtureVersionMeta>> = {
  V1: {
    id: 'V1',
    revision: 1,
    updatedAtUtc: '2026-11-10T08:00:00Z',
    isStale: true,
    note: 'Phiên bản cũ (V1) — dùng để mô phỏng xung đột khi bản mới V2 đã được lưu trước.',
  },
  V2: {
    id: 'V2',
    revision: 2,
    updatedAtUtc: '2026-11-10T10:30:00Z',
    isStale: false,
    note: 'Phiên bản hiện hành (V2) — cho phép cập nhật hợp lệ khi không có xung đột.',
  },
} as const;

export const FIXTURE_ACTORS: Readonly<Record<FixtureActorId, FixtureActor>> = {
  G: {
    id: 'G',
    label: 'Khách vãng lai (G)',
    role: 'GUEST',
    email: null,
    publicHandle: null,
    accountStatus: 'guest',
    adminAuthStep: 'none',
    ownedPetIds: [],
    defaultPetId: null,
    capabilities: [],
    aiConsent: 'off',
    historyConsent: 'off',
    marketingConsent: 'off',
  },
  U0: {
    id: 'U0',
    label: 'Thành viên chưa xác minh email (U0)',
    role: 'USER',
    email: 'u0.pending@ocungboss.test',
    publicHandle: null,
    accountStatus: 'pending',
    adminAuthStep: 'none',
    ownedPetIds: [],
    defaultPetId: null,
    capabilities: [],
    aiConsent: 'off',
    historyConsent: 'off',
    marketingConsent: 'off',
  },
  UA: {
    id: 'UA',
    label: 'Thành viên đã xác minh (UA — chủ của PA)',
    role: 'USER',
    email: 'ua.sen@ocungboss.test',
    publicHandle: 'minh-sen',
    accountStatus: 'active',
    adminAuthStep: 'none',
    ownedPetIds: ['PA'],
    defaultPetId: 'PA',
    capabilities: [],
    aiConsent: 'on',
    historyConsent: 'on',
    marketingConsent: 'off',
  },
  UB: {
    id: 'UB',
    label: 'Thành viên đã xác minh khác (UB — chủ của PB)',
    role: 'USER',
    email: 'ub.boss@ocungboss.test',
    publicHandle: 'lan-meo',
    accountStatus: 'active',
    adminAuthStep: 'none',
    ownedPetIds: ['PB'],
    defaultPetId: 'PB',
    capabilities: [],
    aiConsent: 'off',
    historyConsent: 'off',
    marketingConsent: 'off',
  },
  AP: {
    id: 'AP',
    label: 'Quản trị viên mới qua mật khẩu bước 1 (AP — chờ MFA)',
    role: 'ADMIN',
    email: 'ap.admin@ocungboss.test',
    publicHandle: 'dieu-hanh-ap',
    accountStatus: 'active',
    adminAuthStep: 'primary_only',
    ownedPetIds: [],
    defaultPetId: null,
    capabilities: [],
    aiConsent: 'off',
    historyConsent: 'off',
    marketingConsent: 'off',
  },
  AM: {
    id: 'AM',
    label: 'Quản trị viên đã hoàn tất MFA (AM)',
    role: 'ADMIN',
    email: 'am.admin@ocungboss.test',
    publicHandle: 'quan-tri-am',
    accountStatus: 'active',
    adminAuthStep: 'mfa_verified',
    ownedPetIds: [],
    defaultPetId: null,
    capabilities: ALL_UI_CAPABILITIES,
    aiConsent: 'on',
    historyConsent: 'off',
    marketingConsent: 'off',
  },
  UL: {
    id: 'UL',
    label: 'Tài khoản đang bị khóa (UL)',
    role: 'USER',
    email: 'ul.locked@ocungboss.test',
    publicHandle: null,
    accountStatus: 'locked',
    adminAuthStep: 'none',
    ownedPetIds: [],
    defaultPetId: null,
    capabilities: [],
    aiConsent: 'off',
    historyConsent: 'off',
    marketingConsent: 'off',
  },
  UD: {
    id: 'UD',
    label: 'Tài khoản đang chờ xóa (UD)',
    role: 'USER',
    email: 'ud.deleting@ocungboss.test',
    publicHandle: null,
    accountStatus: 'deletion_pending',
    adminAuthStep: 'none',
    ownedPetIds: [],
    defaultPetId: null,
    capabilities: [],
    aiConsent: 'off',
    historyConsent: 'off',
    marketingConsent: 'off',
  },
} as const;

export const FIXTURE_PETS: Readonly<Record<PetFixtureId, FixturePet>> = {
  PA: {
    id: 'PA',
    ownerId: 'UA',
    name: 'Mỡ',
    species: 'cho',
    breedName: 'Corgi Pembroke',
    sex: 'male',
    birthDate: '2023-04-15',
    birthPrecision: 'exact',
    weightKg: 11.25,
    neutered: 'yes',
    privateNote: 'Dị ứng nhẹ với thịt gà khô; khám định kỳ tại phòng khám Quận 3 (dữ liệu riêng của UA).',
    publicSnapshotAllowed: true,
    version: 'V2',
  },
  PB: {
    id: 'PB',
    ownerId: 'UB',
    name: 'Mây',
    species: 'meo',
    breedName: 'Mèo Anh lông ngắn',
    sex: 'female',
    birthDate: '2024-02-01',
    birthPrecision: 'estimated',
    weightKg: 4.1,
    neutered: 'yes',
    privateNote: 'Hồ sơ theo dõi búi lông và lịch tiêm nhắc riêng của UB.',
    publicSnapshotAllowed: false,
    version: 'V2',
  },
} as const;

export const FIXTURE_ARTICLES: Readonly<Record<ContentFixtureId, FixtureArticle>> = {
  PUB: {
    id: 'PUB',
    slug: 'lich-cham-soc-cho-con-8-tuan-tuoi',
    title: 'Lịch chăm sóc chó con 8 tuần tuổi khi mới đón về nhà',
    summary: 'Hướng dẫn chuẩn bị chỗ ngủ, nước uống, sổ theo dõi tiêm phòng và dấu hiệu cần gặp bác sĩ thú y.',
    species: 'cho',
    categorySlug: 'cham-soc-co-ban',
    status: 'published',
    authorName: 'BS. Nguyễn Minh Tâm',
    reviewerName: 'Hội đồng biên tập OCungBoss',
    sourceCitation: 'Tài liệu hướng dẫn chăm sóc thú nhỏ — Bản tham khảo minh họa 2026',
    readingMinutes: 6,
    updatedAtUtc: '2026-11-08T09:00:00Z',
    version: 'V2',
  },
  DRAFT: {
    id: 'DRAFT',
    slug: 'nhap-thuc-don-chuyen-hat-cho-meo-truong-thanh',
    title: '[Nháp] Thực đơn chuyển hạt trong 7 ngày cho mèo trưởng thành',
    summary: 'Bản nháp đang biên tập nội bộ, chưa qua duyệt nguồn nên không hiển thị ở danh sách công khai.',
    species: 'meo',
    categorySlug: 'dinh-duong',
    status: 'draft',
    authorName: 'Biên tập viên Thu Hà',
    reviewerName: null,
    sourceCitation: null,
    readingMinutes: 5,
    updatedAtUtc: '2026-11-09T14:20:00Z',
    version: 'V2',
  },
  HID: {
    id: 'HID',
    slug: 'bai-viet-da-luu-tru-hoac-go-nguon',
    title: '[Đã gỡ] Tổng hợp mẹo dân gian chưa có nguồn kiểm chứng',
    summary: 'Nội dung đã lưu trữ/ẩn khỏi tìm kiếm và danh mục công khai do nguồn tham khảo bị rút.',
    species: 'chung',
    categorySlug: 'suc-khoe',
    status: 'archived',
    authorName: 'Ban biên tập',
    reviewerName: null,
    sourceCitation: null,
    readingMinutes: 4,
    updatedAtUtc: '2026-11-01T07:00:00Z',
    version: 'V2',
  },
} as const;

export const FIXTURE_DATASET_PRESETS: Readonly<Record<ReadScenarioMode, FixtureDatasetPreset>> = {
  normal: {
    mode: 'normal',
    label: 'Bình thường (ready)',
    status: 'ready',
    simulatedDelayMs: 0,
    canRetry: false,
    notice: 'Dữ liệu minh họa tiêu chuẩn cho màn danh sách, chi tiết và bảng tóm tắt.',
    items: [
      {
        id: 'item-pub-1',
        title: 'Lịch chăm sóc chó con 8 tuần tuổi khi mới đón về nhà',
        subtitle: 'Chăm sóc cơ bản · Đã kiểm duyệt chuyên môn · 6 phút đọc',
        speciesLabel: 'Chó',
        statusBadge: 'published',
        metricText: '12 mục kiểm tra',
      },
      {
        id: 'item-pet-pa',
        title: 'Hồ sơ bé Mỡ (PA — Corgi Pembroke)',
        subtitle: 'Cân nặng 11.25 kg · Sinh 15/04/2023 · Chủ sở hữu UA',
        speciesLabel: 'Chó',
        statusBadge: 'active',
        metricText: '2 lịch nhắc sắp tới',
      },
      {
        id: 'item-tool-kcal',
        title: 'Ước tính khẩu phần & nước uống hằng ngày',
        subtitle: 'Kết quả tham khảo minh họa theo cân nặng và mức vận động',
        speciesLabel: 'Chó & Mèo',
        statusBadge: 'ready',
        metricText: '560 kcal / 620 ml',
      },
    ],
    wideTableHeaders: ['Mã mục', 'Chủ đề', 'Loài', 'Trạng thái', 'Cập nhật UTC'],
    wideTableRows: [
      ['PUB-01', 'Lịch chăm sóc chó con 8 tuần tuổi', 'Chó', 'published', '2026-11-08 09:00'],
      ['PA-LOG', 'Nhật ký cân nặng định kỳ tháng 11', 'Chó', 'ready', '2026-11-09 18:30'],
      ['CAL-01', 'Nhắc lịch tẩy giun định kỳ (Asia/Ho_Chi_Minh)', 'Chó', 'pending', '2026-11-12 08:00'],
    ],
  },
  empty: {
    mode: 'empty',
    label: 'Rỗng (empty)',
    status: 'empty',
    simulatedDelayMs: 0,
    canRetry: false,
    notice:
      'Chưa có mục nào khớp bộ lọc hoặc hồ sơ chưa phát sinh nhật ký. Bạn có thể xóa bộ lọc hoặc tạo mục đầu tiên.',
    items: [],
    wideTableHeaders: ['Mã mục', 'Chủ đề', 'Loài', 'Trạng thái', 'Cập nhật UTC'],
    wideTableRows: [],
  },
  long: {
    mode: 'long',
    label: 'Nội dung dài & bảng rộng (long)',
    status: 'ready',
    simulatedDelayMs: 0,
    canRetry: false,
    notice:
      'Kịch bản kiểm tra tiêu đề tiếng Việt có dấu rất dài, chuỗi kỹ thuật không khoảng trắng và bảng nhiều cột cuộn ngang an toàn ở 360px.',
    items: [
      {
        id: 'item-long-1',
        title:
          'Hướng dẫn theo dõi khẩu phần chuyển đổi thức ăn hạt sang khẩu phần hỗn hợp giàu độ ẩm trong 14 ngày liên tục cho thú cưng nhạy cảm đường tiêu hóa kèm bảng ghi nhận phân, lượng nước uống và mức độ vận động buổi sáng/tối',
        subtitle:
          'Mã tham chiếu: ref_20261110_cham_soc_dinh_duong_chuyen_sau_khong_khoang_trang_rat_dai_de_kiem_tra_overflow_wrap_tren_mobile_360px',
        speciesLabel: 'Chó & Mèo trưởng thành',
        statusBadge: 'published',
        metricText: '1.240 từ · 9 bảng con',
      },
      {
        id: 'item-long-2',
        title:
          'Tổng hợp các dấu hiệu bất thường cần đưa thú cưng đến cơ sở thú y gần nhất ngay lập tức thay vì tự theo dõi tại nhà hoặc áp dụng mẹo truyền miệng chưa kiểm chứng',
        subtitle:
          'Nguồn tham khảo minh họa: HoiDongBienTapOCungBoss_TaiLieuThamKhaoChamSocThuNho_PhienBan_2026_11_Rev02',
        speciesLabel: 'Toàn bộ loài',
        statusBadge: 'published',
        metricText: 'Cảnh báo ưu tiên cao',
      },
    ],
    wideTableHeaders: [
      'Mã bản ghi',
      'Hồ sơ thú cưng',
      'Nhóm theo dõi',
      'Chỉ số đo được',
      'Đơn vị chuẩn',
      'Khung tham chiếu minh họa',
      'Ghi chú chi tiết của người nuôi',
      'Trạng thái đồng bộ',
    ],
    wideTableRows: [
      [
        'JRN-2026-0001',
        'PA — Mỡ (Corgi Pembroke)',
        'Cân nặng & BCS',
        '11.25',
        'kg (BCS 5/9)',
        '10.5 – 12.0 kg',
        'Ăn hết khẩu phần sáng, đi dạo 35 phút quanh công viên không thở gấp.',
        'Đã lưu (V2)',
      ],
      [
        'JRN-2026-0002',
        'PA — Mỡ (Corgi Pembroke)',
        'Lượng nước uống',
        '640',
        'ml / ngày',
        '550 – 700 ml / ngày',
        'Trời nắng ấm nên uống thêm 90 ml sau buổi vận động chiều.',
        'Đã lưu (V2)',
      ],
    ],
  },
  slow: {
    mode: 'slow',
    label: 'Chậm / Đang tải (loading / slow)',
    status: 'loading',
    simulatedDelayMs: 900,
    canRetry: false,
    notice: 'Đang tải dữ liệu mô phỏng mạng chậm (900ms) — giữ khung skeleton cố định để tránh lệch bố cục (CLS).',
    items: [],
    wideTableHeaders: ['Mã mục', 'Chủ đề', 'Loài', 'Trạng thái', 'Cập nhật UTC'],
    wideTableRows: [],
  },
  error: {
    mode: 'error',
    label: 'Lỗi tải dữ liệu (error + retry)',
    status: 'error',
    simulatedDelayMs: 350,
    canRetry: true,
    notice: 'Không thể tải dữ liệu mô phỏng lúc này. Vui lòng bấm "Thử tải lại" hoặc chuyển về chế độ Bình thường.',
    items: [],
    wideTableHeaders: [],
    wideTableRows: [],
  },
  forbidden: {
    mode: 'forbidden',
    label: 'Không đủ quyền truy cập (forbidden)',
    status: 'forbidden',
    simulatedDelayMs: 0,
    canRetry: false,
    notice: 'Bạn không có quyền truy cập mục này hoặc tài khoản chưa hoàn tất bước xác thực bắt buộc.',
    items: [],
    wideTableHeaders: [],
    wideTableRows: [],
  },
  not_found: {
    mode: 'not_found',
    label: 'Không tìm thấy (not_found)',
    status: 'not_found',
    simulatedDelayMs: 0,
    canRetry: false,
    notice: 'Không tìm thấy nội dung hoặc hồ sơ yêu cầu (không tiết lộ sự tồn tại của dữ liệu riêng).',
    items: [],
    wideTableHeaders: [],
    wideTableRows: [],
  },
  session_expired: {
    mode: 'session_expired',
    label: 'Phiên đăng nhập hết hạn (session_expired)',
    status: 'session_expired',
    simulatedDelayMs: 0,
    canRetry: true,
    notice: 'Phiên làm việc đã hết hạn. Bản nháp cục bộ vẫn được giữ nguyên để bạn tiếp tục sau khi đăng nhập lại.',
    items: [],
    wideTableHeaders: [],
    wideTableRows: [],
  },
  removed: {
    mode: 'removed',
    label: 'Nội dung đã gỡ / lưu trữ (removed)',
    status: 'removed',
    simulatedDelayMs: 0,
    canRetry: false,
    notice: 'Nội dung này đã được gỡ hoặc chuyển sang lưu trữ nên không còn hiển thị công khai.',
    items: [],
    wideTableHeaders: [],
    wideTableRows: [],
  },
} as const;

export const INTERACTIVE_ACTION_LABELS: Readonly<Record<InteractiveActionKind, string>> = {
  create: 'Thêm mới',
  update: 'Cập nhật / Sửa',
  delete: 'Xóa',
  save: 'Lưu thay đổi',
  chat: 'Chat trợ lý AI',
  upload: 'Tải tệp lên (Upload)',
  export: 'Xuất dữ liệu (Export)',
} as const;

export function hasUiCapability(actor: FixtureActor, capability: UiCapability): boolean {
  return actor.role === 'ADMIN' && actor.adminAuthStep === 'mfa_verified' && actor.capabilities.includes(capability);
}

export function canActorAccessTarget(
  actorId: FixtureActorId,
  targetKind: FixtureTargetKind,
  requiredCapability?: UiCapability,
): {
  readonly allowed: boolean;
  readonly fallbackStatus: 'ready' | 'forbidden' | 'not_found' | 'removed';
  readonly reason: string;
} {
  const actor = FIXTURE_ACTORS[actorId];

  if (actor.accountStatus === 'locked') {
    return {
      allowed: false,
      fallbackStatus: 'forbidden',
      reason:
        'Tài khoản UL đang bị khóa tạm thời; chỉ hiển thị hướng dẫn liên hệ hỗ trợ, không truy cập dữ liệu riêng.',
    };
  }

  if (targetKind === 'public_content') {
    return {
      allowed: true,
      fallbackStatus: 'ready',
      reason: 'Nội dung đã xuất bản (PUB) mở công khai cho mọi vai trò.',
    };
  }

  if (targetKind === 'draft_content') {
    if (hasUiCapability(actor, 'content.edit') || hasUiCapability(actor, 'content.review')) {
      return {
        allowed: true,
        fallbackStatus: 'ready',
        reason: 'Quản trị viên đã qua MFA (AM) có quyền xem bản nháp trong khu biên tập.',
      };
    }
    return {
      allowed: false,
      fallbackStatus: 'not_found',
      reason: 'Bản nháp (DRAFT) không hiển thị ở khu công khai và trả not_found với khách/thành viên thường.',
    };
  }

  if (targetKind === 'hidden_content') {
    if (hasUiCapability(actor, 'content.edit') || hasUiCapability(actor, 'content.review')) {
      return {
        allowed: true,
        fallbackStatus: 'ready',
        reason: 'Quản trị viên đã qua MFA (AM) xem được bản lưu trữ trong khu quản trị.',
      };
    }
    return {
      allowed: false,
      fallbackStatus: 'removed',
      reason: 'Nội dung đã gỡ/lưu trữ (HID) trả trạng thái removed hoặc not_found, không lộ nội dung cũ.',
    };
  }

  if (targetKind === 'pet_PA' || targetKind === 'pet_PB') {
    const petId: PetFixtureId = targetKind === 'pet_PA' ? 'PA' : 'PB';
    if (actor.accountStatus !== 'active') {
      return {
        allowed: false,
        fallbackStatus: 'forbidden',
        reason: 'Cần tài khoản USER đã xác minh email và đang hoạt động để truy cập hồ sơ thú cưng riêng.',
      };
    }
    if (actor.ownedPetIds.includes(petId)) {
      return {
        allowed: true,
        fallbackStatus: 'ready',
        reason: `Chủ sở hữu hợp lệ (${actor.id}) của hồ sơ ${petId}.`,
      };
    }
    return {
      allowed: false,
      fallbackStatus: 'not_found',
      reason: `Hồ sơ riêng ${petId} chỉ thuộc chủ sở hữu (${FIXTURE_PETS[petId].ownerId}); ${actor.id} (kể cả ADMIN) không tự đọc được dữ liệu riêng của người khác.`,
    };
  }

  if (targetKind === 'admin_module') {
    if (actor.role !== 'ADMIN') {
      return {
        allowed: false,
        fallbackStatus: 'forbidden',
        reason: 'Khu vực quản trị (/admin/*) yêu cầu vai trò ADMIN.',
      };
    }
    if (actor.adminAuthStep !== 'mfa_verified') {
      return {
        allowed: false,
        fallbackStatus: 'forbidden',
        reason: 'Tài khoản ADMIN mới qua bước 1 (AP) phải hoàn tất MFA tại /admin/mfa trước khi vào trang quản trị.',
      };
    }
    const cap = requiredCapability ?? 'content.edit';
    if (!hasUiCapability(actor, cap)) {
      return {
        allowed: false,
        fallbackStatus: 'forbidden',
        reason: `Thiếu capability quản trị bắt buộc: ${cap}.`,
      };
    }
    return {
      allowed: true,
      fallbackStatus: 'ready',
      reason: `ADMIN đã xác thực MFA (AM) và có capability ${cap}.`,
    };
  }

  return {
    allowed: false,
    fallbackStatus: 'forbidden',
    reason: 'Không xác định được quyền truy cập mục tiêu.',
  };
}

export function resolveReadScenario(input: ResolveReadScenarioInput): ResolvedReadScenario {
  const actor = FIXTURE_ACTORS[input.actorId];
  const access = canActorAccessTarget(input.actorId, input.targetKind, input.requiredCapability);

  if (!access.allowed) {
    const deniedPreset = FIXTURE_DATASET_PRESETS[access.fallbackStatus === 'ready' ? 'normal' : access.fallbackStatus];
    return {
      status: deniedPreset.status,
      actor,
      targetKind: input.targetKind,
      simulatedDelayMs: 0,
      canRetry: false,
      headline: `${deniedPreset.label} — ${actor.label}`,
      message: access.reason,
      items: [],
      wideTableHeaders: [],
      wideTableRows: [],
    };
  }

  const preset = FIXTURE_DATASET_PRESETS[input.mode];
  return {
    status: preset.status,
    actor,
    targetKind: input.targetKind,
    simulatedDelayMs: preset.simulatedDelayMs,
    canRetry: preset.canRetry,
    headline: `${preset.label} — ${actor.label}`,
    message: `${preset.notice} (${access.reason})`,
    items: preset.items,
    wideTableHeaders: preset.wideTableHeaders,
    wideTableRows: preset.wideTableRows,
  };
}

const DEFAULT_UPLOAD_FILE: UploadSimInput = {
  fileName: 'so-tiem-chung-mo-2026.pdf',
  mimeType: 'application/pdf',
  sizeBytes: 1_240_000,
  kind: 'private-document',
};

export function simulateInteractiveAction(input: InteractiveActionSimulationInput): InteractiveActionSimulationResult {
  const actor = FIXTURE_ACTORS[input.actorId];
  const actionLabel = INTERACTIVE_ACTION_LABELS[input.action];
  const access = canActorAccessTarget(input.actorId, input.targetKind, input.requiredCapability);

  if (actor.role === 'GUEST' || actor.accountStatus !== 'active') {
    return {
      action: input.action,
      actionLabel,
      state: 'forbidden',
      businessState: actor.accountStatus,
      message:
        actor.role === 'GUEST'
          ? 'Thao tác mô phỏng bị chặn: Khách vãng lai (G) cần đăng nhập tài khoản đã xác minh để thực hiện thao tác ghi/lưu.'
          : `Thao tác mô phỏng bị chặn: Tài khoản ${actor.id} đang ở trạng thái ${actor.accountStatus} nên không được ghi dữ liệu.`,
      submitBlocked: true,
      preservedDraft: input.draftValue,
      committedValue: input.committedValue,
      nextVersion: input.baseVersion,
      nextDefaultPetId: actor.defaultPetId,
      simulatedDelayMs: 0,
      simulationBadge: 'FORBIDDEN · Giữ nguyên bản nháp',
    };
  }

  const mutatesContent =
    input.targetKind === 'public_content' &&
    (input.action === 'create' ||
      input.action === 'update' ||
      input.action === 'delete' ||
      input.action === 'save' ||
      input.action === 'upload');
  if (mutatesContent && !hasUiCapability(actor, 'content.edit')) {
    return {
      action: input.action,
      actionLabel,
      state: 'forbidden',
      businessState: 'forbidden',
      message: `Thao tác "${actionLabel}" bị từ chối: cần capability content.edit để thay đổi nội dung đã xuất bản.`,
      submitBlocked: true,
      preservedDraft: input.draftValue,
      committedValue: input.committedValue,
      nextVersion: input.baseVersion,
      nextDefaultPetId: actor.defaultPetId,
      simulatedDelayMs: 0,
      simulationBadge: 'DENIED · Không ghi đè dữ liệu',
    };
  }

  if (!access.allowed) {
    return {
      action: input.action,
      actionLabel,
      state: 'forbidden',
      businessState: access.fallbackStatus,
      message: `Thao tác "${actionLabel}" bị từ chối: ${access.reason}`,
      submitBlocked: true,
      preservedDraft: input.draftValue,
      committedValue: input.committedValue,
      nextVersion: input.baseVersion,
      nextDefaultPetId: actor.defaultPetId,
      simulatedDelayMs: 0,
      simulationBadge: 'DENIED · Không ghi đè dữ liệu',
    };
  }

  if (input.outcomeMode === 'pending') {
    return {
      action: input.action,
      actionLabel,
      state: 'pending',
      businessState: input.action === 'chat' ? 'generating' : input.action === 'export' ? 'processing' : 'pending',
      message: `Đang xử lý "${actionLabel}" (mô phỏng trạng thái pending) — nút gửi lặp tạm khóa để chống gửi trùng.`,
      submitBlocked: true,
      preservedDraft: input.draftValue,
      committedValue: input.committedValue,
      nextVersion: input.baseVersion,
      nextDefaultPetId: actor.defaultPetId,
      simulatedDelayMs: 750,
      simulationBadge: 'PENDING · Khóa gửi lặp',
    };
  }

  if (
    (input.outcomeMode === 'conflict' || input.baseVersion === 'V1') &&
    (input.action === 'update' || input.action === 'save' || input.action === 'delete')
  ) {
    return {
      action: input.action,
      actionLabel,
      state: 'conflict',
      businessState: 'version_conflict_V1_to_V2',
      message:
        'Phát hiện xung đột phiên bản (V1 → V2): bản ghi đã được cập nhật ở phiên khác. Bản nháp của bạn vẫn được giữ nguyên để đối chiếu trước khi lưu lại.',
      submitBlocked: false,
      preservedDraft: input.draftValue,
      committedValue: input.committedValue,
      nextVersion: 'V2',
      nextDefaultPetId: actor.defaultPetId,
      simulatedDelayMs: 250,
      simulationBadge: 'CONFLICT V1→V2 · Giữ bản nháp',
    };
  }

  if (input.outcomeMode === 'error') {
    return {
      action: input.action,
      actionLabel,
      state: 'error',
      businessState: input.action === 'export' ? 'failed' : 'error',
      message: `Không thể hoàn tất "${actionLabel}" do lỗi mô phỏng. Giá trị đã lưu trước đó không đổi và bản nháp được giữ nguyên.`,
      submitBlocked: false,
      preservedDraft: input.draftValue,
      committedValue: input.committedValue,
      nextVersion: input.baseVersion,
      nextDefaultPetId: actor.defaultPetId,
      simulatedDelayMs: 350,
      simulationBadge: 'ERROR · Bảo toàn dữ liệu cũ & nháp',
    };
  }

  const delayMs = input.outcomeMode === 'slow_success' ? 950 : 180;

  if (input.action === 'chat') {
    if (input.aiKillSwitchEnabled) {
      return {
        action: 'chat',
        actionLabel,
        state: 'error',
        businessState: 'disabled',
        message:
          'Trợ lý AI đang tạm tắt theo cấu hình an toàn (kill-switch disabled). Câu hỏi nháp của bạn được giữ lại; vui lòng tra cứu Thư viện hoặc liên hệ bác sĩ thú y khi khẩn cấp.',
        submitBlocked: true,
        preservedDraft: input.draftValue,
        committedValue: input.committedValue,
        nextVersion: input.baseVersion,
        nextDefaultPetId: actor.defaultPetId,
        simulatedDelayMs: 0,
        simulationBadge: 'AI DISABLED · Kill-switch bật',
      };
    }

    const reply = `[Phản hồi mô phỏng cho ${actor.id}] Dựa trên câu hỏi "${input.draftValue.trim() || 'chăm sóc thú cưng'}", bạn nên theo dõi lượng nước uống, mức độ tỉnh táo và đối chiếu bài viết đã kiểm duyệt chuyên môn. Thông tin chỉ mang tính tham khảo, không thay thế chẩn đoán thú y.`;
    return {
      action: 'chat',
      actionLabel,
      state: 'success',
      businessState: 'idle',
      message: reply,
      submitBlocked: false,
      preservedDraft: '',
      committedValue: reply,
      nextVersion: 'V2',
      nextDefaultPetId: actor.defaultPetId,
      simulatedDelayMs: delayMs,
      simulationBadge: 'AI STREAM COMPLETE · Kèm miễn trừ thú y',
    };
  }

  if (input.action === 'upload') {
    const file = input.uploadFile ?? DEFAULT_UPLOAD_FILE;
    const maxBytes = file.kind === 'private-document' ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    const isAllowedMime =
      file.kind === 'private-document'
        ? file.mimeType === 'application/pdf' ||
          file.mimeType === 'image/jpeg' ||
          file.mimeType === 'image/png' ||
          file.mimeType === 'image/webp'
        : file.mimeType === 'image/jpeg' || file.mimeType === 'image/png' || file.mimeType === 'image/webp';

    if (!isAllowedMime || file.sizeBytes > maxBytes || file.sizeBytes <= 0) {
      return {
        action: 'upload',
        actionLabel,
        state: 'error',
        businessState: 'quarantined',
        message: `Tệp "${file.fileName}" bị từ chối: chỉ nhận JPEG/PNG/WebP (≤5MB) cho ảnh hoặc thêm PDF (≤10MB) cho tài liệu riêng.`,
        submitBlocked: false,
        preservedDraft: input.draftValue,
        committedValue: input.committedValue,
        nextVersion: input.baseVersion,
        nextDefaultPetId: actor.defaultPetId,
        simulatedDelayMs: 150,
        simulationBadge: 'UPLOAD REJECTED · Sai MIME/dung lượng',
      };
    }

    const visibilityNote =
      file.kind === 'public-image'
        ? 'Ảnh công khai đã strip EXIF GPS mô phỏng và sẵn sàng hiển thị.'
        : 'Tệp riêng tư chỉ mở qua URL ký ngắn hạn mô phỏng cho đúng chủ sở hữu.';
    return {
      action: 'upload',
      actionLabel,
      state: 'success',
      businessState: 'ready',
      message: `Đã tải lên mô phỏng tệp "${file.fileName}" (${Math.round(file.sizeBytes / 1024)} KB). ${visibilityNote}`,
      submitBlocked: false,
      preservedDraft: '',
      committedValue: `${file.fileName} (ready)`,
      nextVersion: 'V2',
      nextDefaultPetId: actor.defaultPetId,
      simulatedDelayMs: delayMs,
      simulationBadge: 'UPLOAD READY · Đã kiểm MIME & dung lượng',
    };
  }

  if (input.action === 'export') {
    const exportStatus: ExportJobStatus = input.exportStatusOverride ?? 'ready';
    const statusMessages: Readonly<Record<ExportJobStatus, string>> = {
      queued: 'Yêu cầu xuất dữ liệu đã vào hàng đợi mô phỏng (queued).',
      processing: 'Đang tổng hợp gói dữ liệu cá nhân mô phỏng (processing).',
      ready: `Gói xuất dữ liệu cá nhân của ${actor.id} đã sẵn sàng tải xuống (ready — liên kết mô phỏng có thời hạn).`,
      failed: 'Xuất dữ liệu mô phỏng thất bại (failed) — bạn có thể bấm tạo lại yêu cầu.',
      expired: 'Liên kết tải gói dữ liệu đã hết hạn (expired) — vui lòng tạo gói mới.',
    };
    return {
      action: 'export',
      actionLabel,
      state: exportStatus === 'failed' || exportStatus === 'expired' ? 'error' : 'success',
      businessState: exportStatus,
      message: statusMessages[exportStatus],
      submitBlocked: false,
      preservedDraft: input.draftValue,
      committedValue: `export-${actor.id.toLowerCase()}-${exportStatus}.json`,
      nextVersion: input.baseVersion,
      nextDefaultPetId: actor.defaultPetId,
      simulatedDelayMs: delayMs,
      simulationBadge: `EXPORT ${exportStatus.toUpperCase()}`,
    };
  }

  if (input.action === 'delete') {
    return {
      action: 'delete',
      actionLabel,
      state: 'success',
      businessState: 'deleted',
      message:
        input.targetKind === 'pet_PA' || input.targetKind === 'pet_PB'
          ? 'Đã xóa hồ sơ thú cưng mô phỏng và tự động gỡ pet mặc định hiện tại để tránh trỏ vào hồ sơ đã xóa.'
          : 'Đã xóa mục được chọn trong bộ nhớ mô phỏng (reload trang sẽ khôi phục fixture gốc).',
      submitBlocked: false,
      preservedDraft: '',
      committedValue: '[Đã xóa trong phiên mô phỏng]',
      nextVersion: 'V2',
      nextDefaultPetId: null,
      simulatedDelayMs: delayMs,
      simulationBadge: 'DELETED · Đã dọn trạng thái liên quan',
    };
  }

  const nextCommitted = input.draftValue.trim() || input.committedValue;
  return {
    action: input.action,
    actionLabel,
    state: 'success',
    businessState: 'saved_V2',
    message: `Đã thực hiện "${actionLabel}" thành công trong bộ nhớ mô phỏng: "${nextCommitted}".`,
    submitBlocked: false,
    preservedDraft: nextCommitted,
    committedValue: nextCommitted,
    nextVersion: 'V2',
    nextDefaultPetId: actor.defaultPetId,
    simulatedDelayMs: delayMs,
    simulationBadge: delayMs > 500 ? 'SLOW SUCCESS · V2' : 'SUCCESS · V2',
  };
}

export const FRONTEND_CASE_FIXTURES: readonly FrontendCaseFixture[] = [
  {
    code: 'P01',
    area: 'public-content-search',
    routePattern: '/preview, shell layout',
    taskRange: '18–26',
    actors: ['G', 'U0', 'UA', 'AP', 'AM', 'UL', 'UD'],
    stateModel: 'S+M',
    inputSummary: 'Header/drawer/footer, skip-link, pet switcher, preview local',
    expectedOutcome: 'Nav active đúng nhóm, drawer khóa scroll & trả focus, preview ghi rõ dữ liệu minh họa',
  },
  {
    code: 'P02',
    area: 'public-content-search',
    routePattern: '/',
    taskRange: '27–32',
    actors: ['G', 'UA'],
    stateModel: 'S+M',
    inputSummary: 'Trang chủ: hero search, lối vào Chó/Mèo, công cụ nhanh, bài mới, newsletter',
    expectedOutcome: 'Đổi tab không nhảy layout, newsletter nhận email .test hợp lệ',
  },
  {
    code: 'P03',
    area: 'public-content-search',
    routePattern: '/cho, /meo, /chuyen-muc/[slug], /tag/[slug]',
    taskRange: '33–35',
    actors: ['G', 'UA'],
    stateModel: 'S',
    inputSummary: 'Hub loài, chuyên mục, thẻ chủ đề kèm lọc/sort/phân trang',
    expectedOutcome: 'Chỉ hiện PUB; slug lạ trả not_found',
  },
  {
    code: 'P04',
    area: 'public-content-search',
    routePattern: '/bai-viet/[slug]',
    taskRange: '36–39',
    actors: ['G', 'UA', 'AM'],
    stateModel: 'S+M',
    inputSummary: 'Chi tiết bài viết PUB/DRAFT/HID, TOC, nguồn, thảo luận',
    expectedOutcome: 'PUB hiện đủ TOC/nguồn/disclaimer; DRAFT trả not_found với khách; HID trả removed',
  },
  {
    code: 'P05',
    area: 'public-content-search',
    routePattern: '/tac-gia/[slug]',
    taskRange: '40',
    actors: ['G'],
    stateModel: 'S',
    inputSummary: 'Hồ sơ tác giả và người duyệt chuyên môn',
    expectedOutcome: 'Chỉ liệt kê bài PUB; slug lạ trả not_found',
  },
  {
    code: 'P06',
    area: 'public-content-search',
    routePattern: '/giong, /giong/[slug], /so-sanh-giong',
    taskRange: '41–43',
    actors: ['G', 'UA'],
    stateModel: 'S',
    inputSummary: 'Danh mục giống, chi tiết giống và bảng so sánh tối đa 3 giống',
    expectedOutcome: 'So sánh cuộn ngang an toàn ở 360px, không tràn trang',
  },
  {
    code: 'P07',
    area: 'public-content-search',
    routePattern: '/dinh-duong, /dinh-duong/[slug], /thanh-phan/[slug]',
    taskRange: '44–46',
    actors: ['G', 'UA'],
    stateModel: 'S',
    inputSummary: 'Thư viện thực phẩm & thành phần, mức an toàn theo loài',
    expectedOutcome: 'Nêu rõ lý do nguy hiểm cho chó/mèo và khuyến nghị gặp thú y',
  },
  {
    code: 'P08',
    area: 'public-content-search',
    routePattern: '/suc-khoe, /suc-khoe/[slug], /trieu-chung/[slug], /so-cuu/[slug]',
    taskRange: '47–50',
    actors: ['G', 'UA'],
    stateModel: 'S',
    inputSummary: 'Chủ đề sức khỏe, triệu chứng, sơ cứu ban đầu',
    expectedOutcome: 'Banner miễn trừ thú y cố định + dấu hiệu đỏ cần đưa đi khám ngay',
  },
  {
    code: 'P09',
    area: 'public-content-search',
    routePattern: '/san-pham, /san-pham/[slug], /bo-suu-tap/[slug]',
    taskRange: '51–53',
    actors: ['G', 'UA'],
    stateModel: 'S',
    inputSummary: 'Sản phẩm gợi ý, bộ sưu tập và nhãn affiliate minh bạch',
    expectedOutcome: 'Nhãn liên kết tiếp thị rõ ràng, link ngoài mở an toàn noopener noreferrer',
  },
  {
    code: 'P10',
    area: 'public-content-search',
    routePattern: '/tim-kiem',
    taskRange: '54–56',
    actors: ['G', 'UA'],
    stateModel: 'S',
    inputSummary: 'Tìm kiếm hợp nhất, autocomplete, sửa lỗi gõ, facet',
    expectedOutcome: 'Chỉ trả nội dung PUB, không lộ dữ liệu riêng PA/PB',
  },
  {
    code: 'P11',
    area: 'public-content-search',
    routePattern: '/gioi-thieu, /tieu-chuan-noi-dung, /mien-tru-thu-y, /cong-bo-lien-ket',
    taskRange: '57',
    actors: ['G'],
    stateModel: 'S',
    inputSummary: 'Các trang niềm tin và quy trình biên tập',
    expectedOutcome: 'Có ngày cập nhật, TOC neo mục và liên kết sang trang liên hệ',
  },
  {
    code: 'P12',
    area: 'public-content-search',
    routePattern: '/dieu-khoan, /chinh-sach-bao-mat, /chinh-sach-cookie, /quy-tac-cong-dong',
    taskRange: '58',
    actors: ['G', 'UA'],
    stateModel: 'S',
    inputSummary: 'Các trang pháp lý và quy tắc cộng đồng',
    expectedOutcome: 'Trình bày rõ quyền dữ liệu cá nhân và lối vào /cai-dat/quyen-rieng-tu',
  },
  {
    code: 'P13',
    area: 'public-content-search',
    routePattern: '/lien-he, /hop-tac, /bao-loi-noi-dung, /hoi-dap',
    taskRange: '59–60',
    actors: ['G', 'UA'],
    stateModel: 'S+M',
    inputSummary: 'Biểu mẫu liên hệ, hợp tác, báo lỗi nội dung và FAQ',
    expectedOutcome: 'Chặn gửi lặp, giữ nháp khi lỗi, thành công trả mã tham chiếu mô phỏng',
  },
  {
    code: 'P14',
    area: 'public-content-search',
    routePattern: '/403, /404, /500, /429, /bao-tri, /ngoai-tuyen',
    taskRange: '24',
    actors: ['G', 'UA', 'AM'],
    stateModel: 'S',
    inputSummary: 'Các trang trạng thái hệ thống',
    expectedOutcome: 'Nút thử lại/về trang chủ rõ ràng, không lộ stack trace',
  },
  {
    code: 'P15',
    area: 'public-content-search',
    routePattern: '/cho, /meo, /chuyen-muc/[slug], /tag/[slug]',
    taskRange: '33–35',
    actors: ['G'],
    stateModel: 'S',
    inputSummary: 'Chuẩn hóa query lọc/sắp xếp/trang không hợp lệ',
    expectedOutcome: 'page=0/-1/abc tự đưa về trang 1; bộ lọc rỗng có nút xóa lọc',
  },
  {
    code: 'P16',
    area: 'public-content-search',
    routePattern: '/bai-viet/[slug]',
    taskRange: '36–39',
    actors: ['G', 'UA'],
    stateModel: 'S+M',
    inputSummary: 'Tương tác phụ bài viết: TOC, copy link, thảo luận dài',
    expectedOutcome: 'Copy link báo đã sao chép; bình luận của người khác không có nút sửa/xóa',
  },
  {
    code: 'P17',
    area: 'public-content-search',
    routePattern: '/giong, /giong/[slug], /so-sanh-giong',
    taskRange: '41–43',
    actors: ['G'],
    stateModel: 'S',
    inputSummary: 'Ràng buộc chọn 0/1/2/3/4 giống khi so sánh',
    expectedOutcome: 'Chọn giống thứ 4 báo giới hạn tối đa 3 giống; trùng giống tự gộp',
  },
  {
    code: 'P18',
    area: 'public-content-search',
    routePattern: '/dinh-duong/[slug], /thanh-phan/[slug]',
    taskRange: '44–46',
    actors: ['G'],
    stateModel: 'S',
    inputSummary: 'Đối chiếu mức an toàn khác nhau giữa Chó và Mèo',
    expectedOutcome: 'Đổi tab Chó/Mèo cập nhật ngay nhãn an toàn và khẩu phần tham khảo',
  },
  {
    code: 'P19',
    area: 'public-content-search',
    routePattern: '/suc-khoe/[slug], /trieu-chung/[slug], /so-cuu/[slug]',
    taskRange: '47–50',
    actors: ['G'],
    stateModel: 'S',
    inputSummary: 'Cảnh báo khẩn cấp và các việc không nên tự làm',
    expectedOutcome: 'Hộp cảnh báo khẩn cấp ở đầu bài, lối tắt sang /dia-diem?loai=cap-cuu',
  },
  {
    code: 'P20',
    area: 'public-content-search',
    routePattern: '/san-pham, /san-pham/[slug], /bo-suu-tap/[slug]',
    taskRange: '51–53',
    actors: ['G'],
    stateModel: 'S',
    inputSummary: 'Trạng thái hết hàng/ngừng bán của sản phẩm affiliate',
    expectedOutcome: 'Nút đối tác ghi rõ hết hàng và gợi ý sản phẩm thay thế',
  },
  {
    code: 'P21',
    area: 'public-content-search',
    routePattern: '/tim-kiem',
    taskRange: '54–56',
    actors: ['G'],
    stateModel: 'S',
    inputSummary: 'Ký tự đặc biệt, chuỗi dài, phím tắt bàn phím trong ô tìm kiếm',
    expectedOutcome: 'Escape đóng gợi ý, mũi tên di chuyển, render chữ thuần chống XSS',
  },
  {
    code: 'P22',
    area: 'public-content-search',
    routePattern: '/gioi-thieu..cong-bo-lien-ket',
    taskRange: '57',
    actors: ['G'],
    stateModel: 'S',
    inputSummary: 'Neo mục lục và chế độ in trên các trang niềm tin',
    expectedOutcome: 'Cuộn tới mục không bị header che khuất',
  },
  {
    code: 'P23',
    area: 'public-content-search',
    routePattern: '/dieu-khoan..quy-tac-cong-dong',
    taskRange: '58',
    actors: ['G', 'UA'],
    stateModel: 'S+M',
    inputSummary: 'Hộp tóm tắt dễ hiểu và đồng bộ tùy chọn cookie',
    expectedOutcome: 'Bật/tắt cookie analytics/marketing đồng bộ ngay với banner',
  },
  {
    code: 'P24',
    area: 'public-content-search',
    routePattern: '/lien-he, /hop-tac, /bao-loi-noi-dung, /hoi-dap',
    taskRange: '59–60',
    actors: ['G', 'UA'],
    stateModel: 'S+M',
    inputSummary: 'Tự điền URL bài báo lỗi, chống spam/rate-limit mô phỏng',
    expectedOutcome: 'Lọc câu hỏi FAQ theo từ khóa và báo giới hạn tần suất rõ ràng',
  },
  {
    code: 'U01',
    area: 'auth-account-personal',
    routePattern: '/dang-ky',
    taskRange: '61, 67',
    actors: ['G'],
    stateModel: 'M',
    inputSummary: 'Đăng ký email + password + confirmPassword + đồng ý điều khoản',
    expectedOutcome: 'Tạo phiên U0 chờ xác minh email, thông báo trung tính khi trùng email',
  },
  {
    code: 'U02',
    area: 'auth-account-personal',
    routePattern: '/dang-nhap',
    taskRange: '62, 67–68',
    actors: ['G', 'U0', 'UA', 'AP', 'UL', 'UD'],
    stateModel: 'M',
    inputSummary: 'Đăng nhập email + password và xử lý returnTo an toàn',
    expectedOutcome: 'UA vào returnTo nội bộ; AP chuyển /admin/mfa; returnTo ngoài bị chặn về /',
  },
  {
    code: 'U03',
    area: 'auth-account-personal',
    routePattern: '/xac-minh-email',
    taskRange: '63',
    actors: ['G', 'U0', 'UA'],
    stateModel: 'S+M',
    inputSummary: 'Xác minh email với token valid/invalid/expired/consumed & gửi lại',
    expectedOutcome: 'valid kích hoạt UA; các trạng thái khác có nút gửi lại kèm cooldown 60s',
  },
  {
    code: 'U04',
    area: 'auth-account-personal',
    routePattern: '/quen-mat-khau, /dat-lai-mat-khau',
    taskRange: '64–65',
    actors: ['G', 'UA'],
    stateModel: 'M',
    inputSummary: 'Yêu cầu quên mật khẩu và đặt lại mật khẩu mới',
    expectedOutcome: 'Thông báo trung tính chống dò email; đặt lại xong yêu cầu đăng nhập lại',
  },
  {
    code: 'U05',
    area: 'auth-account-personal',
    routePattern: '/admin/mfa',
    taskRange: '66, 68',
    actors: ['G', 'UA', 'AP', 'AM'],
    stateModel: 'S+M',
    inputSummary: 'Xác thực MFA TOTP 6 số hoặc recovery code riêng cho ADMIN',
    expectedOutcome: 'AP nhập mã hợp lệ nâng lên AM; G/UA truy cập bị chặn',
  },
  {
    code: 'U06',
    area: 'auth-account-personal',
    routePattern: '/bang-dieu-khien',
    taskRange: '69',
    actors: ['G', 'U0', 'UA', 'UD'],
    stateModel: 'S',
    inputSummary: 'Tổng quan cá nhân theo thú cưng đang chọn (PA)',
    expectedOutcome: 'Hiện tóm tắt PA, lịch nhắc, nhật ký gần nhất; U0 nhắc xác minh email',
  },
  {
    code: 'U07',
    area: 'auth-account-personal',
    routePattern: '/tai-khoan, /cai-dat/*, /cai-dat/quyen-rieng-tu',
    taskRange: '70–74',
    actors: ['UA', 'AM', 'UD'],
    stateModel: 'S+M',
    inputSummary: 'Hồ sơ tài khoản, đổi mật khẩu, phiên thiết bị, consent, xuất/xóa dữ liệu',
    expectedOutcome: 'Bật/tắt consent độc lập; export queued→ready/failed/expired; yêu cầu xóa chuyển UD',
  },
  {
    code: 'U08',
    area: 'auth-account-personal',
    routePattern: '/da-luu, /bo-suu-tap-ca-nhan',
    taskRange: '75–76',
    actors: ['UA', 'UB'],
    stateModel: 'S+M',
    inputSummary: 'Mục đã lưu và bộ sưu tập cá nhân riêng tư',
    expectedOutcome: 'Chỉ chủ sở hữu xem/sửa/xóa; xung đột V1→V2 giữ nguyên thay đổi nháp',
  },
  {
    code: 'U09',
    area: 'auth-account-personal',
    routePattern: '/dang-ky, /dang-nhap, /quen-mat-khau, /dat-lai-mat-khau',
    taskRange: '61–65',
    actors: ['G', 'UA'],
    stateModel: 'M',
    inputSummary: 'Chuẩn hóa email, hiện/ẩn mật khẩu, thông báo lỗi trung tính',
    expectedOutcome: 'Trim + lowercase email, không xóa mật khẩu đang gõ khi lỗi mạng',
  },
  {
    code: 'U10',
    area: 'auth-account-personal',
    routePattern: '/xac-minh-email, /admin/mfa',
    taskRange: '63, 66',
    actors: ['U0', 'AP'],
    stateModel: 'S+M',
    inputSummary: 'Dán mã 6 số, khóa tạm khi sai nhiều lần và đổi email nhận mã',
    expectedOutcome: 'Tự lọc ký tự số khi dán, báo thời gian chờ khi vượt số lần thử',
  },
  {
    code: 'U11',
    area: 'auth-account-personal',
    routePattern: '/tai-khoan, /cai-dat/*',
    taskRange: '70–74',
    actors: ['UA', 'AM'],
    stateModel: 'S+M',
    inputSummary: 'Ràng buộc mật khẩu hiện tại, thu hồi phiên khác và giữ phiên hiện tại',
    expectedOutcome: 'Thu hồi phiên khác không làm văng phiên hiện tại; hủy xóa khôi phục UA',
  },
  {
    code: 'C01',
    area: 'auth-account-personal',
    routePattern: '/thu-cung, /thu-cung/them, /thu-cung/[petId], /thu-cung/[petId]/chinh-sua',
    taskRange: '77–81',
    actors: ['G', 'U0', 'UA', 'UB', 'AM'],
    stateModel: 'S+M',
    inputSummary: 'Danh sách, thêm, chi tiết, sửa/xóa hồ sơ thú cưng riêng (PA/PB)',
    expectedOutcome: 'UA quản lý PA; UB/AM mở PA trả not_found/forbidden; xóa pet mặc định tự gỡ defaultPetId',
  },
  {
    code: 'C02',
    area: 'auth-account-personal',
    routePattern: '/thu-cung/[petId]/tai-lieu, /thu-cung/[petId]/chia-se',
    taskRange: '82–83',
    actors: ['UA', 'UB', 'G'],
    stateModel: 'S+M',
    inputSummary: 'Tài liệu riêng và thẻ chia sẻ hồ sơ rút gọn công khai',
    expectedOutcome: 'Upload kiểm MIME/size; thẻ chia sẻ tắt thì khách không xem được và không lộ ghi chú riêng',
  },
  {
    code: 'C03',
    area: 'auth-account-personal',
    routePattern: '/thu-cung/*',
    taskRange: '77–83',
    actors: ['UA'],
    stateModel: 'S+M',
    inputSummary: 'Ngày sinh ước lượng, tuổi tự tính, giới hạn số lượng pet và thu hồi link chia sẻ',
    expectedOutcome: 'Chặn ngày sinh tương lai, thu hồi hoặc tạo mới token chia sẻ có xác nhận',
  },
  {
    code: 'F01',
    area: 'tools-journal-schedule-notifications',
    routePattern: '/cong-cu/* (10 màn công cụ)',
    taskRange: '84–93',
    actors: ['G', 'UA'],
    stateModel: 'S+M',
    inputSummary: 'Bộ 10 công cụ tính toán và đánh giá tham khảo',
    expectedOutcome: 'Chặn số âm/NaN/0, làm tròn nhất quán, luôn hiện miễn trừ trách nhiệm thú y',
  },
  {
    code: 'F02',
    area: 'tools-journal-schedule-notifications',
    routePattern: '/cong-cu/*',
    taskRange: '84–93',
    actors: ['G', 'UA'],
    stateModel: 'S+M',
    inputSummary: 'Tự điền dữ liệu từ PA đang chọn, đổi đơn vị kg↔g, cảnh báo ngưỡng cực trị',
    expectedOutcome: 'Đổi đơn vị không sai số tích lũy, có nút lưu kết quả vào nhật ký PA',
  },
  {
    code: 'T01',
    area: 'tools-journal-schedule-notifications',
    routePattern: '/nhat-ky, /nhat-ky/them, /nhat-ky/[entryId]',
    taskRange: '94–96',
    actors: ['UA', 'UB'],
    stateModel: 'S+M',
    inputSummary: 'Dòng thời gian, thêm mới và chi tiết/sửa/xóa bản ghi nhật ký sức khỏe',
    expectedOutcome: 'Bắt buộc gắn PA của UA; không cho gắn PB của người khác; giữ nháp khi lỗi',
  },
  {
    code: 'T02',
    area: 'tools-journal-schedule-notifications',
    routePattern: '/nhat-ky/can-nang..xet-nghiem',
    taskRange: '97–102',
    actors: ['UA'],
    stateModel: 'S+M',
    inputSummary: 'Các sổ theo dõi chuyên biệt: cân nặng, khẩu phần, tiêm chủng, tẩy ký sinh, thuốc, xét nghiệm',
    expectedOutcome: 'Biểu đồ chỉ hiện điểm hợp lệ; tệp xét nghiệm riêng tư mở qua URL ký ngắn hạn',
  },
  {
    code: 'T03',
    area: 'tools-journal-schedule-notifications',
    routePattern: '/nhat-ky/xuat-bao-cao',
    taskRange: '103',
    actors: ['UA', 'UB'],
    stateModel: 'S+M',
    inputSummary: 'Tóm tắt và xuất báo cáo buổi khám cho thú cưng của chủ sở hữu',
    expectedOutcome: 'Bố cục gọn để in/xuất, không lộ ghi chú nội bộ ngoài phạm vi chọn',
  },
  {
    code: 'T04',
    area: 'tools-journal-schedule-notifications',
    routePattern: '/nhat-ky/*',
    taskRange: '94–102',
    actors: ['UA'],
    stateModel: 'S+M',
    inputSummary: 'Lọc theo khoảng ngày, đổi thú cưng trên thanh lọc, đính kèm nhiều tệp',
    expectedOutcome: 'Chặn từ ngày > đến ngày; xóa bản ghi có đính kèm cảnh báo rõ tệp sẽ bị gỡ',
  },
  {
    code: 'T05',
    area: 'tools-journal-schedule-notifications',
    routePattern: '/nhat-ky/xuat-bao-cao',
    taskRange: '103',
    actors: ['UA'],
    stateModel: 'S',
    inputSummary: 'Tùy chọn ẩn ghi chú nhạy cảm khi in báo cáo buổi khám',
    expectedOutcome: 'Xem trước bản in ẩn menu/footer thừa và giữ phần miễn trừ thú y',
  },
  {
    code: 'J01',
    area: 'tools-journal-schedule-notifications',
    routePattern: '/lich-cham-soc, /lich-cham-soc/them, /lich-cham-soc/[eventId]',
    taskRange: '104–106',
    actors: ['UA', 'UB'],
    stateModel: 'S+M',
    inputSummary: 'Lịch chăm sóc theo tuần/tháng/danh sách, tạo sự kiện đơn/lặp và sửa/xóa',
    expectedOutcome: 'Hiển thị đúng múi giờ Asia/Ho_Chi_Minh; UB không truy cập sự kiện của PA',
  },
  {
    code: 'J02',
    area: 'tools-journal-schedule-notifications',
    routePattern: '/lich-cham-soc/mau-goi-y',
    taskRange: '107–108',
    actors: ['UA'],
    stateModel: 'S+M',
    inputSummary: 'Áp dụng mẫu lịch gợi ý và thao tác occurrence pending/done/snoozed/canceled/missed',
    expectedOutcome: 'Sửa một lần không làm hỏng chuỗi lặp; hiển thị rõ nhãn trạng thái từng lần nhắc',
  },
  {
    code: 'J03',
    area: 'tools-journal-schedule-notifications',
    routePattern: '/thong-bao, /thong-bao/cai-dat',
    taskRange: '109–111',
    actors: ['UA', 'UB'],
    stateModel: 'S+M',
    inputSummary: 'Hộp thư thông báo in-app, đánh dấu đã đọc và cài đặt kênh/giờ yên lặng',
    expectedOutcome: 'Badge giảm chính xác khi đọc; chỉ hiện thông báo thuộc tài khoản đang đăng nhập',
  },
  {
    code: 'J04',
    area: 'tools-journal-schedule-notifications',
    routePattern: '/lich-cham-soc/*',
    taskRange: '104–108',
    actors: ['UA'],
    stateModel: 'S+M',
    inputSummary: 'Lặp cuối tháng (ngày 31 sang tháng thiếu), cảnh báo trùng giờ nhắc và hoàn tác đánh dấu xong',
    expectedOutcome: 'Tự neo về ngày cuối tháng hợp lệ; cho phép hoàn tác về pending',
  },
  {
    code: 'J05',
    area: 'tools-journal-schedule-notifications',
    routePattern: '/thong-bao, /thong-bao/cai-dat',
    taskRange: '109–111',
    actors: ['UA'],
    stateModel: 'S+M',
    inputSummary: 'Giờ yên lặng qua nửa đêm (22:00→06:00), lọc chưa đọc và xóa thông báo cũ',
    expectedOutcome: 'Hiển thị rõ khoảng qua đêm theo giờ Việt Nam; không tắt thông báo bảo mật bắt buộc',
  },
  {
    code: 'L01',
    area: 'community-places-ai',
    routePattern: '/cong-dong, /cong-dong/chu-de/[slug], /cong-dong/bai-dang/[postId]',
    taskRange: '112–114',
    actors: ['G', 'UA', 'UB', 'AM'],
    stateModel: 'S+M',
    inputSummary: 'Bảng tin cộng đồng, chủ đề và chi tiết bài đăng/bình luận',
    expectedOutcome: 'Khách chỉ thấy bài approved; bài hidden/deleted không lộ nội dung công khai',
  },
  {
    code: 'L02',
    area: 'community-places-ai',
    routePattern: '/cong-dong/dang-bai, /thanh-vien/[handle]',
    taskRange: '115–119',
    actors: ['G', 'U0', 'UA', 'UB'],
    stateModel: 'S+M',
    inputSummary: 'Đăng bài cộng đồng, đính kèm ảnh, báo cáo vi phạm và hồ sơ công khai',
    expectedOutcome: 'Strip EXIF GPS mô phỏng; hồ sơ công khai không lộ email hoặc dữ liệu riêng PA/PB',
  },
  {
    code: 'L03',
    area: 'community-places-ai',
    routePattern: '/cong-dong/*',
    taskRange: '112–119',
    actors: ['G', 'UA', 'UB'],
    stateModel: 'S+M',
    inputSummary: 'Giữ nguyên thảo luận khi chủ bài sửa nội dung, chống báo cáo trùng và cảnh báo tự điều trị',
    expectedOutcome: 'Hiện nhãn đã chỉnh sửa; không cho tự chọn câu trả lời hữu ích trên bài của người khác',
  },
  {
    code: 'N01',
    area: 'community-places-ai',
    routePattern: '/dia-diem, /dia-diem/[slug]',
    taskRange: '120–122',
    actors: ['G', 'UA'],
    stateModel: 'S',
    inputSummary: 'Danh bạ địa điểm thú y/cấp cứu/chăm sóc và chi tiết địa điểm',
    expectedOutcome: 'Chỉ hiện địa điểm đã duyệt; lọc cấp cứu 24/7 làm nổi bật số điện thoại & chỉ đường',
  },
  {
    code: 'N02',
    area: 'community-places-ai',
    routePattern: '/dia-diem/de-xuat, /dia-diem/[slug]/nhan-chu-so-huu, /dia-diem/[slug]/danh-gia',
    taskRange: '123–125',
    actors: ['G', 'U0', 'UA'],
    stateModel: 'S+M',
    inputSummary: 'Đề xuất địa điểm mới, nhận chủ sở hữu và gửi đánh giá',
    expectedOutcome: 'Yêu cầu UA đã xác minh; gửi mới ở trạng thái chờ duyệt, chưa hiển thị công khai ngay',
  },
  {
    code: 'N03',
    area: 'community-places-ai',
    routePattern: '/su-kien, /su-kien/[slug]',
    taskRange: '126–127',
    actors: ['G', 'UA'],
    stateModel: 'S+M',
    inputSummary: 'Danh sách và chi tiết sự kiện/hội thảo cộng đồng',
    expectedOutcome: 'Hiển thị đúng giờ Việt Nam; sự kiện đã qua tự khóa nút đăng ký mới',
  },
  {
    code: 'N04',
    area: 'community-places-ai',
    routePattern: '/dia-diem/*, /su-kien/*',
    taskRange: '120–127',
    actors: ['G', 'UA'],
    stateModel: 'S+M',
    inputSummary: 'Địa điểm tạm đóng cửa, chống đánh giá trùng và hủy quan tâm sự kiện',
    expectedOutcome: 'Mỗi tài khoản một đánh giá/địa điểm (cho phép sửa); hủy quan tâm cập nhật ngay',
  },
  {
    code: 'I01',
    area: 'community-places-ai',
    routePattern: '/tro-ly-ai, /tro-ly-ai/[conversationId]',
    taskRange: '128–132',
    actors: ['G', 'U0', 'UA', 'UB'],
    stateModel: 'S+M',
    inputSummary: 'Trợ lý AI: chọn ngữ cảnh PA, stream trả lời, dừng tạo, nguồn trích dẫn và kill-switch',
    expectedOutcome: 'Miễn trừ thú y cố định; UB không đọc được hội thoại của UA; kill-switch khóa gửi mới',
  },
  {
    code: 'I02',
    area: 'community-places-ai',
    routePattern: '/tro-ly-ai, /tro-ly-ai/[conversationId]',
    taskRange: '128–132',
    actors: ['UA'],
    stateModel: 'S+M',
    inputSummary: 'Tự làm sạch ngữ cảnh khi đổi PA→PB hoặc xóa hội thoại, cảnh báo câu hỏi cấp cứu',
    expectedOutcome: 'Hiện hộp cảnh báo cấp cứu đầu khung trả lời; không gửi thông tin pet khi tắt aiConsent',
  },
  {
    code: 'A01',
    area: 'admin-data-seo-qa',
    routePattern: '/admin',
    taskRange: '133–134',
    actors: ['G', 'UA', 'AP', 'AM'],
    stateModel: 'S',
    inputSummary: 'Shell quản trị và tổng quan vận hành',
    expectedOutcome: 'G→/dang-nhap; UA→403; AP→/admin/mfa; chỉ AM vào được và ẩn mục thiếu capability',
  },
  {
    code: 'A02',
    area: 'admin-data-seo-qa',
    routePattern: '/admin/bai-viet*, /admin/chuyen-muc-the, /admin/tac-gia-nguoi-duyet',
    taskRange: '135–139',
    actors: ['AM'],
    stateModel: 'S+M',
    inputSummary: 'CMS bài viết, lịch biên tập, chuyên mục/thẻ, tác giả/người duyệt và xem trước an toàn',
    expectedOutcome: 'Xuất bản bài sức khỏe đòi người duyệt + nguồn; xung đột V1→V2 giữ bản nháp',
  },
  {
    code: 'A03',
    area: 'admin-data-seo-qa',
    routePattern: '/admin/giong, /admin/thuc-pham, /admin/trieu-chung-so-cuu, /admin/cong-cu',
    taskRange: '140–143',
    actors: ['AM'],
    stateModel: 'S+M',
    inputSummary: 'Quản trị thư viện giống, thực phẩm, triệu chứng/sơ cứu và tham số công cụ',
    expectedOutcome: 'Chặn ngưỡng min >= max hoặc hệ số <= 0 trước khi lưu',
  },
  {
    code: 'A04',
    area: 'admin-data-seo-qa',
    routePattern: '/admin/san-pham, /admin/bo-suu-tap, /admin/lien-ket-tiep-thi',
    taskRange: '144–146',
    actors: ['AM'],
    stateModel: 'S+M',
    inputSummary: 'Quản trị sản phẩm, bộ sưu tập và kiểm tra liên kết tiếp thị',
    expectedOutcome: 'Chỉ nhận URL http/https hợp lệ; buộc bật công bố affiliate trước khi xuất bản',
  },
  {
    code: 'A05',
    area: 'admin-data-seo-qa',
    routePattern: '/admin/kiem-duyet*',
    taskRange: '147–150',
    actors: ['AM'],
    stateModel: 'S+M',
    inputSummary: 'Hàng đợi kiểm duyệt bài đăng, bình luận, báo cáo và mẫu lý do xử lý',
    expectedOutcome: 'Ghi lý do bắt buộc khi ẩn/từ chối/khóa tạm; thao tác hàng loạt báo số mục thành công',
  },
  {
    code: 'A06',
    area: 'admin-data-seo-qa',
    routePattern: '/admin/dia-diem*, /admin/su-kien',
    taskRange: '151–153',
    actors: ['AM'],
    stateModel: 'S+M',
    inputSummary: 'Quản trị địa điểm, xác minh chủ sở hữu và sự kiện',
    expectedOutcome: 'Duyệt nhận chủ sở hữu đòi kiểm danh sách minh chứng và ghi chú thẩm định',
  },
  {
    code: 'A07',
    area: 'admin-data-seo-qa',
    routePattern: '/admin/nguoi-dung*',
    taskRange: '154–155',
    actors: ['AM'],
    stateModel: 'S+M',
    inputSummary: 'Danh sách người dùng, khóa/mở khóa và tra cứu hỗ trợ siêu dữ liệu',
    expectedOutcome: 'Không tự hiển thị hồ sơ PA/PB, tài liệu riêng hoặc nội dung chat AI của người dùng',
  },
  {
    code: 'A08',
    area: 'admin-data-seo-qa',
    routePattern: '/admin/phan-quyen, /admin/nhat-ky-kiem-toan, /admin/bao-mat',
    taskRange: '156–158',
    actors: ['AM'],
    stateModel: 'S+M',
    inputSummary: 'Ma trận phân quyền, nhật ký kiểm toán (chỉ đọc) và phiên quản trị/bảo mật',
    expectedOutcome: 'Audit log không có nút sửa/xóa; chặn tự gỡ quyền quản trị cuối cùng của chính mình',
  },
  {
    code: 'A09',
    area: 'admin-data-seo-qa',
    routePattern: '/admin/ban-tin, /admin/chien-dich-thong-bao, /admin/lien-he-hop-tac',
    taskRange: '159–161',
    actors: ['AM'],
    stateModel: 'S+M',
    inputSummary: 'Quản trị bản tin, chiến dịch thông báo và hộp thư liên hệ/hợp tác/báo lỗi',
    expectedOutcome: 'Gửi thử trước khi phát hành chiến dịch; không lộ danh sách email đầy đủ trên bảng mặc định',
  },
  {
    code: 'A10',
    area: 'admin-data-seo-qa',
    routePattern: '/admin/tro-ly-ai*',
    taskRange: '162–164',
    actors: ['AM'],
    stateModel: 'S+M',
    inputSummary: 'Cấu hình trợ lý AI, kill-switch, nguồn tri thức RAG và nhật ký an toàn ẩn danh',
    expectedOutcome: 'Nhật ký an toàn đã che PII; bật kill-switch cập nhật ngay trạng thái khóa tại /tro-ly-ai',
  },
  {
    code: 'A11',
    area: 'admin-data-seo-qa',
    routePattern: '/admin/phan-tich*, /admin/chuyen-huong-seo, /admin/he-thong, /admin/tac-vu-nen, /admin/cai-dat',
    taskRange: '165–168, 170–171',
    actors: ['AM'],
    stateModel: 'S+M',
    inputSummary: 'Phân tích nội dung/tìm kiếm, chuyển hướng SEO, sức khỏe hệ thống, tác vụ nền và cài đặt',
    expectedOutcome: 'Chặn vòng lặp redirect A→A / A→B→A; trang cài đặt chỉ hiện nhãn trạng thái, không lộ secret',
  },
  {
    code: 'A12',
    area: 'admin-data-seo-qa',
    routePattern: '/admin/yeu-cau-du-lieu',
    taskRange: '172',
    actors: ['AM'],
    stateModel: 'S+M',
    inputSummary: 'Xử lý yêu cầu xuất/xóa dữ liệu cá nhân trong quản trị',
    expectedOutcome: 'Chỉ hiển thị siêu dữ liệu trạng thái yêu cầu, không cho admin tải gói dữ liệu riêng của user',
  },
  {
    code: 'A13',
    area: 'admin-data-seo-qa',
    routePattern: '/admin/bai-viet*, /admin/chuyen-muc-the, /admin/chuyen-huong-seo',
    taskRange: '135–138, 167',
    actors: ['AM'],
    stateModel: 'S+M',
    inputSummary: 'Gợi ý tạo redirect 301 khi đổi slug bài đã xuất bản và cảnh báo gộp thẻ',
    expectedOutcome: 'Đổi slug bài PUB tự gợi ý tạo redirect; xóa chuyên mục đòi chọn chuyên mục đích',
  },
  {
    code: 'A14',
    area: 'admin-data-seo-qa',
    routePattern: '/admin/kiem-duyet*, /admin/nguoi-dung*, /admin/cai-dat',
    taskRange: '147–150, 154–155, 171',
    actors: ['AM'],
    stateModel: 'S+M',
    inputSummary: 'Xung đột quyết định kiểm duyệt đồng thời và xác nhận kép chế độ bảo trì',
    expectedOutcome: 'Báo rõ mục đã được xử lý bởi người khác; bật bảo trì đòi xác nhận kép',
  },
  {
    code: 'Q01',
    area: 'admin-data-seo-qa',
    routePattern: 'Toàn bộ route trong SITEMAP + /preview',
    taskRange: '173–177',
    actors: ['G', 'U0', 'UA', 'UB', 'AP', 'AM', 'UL', 'UD'],
    stateModel: 'S+M',
    inputSummary:
      'SEO metadata, JSON-LD, trạng thái rỗng/lỗi/loading, a11y, responsive 360px/768px/1280px và nghiệm thu tổng thể',
    expectedOutcome: '74 mã ca P01–Q01 đạt đầy đủ, không gọi API thật, sẵn sàng nghiệm thu cuối Phần I',
  },
] as const;
