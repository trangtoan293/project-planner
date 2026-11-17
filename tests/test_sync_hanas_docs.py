"""Kiểm sync_hanas_docs.py trên một repo docs giả.
Chạy: python3 tests/test_sync_hanas_docs.py
"""
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "scripts"))
from sync_hanas_docs import sync  # noqa: E402

PAGE = """---
title: Kiến trúc
sidebar_position: 2
description: Các lớp của nền tảng.
---

import Diagram from '@site/src/components/Diagram';

<Diagram name="01-tong-quan" alt="Kiến trúc tổng thể" />

Xem [khái niệm](concepts.md).
"""

with tempfile.TemporaryDirectory() as tmp:
    src, dst = Path(tmp, "src"), Path(tmp, "dst")
    (src / "docs/get-started").mkdir(parents=True)
    (src / "docs/get-started/architecture.md").write_text(PAGE, encoding="utf-8")
    (src / "docs/get-started/index.md").write_text("---\ntitle: Bắt đầu\n---\n", encoding="utf-8")
    (src / "PRODUCT.md").write_text("# Product\n", encoding="utf-8")
    (src / "static/diagrams/vi").mkdir(parents=True)
    (src / "static/diagrams/vi/01-tong-quan.html").write_text("<html>mới</html>", encoding="utf-8")
    (src / "diagrams/vi").mkdir(parents=True)
    (src / "diagrams/vi/01-tong-quan.architecture.json").write_text("{}", encoding="utf-8")
    diagrams = Path(tmp, "diagrams")
    (dst / "cu").mkdir(parents=True)
    (dst / "cu/trang-da-xoa.md").write_text("cũ", encoding="utf-8")

    assert sync(src, dst, diagrams) == 2
    assert (diagrams / "01-tong-quan.html").read_text(encoding="utf-8") == "<html>mới</html>"
    assert (diagrams / "01-tong-quan.architecture.json").exists()
    out = (dst / "get-started/architecture.md").read_text(encoding="utf-8")
    assert "import Diagram" not in out and "<Diagram" not in out, out
    assert "> Sơ đồ: Kiến trúc tổng thể (`samples/hanas_docs/diagrams/01-tong-quan.html`)" in out, out
    assert "Xem [khái niệm](concepts.md)." in out              # nội dung và link giữ nguyên
    assert not (dst / "cu/trang-da-xoa.md").exists()           # trang đã xóa ở nguồn thì xóa ở đích
    assert (dst / "PRODUCT.md").exists()
    idx = (dst / "INDEX.md").read_text(encoding="utf-8")
    assert idx.index("get-started/index.md") < idx.index("get-started/architecture.md"), idx
    assert "**Kiến trúc**: Các lớp của nền tảng." in idx, idx

print("test_sync_hanas_docs: ĐẠT")
