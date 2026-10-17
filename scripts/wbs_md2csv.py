"""Sinh cấu trúc 03-wbs.csv từ 03-wbs.md: wbs, name, owner, refs, note. Không cần agent chép tay.

Dùng:
    python3 scripts/wbs_md2csv.py projects/<kh>/03-wbs.md projects/<kh>/03-wbs.csv

- Việc lấy từ bảng ở mục "## 1." của 03-wbs.md (cột WBS | Việc | Căn cứ | Vai trò chính | ...).
  refs = mọi mã R trong cột Căn cứ, khoảng "R03–R12" được bung ra; owner = cột Vai trò chính.
- Dòng milestone (tên bắt đầu bằng M<n>) lấy refs và note (bàn giao; tiêu chí nghiệm thu) từ bảng
  milestone ở mục "## 0." (cột Milestone | Bàn giao | R phủ | Tiêu chí nghiệm thu | ...).
- CSV đã có: giữ nguyên duration, start, predecessors và cột nhân sự của các WBS còn tồn tại,
  nên chạy lại sau khi sửa 03-wbs.md không mất phần đã điền.
"""
import csv
import re
import sys
from pathlib import Path

COLS = ["wbs", "name", "duration", "start", "predecessors", "pm_n", "pm_pct", "ba_n", "ba_pct", "dev_n", "dev_pct",
        "syse_n", "syse_pct", "tester_n", "tester_pct", "owner", "refs", "note"]
FROM_MD = {"wbs", "name", "owner", "refs", "note"}


def section(md, num):
    m = re.search(rf"^## {num}\..*?(?=^## \d|\Z)", md, re.M | re.S)
    return m.group(0) if m else ""


def cells(line):
    return [c.strip().strip("*").strip() for c in line.strip().strip("|").split("|")]


def expand_refs(text):
    """'R03–R05, R10' → ['R03', 'R04', 'R05', 'R10'] (giữ độ rộng số, bỏ trùng, giữ thứ tự)."""
    out = []
    for a, b in re.findall(r"R(\d+)(?:\s*[–-]\s*R(\d+))?", text):
        nums = range(int(a), int(b) + 1) if b else [int(a)]
        out += [f"R{n:0{len(a)}d}" for n in nums]
    return list(dict.fromkeys(out))


def milestone_notes(md):
    """{'M1': (refs, note)} từ bảng milestone ở mục 0."""
    notes = {}
    for line in section(md, 0).splitlines():
        c = cells(line) if line.startswith("|") else []
        m = re.match(r"(M\d+)\b", c[0]) if len(c) >= 4 else None
        if m:
            criteria = [x.strip().removeprefix("- [ ]").strip() for x in re.split(r"<br\s*/?>", c[3])]
            notes[m.group(1)] = (expand_refs(c[2]), "; ".join([c[1], "Tiêu chí: " + "; ".join(filter(None, criteria))]))
    return notes


def parse(md):
    rows, notes = [], milestone_notes(md)
    for line in section(md, 1).splitlines():
        c = cells(line) if line.startswith("|") else []
        if len(c) < 4 or not re.fullmatch(r"1(\.\d+)*", c[0]):
            continue
        row = {"wbs": c[0], "name": c[1], "owner": c[3], "refs": " ".join(expand_refs(c[2])), "note": ""}
        m = re.match(r"(M\d+)\b", c[1])
        if c[0].count(".") == 1 and m and m.group(1) in notes:
            refs, row["note"] = notes[m.group(1)]
            row["refs"] = " ".join(refs) or row["refs"]
        rows.append(row)
    return rows, notes


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    md_path, out = Path(sys.argv[1]), Path(sys.argv[2])
    rows, notes = parse(md_path.read_text(encoding="utf-8"))
    if not rows:
        sys.exit(f"{md_path}: không thấy bảng WBS ở mục '## 1.' (cột đầu là mã 1, 1.1, 1.1.1…)")
    seen = [r["wbs"] for r in rows]
    if dups := sorted({w for w in seen if seen.count(w) > 1}):
        sys.exit(f"{md_path}: WBS trùng {', '.join(dups)}")
    old = {}
    if out.exists():
        with open(out, encoding="utf-8-sig", newline="") as f:
            old = {r["wbs"].strip(): r for r in csv.DictReader(f) if (r.get("wbs") or "").strip()}
    kept = 0
    for r in rows:
        prev = old.get(r["wbs"], {})
        kept += bool(prev)
        r.update({k: prev.get(k) or "" for k in COLS if k not in FROM_MD})
    with open(out, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, COLS)
        w.writeheader()
        w.writerows(rows)
    milestones = [r for r in rows if r["wbs"].count(".") == 1]
    print(f"Đã ghi {out}: {len(rows)} dòng, {sum(not any(x['wbs'].startswith(r['wbs'] + '.') for x in rows) for r in rows)} việc chi tiết, "
          f"{len(milestones)} milestone; giữ số liệu cũ của {kept} dòng")
    for r in milestones:
        if not r["note"]:
            print(f"WARN  {r['wbs']} '{r['name']}': không khớp dòng nào trong bảng milestone mục 0 (cần tên bắt đầu bằng M<n>)")
    for r in rows:
        if r["wbs"].count(".") >= 2 and not any(x["wbs"].startswith(r["wbs"] + ".") for x in rows) and not r["owner"]:
            print(f"WARN  {r['wbs']} '{r['name']}': thiếu Vai trò chính")


if __name__ == "__main__":
    main()
