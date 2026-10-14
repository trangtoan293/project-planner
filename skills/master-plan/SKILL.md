---
name: master-plan
description: Từ WBS đã duyệt, lên master plan Excel (timeline + nhân sự PM/BA/DEV/SysE/Tester) đúng format mẫu và tự kiểm tra timeline. Dùng khi anh gõ /master-plan <kh>.
disable-model-invocation: true
---

# Lên master plan và kiểm tra

Quy tắc chung (bắt buộc): làm trong thư mục có `projects/`; đọc mục "Quy tắc chống dữ liệu cũ" trong `${CLAUDE_PLUGIN_ROOT}/CLAUDE.md` trước khi bắt đầu.

Đầu vào: `03-wbs.md` đã duyệt, `00-params.txt`. Đầu ra: `03-wbs.csv`, `04-master-plan.xlsx`, `04-check.txt`.

## 0. Giao agent

Bước 1–2 giao agent `plan-builder` chạy bằng Codex, từ thư mục làm việc (nơi có `projects/`):

```bash
${CLAUDE_PLUGIN_ROOT}/scripts/codex_agent.sh plan-builder projects/<kh>/review/plan-builder.md "Khách: <kh> (projects/<kh>). Lập master plan theo chỉ dẫn."
```

Đọc báo cáo trả về và tự chạy lại `check_plan.py` một lần để xác nhận ĐẠT. Bước 3 (đối chiếu, hỏi anh) em làm.

## 1. Viết `03-wbs.csv`

Cột: `wbs,name,duration,start,predecessors,pm_n,pm_pct,ba_n,ba_pct,dev_n,dev_pct,syse_n,syse_pct,tester_n,tester_pct`

- **Để trống `start`.** Script tự tính ngày từ `kickoff` và `predecessors`. Chỉ ghi ngày khi khách hoặc hợp đồng cố định ngày đó, và nói rõ lý do với anh.
- `predecessors` dùng mã WBS: `1.2.1`, `1.3.2SS+2` (bắt đầu sau khi 1.3.2 bắt đầu 2 ngày), `1.4.1FF`. Mọi việc chi tiết, trừ việc đầu tiên, phải có predecessor hoặc ghi rõ vì sao chạy song song từ kickoff.
- Dòng tổng hợp (`1`, `1.x`, …) chỉ có `wbs,name`.
- Chọn `duration`, số người và % sao cho **days × người × % ≈ MD trong `03-wbs.md`**, số người ≤ `team_max`, % ≤ 1.
- PM: thêm một việc "Quản lý dự án" chạy suốt dự án, sao cho mức tham gia ≥ `pm_min`.
- Hypercare, bảo hành đặt trong milestone có tên khớp `post_deadline` của `00-params.txt`; `check_plan.py` cho phép nhóm này kết thúc sau deadline.

## 2. Dựng và kiểm tra (lặp đến khi ĐẠT, tối đa 5 vòng)

```bash
python3 ${CLAUDE_PLUGIN_ROOT}/scripts/build_master_plan.py projects/<kh>/03-wbs.csv projects/<kh>/04-master-plan.xlsx --params projects/<kh>/00-params.txt
python3 ${CLAUDE_PLUGIN_ROOT}/scripts/check_plan.py projects/<kh>/00-params.txt projects/<kh>/03-wbs.csv projects/<kh>/02-proposal.md | tee projects/<kh>/04-check.txt
```

Mỗi dòng FAIL: sửa CSV (duration, predecessor, số người). **Không sửa `00-params.txt` để lách lỗi.** Mốc hoặc deadline không đạt nổi thì dừng lại và báo anh các phương án: thêm người, cắt phạm vi, hoặc dời mốc. Sau 5 vòng vẫn FAIL thì cũng dừng và báo.

## 3. Đối chiếu chéo (sau khi ĐẠT)

1. Tổng MD theo vai trò trong plan so với `03-wbs.md`: lệch quá 5% ở vai trò nào thì giải thích.
2. Timeline từng milestone so với mục Kế hoạch triển khai và mục Nhân sự trong proposal. Lệch thì **liệt kê cho anh quyết định** sửa proposal hay sửa plan; không tự sửa.
3. Số người lúc đông nhất so với bảng nhân sự trong proposal.

## Hoàn thành khi

- [ ] `04-check.txt` kết thúc bằng `KẾT QUẢ: ĐẠT`; mọi WARN đã được giải thích.
- [ ] Đối chiếu chéo ở bước 3 không còn điểm lệch nào chưa được anh quyết định.
- [ ] Báo anh: bảng milestone (bắt đầu → kết thúc, MD), MD theo vai trò, số người đông nhất, đường dẫn file Excel.
