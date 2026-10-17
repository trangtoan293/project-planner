"""wbs_md2csv.py: lấy đúng bảng WBS, bung khoảng R, gắn note milestone, giữ số liệu đã điền khi chạy lại.
Chạy: python3 tests/test_wbs_md2csv.py
"""
import csv
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MD = """# WBS — demo

## 0. Kiến trúc nền và Milestone

| Milestone | Bàn giao | R phủ | Tiêu chí nghiệm thu | Bị chặn bởi |
|---|---|---|---|---|
| M1 — Marketing (T5–T16) | Mart Marketing, 3 dashboard | R03–R05, R10 | - [ ] Đối soát khớp<br>- [ ] UAT ký | M0 |

## 1. Bảng WBS

| WBS | Việc | Căn cứ (mục proposal / R##) | Vai trò chính | MD | Cơ sở ước lượng |
|---|---|---|---|---|---|
| **1** | **Dự án** | | | **9** | |
| **1.1** | **M1 — Marketing** | | | **9** | |
| 1.1.1 | Tích hợp IGT | §5.1; R32, R49 | DE | 5 | x |
| 1.1.2 | 3 dashboard | §9; R11–R12 | BI | 4 | x |

## 4. Đối chiếu ngược

| Mục proposal | WBS |
|---|---|
| 1.1 | 1.1.1 |
"""


def run(md_text, csv_path):
    md = csv_path.parent / "03-wbs.md"
    md.write_text(md_text, encoding="utf-8")
    r = subprocess.run([sys.executable, ROOT / "scripts" / "wbs_md2csv.py", md, csv_path], capture_output=True, text=True)
    assert r.returncode == 0, r.stdout + r.stderr
    with open(csv_path, encoding="utf-8") as f:
        return {row["wbs"]: row for row in csv.DictReader(f)}, r.stdout


def main():
    with tempfile.TemporaryDirectory() as d:
        out = Path(d) / "03-wbs.csv"
        rows, _ = run(MD, out)
        assert list(rows) == ["1", "1.1", "1.1.1", "1.1.2"], list(rows)            # bảng mục 4 không lẫn vào
        assert rows["1.1.1"]["owner"] == "DE" and rows["1.1.1"]["refs"] == "R32 R49"
        assert rows["1.1.2"]["refs"] == "R11 R12"                                   # bung khoảng
        assert rows["1.1"]["refs"] == "R03 R04 R05 R10", rows["1.1"]                # refs milestone từ bảng mục 0
        assert rows["1.1"]["note"] == "Mart Marketing, 3 dashboard; Tiêu chí: Đối soát khớp; UAT ký", rows["1.1"]["note"]
        assert rows["1.1.1"]["duration"] == ""                                      # số liệu để trống

        with open(out, encoding="utf-8") as f:                                      # giả lập đã điền thời gian
            text = f.read()
        out.write_text(text.replace("1.1.1,Tích hợp IGT,,,", "1.1.1,Tích hợp IGT,5,,1.0.9"), encoding="utf-8")
        rows, msg = run(MD.replace("Tích hợp IGT", "Tích hợp IGT 15 bảng"), out)  # sửa tên trong md rồi chạy lại
        assert rows["1.1.1"]["name"] == "Tích hợp IGT 15 bảng" and rows["1.1.1"]["duration"] == "5", rows["1.1.1"]
        assert rows["1.1.1"]["predecessors"] == "1.0.9" and "giữ số liệu cũ của 4 dòng" in msg, msg
    print("OK")


if __name__ == "__main__":
    main()
