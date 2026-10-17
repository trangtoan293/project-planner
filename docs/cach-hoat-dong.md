# Plugin làm việc thế nào

Trang này giải thích plugin đi từ tài liệu khách tới milestone, sprint, đầu việc, MD và số người ra sao: mỗi bước dùng quy tắc gì, quy tắc nằm ở file nào, và muốn chỉnh cho một dự án thì sửa ở đâu. Quy tắc chi tiết nằm trong skill và agent; trang này chỉ đường tới đó, để không lệch với bản thật.

Muốn hỏi "vì sao" cho một dự án cụ thể: bấm **g (Giải thích)** trên bảng Presales, hoặc hỏi Claude bằng lời thường, ví dụ "vì sao việc 1.2.2.1 của kha ra 15 MD?", "milestone M1 gồm những gì?", "sprint S5 ai làm gì?".

## Chuỗi xử lý

```
01-input/ (RFP, BRD, email)
  │ 1. Tách yêu cầu nguyên tử         → R01…Rn                    01-requirements.md
  │ 2. Hỏi anh những điểm còn trống    → kickoff, mốc, team_max    00-params.txt
  │ 3. Viết proposal                   → mỗi R trả lời ở một mục   02-proposal.md
  │ 4. Chia milestone (lát dọc)        → M0, M1…Mn, có tiêu chí    03-wbs.md mục 0
  │ 5. Chia việc, ước MD               → việc × đơn giá            03-wbs.md mục 1
  │ 6. Danh sách đầu việc cho đội      → không ngày, không MD      03-task-list.xlsx
  │ 7. Xếp lịch và người               → ngày × người × %, sprint  04-master-plan.xlsx
  ▼ 8. Kiểm tra                         → ĐẠT / KHÔNG ĐẠT           04-check.txt
```

## 1. Đọc tài liệu khách → yêu cầu R

- **Quy tắc:** một dòng R là một điều trả lời được "đáp ứng / không đáp ứng" riêng; trích sát nguyên văn, giữ số và cụm bổ nghĩa; xếp vào 10 loại (Chức năng, Phi chức năng, Kết quả, Dịch vụ, Ràng buộc, Câu hỏi…). Đọc xong lấy ngẫu nhiên 10 đoạn tài liệu để kiểm có sót ý.
- **Ở đâu:** `skills/write-proposal/SKILL.md` bước 2.1, `agents/proposal-req-extractor.md`.
- **Kiểm bằng máy:** `check_plan.py` kiểm mọi R có "Trả lời tại" trỏ tới mục có thật trong proposal.

## 2. Milestone

- **Quy tắc:** hồ sơ thầu (hoặc khách) quy định giai đoạn thì **luôn theo hồ sơ thầu**. Không quy định thì chia **lát dọc**: mỗi milestone đi trọn đường nguồn → mô hình → báo cáo → SIT/UAT → biên bản, xong là khách demo và ký được.
  - `M0 — Nền tảng`: khởi động, khảo sát, thiết kế, cài Dev/UAT. Là milestone ngang duy nhất.
  - `M1`: lát mỏng nhất (1 nguồn, 1 domain, 1–2 báo cáo chạy thật) = "mốc sớm nhất có giá trị" trong proposal.
  - `M2…Mn`: thêm nguồn, domain, nhóm báo cáo. Cuối: nghiệm thu tổng thể, hypercare.
- Mỗi milestone có 4 trường: **Bàn giao**, **R phủ**, **Tiêu chí nghiệm thu**, **Bị chặn bởi**. Mọi R loại Chức năng, Phi chức năng, Kết quả, Dịch vụ trong phạm vi phải thuộc ít nhất một milestone.
- Phần chưa đủ rõ để chia việc thì ghi ở mục **Chưa xác định** với một dòng MD dự phòng, không chia vụn.
- **Ở đâu:** `skills/analyze-proposal/SKILL.md` bước 2.1; khung tuần ở `knowledge/estimation.md` §4; bảng 14.1 trong `knowledge/proposal-format.md`.
- **Kiểm bằng máy:** `check_plan.py` báo FAIL khi có R trong phạm vi chưa thuộc milestone nào (cột `refs`); mốc trong `milestones` của `00-params.txt` phải kết thúc đúng hạn.

## 3. Đầu việc, sprint

- **Đầu việc:** mỗi milestone chia thành nhóm `1.x.y` và việc `1.x.y.z`, mỗi việc có vai trò chính (BA, SA, DE, BI, DevOps, SysE, Tester, PM) và mã R làm căn cứ. `scripts/wbs_md2csv.py` chuyển bảng WBS sang `03-wbs.csv`; `build_master_plan.py --team` xuất `03-task-list.xlsx` cho đội rà trước khi chốt số.
- **Sprint:** chia lịch thành các khoảng `sprint_weeks` tuần (mặc định 2) tính từ kickoff. Mỗi việc ghi sprint nó chạy (`S3–S4`). Sheet **Sprint** trong Excel cộng MD theo vai trò mỗi sprint và so với năng lực đội.
- **Chưa có:** plugin chưa tạo issue trên Jira hay GitHub; cấp thấp nhất là đầu việc trong `03-task-list.xlsx`.

## 4. MD tính thế nào

MD của dự án = tổng MD từng việc. Mỗi việc ước theo 4 bước, ghi ở cột **Cơ sở ước lượng** của `03-wbs.md`:

1. **Đếm khối lượng** từ tài liệu khách: số bảng nguồn, số báo cáo, số dashboard, số khóa đào tạo.
2. **Nhân đơn giá benchmark** ở `knowledge/estimation.md` §2, ví dụ `15 bảng × 1,0 MD/bảng = 15 MD`. Không có dòng benchmark thì ghi giả định rõ ràng.
3. **Phần tính theo tỷ lệ:** quản lý dự án (PM ≥ `pm_min` thời gian dự án, thường ~10% tổng MD), SIT/UAT, hypercare.
4. **So với dự án tham chiếu** ở `estimation.md` §3 (tổng MD, tỷ trọng vai trò). `check_plan.py` cảnh báo khi tỷ trọng một vai trò ra ngoài khung (PM 5–12%, BA 15–30%, DEV 35–50%, SysE 10–15%, Tester 12–17%).

## 5. Người xếp thế nào

- **Công thức:** `MD = số ngày làm việc × số người × % phân bổ`. Ngày làm việc trừ thứ 7, CN, lễ (`holidays`). % theo bậc 25/50/75/100.
- **Giới hạn:** số người mỗi vai trò ≤ `team_max`; PM tham gia ≥ `pm_min` thời gian dự án; ngày bắt đầu tự tính từ kickoff và việc đi trước, không ghi tay.
- **Số người hiển thị** là số đông nhất trong cùng một ngày (cộng người × % các việc chạy song song).
- **Năm vai trò của master plan:** PM, BA, DEV (gồm SA, DE, BI), SysE (gồm DevOps), Tester.

## Chỉnh cho từng dự án

| Muốn đổi | Sửa ở | Ai đọc |
|---|---|---|
| Ngày, mốc, ngày lễ, số người tối đa | `projects/<kh>/00-params.txt` | script |
| Độ dài sprint | `sprint_weeks` trong `00-params.txt` | script |
| Khung tỷ trọng vai trò | `role_share` trong `00-params.txt`, ví dụ `PM=5-18, Tester=6-12` | script |
| Mức tham gia tối thiểu của PM | `pm_min` trong `00-params.txt` | script |
| Đơn giá MD, khung milestone, vai trò của đội, quy tắc khác | `projects/<kh>/00-tuning.md` (chép từ `templates/00-tuning.md`; bấm **e** trên bảng Presales để tạo) | agent |
| Đơn giá, khung dùng cho **mọi** dự án | `knowledge/estimation.md`, `knowledge/proposal-format.md` | agent |

Mỗi dòng trong `00-tuning.md` phải ghi lý do; agent bỏ qua dòng không có lý do. Khi giải thích, Claude nói rõ con số nào lấy từ `00-tuning.md` thay cho knowledge chung.

## Bảng Presales: khung Giải thích

Bấm **g** để mở khung Giải thích của khách đang chọn:

- Nguồn knowledge đang dùng (chung hay có điều chỉnh riêng).
- MD từng milestone, số R, số việc, việc lớn nhất.
- Số người đông nhất so với tối đa, sprint tải cao nhất.
- **v** điền sẵn câu hỏi "vì sao…" vào ô chat; **e** mở (hoặc tạo) `00-tuning.md`; **h** mở trang này.

Lệnh tương đương trong terminal: `python3 scripts/trace.py projects/<kh> [R12 | 1.2.2.1 | M1 | S5 | DEV]`.
