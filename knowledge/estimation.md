# Cơ sở ước lượng effort, nhân sự, timeline

Số liệu lấy từ các proposal và master plan mẫu. Đây là **benchmark để so sánh, không phải đáp án**: effort của dự án mới phải tính từ phạm vi của chính dự án đó, rồi mới đối chiếu với bảng này.

Commercial Toolkit (repo nội bộ `commercial-toolkit`, ADR 0005) giữ Norm Library, Milestone Framework, MD/MM và thời gian thô dùng để báo giá; file này giữ benchmark dự án tham chiếu và quy ước master plan. Hai bên khác nhau thì sửa ở toolkit trước rồi cập nhật ở đây (§4, §5).

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
| Cấu hình báo cáo có sẵn | ~3 MD/báo cáo |
| Cập nhật báo cáo theo văn bản mới | ~5 MD/báo cáo |
| Tệp CIC (cấu hình + kiểm tra JSON) | ~7 MD/tệp |
| Báo cáo customization mới | ~10 MD/báo cáo |
| Workflow Maker-Checker, phân quyền, audit | 20 |
| Tích hợp nộp CIC/NHNN, ký số | 40 |
| SIT, UAT, chạy song song 2 kỳ | 110 (~13%) |
| Đào tạo, chuyển giao tài liệu | 40 |
| Go-live, hypercare 4 tuần | 40 |
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

## 4. Khung milestone thường dùng (theo tuần, tính từ kickoff)

Hồ sơ thầu hoặc khách đã quy định giai đoạn thì theo đúng giai đoạn đó. Khách không quy định thì chia milestone theo lát dọc (bước 2.1 của `analyze-proposal`). Bản gốc là `data/estimation/milestones.csv` của toolkit (Milestone Framework); đợt thanh toán dịch vụ chọn từ các mốc này nên tiêu chí nghiệm thu phải giữ đếm được.

| Milestone | Khung thường gặp | Bên trong | Tiêu chí nghiệm thu |
|---|---|---|---|
| M0 — Nền tảng | T1–T6 | khởi động, khảo sát, khóa phạm vi/ký BRD (T1–T4); thiết kế kiến trúc chồng lên khảo sát; cài Dev/UAT (phụ thuộc hạ tầng khách, cần trước ~T5) | BRD và thiết kế giải pháp được ký; Dev/UAT cài xong, đăng nhập SSO được |
| M1 — Lát mỏng đầu tiên | T5–T12 | 1 nguồn, 1 domain, 1–2 báo cáo chạy thật; SIT 1–2 tuần, UAT 1 tuần, biên bản demo | nguồn đầu tiên nạp tự động; báo cáo trong phạm vi chạy trên dữ liệu thật, số liệu khớp báo cáo nguồn; biên bản demo |
| M2…Mn — Mở rộng theo đợt/domain | mỗi đợt 4–6 tuần, sprint 2 tuần | thêm nguồn/domain/nhóm báo cáo; SIT 2–4 tuần mỗi đợt; UAT 2 tuần trước mỗi go-live (khách thực hiện); cài Prod trước go-live đầu tiên | nguồn và báo cáo của đợt chạy trên Prod, số liệu khớp nguồn; biên bản UAT |
| Nghiệm thu tổng thể | sau go-live cuối | chạy song song 2 kỳ báo cáo (báo cáo định kỳ); đào tạo người dùng 2 ngày, kỹ thuật 3 ngày | chạy song song 2 kỳ không lệch ngoài ngưỡng đã thống nhất; xong đào tạo; bàn giao đủ tài liệu |
| Hypercare, bảo hành | 2 tuần mỗi domain, 4 tuần sau go-live cuối; bảo hành 12 tháng sau nghiệm thu | khớp `post_deadline` | hết thời gian hypercare theo lịch |

## 5. Norm Library của toolkit

Toolkit báo giá dịch vụ từ `data/estimation/norms.csv`: mỗi dòng WBS gắn một mã Work Package (ví dụ `WP-MDL-RAW` 1 MD/bảng nguồn, `WP-INF-ENV` 10 MD/môi trường, `WP-TST-SIT` 18 MD/đợt), MD = Norm × số lượng × hệ số độ phức tạp. Bản hiện tại `v0-draft-2026-11`, chưa có MD thực tế.

- Có toolkit thì ghi mã WP trong cột "Cơ sở ước lượng" (ví dụ `WP-RPT-NEW 10 MD × 6`), để WBS và báo giá ra cùng MD. Không khớp WP nào thì ghi `WP-CUSTOM` kèm lý do.
- Độ phức tạp: chấm 4 tiêu chí 0/1/2 theo họ việc (`criteria.csv`); tổng ≥ 3 là Vừa, ≥ 6 là Cao; hệ số Thấp/Vừa/Cao = 0,7/1,0/1,4.
- Dự phòng rủi ro là **một dòng riêng** trong báo giá (theo độ phức tạp, cộng rủi ro có tên), không rải vào từng việc và không đưa vào `03-wbs.md`, master plan hay bảng MD của proposal. Vì vậy tổng MD báo giá lớn hơn tổng MD của WBS đúng bằng phần dự phòng.
- PM trong toolkit = 11,11% MD ngoài PM. Mức này thường thấp hơn quy tắc PM ≥ 75–80% thời gian dự án ở §1 (báo giá mẫu 13–16 tuần chỉ ra 45 MD PM, quy tắc cần khoảng 49–64). Master plan vẫn tính PM theo thời gian; lệch thì báo anh để sửa dòng PM trong báo giá.
- Norm được suy ra từ chính các WBS ước lượng của planner (3 dự án đã báo giá), nên không phải bằng chứng độc lập cho §2. Chỉ sửa Norm khi có từ 3 dự án đã nghiệm thu cùng lệch một hướng (toolkit `actuals.py calibrate`).
