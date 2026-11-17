# Mục lục tài liệu Hanas Data Platform

Chép từ bộ docs chính thức (Docusaurus, bản tiếng Việt), commit aebefe3 2026-11-16, bằng `scripts/sync_hanas_docs.py`.
Không sửa tay các file trong thư mục này: sửa ở repo docs rồi chạy lại script.
Tìm một tính năng, giới hạn (khối `:::caution`), yêu cầu hạ tầng, cổng hay phiên bản: grep theo từ khóa trong thư mục này.

| File | Nội dung |
|---|---|
| [PRODUCT.md](PRODUCT.md) | Định vị sản phẩm, tên gọi bắt buộc, điều không hứa, bằng chứng đang có |
| [index.md](index.md) | **Tài liệu Hanas Data Platform**: Hướng dẫn sử dụng, quản trị, vận hành và tích hợp Hanas Data Platform theo vai trò và thành phần sản phẩm. |
| [bi/index.md](bi/index.md) | **Dashboard và BI**: Xây dashboard bằng Superset trong Hanas Console hoặc kết nối công cụ BI bên ngoài tới query engine. |
| [bi/superset.md](bi/superset.md) | **Analytics với Superset trong Console**: Dùng Apache Superset nhúng trong Hanas Console để tạo dataset, chart và dashboard trên dữ liệu của query engine. |
| [bi/external-bi.md](bi/external-bi.md) | **Kết nối công cụ BI bên ngoài**: Kết nối Power BI, Tableau và Excel tới query engine qua JDBC, ODBC hoặc Arrow Flight bằng token truy cập cá nhân. |
| [connect/index.md](connect/index.md) | **Kết nối dữ liệu**: Hai cách đưa dữ liệu vào Hanas Data Platform - truy vấn trực tiếp nguồn ngoài hoặc nạp vào lakehouse Iceberg - và các trang hướng dẫn tương ứng. |
| [connect/data-sources.md](connect/data-sources.md) | **Nguồn dữ liệu truy vấn trực tiếp**: Thêm nguồn trong Connections để truy vấn trực tiếp object storage, catalog và các hệ thống khác bằng SQL, kèm tuỳ chọn metadata refresh và format file. |
| [connect/file-upload.md](connect/file-upload.md) | **Tải tệp lên**: Tải tệp CSV, JSON, Parquet hoặc Excel lên workspace từ cây DATA của SQL Editor và chọn định dạng trước khi lưu thành dataset. |
| [connect/ingestion.md](connect/ingestion.md) | **Nạp dữ liệu vào lakehouse (Ingestion)**: Nạp dữ liệu từ cơ sở dữ liệu, Kafka, S3 và REST API vào bảng Iceberg bằng Ingestion - khái niệm, engine, wizard tạo luồng, kiểu dữ liệu và giới hạn. |
| [connect/ingestion-schedules.md](connect/ingestion-schedules.md) | **Lịch chạy, checkpoint và chạy lại**: Đặt lịch cho luồng nạp, hiểu checkpoint và watermark, chạy lại, tải lại dữ liệu, theo dõi run và xử lý lỗi trong Ingestion. |
| [develop/index.md](develop/index.md) | **Tổng quan tích hợp**: Các bề mặt tích hợp của Hanas Data Platform, phương thức xác thực bằng token Keycloak hoặc Personal Access Token và quy ước lỗi chung. |
| [develop/sql-clients.md](develop/sql-clients.md) | **JDBC, ODBC và Arrow Flight**: Kết nối công cụ BI và ứng dụng tới query engine bằng JDBC, ODBC hoặc Arrow Flight, xác thực bằng Personal Access Token. |
| [develop/query-engine-api.md](develop/query-engine-api.md) | **REST API của query engine**: Các nhóm endpoint REST v3 của query engine và ví dụ cURL gửi SQL, theo dõi job và lấy kết quả. |
| [develop/ontology-api.md](develop/ontology-api.md) | **Ontology API**: Tham chiếu Ontology API cho tích hợp ứng dụng, gồm xác thực, base path và các nhóm endpoint kèm ví dụ cURL. |
| [develop/kapas-api.md](develop/kapas-api.md) | **Kapas API và SSE**: Xác thực, các endpoint chính của Kapas và hợp đồng sự kiện SSE (contract v1) để tích hợp chat Kapas vào ứng dụng của bạn. |
| [develop/ontology-query-dsl.md](develop/ontology-query-dsl.md) | **Ontology Query DSL**: Cú pháp Query DSL để liệt kê, lọc, tìm kiếm, tổng hợp và duyệt link giữa các object type, kèm ví dụ request và response JSON. |
| [develop/catalog-api.md](develop/catalog-api.md) | **Hanas Catalog API**: Các nhóm endpoint của Hanas Catalog API gồm tìm kiếm, chi tiết entity, lineage, glossary, tag và thu thập metadata. |
| [develop/kapas-embed.md](develop/kapas-embed.md) | **Nhúng Kapas vào ứng dụng**: Hai cách nhúng Kapas, iframe Kapas Console và giao diện tự xây trên Embed API với SSE, cùng ví dụ code backend và frontend. |
| [get-started/index.md](get-started/index.md) | **Bắt đầu với Hanas Data Platform**: Lộ trình tìm hiểu Hanas Data Platform và thực hiện truy vấn đầu tiên từ Hanas Console. |
| [get-started/introduction.md](get-started/introduction.md) | **Hanas Data Platform là gì**: Tổng quan vai trò, thành phần và mô hình triển khai Hanas Data Platform trên Kubernetes. |
| [get-started/architecture.md](get-started/architecture.md) | **Kiến trúc nền tảng**: Các lớp của Hanas Data Platform, luồng dữ liệu end-to-end và luồng danh tính khi truy vấn chạy dưới danh nghĩa người dùng. |
| [get-started/concepts.md](get-started/concepts.md) | **Khái niệm chính**: Định nghĩa ngắn các khái niệm cốt lõi xuyên suốt Hanas Data Platform, kèm liên kết tới trang chi tiết. |
| [get-started/console-tour.md](get-started/console-tour.md) | **Làm quen Hanas Console**: Các khu vực menu của Hanas Console, đối tượng sử dụng và điều kiện hiển thị. |
| [get-started/quickstart.md](get-started/quickstart.md) | **Quickstart: từ nguồn dữ liệu đến câu trả lời**: Hướng dẫn đi từ đăng nhập, thêm nguồn, truy vấn, lưu view và tăng tốc đến xem kết quả trong Analytics hoặc hỏi Kapas. |
| [govern/index.md](govern/index.md) | **Catalog & Quản trị dữ liệu**: Vai trò của Hanas Catalog, cách phân biệt với catalog thực thi của query engine và các trang hướng dẫn quản trị dữ liệu. |
| [govern/catalog.md](govern/catalog.md) | **Tìm kiếm và khám phá tài sản dữ liệu**: Tìm kiếm, lọc tài sản dữ liệu và đọc trang chi tiết dataset trong Hanas Catalog. |
| [govern/metadata-ingestion.md](govern/metadata-ingestion.md) | **Thu thập metadata**: Tạo source và recipe, kiểm tra kết nối, chạy theo lịch, theo dõi Run History và quản lý Secrets trong Hanas Catalog. |
| [govern/glossary-and-tags.md](govern/glossary-and-tags.md) | **Glossary, tag và ownership**: Xây dựng glossary, quản lý tag và chỉ định người sở hữu cho tài sản dữ liệu trong Hanas Catalog. |
| [govern/lineage.md](govern/lineage.md) | **Lineage**: Xem quan hệ upstream và downstream giữa các tài sản dữ liệu, các nguồn tạo lineage và giới hạn hiện tại. |
| [govern/access-control.md](govern/access-control.md) | **Phân quyền dữ liệu**: Các miền quyền trong Hanas Data Platform, nơi cấu hình từng loại quyền, grant trên query engine, row access policy và column masking. |
| [kapas/index.md](kapas/index.md) | **Kapas AI**: Giới thiệu Kapas, trợ lý AI của Hanas Data Platform giúp hỏi đáp dữ liệu, dựng dashboard và hỗ trợ các màn hình quản trị dữ liệu. |
| [kapas/chat-with-data.md](kapas/chat-with-data.md) | **Hỏi đáp dữ liệu bằng ngôn ngữ tự nhiên**: Cách hỏi số liệu, KPI và SQL với Kapas, luồng xử lý phía sau và cách đọc kết quả. |
| [kapas/agents.md](kapas/agents.md) | **Agent, skill và tool**: Danh sách system agent của Kapas trong Hanas, công cụ mỗi agent được dùng và cách skill hỗ trợ agent. |
| [kapas/reports-and-schedules.md](kapas/reports-and-schedules.md) | **Báo cáo, trích dẫn và lịch chạy**: Tạo dashboard và báo cáo với Kapas, kiểm chứng số liệu qua trích dẫn truy vấn và đặt lịch chạy lặp lại. |
| [kapas/safety.md](kapas/safety.md) | **An toàn và kiểm soát truy cập trong Kapas**: Kapas truy vấn dữ liệu dưới danh tính nào, SQL chỉ đọc được kiểm soát ra sao, vai trò của sandbox và các giới hạn quản trị cần biết. |
| [ontology/index.md](ontology/index.md) | **Ontology**: Tìm hiểu lớp Ontology, cách chuyển bảng và view thành đối tượng nghiệp vụ để khám phá và tích hợp dữ liệu. |
| [ontology/concepts.md](ontology/concepts.md) | **Khái niệm Ontology**: Giải thích object type, property, link type, interface, metric, action và vòng đời định nghĩa Ontology. |
| [ontology/workspace.md](ontology/workspace.md) | **Ontology Workspace: thiết kế và publish**: Hướng dẫn soạn concept, kiểm tra mapping, xem tác động và phát hành ontology trong workspace. |
| [ontology/mapping.md](ontology/mapping.md) | **Ánh xạ ontology vào dữ liệu**: Ánh xạ object type, property và link type vào dataset, khóa và điều kiện join; dùng automap và Mapping Copilot để tăng tốc. |
| [ontology/metrics.md](ontology/metrics.md) | **Metric**: Định nghĩa metric simple, ratio và derived, hiểu additivity, time semantics và nơi metric hiển thị trong Explore. |
| [ontology/explore.md](ontology/explore.md) | **Khám phá đối tượng**: Tìm object type, lọc và tìm kiếm record, vẽ biểu đồ nhanh, xem chi tiết, quan hệ và đồ thị của record. |
| [ontology/actions.md](ontology/actions.md) | **Action và yêu cầu thay đổi**: Luồng action request với maker-checker và bộ xử lý bên ngoài, cùng giới hạn hiện tại về writeback trực tiếp. |
| [ontology/governance.md](ontology/governance.md) | **Quản trị ontology**: Quy trình draft, review, publish, deployment, release gate, audit, role và import/export ontology. |
| [ontology/industry-templates.md](ontology/industry-templates.md) | **Mẫu ontology ngành ngân hàng**: Dùng mẫu ontology ngân hàng và template library để khởi tạo mô hình nghiệp vụ, sau đó bổ sung mapping cho dữ liệu của bạn. |
| [operate/index.md](operate/index.md) | **Tổng quan vận hành**: Hướng dẫn triển khai, cấu hình, quản lý danh tính và duy trì Hanas Data Platform trên Kubernetes. |
| [operate/deployment-architecture.md](operate/deployment-architecture.md) | **Kiến trúc triển khai**: Kiến trúc Kubernetes, datastore, đường truy cập và quan hệ phụ thuộc của các thành phần Hanas Data Platform. |
| [operate/requirements.md](operate/requirements.md) | **Yêu cầu hệ thống và sizing**: Điều kiện Kubernetes, công cụ, storage và tài nguyên tham chiếu để định cỡ triển khai Hanas Data Platform. |
| [operate/install.md](operate/install.md) | **Cài đặt bằng helmfile**: Các bước cài Hanas Data Platform trên Kubernetes bằng helmfile, từ chuẩn bị môi trường, secret, feature flag đến route gateway và kiểm tra sau cài. |
| [operate/configuration.md](operate/configuration.md) | **Tham chiếu cấu hình**: Feature flag, tham số vận hành chính và danh sách tên khoá secret của bộ cài Hanas Data Platform. |
| [operate/gateway.md](operate/gateway.md) | **API gateway và tên miền**: Cấu hình APISIX, tên miền, upstream, route và forwarded headers để truy cập Hanas Data Platform từ bên ngoài cluster. |
| [operate/identity.md](operate/identity.md) | **Xác thực và SSO với Keycloak**: Realm, client, role, mapper, SSO giữa các thành phần, token exchange và cách phân biệt URL public với URL nội bộ trong Keycloak. |
| [operate/user-management.md](operate/user-management.md) | **Quản lý người dùng, group và role**: Tạo và quản lý người dùng, group, role trong Settings của Hanas Console, đồng bộ qua Keycloak sang query engine và các ứng dụng. |
| [operate/ai-models.md](operate/ai-models.md) | **Cấu hình mô hình AI cho Kapas**: Khai báo provider và model cho Kapas, dùng endpoint OpenAI-compatible hoặc mô hình on-prem, các biến môi trường chính và khuyến nghị. |
| [operate/upgrade.md](operate/upgrade.md) | **Nâng cấp và rollback**: Quy trình nâng cấp image qua file images.yaml, migration theo từng thành phần và cách quay về phiên bản trước. |
| [operate/backup-recovery.md](operate/backup-recovery.md) | **Sao lưu và khôi phục**: Phạm vi dữ liệu và khoá cần sao lưu, thứ tự khôi phục theo phụ thuộc và khung runbook cần được kiểm chứng tại môi trường khách hàng. |
| [operate/health-checks.md](operate/health-checks.md) | **Kiểm tra sức khỏe và giám sát**: Cách dùng smoke test, các kiểm tra chức năng bổ sung và tín hiệu giám sát hằng ngày cho Hanas Data Platform. |
| [operate/troubleshooting.md](operate/troubleshooting.md) | **Xử lý sự cố**: Các sự cố đã biết khi cài đặt và vận hành Hanas Data Platform, trình bày theo triệu chứng, nguyên nhân và cách xử lý. |
| [query/index.md](query/index.md) | **Query Engine**: Vai trò của query engine trong Hanas Data Platform và các trang hướng dẫn truy vấn, semantic layer, tăng tốc và vận hành. |
| [query/sql-studio.md](query/sql-studio.md) | **SQL Editor**: Soạn và chạy SQL trong Hanas Console bằng SQL Editor, dùng cây dữ liệu, script, context, Run, nhiều statement, AI Agent và lưu truy vấn thành view. |
| [query/spaces-and-views.md](query/spaces-and-views.md) | **Workspace, folder và view (semantic layer)**: Tổ chức workspace, space, folder và view thành semantic layer theo bronze, silver, gold, cùng cách phân quyền. |
| [query/iceberg-tables.md](query/iceberg-tables.md) | **Bảng Iceberg — DDL, DML, time travel**: Tạo và thay đổi bảng Apache Iceberg bằng SQL, bảo trì file và snapshot, truy vấn lịch sử bằng time travel. |
| [query/acceleration.md](query/acceleration.md) | **Tăng tốc truy vấn với Reflection**: Dùng Raw và Aggregation Reflection để tăng tốc truy vấn lặp lại, cấu hình refresh và theo dõi trạng thái. |
| [query/jobs.md](query/jobs.md) | **Lịch sử job và profile truy vấn**: Xem lịch sử job của query engine, lọc theo trạng thái và người dùng, đọc chi tiết SQL, thời gian, profile và hủy job. |
| [query/workload-management.md](query/workload-management.md) | **Engine, queue và điều phối tải**: Quản lý engine, queue và quy tắc định tuyến truy vấn, kèm màn hình giám sát hoạt động của node. |
| [query/sql-reference.md](query/sql-reference.md) | **Tham chiếu SQL**: Tổng quan nhóm lệnh SQL, nhóm hàm và kiểu dữ liệu của query engine, kèm ví dụ thường dùng. |
| [reference/index.md](reference/index.md) | **Tham chiếu**: Tra cứu thuật ngữ, cổng và endpoint, thành phần và phiên bản, kênh hỗ trợ của Hanas Data Platform. |
| [reference/glossary.md](reference/glossary.md) | **Thuật ngữ**: Bảng thuật ngữ của Hanas Data Platform theo thứ tự chữ cái, mỗi thuật ngữ có định nghĩa ngắn và liên kết tới trang liên quan. |
| [reference/ports-and-endpoints.md](reference/ports-and-endpoints.md) | **Cổng và endpoint**: Bảng cổng và Service của các thành phần Hanas Data Platform trong cụm Kubernetes, cùng đường dẫn API qua gateway. |
| [reference/components-and-versions.md](reference/components-and-versions.md) | **Thành phần và phiên bản**: Danh sách thành phần của Hanas Data Platform, image và tag được ghim trong bộ cài, cùng cách ghi nhận phiên bản khi vận hành. |
| [reference/support.md](reference/support.md) | **Hỗ trợ và bảo trì**: Kênh hỗ trợ, mức độ nghiêm trọng, quy trình xử lý yêu cầu và quy trình bảo trì, vá lỗi cho Hanas Data Platform. |
| [transform/index.md](transform/index.md) | **Biến đổi và mô hình hóa dữ liệu**: Phát triển model dbt, điều phối Pipeline và xử lý bằng Spark để xây dựng các lớp dữ liệu trên lakehouse. |
| [transform/dbt-studio.md](transform/dbt-studio.md) | **dbt Studio — project và IDE**: Tạo project dbt, phát triển model trong IDE, kiểm tra SQL và quản lý thay đổi bằng Git trong Hanas Console. |
| [transform/dbt-runs.md](transform/dbt-runs.md) | **Chạy, kiểm thử và lập lịch dbt**: Chạy command dbt với target và selector, đọc log và artifacts, kiểm thử dữ liệu và cấu hình lịch chạy. |
| [transform/pipelines.md](transform/pipelines.md) | **Pipeline điều phối nhiều bước**: Ghép các Step dbt, SQL và Python thành đồ thị phụ thuộc, đặt lịch, backfill và theo dõi từng lần chạy trong Hanas Console. |
| [transform/compute.md](transform/compute.md) | **Compute — Spark và notebook**: Phát triển và chạy project PySpark, notebook, pipeline khai báo và streaming job trên Spark, xem log và kết quả trong Hanas Console. |
| [transform/modeling-standards.md](transform/modeling-standards.md) | **Chuẩn mô hình hóa**: Chuẩn khuyến nghị tổ chức dữ liệu theo bronze, silver, gold trên Iceberg và dbt, kèm Data Vault 2.0, SCD, surrogate key và cột audit. |
| [transform/naming-conventions.md](transform/naming-conventions.md) | **Quy ước đặt tên**: Quy ước đặt tên namespace, bảng, view, cột và khóa cho dữ liệu medallion và Data Vault trên lakehouse. |
