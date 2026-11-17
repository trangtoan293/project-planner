# Chuyển `03-wbs.md` của planner sang `v<N>-wbs.csv`

Mục đích: WBS của planner và báo giá ra cùng MD (`knowledge/estimation.md` §5). Chỉ đọc `projects/<kh>/03-wbs.md`, không sửa file đó.

Đi qua bảng WBS (WBS | Việc | Căn cứ | Vai trò chính | MD | Cơ sở ước lượng), chỉ lấy việc chi tiết (dòng lá có MD):

| Dòng planner | Thành dòng toolkit |
|---|---|
| "Cơ sở ước lượng" bắt đầu bằng mã WP, ví dụ `WP-RPT-NEW 10 MD × 6` | `wp_code` = mã đó, `qty` = số sau `×` (không có thì 1), `description` = Việc |
| `WP-CUSTOM …` hoặc không có mã WP | `WP-CUSTOM`, `md` = MD, `role` theo bảng vai trò bên dưới, `reason` = Cơ sở ước lượng (rút gọn) |
| Quản lý dự án | bỏ, toolkit tự tính PM |
| Việc phía khách (0 MD) | bỏ |
| Dự phòng | bỏ; rủi ro có tên thì đưa vào `v<N>-risks.csv` |

**Milestone:** lấy từ dòng cấp `1.x` chứa việc đó ("M<n> — …"). M0–M4 giữ nguyên; nghiệm thu tổng thể → `NT`; hypercare, bảo hành → `HC`. Planner có từ M5 trở lên thì hỏi anh gộp vào M4 hay bớt số đợt.

**Vai trò** (`role` của `WP-CUSTOM`): PM → PM; BA → BA; SA, DE, BI, Dev → DEV; SysE, DevOps → SysE; Tester → Tester. Có nhiều vai trò thì lấy vai trò đầu tiên.

Các dòng cùng WP, cùng milestone và cùng loại việc thì gộp thành một dòng (cộng `qty`); `scope_limit` khác nhau thì để riêng.

**Thông số dịch vụ trong `.toml`:** `prod_milestone` = milestone chứa việc cài PROD; `[services.team]` = `team_max` trong `00-params.txt`.

Chấm `s1`–`s4` theo tiêu chí như bước 3 của SKILL.md. Không chấm điểm để MD khớp với planner; lệch thì nêu ở bước 5.
