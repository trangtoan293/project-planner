# Hanas: thông tin thương mại và câu trả lời đã chốt

Bổ sung cho `hanas-product.md` (sổ tay tính năng). File này ghi những điều sổ tay không nói: giấy phép, hỗ trợ của hãng, phiên bản cấu phần, và câu trả lời anh đã chốt khi interview. Dùng lại cho mọi khách. Mỗi dòng ghi ngày chốt và khách đã hỏi lần đầu (chỉ để truy vết, không chép sang proposal khách khác).

| **Chủ đề** | **Câu trả lời** | **Chốt** |
|---|---|---|
| Mô hình giấy phép | Katalyst là hãng Hanas. Bán giấy phép **vĩnh viễn** theo cụm triển khai, **không giới hạn số người dùng**. | 14/10/2026, hỏi lần đầu qua dự án C |
| Cấu phần mã nguồn mở | Dremio (bản OSS), Superset, Keycloak miễn phí bản quyền; giấy phép Hanas bao trùm phần Katalyst phát triển. | 14/10/2026, dự án C |
| Bảo hành chính hãng | Katalyst cam kết bảo hành hãng 12 tháng; vì Katalyst vừa là hãng vừa là nhà thầu nên không có rủi ro "hãng không phản hồi". | 14/10/2026, dự án C |
| Giới hạn truy vấn đồng thời theo người/nhóm | Có sẵn: Queues & Engine routing của Hanas. | 14/10/2026, dự án C |
| Phân quyền theo dòng/cột, masking, hashing | Dremio bản OSS không có chính sách sẵn; Hanas làm bằng **view bảo mật** trên Dremio theo vai trò Keycloak, dữ liệu gốc giữ nguyên. Xếp mức `Cấu hình`, effort nhỏ cho mỗi bảng nhạy cảm. Không cần Dremio Enterprise. | 14/10/2026, dự án C |
| Kubernetes | Chưa có Helm chart đóng gói sẵn. Khách bắt buộc K8S: trả lời "Đáp ứng", Katalyst đóng gói Helm chart trong giai đoạn cài đặt, WBS tính cỡ L (~25–30 MD SysE/DEV). Khi đã có chart dùng được thì cập nhật dòng này để khách sau chỉ tính effort cấu hình. | 14/10/2026, dự án C |
| SLA hỗ trợ của hãng | Như SLA nhà thầu: giờ hành chính; mức 1 trong 2 giờ, mức 2 trong 1 ngày, mức 3 trong 2 ngày, mức 4 trong 3 ngày. **Cần đội sản phẩm xác nhận.** | 14/10/2026, dự án C |
| Định dạng dữ liệu | Đọc Parquet, ORC, Iceberg trên S3 qua Dremio, có sẵn. **Cần đội sản phẩm xác nhận ORC.** | 14/10/2026, dự án C |
| Active Directory | Đăng nhập AD qua Keycloak LDAP federation; người dùng đồng bộ sang Dremio qua User API. MFA bật trong Keycloak. **Cần đội sản phẩm xác nhận.** | 14/10/2026, dự án C |
| Hệ điều hành | Ubuntu hoặc RHEL, chạy container. **Cần đội sản phẩm xác nhận.** | 14/10/2026, dự án C |
| Nhúng Java | Pipeline không có bước Java; đáp ứng bằng bước Python gọi JAR (cần JRE trong image) hoặc dịch vụ REST. | 14/10/2026, dự án C |
| Xuất Word, email theo quyền, IP trong nhật ký | Superset không xuất Word; gửi email theo danh sách, không lọc quyền người nhận; nhật ký job Dremio không ghi IP. Phương án: làm thêm trong app, gửi theo nhóm đã phân quyền, ghép log Keycloak/nginx. | 14/10/2026, dự án C |
| CDC | Hanas chưa đóng gói CDC. Khách bắt buộc CDC: tích hợp Debezium (mã nguồn mở) vào Hanas, dựng và chạy thử 1 nguồn để chứng minh, effort cỡ M. | 14/10/2026, dự án C |
| Nguyên tắc hồ sơ thầu (loại B) | Không thu hẹp yêu cầu bắt buộc của E-HSMT bằng giả định hay điều kiện (giới hạn vòng, ngưỡng có ngoại lệ, change request cho mục khách đã yêu cầu). Điều kiện chỉ là căn cứ thiết kế; rủi ro tính vào giá. | 14/10/2026, rút từ review dự án C |
