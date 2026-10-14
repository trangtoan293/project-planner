# Project planner: proposal và master plan cho Hanas Data Platform

Repo hỗ trợ presales của Katalyst: yêu cầu khách → proposal → WBS → master plan. Trả lời anh bằng tiếng Việt.

## Quy trình (mỗi bước một skill, anh duyệt xong mới sang bước sau)

1. `/write-proposal <kh>`: đọc hết `projects/<kh>/01-input/`, tổng hợp 9 mục yêu cầu (mục tiêu, yêu cầu, phạm vi, công nghệ, kết quả, nên/không nên làm, tiêu chí, khoảng trống) theo `templates/01-requirements.md`, interview anh theo skill `grill-me`, viết song song theo nhóm mục, review bằng 5 agent cùng lúc, sinh `00-params.txt`, `01-requirements.md`, `02-proposal.md`, `02-review.md`, `02-proposal.docx`.
2. `/analyze-proposal <kh>`: tạo `03-wbs.md` (đầu việc, căn cứ, MD), duyệt cùng anh.
3. `/master-plan <kh>`: sinh `03-wbs.csv`, `04-master-plan.xlsx`, và `04-check.txt` phải ĐẠT.

**Chạy tự động trọn quy trình:** `/auto-presale <kh>` làm cả 3 bước không dừng hỏi, tự chốt theo phương án Recommended (nhãn `[D]`), review tới khi hết CRITICAL/HIGH, ghi `00-auto-summary.md`. Kèm `/goal python3 scripts/check_auto.py <kh> in ra "AUTO: ĐẠT"` để Claude tự làm tiếp qua nhiều lượt. Anh đọc `00-auto-summary.md` trước khi gửi khách.

## Nguồn sự thật

| Cần biết | Đọc ở đâu |
|---|---|
| Sản phẩm đề xuất làm được gì, **không được hứa gì** | `knowledge/<product>-product.md`; `<product>` lấy từ `00-params.txt` (trống = `hanas`, chép từ `samples/hanas_docs/index.html`) |
| Format và văn phong proposal | `knowledge/proposal-format.md` |
| Benchmark effort, đội ngũ, giai đoạn | `knowledge/estimation.md` |
| Thuật ngữ | `CONTEXT.md` |
| Ngày tháng, giới hạn của **một dự án** | `projects/<kh>/00-params.txt`, duy nhất ở đây |

## Quy tắc chống dữ liệu cũ (bắt buộc)

- `samples/proposal_sample/` và `samples/master_plan_sample/` chỉ dùng để xem **format**. Không chép ngày, tên khách, phạm vi, số người hay MD từ đó sang dự án mới.
- Không mở thư mục `projects/` của khách khác khi đang làm cho một khách.
- Mọi ngày trong proposal và plan phải tính từ `kickoff` trong `00-params.txt`. Trong `03-wbs.csv`, để trống `start` cho script tự tính.
- Trước khi báo xong bất kỳ bước nào, chạy `scripts/check_plan.py` và đọc kết quả. FAIL thì sửa nội dung, không sửa params để lách.

## Agent

Repo này đồng thời là plugin `hanas-presale` (skill ở `skills/`, agent ở `agents/`) và marketplace `project-planner`. Các agent trong `agents/` chia việc theo bước: `proposal-req-extractor`, `proposal-fit-analyst`, `proposal-section-writer`, 5 `proposal-reviewer-*` (`-product` kiểm hứa quá sản phẩm), `proposal-fixer`, `wbs-drafter`, `wbs-reviewer`, `plan-builder`. Skill nào gọi agent nào, chạy song song ra sao: xem bảng đầu `skills/write-proposal/SKILL.md`. Mặc định chạy bằng Codex qua `~/.claude/bin/codex-agent` (gpt-6.1-sol, high; anh không muốn tốn token sonnet). Trạng thái ghi ở `~/.claude/agent-runs/`, hiện ở footer AGENTS của mod `agent-monitor` (cài phạm vi user, `/agent-monitor` để hiện lại). `scripts/codex_agent.sh` là bản đóng gói của script chung, tìm agent trong plugin trước.

## Script

```bash
python3 scripts/md2docx.py <proposal.md> <proposal.docx>                     # proposal → Word đúng format
                                                                            # chỉ xuất khi 02-review.md có 'KẾT LUẬN: ĐẠT'; --draft cho bản nháp
python3 scripts/build_master_plan.py <wbs.csv> <plan.xlsx> --params <params>  # WBS → Excel đúng format mẫu
python3 scripts/check_plan.py <params> <wbs.csv|-> [proposal.md]              # kiểm tra timeline, nhân sự, dữ liệu cũ
python3 scripts/check_auto.py <kh>                                            # /auto-presale đã xong trọn quy trình chưa
python3 tests/test_build_master_plan.py && python3 tests/test_check_plan.py && python3 tests/test_md2docx.py && python3 tests/test_check_auto.py   # sau khi sửa script
```

Cần: `pandoc`, `python-docx`, `openpyxl`, `pymupdf` (fitz, để đọc PDF).

## Cập nhật tri thức

- Hanas có phiên bản mới: thay `samples/hanas_docs/`, rồi chạy lại lệnh chuyển ở đầu `knowledge/hanas-product.md`.
- Có dự án thật đã chạy xong: thêm một dòng vào `knowledge/estimation.md` §3 với số liệu **thực tế** (không phải số đã báo giá).
- Thêm khách mới: thêm tên khách cũ vào `stale_terms` trong `templates/00-params.txt`.
- Thêm sản phẩm mới: tài liệu gốc vào `samples/<product>_docs/`, chuyển thành `knowledge/<product>-product.md` (có bảng "Những điều không được hứa với khách hàng"), tạo `knowledge/<product>-commercial.md`, đặt `product: <product>` trong params của khách.
