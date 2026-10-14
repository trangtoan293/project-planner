/** Thời điểm sửa (ms) của các file trong projects/<kh>/; thiếu = chưa có file. */
export type Files = {
  input?: number
  params?: number
  requirements?: number
  proposalMd?: number
  proposalDocx?: number
  wbsMd?: number
  wbsCsv?: number
  plan?: number
  check?: number
  review?: number
  autoSummary?: number
}

export type Params = {
  kickoff?: string
  deadline?: string
  proposalMd?: string
  teamMax?: string
  /** Hạn nộp hồ sơ / gửi proposal cho khách (submit_by trong 00-params.txt). */
  submitBy?: string
}

export type CheckSummary = {
  result: 'pass' | 'fail' | 'none'
  firstFail?: string
  failCount: number
  warnCount: number
  /** Dòng tóm tắt đầu file: "Plan 2026-11-02 → 2027-06-30 (…), 845.0 MD: …" */
  headline?: string
}

/** Vòng review cuối trong 02-review.md; critical/high = -1 khi vòng đó chưa ghi dòng "CÒN LẠI". */
export type ReviewSummary = { round: number; critical: number; high: number; concluded: boolean }

/** Sức khỏe hồ sơ: những con số anh cần để quyết định việc tiếp theo. */
export type Health = {
  /** Số dòng yêu cầu R và số dòng gắn ⚑ trong 01-requirements.md. */
  reqRows: number
  flags: number
  /** Khoảng trống ở mục 9 chưa chốt / tổng số điểm ở mục 9. */
  gapsOpen: number
  gapsTotal: number
  /** Số quyết định anh đã chốt [C] và tự chốt chờ duyệt [D]. */
  decided: number
  drafted: number
  review?: ReviewSummary
  /** Số ô […] trong 02-proposal.md chờ thông tin thật khi nộp. */
  placeholders: number
}

export type Project = {
  name: string
  inputCount: number
  files: Files
  params: Params
  check: CheckSummary
  health: Health
}

/** Một việc cần anh làm, gom từ mọi khách, xếp theo mức gấp. */
export type Todo = {
  customer: string
  level: 'urgent' | 'warn' | 'info'
  text: string
  /** Câu lệnh điền sẵn vào ô chat, hoặc file mở bằng ứng dụng mặc định (đường dẫn tương đối gốc repo). */
  prompt?: string
  open?: string
}

declare module 'claude-code' {
  interface PluginState {
    'presale-board': { projects: Project[]; selected: string; busy: string }
  }
}
