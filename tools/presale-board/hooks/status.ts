import type { CheckSummary, Files, Health, Params, PlanTotals, Project, ProposalSummary, ReviewSummary, Todo } from '../types'

/** Tên file trong projects/<kh>/ ứng với từng khóa của Files. */
export const FILE_NAMES: Record<Exclude<keyof Files, 'input'>, string> = {
  params: '00-params.txt',
  requirements: '01-requirements.md',
  proposalMd: '02-proposal.md',
  proposalDocx: '02-proposal.docx',
  wbsMd: '03-wbs.md',
  wbsCsv: '03-wbs.csv',
  plan: '04-master-plan.xlsx',
  check: '04-check.txt',
  review: '02-review.md',
  autoSummary: '00-auto-summary.md',
}

export type StepState = 'done' | 'stale' | 'fail' | 'todo'
export type Step = { label: string; state: StepState; note?: string }
export type Next = { label: string; prompt?: string }

const newer = (a?: number, b?: number) => a !== undefined && b !== undefined && a > b + 1000

/** Sáu bước của quy trình hiện tại, kèm trạng thái và lý do khi cần làm lại. */
export const buildSteps = (p: Project): Step[] => {
  const f = p.files
  const h = p.health
  const planStale = newer(f.wbsCsv, f.plan) || newer(f.params, f.plan)
  const checkStale = newer(f.wbsCsv, f.check) || newer(f.params, f.check) || newer(f.proposalMd, f.check)
  const review = h.review
  return [
    { label: 'Tài liệu', state: p.inputCount > 0 ? 'done' : 'todo' },
    {
      label: 'Yêu cầu',
      state: !f.requirements ? 'todo' : h.gapsOpen > 0 ? 'stale' : 'done',
      note: f.requirements && h.gapsOpen > 0 ? `${h.gapsOpen} khoảng trống chưa chốt` : undefined,
    },
    {
      label: 'Proposal',
      state: !f.proposalDocx ? (f.proposalMd ? 'stale' : 'todo') : newer(f.proposalMd, f.proposalDocx) ? 'stale' : 'done',
      note: f.proposalDocx && newer(f.proposalMd, f.proposalDocx) ? '.md sửa sau khi xuất .docx' : undefined,
    },
    {
      label: 'Review',
      state: !review ? 'todo' : review.concluded ? 'done' : review.critical > 0 || review.high > 0 ? 'fail' : 'stale',
    },
    { label: 'WBS', state: f.wbsMd ? 'done' : 'todo' },
    {
      label: 'Plan',
      state: !f.plan ? 'todo' : planStale || checkStale ? 'stale' : p.check.result === 'fail' ? 'fail' : p.check.result === 'pass' ? 'done' : 'stale',
      note: planStale ? 'WBS/params sửa sau khi dựng Excel' : checkStale ? 'kết quả kiểm tra cũ hơn WBS/proposal' : undefined,
    },
  ]
}

/** Việc tiếp theo, và câu lệnh điền sẵn vào ô chat. */
export const nextStep = (p: Project): Next => {
  const [input, req, proposal, review, wbs, plan] = buildSteps(p)
  const kh = p.name
  if (input?.state !== 'done') return { label: `Bỏ RFP/BRD vào projects/${kh}/01-input/` }
  if (req?.state !== 'done') return { label: req?.state === 'todo' ? 'Đọc tài liệu, tổng hợp yêu cầu' : 'Chốt khoảng trống còn lại', prompt: `/write-proposal ${kh}` }
  if (proposal?.state === 'todo') return { label: 'Viết proposal', prompt: `/write-proposal ${kh}` }
  if (review?.state !== 'done') return { label: 'Chạy vòng review tiếp', prompt: `Chạy vòng review tiếp cho ${kh} (bước 7 /write-proposal)` }
  if (proposal?.state === 'stale') return { label: 'Xuất lại proposal .docx', prompt: `Xuất lại 02-proposal.docx cho ${kh}` }
  if (wbs?.state !== 'done') return { label: 'Phân tích WBS', prompt: `/analyze-proposal ${kh}` }
  if (plan?.state !== 'done') return { label: plan?.state === 'fail' ? 'Sửa plan theo lỗi kiểm tra' : 'Lên master plan', prompt: `/master-plan ${kh}` }
  return { label: 'Xong, sẵn sàng gửi khách' }
}

/** Đọc 01-requirements.md: số dòng R, ⚑, khoảng trống mục 9 chưa chốt, số quyết định [C]/[D]. */
export const parseRequirements = (text: string | undefined): Omit<Health, 'review' | 'placeholders'> => {
  const t = text ?? ''
  const rows = t.split('\n').filter(l => /^\| R\d+ \|/.test(l))
  const gapStart = t.indexOf('### 9.')
  const gapEnd = gapStart < 0 ? -1 : t.indexOf('\n## ', gapStart)
  const gaps = gapStart < 0 ? [] : t.slice(gapStart, gapEnd < 0 ? undefined : gapEnd).split('\n').filter(l => /^\d+\.\s/.test(l))
  // điểm đã xử lý: gạch bỏ (~~), đã thành giả định, hoặc gắn [C]/[D]
  const open = gaps.filter(l => !/~~|^\d+\.\s+Giả định|\[C \d|\[D \d/.test(l))
  return {
    reqRows: rows.length,
    flags: rows.filter(l => l.includes('⚑')).length,
    gapsOpen: open.length,
    gapsTotal: gaps.length,
    decided: (t.match(/\[C \d/g) ?? []).length,
    drafted: (t.match(/\[D \d/g) ?? []).length,
  }
}

/** Đọc vòng cuối của 02-review.md: "## Vòng n" … "CÒN LẠI: CRITICAL x · HIGH y" … "KẾT LUẬN: ĐẠT". */
export const parseReview = (text: string | undefined): ReviewSummary | undefined => {
  if (!text) return undefined
  const rounds = text.split(/^## Vòng\s*/m).slice(1)
  if (rounds.length === 0) return undefined
  const last = rounds[rounds.length - 1] ?? ''
  const left = last.match(/CÒN LẠI:\s*CRITICAL\s*(\d+)\s*·\s*HIGH\s*(\d+)/)
  return {
    round: Number(last.match(/^\d+/)?.[0] ?? rounds.length),
    critical: left ? Number(left[1]) : -1,
    high: left ? Number(left[2]) : -1,
    concluded: text.includes('KẾT LUẬN: ĐẠT'),
  }
}

/** Số ô […] trong proposal chờ thông tin thật (hồ sơ năng lực, CV, giá, đầu mối). */
export const countPlaceholders = (text: string | undefined): number => (text?.match(/\[…\]/g) ?? []).length

/** Số ngày từ hôm nay tới ngày ISO (âm = đã quá). */
export const daysLeft = (iso: string | undefined, now: number): number | undefined => {
  const m = iso?.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return undefined
  const due = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  const today = new Date(now)
  return Math.round((due - Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())) / 86_400_000)
}

/** Việc thật sự cần anh: hạn nộp, review còn CRITICAL, plan chưa đạt, quyết định tự chốt chờ duyệt. Gấp lên đầu. */
// ponytail: khoảng trống, file cũ, ô […] đã hiện ở pipeline và bảng Thông số, không lặp lại ở đây
export const todos = (list: Project[], now: number): Todo[] =>
  list.flatMap(p => {
    const kh = p.name
    const h = p.health
    const out: Todo[] = []
    const done = nextStep(p).prompt === undefined && p.inputCount > 0
    const left = daysLeft(p.params.submitBy, now)
    if (left !== undefined && !done && left <= 7) {
      out.push({ customer: kh, level: 'urgent', text: left < 0 ? `Quá hạn nộp ${-left} ngày (${shortDate(p.params.submitBy)})` : `Nộp hồ sơ còn ${left} ngày (${shortDate(p.params.submitBy)})` })
    }
    if (h.review && !h.review.concluded && h.review.critical > 0) {
      out.push({ customer: kh, level: 'urgent', text: `Review còn ${h.review.critical} CRITICAL, ${h.review.high} HIGH`, prompt: `Chạy vòng review tiếp cho ${kh} (bước 7 /write-proposal)` })
    }
    if (p.check.result === 'fail') {
      out.push({ customer: kh, level: 'urgent', text: `Plan chưa đạt: ${p.check.firstFail ?? 'xem 04-check.txt'}`, prompt: `/master-plan ${kh}` })
    }
    if (h.drafted > 0) {
      out.push({ customer: kh, level: 'warn', text: `Duyệt ${h.drafted} quyết định tự chốt [D]`, open: `projects/${kh}/${p.files.autoSummary ? FILE_NAMES.autoSummary : FILE_NAMES.requirements}` })
    }
    return out
  }).sort((a, b) => (a.level === b.level ? 0 : a.level === 'urgent' ? -1 : 1))

/** Tóm tắt 04-check.txt do scripts/check_plan.py ghi. */
export const parseCheck = (text: string | undefined): CheckSummary => {
  if (text === undefined) return { result: 'none', failCount: 0, warnCount: 0, milestones: [], team: {} }
  const lines = text.split('\n')
  const fails = lines.filter(l => l.startsWith('FAIL'))
  const milestones = lines.filter(l => l.startsWith('MỐC ')).map(l => {
    const [wbs, name, start, finish, md] = l.slice(4).split('|').map(x => x.trim())
    return { wbs: wbs ?? '', name: name ?? '', start: start ?? '', finish: finish ?? '', md: Number(md) || 0 }
  })
  const teamLine = lines.find(l => l.startsWith('ĐỘI '))?.slice(4).replace(/\(.*$/, '') ?? ''
  const team = Object.fromEntries(teamLine.split(',').map(x => x.trim().split(/\s+/)).filter(x => x.length === 2).map(([r, n]) => [r ?? '', Number(n)]))
  return {
    milestones,
    team,
    result: text.includes('KẾT QUẢ: ĐẠT') ? 'pass' : text.includes('KHÔNG ĐẠT') ? 'fail' : 'none',
    firstFail: fails[0]?.replace(/^FAIL\s+/, ''),
    failCount: fails.length,
    warnCount: lines.filter(l => l.startsWith('WARN')).length,
    headline: lines.find(l => l.startsWith('Plan ')),
  }
}

/** Đọc các dòng "khóa: giá trị" cần hiển thị trong 00-params.txt. */
export const parseParams = (text: string | undefined): Params => {
  const get = (key: string) => {
    const v = text?.match(new RegExp(`^${key}:([^#\\n]*)`, 'm'))?.[1]?.trim()
    return v ? v : undefined
  }
  return { kickoff: get('kickoff'), deadline: get('deadline'), proposalMd: get('proposal_md'), teamMax: get('team_max'), submitBy: get('submit_by') }
}

/** "PM=1, BA=2" → { PM: 1, BA: 2 } */
export const parseTeamMax = (text: string | undefined): Record<string, number> =>
  Object.fromEntries((text ?? '').split(',').map(s => s.split('=').map(x => x.trim())).filter(([k, v]) => k && v).map(([k, v]) => [k ?? '', Number(v)]))

/** Dòng đầu 04-check.txt: "Plan 2026-11-02 → 2027-06-29 (164 ngày làm việc), 806.2 MD: PM 131.2, BA 116.0" */
export const parseHeadline = (line: string | undefined): PlanTotals | undefined => {
  const m = line?.match(/^Plan (\S+) → (\S+) \((\d+) ngày[^)]*\), ([\d.]+) MD(?::\s*(.*))?/)
  if (!m) return undefined
  const md = Object.fromEntries((m[5] ?? '').split(',').map(x => x.trim().split(/\s+/)).filter(x => x.length === 2).map(([r, v]) => [r ?? '', Number(v)]))
  return { start: m[1] ?? '', finish: m[2] ?? '', days: Number(m[3]), totalMd: Number(m[4]), md }
}

/** Tên giải pháp (subtitle ở front matter) và câu đầu tiên có chữ "đề xuất" trong thân bài. */
export const parseProposal = (text: string | undefined): ProposalSummary => {
  const t = text ?? ''
  const solution = t.match(/^subtitle:\s*"?([^"\n]+)"?/m)?.[1]?.trim()
  const body = t.replace(/^---\n[\s\S]*?\n---\n/, '')
  const para = body.split('\n').find(l => /đề xuất/i.test(l) && !/^\s*(#|\||[-*] |>)/.test(l))
  const pitch = para?.replace(/\*\*/g, '').match(/[^.!?]*đề xuất[^.!?]*[.!?]?/i)?.[0]?.trim()
  return { solution, pitch }
}

/** "5 phút", "3 giờ", "2 ngày" trước. */
export const ago = (ms: number | undefined, now: number): string => {
  if (ms === undefined) return '—'
  const min = Math.max(0, Math.round((now - ms) / 60000))
  if (min < 1) return 'vừa xong'
  if (min < 60) return `${min} phút`
  if (min < 60 * 24) return `${Math.round(min / 60)} giờ`
  return `${Math.round(min / 1440)} ngày`
}

/** 2026-11-02 → 02/11/26 */
export const shortDate = (iso: string | undefined): string => {
  const m = iso?.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  return m ? `${m[3]}/${m[2]}/${m[1]?.slice(2)}` : iso ?? '?'
}

/** Tên thư mục khách hợp lệ cho /presale new: chữ thường, số, gạch ngang. */
export const isValidName = (name: string): boolean => /^[a-z0-9][a-z0-9-]{0,40}$/.test(name)
