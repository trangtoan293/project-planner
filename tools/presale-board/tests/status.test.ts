import { expect, test } from 'claude-code/testing'

import type { Project } from '../types'
import {
  ago, buildSteps, countPlaceholders, daysLeft, isValidName, nextStep, parseCheck, parseParams, parseRequirements, parseReview,
  shortDate, todos,
} from '../hooks/status'

const T = 1_800_000_000_000
const clean = { reqRows: 201, flags: 21, gapsOpen: 0, gapsTotal: 13, decided: 6, drafted: 0, placeholders: 0 }
const done: Project = {
  name: 'kha',
  inputCount: 2,
  files: { input: T, params: T, requirements: T, proposalMd: T, proposalDocx: T + 10, review: T + 15, wbsMd: T + 20, wbsCsv: T + 30, plan: T + 40, check: T + 50 },
  params: {},
  check: { result: 'pass', failCount: 0, warnCount: 0 },
  health: { ...clean, review: { round: 2, critical: 0, high: 0, concluded: true } },
}

test('bước tiếp theo đi đúng thứ tự quy trình 6 bước', async () => {
  expect(nextStep({ ...done, inputCount: 0 }).prompt).toBe(undefined)
  expect(nextStep({ ...done, files: { ...done.files, requirements: undefined } }).prompt).toBe('/write-proposal kha')
  expect(nextStep({ ...done, health: { ...done.health, gapsOpen: 3 } }).label).toBe('Chốt khoảng trống còn lại')
  expect(nextStep({ ...done, files: { ...done.files, proposalDocx: undefined, proposalMd: undefined } }).prompt).toBe('/write-proposal kha')
  expect(nextStep({ ...done, health: { ...done.health, review: { round: 1, critical: 2, high: 5, concluded: false } } }).prompt)
    .toBe('Chạy vòng review tiếp cho kha (bước 7 /write-proposal)')
  expect(nextStep({ ...done, files: { ...done.files, wbsMd: undefined } }).prompt).toBe('/analyze-proposal kha')
  expect(nextStep({ ...done, files: { ...done.files, plan: undefined } }).prompt).toBe('/master-plan kha')
  expect(nextStep({ ...done, check: { ...done.check, result: 'fail' } }).label).toBe('Sửa plan theo lỗi kiểm tra')
  expect(nextStep(done).label.startsWith('Xong')).toBe(true)
})

test('phát hiện file đã cũ (sửa nguồn sau khi sinh kết quả)', async () => {
  const docxOld = buildSteps({ ...done, files: { ...done.files, proposalMd: T + 60_000 } })
  expect(docxOld.map(s => s.label)).toEqual(['Tài liệu', 'Yêu cầu', 'Proposal', 'Review', 'WBS', 'Plan'])
  expect(docxOld[2]?.state).toBe('stale')
  const planOld = buildSteps({ ...done, files: { ...done.files, params: T + 60_000 } })
  expect(planOld[5]?.state).toBe('stale')
  expect(nextStep({ ...done, files: { ...done.files, wbsCsv: T + 60_000 } }).prompt).toBe('/master-plan kha')
})

test('đọc sức khỏe hồ sơ: yêu cầu, review, ô […]', async () => {
  const req = [
    '### 9. Khoảng trống', '1. ~~#33–40~~ → đã chốt', '2. Giả định: nguồn ngoài', '3. ⚑ **CDC** chưa rõ', '4. Hiệu năng [C 14/10]', '5. Tiến độ [D 14/10]',
    '## Thuật ngữ', '- [C 14/10] K8S đáp ứng', '| R001 | a | Kết quả | 1 | Mục I.1 | |', '| R002 | ⚑ b | Chức năng | 2 | Mục II.1 | |',
  ].join('\n')
  expect(parseRequirements(req)).toEqual({ reqRows: 2, flags: 1, gapsOpen: 1, gapsTotal: 5, decided: 2, drafted: 1 })
  const review = '# Review\n## Vòng 1\nCÒN LẠI: CRITICAL 6 · HIGH 10\n## Vòng 2\n| x |\nCÒN LẠI: CRITICAL 0 · HIGH 1\n'
  expect(parseReview(review)).toEqual({ round: 2, critical: 0, high: 1, concluded: false })
  expect(parseReview('# Review\n## Vòng 1 (14/10)\nbảng cũ\nKẾT LUẬN: ĐẠT')).toEqual({ round: 1, critical: -1, high: -1, concluded: true })
  expect(parseReview(undefined)).toBe(undefined)
  expect(countPlaceholders('Tên […], CV […], giá […]')).toBe(3)
})

test('việc cần anh: gấp nhất lên đầu, đủ các loại', async () => {
  const NOW = Date.UTC(2026, 9, 14, 3)
  const khc: Project = {
    ...done, name: 'khc',
    files: { ...done.files, autoSummary: T },
    params: { submitBy: '2026-10-17' },
    check: { result: 'fail', failCount: 1, warnCount: 0, firstFail: '1.3 trễ' },
    health: { ...clean, drafted: 11, gapsOpen: 2, placeholders: 32, review: { round: 1, critical: 5, high: 4, concluded: false } },
  }
  const list = todos([done, khc], NOW)
  expect(list.map(t => t.level)).toEqual(['urgent', 'urgent', 'urgent', 'warn', 'warn', 'info'])
  expect(list[0]?.text).toBe('Nộp hồ sơ còn 3 ngày (17/10/26)')
  expect(list.find(t => t.text.startsWith('Duyệt 11'))?.open).toBe('projects/khc/00-auto-summary.md')
  expect(list.find(t => t.text.startsWith('Điền 32'))?.open).toBe('projects/khc/02-proposal.md')
  expect(todos([done], NOW)).toEqual([])                              // khách đã xong: không có việc
  expect(daysLeft('2026-10-10', NOW)).toBe(-4)
})

test('đọc 04-check.txt và 00-params.txt', async () => {
  const c = parseCheck('Plan 2026-11-02 → 2027-01-05 (40 ngày), 120.0 MD: …\nWARN a\nFAIL 1.2 trễ\nFAIL 1.3 sai\nKẾT QUẢ: KHÔNG ĐẠT\n')
  expect(c.result).toBe('fail')
  expect(c.firstFail).toBe('1.2 trễ')
  expect(c.failCount).toBe(2)
  expect(c.warnCount).toBe(1)
  expect(c.headline?.startsWith('Plan 2026-11-02')).toBe(true)
  expect(parseCheck(undefined).result).toBe('none')
  const p = parseParams('customer: KHA\nkickoff: 2026-11-02   # ghi chú\ndeadline:\nproposal_md: 845\n')
  expect(p.kickoff).toBe('2026-11-02')
  expect(p.deadline).toBe(undefined)
  expect(p.proposalMd).toBe('845')
  expect(parseParams('submit_by: 2026-10-20\n').submitBy).toBe('2026-10-20')
})

test('định dạng thời gian và tên khách', async () => {
  expect(ago(T - 5 * 60000, T)).toBe('5 phút')
  expect(ago(T - 3 * 86400000, T)).toBe('3 ngày')
  expect(ago(undefined, T)).toBe('—')
  expect(shortDate('2026-11-02')).toBe('02/11/26')
  expect(isValidName('khb-dwh')).toBe(true)
  expect(isValidName('../etc')).toBe(false)
})
