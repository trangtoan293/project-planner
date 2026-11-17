"""Chép bộ docs Hanas Data Platform (Docusaurus, bản tiếng Việt) vào knowledge/hanas-docs/ và dựng INDEX.md.

Dùng:  python3 scripts/sync_hanas_docs.py <thư-mục-hanas-doc-v2> [thư-mục-đích]
Chạy lại mỗi khi docs có bản mới: xóa .md cũ ở đích, chép lại docs/**/*.md và PRODUCT.md,
bỏ dòng import của MDX, thay thẻ <Diagram> bằng dòng trỏ tới samples/hanas_docs/diagrams/,
và chép sơ đồ tiếng Việt (static/diagrams/vi/*.html, diagrams/vi/*.json) vào samples/hanas_docs/diagrams/.
"""
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IMPORT = re.compile(r"^import .+ from '@site/.+';?\n", re.M)
DIAGRAM = re.compile(r'<Diagram name="([^"]+)" alt="([^"]*)"\s*/>')
FIELD = re.compile(r"^(title|description|sidebar_position):\s*(.*)$", re.M)


def clean(text: str) -> str:
    text = IMPORT.sub("", text)
    return DIAGRAM.sub(r"> Sơ đồ: \2 (`samples/hanas_docs/diagrams/\1.html`)", text)


def front(text: str) -> dict:
    head = text.split("---", 2)[1] if text.startswith("---") else ""
    return {k: v.strip().strip("'\"") for k, v in FIELD.findall(head)}


def order(meta: dict) -> float:
    try:
        return float(meta.get("sidebar_position", 99))
    except ValueError:
        return 99


def source_rev(src: Path) -> str:
    run = subprocess.run(["git", "-C", str(src), "log", "-1", "--format=%h %cs"], capture_output=True, text=True)
    return run.stdout.strip() or "không rõ commit"


def index(pages: dict, rev: str) -> str:
    lines = [
        "# Mục lục tài liệu Hanas Data Platform",
        "",
        f"Chép từ bộ docs chính thức (Docusaurus, bản tiếng Việt), commit {rev}, bằng `scripts/sync_hanas_docs.py`.",
        "Không sửa tay các file trong thư mục này: sửa ở repo docs rồi chạy lại script.",
        "Tìm một tính năng, giới hạn (khối `:::caution`), yêu cầu hạ tầng, cổng hay phiên bản: grep theo từ khóa trong thư mục này.",
        "",
        "| File | Nội dung |",
        "|---|---|",
        "| [PRODUCT.md](PRODUCT.md) | Định vị sản phẩm, tên gọi bắt buộc, điều không hứa, bằng chứng đang có |",
    ]
    for rel, meta in sorted(pages.items(), key=lambda kv: (str(kv[0].parent), kv[0].name != "index.md", order(kv[1]), kv[0].name)):
        lines.append(f"| [{rel}]({rel}) | **{meta.get('title', rel.stem)}**: {meta.get('description', '')} |")
    return "\n".join(lines) + "\n"


def sync(src: Path, dst: Path, diagrams: Path | None = None) -> int:
    docs = src / "docs"
    if not docs.is_dir():
        sys.exit(f"Không thấy {docs}: cần thư mục gốc của repo docs Hanas")
    dst.mkdir(parents=True, exist_ok=True)
    for old in dst.rglob("*.md"):
        old.unlink()
    pages = {}
    for page in sorted(docs.rglob("*.md")):
        rel = page.relative_to(docs)
        text = clean(page.read_text(encoding="utf-8"))
        (dst / rel).parent.mkdir(parents=True, exist_ok=True)
        (dst / rel).write_text(text, encoding="utf-8")
        pages[rel] = front(text)
    if (src / "PRODUCT.md").exists():
        (dst / "PRODUCT.md").write_text((src / "PRODUCT.md").read_text(encoding="utf-8"), encoding="utf-8")
    (dst / "INDEX.md").write_text(index(pages, source_rev(src)), encoding="utf-8")
    if diagrams:
        diagrams.mkdir(parents=True, exist_ok=True)
        for f in [*(src / "static/diagrams/vi").glob("*.html"), *(src / "diagrams/vi").glob("*.json")]:
            shutil.copy2(f, diagrams / f.name)
    return len(pages)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    out = Path(sys.argv[2]) if len(sys.argv) > 2 else ROOT / "knowledge/hanas-docs"
    print(f"Đã chép {sync(Path(sys.argv[1]), out, ROOT / 'samples/hanas_docs/diagrams')} trang vào {out}, sơ đồ vào samples/hanas_docs/diagrams/")
