"""check_plan.py phải ĐẠT với plan sạch và bắt đúng các lỗi lẫn dữ liệu cũ.
Chạy: python3 tests/test_check_plan.py
"""
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HEADER = "wbs,name,duration,start,predecessors,pm_n,pm_pct,ba_n,ba_pct,dev_n,dev_pct,syse_n,syse_pct,tester_n,tester_pct\n"
PARAMS = """customer: KHA
kickoff: 2026-11-02
deadline: 2026-12-31
holidays: 2026-11-20
team_max: PM=1,BA=1,DEV=2,SysE=1,Tester=1
proposal_md: 48
milestones: Go-live<=2026-12-18
stale_terms: KHB, KHC, KHD
"""
# Task ID = thứ tự dòng: 1.1 là task 2, 1.2 (sau task 2) là task 3, 1.3 (sau task 3); 20/11 là ngày lễ → 1.2 kết thúc 23/11
CLEAN = HEADER + """1,Dự án KHA,,,,,,,,,,,,,
1.1,Khởi động,5,2026-11-02,,1,1,1,1,0,0,0,0,0,0
1.2,Xây dựng,10,2026-11-09,2,1,0.2,0,0,2,1,1,0.5,1,0.5
1.3,Go-live và nghiệm thu,1,2026-11-24,3,1,1,1,1,2,1,1,1,1,1
"""


def run(params, csv, proposal=""):
    with tempfile.TemporaryDirectory() as d:
        p, c, m = Path(d) / "params.txt", Path(d) / "wbs.csv", Path(d) / "proposal.md"
        p.write_text(params, encoding="utf-8")
        c.write_text(csv, encoding="utf-8")
        m.write_text(proposal, encoding="utf-8")
        r = subprocess.run([sys.executable, ROOT / "scripts" / "check_plan.py", p, c, m], capture_output=True, text=True)
        return r.returncode, r.stdout + r.stderr


def expect_fail(csv, needle, params=PARAMS, proposal=""):
    code, out = run(params, csv, proposal)
    assert code == 1 and needle in out, f"cần FAIL chứa '{needle}', được:\n{out}"


def main():
    code, out = run(PARAMS, CLEAN, "Khởi động 02/11/2026, go-live 24/11/2026.")
    assert code == 0, out

    expect_fail(CLEAN.replace("2026-11-02", "2025-11-03"), "trước kickoff")             # ngày của dự án cũ
    expect_fail(CLEAN.replace("2026-11-24", "2027-01-05"), "sau deadline")
    # hypercare/bảo hành được phép sau deadline khi khai báo post_deadline; thiếu khai báo thì vẫn FAIL
    support = CLEAN + "1.4,Hypercare 1 tháng,10,2027-01-04,4,0,0,0,0,0,0,0,0,0,0\n"
    expect_fail(support, "sau deadline")
    code, out = run(PARAMS + "post_deadline: Hypercare; Bảo hành\n", support, "Khởi động 02/11/2026, go-live 24/11/2026.")
    assert code == 0, out
    expect_fail(CLEAN.replace("2026-11-09,2", "2026-11-04,2"), "sớm hơn ràng buộc 2")    # đè lên predecessor
    expect_fail(CLEAN.replace("2026-11-09", "2026-11-08"), "ngày nghỉ")                  # Chủ nhật
    expect_fail(CLEAN.replace("2026-11-24,3", "2026-11-20,3"), "ngày nghỉ")              # ngày lễ trong params
    expect_fail(CLEAN.replace(",2,1,1,0.5,1,0.5", ",3,1,1,0.5,1,0.5"), "team_max")       # team size cũ
    expect_fail(CLEAN, "lệch > 5%", params=PARAMS.replace("proposal_md: 48", "proposal_md: 845"))
    expect_fail(CLEAN, "Go-live", params=PARAMS.replace("Go-live<=2026-12-18", "Go-live<=2026-11-20"))
    expect_fail(CLEAN.replace("Dự án KHA", "Dự án KHB"), "'KHB'")                        # tên khách cũ
    expect_fail(CLEAN, "'KHC'", proposal="Như dự án KHC, chúng tôi...")

    sys.path.insert(0, str(ROOT / "scripts"))
    from check_plan import check_requirements
    prop = "# 5. THU THẬP\n## 5.2. IGT\n# PHỤ LỤC B. TIÊU CHÍ\n"
    req = "| R01 | a | Câu hỏi | §7 | Mục 5.2 | x |\n| R02 | b | Kết quả | §8 | Phụ lục B | y |\n"
    assert check_requirements(req, prop) == []
    assert "khoảng" in check_requirements("| R03 | c | Kết quả | §8 | Mục 5–11 | z |", prop)[0]
    assert "không có mục '6.1'" in check_requirements("| R04 | d | Kết quả | §8 | Mục 6.1 | z |", prop)[0]
    assert "chưa có" in check_requirements("| R05 | e | Kết quả | §8 | | |", prop)[0]
    prop_b = "# II. CÁCH TIẾP CẬN\n## II.1. Giải pháp\n### II.1.2. Kiến trúc\n# PHỤ LỤC A. CÂU HỎI\n"  # loại B, số La Mã
    assert check_requirements("| R06 | f | Chức năng | 2.1 | Mục II.1.2 | z |\n| R07 | g | Kết quả | 2.2 | Phụ lục A | z |", prop_b) == []
    assert "không có mục 'II.3'" in check_requirements("| R08 | h | Kết quả | 2.2 | Mục II.3 | z |", prop_b)[0]

    from check_plan import check_summary
    template = (ROOT / "templates" / "01-requirements.md").read_text(encoding="utf-8")
    assert len(check_summary(template)) == 9                                  # template rỗng: 9 mục trống
    filled = "\n".join(f"### {i}. {name}\n- ý (R01) [T]" for i, name in enumerate(
        ["Mục tiêu dự án", "Yêu cầu dự án", "Phạm vi", "Công nghệ yêu cầu", "Kết quả mong muốn",
         "Nên làm", "Không nên làm", "Tiêu chí đánh giá", "Khoảng trống và điểm cần làm rõ"], 1))
    assert check_summary(filled) == []
    real = filled.replace("- ý (R01) [T]", "#### 2.1 Con\n- ý một\n- ý hai") + "\n## Thuật ngữ\n| a | b |\n"
    assert check_summary(real) == []                                          # mục nhiều dòng, có phần sau
    assert "mục 6. Nên làm còn trống" in check_summary(real.replace("### 6. Nên làm\n#### 2.1 Con\n- ý một\n- ý hai", "### 6. Nên làm\n"))[0]
    assert "thiếu mục 'Nên làm'" in check_summary(filled.replace("### 6. Nên làm", "### 6. Khác"))[0]
    print("OK")


if __name__ == "__main__":
    main()
