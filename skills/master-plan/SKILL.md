---
name: master-plan
description: Từ WBS đã duyệt, lập danh sách đầu việc cho đội phát triển (không ngày, không MD) rồi lên master plan Excel (timeline + nhân sự PM/BA/DEV/SysE/Tester) đúng format mẫu và tự kiểm tra timeline. Dùng khi anh gõ /master-plan <kh>.
disable-model-invocation: true
---

# Lên master plan và kiểm tra

Quy tắc chung (bắt buộc): làm trong thư mục có `projects/`; đọc mục "Quy tắc chống dữ liệu cũ" trong `${CLAUDE_PLUGIN_ROOT}/CLAUDE.md` trước khi bắt đầu.

Đầu vào: `03-wbs.md` đã duyệt, `00-params.txt`. Đầu ra: `03-wbs.csv`, `03-task-list.xlsx` (cho đội phát triển), `04-master-plan.xlsx`, `04-check.txt`.

## 0. Giao agent

Agent `plan-builder` chạy bằng Codex, từ thư mục làm việc (nơi có `projects/`), hai lượt:

```bash
# lượt 1: bước 1–2 (cấu trúc CSV + danh sách đầu việc)
${CLAUDE_PLUGIN_ROOT}/scripts/codex_agent.sh plan-builder projects/<kh>/review/plan-builder.md "Khách: <kh> (projects/<kh>). Làm bước 1–2 của master-plan."
# lượt 2, sau khi anh chốt danh sách đầu việc: bước 3–4 (thời gian, nhân sự, dựng plan)
${CLAUDE_PLUGIN_ROOT}/scripts/codex_agent.sh plan-builder projects/<kh>/review/plan-builder.md "Khách: <kh> (projects/<kh>). Danh sách đầu việc đã chốt, làm bước 3–4 của master-plan."
```

Đọc báo cáo mỗi lượt. Sau lượt 2 em tự chạy lại `check_plan.py` một lần để xác nhận ĐẠT. Bước 5 (đối chiếu, hỏi anh) em làm.

## 1. Viết cấu trúc `03-wbs.csv`

Cột: `wbs,name,duration,start,predecessors,pm_n,pm_pct,ba_n,ba_pct,dev_n,dev_pct,syse_n,syse_pct,tester_n,tester_pct,owner,refs,note`

Phần cấu trúc sinh bằng script, không chép tay:

```bash
python3 ${CLAUDE_PLUGIN_ROOT}/scripts/wbs_md2csv.py projects/<kh>/03-wbs.md projects/<kh>/03-wbs.csv
```

Script lấy `wbs,name,owner,refs` từ bảng WBS và `refs,note` của dòng milestone từ bảng milestone của `03-wbs.md`; chạy lại thì giữ nguyên `duration`, `predecessors`, nhân sự đã điền. Cần đổi việc, vai trò, mã R thì sửa `03-wbs.md` rồi chạy lại script, không sửa tay các cột đó trong CSV. Lượt này chỉ điền tay `predecessors`; `duration`, `start` và các cột nhân sự để trống.

- `predecessors` dùng mã WBS: `1.2.1`, `1.3.2SS+2` (bắt đầu sau khi 1.3.2 bắt đầu 2 ngày), `1.4.1FF`. Mọi việc chi tiết, trừ việc đầu tiên, phải có predecessor hoặc ghi rõ vì sao chạy song song từ kickoff.
- `owner` (script điền): vai trò chính lấy từ cột "Vai trò chính" của `03-wbs.md`, ghi chi tiết để đội nhận việc: BA, SA, DE, BI, Dev, DevOps, SysE, Tester, PM; nhiều vai trò thì cách nhau dấu `/`.
- `refs` (script điền): mã R mà việc đó làm, lấy từ cột "Căn cứ" của `03-wbs.md`, cách nhau dấu cách (`R01 R05`). Dòng milestone ghi các R nó phủ. Mọi R loại `Chức năng`, `Phi chức năng`, `Kết quả`, `Dịch vụ` (trừ dòng ghi "ngoài phạm vi") phải có trong ít nhất một dòng; script kiểm.
- `note` (script điền): chỉ dòng milestone, ghi bàn giao và tiêu chí nghiệm thu từ bảng milestone của `03-wbs.md`, các ý cách nhau dấu `;`.
- Dòng tổng hợp (`1`, `1.x`, …) không có `predecessors`, `owner`.
- Hypercare, bảo hành đặt trong milestone có tên khớp `post_deadline` của `00-params.txt`; `check_plan.py` cho phép nhóm này kết thúc sau deadline.

## 2. Danh sách đầu việc cho đội phát triển (không ngày, không MD)

```bash
python3 ${CLAUDE_PLUGIN_ROOT}/scripts/build_master_plan.py projects/<kh>/03-wbs.csv projects/<kh>/03-task-list.xlsx --team
```

File có các cột WBS · Task ID · Việc · Vai trò · Phụ thuộc · Căn cứ (mã R) · Bàn giao / tiêu chí nghiệm thu, **không có ngày, MD, % phân bổ**, để anh chia sẻ cho BA, SysE, DE, Dev, DevOps… rà đầu việc trước khi chốt số. Lệnh in `REFS: ĐẠT` khi mọi R trong phạm vi đã thuộc một milestone; `KHÔNG ĐẠT` thì sửa `refs` trong CSV, hoặc báo anh nếu WBS thật sự thiếu việc.

Trình anh: số việc theo milestone, số việc theo vai trò, đường dẫn file. Anh gửi đội góp ý (thiếu việc, tách hoặc gộp việc, phụ thuộc sai, sai vai trò); em sửa CSV, chạy lại lệnh trên, tới khi anh chốt. Đổi việc làm lệch `03-wbs.md` thì sửa luôn `03-wbs.md` cho khớp và báo anh MD bị ảnh hưởng.

## 3. Điền thời gian và nhân sự

- **Để trống `start`.** Script tự tính ngày từ `kickoff` và `predecessors`. Chỉ ghi ngày khi khách hoặc hợp đồng cố định ngày đó, và nói rõ lý do với anh.
- Chọn `duration`, số người và % sao cho **days × người × % ≈ MD trong `03-wbs.md`**, số người ≤ `team_max`, % ≤ 1.
- PM: thêm một việc "Quản lý dự án" chạy suốt dự án, sao cho mức tham gia ≥ `pm_min`.
- Không đổi `wbs`, `name`, `predecessors`, `owner`, `refs` đã chốt ở bước 2; cần đổi thì hỏi anh.

## 4. Dựng và kiểm tra (lặp đến khi ĐẠT, tối đa 5 vòng)

```bash
python3 ${CLAUDE_PLUGIN_ROOT}/scripts/build_master_plan.py projects/<kh>/03-wbs.csv projects/<kh>/04-master-plan.xlsx --params projects/<kh>/00-params.txt
python3 ${CLAUDE_PLUGIN_ROOT}/scripts/check_plan.py projects/<kh>/00-params.txt projects/<kh>/03-wbs.csv projects/<kh>/02-proposal.md | tee projects/<kh>/04-check.txt
```

File plan có cột **Sprint** (S1, S2… tính `sprint_weeks` tuần từ kickoff, mặc định 2) và sheet **Sprint**: MD theo vai trò mỗi sprint, tải so với `team_max`, milestone đang chạy. Sprint nào `VƯỢT TẢI` thì dời việc hoặc thêm người như một FAIL.

Mỗi dòng FAIL: sửa CSV (duration, predecessor, số người). **Không sửa `00-params.txt` để lách lỗi.** Mốc hoặc deadline không đạt nổi thì dừng lại và báo anh các phương án: thêm người, cắt phạm vi, hoặc dời mốc. Sau 5 vòng vẫn FAIL thì cũng dừng và báo.

## 5. Đối chiếu chéo (sau khi ĐẠT)

1. Tổng MD theo vai trò trong plan so với `03-wbs.md`: lệch quá 5% ở vai trò nào thì giải thích.
2. Timeline từng milestone so với mục Kế hoạch triển khai và mục Nhân sự trong proposal. Lệch thì **liệt kê cho anh quyết định** sửa proposal hay sửa plan; không tự sửa.
3. Số người lúc đông nhất so với bảng nhân sự trong proposal.
4. Mọi WARN tỷ trọng vai trò (khung `estimation.md` §3): giải thích lý do hoặc đề xuất chỉnh WBS.

## Hoàn thành khi

- [ ] `03-task-list.xlsx` in `REFS: ĐẠT` và anh đã chốt danh sách đầu việc.
- [ ] `04-check.txt` kết thúc bằng `KẾT QUẢ: ĐẠT`; mọi WARN đã được giải thích.
- [ ] Đối chiếu chéo ở bước 5 không còn điểm lệch nào chưa được anh quyết định.
- [ ] Báo anh: bảng milestone (bắt đầu → kết thúc, MD, số R), MD theo vai trò, số người đông nhất, số sprint và sprint tải cao nhất, đường dẫn hai file Excel.
