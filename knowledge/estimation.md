# Cơ sở ước lượng effort, nhân sự, timeline

Số liệu lấy từ các proposal và master plan mẫu. Đây là **benchmark để so sánh, không phải đáp án**: effort của dự án mới phải tính từ phạm vi của chính dự án đó, rồi mới đối chiếu với bảng này.

## 1. Công thức và quy ước (theo master plan mẫu)

- **MD = Số ngày (Duration, ngày làm việc) × Số người × % phân bổ.**
- 5 cột vai trò trong master plan: **PM, BA, DEV, SysE, Tester**. SA/Data Architect, Data Engineer, BI/Report Developer đều tính vào **DEV**.
- WBS 4 cấp: `1` dự án → `1.x` milestone ("M1 — …") → `1.x.y` nhóm việc → `1.x.y.z` việc chi tiết (dự án nhỏ có thể bỏ cấp nhóm).
- Kiểm tra bắt buộc: không dòng nào vượt số người tối đa hoặc quá 100%; mức tham gia của PM ≥ 75–80% thời gian dự án; nếu đã gửi bản trước cho khách thì tổng MD bản mới không được thấp hơn (thêm sheet "Lý do tăng MD" nếu tăng).
- Ngày nghỉ: thứ 7, CN, lễ và Tết (khai báo `holidays` trong `00-params.txt`). Tết làm dời UAT và go-live (dự án B: Tết 04–10/02/2027 đẩy go-live từ cuối 01 sang cuối 02).

## 2. Đơn giá effort theo loại việc (dự án A, báo cáo CIC/SBV, tổng 845 MD)

| Hạng mục | MD |
|---|---|
| Khởi động, khảo sát, phân tích nghiệp vụ, mapping nguồn | 70 |
| Thiết kế giải pháp, mô hình dữ liệu, phân quyền | 40 |
| Cài đặt nền tảng Dev/UAT, Production, DR | 35 |
| Tích hợp 1 hệ thống nguồn lớn (Core T24) đến Raw Vault | 70 |
| Tích hợp 1 hệ thống nguồn vừa (CMS thẻ) | 55 |
| Business Vault, mart, logic tập trung, đối soát | 90 |
| Cấu hình báo cáo có sẵn | ~2 MD/báo cáo |
| Cập nhật báo cáo theo văn bản mới | ~4 MD/báo cáo |
| Tệp CIC (cấu hình + kiểm tra JSON) | ~5 MD/tệp |
| Báo cáo customization mới | ~8 MD/báo cáo |
| Workflow Maker-Checker, phân quyền, audit | 20 |
| Tích hợp nộp CIC/NHNN, ký số | 25 |
| SIT, UAT, chạy song song 2 kỳ | 90 (~11%) |
| Đào tạo, chuyển giao tài liệu | 20 |
| Go-live, hypercare 4 tuần | 30 |
| Quản lý dự án, QA | ~10% tổng |

Effort cho change request (quỹ man-day sau go-live): sửa chỉ tiêu trên template có sẵn 0,5–2 · báo cáo ma trận mới, dữ liệu đã có 3–6 · báo cáo mới cần thêm nguồn 6–12 · tệp CIC mới 8–15. Quỹ đề xuất 60 MD/năm.

## 3. Quy mô đội và thời gian các dự án tham chiếu

| Dự án | Loại | Thời gian | Đội (PM/BA/DEV/SysE/Tester) | Tổng MD |
|---|---|---|---|---|
| Dự án B (DWH) | DWH 5 domain, 4 nguồn, Power BI | 8 tháng (11/2026–06/2027) | 1 / 2 / 5 (1 SA, 3 DE, 1 BI) / 1 / 2 = 11 | chưa công bố |
| Dự án A (CIC/SBV) | Data platform + 63 báo cáo + Maker-Checker | 26 tuần | 1 / 2 / 5 (1 SA, 3 DE, 1 Report) / 1 / 1 = 10 | 845 |
| Dự án C (MIS) | Thầu, 40 báo cáo trên big data | 180 ngày (yêu cầu 210) | 1 / 2 / 5 (1 DA, 4 DE) / 1 / 2 = 11 | — |
| Dự án D (cho vay) | Workflow cho vay + API gateway | 126 ngày làm việc | tối đa 1 / 5 / 7 / 3 / 3 | 1.844 (PM 103, BA 534, DEV 649, SysE 254, Tester 304) |
| Dự án E (Search/Chat) | RAG trên 15.000 tài liệu | 6 tuần (28 ngày) | tối đa 1 / 2 / 3 / 2 / 2 | 198 (PM 23, BA 33, DEV 93, SysE 24, Tester 25) |

Tỷ trọng thường gặp: PM 5–12%, BA 15–30%, DEV 35–50%, SysE 10–15%, Tester 12–17%.

## 4. Khung giai đoạn thường dùng (theo tuần, tính từ kickoff)

| Giai đoạn | Khung thường gặp | Ghi chú |
|---|---|---|
| Khởi động, khảo sát | T1–T4 | khóa phạm vi, ký BRD/tài liệu yêu cầu |
| Thiết kế | T3–T6 | chồng lên khảo sát |
| Cài đặt nền tảng Dev/UAT → Prod | T2–T8 | phụ thuộc hạ tầng khách (cần trước ~T5) |
| Tích hợp nguồn, mô hình dữ liệu | T4–T14 | |
| Xây dựng theo đợt/domain | đợt 1 → đợt 2 …, mỗi đợt 4–6 tuần | sprint 2 tuần |
| SIT | 2–4 tuần mỗi đợt | |
| UAT | 2 tuần trước mỗi go-live | khách thực hiện |
| Chạy song song (báo cáo định kỳ) | 2 kỳ báo cáo | |
| Go-live, hypercare | 2 tuần mỗi domain, 4 tuần sau go-live cuối | |
| Đào tạo | người dùng 2 ngày, kỹ thuật 3 ngày | |
| Bảo hành | 12 tháng sau nghiệm thu tổng thể | |
