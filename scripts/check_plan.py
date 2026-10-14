"""Kiểm tra WBS/master plan sau khi lên plan — chặn timeline lệch do lẫn dữ liệu cũ.

Dùng:
    python3 scripts/check_plan.py projects/<kh>/00-params.txt projects/<kh>/03-wbs.csv [projects/<kh>/02-proposal.md]
    python3 scripts/check_plan.py projects/<kh>/00-params.txt - projects/<kh>/02-proposal.md   # chỉ kiểm tra proposal

Thoát mã 1 nếu có lỗi FAIL. WARN là điểm cần người xem lại, không chặn.
Kiểm tra:
  1. Ngày bắt đầu dự án = kickoff; không việc nào bắt đầu trước kickoff hoặc kết thúc sau deadline
     (trừ việc thuộc nhóm có tên khớp post_deadline, ví dụ hypercare, bảo hành).
  2. Không việc nào bắt đầu vào thứ 7, CN hoặc ngày lễ.
  3. Ràng buộc predecessor (FS, SS, FF, có lag) được tôn trọng.
  4. Mốc bắt buộc (milestones) kết thúc đúng hạn.
  5. Số người mỗi vai trò không vượt team_max; % phân bổ trong 0..1.
  6. Tổng MD khớp proposal_md (±5%); tỷ trọng PM trong 5–15%.
  7. Không còn tên khách hàng/dự án cũ (stale_terms) trong WBS và proposal.
  8. Ngày tháng trong proposal: cảnh báo ngày trước kickoff hoặc sau deadline.
  9. 01-requirements.md (cùng thư mục proposal): mọi yêu cầu có "Trả lời tại" trỏ tới mục có thật, không ghi khoảng;
     đủ 9 mục tổng hợp (templates/01-requirements.md) và không mục nào trống.
"""
import re
import sys
from datetime import date, timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from build_master_plan import (ROLES, is_workday, load_tasks, parse_holidays,  # noqa: E402
                               parse_preds, shift_workdays)

DATE_RE = re.compile(r"\b(\d{1,2})/(\d{1,2})/(\d{4})\b")


def read_params(path):
    params = {}
    for line in Path(path).read_text(encoding="utf-8").splitlines():
        line = line.split("#", 1)[0].strip()
        if ":" in line:
            k, _, v = line.partition(":")
            params[k.strip()] = v.strip()
    for key in ("customer", "kickoff"):
        if not params.get(key):
            sys.exit(f"{path}: thiếu '{key}'")
    return params


def kv_list(spec, sep=","):
    out = {}
    for part in filter(None, (p.strip() for p in (spec or "").split(sep))):
        k, _, v = part.replace("<=", "=").partition("=")
        out[k.strip()] = v.strip()
    return out


def check(params, tasks, proposal_text, holidays):
    fails, warns = [], []
    kickoff = date.fromisoformat(params["kickoff"])
    deadline = date.fromisoformat(params["deadline"]) if params.get("deadline") else None
    leaves = [t for t in tasks if not t["parent"]]
    # hypercare, bảo hành… diễn ra sau nghiệm thu: được phép quá deadline nếu khai báo trong post_deadline
    post_terms = [x.strip().lower() for x in params.get("post_deadline", "").split(";") if x.strip()]
    def is_post(t):
        return any(term in a["name"].lower() for a in tasks for term in post_terms
                   if t["wbs"] == a["wbs"] or t["wbs"].startswith(a["wbs"] + "."))

    md, total = {}, 0.0
    if tasks:  # bỏ qua khi chỉ kiểm tra proposal
        # 1. kickoff / deadline
        if tasks[0]["start"] != kickoff:
            fails.append(f"Dự án bắt đầu {tasks[0]['start']} nhưng kickoff là {kickoff}")
        for t in leaves:
            if t["start"] < kickoff:
                fails.append(f"{t['wbs']} bắt đầu {t['start']} trước kickoff {kickoff} (nghi lẫn ngày cũ)")
            if deadline and t["finish"] > deadline and not is_post(t):
                fails.append(f"{t['wbs']} kết thúc {t['finish']} sau deadline {deadline}")
        # 2. ngày làm việc
        for t in leaves:
            if not is_workday(t["start"], holidays):
                fails.append(f"{t['wbs']} bắt đầu vào ngày nghỉ {t['start']} ({t['start']:%a})")
        # 3. predecessors (start ghi tay có thể vi phạm; start tự tính thì luôn đúng)
        for t in leaves:
            for p, kind, lag, raw in parse_preds(t, tasks):
                if kind == "FS":
                    need, got, what = shift_workdays(p["finish"], 1 + lag, holidays), t["start"], "bắt đầu"
                elif kind == "SS":
                    need, got, what = shift_workdays(p["start"], lag, holidays), t["start"], "bắt đầu"
                else:
                    need, got, what = shift_workdays(p["finish"], lag, holidays), t["finish"], "kết thúc"
                if got < need:
                    fails.append(f"{t['wbs']} {what} {got} sớm hơn ràng buộc {raw} (cần ≥ {need}, theo {p['wbs']})")
        # 4. mốc bắt buộc
        for name, due in kv_list(params.get("milestones"), ";").items():
            hits = [t for t in tasks if name.lower() in t["name"].lower()]
            if not hits:
                fails.append(f"Không có công việc nào chứa '{name}' cho mốc {due}")
            elif max(t["finish"] for t in hits) > date.fromisoformat(due):
                fails.append(f"Mốc '{name}' kết thúc {max(t['finish'] for t in hits)} sau hạn {due}")
        # 5. nhân sự
        team_max = {k.lower(): float(v) for k, v in kv_list(params.get("team_max")).items()}
        for t in leaves:
            for disp, key, *_ in ROLES:
                n, pct = t[key]
                if key in team_max and n > team_max[key]:
                    fails.append(f"{t['wbs']}: {disp} {n:g} người > team_max {team_max[key]:g}")
        # 6. MD
        md = {key: sum(t["days"] * t[key][0] * t[key][1] for t in leaves) for _, key, *_ in ROLES}
        total = sum(md.values())
        if params.get("proposal_md"):
            target = float(params["proposal_md"])
            if abs(total - target) > 0.05 * target:
                fails.append(f"Tổng MD plan {total:.1f} lệch > 5% so với proposal {target:g}")
        if total and not 0.05 <= md["pm"] / total <= 0.15:
            warns.append(f"PM chiếm {md['pm'] / total:.0%} tổng MD (thường 8–12%)")
    # 7. tên cũ
    text = "\n".join(t["name"] for t in tasks) + "\n" + proposal_text
    customer = params["customer"].lower()
    for term in filter(None, (s.strip() for s in params.get("stale_terms", "").split(","))):
        if term.lower() != customer and re.search(rf"(?<!\w){re.escape(term)}(?!\w)", text, re.I):
            fails.append(f"Còn tên dự án/khách hàng cũ '{term}' trong WBS hoặc proposal")
    # 8. ngày trong proposal
    for d_, m_, y_ in DATE_RE.findall(proposal_text):
        try:
            d = date(int(y_), int(m_), int(d_))
        except ValueError:
            warns.append(f"Proposal có ngày không hợp lệ {d_}/{m_}/{y_}")
            continue
        if d < kickoff - timedelta(days=90) or (deadline and d > deadline + timedelta(days=400)):
            warns.append(f"Proposal nhắc ngày {d:%d/%m/%Y} — xa kickoff/deadline, kiểm tra có phải ngày cũ không")
    return fails, warns, md, total


def check_requirements(req_text, proposal_text):
    # ponytail: chỉ kiểm mục có thật; trả lời đúng ý hay không vẫn do người rà (skill write-proposal bước 5)
    num = r"(?:[IVX]+(?:\.\d+)*|\d+(?:\.\d+)*|[A-Z])"  # 5.2 · II.1.2 (loại B) · Phụ lục B
    heads = set(re.findall(rf"^#+\s+(?:PHỤ LỤC\s+)?({num})\.?\s", proposal_text, re.M))
    fails = []
    for line in req_text.splitlines():
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if not re.fullmatch(r"R\d+", cells[0].strip("*")):
            continue
        where = cells[4] if len(cells) > 4 else ""
        refs = re.findall(rf"(?:Mục|Phụ lục)\s+({num})(?![\w])", where)
        if not refs:
            fails.append(f"{cells[0]}: chưa có 'Trả lời tại'")
        elif re.search(r"\d\s*[–-]\s*\d", where):
            fails.append(f"{cells[0]}: 'Trả lời tại' ghi khoảng '{where}', cần một mục cụ thể")
        fails += [f"{cells[0]}: không có mục '{r}' trong proposal" for r in refs if r not in heads]
    return fails


SUMMARY = ["Mục tiêu dự án", "Yêu cầu dự án", "Phạm vi", "Công nghệ yêu cầu", "Kết quả mong muốn",
           "Nên làm", "Không nên làm", "Tiêu chí đánh giá", "Khoảng trống"]


def check_summary(req_text):
    # ponytail: chỉ kiểm có chữ dưới mỗi mục; nội dung đúng hay không do anh duyệt ở bước 2.3
    text = re.sub(r"<!--.*?-->", "", req_text, flags=re.S)
    fails = []
    for i, name in enumerate(SUMMARY, 1):
        m = re.search(rf"^###\s+{i}\.\s+{re.escape(name)}[^\n]*\n(.*?)(?=^##?#?\s|\Z)", text, re.M | re.S)
        if not m:
            fails.append(f"01-requirements.md thiếu mục '{name}' (### {i}. {name})")
        elif not [ln for ln in m.group(1).splitlines() if ln.strip() and not ln.startswith("####")]:
            fails.append(f"01-requirements.md: mục {i}. {name} còn trống")
    return fails


def main():
    if len(sys.argv) not in (3, 4):
        sys.exit(__doc__)
    params = read_params(sys.argv[1])
    holidays = parse_holidays(params.get("holidays"))
    kickoff = date.fromisoformat(params["kickoff"])
    tasks = [] if sys.argv[2] == "-" else load_tasks(sys.argv[2], holidays, kickoff)
    proposal = Path(sys.argv[3]).read_text(encoding="utf-8") if len(sys.argv) == 4 else ""
    fails, warns, md, total = check(params, tasks, proposal, holidays)
    req = Path(sys.argv[3]).parent / "01-requirements.md" if len(sys.argv) == 4 else None
    if req and req.exists():
        req_text = req.read_text(encoding="utf-8")
        fails += check_requirements(req_text, proposal) + check_summary(req_text)
    if tasks:
        print(f"Plan {tasks[0]['start']} → {tasks[0]['finish']} ({tasks[0]['days']} ngày làm việc), "
              f"{total:.1f} MD: " + ", ".join(f"{d} {md[k]:.1f}" for d, k, *_ in ROLES))
    for w in warns:
        print("WARN ", w)
    for f in fails:
        print("FAIL ", f)
    print("KẾT QUẢ:", "KHÔNG ĐẠT" if fails else "ĐẠT")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
