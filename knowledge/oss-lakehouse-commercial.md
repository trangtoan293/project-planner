# Lakehouse mã nguồn mở: thông tin thương mại và câu trả lời đã chốt

Bổ sung cho `oss-lakehouse-product.md`. Mỗi dòng ghi ngày chốt và khách hỏi lần đầu (chỉ để truy vết).

| **Chủ đề** | **Câu trả lời** | **Chốt** |
|---|---|---|
| Hướng giải pháp | Theo bộ mã nguồn mở khách/đối tác chỉ định, không đề xuất Hanas. | 16/10/2026, anh chốt qua dự án cty-xyz |
| Giấy phép | Không thu phí giấy phép phần mềm; chi phí là dịch vụ triển khai, hỗ trợ. Giấy phép BI (Tableau) do khách/đối tác. | 16/10/2026, cty-xyz |
| Bảo hành | Bảo hành dịch vụ triển khai 12 tháng sau nghiệm thu; không có bảo hành hãng cho cấu phần mã nguồn mở. | 16/10/2026, cty-xyz [D] |
| Hạ tầng | Khách/đối tác cấp máy chủ, mạng, hệ điều hành; Katalyst cài đặt, cấu hình. | 16/10/2026, cty-xyz [D] |
| CDC | Debezium + Kafka Connect, khi nguồn cho phép đọc log giao dịch. | 16/10/2026, cty-xyz [D] |
| Phân quyền dòng/cột | Trino access control (row filter, column mask) theo vai trò Keycloak; Ranger nếu khách đã dùng. | 16/10/2026, cty-xyz [D] |
