"""python3 tests/test_check_style.py"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "scripts"))
from check_style import check  # noqa: E402

kinds = lambda text: [k for _, k, _ in check(text)]  # noqa: E731

assert kinds("Đây là phần dịch vụ.") == ["câu chốt 'Đây là…'"]
assert kinds("Hệ thống chạy. Việc nghiệm thu cần biên bản.") == ["danh từ hóa 'Việc + động từ' đầu câu"]
assert kinds("Giải pháp không chỉ lưu trữ mà còn khai thác.") == ["đối lập 'không chỉ… mà còn'"]
assert kinds("Kiến trúc toàn diện.") == ["từ sáo không có số liệu"]
assert kinds("Tối ưu chi phí 30% so với hiện tại.") == []          # có số thì cho qua
assert kinds("Bản ghi được tạo, được ghi nhận và được duyệt.") == ["bị động dày đặc ('được' ≥ 3 lần một câu)"]
assert kinds("Xem Mục 5 của tài liệu này và Mục 6 của tài liệu này.") == ["lặp 'của tài liệu này' (chỉ cần 'Mục X')"]
assert kinds("Katalyst cài. Katalyst cấu hình. Katalyst kiểm.") == ["3 câu liền mở bằng cùng một chữ"]
assert kinds("| Điều 25 | — | — |") == []                            # ô trống trong bảng
assert kinds("---\ntitle: tối ưu toàn diện\n---\n# Kiến trúc toàn diện\n```\nĐây là code\n```\nKatalyst cài OCR.") == []
print("test_check_style: OK")
