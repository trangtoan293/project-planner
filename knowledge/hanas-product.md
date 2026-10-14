<!-- Sinh tự động từ samples/hanas_docs/index.html (bản 13/10/2026). Cập nhật:
     pandoc samples/hanas_docs/index.html -f html -t gfm-raw_html --wrap=none | sed -E 's/<[^>]+>//g' | cat -s > knowledge/hanas-product.md
     Sơ đồ tương tác: samples/hanas_docs/diagrams/*.html -->

Tài liệu nội bộ cho đội kinh doanh

# Hanas Data Platform: từng dịch vụ làm gì, chạy thế nào, giải quyết vấn đề gì

Sổ tay này mô tả Hanas phiên bản mới, viết dựa trên mã nguồn hiện tại. Mỗi dịch vụ có cùng một khung: vấn đề của khách hàng, tính năng, cách hoạt động, câu nói khi demo và những điều không được hứa.

Phiên bản: **Hanas mới** (Dremio 26.1.6, dbt Studio Java, Hanas Catalog) Mốc mã nguồn: **3bb7d41a5** Cập nhật: **13/10/2026**

Tóm tắt 30 giây

## Một nền tảng dữ liệu, một lần đăng nhập, quyền đi theo người dùng

Hanas gom việc kết nối, truy vấn, biến đổi, quản trị, phân tích và hỏi đáp AI trên dữ liệu vào một giao diện tiếng Việt. Lõi truy vấn là Dremio: Hanas đọc dữ liệu tại chỗ từ cơ sở dữ liệu, kho đối tượng và lakehouse của khách hàng, không bắt buộc sao chép trước.

Quanh lõi đó là các dịch vụ chuyên biệt: dbt Studio để xây mô hình dữ liệu, Data Pipeline để điều phối và lập lịch, Hanas Catalog để tìm kiếm và truy vết nguồn gốc, Ontology để định nghĩa đối tượng và chỉ số nghiệp vụ, và các AI Agent hỗ trợ ngay trong từng màn hình. Mọi dịch vụ dùng chung Keycloak SSO và chạy truy vấn bằng quyền của chính người dùng.

**Kết nối**Hơn 20 loại nguồn: Oracle, MySQL, Postgres, SQL Server, S3, Iceberg, Snowflake…

**Biến đổi**dbt trên trình duyệt, Git, test, lịch chạy; Pipeline kéo-thả có rẽ nhánh

**Quản trị**Catalog, lineage, glossary, phân quyền theo vai trò, audit đúng người

**Khai thác**SQL, Superset, Power BI/Tableau, AI hỏi đáp có phê duyệt

Kiến trúc

## Kiến trúc tổng thể

Người dùng chỉ làm việc với Hanas Workspace. Workspace gọi Dremio để truy vấn và gọi từng dịch vụ chuyên biệt cho phần việc của nó. Các dịch vụ khi cần dữ liệu đều đi qua Dremio, nên quyền truy cập được kiểm tra ở một chỗ.

Sơ đồ tương tác: bấm vào node để xem quan hệ; "Play story" để trình chiếu từng lớp.[Mở toàn màn hình ↗](diagrams/01-tong-quan.html)

| Thành phần | Vai trò | Công nghệ |
|----|----|----|
| Hanas Workspace | Giao diện web hợp nhất cho mọi vai trò, tiếng Việt và tiếng Anh | React 18, chạy sau nginx |
| Query Engine | Truy vấn liên nguồn, quản lý nguồn, job, reflection, phân quyền dữ liệu | Dremio 26.1.6 |
| dbt Studio | IDE dbt trên web, Git, chạy model, lịch chạy, Pipeline, biểu đồ | Java 21 Spring Boot, dbt CLI, Postgres, Redis |
| Hanas Catalog | Danh mục dữ liệu, tìm kiếm, lineage, glossary, tag, thu thập metadata | Python FastAPI (catalog-api + ingest-runner), Postgres |
| Ontology | Đối tượng, quan hệ, chỉ số nghiệp vụ, quy trình phát hành có phê duyệt | Dịch vụ Ontology riêng (FastAPI) |
| AI Agents | Trợ lý AI theo màn hình, định tuyến agent, phê duyệt thao tác | KaPaS agent runtime |
| User API | Tạo, sửa, xóa người dùng đồng thời ở Keycloak và Dremio | Java Spring Boot, không lưu dữ liệu |
| Keycloak | Đăng nhập một lần, vai trò, bản dịch giao diện | Keycloak 26 |
| Superset | Dashboard và biểu đồ, nhúng trong Workspace | Apache Superset |

Luồng giá trị

## Vòng đời dữ liệu trên Hanas

Đây là câu chuyện nên kể trong mọi buổi demo: dữ liệu đi từ hệ thống nghiệp vụ, qua lớp kết nối, được biến đổi thành dữ liệu sạch, được gắn ngữ cảnh, rồi đến tay người dùng cuối và AI.

Năm chặng: Nguồn → Kết nối → Biến đổi → Lưu & quản trị → Khai thác.[Mở toàn màn hình ↗](diagrams/02-vong-doi-du-lieu.html)

Phiên bản

## Hanas bản mới khác bản cũ thế nào

Bộ tài liệu cũ mô tả một tập hợp nhiều công cụ mã nguồn mở đặt cạnh nhau (NiFi, Kafka, Airflow, DataHub, Dify…). Bản mới gom phần lớn chức năng vào ít dịch vụ hơn, dùng chung đăng nhập và quyền. Khi khách hàng đã đọc tài liệu cũ, dùng bảng này để giải thích.

| Nhu cầu | Bản cũ | Bản mới |
|----|----|----|
| Thu thập, kết nối nguồn | Apache NiFi kéo dữ liệu về | Dremio đọc trực tiếp tại nguồn; khi cần nạp dữ liệu thì dùng bước Dremio SQL trong Data Pipeline |
| Điều phối, lập lịch | Apache Airflow riêng | Data Pipeline và lịch chạy dbt có sẵn trong dbt Studio |
| Mô hình hóa dữ liệu | dbt chạy dòng lệnh | dbt Studio: IDE trên web, Git, mẫu Data Vault 2.0 |
| Danh mục dữ liệu | DataHub (nhiều thành phần nặng) | Hanas Catalog: một image, Postgres, lọc theo quyền Dremio |
| AI | Dify, vLLM, Langfuse | AI Agents (KaPaS) gắn vào từng màn hình, có phê duyệt thao tác |
| Ngữ nghĩa nghiệp vụ | Semantic layer trong Dremio | Ontology: đối tượng, quan hệ, chỉ số, phát hành có phê duyệt |
| Streaming | Apache Kafka | Không đóng gói sẵn; thiết kế theo dự án nếu khách cần dữ liệu thời gian thực |

Dịch vụ

## Mười dịch vụ, cùng một khung trình bày

Mỗi phiếu dịch vụ gồm: vấn đề khách hàng gặp và cách Hanas giải quyết, tính năng chính, cách hoạt động, người dùng, câu nói khi demo, và phần lưu ý nội bộ. Phần lưu ý màu cam là để đội kinh doanh biết giới hạn, không đưa nguyên văn cho khách.

Trải nghiệmMọi vai trò

## Hanas Workspace

Một giao diện web duy nhất, tiếng Việt, mở ra đúng những gì người dùng được phép dùng.

#### Vấn đề → Giải pháp

Mỗi công cụ một giao diện, một mật khẩu, người dùng phải nhớ nhiều địa chỉ→Một địa chỉ, một lần đăng nhập SSO, menu gom theo nhóm việc

Giao diện tiếng Anh, khó phổ cập cho người dùng nghiệp vụ→Tiếng Việt mặc định, đổi sang tiếng Anh một chạm; quản trị viên tự sửa câu chữ mà không cần cập nhật phần mềm

Không biết hệ thống đang có sự cố cho tới khi người dùng phàn nàn→Chuông thông báo cảnh báo CPU, RAM, dung lượng, nguồn mất kết nối, reflection lỗi

#### Tính năng chính

- **Trang chủ**: số liệu nhanh (nguồn, job hôm nay), lối tắt tạo nguồn, viết SQL, tạo dự án dbt, hoạt động gần đây.
- **Overview** cho quản trị viên: thống kê schema, bảng theo định dạng, sức khỏe reflection, CPU/RAM từng node, biểu đồ job 24 giờ.
- **Menu theo quyền**: Analytics, Ontology, dbt chỉ hiện với người có vai trò tương ứng.
- **Thông báo**: cảnh báo hạ tầng và dữ liệu, báo khi AI trả lời xong; bấm vào để tới đúng chỗ cần xử lý.
- **Bản dịch**: trang Settings → Bản dịch sửa câu chữ tiếng Việt và tiếng Anh, có tìm kiếm, sao lưu, hoàn tác.
- **Nhãn trắng**: nút đăng nhập ghi "SSO", không lộ tên sản phẩm bên dưới.

#### Hoạt động thế nào

1.  Người dùng đăng nhập SSO qua Keycloak; Dremio nhận cùng danh tính.
2.  Workspace lấy thêm token Keycloak ngầm để gọi các dịch vụ khác.
3.  Bản dịch tải từ Keycloak trước khi hiển thị trang.
4.  Mỗi màn hình gọi đúng dịch vụ của nó qua cổng nginx: `/api` tới Dremio, `/catalog-api` tới Catalog, `/dbt-runner` tới dbt Studio…

#### Người dùng

Tất cả: quản trị viên, kỹ sư dữ liệu, chuyên viên phân tích, người dùng nghiệp vụ.

"Anh chị chỉ cần nhớ một địa chỉ. Đăng nhập một lần là thấy đúng những gì mình được phép làm, bằng tiếng Việt."

**Lưu ý nội bộ:** ẩn menu chỉ là lớp giao diện; quyền thật do từng dịch vụ kiểm tra. Một vài ô số liệu trên Trang chủ (số dataset, dataset gần đây) còn phụ thuộc DataHub cũ và có thể trống ở môi trường mới.

Lõi dữ liệuKỹ sư dữ liệuPhân tích

## Query Engine & SQL Studio

Truy vấn mọi nguồn bằng một câu SQL, ngay tại chỗ, với trình soạn SQL đầy đủ trên trình duyệt.

#### Vấn đề → Giải pháp

Dữ liệu nằm rải rác nhiều hệ thống, muốn ghép phải viết ETL chép về một chỗ→Kết nối nguồn vào Dremio rồi JOIN trực tiếp giữa Oracle, Postgres, file trên S3…

Báo cáo chậm vì truy vấn thẳng vào hệ thống nghiệp vụ→Reflection (bản tăng tốc) do Dremio tự dùng khi truy vấn khớp

Mỗi công cụ BI cấu hình kết nối riêng tới từng nguồn→Một cổng JDBC/ODBC/Arrow Flight; mở Power BI, Tableau từ dataset bằng một nút

#### Tính năng chính

- **Kết nối nguồn** (màn Connections): lakehouse (Iceberg REST, Nessie, Glue, Hive, Unity Catalog, Snowflake Open Catalog), kho đối tượng (S3, Azure, GCS, HDFS, NAS), cơ sở dữ liệu (Oracle, MySQL, Postgres, SQL Server, MongoDB, Elasticsearch, Redshift, Snowflake…).
- **Duyệt nguồn**: xem thư mục, định dạng file thành bảng, làm mới metadata, xem lineage, mở bằng Power BI/Tableau.
- **SQL Studio**: nhiều tab, gợi ý cú pháp, định dạng SQL, chạy cả câu hoặc phần chọn, xem kết quả, lịch sử job, hồ sơ thực thi.
- **Script**: lưu, đổi tên, chia sẻ; xem "của tôi" và "tất cả".
- **Cây dữ liệu**: tạo workspace (space), thư mục, tải file lên, phân quyền, lưu view, wiki dạng markdown, tag.
- **Job**: danh sách job, chi tiết, hồ sơ trực quan, hủy job.
- **Trợ lý SQL Copilot** mở SQL, chèn SQL, chạy trình soạn; câu lệnh có thể sửa dữ liệu luôn chờ người dùng xác nhận.

#### Hoạt động thế nào

1.  Quản trị viên khai báo nguồn; Dremio đọc schema của nguồn.
2.  Người dùng viết SQL; Dremio lập kế hoạch, đẩy phần lọc xuống nguồn khi được, ghép kết quả.
3.  Nếu có reflection khớp, Dremio đọc từ đó thay vì nguồn gốc.
4.  Quyền theo user và role được Dremio kiểm tra trên từng bảng, từng view.

#### Người dùng

Kỹ sư dữ liệu, chuyên viên phân tích, công cụ BI và ứng dụng bên ngoài.

"Không cần chuyển dữ liệu đi đâu cả. Kết nối nguồn xong là anh chị JOIN được giữa Oracle và file trên S3 trong một câu SQL."

**Lưu ý nội bộ:** nút "Explain job" trong chi tiết job chưa hoạt động. Hiệu năng liên nguồn phụ thuộc mạng, driver và khả năng đẩy điều kiện xuống nguồn; luôn đo trên dữ liệu thật của khách trước khi cam kết thời gian phản hồi.

Quản trị dữ liệuData ownerPhân tích

## Hanas Catalog

Danh mục dữ liệu để tìm đúng bảng, biết bảng từ đâu ra, ai phụ trách, và chỉ thấy những gì mình được phép thấy.

#### Vấn đề → Giải pháp

Không ai biết bảng nào chứa dữ liệu gì, hỏi qua lại mất nhiều ngày→Tìm kiếm theo tên, mô tả, tên cột; lọc theo nền tảng, tag, chủ sở hữu, thuật ngữ

Sửa một bảng gốc mà không biết báo cáo nào bị ảnh hưởng→Lineage nhiều tầng và phân tích tác động (upstream, downstream)

Danh mục lộ cả tên bảng nhạy cảm cho người không có quyền→Catalog hỏi Dremio xem người đang xem được thấy gì; bảng không được phép thì không hiện

DataHub nặng, nhiều thành phần, khó vận hành→Một image chạy hai chế độ, chỉ cần Postgres

#### Tính năng chính

- **Tìm kiếm** có bộ lọc (loại, nền tảng, môi trường, tag, owner, thư mục) và cây duyệt.
- **Trang dataset**: cột, định nghĩa view, tài liệu, lineage dạng đồ thị và danh sách tác động, thuộc tính.
- **Glossary**: cây thuật ngữ nghiệp vụ, quan hệ giữa thuật ngữ.
- **Tag**: tạo, đổi màu, gắn cho dataset.
- **Thu thập metadata**: trình hướng dẫn tạo nguồn, lịch cron theo múi giờ, kiểm tra kết nối, chạy, hủy, rollback, xem log và báo cáo.
- **Nguồn được bật sẵn**: Dremio (connector riêng, có lineage view), Oracle, dbt, dbt Cloud. Thêm loại khác khi đóng gói image.
- **API ghi lineage** cho dbt Studio và công cụ ETL, có chế độ chạy thử; tách lineage từ câu SQL.

#### Hoạt động thế nào

1.  `catalog-api` phục vụ giao diện; không giữ trạng thái nên chạy nhiều bản song song được.
2.  Bấm chạy chỉ tạo một bản ghi "chờ xử lý" trong Postgres.
3.  `ingest-runner` nhận việc, chạy connector trong tiến trình con cách ly.
4.  Toàn bộ kết quả ghi trong một transaction: lỗi giữa chừng thì catalog giữ nguyên.
5.  Bảng biến mất khỏi nguồn được đánh dấu xóa mềm, có ngưỡng an toàn chống xóa nhầm hàng loạt.

Một lần thu thập metadata, từ cấu hình đến kết quả.[Mở toàn màn hình ↗](diagrams/05-catalog-ingestion.html)

"Người dùng tìm thấy dữ liệu trong vài giây, thấy bảng đó lấy từ đâu, và tuyệt đối không thấy những bảng mình không có quyền."

**Lưu ý nội bộ:** chưa có Domain, Data Product, chất lượng dữ liệu, thống kê truy vấn và profiling. Sửa mô tả, owner trên trang chi tiết đang tắt mặc định. Menu Catalog cần quản trị viên bật trong Preferences. Lineage là mức bảng, chưa có mức cột. Mặc định mọi người dùng đăng nhập đều có quyền quản lý catalog; khi triển khai cần giới hạn lại vai trò quản lý.

Biến đổi dữ liệuKỹ sư dữ liệuAnalytics engineer

## dbt Studio

Xây mô hình dữ liệu bằng dbt ngay trên trình duyệt: viết, chạy, kiểm thử, quản lý phiên bản và lập lịch ở một chỗ.

#### Vấn đề → Giải pháp

Mỗi kỹ sư phải tự cài Python, dbt, cấu hình profile trên máy→IDE trên web, kết nối Dremio của nền tảng có sẵn, tạo dự án là chạy được

Dùng chung một tài khoản dịch vụ, không biết ai đã chạy gì→Mỗi lần chạy dùng chính quyền Dremio của người bấm; lịch chạy dùng quyền người tạo

Bắt đầu Data Vault từ con số không→Mẫu dự án Dremio + Data Vault 2.0 có sẵn (raw vault, business vault, data mart)

Chạy lỗi lúc đêm, sáng ra mới biết, không có log→Lịch sử chạy, log trực tiếp, kết quả từng model, webhook báo lỗi

#### Tính năng chính

- **Dự án**: tạo trống, `dbt init`, hoặc từ mẫu Data Vault; nhập/xuất file nén; thùng rác và khôi phục; biến môi trường, target dev/prod.
- **IDE**: cây file, Monaco có gợi ý model/source/macro, xem SQL đã biên dịch, kế hoạch truy vấn, xem trước dữ liệu, lineage, terminal.
- **Lệnh dbt**: run, build, test, seed, snapshot, deps, source freshness, docs generate; log trực tiếp.
- **Git** tích hợp (không cần cài git): status, diff, commit, push, pull, branch; token Git của từng người được mã hóa.
- **Python**: chạy file hoặc đoạn chọn, cài gói pip riêng cho từng dự án.
- **Explore**: SQL console, dashboard dạng YAML trong dự án với 8 loại biểu đồ, tài liệu dbt docs.
- **Orchestrate**: lịch sử chạy, lịch cron, tạm dừng, chạy ngay, webhook khi lỗi.
- **Phân quyền ba mức**: dbt-viewer (xem), dbt-editor (sửa, chạy), dbt-admin (kết nối, xóa dự án).

#### Hoạt động thế nào

1.  Kiểm tra token Keycloak và vai trò dbt.
2.  Giới hạn số lần chạy đồng thời toàn cụm (mặc định 10) và khóa theo dự án.
3.  Đổi token Keycloak của người dùng thành token Dremio.
4.  Sinh `profiles.yml`; mật khẩu chỉ đi qua biến môi trường, không ghi ra file.
5.  Chạy dbt, đẩy log từng dòng về trình duyệt, đọc `run_results.json`, lưu lịch sử.

Một người sửa dự án tại một thời điểm (khóa phiên sửa); người khác xem chỉ đọc. Mã nguồn dự án được đồng bộ sang vùng lưu trữ bền vững.

Đăng nhập một lần; Catalog lọc theo quyền; dbt chạy bằng chính người dùng.[Mở toàn màn hình ↗](diagrams/03-dang-nhap-phan-quyen.html)

"Mở trình duyệt là có môi trường dbt chuẩn. Mỗi model chạy dưới tên anh chị, nên phân quyền và nhật ký kiểm toán của Dremio vẫn đúng tới từng người."

**Lưu ý nội bộ:** chưa có lineage mức cột; chưa hỗ trợ phát hành thẳng sang Iceberg; thông báo lỗi chỉ qua webhook (chưa có email, Slack). Mọi người có vai trò dbt thấy tất cả dự án trong cùng workspace, chưa tách theo nhóm. Kết nối hỗ trợ: Dremio, Postgres, DuckDB.

Điều phốiKỹ sư dữ liệuVận hành

## Data Pipeline

Ghép các bước dbt, Dremio SQL và Python thành một luồng kéo-thả, có rẽ nhánh, thử lại, xử lý lỗi và lịch chạy.

#### Vấn đề → Giải pháp

Phải dựng và vận hành thêm Airflow chỉ để chạy theo lịch→Pipeline có sẵn trong nền tảng, vẽ trên canvas, không viết code điều phối

Một bước lỗi là cả luồng dừng, phải chạy lại từ đầu→Thử lại theo từng bước; chạy lại chỉ phần lỗi, tái dùng kết quả bước đã thành công

Máy chủ khởi động lại giữa chừng là mất lượt chạy→Lượt chạy lưu vào CSDL trước khi xếp hàng; máy khác tự nhận và chạy tiếp

#### Các loại bước

- **Start**: tham số đầu vào (chữ, số, lựa chọn, checkbox).
- **dbt**: một lệnh dbt, chọn model, chọn target.
- **Dremio SQL**: gửi SQL, chờ job xong, trả số dòng; hủy luồng thì hủy luôn job.
- **Python**: chạy file trong dự án, nhận kết quả bước trước, trả kết quả cho bước sau.
- **Branch**: rẽ nhánh theo điều kiện, có nhánh ELSE.
- **End**: chọn giá trị trả về của lượt chạy.
- **Nhóm, ghi chú** để sắp xếp canvas.

#### Khả năng vận hành

- Thử lại 1–10 lần, có thời gian chờ giữa các lần.
- Mũi tên "on failure": chạy bước cảnh báo hoặc dọn dẹp khi bước trước lỗi.
- Chạy một bước, chạy từ một bước, chạy lại lượt cũ.
- Mỗi lượt chạy chụp lại định nghĩa, sửa Pipeline không ảnh hưởng lượt đang chạy.
- Kiểm tra trước khi lưu: vòng lặp, cú pháp điều kiện, target không tồn tại.
- Lịch cron mỗi phút, chỉ một máy chủ kích hoạt, không chạy chồng lượt.
- Trạng thái từng bước cập nhật trực tiếp trên canvas.

Đường chạy chính, nhánh lỗi và cơ chế tự phục hồi.[Mở toàn màn hình ↗](diagrams/04-pipeline-run.html)

"Anh chị vẽ luồng như vẽ sơ đồ: nạp dữ liệu, chạy model, kiểm tra điều kiện, lỗi thì báo. Hệ thống tự thử lại và không bao giờ mất một lượt chạy."

**Lưu ý nội bộ:** mỗi Pipeline thuộc một dự án dbt. Khi hủy lượt chạy, bước dbt đang chạy dở có thể vẫn chạy nốt. Kích hoạt theo sự kiện bên ngoài chưa phải tính năng hoàn chỉnh; giới thiệu là thủ công và cron.

Ngữ nghĩaData ownerNghiệp vụ

## Ontology

Mô tả doanh nghiệp bằng ngôn ngữ nghiệp vụ: khách hàng, hợp đồng, giao dịch và các chỉ số, gắn vào dữ liệu thật và phát hành có phê duyệt.

#### Vấn đề → Giải pháp

Mỗi phòng ban tính "doanh thu" một kiểu, số liệu vênh nhau→Chỉ số định nghĩa một lần, có công thức, kiểm tra và phát hành chính thức

Người nghiệp vụ không hiểu tên bảng kỹ thuật→Duyệt dữ liệu theo đối tượng và quan hệ, xem đồ thị liên kết

AI trả lời sai vì không hiểu nghĩa của dữ liệu→Ontology làm ngữ cảnh cho AI: đối tượng, quan hệ, chỉ số đã được duyệt

#### Tính năng chính

- **Explore**: đồ thị ontology, danh sách bản ghi, lọc, tải CSV, chi tiết bản ghi và các đối tượng liên kết, xem theo mốc thời gian.
- **Workbench 4 bước**: Khái niệm → Ánh xạ → Chỉ số → Phát hành, có danh sách việc còn thiếu ở mỗi bước.
- **Ánh xạ** khái niệm vào dataset Dremio, gợi ý cột khóa, tự ánh xạ, AI hỗ trợ ánh xạ.
- **Metric Studio**: viết công thức, xem trước, kiểm tra.
- **AI soạn nháp**: đề xuất khái niệm từ mẫu hoặc nguồn dữ liệu, người dùng duyệt từng đề xuất.
- **Phát hành**: kiểm tra, gửi duyệt, phê duyệt hoặc từ chối, lịch sử phiên bản, quay lại phiên bản cũ.
- **Governance**: nhật ký kiểm toán, action, interface, vòng đời; yêu cầu thay đổi có phê duyệt.

#### Hoạt động thế nào

1.  Workspace gọi dịch vụ Ontology bằng token Keycloak của người dùng.
2.  Ontology đọc dữ liệu qua dataset Dremio đã ánh xạ.
3.  Thay đổi đi theo vòng nháp → duyệt → phát hành; chỉ bản đã phát hành mới dùng chính thức.

#### Phân quyền

**ontology-viewer**: Explore, Requests. **ontology-editor**: thêm Workbench. **ontology-admin**: thêm Governance.

"Anh chị định nghĩa 'khách hàng' và 'doanh thu' một lần, có người duyệt. Từ đó dashboard, báo cáo và AI đều dùng chung một định nghĩa."

**Lưu ý nội bộ:** Ontology là dịch vụ triển khai riêng cạnh Hanas. Menu Ontology chỉ hiện khi tính năng AI được bật và người dùng có vai trò ontology. Cần dự toán công tư vấn để xây mô hình khái niệm cho từng khách hàng.

AIMọi vai trò

## AI Agents

Trợ lý AI có mặt trong mọi màn hình, hiểu màn hình người dùng đang làm việc, và không làm gì nguy hiểm khi chưa được đồng ý.

#### Vấn đề → Giải pháp

Người nghiệp vụ không viết được SQL, phải chờ đội kỹ thuật→Hỏi bằng tiếng Việt, AI viết SQL, trả bảng và biểu đồ

Chatbot chung chung, không biết người dùng đang làm gì→Mỗi màn hình có agent chuyên trách và nhận ngữ cảnh của màn hình đó

Lo AI tự ý sửa, xóa dữ liệu→Bốn mức an toàn; thao tác ghi hiện thẻ phê duyệt để người dùng quyết định

#### Agent theo màn hình

| Màn hình           | Agent             |
|--------------------|-------------------|
| SQL Studio         | SQL Copilot       |
| dbt Studio         | Project Copilot   |
| Analytics          | Dashboard Copilot |
| Ontology, màn khác | Hanas Analyst     |

Câu hỏi đầu tiên được định tuyến tự động tới agent phù hợp; nếu không chắc, hệ thống hỏi lại người dùng.

#### Tính năng chính

- Trang chat đầy đủ: trả lời dạng stream, kết quả dạng bảng, biểu đồ, SQL; lịch sử, tìm kiếm, ghim hội thoại.
- Panel AI bên phải trên mọi màn hình.
- Thao tác trên màn hình: mở SQL vào tab, chèn SQL, chạy trình soạn, tải lại dashboard.
- Với dbt: đọc, sửa file, chạy dbt, sinh model staging, dựng biểu đồ qua bộ công cụ riêng.
- **Tool Execution Security**: STRICT (mọi thao tác cần duyệt), SMART (rủi ro trung bình trở lên cần duyệt), AUTO (mặc định, công cụ được đánh dấu cần duyệt), OFF.
- Thông báo khi AI trả lời xong lúc panel đang đóng.

Hỏi → làm việc với công cụ → phê duyệt thao tác.[Mở toàn màn hình ↗](diagrams/06-ai-agent.html)

#### Nguyên tắc an toàn

- Nút "chạy" chỉ chạy đúng SQL người dùng đang thấy trong trình soạn, AI không tự chèn SQL khác vào lệnh chạy.
- SQL không chắc chắn là chỉ-đọc luôn hỏi xác nhận.
- Ngữ cảnh gửi cho AI có giới hạn kích thước và không chứa dữ liệu dòng.
- Xem lại lịch sử chat không chạy lại thao tác cũ.

"Hỏi bằng tiếng Việt, AI làm phần kỹ thuật. Việc gì có thể thay đổi dữ liệu đều chờ anh chị bấm đồng ý."

**Lưu ý nội bộ:** AI chạy trên KaPaS, triển khai riêng và cần cổng (gateway) định tuyến `/api/kapas`. Việc AI đọc ngữ cảnh màn hình đã xong phía giao diện; phía KaPaS đang hoàn thiện, nên demo trước khi hứa tính năng "AI nhìn thấy màn hình". Chất lượng câu trả lời phụ thuộc mô hình ngôn ngữ khách hàng chọn và Ontology đã xây.

Khai thácPhân tíchLãnh đạo

## Analytics & BI

Dashboard Superset nhúng ngay trong Workspace, cùng đăng nhập; kết nối Power BI và Tableau qua một cổng.

#### Vấn đề → Giải pháp

- Người dùng phải đăng nhập riêng vào công cụ BI → Superset nhúng trong Workspace, dùng chung SSO.
- Dataset cho BI phải tạo tay → tạo dataset Superset trỏ tới view Dremio từ SQL Studio.
- Quyền dashboard quản lý rời rạc → gán quyền dashboard theo vai trò ngay trong trang Permissions.

#### Tính năng chính

- Mở danh sách dashboard Superset trong Workspace.
- Từ một view: "Open Chart" xem biểu đồ Superset dùng view đó.
- Mở Power BI, Tableau từ dataset; cấu hình Entra tenant cho Power BI.
- BI ngoài kết nối qua JDBC, ODBC, Arrow Flight.
- Menu Analytics chỉ hiện với người có vai trò Superset.

"Dashboard nằm ngay cạnh dữ liệu, cùng một lần đăng nhập. Ai đang dùng Power BI hay Tableau thì vẫn kết nối được."

**Lưu ý nội bộ:** Superset là dịch vụ triển khai riêng và cần cấu hình bảo mật nhận token Keycloak. dbt Studio cũng có dashboard YAML riêng trong dự án; khi tư vấn, nói rõ dashboard nào dành cho ai.

Vận hànhQuản trị viên

## Quản trị nền tảng

Theo dõi tài nguyên, chia tải truy vấn, tăng tốc và cấu hình hệ thống từ cùng giao diện.

#### Engine

- **Monitor**: mức dùng catalog, job, tài nguyên.
- **Node activity**: bật, tắt node tham gia thực thi.
- **Engines**: thêm, sửa, khởi động, dừng engine và worker.
- **Queues & Engine routing**: hàng đợi tải và luật định tuyến truy vấn theo người dùng, nhóm, loại việc.
- **Reflections**: tìm, làm mới, thử lại, bật tắt tăng tốc, lịch sử làm mới.

#### Hệ thống

- **Preferences**: bật tắt AI, dbt, Catalog, gợi ý SQL, thời gian chờ phiên, quyền tải dữ liệu.
- **Integrations**: Power BI, Tableau, nhà cung cấp token ngoài, cấu hình mô hình AI.
- **Support**: tải gói log chẩn đoán.
- **SQL Query Config**: sửa câu SQL đứng sau dashboard Overview và cảnh báo.

"Quản trị viên thấy ngay node nào đang quá tải, truy vấn nào chiếm tài nguyên, và chia hàng đợi để báo cáo lãnh đạo không phải chờ job nặng."

Bảo mậtQuản trị viênAn toàn thông tin

## Định danh & phân quyền

Keycloak là nguồn duy nhất về người dùng và vai trò; User API tạo người dùng đồng thời ở mọi nơi cần thiết.

#### Vấn đề → Giải pháp

Tạo một nhân viên mới phải vào 4–5 hệ thống→Một biểu mẫu tạo user ở Keycloak và Dremio, gán vai trò cho Ontology, Analytics, AI, dbt cùng lúc

Tạo dở dang: có tài khoản hệ thống này mà thiếu hệ thống kia→Lỗi ở Dremio thì tự hủy user vừa tạo ở Keycloak; trạng thái đồng bộ từng user hiển thị rõ

Phân quyền dữ liệu bằng tay từng bảng→Ma trận quyền theo user hoặc role, xem trước thay đổi rồi áp dụng hàng loạt

#### Tính năng chính

- **Users**: tạo, sửa, đặt lại mật khẩu, bật tắt, xóa có xác nhận ở cả hai hệ thống.
- **Roles**: vai trò Dremio, Superset, KaPaS, realm; đồng bộ vai trò Keycloak sang Dremio.
- **Permissions**: cấp quyền theo người, theo vai trò, theo đối tượng (kể cả quyền kế thừa); quyền dashboard Superset.
- **Token cá nhân** cho người dùng gọi API.

#### Nguyên tắc bảo mật

- User API không lưu mật khẩu hay khóa nào; chuyển tiếp token của chính người thao tác, Keycloak và Dremio tự kiểm quyền.
- Mật khẩu nguồn dữ liệu, token Git mã hóa AES-GCM.
- Truy vấn chạy bằng danh tính người dùng, kể cả job theo lịch.
- Mọi thao tác file trong dbt Studio có chặn truy cập ra ngoài thư mục dự án; lệnh Git chỉ cho phép danh sách trắng.

"Nhân sự mới vào, quản trị viên điền một biểu mẫu là người đó có đủ quyền ở mọi phân hệ. Nghỉ việc thì khóa một chỗ."

**Lưu ý nội bộ:** khóa (disable) người dùng thực hiện ở Keycloak; Dremio không có thao tác disable riêng. Quyền vai trò dbt không tự suy ra từ quyền admin Dremio, cần gán riêng.

Theo vai trò

## Ai dùng gì

| Vai trò | Dùng chủ yếu | Giá trị nhận được |
|----|----|----|
| Quản trị nền tảng | Overview, Engine, Users, Roles, Permissions, Preferences | Kiểm soát tài nguyên và quyền ở một nơi |
| Kỹ sư dữ liệu | Connections, SQL Studio, dbt Studio, Data Pipeline | Từ nguồn tới bảng sạch có test, có lịch, không cần cài đặt máy |
| Chuyên viên phân tích | Catalog, SQL Studio, Analytics, SQL Copilot | Tìm đúng dữ liệu, tự phân tích |
| Chủ sở hữu dữ liệu | Catalog (glossary, tag), Ontology Workbench, Governance | Định nghĩa thống nhất, biết dữ liệu được dùng ở đâu |
| Người dùng nghiệp vụ, lãnh đạo | Dashboard, Ontology Explore, AI Agents | Xem chỉ số, hỏi dữ liệu bằng tiếng Việt |
| An toàn thông tin | Keycloak, Permissions, nhật ký job Dremio, audit Ontology | Biết ai truy cập gì, bằng quyền nào |

Demo

## Kịch bản demo gợi ý

15 phút · Lãnh đạo

### Từ nguồn tới câu trả lời

1.  Đăng nhập SSO, giao diện tiếng Việt.
2.  Connections: hai nguồn đã kết nối.
3.  SQL Studio: JOIN hai nguồn.
4.  Hỏi AI một câu về doanh thu; xem bảng và biểu đồ.
5.  Mở dashboard Superset.

30 phút · Đội dữ liệu

### Nhà máy dữ liệu

1.  Tạo dự án dbt từ mẫu Data Vault.
2.  Sửa model, xem SQL biên dịch, preview.
3.  Chạy build, xem log trực tiếp.
4.  Commit Git.
5.  Vẽ Pipeline: SQL nạp → dbt → Branch → on-failure; đặt lịch.
6.  Cho một bước lỗi, xem thử lại và chạy lại phần lỗi.

20 phút · Quản trị, ATTT

### Quản trị và bảo mật

1.  Tạo user mới, gán vai trò dbt-viewer.
2.  Đăng nhập bằng user đó: menu thu hẹp, IDE chỉ đọc.
3.  Catalog: user không thấy bảng ngoài quyền.
4.  Xem job Dremio ghi đúng tên người chạy.
5.  Đổi mức an toàn AI sang STRICT, thử một thao tác ghi.

Triển khai

## Thành phần cần triển khai

Tất cả thành phần chạy dạng container. Quy mô, tính sẵn sàng cao và sao lưu được thiết kế theo từng dự án.

| Thành phần | Phụ thuộc | Ghi chú vận hành |
|----|----|----|
| Dremio | Ổ đĩa dữ liệu, kết nối mạng tới nguồn | Cổng web/REST 9047; JDBC/ODBC/Flight 31010–32010 |
| Hanas Workspace | nginx, cấu hình địa chỉ các dịch vụ khi khởi động | Đổi địa chỉ dịch vụ không cần build lại |
| dbt Studio | Postgres 16, Redis 7, Keycloak, vùng workspace và storage | Chạy nhiều bản song song; lịch chạy có cơ chế chọn leader |
| Hanas Catalog | Postgres 16 | catalog-api nhân bản tự do; ingest-runner nhiều bản an toàn; sao lưu pg_dump hằng ngày |
| User API | Keycloak, Dremio | Không có CSDL |
| Keycloak | CSDL của Keycloak | Một realm chung cho mọi dịch vụ; bản dịch giao diện lưu tại đây |
| Ontology, KaPaS, Superset | Triển khai riêng | Cần cổng API định tuyến tới từng dịch vụ |

Hiện chưa có Helm chart hay manifest Kubernetes đóng gói sẵn. Nếu khách hàng yêu cầu Kubernetes, đưa vào phạm vi dịch vụ triển khai.

Xử lý câu hỏi

## Câu hỏi thường gặp

Có phải chuyển toàn bộ dữ liệu về Hanas không?

Không bắt buộc. Dremio truy vấn tại nguồn. Chỉ lưu thêm khi cần lớp dữ liệu sạch hoặc bản tăng tốc (reflection) cho báo cáo dùng nhiều.

Hanas có dùng chung một tài khoản để truy cập dữ liệu không?

Không. Truy vấn từ SQL Studio, dbt Studio, Catalog và AI đều chạy bằng danh tính người dùng; job theo lịch chạy bằng quyền người tạo. Nhật ký job ghi đúng người.

AI có tự ý sửa hoặc xóa dữ liệu được không?

Ở mức mặc định, thao tác ghi cần người dùng phê duyệt qua thẻ xác nhận. Quản trị viên có thể đặt mức STRICT để mọi thao tác đều cần duyệt. AI cũng chỉ có quyền của người đang hỏi.

Hanas có thay được Airflow không?

Với luồng gồm dbt, SQL trên Dremio và Python, Data Pipeline đáp ứng: lịch cron, rẽ nhánh, thử lại, nhánh lỗi, chạy lại phần lỗi, tự phục hồi. Luồng cần điều phối nhiều hệ thống ngoài cần đánh giá riêng.

Catalog có thay được DataHub không?

Có cho nhu cầu tìm kiếm, lineage mức bảng, glossary, tag và thu thập metadata từ Dremio, Oracle, dbt. Các tính năng Domain, Data Product, chất lượng dữ liệu chưa có.

Giao diện có tiếng Việt không? Có sửa câu chữ được không?

Tiếng Việt mặc định, có tiếng Anh. Quản trị viên sửa câu chữ trực tiếp trong trang Bản dịch, người dùng thấy sau khi tải lại trang.

Khóa tài khoản người nghỉ việc thế nào?

Khóa trên Keycloak (qua trang Users). Vì mọi dịch vụ dùng SSO, người đó mất quyền vào toàn bộ nền tảng. Lịch chạy họ tạo vẫn tồn tại; quản trị viên dbt tạm dừng hoặc xóa.

Giới hạn hiện tại

## Những điều không được hứa với khách hàng

Danh sách này lấy từ mã nguồn tại mốc 3bb7d41a5. Khi khách cần một mục dưới đây, ghi vào phạm vi phát triển hoặc dịch vụ, không giới thiệu như tính năng có sẵn.

| Mục | Thực trạng |
|----|----|
| Lineage mức cột | Chưa có ở dbt Studio và Catalog; chỉ có mức bảng |
| Domain, Data Product, chất lượng dữ liệu trong Catalog | Chưa có |
| Streaming thời gian thực | Không đóng gói sẵn (bản cũ dùng Kafka) |
| Thông báo email, Slack | Chưa có; dbt Schedule chỉ có webhook, Pipeline dùng nhánh on-failure |
| Phát hành bảng Iceberg từ dbt Studio | Chưa hỗ trợ |
| Tách dự án dbt theo nhóm | Chưa có; mọi người có vai trò dbt dùng chung workspace |
| AI hiểu ngữ cảnh màn hình | Giao diện đã gửi; phía KaPaS đang hoàn thiện |
| Giải thích job (Explain job) | Nút có nhưng chưa hoạt động |
| Triển khai Kubernetes đóng gói sẵn | Chưa có Helm chart |
| Kết nối dbt ngoài Dremio, Postgres, DuckDB | Chưa hỗ trợ |

Thuật ngữ

## Thuật ngữ

| Thuật ngữ | Giải thích ngắn |
|----|----|
| Source | Một nguồn dữ liệu đã kết nối vào Dremio (CSDL, kho đối tượng, catalog lakehouse) |
| Space / Workspace | Thư mục logic để tổ chức view theo phòng ban, dự án |
| View | Câu SQL được lưu thành bảng ảo, không chép dữ liệu |
| Reflection | Bản dữ liệu tăng tốc do Dremio quản lý và tự dùng khi truy vấn khớp |
| Job | Một lần chạy truy vấn trên Dremio, có nhật ký và hồ sơ thực thi |
| Engine, Queue | Nhóm máy thực thi và hàng đợi chia tải truy vấn |
| dbt model | Một file SQL định nghĩa một bảng hoặc view đích, có kiểm thử |
| Target | Môi trường đích của dbt, ví dụ dev hoặc prod |
| Pipeline, Step | Luồng điều phối và từng bước trong luồng |
| Lineage | Quan hệ nguồn gốc: bảng này được tạo từ bảng nào |
| Glossary | Từ điển thuật ngữ nghiệp vụ gắn vào dữ liệu |
| Ingestion | Thu thập metadata từ nguồn vào Catalog |
| Ontology | Mô hình đối tượng, quan hệ và chỉ số nghiệp vụ gắn với dữ liệu |
| Data Vault 2.0 | Phương pháp mô hình kho dữ liệu gồm hub, link, satellite |
| SSO | Đăng nhập một lần cho mọi phân hệ |

Hanas Data Platform · Sổ tay dịch vụ cho đội kinh doanh · Mốc mã nguồn 3bb7d41a5, ngày 13/10/2026. Sơ đồ là trang tương tác: phóng to, tìm kiếm, chế độ trình chiếu và xuất ảnh PNG/SVG có trong từng sơ đồ.
