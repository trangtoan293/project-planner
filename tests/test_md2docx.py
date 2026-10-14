"""Chốt chặn: chỉ xuất .docx gửi khách khi 02-review.md kết luận ĐẠT."""
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
from md2docx import review_passed  # noqa: E402


def main():
    with tempfile.TemporaryDirectory() as d:
        d = Path(d)
        assert not review_passed(d)                                           # chưa review
        (d / "02-review.md").write_text("# Review\nKẾT LUẬN: KHÔNG ĐẠT\n", encoding="utf-8")
        assert not review_passed(d)
        (d / "02-review.md").write_text("# Review\n| CRITICAL | x |\nKẾT LUẬN: ĐẠT\n", encoding="utf-8")
        assert review_passed(d)
    print("OK")


if __name__ == "__main__":
    main()
