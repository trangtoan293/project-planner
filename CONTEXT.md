# Thuật ngữ dự án

Dùng đúng các từ dưới đây trong proposal, WBS và master plan. Thuật ngữ sản phẩm nằm ở cuối `knowledge/<sp>-product.md`.

**Proposal**: tài liệu đề xuất gửi khách (loại A: đề xuất giải pháp; loại B: hồ sơ thầu). _Tránh_: báo giá (báo giá là file riêng).
**Params**: file `projects/<kh>/00-params.txt`, nguồn duy nhất cho kickoff, deadline, ngày lễ, giới hạn đội, mốc bắt buộc.
**WBS**: danh sách đầu việc phân cấp, có effort; lưu ở `03-wbs.md` (giải thích) và `03-wbs.csv` (dữ liệu dựng plan).
**Master plan**: file Excel timeline + phân bổ nhân sự theo format `samples/master_plan_sample/`. _Tránh_: Gantt, kế hoạch tổng.
**MD (man-day)**: một người làm một ngày. MD = Số ngày × Số người × % phân bổ. _Tránh_: công, ngày công.
**Vai trò**: PM, BA, DEV, SysE, Tester. SA, Data Engineer, BI/Report Developer đều tính vào DEV trong master plan.
**Milestone (M)**: nhóm việc cấp 2 trong WBS, đặt tên "M<n> — <tên>".
**Đợt / domain**: phần nghiệp vụ được đưa vào vận hành cùng một lúc (ví dụ "Casino Marketing").
**Go-live**: chuyển sang vận hành chính thức. **Hypercare**: hỗ trợ tăng cường ngay sau go-live.
**T1, T2…**: tuần thứ n tính từ kickoff (loại A). **N1, N2…**: ngày thứ n từ khi hợp đồng có hiệu lực (loại B).
**Dữ liệu cũ (stale data)**: ngày tháng, tên khách, phạm vi hoặc số nhân sự lấy nhầm từ dự án hay mẫu khác. `check_plan.py` có nhiệm vụ chặn nó.
