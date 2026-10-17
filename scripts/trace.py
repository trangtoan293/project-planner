"""Giải thích plan của một khách: con số nào đến từ đâu, theo công thức nào. Chỉ đọc file, không sửa.

Dùng:
    python3 scripts/trace.py projects/<kh>              # tóm tắt: nguồn knowledge, MD theo milestone, người, sprint
    python3 scripts/trace.py projects/<kh> R12          # một yêu cầu: trích, trả lời ở đâu, việc nào làm, bao nhiêu MD
    python3 scripts/trace.py projects/<kh> 1.2.2.1      # một việc: căn cứ, MD và cơ sở ước lượng, lịch, người, sprint
    python3 scripts/trace.py projects/<kh> M1           # một milestone: bàn giao, tiêu chí, MD theo vai trò, sprint
    python3 scripts/trace.py projects/<kh> S5           # một sprint: ngày, MD theo vai trò, tải, việc đang chạy
    python3 scripts/trace.py projects/<kh> --json       # tóm tắt dạng JSON cho bảng Presales
    python3 scripts/trace.py projects/<kh> DEV          # một vai trò (PM/BA/DEV/SysE/Tester hoặc owner như DE): MD, người, việc

Đọc: 00-params.txt, 00-tuning.md (nếu có), 01-requirements.md, 03-wbs.md, 03-wbs.csv.
"""
import json
import re
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from build_master_plan import ROLES, load_tasks, parse_holidays, sprint_label, sprint_rows  # noqa: E402
from check_plan import kv_list, peak_team, read_params  # noqa: E402
from wbs_md2csv import cells, expand_refs, section  # noqa: E402

ROLE_KEYS = {disp.lower(): key for disp, key, *_ in ROLES}


def num(text):
    m = re.search(r"\d+(?:[.,]\d+)?", text or "")
    return float(m.group(0).replace(",", ".")) if m else 0.0


def load(folder):
    """Đọc mọi file của dự án; thiếu file nào thì phần đó rỗng."""
    f = Path(folder)
    read = lambda name: (f / name).read_text(encoding="utf-8") if (f / name).exists() else ""  # noqa: E731
    d = {"name": f.name, "params": read_params(f / "00-params.txt") if (f / "00-params.txt").exists() else {},
         "tuning": tuning_items(read("00-tuning.md")), "reqs": {}, "wbs": {}, "milestones": {}, "tasks": []}
    for line in read("01-requirements.md").splitlines():
        c = cells(line) if line.startswith("|") else []
        if len(c) > 2 and re.fullmatch(r"R\d+", c[0]):
            d["reqs"][c[0]] = {"quote": c[1], "kind": c[2], "where": c[4] if len(c) > 4 else ""}
    md = read("03-wbs.md")
    for line in section(md, 1).splitlines():
        c = cells(line) if line.startswith("|") else []
        if len(c) >= 6 and re.fullmatch(r"1(\.\d+)*", c[0]):
            d["wbs"][c[0]] = {"name": c[1], "basis_ref": c[2], "owner": c[3], "md": num(c[4]), "basis": c[5],
                              "refs": expand_refs(c[2])}
    for line in section(md, 0).splitlines():
        c = cells(line) if line.startswith("|") else []
        m = re.match(r"(M\d+)\b", c[0]) if len(c) >= 4 else None
        if m:
            d["milestones"][m.group(1)] = {"deliver": c[1], "refs": expand_refs(c[2]),
                                           "criteria": [x.strip().removeprefix("- [ ]").strip()
                                                        for x in re.split(r"<br\s*/?>", c[3]) if x.strip()],
                                           "blocked": c[4] if len(c) > 4 else ""}
    if (f / "03-wbs.csv").exists():
        p = d["params"]
        holidays = parse_holidays(p.get("holidays"))
        kickoff = date.fromisoformat(p["kickoff"]) if p.get("kickoff") else None
        try:
            d["tasks"] = load_tasks(f / "03-wbs.csv", holidays, kickoff)
            d["timed"] = True
        except SystemExit:  # CSV mới có cấu trúc, chưa điền thời gian
            d["tasks"], d["timed"] = load_tasks(f / "03-wbs.csv", holidays, timed=False), False
        d["holidays"], d["kickoff"] = holidays, kickoff or (d["tasks"][0].get("start") if d["tasks"] else None)
    return d


def tuning_items(text):
    """Các dòng gạch đầu dòng thật trong 00-tuning.md (bỏ ghi chú <!-- --> và dòng mẫu '- …')."""
    text = re.sub(r"<!--.*?-->", "", text, flags=re.S)
    return [ln.strip()[2:] for ln in text.splitlines() if ln.strip().startswith("- ") and ln.strip() != "- …"]


def leaves(d, prefix=""):
    return [t for t in d["tasks"] if not t["parent"] and (not prefix or t["wbs"].startswith(prefix + "."))]


def plan_md(t):
    return sum(t["days"] * t[key][0] * t[key][1] for _, key, *_ in ROLES) if "days" in t and t.get(ROLES[0][1]) else 0.0


def milestone_rows(d):
    """[(mã M, dòng WBS cấp 2)] theo thứ tự WBS, lấy từ CSV hoặc từ 03-wbs.md."""
    names = {t["wbs"]: t["name"] for t in d["tasks"]} or {w: r["name"] for w, r in d["wbs"].items()}
    rows = [(w, n) for w, n in names.items() if w.count(".") == 1]
    return [((re.match(r"(M\d+)\b", n) or [None])[0], w, n) for w, n in rows]


def team_max(d):
    return {k.lower(): float(v) for k, v in kv_list(d["params"].get("team_max")).items()}


def summary_data(d):
    """Số liệu tóm tắt dạng dict: dùng cho bảng Presales (--json) và bản text."""
    data = {"customer": d["name"], "kickoff": d["params"].get("kickoff", ""), "deadline": d["params"].get("deadline", ""),
            "tuning": len(d["tuning"]), "has_wbs": bool(d["wbs"] or d["tasks"]), "timed": bool(d.get("timed")),
            "total_md": sum(r["md"] for w, r in d["wbs"].items() if w.count(".") == 1), "milestones": [], "people": [],
            "sprint": None}
    for m, w, name in milestone_rows(d):
        tasks = [r for x, r in d["wbs"].items() if x.startswith(w + ".") and not any(y.startswith(x + ".") for y in d["wbs"])]
        refs = d["milestones"].get(m, {}).get("refs") or sorted({r for row in tasks for r in row["refs"]})
        big = max((r for r in tasks if r["owner"] != "PM"), key=lambda r: r["md"], default=None)  # việc PM chạy suốt, không nói lên gì
        short = re.split(r"\s*[:(]", name, maxsplit=1)[0].strip()  # "M1 — Marketing: nguồn …" → "M1 — Marketing"
        data["milestones"].append({"code": m or w, "name": short, "md": d["wbs"].get(w, {}).get("md", 0), "refs": len(refs),
                                   "tasks": len(tasks), "biggest": {"name": big["name"], "md": big["md"]} if big else None})
    if d.get("timed"):
        peak, mx = peak_team(d["tasks"]), team_max(d)
        data["people"] = [{"role": disp, "peak": peak[key], "max": mx.get(key, 0)} for disp, key, *_ in ROLES
                          if peak[key] or mx.get(key)]
        weeks = int(d["params"].get("sprint_weeks") or 2)
        loads = [(r["sprint"], sprint_load(r, mx)) for r in sprint_rows(d["tasks"], d["kickoff"], weeks, d["holidays"])]
        top = max(loads, key=lambda x: x[1], default=("-", 0))
        data["sprint"] = {"count": len(loads), "weeks": weeks, "top": top[0], "load": round(top[1], 3)}
    return data


def summary(d):
    s = summary_data(d)
    out = [f"KHÁCH  {s['customer']} · kickoff {s['kickoff'] or '?'} · hạn {s['deadline'] or '?'}",
           "NGUỒN  knowledge/estimation.md (đơn giá, khung milestone)"
           + (f" · 00-tuning.md: {s['tuning']} điều chỉnh riêng" if s["tuning"] else " · chưa có 00-tuning.md (dùng mặc định)")]
    if not s["has_wbs"]:
        return out + ["Chưa có 03-wbs.md: chạy bước Chia việc trước."]
    out.append(f"MD     {s['total_md']:g} MD WBS = Σ việc (khối lượng × đơn giá, cột 'Cơ sở ước lượng' của 03-wbs.md)")
    for m in s["milestones"]:
        big = m["biggest"]
        out.append(f"{m['name'][:34]:34} {m['md']:>5g} MD · {m['refs']:>2} R · {m['tasks']:>2} việc"
                   + (f" · lớn nhất {big['md']:g} MD {big['name']}" if big else ""))
    if s["timed"]:
        out.append("NGƯỜI  ngày × người × % = MD · đông nhất " + ", ".join(f"{p['role']} {p['peak']:g}/{p['max']:g}" for p in s["people"]))
        sp = s["sprint"]
        out.append(f"SPRINT {sp['count']} sprint {sp['weeks']} tuần · tải cao nhất {sp['top']} {sp['load']:.0%}"
                   + (" · VƯỢT TẢI" if sp["load"] > 1 + 1e-9 else ""))
    else:
        out.append("NGƯỜI  chưa điền thời gian và nhân sự (03-wbs.csv): chưa có lịch, người, sprint")
    return out


def sprint_load(row, mx):
    return max((row["md"][key] / (mx[key] * row["workdays"]) for _, key, *_ in ROLES if mx.get(key) and row["workdays"]), default=0)


def explain_task(d, w):
    r, t = d["wbs"].get(w, {}), next((x for x in d["tasks"] if x["wbs"] == w), None)
    if not r and not t:
        return [f"Không có việc {w} trong 03-wbs.md hay 03-wbs.csv"]
    ms = next((n for m, mw, n in milestone_rows(d) if w.startswith(mw + ".")), "")
    out = [f"VIỆC   {w} {r.get('name') or t['name']}", f"THUỘC  {ms}", f"VAI TRÒ {r.get('owner') or (t or {}).get('owner', '')}"]
    for ref in r.get("refs") or (t or {}).get("refs") or []:
        q = d["reqs"].get(ref)
        out.append(f"CĂN CỨ {ref} [{q['kind']}] {q['quote'][:90]}" if q else f"CĂN CỨ {ref} (không có trong 01-requirements.md)")
    if r:
        out.append(f"MD     {r['md']:g} MD = {r['basis']}")
    if t and d.get("timed") and not t["parent"]:
        roles = [f"{disp} {t[key][0]:g} người × {t[key][1]:.0%}" for disp, key, *_ in ROLES if t[key][0] and t[key][1]]
        out.append(f"LỊCH   {t['start']} → {t['finish']} · {t['days']} ngày làm việc · sprint "
                   f"{sprint_label(t, d['kickoff'], int(d['params'].get('sprint_weeks') or 2))}")
        out.append(f"NGƯỜI  {t['days']} ngày × ({' + '.join(roles) or 'chưa phân bổ'}) = {plan_md(t):.1f} MD"
                   + (f" (WBS {r['md']:g})" if r else ""))
        names = {x["wbs"]: x["name"] for x in d["tasks"]}
        preds = [p.strip() for p in t["pred"].split(",") if p.strip()]
        out += [f"SAU    {p}: {names.get(re.match(r'[\d.]+', p).group(0).rstrip('.'), '')}" for p in preds]
    return out


def explain_req(d, ref):
    q = d["reqs"].get(ref)
    out = [f"YÊU CẦU {ref} [{q['kind']}] {q['quote']}", f"TRẢ LỜI {q['where'] or 'chưa có'}"] if q else [f"Không có {ref} trong 01-requirements.md"]
    hits = [w for w, r in d["wbs"].items() if ref in r["refs"]] or [t["wbs"] for t in d["tasks"] if ref in (t.get("refs") or [])]
    ms = [n for m, w, n in milestone_rows(d) if ref in d["milestones"].get(m, {}).get("refs", [])]
    out += [f"MILESTONE {n}" for n in ms]
    out += [f"VIỆC   {w} {d['wbs'].get(w, {}).get('name', '')} · {d['wbs'].get(w, {}).get('md', 0):g} MD = {d['wbs'].get(w, {}).get('basis', '')}"
            for w in hits]
    return out + ([] if hits or ms else ["Chưa có việc nào làm yêu cầu này (ngoài phạm vi hoặc còn thiếu trong WBS)"])


def explain_milestone(d, m):
    row = next(((w, n) for mm, w, n in milestone_rows(d) if mm == m), None)
    if not row:
        return [f"Không có milestone {m}"]
    w, name = row
    info = d["milestones"].get(m, {})
    out = [f"MILESTONE {name}", f"BÀN GIAO {info.get('deliver', '')}"]
    out += [f"  [ ] {c}" for c in info.get("criteria", [])]
    out.append(f"BỊ CHẶN {info.get('blocked', '')}")
    out.append(f"R PHỦ  {len(info.get('refs', []))}: {' '.join(info.get('refs', []))[:120]}")
    out.append(f"MD     {d['wbs'].get(w, {}).get('md', 0):g} MD WBS")
    lv = leaves(d, w)
    if d.get("timed") and lv:
        md = {disp: sum(t["days"] * t[key][0] * t[key][1] for t in lv) for disp, key, *_ in ROLES}
        weeks = int(d["params"].get("sprint_weeks") or 2)
        out.append("THEO VAI TRÒ " + ", ".join(f"{k} {v:.1f}" for k, v in md.items() if v))
        out.append(f"LỊCH   {min(t['start'] for t in lv)} → {max(t['finish'] for t in lv)} · sprint "
                   f"{sprint_label({'start': min(t['start'] for t in lv), 'finish': max(t['finish'] for t in lv)}, d['kickoff'], weeks)}")
    return out


def explain_sprint(d, s):
    if not d.get("timed"):
        return ["Chưa có lịch (03-wbs.csv chưa điền thời gian)"]
    weeks, mx = int(d["params"].get("sprint_weeks") or 2), team_max(d)
    row = next((r for r in sprint_rows(d["tasks"], d["kickoff"], weeks, d["holidays"]) if r["sprint"] == s), None)
    if not row:
        return [f"Không có sprint {s}"]
    out = [f"SPRINT {s} · {row['start']} → {row['end']} · {row['workdays']} ngày làm việc · milestone {row['milestones']}",
           "MD     " + ", ".join(f"{disp} {row['md'][key]:.1f}/{mx.get(key, 0) * row['workdays']:g}" for disp, key, *_ in ROLES)
           + f" (MD/năng lực) · tải cao nhất {sprint_load(row, mx):.0%}"]
    running = [t for t in leaves(d) if t["start"] <= row["end"] and t["finish"] >= row["start"]]
    return out + [f"VIỆC   {t['wbs']} {t['name'][:60]} · {t.get('owner', '')}" for t in running]


def explain_role(d, role):
    key = ROLE_KEYS.get(role.lower())
    if key:
        lv, mx = leaves(d), team_max(d)
        md = sum(t["days"] * t[key][0] * t[key][1] for t in lv) if d.get("timed") else 0
        out = [f"VAI TRÒ {role.upper()} · {md:.1f} MD trên plan · tối đa {mx.get(key, 0):g} người"
               + (f" · đông nhất {peak_team(d['tasks'])[key]:g} người cùng lúc" if d.get("timed") else "")]
        top = sorted(lv, key=lambda t: -(t["days"] * t[key][0] * t[key][1]) if d.get("timed") else 0)[:10]
        return out + [f"VIỆC   {t['wbs']} {t['name'][:55]} · {t['days'] * t[key][0] * t[key][1]:.1f} MD" for t in top
                      if d.get("timed") and t[key][0] * t[key][1]]
    rows = sorted(((w, r) for w, r in d["wbs"].items() if role.lower() in r["owner"].lower().split("/")), key=lambda x: -x[1]["md"])
    return [f"VAI TRÒ {role} (owner) · {len(rows)} việc · {sum(r['md'] for _, r in rows):g} MD WBS"] + \
           [f"VIỆC   {w} {r['name'][:55]} · {r['md']:g} MD" for w, r in rows[:10]]


def main():
    args = [a for a in sys.argv[1:] if a != "--json"]
    if len(args) not in (1, 2):
        sys.exit(__doc__)
    d = load(args[0])
    item = args[1].strip() if len(args) == 2 else ""
    if "--json" in sys.argv:  # cho bảng Presales: chỉ tóm tắt
        print(json.dumps(summary_data(d), ensure_ascii=False))
        return
    if not item:
        lines = summary(d)
    elif re.fullmatch(r"R\d+", item, re.I):
        lines = explain_req(d, item.upper())
    elif re.fullmatch(r"1(\.\d+)*", item):
        lines = explain_task(d, item)
    elif re.fullmatch(r"M\d+", item, re.I):
        lines = explain_milestone(d, item.upper())
    elif re.fullmatch(r"S\d+", item, re.I):
        lines = explain_sprint(d, item.upper())
    else:
        lines = explain_role(d, item)
    print("\n".join(lines))


if __name__ == "__main__":
    main()
