import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Files, Project, Todo } from '../types'
import {
  FILE_NAMES, buildSteps, countPlaceholders, daysLeft, isValidName, nextStep, parseCheck, parseParams, parseRequirements,
  parseReview, shortDate, todos,
} from './status'
import type { StepState } from './status'

const PANE = 'presale-board'
const TITLE = 'Presales'
const REFRESH_MS = 4000
const projects = atom({ plugin: 'presale-board', key: 'projects' } as const, [])
const selected = atom({ plugin: 'presale-board', key: 'selected' } as const, '')
const busy = atom({ plugin: 'presale-board', key: 'busy' } as const, '')

const GLYPH: Record<StepState, string> = { done: '●', stale: '◐', fail: '✗', todo: '○' }
const COLOR: Record<StepState, string> = { done: 'success', stale: 'warning', fail: 'error', todo: 'subtle' }
const TODO_COLOR: Record<Todo['level'], string> = { urgent: 'error', warn: 'warning', info: 'subtle' }

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
  return {
    name,
    inputCount: input.length,
    files,
    params: parseParams(await readOptional($, `${dir}/${FILE_NAMES.params}`)),
    check: parseCheck(await readOptional($, `${dir}/${FILE_NAMES.check}`)),
    health: {
      ...parseRequirements(await readOptional($, `${dir}/${FILE_NAMES.requirements}`)),
      review: parseReview(await readOptional($, `${dir}/${FILE_NAMES.review}`)),
      placeholders: countPlaceholders(await readOptional($, `${dir}/${FILE_NAMES.proposalMd}`)),
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
    const chosen = list.find(p => p.name === pick) ?? list[0]
    const now = Date.now()
    const inbox = todos(list, now)

    const pipeline = (p: Project) => {
      const steps = buildSteps(p)
      const current = steps.findIndex(s => s.state !== 'done')
      return (
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
      )
    }

    // Sức khỏe hồ sơ: mỗi dòng một con số để quyết định việc tiếp theo; dòng nào chưa có dữ liệu thì ẩn
    const health = (p: Project) => {
      const hp = p.health  // không đặt tên h: trùng hàm h của JSX
      const r = hp.review
      const line = (label: string, value: string, color?: string) => (
        <Text key={label} wrap="truncate-end"><Text color="subtle">{label.padEnd(11)}</Text><Text color={color}>{value}</Text></Text>
      )
      return (
        <Box flexDirection="column" marginTop={1}>
          {p.files.requirements && line('Yêu cầu', `${hp.reqRows} dòng R · ⚑ ${hp.flags} · khoảng trống ${hp.gapsOpen ? `${hp.gapsOpen}/${hp.gapsTotal} chưa chốt` : 'đã chốt hết'}`, hp.gapsOpen ? 'warning' : undefined)}
          {(hp.decided > 0 || hp.drafted > 0) && line('Quyết định', `${hp.decided} anh chốt [C] · ${hp.drafted} tự chốt [D]${hp.drafted ? ' chờ duyệt' : ''}`, hp.drafted ? 'warning' : undefined)}
          {r && line('Review', r.concluded ? `vòng ${r.round} · KẾT LUẬN: ĐẠT` : r.critical < 0 ? `vòng ${r.round} · chưa ghi số lỗi còn lại` : `vòng ${r.round} · còn ${r.critical} CRITICAL, ${r.high} HIGH`, r.concluded ? 'success' : r.critical > 0 ? 'error' : 'warning')}
          {p.files.proposalMd && line('Proposal', `${hp.placeholders ? `${hp.placeholders} ô […] cần điền khi nộp` : 'không còn ô […]'}${p.files.proposalDocx ? '' : ' · chưa xuất .docx'}`, hp.placeholders ? 'warning' : undefined)}
          {p.check.headline && line('Plan', p.check.headline.replace(/^Plan /, ''), p.check.result === 'fail' ? 'error' : undefined)}
          {p.check.firstFail && line('', `✗ ${p.check.firstFail}${p.check.failCount > 1 ? ` (+${p.check.failCount - 1} lỗi)` : ''}`, 'error')}
        </Box>
      )
    }

    const actions = (p: Project) => {
      const next = nextStep(p)
      return (
        <Box flexDirection="row" flexWrap="wrap" gap={1} marginTop={1}>
          {next.prompt ? (
            <Button key="next" hotkey="n" variant="primary" label={`▶ ${next.label}`} onPress={() => void $.prompt.fill({ text: next.prompt ?? '' })} />
          ) : (
            <Text color={next.label.startsWith('Xong') ? 'success' : 'warning'}>→ {next.label}</Text>
          )}
          <Button key="auto" hotkey="a" label="Tự động" onPress={() => void $.prompt.fill({ text: `/auto-presale ${p.name}` })} />
          <Button key="open-dir" hotkey="o" label="Thư mục" onPress={() => void openPath($, `projects/${p.name}`)} />
          <Button key="open-proposal" hotkey="p" label="Proposal" onPress={() => void openPath($, `projects/${p.name}/${p.files.proposalDocx ? FILE_NAMES.proposalDocx : FILE_NAMES.proposalMd}`)} />
          <Button key="open-plan" hotkey="x" label="Excel" onPress={() => void openPath($, `projects/${p.name}/${FILE_NAMES.plan}`)} />
          <Button key="check" hotkey="c" label={running === p.name ? 'Đang kiểm tra…' : 'Kiểm tra lại'}
            onPress={() => void (running ? undefined : rerunCheck($, p.name))} />
        </Box>
      )
    }

    const card = (p: Project, i: number) => {
      const isChosen = p.name === chosen?.name
      const { kickoff, deadline, submitBy } = p.params
      const left = daysLeft(submitBy, now)
      return (
        <Box key={`card-${p.name}`} flexDirection="column" borderStyle="round" borderColor={isChosen ? 'claude' : 'subtle'} paddingX={1}>
          <Box flexDirection="row" justifyContent="space-between">
            <Button key={`pick-${p.name}`} plain hotkey={i < 9 ? String(i + 1) : undefined} label={p.name.toUpperCase()}
              onPress={() => void update($, selected, () => p.name)} />
            <Text>
              {left !== undefined && <Text color={left <= 3 ? 'error' : left <= 7 ? 'warning' : 'subtle'}>{left < 0 ? `quá hạn nộp ${-left} ngày · ` : `nộp còn ${left} ngày · `}</Text>}
              <Text color="subtle">{`dự án ${shortDate(kickoff)} → ${shortDate(deadline)}`}</Text>
            </Text>
          </Box>
          {pipeline(p)}
          {isChosen ? (
            <Box flexDirection="column">
              {health(p)}
              {actions(p)}
            </Box>
          ) : (
            <Text color="subtle">→ {nextStep(p).label}</Text>
          )}
        </Box>
      )
    }

    return (
      <Box flexDirection="column">
        <Box flexDirection="row" justifyContent="space-between">
          <Text bold color="claude">PRESALES</Text>
          <Text color="subtle">{`${list.length} khách · ${inbox.length} việc cần anh`}</Text>
        </Box>
        {list.length === 0 && (
          <Box borderStyle="round" borderColor="subtle" paddingX={1} flexDirection="column">
            <Text>Chưa có khách nào.</Text>
            <Text color="subtle">Gõ /presale new &lt;tên-kh&gt; để bắt đầu.</Text>
          </Box>
        )}
        {list.map(card)}
        {inbox.length > 0 && (
          <Box flexDirection="column" marginTop={1}>
            <Text bold>VIỆC CẦN ANH</Text>
            {inbox.slice(0, 8).map((t, i) => (
              <Button key={`todo-${i}`} plain onPress={() => void (t.open ? openPath($, t.open) : t.prompt ? $.prompt.fill({ text: t.prompt }) : update($, selected, () => t.customer))}>
                <Text color={TODO_COLOR[t.level]}>{t.level === 'urgent' ? '!' : t.level === 'warn' ? '•' : '·'}</Text>
                <Text bold>{` ${t.customer.toUpperCase()} `}</Text>
                {t.text}
                <Text color="subtle">{t.open ? '  ↗ mở file' : t.prompt ? '  ↵ điền lệnh' : ''}</Text>
              </Button>
            ))}
            {inbox.length > 8 && <Text color="subtle">{`  +${inbox.length - 8} việc khác`}</Text>}
          </Box>
        )}
        <Text color="subtle">{'Ctrl+X Tab vào bảng · 1–9 khách · n bước tiếp · a tự động · o p x mở file · c kiểm tra'}</Text>
      </Box>
    )
  })
}
