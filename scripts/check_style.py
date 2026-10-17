#!/usr/bin/env python3
"""Bắt dấu hiệu văn AI trong proposal tiếng Việt, không tốn token.

    python3 scripts/check_style.py <proposal.md>

In mỗi lỗi một dòng "STYLE <dòng>: <loại> | <đoạn trích>", cuối cùng "STYLE: ĐẠT" hoặc "STYLE: <n> lỗi".
Exit 1 khi còn lỗi. Bỏ qua bảng tiêu đề, front matter, khối code.
Từ sáo chỉ bị bắt khi câu không có con số đi kèm ("giảm 30% chi phí, tối ưu…" thì cho qua).
"""
import re
import sys

# (regex, loại, chỉ bắt khi câu không có số)
RULES = [
    (r"không (chỉ|những|đơn thuần)\b.{0,80}?\b(mà còn|mà là)", "đối lập 'không chỉ… mà còn'", False),
    (r"không phải (là )?.{1,60}?, ?mà (là)?", "đối lập 'không phải X mà là Y'", False),
    (r"\b(hàng đầu|toàn diện|vượt trội|đột phá|mạnh mẽ|liền mạch|tối ưu|tiên tiến|hiện đại nhất|đẳng cấp|vững chắc)\b",
     "từ sáo không có số liệu", True),
    (r"\b(nâng tầm|khai phá|khai mở|chìa khóa|hành trình|bức tranh toàn cảnh|kỷ nguyên|cuộc cách mạng|bệ phóng|đòn bẩy)\b",
     "ẩn dụ quảng cáo", False),
    (r"\b(đóng vai trò (then chốt|quan trọng|cốt lõi)|giữ vai trò (then chốt|quan trọng)|là nền tảng vững chắc)\b",
     "cụm phóng đại vai trò", False),
    (r"\bmột cách (hiệu quả|toàn diện|tối ưu|linh hoạt|nhanh chóng|dễ dàng|liền mạch|bài bản)\b", "trạng từ rỗng 'một cách…'", False),
    (r"\b(hiệu quả|linh hoạt|nhanh chóng|dễ dàng|bài bản|chuyên nghiệp)\b", "tính từ khen không có số liệu", True),
    (r"(^|[.!?]\s+)(Tóm lại|Nhìn chung|Có thể nói|Nói cách khác|Điều đáng chú ý là|Đáng chú ý|Quan trọng hơn( cả)?|Không chỉ vậy|Hơn thế nữa|Trên hết)[,:]",
     "mở câu dàn dựng", False),
    (r"(^|[.!?]\s+)Điều này (giúp|cho phép|đảm bảo|mang lại|góp phần)", "câu nối 'Điều này giúp…'", False),
    (r"\b(cam kết mang (lại|đến)|mang lại giá trị|giá trị gia tăng|trải nghiệm vượt trội|giải pháp tối ưu|đồng hành cùng)\b",
     "lời quảng cáo", False),
    (r"\b(góp phần (quan trọng|to lớn)|tạo tiền đề|đặt nền móng|mở ra (cơ hội|hướng))\b", "câu kết chung chung", False),
    (r"^\s*[-*]\s+\*\*[^*]{1,40}:\*\*", "nhãn in đậm đầu bullet", False),
    (r"(^|[.!?]\s+)(Đây là|Đó là|Đây chính là) ", "câu chốt 'Đây là…'", False),
    (r"(^|[.!?]\s+)Việc [a-zà-ỹđ]+ ", "danh từ hóa 'Việc + động từ' đầu câu", False),
    (r"(^|[.!?]\s+)(Trong bối cảnh|Với mục tiêu|Về mặt|Xét về|Nhằm mục đích)\b", "mở câu vòng vo", False),
    (r"\bkhông có nghĩa (là )?", "rào đón 'không có nghĩa là'", False),
    (r"\bnhằm (đảm bảo|mục đích|giúp)\b", "đệm 'nhằm đảm bảo'", False),
]
# Luật đếm trên cả dòng/câu: (regex, ngưỡng, loại)
REPEATS = [
    (r"của tài liệu này", 2, "lặp 'của tài liệu này' (chỉ cần 'Mục X')"),
]
PASSIVE = re.compile(r"\bđược\b")
DASH = re.compile(r"\s[—–]\s")
DIGIT = re.compile(r"\d")
SENTENCE = re.compile(r"[^.!?\n]*[.!?]?")
TABLE_HEADER = re.compile(r"^\|\s*\*\*")


def prose_lines(text):
    """(số dòng, nội dung) của phần văn xuôi và ô bảng; bỏ front matter, code, tiêu đề, dòng tiêu đề bảng."""
    in_code = in_front = False
    for no, line in enumerate(text.split("\n"), 1):
        if no == 1 and line.strip() == "---":
            in_front = True
            continue
        if in_front:
            in_front = line.strip() != "---"
            continue
        if line.lstrip().startswith("```"):
            in_code = not in_code
            continue
        if in_code or line.startswith("#") or TABLE_HEADER.match(line) or re.match(r"^\|[\s:|-]+\|$", line):
            continue
        yield no, line


def check(text):
    hits = []
    for no, line in prose_lines(text):
        for pattern, kind, needs_no_digit in RULES:
            for m in re.finditer(pattern, line, flags=re.I):
                sentence = next((x.group(0) for x in SENTENCE.finditer(line) if x.start() <= m.end() - 1 < x.end()), line)
                if needs_no_digit and DIGIT.search(sentence):
                    continue
                hits.append((no, kind, sentence.strip()[:110]))
        for pattern, limit, kind in REPEATS:
            if len(re.findall(pattern, line)) >= limit:
                hits.append((no, kind, line.strip()[:110]))
        sentences = [x.strip() for x in SENTENCE.findall(line) if x.strip()]
        for x in sentences:
            if len(PASSIVE.findall(x)) >= 3:
                hits.append((no, "bị động dày đặc ('được' ≥ 3 lần một câu)", x[:110]))
        starts = [x.split()[0] for x in sentences if x.split()]
        if any(starts[i] == starts[i + 1] == starts[i + 2] for i in range(len(starts) - 2)):
            hits.append((no, "3 câu liền mở bằng cùng một chữ", line.strip()[:110]))
        if line.startswith("|"):
            continue  # ô "—" trong bảng là ô trống, không phải gạch ngang trong câu
        # ponytail: ngưỡng 2 gạch ngang một dòng là heuristic; tăng nếu bảng có nhiều khoảng ngày "A – B"
        if len(DASH.findall(line)) >= 2:
            hits.append((no, "gạch ngang dày đặc", line.strip()[:110]))
    return hits


def main(argv):
    if len(argv) != 2:
        print(__doc__.strip().split("\n\n")[1])
        return 2
    try:
        text = open(argv[1], encoding="utf-8").read()
    except OSError as err:
        print(f"Không đọc được {argv[1]}: {err}")
        return 2
    hits = check(text)
    for no, kind, excerpt in hits:
        print(f"STYLE {no}: {kind} | {excerpt}")
    print("STYLE: ĐẠT" if not hits else f"STYLE: {len(hits)} lỗi")
    return 1 if hits else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
