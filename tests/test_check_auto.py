"""check_auto.py: chỉ ĐẠT khi đủ mọi sản phẩm của /auto-presale và các kiểm tra đều qua.
Chạy: python3 tests/test_check_auto.py
"""
import os
import sys
import tempfile
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
from check_auto import check_auto  # noqa: E402

SUMMARY = "\n".join(f"### {i}. {n}\n- ý (R001) [T]" for i, n in enumerate(
    ["Mục tiêu dự án", "Yêu cầu dự án", "Phạm vi", "Công nghệ yêu cầu", "Kết quả mong muốn",
     "Nên làm", "Không nên làm", "Tiêu chí đánh giá", "Khoảng trống và điểm cần làm rõ"], 1))


def make(d: Path, review_tail="CÒN LẠI: CRITICAL 0 · HIGH 0\nKẾT LUẬN: ĐẠT (tự động)\n"):
    files = {
        "01-requirements.md": SUMMARY + "\n| R001 | a | Kết quả | 1 | Mục II.1 | x |\n",
        "02-proposal.md": "# II. A\n## II.1. B\n",
        "02-review.md": "# Review\n## Vòng 1\nCÒN LẠI: CRITICAL 2 · HIGH 1\n## Vòng 2\n" + review_tail,
        "03-wbs.md": "x", "03-wbs.csv": "x", "04-master-plan.xlsx": "x",
        "00-auto-summary.md": "## Quyết định tự chốt\n- [D] ...\n",
    }
    for name, text in files.items():
        (d / name).write_text(text, encoding="utf-8")
    later = time.time() + 5
    for name, text in (("02-proposal.docx", "x"), ("04-check.txt", "...\nKẾT QUẢ: ĐẠT\n")):
        (d / name).write_text(text, encoding="utf-8")
        os.utime(d / name, (later, later))  # xuất và kiểm tra sau lần sửa cuối


def main():
    with tempfile.TemporaryDirectory() as t:
        d = Path(t)
        make(d)
        assert all(ok for ok, _ in check_auto(d)), check_auto(d)

        make(d, review_tail="CÒN LẠI: CRITICAL 0 · HIGH 2\n")           # vòng cuối còn HIGH
        assert not check_auto(d)[1][0]

        make(d)
        os.utime(d / "02-proposal.md", (time.time() + 60,) * 2)          # sửa proposal sau khi xuất docx và kiểm tra
        res = check_auto(d)
        assert not res[2][0] and not res[4][0], res

        make(d)
        (d / "00-auto-summary.md").unlink()                               # thiếu bản tóm tắt
        assert not check_auto(d)[5][0]
    print("OK")


if __name__ == "__main__":
    main()
