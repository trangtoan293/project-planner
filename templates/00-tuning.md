# Điều chỉnh riêng cho dự án <KH>

Chép file này vào `projects/<kh>/00-tuning.md` khi dự án cần khác knowledge chung (`knowledge/estimation.md`, `knowledge/proposal-format.md`). Agent đọc file này **trước** knowledge chung; mục nào ở đây thắng mục tương ứng ở đó. Mục nào không cần thì để trống.

Mỗi dòng là một gạch đầu dòng, **kèm lý do**. Không có lý do thì agent không áp dụng.
Ngày tháng, số người tối đa, tỷ trọng vai trò, độ dài sprint là con số script kiểm, nên đặt ở `00-params.txt` (`kickoff`, `team_max`, `role_share`, `sprint_weeks`), không đặt ở đây.

## Đơn giá MD
<!-- Thay một dòng benchmark của estimation.md §2. Ví dụ:
- Tích hợp nguồn T24: 1,5 MD/bảng thay vì 1,0, vì khách không có tài liệu cấu trúc bảng.
- Dashboard: 3 MD/dashboard, vì khách đã có semantic model sẵn. -->

## Khung milestone
<!-- Thay khung estimation.md §4 hoặc bảng 14.1. Hồ sơ thầu quy định giai đoạn thì không cần ghi ở đây: luôn theo hồ sơ thầu. Ví dụ:
- M1 gồm 2 nguồn (IGT, Opera), vì khách cần báo cáo Marketing kết hợp hai nguồn ngay đợt đầu. -->

## Vai trò của đội
<!-- Vai trò chi tiết dùng trong cột owner và cách cộng vào 5 cột master plan. Ví dụ:
- Thêm QA Automation, cộng vào Tester, vì khách yêu cầu kiểm thử hồi quy tự động.
- DevOps cộng vào DEV thay vì SysE, vì đội DE tự lo pipeline CI/CD. -->

## Quy tắc khác
<!-- Ví dụ:
- SIT 1 tuần mỗi đợt thay vì 2, vì phạm vi mỗi đợt dưới 5 báo cáo.
- Không cần PM tham gia ≥ 80% (đặt pm_min trong 00-params.txt), vì khách có PMO riêng. -->
