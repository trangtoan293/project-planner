# Project planner

Từ yêu cầu khách hàng ra proposal Hanas đúng format, WBS và master plan Excel, có kiểm tra timeline tự động.

## Cài đặt (plugin Claude Code)

```
/plugin marketplace add trangtoan293/project-planner
/plugin install hanas-presale@project-planner
/plugin install presale-board@project-planner     # tùy chọn: bảng tiến độ
```

Cần `python3` với `pandoc`, `python-docx`, `openpyxl`, `pymupdf`. Chạy agent bằng Codex cần `codex` CLI; không có thì skill dùng subagent Claude.
Mở Claude Code trong một thư mục làm việc riêng; dữ liệu khách nằm ở `projects/<kh>/` của thư mục đó, không nằm trong plugin.
Tri thức (`knowledge/`) trong plugin là bản đã ẩn danh; sửa tri thức thì sửa ở repo rồi đẩy lên, không sửa trong bản cài.

## Dùng thế nào

Xem **[HUONG-DAN.md](HUONG-DAN.md)** (1 trang). Tóm tắt:

```
1. Tạo thư mục projects/<ten-kh>/01-input/ và bỏ RFP, BRD, email, biên bản họp vào.
2. Mở Claude Code tại thư mục repo:
   /write-proposal <ten-kh>    → Claude hỏi lần lượt từng điểm chưa rõ (kickoff, mốc, phạm vi…),
                                  rồi xuất 02-proposal.docx. Anh review và sửa.
   /analyze-proposal <ten-kh>  → 03-wbs.md: đầu việc, căn cứ, MD. Duyệt cho tới khi ổn.
   /master-plan <ten-kh>       → 04-master-plan.xlsx và 04-check.txt (phải ĐẠT).
```

Nên mở **phiên Claude mới cho mỗi bước** để ngữ cảnh của bước trước không lẫn vào bước sau. Các file trong `projects/<kh>/` đã đủ để nối tiếp.

## Cấu trúc

```
CLAUDE.md                  quy tắc cho Claude (đọc trước khi sửa repo)
CONTEXT.md                 thuật ngữ
knowledge/                 hanas-product.md · proposal-format.md · estimation.md
templates/                 00-params.txt (thông số dự án) · proposal-reference.docx (style Word)
scripts/                   md2docx.py · build_master_plan.py · check_plan.py
tests/                     test cho 2 script plan
skills/ agents/             4 skill · 12 agent (plugin hanas-presale)
samples/hanas_docs/ samples/proposal_sample/ samples/master_plan_sample/   tài liệu gốc anh cung cấp
projects/<kh>/             mỗi khách một thư mục
```

## Vì sao timeline không còn lệch

- Ngày tháng chỉ nằm ở `00-params.txt`. Trong CSV của WBS, cột `start` để trống; script tự tính ngày từ kickoff, chuỗi phụ thuộc và lịch nghỉ (Tết, lễ).
- `check_plan.py` báo FAIL khi: có việc bắt đầu trước kickoff hoặc trễ deadline; rơi vào ngày nghỉ; vi phạm predecessor; trễ mốc bắt buộc; vượt số người; tổng MD lệch proposal; còn tên khách cũ.

## Bảng Presales trong Claude Code

Mod nằm ở `tools/presale-board/`. Muốn lần nào mở Claude trong repo cũng có bảng:

```bash
claude --plugin-dir tools/presale-board
# hoặc thêm vào ~/.zshrc: export CLAUDE_CODE_PLUGIN_DIRS=<đường-dẫn-repo>/tools/presale-board
```

Test của mod: `claude plugin test tools/presale-board`.
