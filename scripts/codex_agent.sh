#!/usr/bin/env bash
# Chạy một agent của plugin presale (agents/<tên>.md) bằng Codex CLI thay cho subagent Claude,
# để tiết kiệm token Claude. Bản đóng gói của ~/.claude/bin/codex-agent, tìm agent trong plugin trước.
#
# Dùng (từ thư mục project):
#   codex-agent <tên-agent> <file-báo-cáo> "<nhiệm vụ cụ thể>"
#   CODEX_EFFORT=xhigh codex-agent <tên-agent> <file-báo-cáo> "<nhiệm vụ>"
# Mặc định model gpt-6.1-sol, reasoning high (đổi bằng CODEX_MODEL, CODEX_EFFORT; chạy thử dùng CODEX_EFFORT=medium).
# Dừng sau CODEX_TIMEOUT giây (mặc định 900) để agent không chạy lan man.
# Chạy song song: mỗi agent một lệnh chạy nền, mỗi agent ghi file riêng.
# Log Codex nằm cạnh file báo cáo (<file-báo-cáo>.log). Trạng thái ghi ở ~/.claude/agent-runs/<id>.json,
# hiện ở footer AGENTS (mod agent-monitor) của đúng phiên Claude Code đã gọi (CLAUDE_CODE_SESSION_ID).
set -euo pipefail

NAME="$1"
OUT="$2"
TASK="$3"
ROOT="$PWD"
PLUGIN="$(cd "$(dirname "$0")/.." && pwd)"
AGENT="$PLUGIN/agents/$NAME.md"
[ -f "$AGENT" ] || AGENT="$ROOT/.claude/agents/$NAME.md"
[ -f "$AGENT" ] || AGENT="$HOME/.claude/agents/$NAME.md"
[ -f "$AGENT" ] || { echo "Không có agent $NAME trong $PLUGIN/agents/, .claude/agents/ hoặc ~/.claude/agents/" >&2; exit 2; }
command -v codex >/dev/null || { echo "Máy chưa có codex CLI; chạy agent bằng subagent Claude presale:$NAME" >&2; exit 3; }
case "$OUT" in /*) ;; *) OUT="$ROOT/$OUT" ;; esac
LOG="${OUT%.*}.log"
RUNS="$HOME/.claude/agent-runs"
mkdir -p "$(dirname "$OUT")" "$RUNS"
STATE="$RUNS/$(date +%s)-$$.json"
STARTED="$(date +%s)000"

state() {  # state <running|done|failed> <exit code>
  python3 - "$STATE" "$1" "$2" "$NAME" "$OUT" "$LOG" "$ROOT" "$STARTED" "$$" "$TASK" "${CLAUDE_CODE_SESSION_ID:-}" <<'PY'
import json, sys, time
path, status, code, agent, out, log, cwd, started, pid, task, session = sys.argv[1:]
flat = " ".join(task.split())
row = {"engine": "codex", "agent": agent, "label": flat[:80], "task": flat[:400], "out": out, "log": log, "cwd": cwd, "session": session,
       "status": status, "exit": int(code), "pid": int(pid), "started": int(started),
       "ended": None if status == "running" else int(time.time() * 1000)}
json.dump(row, open(path, "w"), ensure_ascii=False)
PY
}
state running 0
trap 'state failed 130; exit 130' INT TERM

# ponytail: bỏ front matter bằng awk; agent nào có dòng '---' trong thân thì đổi sang parser YAML
INSTR="$(awk 'f>=2 {print} /^---$/ {f++}' "$AGENT")"
INSTR="${INSTR//\$\{CLAUDE_PLUGIN_ROOT\}/$PLUGIN}"  # Claude Code tự thay biến này, Codex thì không

set +e
perl -e 'alarm shift; exec @ARGV' "${CODEX_TIMEOUT:-900}" \
codex exec -C "$ROOT" -s workspace-write --skip-git-repo-check --ephemeral \
  -m "${CODEX_MODEL:-gpt-6.1-sol}" -c model_reasoning_effort="${CODEX_EFFORT:-high}" \
  -o "$OUT" \
  "$INSTR

---
Nhiệm vụ cụ thể (thư mục làm việc là $ROOT):
$TASK

Phạm vi: chỉ làm đúng nhiệm vụ này. Không gọi agent khác, không chạy codex-agent, không làm các bước khác của skill
(review, sửa vòng sau, lập plan…) dù chỉ dẫn của skill có nhắc. Ghi xong file kết quả thì trả báo cáo và dừng.
Kết thúc bằng bản báo cáo theo đúng định dạng trong chỉ dẫn ở trên." < /dev/null > "$LOG" 2>&1
CODE=$?
set -e
if [ "$CODE" -eq 0 ]; then state done 0; else state failed "$CODE"; fi
[ "$CODE" -eq 142 ] && echo "$NAME: dừng vì quá ${CODEX_TIMEOUT:-900}s" >&2
echo "$NAME: exit=$CODE · báo cáo $OUT · log $LOG"
exit "$CODE"
