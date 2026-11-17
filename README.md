# Project planner (plugin `hanas-presale`)

Plugin Claude Code cho presales Hanas Data Platform (nội bộ Katalyst): từ tài liệu khách ra proposal Word đúng format, WBS và master plan Excel, có kiểm tra timeline tự động và bảng tiến độ `/presale`.

## Cài đặt

```
/plugin marketplace add trangtoan293/project-planner
/plugin install hanas-presale@project-planner
```

Cập nhật bản mới: `/plugin marketplace update project-planner`.

Máy cần:

| Cần | Để làm gì |
|---|---|
| `python3` + `pip install python-docx openpyxl pymupdf` | dựng Word, Excel, đọc PDF |
| `pandoc` (`brew install pandoc`) | đọc .docx của khách, xuất proposal |
| `codex` CLI (tùy chọn) | chạy agent bằng Codex cho đỡ tốn token Claude; không có thì skill tự dùng subagent Claude |
| skill `humanizer`, `grill-me` (tùy chọn) | rà câu chữ, interview; không có thì Claude làm theo mô tả trong skill, `check_style.py` vẫn kiểm |

## Dùng thế nào

Mở Claude Code trong **một thư mục làm việc riêng** (không phải thư mục cài plugin). Dữ liệu khách nằm ở `projects/<kh>/` của thư mục đó.

```
/presale new <kh>           → tạo projects/<kh>/, bỏ RFP, BRD, email, biên bản họp vào 01-input/
/write-proposal <kh>        → Claude hỏi từng điểm chưa rõ, rồi xuất 02-proposal.docx
/analyze-proposal <kh>      → 03-wbs.md: đầu việc, căn cứ, MD
/master-plan <kh>           → 03-task-list.xlsx cho đội rà, rồi 04-master-plan.xlsx và 04-check.txt (phải ĐẠT)
/auto-presale <kh>          → chạy trọn 3 bước không dừng hỏi, ghi 00-auto-summary.md để đọc lại
```

Hướng dẫn 1 trang: **[HUONG-DAN.md](HUONG-DAN.md)**. Logic từ yêu cầu ra milestone, MD, người: [docs/cach-hoat-dong.md](docs/cach-hoat-dong.md).

Mỗi bước nên mở phiên Claude mới (`/clear`) để ngữ cảnh bước trước, khách khác không lẫn vào. Các file trong `projects/<kh>/` đủ để nối tiếp.

Bảng Presales tự mở khi phiên bắt đầu ở thư mục có `projects/`; ở thư mục khác gõ `/presale` để mở.

## Lưu ý bảo mật

- `knowledge/` chỉ có tri thức Hanas (sản phẩm, thương mại) và benchmark ước lượng đã ẩn tên khách, nhưng có đơn giá và số MD thật. Repo chỉ chia sẻ trong công ty.
- Không commit `projects/` hay tài liệu khách vào repo này (`.gitignore` đã chặn).

## Cấu trúc

```
.claude-plugin/            plugin.json, marketplace.json
skills/                    write-proposal · analyze-proposal · master-plan · auto-presale · explain
agents/                    11 agent con (tách yêu cầu, viết, review, WBS, plan)
hooks/ types/              bảng tiến độ /presale (mod Claude Code)
scripts/                   md2docx · wbs_md2csv · build_master_plan · check_plan · check_style · check_auto · trace · codex_agent.sh
knowledge/                 hanas-product.md (sổ tay bán hàng) · hanas-docs/ (docs chính thức, 76 trang) · hanas-commercial.md · proposal-format.md · estimation.md
templates/                 00-params.txt · 00-tuning.md · 01-requirements.md · proposal-reference.docx
samples/hanas_docs/        tài liệu gốc Hanas (nguồn của knowledge/hanas-product.md)
docs/                      cách hoạt động
tests/                     test script (Python) và bảng (*.test.ts)
CLAUDE.md · CONTEXT.md     quy tắc khi sửa repo · thuật ngữ
```

## Phát triển plugin

Sửa trong repo rồi đẩy lên; không sửa bản cài trong `~/.claude/plugins/`. Thử bản đang sửa: `claude --plugin-dir <đường-dẫn-repo>`.

```bash
for t in tests/test_*.py; do python3 "$t" || break; done   # script
claude plugin test . && claude plugin validate .           # bảng và manifest
```

Phát hành: tăng `version` trong `.claude-plugin/plugin.json`, commit, push. Người dùng chạy `/plugin marketplace update project-planner`.
