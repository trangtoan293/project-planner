import { expect, test } from 'claude-code/testing'

// Ổ đĩa giả của repo project-planner: kha đã lên plan nhưng kiểm tra KHÔNG ĐẠT, khb mới tạo.
const NOW = Date.now()
const FILES: Record<string, { text: string; mtimeMs: number }> = {
  'templates/00-params.txt': { text: 'customer: KHA\n', mtimeMs: NOW },
  'templates/00-tuning.md': { text: '# Điều chỉnh riêng cho dự án <KH>\n', mtimeMs: NOW },
  'projects/kha/00-params.txt': { text: 'kickoff: 2026-11-02\ndeadline: 2027-06-30\nproposal_md: 845\nsubmit_by: 2020-01-01\nteam_max: PM=1, DEV=5, SysE=1\n', mtimeMs: NOW - 9e6 },
  'projects/kha/01-requirements.md': { text: '### 9. Khoảng trống\n1. Giả định: x\n2. CDC [D 14/10]\n## Thuật ngữ\n| R001 | ⚑ a | x | 1 | Mục II.1 | |\n', mtimeMs: NOW - 9e6 },
  'projects/kha/02-review.md': { text: '## Vòng 2\nCÒN LẠI: CRITICAL 0 · HIGH 0\nKẾT LUẬN: ĐẠT\n', mtimeMs: NOW - 7.5e6 },
  'projects/kha/01-input/rfp.pdf': { text: '', mtimeMs: NOW - 9e6 },
  'projects/kha/02-proposal.md': { text: '---\nsubtitle: KHO DỮ LIỆU KHA\n---\n# 1. TÓM TẮT\nKatalyst đề xuất xây kho dữ liệu cho 5 domain. Tên […], CV […]', mtimeMs: NOW - 8e6 },
  'projects/kha/02-proposal.docx': { text: '', mtimeMs: NOW - 7e6 },
  'projects/kha/03-wbs.md': { text: '', mtimeMs: NOW - 6e6 },
  'projects/kha/03-wbs.csv': { text: '', mtimeMs: NOW - 5e6 },
  'projects/kha/04-master-plan.xlsx': { text: '', mtimeMs: NOW - 4e6 },
  'projects/kha/04-check.txt': {
    text: 'Plan 2026-11-02 → 2027-07-02 (170 ngày làm việc), 850.0 MD: PM 100.0, DEV 700.0, SysE 50.0\nMỐC  1.1 | M1 — Quản lý dự án | 2026-11-02 | 2027-07-02 | 100.0\nMỐC  1.2 | M2 — Xây dựng | 2026-11-09 | 2027-06-01 | 750.0\nĐỘI  PM 1, DEV 4, SysE 1 (tổng 6 người cùng lúc)\nFAIL 1.3 kết thúc 2027-07-02 sau deadline 2027-06-30\nKẾT QUẢ: KHÔNG ĐẠT\n',
    mtimeMs: NOW - 3e6,
  },
  'projects/khb/01-input/.keep': { text: '', mtimeMs: NOW },
}
// scripts/trace.py --json của kha
const TRACE = {
  customer: 'kha', tuning: 0, has_wbs: true, timed: true, total_md: 342,
  milestones: [
    { code: 'M0', name: 'M0 — Nền tảng', md: 123, refs: 6, tasks: 29, biggest: { name: 'Khảo sát nghiệp vụ 5 domain', md: 15 } },
    { code: 'M1', name: 'M1 — Marketing', md: 219, refs: 32, tasks: 38, biggest: { name: 'Tích hợp Opera PMS, 25 bảng', md: 25 } },
  ],
  people: [{ role: 'PM', peak: 1, max: 1 }, { role: 'DEV', peak: 6, max: 5 }],
  sprint: { count: 18, weeks: 2, top: 'S2', load: 1 },
}
// plugin gọi fs bằng đường dẫn tuyệt đối theo gốc repo; ổ giả dùng đường dẫn tương đối từ gốc repo
const rel = (path: string) => path.replace(/^.*?\/(?=(projects|templates)(\/|$))/, '')
const isDir = (path: string) => Object.keys(FILES).some(f => f.startsWith(`${path}/`))

test('bảng chỉ hiện một khách; nút Thông số mở nhân sự, MD; bấm tên để đổi khách; tóm tắt và thông số có nút ẩn/hiện', async ($, on) => {
  const filled: string[] = []
  const runs: string[][] = []
  const opened: string[] = []
  const written: Record<string, string> = {}
  // phiên đã đổi thư mục sang chỗ khác: bảng vẫn phải đọc projects/ theo vị trí plugin
  on('session.root', async () => ({ value: '/elsewhere' }))
  on('session.cwd', async () => ({ value: '/elsewhere' }))
  on('fs.exists', async (_$, e) => ({ value: rel(e.path) in FILES || rel(e.path) in written || isDir(rel(e.path)) }))
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
  on('fs.write', async (_$, e) => { written[rel(e.path)] = e.text; return { value: undefined } })
  on('process.run', async (_$, e) => {
    if (e.argv[0] === 'open') opened.push(e.argv[1] ?? '')
    else runs.push([...e.argv])
    const stdout = e.argv[1] === 'scripts/trace.py' ? JSON.stringify(TRACE) : ''
    return { value: { exitCode: 0, stdout, stderr: '', isStdoutTruncated: false, isStderrTruncated: false } }
  })
  on('ui.toast', async () => ({ value: undefined }))
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
  expect(drawn).toContain('02/11/26 → 30/06/27')    // ngày dự án ở dòng đầu
  expect(drawn).not.toContain('quá hạn nộp')        // dòng đầu không lặp hạn nộp (việc gấp ghi 'Quá hạn nộp')
  expect(drawn).not.toContain('KHB')               // chỉ hiện khách đang chọn
  expect(drawn).toContain('Quá hạn nộp')           // việc gấp
  expect(drawn).toContain('Plan chưa đạt')
  expect(drawn).toContain('1 quyết định tự chốt')
  expect(drawn).not.toContain('ô […]')             // việc nhỏ không hiện ngoài bảng thông số
  expect(drawn).toContain('KHO DỮ LIỆU KHA')       // tóm tắt mở sẵn: giải pháp
  expect(drawn).toContain('Katalyst đề xuất xây kho dữ liệu cho 5 domain.')
  expect(drawn).toContain('M2 Xây dựng')           // các mốc của plan
  expect(drawn).toContain('750 MD')
  expect(drawn).not.toContain('Người/max')         // thông số ẩn tới khi bấm
  expect(drawn).not.toContain('Khách khác')

  await ui.press({ key: 'summary' })
  expect(JSON.stringify(await ui.drawn())).not.toContain('M2 Xây dựng')   // ẩn tóm tắt

  await ui.press({ key: 'stats' })
  const stats = JSON.stringify(await ui.drawn())
  expect(stats).toContain('02/11/26 → 02/07/27')
  expect(stats).toContain('170 ngày làm việc')
  expect(stats).toContain('4/5')                   // DEV cao nhất 4 người, tối đa 5
  expect(stats).toContain('700.0')
  expect(stats).toContain('6/7')                   // tổng người
  expect(stats).toContain('850.0')
  expect(stats).toContain('(proposal 845)')
  expect(stats).toContain('1 dòng R · ⚑ 1')
  expect(stats).toContain('2 ô […] cần điền khi nộp')
  expect(stats).toContain('KẾT LUẬN: ĐẠT')

  expect(drawn).toContain('Thư mục')
  await ui.press({ key: 'next' })
  expect(filled).toEqual(['/master-plan kha'])

  await ui.press({ key: 'explain' })
  const why = JSON.stringify(await ui.drawn())
  expect(runs).toEqual([['python3', 'scripts/trace.py', 'projects/kha', '--json']])
  expect(why).toContain('Vì sao ra plan này')
  expect(why).toContain('M1 Marketing')                 // tên milestone bỏ gạch ngang
  expect(why).toContain('lớn nhất · Tích hợp Opera PMS, 25 bảng')
  expect(why).toContain('   219   32    38')            // cột MD, R, Việc thẳng hàng
  expect(why).toContain('"DEV"')
  expect(why).toContain('6/5')                           // vượt tối đa
  expect(why).toContain('18 sprint × 2 tuần · tải cao nhất S2 ')
  expect(why).toContain('100%')
  expect(why).toContain('MD lịch = ngày × người × %')
  expect(why).toContain('Chỉnh cho dự án')
  await ui.press({ key: 'ask-why' })
  expect(filled[filled.length - 1]).toBe('Giải thích vì sao kha: ')
  await ui.press({ key: 'tuning' })
  expect(written['projects/kha/00-tuning.md']).toBe('# Điều chỉnh riêng cho dự án KHA\n')   // chưa có thì tạo từ mẫu
  expect(opened).toContain('projects/kha/00-tuning.md')

  await ui.press({ key: 'next-kh' })
  expect(runs.length).toBe(2)                       // đổi khách khi khung đang mở: đọc lại cho khách mới
  const after = JSON.stringify(await ui.drawn())
  expect(after).toContain('KHB')
  expect(after).not.toContain('Plan chưa đạt')
  expect(after).toContain('Bỏ RFP/BRD vào projects/khb/01-input/')
})
