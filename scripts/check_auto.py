"""Kiểm tra một lần chạy tự động /auto-presale đã xong trọn quy trình chưa (điều kiện cho /goal).

Dùng:
    python3 scripts/check_auto.py <kh>        # projects/<kh>/ trong thư mục hiện tại

In từng mục ✓/✗ rồi dòng cuối "AUTO: ĐẠT" hoặc "AUTO: CHƯA ĐẠT"; thoát mã 1 khi chưa đạt.
Kiểm tra:
  1. 01-requirements.md: đủ 9 mục tổng hợp, mọi dòng R có "Trả lời tại" trỏ tới mục có thật.
  2. 02-review.md: vòng cuối ghi "CÒN LẠI: CRITICAL 0 · HIGH 0" và có "KẾT LUẬN: ĐẠT".
  3. 02-proposal.docx mới hơn 02-proposal.md (đã xuất lại sau lần sửa cuối).
  4. 03-wbs.md, 03-wbs.csv, 03-task-list.xlsx, 04-master-plan.xlsx có; 04-check.txt kết thúc "KẾT QUẢ: ĐẠT" và mới hơn 03-wbs.csv, 02-proposal.md.
  5. 00-auto-summary.md có mục "Quyết định tự chốt".
"""
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from check_plan import check_requirements, check_summary  # noqa: E402


def newer(a: Path, *others: Path) -> bool:
    return a.exists() and all(o.exists() and a.stat().st_mtime >= o.stat().st_mtime for o in others)


def check_auto(folder: Path) -> list[tuple[bool, str]]:
    f = {name: folder / name for name in (
        "01-requirements.md", "02-proposal.md", "02-proposal.docx", "02-review.md",
        "03-wbs.md", "03-wbs.csv", "03-task-list.xlsx", "04-master-plan.xlsx", "04-check.txt", "00-auto-summary.md")}
    read = lambda key: f[key].read_text(encoding="utf-8") if f[key].exists() else ""  # noqa: E731
    req, proposal, review, check = read("01-requirements.md"), read("02-proposal.md"), read("02-review.md"), read("04-check.txt")

    req_fails = (check_summary(req) + check_requirements(req, proposal)) if req and proposal else ["thiếu file"]
    rounds = re.split(r"^## Vòng", review, flags=re.M)
    last = rounds[-1] if len(rounds) > 1 else ""
    return [
        (not req_fails, f"01-requirements.md đủ 9 mục, mọi R có mục trả lời ({len(req_fails)} lỗi)"),
        (bool(re.search(r"CÒN LẠI:\s*CRITICAL 0\s*·\s*HIGH 0", last)) and "KẾT LUẬN: ĐẠT" in review,
         "02-review.md: vòng cuối hết CRITICAL/HIGH và có KẾT LUẬN: ĐẠT"),
        (newer(f["02-proposal.docx"], f["02-proposal.md"]), "02-proposal.docx xuất sau lần sửa cuối của 02-proposal.md"),
        (all(f[k].exists() for k in ("03-wbs.md", "03-wbs.csv", "03-task-list.xlsx", "04-master-plan.xlsx")),
         "có 03-wbs.md, 03-wbs.csv, 03-task-list.xlsx, 04-master-plan.xlsx"),
        (check.rstrip().endswith("KẾT QUẢ: ĐẠT") and newer(f["04-check.txt"], f["03-wbs.csv"], f["02-proposal.md"]),
         "04-check.txt ĐẠT và chạy sau lần sửa cuối của WBS, proposal"),
        ("Quyết định tự chốt" in read("00-auto-summary.md"), "00-auto-summary.md có mục Quyết định tự chốt"),
    ]


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    folder = Path("projects") / sys.argv[1]  # thư mục làm việc hiện tại
    results = check_auto(folder)
    for ok, label in results:
        print("✓" if ok else "✗", label)
    passed = all(ok for ok, _ in results)
    print("AUTO: ĐẠT" if passed else "AUTO: CHƯA ĐẠT")
    sys.exit(0 if passed else 1)


if __name__ == "__main__":
    main()
