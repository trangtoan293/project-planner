# Hướng dẫn nhanh

## Nhớ 1 câu: **Bỏ file → Viết → Chia → Lịch**

| # | Anh làm | Gõ lệnh | Nhận được |
|---|---|---|---|
| 0 | Tạo khách mới | `/presale new <tên-kh>` | thư mục `projects/<tên-kh>/` |
| 1 | **Bỏ file**: RFP, BRD, email vào `01-input/` | — | |
| 2 | **Viết** proposal | `/write-proposal <tên-kh>` | `02-proposal.docx` |
| 3 | **Chia** việc | `/analyze-proposal <tên-kh>` | `03-wbs.md` |
| 4 | Lên **lịch** + nhân sự | `/master-plan <tên-kh>` | `03-task-list.xlsx` (gửi đội, không ngày/MD) → `04-master-plan.xlsx` + `04-check.txt` |

Không nhớ đang ở bước nào thì gõ **`/presale`** (hoặc `/presale <tên-kh>` để mở thẳng khách đó).

## Bảng Presales

Bảng chỉ hiện **một khách** (khách đang chọn): chuỗi 6 bước **● xong · ◐ cần làm lại · ✗ lỗi · ▶ bước tiếp · ○ chưa làm**, cùng tối đa 3 việc gấp (hạn nộp, review còn CRITICAL, plan chưa đạt, quyết định [D] chờ duyệt).
Bảng tự phát hiện **◐ cần làm lại** khi anh sửa file nguồn sau khi đã sinh kết quả, ví dụ sửa `00-params.txt` sau khi dựng Excel.

Bấm **Ctrl+X Tab** để chuyển con trỏ vào bảng, rồi dùng phím:

| Phím | Làm gì |
|---|---|
| bấm tên khách | sang khách khác (hoặc gõ `/presale <tên-kh>`) |
| `t` | bật/tắt **Tóm tắt**: giải pháp, câu đề xuất chính, các mốc của plan (ngày, MD) |
| `n` | điền **lệnh tiếp theo** vào ô chat (anh chỉ cần Enter) |
| `s` | bật/tắt **Thông số**: thời gian, số người/tối đa và MD từng vai trò, tổng người, tổng MD (so với MD đã nêu trong proposal), yêu cầu, review, ô […] |
| `c` | **kiểm tra lại** plan ngay (chạy `check_plan.py`, ghi `04-check.txt`) |
| `o` · `p` · `x` | mở thư mục khách · proposal Word · master plan Excel |
| `Esc` | quay lại ô chat |

Số người mỗi vai trò là số đông nhất trong cùng một ngày (cộng người × % của các việc chạy song song), do `check_plan.py` tính.

## Ở mỗi bước, anh chỉ cần

- **Viết**: trả lời các câu Claude hỏi, mỗi lần một câu. Câu nào Claude đã có đề xuất thì gõ "ok". Riêng **ngày kickoff, deadline, mốc go-live** thì phải trả lời bằng số thật.
- **Chia**: xem bảng tổng MD theo milestone. Chưa ổn thì nói "gộp…", "tách…", "bớt…". Ổn thì gõ "chốt".
- **Lịch**: chờ đến khi thấy `KẾT QUẢ: ĐẠT`. Nếu Claude báo không kịp mốc, anh chọn: thêm người, cắt phạm vi, hoặc dời mốc.

## 3 điều cần nhớ

1. **Mỗi bước mở một phiên Claude mới** (`/clear`), để dữ liệu của bước trước hoặc của khách khác không lẫn vào.
2. **Ngày tháng chỉ sửa ở `projects/<tên-kh>/00-params.txt`.** Không sửa ngày trực tiếp trong Excel.
3. **Có khách mới thì thêm tên khách cũ** vào dòng `stale_terms` trong `templates/00-params.txt`, để máy chặn việc lẫn tên.

## Khi cần

| Muốn | Làm |
|---|---|
| Sửa proposal rồi xuất lại Word | sửa `02-proposal.md`, gõ "xuất lại docx" |
| Đổi kickoff hoặc ngày lễ | sửa `00-params.txt`, gõ `/master-plan <tên-kh>` |
| Cập nhật tài liệu Hanas | thay `samples/hanas_docs/`, gõ "cập nhật knowledge Hanas" |
| Dự án xong, muốn ước lượng sau này sát hơn | gõ "thêm số liệu thực tế dự án <tên-kh> vào estimation" |
