# Hướng dẫn nhanh

## Nhớ 1 câu: **Bỏ file → Viết → Chia → Lịch**

| # | Anh làm | Gõ lệnh | Nhận được |
|---|---|---|---|
| 0 | Tạo khách mới | `/presale new <tên-kh>` | thư mục `projects/<tên-kh>/` |
| 1 | **Bỏ file**: RFP, BRD, email vào `01-input/` | — | |
| 2 | **Viết** proposal | `/write-proposal <tên-kh>` | `02-proposal.docx` |
| 3 | **Chia** việc | `/analyze-proposal <tên-kh>` | `03-wbs.md` |
| 4 | Lên **lịch** + nhân sự | `/master-plan <tên-kh>` | `04-master-plan.xlsx` + `04-check.txt` |

Không nhớ đang ở bước nào thì gõ **`/presale`** (hoặc `/presale <tên-kh>` để mở thẳng khách đó).

## Bảng Presales

Mỗi khách là một thẻ, có chuỗi 5 bước: **● xong · ◐ cần làm lại · ✗ lỗi · ▶ bước tiếp · ○ chưa làm**.
Bảng tự phát hiện **◐ cần làm lại** khi anh sửa file nguồn sau khi đã sinh kết quả, ví dụ sửa `00-params.txt` sau khi dựng Excel. Thẻ của khách đang chọn hiện thêm: kickoff → deadline, lỗi kiểm tra đầu tiên, và danh sách file kèm thời điểm sửa gần nhất.

Bấm **Ctrl+X Tab** để chuyển con trỏ vào bảng, rồi dùng phím:

| Phím | Làm gì |
|---|---|
| `1`–`9` | chọn khách |
| `n` | điền **lệnh tiếp theo** vào ô chat (anh chỉ cần Enter) |
| `c` | **kiểm tra lại** plan ngay (chạy `check_plan.py`, ghi `04-check.txt`) |
| `k` | mở kết quả kiểm tra đầy đủ |
| `o` · `p` · `w` · `x` | mở thư mục · proposal Word · WBS · master plan Excel |
| `Esc` | quay lại ô chat |

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
