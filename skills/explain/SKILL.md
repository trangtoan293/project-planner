---
name: explain
description: Giải thích logic presales cho người dùng - plugin đọc tài liệu khách, chia milestone, sprint, đầu việc, tính MD, xếp người ra sao, và vì sao một con số cụ thể của một khách ra như vậy (yêu cầu R, việc WBS, milestone, sprint, vai trò). Dùng khi người dùng hỏi "vì sao", "giải thích", "logic", "tính thế nào", "lấy từ đâu", "cách hoạt động", hoặc muốn chỉnh quy tắc cho một dự án.
---

# Giải thích logic và con số

Trả lời bằng tiếng Việt, ngắn, có công thức và nguồn. **Không trả lời theo trí nhớ**: con số lấy từ script hoặc file, quy tắc lấy từ file đang có trong repo.

## Câu hỏi chung (chưa nói khách nào)

Đọc `${CLAUDE_PLUGIN_ROOT}/docs/cach-hoat-dong.md`, trả lời đúng phần được hỏi. Cần số cụ thể (đơn giá, khung tỷ trọng, khung milestone) thì đọc thêm `${CLAUDE_PLUGIN_ROOT}/knowledge/estimation.md`, và nói rõ số đó lấy từ mục nào.

## Câu hỏi về một khách

Chạy từ thư mục có `projects/`:

```bash
python3 ${CLAUDE_PLUGIN_ROOT}/scripts/trace.py projects/<kh> [mục]
```

`mục` là mã yêu cầu (`R12`), mã việc (`1.2.2.1`), milestone (`M1`), sprint (`S5`), vai trò (`DEV`, hoặc owner như `DE`); bỏ trống để xem tóm tắt. Không rõ khách nào thì hỏi lại; có một khách duy nhất thì dùng khách đó.

Trình bày theo chuỗi, mỗi bước một dòng, giữ nguyên số của script:

1. **Căn cứ:** yêu cầu R nào (trích ngắn), trả lời ở mục nào của proposal.
2. **Milestone:** thuộc milestone nào, bàn giao và tiêu chí nghiệm thu.
3. **MD:** công thức ở cột "Cơ sở ước lượng" (khối lượng × đơn giá); đơn giá lấy từ dòng nào của `estimation.md`, hoặc từ `00-tuning.md`, hoặc là giả định.
4. **Lịch và người:** ngày làm việc × người × % = MD trên plan; lệch với MD trong WBS thì nói lý do (làm tròn % theo bậc 25/50/75/100).
5. **Sprint:** chạy ở sprint nào, sprint đó tải bao nhiêu.

Người dùng hỏi "sao không phải X" (ví dụ "sao không 10 MD") thì chỉ ra con số nào trong chuỗi phải đổi để ra X, và đổi ở đâu.

## Muốn chỉnh cho dự án

Theo bảng "Chỉnh cho từng dự án" ở `${CLAUDE_PLUGIN_ROOT}/docs/cach-hoat-dong.md`:

- Con số script kiểm (ngày, `team_max`, `role_share`, `sprint_weeks`, `pm_min`): sửa `projects/<kh>/00-params.txt`.
- Đơn giá, khung milestone, vai trò, quy tắc khác: thêm một gạch đầu dòng **kèm lý do** vào `projects/<kh>/00-tuning.md` (chưa có thì chép `${CLAUDE_PLUGIN_ROOT}/templates/00-tuning.md`).

Hỏi người dùng xác nhận trước khi ghi file. Ghi xong nói rõ bước nào phải chạy lại để con số đổi theo: đổi đơn giá hoặc milestone thì chạy lại Chia việc (`03-wbs.md`); chỉ đổi params thì chạy lại Lịch (master plan). Hồ sơ thầu quy định thì không chỉnh trái hồ sơ thầu.
