import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Explain, Files, Project, Todo, TraceSummary, View } from '../types'
import {
  FILE_NAMES, buildSteps, countPlaceholders, daysLeft, isValidName, nextStep, parseCheck, parseHeadline, parseParams, parseRequirements,
  parseProposal, parseReview, parseTeamMax, shortDate, todos,
} from './status'
import type { StepState } from './status'

const PANE = 'presale-board'
const TITLE = 'Presales'
const REFRESH_MS = 4000
const projects = atom({ plugin: 'presale-board', key: 'projects' } as const, [])
const selected = atom({ plugin: 'presale-board', key: 'selected' } as const, '')
const busy = atom({ plugin: 'presale-board', key: 'busy' } as const, '')
const view = atom({ plugin: 'presale-board', key: 'view' } as const, 'summary' as View)
const TABS: { view: Exclude<View, ''>; key: string; hotkey: string; label: string }[] = [
  { view: 'summary', key: 'summary', hotkey: 't', label: 'Tóm tắt' },
  { view: 'stats', key: 'stats', hotkey: 's', label: 'Thông số' },
  { view: 'explain', key: 'explain', hotkey: 'g', label: 'Giải thích' },
]
const explain = atom({ plugin: 'presale-board', key: 'explain' } as const, { name: '' } as Explain)
const MAX_MILESTONES = 6
const DOC = 'docs/cach-hoat-dong.md'

const GLYPH: Record<StepState, string> = { done: '●', stale: '◐', fail: '✗', todo: '○' }
const COLOR: Record<StepState, string> = { done: 'success', stale: 'warning', fail: 'error', todo: 'subtle' }
const TODO_COLOR: Record<Todo['level'], string> = { urgent: 'error', warn: 'warning' }

// ---------- đọc dữ liệu ----------

// Gốc repo suy từ vị trí plugin (<repo>/tools/presale-board), không theo cwd hay session.root:
// cả hai đều bị dời khi phiên đổi thư mục, và bảng sẽ mất projects/
// plugin.root có thể là tools/presale-board hoặc tools/presale-board/.claude-plugin
const repoRoot = ($: EngineInterface) => $.plugin.root.split('/tools/presale-board')[0] ?? $.plugin.root
const at = async ($: EngineInterface, path: string) => `${repoRoot($)}/${path}`

const isRepo = async ($: EngineInterface) =>
  (await $.fs.exists(await at($, 'templates/00-params.txt'))) && (await $.fs.exists(await at($, 'projects')))

const readOptional = async ($: EngineInterface, path: string) =>
  (await $.fs.exists(await at($, path))) ? $.fs.read(await at($, path)) : undefined

const scanProject = async ($: EngineInterface, name: string): Promise<Project> => {
  const dir = `projects/${name}`
  const entries = await $.fs.list(await at($, dir))
  const mtime = new Map(entries.filter(f => f.kind === 'file').map(f => [f.name, f.mtimeMs]))
  const input = (await $.fs.exists(await at($, `${dir}/01-input`)))
    ? (await $.fs.list(await at($, `${dir}/01-input`))).filter(f => !f.name.startsWith('.'))
    : []
  const files: Files = { input: input.length ? Math.max(...input.map(f => f.mtimeMs)) : undefined }
  for (const [key, file] of Object.entries(FILE_NAMES)) files[key as keyof typeof FILE_NAMES] = mtime.get(file)
  const params = parseParams(await readOptional($, `${dir}/${FILE_NAMES.params}`))
  const proposal = await readOptional($, `${dir}/${FILE_NAMES.proposalMd}`)
  return {
    name,
    inputCount: input.length,
    files,
    params,
    proposal: parseProposal(proposal),
    check: parseCheck(await readOptional($, `${dir}/${FILE_NAMES.check}`)),
    health: {
      ...parseRequirements(await readOptional($, `${dir}/${FILE_NAMES.requirements}`)),
      review: parseReview(await readOptional($, `${dir}/${FILE_NAMES.review}`)),
      placeholders: countPlaceholders(proposal),
    },
  }
}

const scan = async ($: EngineInterface) => {
  try {
    const dirs = (await $.fs.list(await at($, 'projects'))).filter(d => d.kind === 'dir' && !d.name.startsWith('.'))
    const found = await Promise.all(dirs.map(d => scanProject($, d.name)))
    await update($, projects, () => found.sort((a, b) => a.name.localeCompare(b.name)))
  } catch (err) {
    $.ui.status(`presale-board: không đọc được ${repoRoot($)}/projects (plugin.root=${$.plugin.root}; ${String(err)})`)
  }
}

// ---------- thao tác ----------

const openPath = async ($: EngineInterface, path: string) => {
  if (!(await $.fs.exists(await at($, path)))) return $.ui.toast(`Chưa có ${path}`)
  const run = await $.process.run(['open', path], { cwd: repoRoot($) })
  if (run.exitCode !== 0) $.ui.toast(`Không mở được ${path}: ${run.stderr.trim()}`)
}

const rerunCheck = async ($: EngineInterface, name: string) => {
  const dir = `projects/${name}`
  for (const need of [FILE_NAMES.params, FILE_NAMES.wbsCsv]) {
    if (!(await $.fs.exists(await at($, `${dir}/${need}`)))) return $.ui.toast(`Chưa có ${dir}/${need} — chạy /master-plan ${name} trước`)
  }
  await update($, busy, () => name)
  try {
    const proposal = `${dir}/${FILE_NAMES.proposalMd}`
    const argv = ['python3', 'scripts/check_plan.py', `${dir}/${FILE_NAMES.params}`, `${dir}/${FILE_NAMES.wbsCsv}`]
    const run = await $.process.run((await $.fs.exists(await at($, proposal))) ? [...argv, proposal] : argv, { cwd: repoRoot($), timeoutMs: 60000 })
    await $.fs.write(await at($, `${dir}/${FILE_NAMES.check}`), run.stdout + (run.stderr ? `\n${run.stderr}` : ''))
    $.ui.toast(run.exitCode === 0 ? `${name}: kiểm tra ĐẠT` : `${name}: kiểm tra KHÔNG ĐẠT — xem lỗi trong bảng`)
  } catch (err) {
    $.ui.toast(`${name}: không chạy được check_plan.py (${String(err)})`)
  } finally {
    await update($, busy, () => '')
    await scan($)
  }
}

// Khung Giải thích: chạy scripts/trace.py (chỉ đọc file) và giữ kết quả theo khách
const runTrace = async ($: EngineInterface, name: string) => {
  await update($, explain, () => ({ name, loading: true }))
  try {
    const run = await $.process.run(['python3', 'scripts/trace.py', `projects/${name}`, '--json'], { cwd: repoRoot($), timeoutMs: 30000 })
    const result: Explain = run.exitCode === 0
      ? { name, data: JSON.parse(run.stdout) as TraceSummary }
      : { name, error: run.stderr.trim().split('\n').pop() ?? 'lỗi không rõ' }
    await update($, explain, () => result)
  } catch (err) {
    await update($, explain, () => ({ name, error: String(err) }))
  }
}

// Mở 00-tuning.md của khách; chưa có thì chép từ templates/00-tuning.md
const openTuning = async ($: EngineInterface, name: string) => {
  const path = `projects/${name}/00-tuning.md`
  if (!(await $.fs.exists(await at($, path)))) {
    const template = await $.fs.read(await at($, 'templates/00-tuning.md'))
    await $.fs.write(await at($, path), template.replace('<KH>', name.toUpperCase()))
    $.ui.toast(`Đã tạo ${path} từ mẫu: ghi điều chỉnh kèm lý do, rồi chạy lại bước Chia việc`)
  }
  await openPath($, path)
}

const createProject = async ($: EngineInterface, name: string) => {
  if (!isValidName(name)) return `Tên "${name}" không hợp lệ: dùng chữ thường, số, gạch ngang (ví dụ: kha, khb-dwh).`
  const dir = `projects/${name}`
  if (await $.fs.exists(await at($, dir))) return `${dir}/ đã có sẵn.`
  const template = await $.fs.read(await at($, 'templates/00-params.txt'))
  await $.fs.write(await at($, `${dir}/00-params.txt`), template.replace(/^customer:.*$/m, `customer: ${name.toUpperCase()}`))
  await $.fs.write(await at($, `${dir}/01-input/.keep`), '')
  await update($, selected, () => name)
  await scan($)
  return `Đã tạo ${dir}/. Bỏ RFP/BRD vào ${dir}/01-input/ rồi gõ /write-proposal ${name}`
}

// ---------- hooks ----------

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    if (await isRepo($)) {
      await $.command.register({
        name: 'presale',
        description: 'Bảng tiến độ presales. "/presale new <kh>" tạo khách, "/presale <kh>" chọn khách',
        argumentHint: '[new <kh> | <kh>]',
      })
      await scan($)
      $.clock.every(REFRESH_MS, () => void scan($))
      void $.ui.open({ id: PANE, title: TITLE, columns: 72 })
    }
    return next(e)
  })

  on('command.run', { command: 'presale' }, async ($, e) => {
    const [verb, name] = e.args.trim().split(/\s+/)
    if (verb === 'new') return { text: await createProject($, (name ?? '').toLowerCase()) }
    if (verb) await update($, selected, () => verb.toLowerCase())
    await scan($)
    await $.ui.open({ id: PANE, title: TITLE, columns: 72, focus: true })
    return { text: 'Đã mở bảng Presales (Ctrl+X Tab để dùng phím tắt).' }
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text, Button } = $.ui.resolve(e)
    const list = await read($, projects)
    const running = await read($, busy)
    const pick = await read($, selected)
    const open = await read($, view)
    const why = await read($, explain)
    const index = Math.max(0, list.findIndex(p => p.name === pick))
    const p = list[index]
    const now = Date.now()
    const select = async (step: number) => {
      const name = list[(index + step + list.length) % list.length]?.name ?? ''
      await update($, selected, () => name)
      if (open === 'explain') await runTrace($, name)
    }
    // thanh tab: bấm tab đang mở thì đóng; mở Giải thích thì đọc lại trace.py
    const pickTab = async (tab: Exclude<View, ''>) => {
      await update($, view, v => (v === tab ? '' : tab))
      if (tab === 'explain' && open !== 'explain') await runTrace($, p?.name ?? '')
    }
    const line = (label: string, value: string, color?: string) => (
      <Text key={label} wrap="truncate-end"><Text color="subtle">{label.padEnd(12)}</Text><Text color={color}>{value}</Text></Text>
    )

    if (!p) {
      return (
        <Box borderStyle="round" borderColor="subtle" paddingX={1} flexDirection="column">
          <Text>Chưa có khách nào.</Text>
          <Text color="subtle">Gõ /presale new &lt;tên-kh&gt; để bắt đầu.</Text>
        </Box>
      )
    }

    const steps = buildSteps(p)
    const current = steps.findIndex(s => s.state !== 'done')
    const next = nextStep(p)
    const inbox = todos([p], now).slice(0, 3)
    const left = daysLeft(p.params.submitBy, now)

    // Bảng thông số: nhân sự, MD, thời gian; mở bằng nút "Thông số"
    const statsPanel = () => {
      const hp = p.health  // không đặt tên h: trùng hàm h của JSX
      const r = hp.review
      const plan = parseHeadline(p.check.headline)
      const max = parseTeamMax(p.params.teamMax)
      const roles = [...new Set([...Object.keys(max), ...Object.keys(p.check.team), ...Object.keys(plan?.md ?? {})])]
      const people = roles.reduce((n, role) => n + (p.check.team[role] ?? 0), 0)
      const maxPeople = roles.reduce((n, role) => n + (max[role] ?? 0), 0)
      const md = (v: number | undefined) => (v === undefined ? '—' : v.toFixed(1)).padStart(7)
      return (
        <Box flexDirection="column" borderStyle="single" borderColor="subtle" paddingX={1} marginTop={1}>
          {line('Thời gian', plan
            ? `${shortDate(plan.start)} → ${shortDate(plan.finish)} · ${plan.days} ngày làm việc${p.params.deadline ? ` · hạn ${shortDate(p.params.deadline)}` : ''}`
            : `kickoff ${shortDate(p.params.kickoff)} · hạn ${shortDate(p.params.deadline)} · chưa có plan`)}
          {roles.length > 0 && <Text color="subtle">{`${'Vai trò'.padEnd(12)}${'Người/max'.padStart(9)}${'MD'.padStart(9)}`}</Text>}
          {roles.map(role => (
            <Text key={`role-${role}`}>
              {role.padEnd(12)}
              <Text color={(p.check.team[role] ?? 0) > (max[role] ?? Infinity) ? 'error' : undefined}>{`${p.check.team[role] ?? '—'}/${max[role] ?? '—'}`.padStart(9)}</Text>
              {`  ${md(plan?.md[role])}`}
            </Text>
          ))}
          {roles.length > 0 && (
            <Text bold>
              {'Tổng'.padEnd(12)}{`${people || '—'}/${maxPeople || '—'}`.padStart(9)}{`  ${md(plan?.totalMd)}`}
              {p.params.proposalMd && <Text color={plan && Math.abs(plan.totalMd - Number(p.params.proposalMd)) > 0.5 ? 'warning' : 'subtle'}>{`  (proposal ${p.params.proposalMd})`}</Text>}
            </Text>
          )}
          {p.files.requirements && line('Yêu cầu', `${hp.reqRows} dòng R · ⚑ ${hp.flags} · khoảng trống ${hp.gapsOpen ? `${hp.gapsOpen}/${hp.gapsTotal} chưa chốt` : 'đã chốt hết'}`, hp.gapsOpen ? 'warning' : undefined)}
          {(hp.decided > 0 || hp.drafted > 0) && line('Quyết định', `${hp.decided} anh chốt [C] · ${hp.drafted} tự chốt [D]${hp.drafted ? ' chờ duyệt' : ''}`, hp.drafted ? 'warning' : undefined)}
          {r && line('Review', r.concluded ? `vòng ${r.round} · KẾT LUẬN: ĐẠT` : r.critical < 0 ? `vòng ${r.round} · chưa ghi số lỗi còn lại` : `vòng ${r.round} · còn ${r.critical} CRITICAL, ${r.high} HIGH`, r.concluded ? 'success' : r.critical > 0 ? 'error' : 'warning')}
          {p.files.proposalMd && line('Proposal', `${hp.placeholders ? `${hp.placeholders} ô […] cần điền khi nộp` : 'không còn ô […]'}${p.files.proposalDocx ? '' : ' · chưa xuất .docx'}`, hp.placeholders ? 'warning' : undefined)}
          {p.check.firstFail && line('Kiểm tra', `✗ ${p.check.firstFail}${p.check.failCount > 1 ? ` (+${p.check.failCount - 1} lỗi)` : ''}`, 'error')}
        </Box>
      )
    }

    // Tóm tắt high-level: proposal đề xuất gì, plan chia mốc ra sao
    const summaryPanel = () => {
      const ms = p.check.milestones
      const plan = parseHeadline(p.check.headline)
      return (
        <Box flexDirection="column" borderStyle="single" borderColor="subtle" paddingX={1} marginTop={1}>
          <Text bold>Proposal</Text>
          {p.proposal.solution || p.proposal.pitch ? (
            <Box flexDirection="column">
              {p.proposal.solution && line('Giải pháp', p.proposal.solution)}
              {p.proposal.pitch && <Text wrap="wrap" color="subtle">{p.proposal.pitch}</Text>}
            </Box>
          ) : <Text color="subtle">Chưa có 02-proposal.md</Text>}
          <Text bold>{plan ? `Plan · ${plan.totalMd.toFixed(1)} MD · ${shortDate(plan.start)} → ${shortDate(plan.finish)}` : 'Plan'}</Text>
          {ms.length === 0 && <Text color="subtle">{p.check.headline ? 'Bấm c (Kiểm tra) để hiện các mốc' : `Chưa có plan · /master-plan ${p.name}`}</Text>}
          {ms.slice(0, MAX_MILESTONES).map(m => (
            <Box key={`ms-${m.wbs}`} flexDirection="row" justifyContent="space-between">
              <Text wrap="truncate-end">{m.name.replace(/\s+[—–-]\s+/, ' ')}</Text>
              <Text color="subtle">{`  ${shortDate(m.start).slice(0, 5)}→${shortDate(m.finish).slice(0, 5)} ${m.md.toFixed(0).padStart(5)} MD`}</Text>
            </Box>
          ))}
          {ms.length > MAX_MILESTONES && <Text color="subtle">{`+${ms.length - MAX_MILESTONES} mốc khác (Excel: phím x)`}</Text>}
        </Box>
      )
    }

    // Giải thích: vì sao ra milestone, MD, người, sprint (scripts/trace.py --json) và chỗ chỉnh cho dự án
    const COLS = (md: string, r: string, n: string) => `${md.padStart(6)}${r.padStart(5)}${n.padStart(6)}`
    const explainBody = (s: TraceSummary) => (
      <Box flexDirection="column">
        <Text>
          <Text color="subtle">Nguồn  </Text>
          {s.tuning ? <Text color="warning">{`${s.tuning} điều chỉnh riêng (00-tuning.md)`}</Text> : 'knowledge chung (estimation.md)'}
          {!s.tuning && <Text color="subtle"> · e để chỉnh</Text>}
        </Text>
        {!s.has_wbs && <Text color="subtle">Chưa có 03-wbs.md: chạy bước Chia việc trước.</Text>}
        {s.milestones.length > 0 && (
          <Box flexDirection="column" marginTop={1}>
            <Box flexDirection="row">
              <Box flexGrow={1}><Text color="subtle">Milestone</Text></Box>
              <Text color="subtle">{COLS('MD', 'R', 'Việc')}</Text>
            </Box>
            {s.milestones.map(m => (
              <Box key={`ms-${m.code}`} flexDirection="column">
                <Box flexDirection="row">
                  <Box flexGrow={1} flexShrink={1}><Text bold wrap="truncate-end">{m.name.replace(/\s+[—–-]\s+/, ' ')}</Text></Box>
                  <Text>{COLS(m.md.toFixed(0), String(m.refs), String(m.tasks))}</Text>
                </Box>
                {m.biggest && (
                  <Box flexDirection="row">
                    <Box flexGrow={1} flexShrink={1}><Text color="subtle" wrap="truncate-end">{`   lớn nhất · ${m.biggest.name}`}</Text></Box>
                    <Text color="subtle">{`${m.biggest.md.toFixed(0).padStart(4)} MD`}</Text>
                  </Box>
                )}
              </Box>
            ))}
            <Box flexDirection="row">
              <Box flexGrow={1}><Text bold>Tổng</Text></Box>
              <Text bold>{COLS(s.total_md.toFixed(0), '', '')}</Text>
            </Box>
          </Box>
        )}
        {s.timed && s.sprint ? (
          <Box flexDirection="column" marginTop={1}>
            <Text color="subtle">Người cao nhất cùng lúc / tối đa</Text>
            <Text>
              {s.people.map((p, i) => (
                <Text key={`pp-${p.role}`}>
                  {i > 0 && '   '}{p.role} <Text bold color={p.peak > p.max ? 'error' : undefined}>{`${p.peak}/${p.max}`}</Text>
                </Text>
              ))}
            </Text>
            <Text>
              <Text color="subtle">Sprint  </Text>
              {`${s.sprint.count} sprint × ${s.sprint.weeks} tuần · tải cao nhất ${s.sprint.top} `}
              <Text bold color={s.sprint.load > 1 ? 'error' : s.sprint.load >= 0.95 ? 'warning' : 'success'}>{`${Math.round(s.sprint.load * 100)}%`}</Text>
            </Text>
          </Box>
        ) : s.has_wbs && <Text color="subtle">Chưa điền thời gian, người: chưa có lịch và sprint.</Text>}
        <Box flexDirection="column" marginTop={1}>
          <Text color="subtle">Cách tính</Text>
          <Text>  MD việc = khối lượng × đơn giá  <Text color="subtle">(03-wbs.md)</Text></Text>
          <Text>  MD lịch = ngày × người × %  <Text color="subtle">(master plan)</Text></Text>
        </Box>
      </Box>
    )
    const explainPanel = () => (
      <Box flexDirection="column" borderStyle="single" borderColor="subtle" paddingX={1} marginTop={1}>
        <Text bold>Vì sao ra plan này</Text>
        {why.name !== p.name ? <Text color="subtle">Bấm g hai lần để cập nhật cho {p.name.toUpperCase()}</Text>
          : why.loading ? <Text color="subtle">Đang đọc…</Text>
          : why.error ? <Text color="error" wrap="wrap">{`Không chạy được trace.py: ${why.error}`}</Text>
          : why.data && explainBody(why.data)}
        <Box flexDirection="row" flexWrap="wrap" gap={2} marginTop={1}>
          <Button key="ask-why" plain hotkey="v" label="Hỏi vì sao…" onPress={() => void $.prompt.fill({ text: `Giải thích vì sao ${p.name}: ` })} />
          <Button key="tuning" plain hotkey="e" label="Chỉnh cho dự án" onPress={() => void openTuning($, p.name)} />
          <Button key="how" plain hotkey="h" label="Cách hoạt động" onPress={() => void openPath($, DOC)} />
        </Box>
      </Box>
    )

    return (
      <Box flexDirection="column">
        <Box flexDirection="row" justifyContent="space-between">
          <Box flexDirection="row">
            {/* bấm tên khách để sang khách khác; không gắn phím để khỏi hiện "k:" trước tên */}
            {list.length > 1
              ? <Button key="next-kh" plain label={p.name.toUpperCase()} onPress={() => void select(1)} />
              : <Text bold color="claude">{p.name.toUpperCase()}</Text>}
            {list.length > 1 && <Text color="subtle">{`  ${index + 1}/${list.length} ↻`}</Text>}
          </Box>
          <Text color="subtle">
            {`${shortDate(p.params.kickoff)} → ${shortDate(p.params.deadline)}`}
            {/* hạn nộp ≤ 7 ngày đã nằm ở dòng việc gấp bên dưới, không lặp lại */}
            {left !== undefined && left > 7 && <Text>{` · nộp còn ${left} ngày`}</Text>}
          </Text>
        </Box>
        <Box flexDirection="row" flexWrap="wrap">
          {steps.map((s, i) => (
            <Text key={s.label}>
              {i > 0 && <Text color="subtle"> ─ </Text>}
              <Text color={i === current && s.state === 'todo' ? 'claude' : COLOR[s.state]} bold={i === current}>
                {i === current && s.state === 'todo' ? '▶' : GLYPH[s.state]} {s.label}
              </Text>
            </Text>
          ))}
        </Box>
        {inbox.map((t, i) => (
          <Button key={`todo-${i}`} plain onPress={() => void (t.open ? openPath($, t.open) : t.prompt ? $.prompt.fill({ text: t.prompt }) : undefined)}>
            <Text color={TODO_COLOR[t.level]}>{t.level === 'urgent' ? '! ' : '• '}</Text>
            {t.text}
          </Button>
        ))}
        {/* tầng 1: việc cần làm tiếp và kiểm tra lại */}
        <Box flexDirection="row" gap={1} marginTop={1}>
          {next.prompt ? (
            <Button key="next" hotkey="n" variant="primary" label={`▶ ${next.label}`} onPress={() => void $.prompt.fill({ text: next.prompt ?? '' })} />
          ) : (
            <Text color={next.label.startsWith('Xong') ? 'success' : 'warning'}>{`✓ ${next.label}`}</Text>
          )}
          <Button key="check" hotkey="c" variant="secondary" label={running === p.name ? 'Đang kiểm tra…' : 'Kiểm tra'}
            onPress={() => void (running ? undefined : rerunCheck($, p.name))} />
        </Box>
        {/* tầng 2: thanh tab (một khung mỗi lúc) bên trái, mở file bên phải */}
        <Box flexDirection="row" justifyContent="space-between" marginTop={1}>
          <Box flexDirection="row" gap={2}>
            {TABS.map(t => (
              <Button key={t.key} plain hotkey={t.hotkey} dimColor={open !== t.view} onPress={() => void pickTab(t.view)}>
                <Text bold={open === t.view} underline={open === t.view}>{t.label}</Text>
              </Button>
            ))}
          </Box>
          <Box flexDirection="row" gap={2}>
            <Text color="subtle">Mở</Text>
            <Button key="open-dir" plain dimColor hotkey="o" label="Thư mục" onPress={() => void openPath($, `projects/${p.name}`)} />
            <Button key="open-proposal" plain dimColor hotkey="p" label="Proposal" onPress={() => void openPath($, `projects/${p.name}/${p.files.proposalDocx ? FILE_NAMES.proposalDocx : FILE_NAMES.proposalMd}`)} />
            <Button key="open-plan" plain dimColor hotkey="x" label="Excel" onPress={() => void openPath($, `projects/${p.name}/${FILE_NAMES.plan}`)} />
          </Box>
        </Box>
        {/* tầng 3: khung đang mở */}
        {open === 'summary' && summaryPanel()}
        {open === 'stats' && statsPanel()}
        {open === 'explain' && explainPanel()}
        <Text color="subtle">{`Ctrl+X Tab để dùng phím tắt${list.length > 1 ? ' · bấm tên khách để đổi khách' : ''} · /auto-presale ${p.name} chạy tự động`}</Text>
      </Box>
    )
  })
}
