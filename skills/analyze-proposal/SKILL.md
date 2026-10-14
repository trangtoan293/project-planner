---
name: analyze-proposal
description: Phân tích proposal đã chốt thành WBS (đầu việc, căn cứ, effort MD) cho projects/<kh>/. Dùng khi anh gõ /analyze-proposal <kh>.
disable-model-invocation: true
---

# Phân tích proposal → WBS

Quy tắc chung (bắt buộc): làm trong thư mục có `projects/`; đọc mục "Quy tắc chống dữ liệu cũ" trong `${CLAUDE_PLUGIN_ROOT}/CLAUDE.md` trước khi bắt đầu.

Đầu vào: `02-proposal.md` (hoặc .docx/.pdf anh đưa), `01-requirements.md`, `00-params.txt`. Đầu ra: `03-wbs.md`.

## 1. Đọc

- Proposal, danh sách yêu cầu, params của **dự án này**; `${CLAUDE_PLUGIN_ROOT}/knowledge/estimation.md`; `${CLAUDE_PLUGIN_ROOT}/CONTEXT.md`.
- Proposal không do repo này sinh ra: tạo `00-params.txt` trước bằng các câu hỏi ở bước 2 của `/write-proposal`. Riêng mục 2 (ngày tháng) thì không được bỏ qua.

## 2. Dựng WBS

Giao agent `wbs-drafter` dựng bản đầu bằng Codex (tiết kiệm token Claude), chạy từ thư mục làm việc (nơi có `projects/`):

```bash
${CLAUDE_PLUGIN_ROOT}/scripts/codex_agent.sh wbs-drafter projects/<kh>/review/wbs-drafter.md "Khách: <kh> (projects/<kh>). Dựng projects/<kh>/03-wbs.md theo chỉ dẫn."
```

Đọc báo cáo trả về, rà các giả định ước lượng agent tự đặt. Quy tắc agent phải theo:

Liệt kê mọi thứ proposal **cam kết bàn giao**: phạm vi, gói bàn giao, tài liệu, đào tạo, nghiệm thu, hypercare. Mỗi thứ phải có ít nhất một việc.

`03-wbs.md` gồm:

1. Bảng WBS: **WBS | Việc | Căn cứ (mục proposal / R##) | Vai trò chính | MD | Cơ sở ước lượng**.
   - Cấp: `1` dự án → `1.x` "M<n> — …" → (`1.x.y` nhóm) → việc chi tiết.
   - "Cơ sở ước lượng" là một dòng benchmark trong `estimation.md` (ví dụ "báo cáo customization ~8 MD × 6"), hoặc một giả định viết rõ. **Không chép MD của dự án mẫu mà không nêu lý do giống nhau.**
   - Luôn có: quản lý dự án (~10%), SIT, UAT, go-live, hypercare, đào tạo, việc phía khách (nhóm "M — Điều kiện sẵn sàng phía <KH>", 0 MD vendor).
2. Tổng MD theo milestone và theo vai trò; so với các dự án cùng loại trong `estimation.md` §3.
3. Giả định, phụ thuộc phía khách, rủi ro ảnh hưởng effort.
4. Bảng đối chiếu ngược **Mục proposal → WBS** để chứng minh không sót.

## 3. Duyệt với anh (lặp lại đến khi anh đồng ý)

Trước khi trình anh, chạy `wbs-reviewer` bằng `${CLAUDE_PLUGIN_ROOT}/scripts/codex_agent.sh wbs-reviewer projects/<kh>/review/wbs-review.md "Khách: <kh> ..."`. Sửa mọi CRITICAL và HIGH trong `03-wbs.md`, rồi trình kèm những MEDIUM còn để lại.

Trình bày gọn: từng milestone với số việc, MD, vai trò, và việc nào phụ thuộc việc nào. Hỏi:

- Mức chi tiết có thô quá hay vụn quá không?
- Phụ thuộc đã đúng chưa?
- Việc nào cần gộp, tách, hoặc bỏ?
- Tổng MD đã chấp nhận được chưa? Lệch so với proposal (nếu proposal có nêu MD) thì giải thích phần lệch.

Sửa `03-wbs.md` sau mỗi vòng. Anh chốt xong thì ghi tổng MD vào `proposal_md` trong `00-params.txt`, nếu proposal sẽ nêu con số này.

## Hoàn thành khi

- [ ] Mọi mục cam kết trong proposal đều xuất hiện trong bảng đối chiếu ngược và trỏ tới ít nhất một WBS.
- [ ] Mọi việc chi tiết có MD > 0 (trừ việc phía khách) và có "Cơ sở ước lượng".
- [ ] Không còn tên khách hoặc dự án nào trong `stale_terms`.
- [ ] Anh đã duyệt. Nhắc anh chạy `/master-plan <kh>`; nếu context đã dài, gợi ý mở phiên mới.
