# Lakehouse mã nguồn mở: sổ tay giải pháp

Dùng khi khách hoặc đối tác chỉ định bộ công nghệ mã nguồn mở (MinIO, Iceberg, Spark, Flink, Kafka, Airflow, Trino) thay cho Hanas. Katalyst bán **dịch vụ triển khai và hỗ trợ**, không bán giấy phép. Proposal theo hướng này **không nhắc Hanas, Dremio**.
Tạo 16/10/2026 cho dự án cty-xyz. Phiên bản cấu phần chốt ở bước thiết kế, ghi vào tài liệu thiết kế, không hứa số phiên bản trong proposal trừ khi khách yêu cầu (ví dụ "Iceberg v2 trở lên").

## 1. Cấu phần

| **Lớp** | **Cấu phần** | **Làm gì trong dự án** | **Ghi chú** |
|---|---|---|---|
| Lưu trữ đối tượng | MinIO hoặc tương đương S3 (Ceph RGW, SeaweedFS) | Lưu file nguồn, Raw/Silver/Gold, metadata | Xem rủi ro MinIO ở mục 3 |
| Định dạng bảng | Apache Iceberg (format v2) | Bảng ACID trên S3: tiến hóa lược đồ, xóa/cập nhật mức dòng, time travel, snapshot | Cần một catalog |
| Catalog bảng | Iceberg REST catalog (Apache Polaris hoặc Project Nessie) hoặc Hive Metastore | Đăng ký bảng cho Spark, Flink, Trino dùng chung | Chọn ở thiết kế |
| Xử lý lô | Apache Spark | Nạp, làm sạch, chuẩn hóa, tổng hợp Raw → Silver → Gold | Spark SQL / PySpark |
| Hàng đợi sự kiện | Apache Kafka (KRaft), Kafka Connect, Debezium | Nhận sự kiện, CDC từ CSDL nguồn, retry, dead-letter topic | CDC chỉ khi nguồn cho phép đọc log |
| Xử lý dòng | Apache Flink | Xử lý liên tục sự kiện, ghi Iceberg, cảnh báo gần thời gian thực | |
| Điều phối | Apache Airflow | Lịch chạy, phụ thuộc, chạy lại, cảnh báo lỗi pipeline | |
| Truy vấn / lớp ngữ nghĩa | Trino | SQL phân tán trên Iceberg; view Gold/Semantic cho BI qua JDBC/ODBC | Tableau kết nối qua driver Trino |
| Chất lượng dữ liệu | Great Expectations hoặc Soda Core (chạy trong pipeline) | Kiểm tra định dạng, đầy đủ, hợp lệ, trùng, đối soát nguồn-đích; chặn công bố Gold khi lỗi | |
| Quản trị dữ liệu | OpenMetadata | Danh mục dữ liệu, metadata, owner, glossary, lineage, kết quả kiểm tra chất lượng | Lineage Spark qua OpenLineage |
| Bảo mật | Keycloak (SSO, LDAP/AD), Trino access control (row filter, column mask) hoặc Apache Ranger, TLS | RBAC theo vai trò/đơn vị/domain, RLS, masking, audit log truy vấn | |
| Giám sát | Prometheus, Grafana, log tập trung | Theo dõi tài nguyên, độ trễ consumer Kafka, job lỗi | |
| Triển khai | Kubernetes + Helm chart cộng đồng, hoặc Docker trên VM | Theo hạ tầng khách cấp | |

## 2. Khả năng đã biết (có thể nói với khách)

- Kiến trúc medallion Raw/Bronze → Silver → Gold/Data Mart trên Iceberg; mọi engine đọc cùng một bản dữ liệu.
- Không ghi đè dữ liệu thô: Raw lưu nguyên file/bản ghi kèm hash, thời điểm nạp, phiên bản; Iceberg snapshot cho phép truy vấn lại trạng thái cũ.
- Trino phục vụ BI qua JDBC/ODBC, chỉ mở lớp Gold/Semantic cho tài khoản BI.
- Kafka + Flink cho luồng sự kiện có độ trễ dưới 5 phút **khi nguồn đẩy được sự kiện** (MQTT bridge, API, CDC).
- Airflow cho lịch chạy, chạy lại từng bước, cảnh báo qua email/webhook.
- OpenMetadata cho danh mục, owner, lineage mức bảng; lineage mức cột chỉ với connector hỗ trợ.

## Những điều không được hứa với khách hàng

| **Không hứa** | **Lý do / cách nói đúng** |
|---|---|
| SLA hoặc bảo hành của hãng cho cấu phần mã nguồn mở | Không có hãng đứng sau. Katalyst cam kết hỗ trợ, bảo hành **dịch vụ triển khai**; lỗi lõi phần mềm xử lý bằng cấu hình, nâng phiên bản hoặc báo cộng đồng, không hứa thời hạn sửa lõi. |
| Độ trễ realtime (< 5 phút) cho nguồn chưa có giao diện sự kiện/CDC | Nguồn chỉ có Excel, portal, export theo lô thì độ trễ theo lịch nạp. Chỉ hứa realtime cho nguồn đã sẵn sàng đẩy sự kiện. |
| Kết nối nguồn "dự kiến" (SCADA/IoT, Camera AI, RFID/GPS, nhật lệnh điện tử) khi nguồn chưa tồn tại | Dựng nền tảng và khung tích hợp; nguồn cụ thể làm khi sẵn sàng, theo khối lượng riêng. |
| Dự báo bằng ML/AI, quy trình nghiệp vụ có nhập liệu (xử lý đơn thư, quản lý đấu thầu, hợp đồng) | Lakehouse cấp dữ liệu; mô hình dự báo và ứng dụng nghiệp vụ là hạng mục khác. |
| Dashboard Tableau, giấy phép Tableau | Ngoài phạm vi khi đối tác/khách tự làm lớp BI. |
| Lineage mức cột đầy đủ cho mọi luồng | OpenMetadata/OpenLineage cho lineage mức bảng chắc chắn; mức cột tùy connector. |
| Giao diện quản trị MinIO bản cộng đồng đầy đủ | Xem rủi ro mục 3; nói "lưu trữ tương thích S3", chốt sản phẩm ở thiết kế. |
| Một con số hiệu năng truy vấn Trino cụ thể | Phụ thuộc hạ tầng, dung lượng, mô hình dữ liệu; chỉ cam kết sau đo kiểm trên hạ tầng thật. |

## 3. Rủi ro cần nêu

- **MinIO bản cộng đồng:** từ 2025 MinIO thu hẹp bản cộng đồng (bỏ phần lớn console quản trị, ngừng phát hành bản build cộng đồng; giấy phép AGPLv3). Kiểm tra lại lúc triển khai; phương án thay: build từ mã nguồn, MinIO AIStor (trả phí), Ceph RGW hoặc SeaweedFS.
- Nhiều cấu phần độc lập → cần đội vận hành có kỹ năng; bàn giao phải có runbook và đào tạo kỹ thuật.
- Nâng phiên bản giữa các cấu phần (Spark–Iceberg–Trino–Flink) phải kiểm tra tương thích.
