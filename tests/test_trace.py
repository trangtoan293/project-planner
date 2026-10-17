"""trace.py giải thích đúng chuỗi R → milestone → việc → MD → lịch → sprint; role_share ghi đè khung tỷ trọng.
Chạy: python3 tests/test_trace.py
"""
import csv
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).parent))
from test_wbs_md2csv import MD  # noqa: E402  bảng WBS mẫu: M1, việc 1.1.1 (DE, 5 MD), 1.1.2 (BI, 4 MD)

PARAMS = "customer: KHA\nkickoff: 2026-11-02\ndeadline: 2026-12-31\nteam_max: PM=1,BA=1,DEV=2,SysE=1,Tester=1\n"
REQ = "| R32 | Nguồn IGT trên SQL Server | Kết quả | §5 | Mục 5.1 | x |\n| R11 | 3 dashboard | Kết quả | §9 | Mục 9 | x |\n"
TUNING = "# Điều chỉnh\n## Đơn giá MD\n<!-- - mẫu -->\n- Tích hợp IGT 1,5 MD/bảng vì không có tài liệu.\n## Khung milestone\n"


def trace(folder, *item):
    r = subprocess.run([sys.executable, ROOT / "scripts" / "trace.py", folder, *item], capture_output=True, text=True)
    assert r.returncode == 0, r.stdout + r.stderr
    return r.stdout


def main():
    with tempfile.TemporaryDirectory() as d:
        kh = Path(d) / "kha"
        kh.mkdir()
        (kh / "00-params.txt").write_text(PARAMS, encoding="utf-8")
        (kh / "01-requirements.md").write_text(REQ, encoding="utf-8")
        (kh / "03-wbs.md").write_text(MD, encoding="utf-8")
        out = trace(kh)
        assert "M1 — Marketing" in out and "9 MD" in out and "lớn nhất 5 MD Tích hợp IGT" in out, out
        assert "chưa có 00-tuning.md" in out and "chưa điền thời gian" in out, out    # chưa có CSV: không có lịch

        subprocess.run([sys.executable, ROOT / "scripts" / "wbs_md2csv.py", kh / "03-wbs.md", kh / "03-wbs.csv"], check=True,
                       capture_output=True)
        with open(kh / "03-wbs.csv", encoding="utf-8") as f:
            rows = list(csv.DictReader(f))
        fill = {"1.1.1": {"duration": "5", "dev_n": "1", "dev_pct": "1"},                     # 5 ngày × 1 DEV
                "1.1.2": {"duration": "8", "predecessors": "1.1.1", "dev_n": "1", "dev_pct": "0.5"}}  # 8 ngày × 0,5 DEV
        with open(kh / "03-wbs.csv", "w", encoding="utf-8", newline="") as f:
            w = csv.DictWriter(f, rows[0].keys())
            w.writeheader()
            w.writerows({**r, **fill.get(r["wbs"], {})} for r in rows)
        (kh / "00-tuning.md").write_text(TUNING, encoding="utf-8")

        out = trace(kh)
        assert "00-tuning.md: 1 điều chỉnh riêng" in out, out                     # dòng trong <!-- --> không tính
        assert "DEV 1/2" in out and "SPRINT 2 sprint 2 tuần" in out, out
        out = trace(kh, "1.1.2")
        assert "CĂN CỨ R11 [Kết quả] 3 dashboard" in out and "MD     4 MD = x" in out, out
        assert "NGƯỜI  8 ngày × (DEV 1 người × 50%) = 4.0 MD (WBS 4)" in out, out
        assert "LỊCH   2026-11-09 → 2026-11-18" in out and "SAU    1.1.1: Tích hợp IGT" in out, out
        out = trace(kh, "R32")
        assert "TRẢ LỜI Mục 5.1" in out and "VIỆC   1.1.1 Tích hợp IGT · 5 MD" in out, out
        out = trace(kh, "M1")
        assert "[ ] Đối soát khớp" in out and "THEO VAI TRÒ DEV 9.0" in out, out
        assert "S1" in trace(kh, "S1") and "VAI TRÒ DE (owner) · 1 việc · 5 MD" in trace(kh, "DE")

    sys.path.insert(0, str(ROOT / "scripts"))
    from check_plan import role_share
    share = role_share({"role_share": "PM=5-18, Tester=6-12"})
    assert share["pm"] == (0.05, 0.18) and share["tester"] == (0.06, 0.12) and share["ba"] == (0.15, 0.30)
    try:
        role_share({"role_share": "QA=5-10"})
        raise AssertionError("vai trò lạ phải báo lỗi")
    except SystemExit as e:
        assert "không hợp lệ" in str(e)
    print("OK")


if __name__ == "__main__":
    main()
