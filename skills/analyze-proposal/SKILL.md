---
name: analyze-proposal
description: Phân tích proposal đã chốt thành WBS (đầu việc, căn cứ, effort MD) cho projects/<kh>/. Dùng khi anh gõ /analyze-proposal <kh>.
disable-model-invocation: true
---

# Phân tích proposal → WBS

Quy tắc chung (bắt buộc): làm trong thư mục có `projects/`; đọc mục "Quy tắc chống dữ liệu cũ" trong `${CLAUDE_PLUGIN_ROOT}/CLAUDE.md` trước khi bắt đầu.

Đầu vào: `02-proposal.md` (hoặc .docx/.pdf anh đưa), `01-requirements.md`, `00-params.txt`. Đầu ra: `03-wbs.md`.

## 1. Đọc

- Proposal, danh sách yêu cầu, params của **dự án này**; `projects/<kh>/00-tuning.md` (nếu có: điều chỉnh riêng của dự án, thắng `estimation.md` và `proposal-format.md` ở mục tương ứng; dòng nào không ghi lý do thì bỏ qua và báo lại); `${CLAUDE_PLUGIN_ROOT}/knowledge/estimation.md`; `${CLAUDE_PLUGIN_ROOT}/CONTEXT.md`.
- Proposal không do repo này sinh ra: tạo `00-params.txt` trước bằng các câu hỏi ở bước 2 của `/write-proposal`. Riêng mục 2 (ngày tháng) thì không được bỏ qua.

## 2. Dựng WBS

Làm hai lượt: chia milestone và để anh duyệt, rồi mới ước MD từng việc. Milestone sai thì công ước MD bên dưới bỏ đi hết. Agent `wbs-drafter` chạy bằng Codex (tiết kiệm token Claude), từ thư mục làm việc (nơi có `projects/`).

### 2.1 Chia milestone (anh duyệt trước khi ước MD)

```bash
${CLAUDE_PLUGIN_ROOT}/scripts/codex_agent.sh wbs-drafter projects/<kh>/review/wbs-drafter.md "Khách: <kh> (projects/<kh>). Chỉ làm bước 2.1: phần Kiến trúc nền và Milestone của projects/<kh>/03-wbs.md."
```

Quy tắc chia (rút từ `prd-to-plan` và `to-tickets` của Matt Pocock):

- **Yêu cầu của hồ sơ thầu luôn đứng trước.** Với loại B, hoặc khi khách quy định giai đoạn, mốc, tên hạng mục, tiến độ theo ngày N, thì milestone lấy đúng tên và thứ tự giai đoạn của E-HSMT/khách, còn lát dọc đặt ở tầng nhóm `1.x.y` bên trong. Các quy tắc dưới chỉ áp dụng cho phần khách không quy định.
- **Khung lấy từ proposal.** Loại A: milestone lấy từ bảng 14.1 Kế hoạch triển khai của proposal; chỉ tách hoặc gộp khi có lý do, và ghi điểm lệch để anh quyết sửa proposal hay WBS. Loại B: lấy từ chương IV Kế hoạch triển khai.
- **Kiến trúc nền trước.** Đầu `03-wbs.md` ghi các quyết định ít đổi, lấy từ proposal: nền tảng, mô hình dữ liệu, phân quyền, danh sách nguồn, môi trường. Milestone tham chiếu phần này, không lặp lại.
- **Milestone là lát dọc.** Mỗi milestone đi trọn đường nguồn → ingest → mô hình → mart/báo cáo → SIT/UAT → biên bản; xong thì khách demo và ký được. Không lấy một tầng (thiết kế, tích hợp, SIT) làm milestone.
- Ngoại lệ duy nhất là `M0 — Nền tảng`: khởi động, khảo sát, thiết kế kiến trúc, cài Dev/UAT, việc phía khách cần có trước.
- `M1` là lát mỏng nhất: 1 nguồn, 1 domain, 1–2 báo cáo chạy thật. Đây là "mốc sớm nhất có giá trị" ở mục 14.2 proposal. `M2…Mn` mỗi milestone thêm nguồn, domain hoặc nhóm báo cáo. Cuối cùng là nghiệm thu tổng thể, rồi hypercare/bảo hành (khớp `post_deadline`).
- Mỗi milestone có 4 trường: **Bàn giao** (khách thấy gì chạy), **R phủ**, **Tiêu chí nghiệm thu** (checkbox), **Bị chặn bởi** (milestone khác hoặc việc phía khách).
- Mọi R loại `Chức năng`, `Phi chức năng`, `Kết quả`, `Dịch vụ` trong phạm vi thuộc ít nhất một milestone.
- **Phần chưa rõ** (mục 9 còn "Giả định", chi tiết khách gửi sau): phát biểu được chính xác câu hỏi thì vẫn chia việc; chưa phát biểu được thì ghi vào mục **Chưa xác định** với một dòng MD dự phòng kèm giả định, không chia vụn. **Ngoài phạm vi** là mục riêng, không trộn vào đây.

Trình anh bảng **Milestone | Bàn giao | R phủ | Bị chặn bởi** và hỏi: độ chi tiết thô hay vụn? quan hệ chặn đúng chưa? milestone nào cần gộp hay tách? Sửa tới khi anh duyệt.

### 2.2 Dựng việc chi tiết và MD

```bash
${CLAUDE_PLUGIN_ROOT}/scripts/codex_agent.sh wbs-drafter projects/<kh>/review/wbs-drafter.md "Khách: <kh> (projects/<kh>). Milestone đã duyệt, làm bước 2.2 cho projects/<kh>/03-wbs.md."
```

Đọc báo cáo trả về, rà các giả định ước lượng agent tự đặt. Quy tắc agent phải theo:

Liệt kê mọi thứ proposal **cam kết bàn giao**: phạm vi, gói bàn giao, tài liệu, đào tạo, nghiệm thu, hypercare. Mỗi thứ phải có ít nhất một việc.

`03-wbs.md` gồm:

0. Kiến trúc nền và bảng milestone đã duyệt ở 2.1 (giữ nguyên, chỉ thêm MD).
1. Bảng WBS: **WBS | Việc | Căn cứ (mục proposal / R##) | Vai trò chính | MD | Cơ sở ước lượng**.
   - Cấp: `1` dự án → `1.x` "M<n> — …" (đúng milestone đã duyệt) → (`1.x.y` nhóm) → việc chi tiết. SIT, UAT, go-live của từng lát nằm trong milestone của lát đó.
   - "Cơ sở ước lượng" là một dòng benchmark trong `estimation.md` (ví dụ "báo cáo customization ~8 MD × 6"), hoặc một giả định viết rõ. **Không chép MD của dự án mẫu mà không nêu lý do giống nhau.**
   - Luôn có: quản lý dự án (~10%), SIT, UAT, go-live, hypercare, đào tạo, việc phía khách (nhóm "M — Điều kiện sẵn sàng phía <KH>", 0 MD vendor).
2. Tổng MD theo milestone và theo vai trò; so với các dự án cùng loại trong `estimation.md` §3.
3. Giả định, phụ thuộc phía khách, rủi ro ảnh hưởng effort.
4. Bảng đối chiếu ngược **Mục proposal → WBS** để chứng minh không sót.
5. **Chưa xác định** (phần trong phạm vi chưa đủ rõ để chia việc: giả định, MD dự phòng) và **Ngoài phạm vi**, hai mục riêng.

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
- [ ] Anh đã duyệt bảng milestone ở bước 2.1; mọi R trong phạm vi thuộc ít nhất một milestone.
- [ ] Mọi việc chi tiết có MD > 0 (trừ việc phía khách) và có "Cơ sở ước lượng".
- [ ] Không còn tên khách hoặc dự án nào trong `stale_terms`.
- [ ] Anh đã duyệt. Nhắc anh chạy `/master-plan <kh>`; nếu context đã dài, gợi ý mở phiên mới.
