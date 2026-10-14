import { expect, test } from 'claude-code/testing'

// Ổ đĩa giả của repo project-planner: kha đã lên plan nhưng kiểm tra KHÔNG ĐẠT, khb mới tạo.
const NOW = Date.now()
const FILES: Record<string, { text: string; mtimeMs: number }> = {
  'templates/00-params.txt': { text: 'customer: KHA\n', mtimeMs: NOW },
  'projects/kha/00-params.txt': { text: 'kickoff: 2026-11-02\ndeadline: 2027-06-30\nproposal_md: 845\nsubmit_by: 2020-01-01\n', mtimeMs: NOW - 9e6 },
  'projects/kha/01-requirements.md': { text: '### 9. Khoảng trống\n1. Giả định: x\n2. CDC [D 14/10]\n## Thuật ngữ\n| R001 | ⚑ a | x | 1 | Mục II.1 | |\n', mtimeMs: NOW - 9e6 },
  'projects/kha/02-review.md': { text: '## Vòng 2\nCÒN LẠI: CRITICAL 0 · HIGH 0\nKẾT LUẬN: ĐẠT\n', mtimeMs: NOW - 7.5e6 },
  'projects/kha/01-input/rfp.pdf': { text: '', mtimeMs: NOW - 9e6 },
  'projects/kha/02-proposal.md': { text: 'Tên […], CV […]', mtimeMs: NOW - 8e6 },
  'projects/kha/02-proposal.docx': { text: '', mtimeMs: NOW - 7e6 },
  'projects/kha/03-wbs.md': { text: '', mtimeMs: NOW - 6e6 },
  'projects/kha/03-wbs.csv': { text: '', mtimeMs: NOW - 5e6 },
  'projects/kha/04-master-plan.xlsx': { text: '', mtimeMs: NOW - 4e6 },
  'projects/kha/04-check.txt': {
    text: 'Plan 2026-11-02 → 2027-07-02 (170 ngày), 850.0 MD\nFAIL 1.3 kết thúc 2027-07-02 sau deadline 2027-06-30\nKẾT QUẢ: KHÔNG ĐẠT\n',
    mtimeMs: NOW - 3e6,
  },
  'projects/khb/01-input/.keep': { text: '', mtimeMs: NOW },
}
// plugin gọi fs bằng đường dẫn tuyệt đối theo gốc repo; ổ giả dùng đường dẫn tương đối từ gốc repo
const rel = (path: string) => path.replace(/^.*?\/(?=(projects|templates)(\/|$))/, '')
const isDir = (path: string) => Object.keys(FILES).some(f => f.startsWith(`${path}/`))

test('bảng hiện pipeline, sức khỏe hồ sơ, việc cần anh; phím chọn khách và điền lệnh', async ($, on) => {
  const filled: string[] = []
  // phiên đã đổi thư mục sang chỗ khác: bảng vẫn phải đọc projects/ theo vị trí plugin
  on('session.root', async () => ({ value: '/elsewhere' }))
  on('session.cwd', async () => ({ value: '/elsewhere' }))
  on('fs.exists', async (_$, e) => ({ value: rel(e.path) in FILES || isDir(rel(e.path)) }))
  on('fs.read', async (_$, e) => ({ value: FILES[rel(e.path)]?.text ?? '' }))
  on('fs.list', async (_$, e) => {
    const dir = rel(e.path)
    const names = new Set(Object.keys(FILES).filter(f => f.startsWith(`${dir}/`)).map(f => f.slice(dir.length + 1).split('/')[0] ?? ''))
    const value = [...names].map(name => {
      const file = FILES[`${dir}/${name}`]
      return { name, kind: file ? 'file' : 'dir', size: 0, mtimeMs: file?.mtimeMs ?? 0, isLink: false } as const
    })
    return { value }
  })
  on('ui.open', async () => ({ value: { isPlaced: true } as const }))
  on('prompt.fill', async (_$, e) => {
    filled.push(e.text)
    return { isFilled: true }
  })

  const statuses: string[] = []
  on('ui.status', async (_$, e) => { statuses.push(JSON.stringify(e)); return { value: undefined } })
  await $.command.run({
    command: 'presale', args: 'kha', origin: { kind: 'composer' }, presentation: { isFullscreen: false, columns: 120 },
  })
  expect(statuses).toEqual([])
  const ui = await $.ui.mount({
    plugin: 'presale-board', surface: 'terminal', component: 'Pane', requestId: 'presale-board',
    props: { title: 'Presales', isFocused: true, bodyColumns: 72, placement: 'dock', scroll: { offset: 0, bodyRows: 60 }, view: {} },
    viewport: { columns: 72, rows: 60 },
  })

  const drawn = JSON.stringify(await ui.drawn())
  expect(drawn).toContain('KHA')
  expect(drawn).toContain('02/11/26')              // kickoff từ 00-params.txt
  expect(drawn).toContain('sau deadline')          // dòng FAIL đầu tiên
  expect(drawn).toContain('1 dòng R · ⚑ 1')        // sức khỏe: yêu cầu
  expect(drawn).toContain('1 tự chốt [D] chờ duyệt')
  expect(drawn).toContain('KẾT LUẬN: ĐẠT')
  expect(drawn).toContain('2 ô […] cần điền khi nộp')
  expect(drawn).toContain('VIỆC CẦN ANH')
  expect(drawn).toContain('Quá hạn nộp')           // submit_by đã qua
  expect(drawn).toContain('Review')                // bước mới trong pipeline
  expect(drawn).toContain('Bỏ RFP/BRD vào projects/khb/01-input/')

  await ui.press({ key: 'next' })
  expect(filled).toEqual(['/master-plan kha'])

  await ui.press({ key: 'pick-khb' })
  const after = JSON.stringify(await ui.drawn())
  expect(after).not.toContain('1 dòng R · ⚑ 1')       // kha thu gọn (việc của kha vẫn ở VIỆC CẦN ANH)
  expect(after).toContain('Plan chưa đạt')
  expect(after).toContain('Bỏ RFP/BRD vào projects/khb/01-input/')    // khb mở rộng
})
