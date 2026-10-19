<!-- Sinh từ samples/kvault_docs/bao-cao-nang-luc-20261007-v2.1.md (mục 1–11), bản gốc:
     projects/sbv/01-input/BAO_CAO_NANG_LUC_HE_THONG_20261007_v2.1.docx; mã nguồn: knowledge-vault 0.8.0, commit 96d3345e (14/10/2026).
     Cập nhật: pandoc <báo cáo mới>.docx -t gfm --wrap=none -o samples/kvault_docs/<tên>.md, rồi chép mục 1–11 vào đây
     và chạy lại việc đối chiếu mã nguồn (samples/kvault_docs/verify-claims.md) để làm mới 3 mục cuối. -->

# Knowledge Platform: sổ tay sản phẩm

Trong proposal gọi sản phẩm là **Knowledge Platform** (tên nội bộ, tên repo là Knowledge Vault; không dùng tên nội bộ với khách). Proposal Knowledge Platform không nhắc tới Hanas, không nhắc Tencent WeKnora (nền mã nguồn chỉ là thông tin nội bộ; với khách nói Knowledge Platform do Katalyst phát triển). Nền là Tencent WeKnora (MIT), Katalyst phát triển thêm lớp pháp lý Việt Nam, trích xuất, đối chiếu tuân thủ và tích hợp định danh.

**Đọc trước khi viết proposal:**
- Báo cáo bên dưới là lời Katalyst tự mô tả. Mức đáp ứng thật lấy theo mục "Mức đáp ứng đã kiểm trên mã nguồn" và bảng "Những điều không được hứa với khách hàng" ở cuối file.
- Số người dùng, số nhiệm vụ, cấu hình máy (mục 1.5, 5.3–5.5) là số của dự án SBV. Khách khác thì tính lại, không chép.
- Kết quả kiểm trên mã nguồn ngày 15/10/2026: 168 tuyên bố gồm 75 Có sẵn, 62 Một phần, 12 Chưa có, 19 Không kiểm được. Trong 8 vấn đề POC, 3 đã kiểm chứng bằng test tự động (1, 4, 6), 5 có mã nhưng chưa kiểm chứng (2, 3, 5, 7, 8).
- Rủi ro lớn nhất: "không có nguồn thì không trả lời" (mục 1.4) **chưa bảo đảm mặc định**. Agent pháp lý không từ chối khi thiếu nguồn; `answer_gate` chỉ chạy khi bật cấu hình (chế độ smart-reasoning, có rerank model). Proposal phải xếp mục này là `Cấu hình` và đưa việc bật, kiểm thử vào WBS.

## 1. Tóm tắt cho lãnh đạo

### 1.1 Bối cảnh và nhu cầu

Công tác kiểm tra, giám sát và xử lý hồ sơ đang chịu năm áp lực cùng lúc:

- **Khối lượng văn bản lớn và phần nhiều là bản scan.** Hồ sơ do đơn vị gửi lên chủ yếu là bản scan có chữ ký, dấu mộc — không tìm kiếm được bằng công cụ thông thường.
- **Một lượt kiểm tra phải đối chiếu một bộ tài liệu, không phải một tài liệu.** Điển hình là khoảng **40 báo cáo, tờ trình, công văn, hợp đồng** của đơn vị đối chiếu với **4–5 thông tư, nghị định, quy định** làm căn cứ.
- **Hiệu lực văn bản là vấn đề sống còn.** Kết luận sai về việc một văn bản còn hay đã hết hiệu lực dẫn tới tuân thủ sai quy định, với hậu quả pháp lý nghiêm trọng.
- **Dữ liệu không được rời tổ chức.** Đưa tài liệu nội bộ lên dịch vụ AI công cộng là rủi ro không thể chấp nhận.
- **Kiểm tra CNTT dựa trên bằng chứng kỹ thuật.** Ngoài văn bản hành chính, căn cứ để kết luận nằm trong cấu hình thiết bị, nhật ký hệ thống, kết quả quét lỗ hổng, danh mục tài sản CNTT và ảnh chụp màn hình — những nguồn mà công cụ tìm kiếm văn bản thông thường không đọc được.

Cách làm hiện nay dựa vào kinh nghiệm và trí nhớ của cán bộ, đối chiếu thủ công và không lưu vết bằng chứng. Hệ quả là tốn thời gian, khó nhất quán giữa các đoàn kiểm tra, và kết quả khó bảo vệ khi có ý kiến khác.

### 1.2 Hệ thống làm được gì — bảng năng lực tổng hợp

| **Nhóm năng lực** | **Hệ thống làm được gì** | **Ý nghĩa với lãnh đạo** |
|:---|:---|:---|
| **Nạp và chuẩn hóa tài liệu** | Đọc PDF (kể cả bản scan), Word, Excel, PowerPoint, ảnh, trang web; OCR tiếng Việt tự vận hành; tách văn bản theo đúng phân cấp Chương → Mục → Điều → Khoản → Điểm | Đưa toàn bộ kho văn bản giấy và bản số về một kho tri thức tra cứu được, không bỏ sót bản scan |
| **Hỏi–đáp có dẫn nguồn** | Trả lời kèm trích dẫn tới đúng Điều, Khoản, Điểm; không có căn cứ thì báo không đủ căn cứ thay vì suy đoán | Cán bộ có câu trả lời kiểm chứng được ngay; giảm phụ thuộc vào trí nhớ và kinh nghiệm cá nhân |
| **Đối chiếu tuân thủ** | Đối chiếu theo ba nhóm: đề cương kiểm tra, bằng chứng đính kèm, văn bản quy phạm; trả kết quả theo từng dòng, kèm đoạn trích nguyên văn của cả nội dung cần tuân thủ và nội dung vi phạm | Rút ngắn thời gian kiểm tra; mọi kết luận đều truy được nguồn nên bảo vệ được trước hội đồng |
| **Suy luận hiệu lực văn bản** | Tính lại hiệu lực tại thời điểm truy vấn; tự động lan truyền quan hệ thay thế, bãi bỏ, sửa đổi giữa các văn bản | Chặn ở tầng hệ thống rủi ro nghiêm trọng nhất: dùng nhầm văn bản đã hết hiệu lực |
| **Trích xuất thuộc tính** | Tự trích số hiệu, ngày ban hành, ngày hiệu lực, cơ quan ban hành, tình trạng hiệu lực, lĩnh vực theo mẫu nghiệp vụ; cán bộ hiệu đính và hiệu đính đó có hiệu lực vĩnh viễn | Giảm nhập liệu thủ công; tri thức của cán bộ được giữ lại trong hệ thống thay vì mất đi khi luân chuyển |
| **Tổng hợp và soạn báo cáo** | Tóm tắt báo cáo dài, nhật ký, biên bản; tổng hợp dữ liệu từ nhiều nguồn; xuất kết quả ra CSV và Word | Giảm thời gian soạn thảo; thống nhất mẫu biểu và cách trình bày giữa các đơn vị |
| Bằng chứng kỹ thuật CNTT | Đọc và đối chiếu cấu hình thiết bị, nhật ký hệ thống, kết quả quét lỗ hổng, danh mục tài sản CNTT, ảnh chụp màn hình; mỗi phát hiện dẫn về đúng dòng cấu hình, dòng nhật ký hoặc ảnh gốc | Kết luận kiểm tra CNTT dựa trên bằng chứng kỹ thuật thật, không chỉ trên báo cáo tự đánh giá của đơn vị |
| **Quản trị và kiểm soát** | Cô lập dữ liệu theo từng nhiệm vụ; phân quyền theo vai trò; luồng Maker–Checker bắt buộc hai người; nhật ký kiểm toán đầy đủ | Đáp ứng yêu cầu kiểm soát nội bộ và kiểm tra an toàn thông tin; truy được trách nhiệm cá nhân |
| **Chủ quyền dữ liệu** | Toàn bộ mô hình AI, OCR, định danh và lưu trữ tự vận hành trong mạng nội bộ; ở cấu hình bàn giao không có dữ liệu nào được gửi ra ngoài | Dữ liệu không rời tổ chức — điều kiện tiên quyết với dữ liệu ngành Ngân hàng |
| **Chi phí sở hữu** | Nền tảng mã nguồn mở; không phí theo người dùng, không phí theo số truy vấn hay số tài liệu | Thêm người dùng thứ 51 hay thứ 500 không phát sinh phí bản quyền |

### 1.3 Mục tiêu dự án

| **Nhóm** | **Mục tiêu cụ thể** |
|:---|:---|
| **Nghiệp vụ** | Hỏi–đáp có dẫn nguồn trên kho văn bản nội bộ; tra cứu hiệu lực và quan hệ văn bản; đối chiếu tuân thủ theo danh mục tiêu chí |
| **Dữ liệu** | Chuẩn hóa tài liệu đa định dạng, kể cả bản scan, thành kho tri thức có cấu trúc, có thuộc tính trích xuất tự động và cho phép cán bộ hiệu đính |
| **Kỹ thuật** | Triển khai 100% trong mạng nội bộ, không phụ thuộc dịch vụ AI công cộng; kiến trúc mô-đun, mở rộng bằng cấu hình |
| **Quy mô** | Đáp ứng **100 nhiệm vụ nghiệp vụ** đang vận hành và **50 người dùng**, với dư địa mở rộng tới hàng trăm nghìn tài liệu |
| **Quản trị** | Cô lập dữ liệu theo nhiệm vụ, phân quyền theo vai trò, nhật ký kiểm toán đầy đủ, mã hóa thông tin bí mật khi lưu trữ |

### 1.4 Giá trị cam kết

- **Trả lời có căn cứ, không bịa.** Mọi câu trả lời kèm trích dẫn tới đúng đoạn nguồn; không có đoạn nguồn thì hệ thống báo không đủ căn cứ.
- **Hiệu lực văn bản được suy luận lại tại thời điểm truy vấn**, không tin vào giá trị lưu sẵn — nên không bị sai khi mốc thời gian đi qua.
- **Con người quyết định sau cùng.** Hiệu đính của cán bộ có hiệu lực vĩnh viễn và được ưu tiên hơn kết quả mô hình.
- **Chủ quyền dữ liệu tuyệt đối.** Mô hình, OCR, định danh và lưu trữ đều tự vận hành trong vành đai mạng của tổ chức.
- **Không khóa nhà cung cấp.** Chín bộ máy tìm kiếm và khoảng hai mươi lăm nhà cung cấp mô hình đứng sau cùng một giao diện; đổi nhà cung cấp là thay cấu hình, không phải viết lại mã.
- **Không phát sinh phí bản quyền theo người dùng** (xem §6).

### 1.5 Khả năng đáp ứng quy mô yêu cầu

| **Chỉ tiêu** | **Yêu cầu của đơn vị** | **Năng lực thiết kế của hệ thống** | **Cơ sở** |
|:---|:---|:---|:---|
| Người dùng đăng ký | 50 tài khoản | Số tài khoản không phải yếu tố chặn năng lực; yếu tố chặn là số phiên hỏi–đáp đồng thời | §5.4 |
| Phiên hỏi–đáp đồng thời giờ cao điểm | 10–15 phiên | Cấu hình khuyến nghị được thiết kế cho 50–100 phiên | §5.4 |
| Nhiệm vụ nghiệp vụ | 100 nhiệm vụ | Không giới hạn số nhiệm vụ lưu trữ; 3–5 phiên đối chiếu chạy song song | §5.5 |
| Tài liệu quản lý | 3.000–5.000 tài liệu | Cấu hình khuyến nghị đáp ứng ở mức thoải mái theo tính toán thiết kế | §5.6 |
| Dung lượng lưu trữ | ~36–60 GB dữ liệu nghiệp vụ | 2 × 1,92 TB NVMe (RAID 1) lưu trữ nóng, cộng ~5 TB lưu trữ dự phòng | §5.6 |
| Thời gian phản hồi hỏi–đáp | Không lỗi time-out khi 5–10 người dùng đồng thời | p95 ≤ 30 giây, ký tự đầu tiên ≤ 5 giây ở 15 phiên đồng thời (mục tiêu nghiệm thu) | §5.4 |

> **Phạm vi cam kết.** Bảng trên mô tả năng lực thiết kế của hệ thống theo cấu hình khuyến nghị. Các chỉ tiêu chất lượng ở §5.8 — lấy theo ngưỡng của Checklist POC — là chỉ tiêu nghiệm thu, đo trên bộ hồ sơ mẫu của đơn vị. Các con số về quy mô và hiệu năng được xác lập chính thức sau khi đo tải trên dữ liệu thật và ghi vào biên bản nghiệm thu (§5.8).

## 2. Bài toán và cách tiếp cận

### 2.1 Thực trạng

Kho văn bản phân tán trên thư mục chia sẻ, email và ứng dụng văn phòng, không có chỉ mục thống nhất; phần lớn văn bản là bản scan nên không tìm kiếm được bằng công cụ thông thường.

Ba công việc sau đây đang phụ thuộc hoàn toàn vào con người: **xác định hiệu lực văn bản** (dựa vào trí nhớ và kinh nghiệm cán bộ), **đối chiếu báo cáo với đề cương và quy định** (làm thủ công, không lưu vết bằng chứng) và **tra cứu** (công cụ hiện có chỉ khớp từ khóa, không hiểu ngữ nghĩa và không trích dẫn được).

### 2.2 Vấn đề cốt lõi và năng lực đáp ứng

| **Vấn đề** | **Năng lực đáp ứng của Knowledge Platform** |
|:---|:---|
| Trích dẫn phải chỉ tới Điều, Khoản, Điểm | Bộ chia đoạn pháp lý cắt theo thang Chương → Mục → Điều → Khoản → Điểm và lưu đường dẫn phân cấp trên từng đoạn; trích dẫn hiển thị đúng đường dẫn đó |
| Hiệu lực thay đổi theo thời gian | Hiệu lực được suy luận lại từ các mốc ngày **tại thời điểm truy vấn**, không đọc từ trạng thái lưu lúc nạp |
| “Văn bản này còn hiệu lực không?” phụ thuộc văn bản khác | Quan hệ văn bản được chiếu thành đồ thị; cạnh thay thế và bãi bỏ đánh dấu văn bản đích hết hiệu lực và gán ngày hết hiệu lực |
| Tìm kiếm có thể trả về văn bản đã bị bãi bỏ | Bộ lọc pháp lý ràng buộc truy vấn theo tình trạng hiệu lực, loại, lĩnh vực, khoảng ngày **trước khi** chạm vào kho vector |
| Tài liệu hỗn hợp: PDF scan, Office, bảng biểu | OCR tự vận hành cùng chuỗi bộ đọc tiêu chuẩn cho PDF, Word, Excel, PowerPoint, Markdown, ảnh, trang web |
| Nhập liệu thủ công nhiều | Trích xuất thuộc tính theo mẫu nghiệp vụ; trường đã được cán bộ xác minh tồn tại vĩnh viễn qua mọi lần nạp lại |
| Đối chiếu tuân thủ tốn công | Kiểm tra từng yêu cầu trên từng tài liệu đích, bằng chứng **trích nguyên văn từ kết quả tìm kiếm**, không do mô hình tự viết |
| Dữ liệu nhạy cảm không được rời tổ chức | Toàn bộ mô hình, OCR, định danh và lưu trữ tự vận hành; không có phụ thuộc bắt buộc vào dịch vụ đám mây |

### 2.3 Ba nhóm đối chiếu trọng tâm

Nghiệp vụ trọng tâm của hệ thống là đối chiếu báo cáo của đơn vị với các văn bản làm căn cứ, phục vụ công tác kiểm tra, giám sát. Ba nhóm được xác định theo mức độ phức tạp tăng dần:

| **Nhóm đối chiếu** | **Nguồn** | **Đối tượng** | **Đặc điểm** |
|:---|:---|:---|:---|
| **Đối chiếu với đề cương kiểm tra** | Đề cương của đoàn kiểm tra: danh mục câu hỏi và tài liệu cung cấp | Báo cáo, tờ trình, công văn của đơn vị | Quan hệ một chiều, tiêu chí đã tường minh. Mức phức tạp thấp nhất |
| **Đối chiếu với bằng chứng đính kèm** | Hồ sơ, bằng chứng, hợp đồng, biên bản do đơn vị cung cấp | Báo cáo của đơn vị | Phải đối chiếu cả sự tồn tại của bằng chứng lẫn tính nhất quán số liệu. Mức trung bình |
| **Đối chiếu với văn bản quy phạm** | Thông tư, nghị định, quy định hiện hành | Báo cáo của đơn vị | Phải hiểu ngữ nghĩa điều khoản, xác định hiệu lực tại thời điểm kiểm tra và phân biệt văn bản căn cứ trực tiếp với văn bản chỉ được viện dẫn một phần nội dung. Mức cao nhất |

Ba đặc điểm quyết định thiết kế:

- **Đơn vị đối chiếu là một bộ tài liệu.** Khoảng 40 tài liệu đối chiếu với 4–5 văn bản nguồn trong một lượt. Mọi năng lực phải được thiết kế cho tập hợp tài liệu.
- **Nguồn và đối tượng đều chứa bản scan.** Chất lượng đọc tài liệu quyết định chất lượng kết luận.
- **Kết quả phải bảo vệ được trước hội đồng.** Mỗi kết luận tuân thủ kèm đoạn trích nguyên văn của nội dung cần tuân thủ, nội dung vi phạm và tài liệu phát sinh vi phạm.

### 2.4 Quy trình nghiệp vụ một nhiệm vụ

Công việc được tổ chức theo **nhiệm vụ** — một đợt kiểm tra, một hồ sơ thẩm định, một đoàn kiểm tra. Quy trình gồm bảy bước, trong đó **bốn bước có điểm xác nhận của con người**:

1.  **Tạo nhiệm vụ** và nhóm thực hiện; mỗi nhiệm vụ là một vùng dữ liệu độc lập.
2.  **Tạo tài khoản và phân vai trò** cho thành viên (admin, checker, maker).
3.  **Đưa tài khoản vào nhiệm vụ** theo phân quyền.
4.  **Nạp tài liệu**: tài liệu nguồn (thông tư, đề cương, quy định) và tài liệu đối tượng (báo cáo, tờ trình, công văn, bằng chứng).
5.  **Kiểm tra và xác nhận kết quả OCR**; tài liệu chỉ đi tiếp sau khi được xác nhận.
6.  **Chạy đối chiếu theo nhóm chức năng**: chọn chức năng → xác định tài liệu nguồn và đối tượng → hệ thống **đề xuất kế hoạch** → **người dùng xác nhận kế hoạch** → thực thi từng tác vụ → **người dùng xác nhận kết quả** → **người dùng điều chỉnh kết quả**.
7.  **Tổng hợp, tóm tắt và đóng nhiệm vụ**; quyết định công bố tri thức.

**Nguyên tắc xuyên suốt: hệ thống đề xuất, con người kết luận.** Với mỗi tiêu chí, hệ thống đưa ra đề xuất kết luận kèm căn cứ trích nguyên văn và mức độ tin cậy để cán bộ tham khảo; kết luận kiểm tra chỉ hình thành khi cán bộ, đoàn kiểm tra đã xem xét, xác minh và xác nhận. Kế hoạch thực thi và kết quả đối chiếu đều phải được người dùng xác nhận, và mọi điều chỉnh đều được lưu vết.

### 2.5 Vai trò và phân quyền

| **Vai trò** | **Phạm vi** | **Quyền chính** |
|:---|:---|:---|
| **Super Admin** | Toàn hệ thống | Khởi tạo bộ vai trò nền (admin, maker, checker); cấu hình hệ thống |
| **Admin** | Nhiệm vụ / không gian làm việc | Phân quyền checker và maker; quyết định tài liệu `Private`; quyết định công bố tri thức khi đóng nhiệm vụ |
| **Checker** | Nhiệm vụ được giao | Phê duyệt tài liệu, xác nhận kết quả OCR, rà soát và xác nhận kết quả đối chiếu |
| **Maker** | Nhiệm vụ được giao | Nạp tài liệu, khai báo và hiệu đính thuộc tính, chạy đối chiếu |
| **Người xem** | Tài liệu và kết quả được công bố | Chỉ đọc |

Mỗi nhiệm vụ có một nhóm thực hiện gồm trưởng nhóm và các thành viên. Tài liệu mang nhãn `Private` của một nhiệm vụ chỉ nhìn thấy được bởi thành viên của nhiệm vụ đó.

**Liên hệ với yêu cầu của Ngân hàng Nhà nước:** mỗi tài khoản gán cho một người dùng duy nhất và mọi thao tác đều được ghi nhật ký kiểm toán; luồng Maker–Checker hiện thực nguyên tắc **không để một cá nhân đồng thời khởi tạo và phê duyệt** (xem §7.1). Các vai trò nghiệp vụ trên được ánh xạ xuống quyền kỹ thuật ở mức kho tri thức (§7.1) — đây là một mô hình phân quyền duy nhất, không phải hai mô hình song song.

## 3. Kiến trúc giải pháp

### 3.1 Nguyên tắc thiết kế

- **Evidence First** — mọi câu trả lời phải quy chiếu về đoạn văn bản nguồn; không có đoạn nguồn thì báo không đủ căn cứ, không suy đoán.
- **Con người quyết định sau cùng** — hiệu đính của cán bộ nghiệp vụ ưu tiên hơn kết quả mô hình, áp dụng thống nhất cho cả luồng hỏi–đáp lẫn luồng đối chiếu.
- **Thất bại đóng** — bộ lọc pháp lý không khớp gì thì trả về tập rỗng, không trả về tập không lọc; giá trị trạng thái lạ trả lỗi thay vì trả lời rỗng.
- **Một bộ máy, nhiều mẫu** — trích xuất thuộc tính dùng chung một bộ máy cho mọi loại tài liệu; mở rộng miền nghiệp vụ bằng mẫu cấu hình, không bằng bộ trích xuất thứ hai.
- **Mọi năng lực tùy chọn đều có cổng bật/tắt** — để một hệ thống chỉ chạy đúng phần nó dùng.
- **Không khóa nhà cung cấp** — kho vector, kho đồ thị, kho tệp và nhà cung cấp mô hình đều nằm sau giao diện trừu tượng.

### 3.2 Kiến trúc tổng thể — bốn dịch vụ

<img src="media/image2.png" style="width:6.63636in;height:4.44363in" />

| **Dịch vụ** | **Công nghệ** | **Trách nhiệm** |
|:---|:---|:---|
| **Dịch vụ ứng dụng** | Go | Lõi hệ thống: phục vụ API, thực thi phân quyền, chạy toàn bộ nghiệp vụ và xử lý nền |
| **Dịch vụ đọc tài liệu** | Python | Chuyển tệp thành văn bản sạch và ảnh trích xuất; sở hữu toàn bộ xử lý theo định dạng và định tuyến OCR. Tách tiến trình có chủ đích: đọc tài liệu là phần dễ sập nhất, một tệp PDF hỏng không được phép làm sập API |
| **Ứng dụng web** | Vue 3, nginx | Giao diện người dùng; nginx cũng làm proxy `/api` |
| **Máy chủ công cụ MCP** | Python | Phơi bày năng lực nền tảng thành công cụ chuẩn để trợ lý AI khác trong mạng nội bộ gọi trực tiếp, theo cùng cơ chế xác thực và phân quyền |

### 3.3 Mô hình hai lớp: dữ liệu và trí tuệ

| **Lớp** | **Nội dung** | **Ý nghĩa vận hành** |
|:---|:---|:---|
| **Lớp dữ liệu chuẩn hóa** | Tài liệu gốc, văn bản chuẩn hóa, đoạn có đường dẫn phân cấp, thuộc tính trích xuất, trạng thái hiệu lực, quan hệ văn bản | Là tài sản của tổ chức, tồn tại độc lập với mô hình AI. Đổi mô hình không làm mất lớp này |
| **Lớp trí tuệ** | Truy hồi lai ghép, xếp hạng lại, sinh câu trả lời, tác tử nhiều bước, đối chiếu tuân thủ | Là phần tiêu thụ lớp dữ liệu; thay thế và nâng cấp được, chịu ràng buộc “chỉ trả lời trên căn cứ đã truy hồi” |

**Hệ quả thực tiễn:** tài liệu gốc luôn được giữ lại. Mất bản gốc là hỏng hóc duy nhất không phục hồi được, nên đó là việc được làm đầu tiên trong quy trình nạp.

### 3.4 Các luồng nghiệp vụ chính

#### 3.4.1 Luồng nạp tài liệu: Upload → OCR → Maker → Checker → Đánh chỉ mục

<img src="media/image3.png" style="width:6.5in;height:4.32361in" />

Tài liệu đi qua bốn trạng thái có kiểm soát. Tài liệu chưa qua bước xác nhận **không tham gia** vào bất kỳ kết quả truy hồi hay đối chiếu nào — bảo đảm một bản OCR sai không thể trở thành căn cứ của một kết luận. Trạng thái của từng tệp — đang OCR, chờ Maker, chờ Checker, đã đánh chỉ mục, hoặc lỗi kèm lý do — hiển thị trên danh sách tài liệu và cập nhật theo thời gian thực, nên người tải lên luôn biết tài liệu đang ở bước nào.

#### 3.4.2 Luồng hỏi–đáp pháp lý có dẫn nguồn

<img src="media/image4.png" style="width:5.8in;height:3.52542in" />

Câu hỏi đi qua bộ lọc pháp lý trước khi chạm vào kho vector; mô hình sinh câu trả lời **chỉ trên các đoạn đã truy hồi**; câu trả lời trả về kèm trích dẫn liên kết sâu tới đúng đoạn nguồn. Không có đoạn nguồn thì hệ thống báo không đủ căn cứ.

#### 3.4.3 Luồng đối chiếu đa nguồn

<img src="media/image5.png" style="width:5.8in;height:3.46856in" />

**Mỗi tài liệu đích được tìm kiếm và chấm riêng**, nên một báo cáo dài không thể chiếm hết ngân sách ứng viên và lấn át các tài liệu còn lại. Bằng chứng được **sao chép nguyên văn** từ kết quả truy hồi.

#### 3.4.4 Luồng suy luận hiệu lực văn bản

<img src="media/image6.png" style="width:5.8in;height:3.46071in" />

Hiệu lực được tính lại tại thời điểm truy vấn. Cạnh thay thế hoặc bãi bỏ tác động lên văn bản đích: đánh dấu văn bản đích hết hiệu lực và lấy ngày hiệu lực của văn bản nguồn làm ngày hết hiệu lực. Nhờ vậy một thông tư đã bị bãi bỏ tự động ngừng được coi là luật hiện hành mà không cần ai sửa tay.

#### 3.4.5 Luồng Maker–Checker phê duyệt

<img src="media/image7.png" style="width:5.8in;height:4.18212in" />

Phiếu xử lý là đơn vị công việc gắn với một tài liệu. Luồng Maker–Checker bảo đảm một người không thể vừa khởi tạo vừa phê duyệt cùng một tài liệu; mọi chuyển trạng thái đều được ghi nhật ký kiểm toán kèm người thực hiện và thời điểm.

## 4. Năng lực hệ thống

### 4.1 Nạp và chuẩn hóa tài liệu

**Hệ thống làm được gì.** Nhận tài liệu ở mọi định dạng đang dùng trong nghiệp vụ — PDF có lớp văn bản, PDF scan, ảnh scan, Word, Excel, PowerPoint, Markdown, HTML, EPUB, văn bản thuần, trang web — và chuyển thành văn bản chuẩn hóa kèm ảnh trích xuất, siêu dữ liệu trang và gợi ý cấu trúc. Toàn bộ quá trình chạy nền: cán bộ tải lên là hệ thống trả về ngay.

**Điểm mạnh cần nhấn mạnh với lãnh đạo:**

- **OCR tiếng Việt và tiếng Anh tự vận hành trong mạng nội bộ**, không gửi tài liệu ra ngoài. Đây là bộ máy chính cho văn bản pháp quy dạng scan — nhóm tài liệu chiếm phần lớn kho hồ sơ — và cho tài liệu song ngữ như báo cáo kiểm thử, hợp đồng với đối tác nước ngoài.
- **Bộ chia đoạn hiểu cấu trúc văn bản pháp quy Việt Nam**, không cắt theo độ dài cố định. Mỗi đoạn mang đường dẫn phân cấp dạng `Chương II › Điều 7 › Khoản 2`, hiển thị lại ở trình xem đoạn, kết quả tìm kiếm và trích dẫn trong câu trả lời.
- **Bộ chia đoạn được thiết kế cho đầu ra OCR, không phải cho văn bản sạch.** Nhận cả trường hợp OCR mất dấu (`Dieu 7`), mất khoảng trắng, viết hoa toàn bộ. Tài liệu không có phân cấp nhận dạng được — công văn, biểu mẫu, phụ lục bảng — rơi xuống chiến lược chia đoạn theo cấu trúc, nên kho tri thức không bao giờ rỗng đoạn.
- **Nhận diện bảng biểu và biểu mẫu.** Bảng trong PDF, ảnh scan và Excel được tách thành ô, hàng, cột có cấu trúc; các cột số tiền, ngày, mức phí giữ đúng kiểu dữ liệu để phục vụ đối chiếu số liệu ở §4.4.
- **Tự động phân loại tài liệu khi nạp:** văn bản quy phạm, báo cáo, tờ trình, biểu mẫu, chứng từ, hợp đồng, biên bản, bằng chứng kỹ thuật. Nhãn phân loại quyết định mẫu trích xuất được áp dụng (§4.7); cán bộ sửa được nhãn khi cần.
- **Làm sạch trước khi đánh chỉ mục.** Header, footer, số trang, dòng lặp lại giữa các trang và ký tự rác của OCR được loại bỏ trước khi chia đoạn, nên không xuất hiện trong kết quả tìm kiếm và câu trả lời.

**Giới hạn tệp và trạng thái xử lý.** Ở cấu hình triển khai, hệ thống nhận tệp tới 100 MB hoặc 300 trang. Tệp scan lớn được tự động chia theo trang, OCR từng phần trên hàng đợi nền rồi ghép lại, nên một tệp nặng không chặn các tệp khác. Tệp vượt giới hạn hoặc hỏng bị từ chối ngay khi tải lên, kèm thông báo lý do, không treo hàng đợi. Giới hạn 10 MB trong POC là cấu hình tạm của môi trường thử nghiệm và đã được điều chỉnh (§12).

### 4.2 Kiểm soát chất lượng đọc tài liệu và lớp hiệu đính

Yêu cầu nghiệp vụ đặt ra hai mức chất lượng, và hệ thống tách hai đường xử lý tương ứng:

| **Nhóm tài liệu** | **Yêu cầu** | **Cách hệ thống đáp ứng** |
|:---|:---|:---|
| Word, Excel, text, PDF có lớp văn bản | Đúng 100% | Bóc tách trực tiếp lớp văn bản, **không đưa qua OCR**; nội dung giữ nguyên văn |
| PDF scan, ảnh scan, tài liệu qua fax | Đúng 95%; nếu không đạt thì báo cho người dùng để sửa thủ công | OCR kèm **ngưỡng độ tin cậy** trên từng trang; trang dưới ngưỡng bị đánh dấu và hiển thị cảnh báo; nội dung **hiệu đính trực tiếp tại chỗ** trước khi xác nhận |

Điểm cần nói rõ để tránh hiểu sai khi nghiệm thu: **OCR bản scan không đạt độ chính xác tuyệt đối**. Vì vậy hệ thống không hứa “OCR đúng 100%” mà bảo đảm ba điều:

1.  Bản scan **không bao giờ được coi là đã đúng** khi chưa có xác nhận của người dùng.
2.  Mọi sai lệch đều **phát hiện được và sửa được** ngay trên giao diện, không cần nạp lại tài liệu — sửa một đoạn chỉ nhúng lại riêng đoạn đó.
3.  Hiệu đính của người dùng **tồn tại vĩnh viễn** qua mọi lần nạp lại và được ưu tiên hơn kết quả mô hình.

Chất lượng đọc tài liệu được đo bằng chỉ số lỗi ký tự và lỗi từ (CER/WER) trên bộ tài liệu mẫu trong giai đoạn nghiệm thu, với ngưỡng tỷ lệ ký tự đúng ≥ 95% cho bản scan tiếng Việt và ≥ 90% cho bản scan tiếng Anh, tính trên từng tệp (§5.8).

**Hệ thống tự chỉ ra vùng cần kiểm chứng.** Ngoài ngưỡng theo trang, kết quả đọc được chấm độ tin cậy tới từng đoạn và từng ô bảng; vùng đọc chắc chắn và vùng cần kiểm chứng lại được phân biệt trực quan trên trình xem, để người rà soát tập trung đúng chỗ thay vì đọc lại toàn bộ tài liệu. Một đoạn chưa được kiểm chứng không được dùng làm căn cứ duy nhất cho đề xuất “Chưa đáp ứng”.

**Số liệu được xử lý chặt hơn chữ.** Với trường số tiền, tỷ lệ, ngày tháng, hệ thống không tự sửa ký tự nghi ngờ thành chữ số — ví dụ “1.OOO.000”, hoặc chữ số bị dấu đỏ che. Giá trị chỉ được ghi nhận khi đọc chắc chắn; trường hợp còn lại được gắn cờ “không chắc chắn” kèm vùng ảnh gốc để cán bộ đọc lại. Số liệu đang gắn cờ không được dùng để kết luận mâu thuẫn số liệu ở §4.4 cho tới khi được xác nhận.

### 4.3 Hỏi–đáp pháp lý có dẫn nguồn

**Hệ thống làm được gì.** Cán bộ đặt câu hỏi bằng tiếng Việt tự nhiên trên kho tri thức được phân quyền; hệ thống trả về câu trả lời kèm trích dẫn liên kết sâu tới đúng đoạn nguồn. Có hai chế độ: trả lời trực tiếp có trích dẫn, hoặc tác tử nhiều bước đi theo chuỗi văn bản khi câu hỏi cần suy luận qua nhiều văn bản.

**Điểm mạnh cần nhấn mạnh với lãnh đạo:**

- **Không trả lời khi không có căn cứ.** Đây là khác biệt căn bản so với trợ lý AI phổ thông, vốn tự tin trả lời cả khi không có cơ sở.
- **Truy hồi lai ghép** kết hợp tìm kiếm ngữ nghĩa (vector) và tìm kiếm từ khóa, có khử dấu tiếng Việt và xếp hạng lại — cần thiết vì thuật ngữ pháp lý vừa đặc thù vừa dễ viết khác nhau giữa các văn bản.
- **Bộ lọc pháp lý chạy trước khi tìm kiếm**, không phải lọc kết quả sau. Nhờ vậy không bao giờ trả về văn bản đã bị bãi bỏ như thể còn hiệu lực.
- **Chỉ trả lời từ kho tài liệu.** Mô hình bị ràng buộc chỉ dùng các đoạn đã truy hồi trong phạm vi được phân quyền; kiến thức nền của mô hình không được dùng làm căn cứ. Câu hỏi về văn bản chưa có trong kho — ví dụ một thông tư chưa được nạp — nhận câu trả lời “không có nguồn trong kho tài liệu”, kèm gợi ý văn bản cần nạp bổ sung.
- **Hiểu ngữ nghĩa, không chỉ khớp từ khóa.** Câu hỏi diễn đạt khác nhưng cùng ý vẫn được khớp đúng điều khoản; chỉ tiêu ≥ 90% trên bộ câu diễn đạt lại (§5.8).
- **Cảnh báo khi kho chưa đủ thông tin.** Khi không tìm thấy văn bản thay thế, sửa đổi hay bãi bỏ một văn bản, câu trả lời ghi rõ “chưa có thông tin về văn bản thay thế trong kho” thay vì ngầm coi văn bản còn hiệu lực; cảnh báo hiển thị nổi bật cạnh trích dẫn.

### 4.4 Đối chiếu báo cáo với đề cương, bằng chứng và văn bản quy phạm

Đây là năng lực trọng tâm, trực tiếp giải quyết ba nhóm đối chiếu ở §2.3.

**Hệ thống làm được gì.** Với mỗi nhóm đối chiếu, hệ thống bóc tách danh mục yêu cầu từ tài liệu nguồn, rồi chấm từng yêu cầu trên từng tài liệu đích và trả kết quả theo từng dòng:

| **Cột kết quả** | **Nội dung** |
|:---|:---|
| Yêu cầu / điều khoản | Tiêu chí cần kiểm tra, lấy từ bộ tiêu chí, đề cương hoặc văn bản quy phạm |
| Đề xuất kết luận | Đáp ứng / Chưa đáp ứng / Chưa đủ căn cứ để kết luận |
| Nội dung cần tuân thủ | Đoạn trích nguyên văn từ văn bản nguồn |
| Nội dung vi phạm | Đoạn trích nguyên văn từ báo cáo của đơn vị |
| Tài liệu vi phạm | Tài liệu cụ thể phát sinh vi phạm |
| Mức độ tin cậy | Mức tin cậy của đề xuất, kèm lý do khi mức tin cậy thấp: bằng chứng mâu thuẫn, bản scan chưa kiểm chứng, thiếu tài liệu |
| Kết luận của cán bộ | Xác nhận hoặc điều chỉnh đề xuất, kèm ý kiến, người thực hiện và thời điểm — đây là kết luận chính thức của nhiệm vụ |

**Ba quy tắc làm cho kết quả bảo vệ được trước hội đồng:**

1.  **Mỗi tài liệu đích được tìm kiếm và chấm riêng.** Một báo cáo dài không thể chiếm hết ngân sách và lấn át các tài liệu còn lại.
2.  **Bằng chứng được sao chép nguyên văn từ kết quả truy hồi, không do mô hình tự viết.** Một đoạn trích trong báo cáo là một đoạn trích từ nguồn.
3.  **Thiếu căn cứ khác với vi phạm, lỗi xử lý khác với thiếu căn cứ.** Khi hồ sơ, bằng chứng không đủ để khẳng định, hệ thống đề xuất “Chưa đủ căn cứ để kết luận” chứ không suy ra “Chưa đáp ứng”; khi một cặp tiêu chí – tài liệu gặp lỗi xử lý, dòng đó được đánh dấu cần chạy lại chứ không bao giờ được báo là “không có trong tài liệu”. Đánh đồng các trường hợp này là cách một cuộc kiểm tra tạo ra kết luận sai.

**Kiểm soát chi phí và thời gian:** bước bóc tách danh mục yêu cầu là xác định, **không gọi mô hình và không giới hạn số dòng**, nên danh mục được rà soát và sửa miễn phí trước khi chi phí mô hình được dùng để chấm. Với nhóm đối chiếu văn bản quy phạm, truy hồi khớp theo **tiêu đề Điều** thay vì nội dung Điều — đo nội bộ cho 101/114 trường hợp đúng so với 86/114 khi khớp theo nội dung, ở mức chi phí thấp hơn 17%.

**Kiểm tra nhất quán số liệu và logic thời gian.** Ngoài đối chiếu ngữ nghĩa, hệ thống trích số liệu (số tiền, tỷ lệ, số lượng) và mốc ngày từ báo cáo, phụ lục, tờ trình, biên bản thành bảng có cấu trúc, rồi so khớp bằng quy tắc xác định thay vì để mô hình tự so. Số liệu cùng chỉ tiêu lệch nhau giữa hai tài liệu, tổng không khớp chi tiết, trình tự ngày bất hợp lý (biên bản thẩm định trước tờ trình, ngày họp sau ngày trình) đều được gắn cờ kèm hai đoạn trích đặt cạnh nhau.

**Đối chiếu với nhật ký và biên bản phỏng vấn.** Nội dung mô tả trong báo cáo được đối chiếu với nhật ký hệ thống (§4.5) và với biên bản, bản ghi nội dung phỏng vấn dạng văn bản do đoàn kiểm tra nạp vào; điểm không khớp được đưa lên thành đề xuất phát hiện.

**Hạn chế cảnh báo sai.** Hồ sơ tuân thủ đầy đủ không được đánh sai: đề xuất “Chưa đáp ứng” chỉ được đưa ra khi có đoạn trích vi phạm cụ thể; khi chỉ có dấu hiệu, hệ thống đề xuất “Chưa đủ căn cứ để kết luận”. Chỉ tiêu: phát hiện ≥ 95% sai phạm và cảnh báo sai \< 5% trên bộ hồ sơ tuân thủ (§5.8).

**Gợi ý bảng đánh giá theo mẫu.** Kết quả đối chiếu được điền vào mẫu bảng đánh giá hồ sơ của đơn vị, mỗi ô kèm căn cứ trích dẫn, để cán bộ rà soát và hoàn thiện thay vì soạn từ đầu.

**Bộ tiêu chí kiểm tra có cấu trúc.** Danh mục yêu cầu bóc tách ở trên không dùng một lần rồi bỏ: sau khi được rà soát, danh mục được lưu thành bộ tiêu chí có cấu trúc, có phiên bản, dùng lại cho các nhiệm vụ sau và được cập nhật khi văn bản làm căn cứ thay đổi hiệu lực. Mỗi tiêu chí được đối chiếu đồng thời với ba nguồn — hồ sơ của đơn vị, bằng chứng (kể cả bằng chứng kỹ thuật ở §4.5) và quy định làm căn cứ:

| **Thuộc tính tiêu chí** | **Nội dung** |
|:---|:---|
| Mã và nhóm tiêu chí | Ví dụ: quản trị an toàn thông tin, kiểm soát truy cập, quản lý tài sản, quản lý lỗ hổng, nhật ký và giám sát, sao lưu và phục hồi |
| Căn cứ quy định | Điều, Khoản của văn bản làm căn cứ, liên kết tới văn bản đang còn hiệu lực |
| Bằng chứng yêu cầu | Loại hồ sơ, bằng chứng kỹ thuật cần có để kết luận tiêu chí |
| Phương pháp kiểm tra | Đối chiếu hồ sơ, kiểm tra cấu hình, phân tích nhật ký, đối chiếu kết quả quét, đối chiếu danh mục tài sản |
| Điều kiện đáp ứng | Quy tắc để đề xuất Đáp ứng / Chưa đáp ứng / Chưa đủ căn cứ để kết luận |

**Hồ sơ đối chiếu được lưu cùng nhiệm vụ.** Kết quả mỗi lượt đối chiếu — đề xuất của hệ thống, kết luận của cán bộ và toàn bộ trích dẫn — được lưu thành hồ sơ có phiên bản của nhiệm vụ. Từ hồ sơ này truy ngược được về đúng trang, đúng đoạn của tài liệu và bằng chứng gốc, nên kết luận vẫn bảo vệ được khi được xem lại sau nhiều năm.

### 4.5 Xử lý và đối chiếu bằng chứng kỹ thuật CNTT

Kiểm tra CNTT không dừng ở văn bản hành chính: phần lớn căn cứ để kết luận nằm trong bằng chứng kỹ thuật do đơn vị cung cấp hoặc đoàn kiểm tra thu thập. Hệ thống coi nhóm bằng chứng này là nguồn hạng nhất — được đọc, chuẩn hóa, trích dẫn và đối chiếu theo cùng nguyên tắc Evidence First như văn bản.

| **Loại bằng chứng** | **Hệ thống xử lý** | **Ví dụ nội dung đối chiếu** |
|:---|:---|:---|
| Cấu hình thiết bị (router, switch, tường lửa, máy chủ, cơ sở dữ liệu) | Đọc tệp cấu hình dạng văn bản, tách theo khối cấu hình; mỗi đoạn trích mang tên thiết bị, tên tệp và số dòng | Chính sách mật khẩu, thời gian khóa phiên, giao thức quản trị, quy tắc tường lửa so với quy định an toàn thông tin |
| Nhật ký hệ thống (syslog, nhật ký sự kiện, nhật ký ứng dụng, nhật ký truy cập) | Chuẩn hóa thành bản ghi có thời gian, nguồn, sự kiện; lọc theo khoảng thời gian và loại sự kiện trước khi đưa vào mô hình | Nhật ký có được bật và lưu đủ thời hạn; đăng nhập thất bại lặp lại; thao tác quản trị ngoài giờ |
| Kết quả quét lỗ hổng, kiểm thử xâm nhập | Đọc báo cáo quét (PDF, CSV, XML của công cụ quét) thành danh sách lỗ hổng có mức độ, tài sản ảnh hưởng, trạng thái | Lỗ hổng mức cao, nghiêm trọng đã được khắc phục đúng hạn chưa; đối chiếu với biên bản khắc phục của đơn vị |
| Danh mục tài sản CNTT | Đọc bảng Excel, CSV thành danh mục có cấu trúc: tên, loại, vị trí, phiên bản, đơn vị quản lý, cấp độ hệ thống | Tài sản có trong nhật ký, kết quả quét nhưng không có trong danh mục; phần mềm hết hỗ trợ |
| Ảnh chụp màn hình giao diện quản trị | Mô hình thị giác – ngôn ngữ tự vận hành đọc nội dung và ngữ cảnh của ảnh, không chỉ nhận dạng ký tự; trích dẫn trỏ về đúng ảnh gốc | Màn hình cấu hình sao lưu, chính sách tài khoản, trạng thái phần mềm phòng chống mã độc |
| Hồ sơ kỹ thuật khác (sơ đồ mạng, quy trình vận hành, biên bản diễn tập) | Đọc như tài liệu văn bản, trích thuộc tính theo mẫu nghiệp vụ | Sơ đồ mạng khớp danh mục tài sản; diễn tập phục hồi đúng chu kỳ |

**Điểm mạnh cần nhấn mạnh với lãnh đạo:**

- **Đối chiếu chéo giữa các nguồn.** Điểm vênh giữa báo cáo của đơn vị và bằng chứng kỹ thuật — ví dụ báo cáo nêu đã tắt giao thức quản trị không mã hóa nhưng tệp cấu hình vẫn bật — được đưa lên thành đề xuất phát hiện, kèm hai đoạn trích đặt cạnh nhau để cán bộ xác minh.
- **Giữ nguyên tính toàn vẹn của bằng chứng.** Tệp gốc được lưu nguyên trạng kèm mã băm tại thời điểm nạp, nên bằng chứng dùng cho kết luận chứng minh được là chưa bị thay đổi.
- **Dữ liệu kỹ thuật nhạy cảm được bảo vệ như tài liệu mật.** Địa chỉ mạng, tên tài khoản, cấu hình bảo mật chỉ nằm trong vùng dữ liệu của nhiệm vụ và chịu cùng chế độ phân quyền, mã hóa ở §7.1.

**Hình thức đáp ứng.** Bằng chứng dạng văn bản, bảng tính và ảnh được xử lý bằng bộ đọc sẵn có. Danh mục định dạng cấu hình thiết bị và định dạng báo cáo của công cụ quét được chốt cùng đơn vị trong giai đoạn khảo sát, theo danh mục thiết bị và công cụ đơn vị đang sử dụng; bộ đọc chuyên biệt cho các định dạng này được bàn giao cùng hệ thống theo cơ chế mở rộng ở §10.2 và là một phần của hồ sơ nghiệm thu. Chỉ tiêu: trích dẫn đúng vị trí (thiết bị, tệp, dòng hoặc ảnh) ≥ 95%.

### 4.6 Suy luận hiệu lực và quan hệ văn bản

**Hệ thống làm được gì.** Từ các mốc ngày trên văn bản, hệ thống suy ra tình trạng hiệu lực — còn hiệu lực, hết hiệu lực, chưa có hiệu lực, hoặc không xác định khi thiếu thông tin — và tính lại ở thời điểm truy vấn. Song song, hệ thống trích xuất và chiếu lên đồ thị năm loại quan hệ giữa các văn bản; ba loại có chiều được lưu tách hai chiều:

| **Quan hệ** | **Ý nghĩa** |
|:---|:---|
| `THAY_THE / BI_THAY_THE` | Văn bản này thay thế văn bản khác / văn bản này bị văn bản khác thay thế |
| `BAI_BO / BI_BAI_BO` | Văn bản này bãi bỏ văn bản khác / văn bản này bị văn bản khác bãi bỏ |
| `SUA_DOI / BI_SUA_DOI` | Văn bản này sửa đổi văn bản khác / văn bản này bị văn bản khác sửa đổi |
| `CAN_CU` | Căn cứ |
| `HUONG_DAN` | Hướng dẫn thi hành |

**Vì sao cách làm này quan trọng với lãnh đạo.** Cạnh thay thế hoặc bãi bỏ tác động lên văn bản đích: đánh dấu văn bản đích hết hiệu lực và lấy ngày hiệu lực của văn bản nguồn làm ngày hết hiệu lực. Nghĩa là **một thông tư đã bị bãi bỏ tự động ngừng được coi là luật hiện hành mà không cần ai sửa tay** — đây là biện pháp chặn rủi ro pháp lý nghiêm trọng nhất, và là thứ mà kiểm tra thủ công khó bảo đảm.

Hệ thống cũng loại bỏ các mốc ngày mà mô hình tự nghĩ ra thay vì đọc được từ văn bản: **một ngày hiệu lực bịa còn tệ hơn một ngày bị thiếu**, vì nó âm thầm làm sai tình trạng pháp lý của văn bản.

**Quan hệ được lưu tách hai chiều và kiểm tra theo thời gian.** Thuộc tính văn bản tách riêng “văn bản này thay thế” và “văn bản này bị thay thế bởi” (tương tự với bãi bỏ, sửa đổi), nên không thể đọc ngược chiều quan hệ. Mỗi quan hệ thay thế, bãi bỏ được kiểm tra ràng buộc thời gian: văn bản ban hành trước không thể thay thế văn bản ban hành sau; quan hệ vi phạm ràng buộc bị chặn và chuyển cho Checker xác minh. Đây là biện pháp khắc phục trực tiếp lỗi ghi nhận ở POC ngày 16/04/2026 (§12).

**Rà soát hiệu lực hằng ngày.** Ngoài việc tính lại tại thời điểm truy vấn, một tác vụ chạy hằng ngày rà soát các mốc ngày hiệu lực để cập nhật trạng thái và cảnh báo văn bản sắp có hoặc sắp hết hiệu lực.

**Làm nổi bật trường quan trọng cho Checker.** Khi duyệt phiếu nạp tài liệu, các trường có ảnh hưởng pháp lý — thay thế, bị thay thế, tình trạng hiệu lực, ngày hiệu lực — được làm nổi bật kèm đoạn nguồn trích được, để Checker xác minh trước khi tài liệu vào kho.

**Độ trễ cập nhật.** Văn bản mới sau khi được xác nhận được đánh chỉ mục và chiếu quan hệ trong vòng 1 giờ; từ thời điểm đó mọi câu trả lời dùng văn bản mới và trạng thái mới của các văn bản bị tác động.

**Mức độ quan trọng của văn bản được viện dẫn.** Không phải mọi văn bản trong phần “Căn cứ…” đều có vai trò như nhau: có văn bản là căn cứ trực tiếp của toàn bộ quy định, có văn bản chỉ được viện dẫn để mượn một định nghĩa. Với quan hệ Căn cứ và Hướng dẫn, hệ thống xác định cụ thể Điều, Khoản được sử dụng và phân mức liên quan — căn cứ trực tiếp, viện dẫn một phần, tham khảo — để cán bộ biết văn bản nào cần đọc kỹ và đi thẳng tới đúng nội dung được viện dẫn thay vì dò toàn văn.

**Vòng đời văn bản hết hiệu lực.** Văn bản đã bị thay thế hoặc bãi bỏ không bị xóa dấu vết. Sau một khoảng thời gian cấu hình được, chỉ mục vector và dữ liệu dẫn xuất của văn bản được giải phóng khỏi máy chủ AI để thu hồi tài nguyên; bản gốc cùng hồ sơ tra cứu — số hiệu, trích yếu, ngày hết hiệu lực, văn bản thay thế — được chuyển sang lưu trữ dài hạn. Người dùng vẫn tra cứu được các văn bản này với nhãn “Đã hết hiệu lực” để tránh áp dụng lại, và mọi kết luận kiểm tra trước đây từng dẫn chiếu văn bản đó vẫn truy vết được về đúng bản gốc.

### 4.7 Trích xuất thuộc tính theo mẫu nghiệp vụ

**Hệ thống làm được gì.** Với mỗi tài liệu, hệ thống tự trích các trường theo mẫu nghiệp vụ đã chọn: số hiệu văn bản, trích yếu, loại văn bản, các mốc ngày ban hành và hiệu lực, cơ quan ban hành, người ký, tình trạng hiệu lực, lĩnh vực điều chỉnh — cùng **mảng tham chiếu chéo** tới các văn bản mà văn bản này thay thế, bãi bỏ, sửa đổi, căn cứ hoặc hướng dẫn.

**Điểm mạnh cần nhấn mạnh với lãnh đạo:**

- **Cán bộ hiệu đính trực tiếp trên bảng tài liệu, và hiệu đính đó có hiệu lực vĩnh viễn** — bộ trích xuất không bao giờ ghi đè trường đã được xác minh. Tri thức của cán bộ được giữ lại trong hệ thống thay vì mất đi khi luân chuyển.
- **Trường đã xác minh được ưu tiên hơn nội dung đoạn khi truy hồi**, áp dụng thống nhất cho cả luồng hỏi–đáp lẫn luồng đối chiếu nên hai luồng không thể lệch nhau.
- **Sửa một ngày sai sẽ sửa luôn chuỗi thay thế, bãi bỏ phụ thuộc vào ngày đó** — hệ thống tự chiếu lại đồ thị.
- **Thêm một loại tài liệu mới là thêm một mẫu cấu hình, không cần viết mã.**
- **Mẫu trích xuất cho hồ sơ nghiệp vụ**, không chỉ văn bản quy phạm: hồ sơ tín dụng, hợp đồng, chứng từ — với các trường như khách hàng, số hợp đồng, số tiền, ngày, loại sản phẩm. Trường bắt buộc không trích được thì được báo thiếu, không để trống im lặng; chỉ tiêu ≥ 90% mỗi trường (§5.8).

### 4.8 Tổng hợp, tóm tắt và soạn báo cáo

| **Năng lực** | **Nội dung** |
|:---|:---|
| **Tóm tắt tài liệu dài** | Tóm tắt báo cáo dài, nhật ký, biên bản theo mô hình map–reduce, giữ đúng ý chính và rủi ro chính, giữ trích dẫn về nguồn |
| **Tổng hợp đa nguồn** | Gộp thông tin từ nhiều tài liệu và nhiều nhiệm vụ được phép truy cập thành một bản tổng hợp có cấu trúc |
| **Sinh báo cáo theo mẫu** | Sinh dự thảo báo cáo tổng hợp đủ bốn phần — mô tả, căn cứ pháp lý, kết luận, kiến nghị — điền vào tệp Word mẫu có placeholder; thể thức (phông chữ, cỡ chữ, giãn dòng, lề, header/footer) theo Nghị định 30/2020/NĐ-CP về công tác văn thư và quy chuẩn của đơn vị; rà soát chính tả, ngữ pháp trước khi xuất bản |
| **Xuất kết quả đối chiếu** | Kết quả đối chiếu xuất ra CSV, Excel và Word để lưu trữ và đưa vào hồ sơ kiểm tra |
| **Gợi ý bảng đánh giá hồ sơ** | Điền mẫu bảng đánh giá của đơn vị từ kết quả đối chiếu, mỗi ô kèm căn cứ (§4.4) |
| **Đo chất lượng định kỳ** | Chạy lại một bộ câu hỏi cố định và chấm điểm truy hồi lẫn câu trả lời, để một thay đổi cấu hình được so với đường cơ sở thay vì đánh giá bằng cảm tính |

### 4.9 Tìm kiếm, wiki và chia sẻ tri thức

- **Tìm kiếm ngữ nghĩa và bảng lệnh nhanh** tra cứu xuyên kho tri thức, hiển thị đường dẫn phân cấp trên từng kết quả, kèm bộ lọc pháp lý theo từng truy vấn.
- **Hai loại đồ thị trực quan**: đồ thị quan hệ văn bản (thay thế, bãi bỏ, sửa đổi) và đồ thị thực thể trích từ nội dung tài liệu — phục vụ hai loại câu hỏi khác nhau.
- **Wiki tri thức** cho phép biên tập trang, tổ chức thư mục, theo dõi lịch sử phiên bản và quản lý vấn đề; quyền sửa hẹp hơn quyền tài liệu.
- **Chia sẻ có kiểm soát**: mỗi lượt chia sẻ là một bản ghi thu hồi được và kiểm toán được; liên kết tệp ký ngắn hạn theo danh sách đích được phép, không có URL công khai trực tiếp.
- **Công bố tri thức khi đóng nhiệm vụ**: quản trị viên chọn từng nội dung `Private` được phép chuyển thành `Public` để làm tài liệu tham khảo cho các nhiệm vụ sau — hành động tường minh, có ghi nhật ký.

### 4.10 Tích hợp và mở rộng

| **Hạng mục** | **Năng lực** |
|:---|:---|
| **API** | REST API giao diện lập trình đầy đủ cho mọi chức năng trên giao diện |
| **Máy chủ công cụ MCP** | Phơi bày năng lực nền tảng theo chuẩn Model Context Protocol để trợ lý AI khác trong mạng nội bộ gọi trực tiếp, theo cùng cơ chế xác thực và phân quyền |
| **SDK và CLI** | SDK Go và công cụ dòng lệnh quản lý kho tri thức, tài liệu, đoạn, tìm kiếm, hỏi–đáp |
| **Mở rộng không cần đổi kiến trúc** | Thêm nhà cung cấp mô hình, bộ máy tìm kiếm, kho tệp, định dạng tài liệu, chiến lược chia đoạn, mẫu trích xuất, kênh chat, nguồn dữ liệu hay công cụ tác tử đều là **cấu hình hoặc một mô-đun nhỏ** |

### 4.11 Bảng tổng hợp năng lực theo nhóm người dùng

| **Nhóm người dùng** | **Năng lực sử dụng chính** | **Lợi ích trực tiếp** |
|:---|:---|:---|
| **Cán bộ nghiệp vụ** | Nạp tài liệu, rà soát và hiệu đính thuộc tính, hỏi–đáp có trích dẫn, chạy đối chiếu, xuất kết quả | Giảm thời gian tìm và đọc tài liệu; câu trả lời kiểm chứng được ngay |
| **Trưởng nhóm / người phê duyệt** | Phê duyệt tài liệu, xác nhận kết quả OCR, rà soát kết quả đối chiếu, xem báo cáo độ tin cậy | Kiểm soát được chất lượng dữ liệu đầu vào và kết luận đầu ra |
| **Quản trị nghiệp vụ** | Cấu hình kho tri thức, mẫu trích xuất, mẫu prompt, quản lý thành viên và chia sẻ, công bố tri thức | Tự chủ cấu hình nghiệp vụ mà không cần đội kỹ thuật |
| **Lãnh đạo** | Bảng điều khiển tiến độ và kết quả kiểm tra, báo cáo tổng hợp, đối chiếu tuân thủ theo đơn vị | Nắm được bức tranh tuân thủ và tiến độ mà không phải chờ báo cáo thủ công |
| **Quản trị hệ thống** | Giám sát, hàng đợi, sao lưu và phục hồi, xử lý sự cố, nâng cấp, xem nhật ký kiểm toán | Vận hành được hệ thống bằng năng lực nội bộ sau bàn giao |

### 4.12 Quản trị mô hình AI, prompt và phản hồi người dùng

| **Hạng mục** | **Năng lực** |
|:---|:---|
| **Quản lý nhiều mô hình** | Chạy đồng thời ≥ 2 mô hình ngôn ngữ (ví dụ hai kích cỡ khác nhau); chọn mô hình cho từng chức năng bằng cấu hình, không sửa giao diện; thời gian gián đoạn khi chuyển ≤ 15 phút |
| **Mô hình nén** | Hỗ trợ mô hình lượng tử hóa (4-bit, 8-bit) để giảm bộ nhớ GPU; mỗi bản nén bàn giao kèm tài liệu cấu hình và số đo so sánh chất lượng, tốc độ với bản gốc trên bộ đo của đơn vị |
| **Cập nhật mô hình mới** | Quy trình bằng văn bản: nhận gói mô hình ngoại tuyến → chạy bộ đo chất lượng (§5.8) và bộ kiểm thử an toàn AI (§7.3) → so với đường cơ sở → chỉ đưa vào dùng khi không giảm chất lượng; không thay đổi kiến trúc |
| **Thư viện prompt nghiệp vụ** | Bộ prompt chuẩn hóa cho tối thiểu sáu nghiệp vụ: hỏi–đáp pháp lý, trích xuất thuộc tính, đối chiếu đề cương, đối chiếu văn bản quy phạm, tóm tắt, sinh báo cáo; có quản lý phiên bản, mỗi đề xuất lưu kèm phiên bản prompt đã tạo ra nó |
| **Màn hình quản trị mô hình** | Hiển thị mô hình đang dùng cho từng chức năng, điểm cuối gọi mô hình (đều nằm trong mạng nội bộ), tham số sinh, danh sách agent và công cụ, phiên làm việc, mức sử dụng GPU, hàng đợi; chỉ Super Admin truy cập |
| **Đặc tả agent** | Mỗi agent, kể cả legal_qa_agent, có đặc tả bàn giao: mục đích, kỹ năng và công cụ được phép, quy trình xử lý, cách truy cập dữ liệu và thuộc tính văn bản, phạm vi quyền; do Super Admin quản trị |
| **Phản hồi người dùng** | Nút Thích / Không thích và chức năng sửa câu trả lời trên mọi câu trả lời; 100% phản hồi được lưu kèm câu hỏi, câu trả lời, nguồn và phiên bản cấu hình; xem và lọc trên bảng điều khiển chất lượng; phản hồi được đưa vào bộ đo định kỳ (§4.8) |

## 5. Hạ tầng và năng lực đáp ứng quy mô

### 5.1 Mô hình triển khai

Toàn bộ hệ thống chạy **trong vành đai mạng của tổ chức**. Không có phụ thuộc bắt buộc vào dịch vụ đám mây: mô hình ngôn ngữ, mô hình nhúng, xếp hạng lại, OCR, định danh, lưu trữ và chỉ mục tìm kiếm đều tự vận hành.

| **Phương án** | **Hình thái** | **Phù hợp với** |
|:---|:---|:---|
| **Tiêu chuẩn** (khuyến nghị) | Bốn dịch vụ cộng hạ tầng, đóng gói container; thành phần tùy chọn bật theo profile | Triển khai chính thức và môi trường staging |
| **Kubernetes** | Biểu đồ đóng gói triển khai cùng cấu trúc | Tổ chức đã có năng lực vận hành Kubernetes |
| **Lite** | Một tệp nhị phân duy nhất, cơ sở dữ liệu nhúng, lưu trữ cục bộ | Đánh giá thử, trình diễn ngoại tuyến |

Hạ tầng tùy chọn bật theo profile, nên một bản triển khai chỉ chạy đúng phần nó dùng — tổ chức dùng PostgreSQL làm kho vector và mô hình bên ngoài sẽ không chạy container Milvus và container phục vụ mô hình.

### 5.2 Thành phần hạ tầng và phương án thay thế

| **Nhóm thành phần** | **Vai trò** | **Mặc định** | **Phương án thay thế** |
|:---|:---|:---|:---|
| **CSDL và kho dữ liệu** | Hồ sơ gốc, quan hệ văn bản, vector nhúng và chỉ mục từ khóa | PostgreSQL, Apache AGE, Milvus | MySQL, SQLite, Qdrant, Weaviate, Elasticsearch, OpenSearch, PostgreSQL vector, Neo4j |
| **Cache và hàng đợi** | Hàng đợi nền, khóa phân tán, giới hạn tần suất | Redis | Valkey (BSD-3) |
| **Lưu trữ tệp** | Bản gốc tải lên, ảnh trích xuất, tệp xuất | MinIO | Dịch vụ tương thích S3 sẵn có, đĩa cục bộ |
| **Định danh và phục vụ mô hình** | Xác thực, ánh xạ vai trò, mô hình ngôn ngữ, nhúng, xếp hạng lại | Keycloak, vLLM sau cổng LiteLLM | Bất kỳ nhà cung cấp OIDC nào, Ollama, điểm cuối tương thích OpenAI |
| **OCR và quan trắc** | Đọc tài liệu scan, ghi vết mọi lời gọi AI và mọi giai đoạn xử lý | MinerU, Langfuse | OpenDataLoader, PaddleOCR-VL, Docling |

Mọi thành phần đều nằm sau một giao diện trừu tượng, nên việc thay thế là cấu hình chứ không phải viết lại mã — đây là cơ sở cho cam kết không khóa nhà cung cấp ở §1.4.

### 5.3 Cấu hình phần cứng đề xuất

Cấu hình dưới đây là đề xuất cụ thể cho quy mô **100 nhiệm vụ và 50 người dùng**, gồm **01 máy chủ ứng dụng** và **02 máy chủ AI**.

#### 5.3.1 Máy chủ ứng dụng — 01 máy

| **Hạng mục** | **Thông số** |
|:---|:---|
| **Model** | Lenovo ThinkSystem SR630 V4, khung 1U 10× 2.5”, bảo hành 3 năm |
| **Vi xử lý** | Intel Xeon 6714P, 165W, 4,0 GHz — **cấu hình tối thiểu 16 nhân** |
| **Bộ nhớ** | **128 GB TruDDR5 6400 MHz RDIMM (8 × 16 GB, chạy đủ 8 kênh bộ nhớ)** |
| **Lưu trữ** | 02 × 1,92 TB NVMe PCIe Gen5 (dữ liệu, RAID 1) + 02 × 960 GB NVMe PCIe Gen5 (hệ điều hành, RAID 1) |
| **RAID** | Intel VROC (VMD NVMe RAID) Premium |
| **Mạng** | Broadcom 57414 10/25 GbE SFP28 2 cổng (OCP) + 02 × transceiver 10G/25G SR |
| **Nguồn** | **02 × 800W Platinum CRPS hot-swap** — dự phòng N+1 |
| **Bảo mật** | TPM 2.0 · khóa IPMI-over-LAN · mặt nạ bảo vệ 1U |
| **Môi trường** | Trung tâm dữ liệu 25 °C |

**Vai trò:** vận hành toàn bộ ứng dụng và dịch vụ nền tảng — dịch vụ ứng dụng, cơ sở dữ liệu quan hệ và đồ thị, chỉ mục tìm kiếm, kho tệp, hàng đợi, định danh, giao diện web và proxy. Ổ dữ liệu và ổ hệ điều hành đều chạy RAID 1 để một ổ hỏng không làm mất dữ liệu hay dừng hệ thống.

#### 5.3.2 Máy chủ AI — 02 máy

| **Hạng mục** | **Thông số** |
|:---|:---|
| **Model** | Lenovo ThinkStation PGX |
| **Kiến trúc** | NVIDIA Grace Blackwell (GB10) |
| **Vi xử lý** | NVIDIA Grace 20 nhân Arm — 10 × Cortex-X925 + 10 × Cortex-A725 |
| **GPU** | NVIDIA Blackwell — Tensor Core thế hệ 5, RT Core thế hệ 4, NVENC/NVDEC chuyên dụng |
| **Hiệu năng AI** | 1.000 TOPS · 1 PFLOP FP4 (sparsity) |
| **Bộ nhớ hợp nhất** | 128 GB LPDDR5x, bus 256-bit, băng thông 273 GB/s |
| **Lưu trữ** | NVMe M.2 4 TB, mã hóa tự động (SED) |
| **Mở rộng** | Ghép 02 nút qua NVIDIA ConnectX-7, chạy được mô hình tới 405 tỷ tham số |
| **Mạng** | 01 × RJ-45 10 GbE; 02 × QSFP cho ConnectX-7 |
| **Tiêu thụ điện** | 240W, nguồn USB-C kèm theo |
| **Hệ điều hành** | NVIDIA DGX OS — Ubuntu Linux Pro + NVIDIA Base OS |
| **Bảo mật** | SED NVMe AES · TPM 2.0 · NVLink-C2C enclave · UEFI Secure Boot |
| **Kích thước** | 1,13 lít — 150 × 150 × 50,5 mm, từ 1,2 kg |

**Vai trò:** phục vụ toàn bộ workload AI tự vận hành — đọc tài liệu và OCR, nhúng vector, xếp hạng lại, mô hình ngôn ngữ và suy luận nhiều bước của tác tử.

#### 5.3.3 Hạ tầng kèm theo

| **Hạng mục** | **Yêu cầu** |
|:---|:---|
| **Lưu trữ sao lưu** | Khoảng **5 TB** khả dụng, tách rời khỏi máy chủ ứng dụng — phục vụ sao lưu hằng ngày và lưu trữ nhiệm vụ đã đóng |
| **Chuyển mạch mạng** | Switch 10 GbE nội bộ giữa máy chủ ứng dụng và hai máy chủ AI |
| **Nguồn dự phòng** | UPS cho cả ba máy chủ |

#### 5.3.4 Ba lưu ý kỹ thuật cần chốt trước khi triển khai

**Thứ nhất — kiểm chứng bộ máy OCR trên kiến trúc Arm64.** Hai máy chủ AI chạy kiến trúc Arm64 (NVIDIA Grace), trong khi phần lớn hệ sinh thái container hướng tới x86_64. Các thành phần đặt trên máy chủ ứng dụng (x86_64) không chịu rủi ro này; thành phần cần kiểm chứng trước khi ký cấu hình là:

| **Thành phần** | **Mức rủi ro** | **Đường lui** |
|:---|:---|:---|
| **Chỉ mục tìm kiếm** | Thấp | Đặt trên máy chủ ứng dụng x86_64 ở cấu hình đề xuất; nếu chuyển sang máy chủ AI thì dùng PostgreSQL + pgvector (§5.2) |
| **Bộ máy OCR** | Cao | Kiểm chứng bản Arm64 của bộ OCR chính và các bộ thay thế ở §5.2 trong giai đoạn khảo sát; nếu không đạt, bố trí dịch vụ OCR trên máy chủ x86_64 có GPU. Kết quả kiểm chứng là điều kiện chốt cấu hình |
| Các thành phần còn lại (CSDL, đồ thị, cache, định danh, proxy) | Thấp | Hỗ trợ Arm64 đầy đủ |

**Thứ hai — “1.000 TOPS” không phải chỉ số quyết định tốc độ trả lời.** TOPS đo phép toán ma trận FP4 thưa, dùng cho huấn luyện và bước tiền xử lý. Nhưng bước sinh từng token của mô hình ngôn ngữ bị chặn bởi **băng thông bộ nhớ**:

| **Thiết bị**           | **Băng thông bộ nhớ** | **So với máy chủ AI đề xuất** |
|:-----------------------|:----------------------|:------------------------------|
| **Máy chủ AI đề xuất** | **273 GB/s**          | 1,0×                          |
| NVIDIA L40S            | 864 GB/s              | 3,2×                          |
| NVIDIA H100 SXM        | 3.350 GB/s            | 12,3×                         |

Nghĩa là tốc độ sinh token thấp hơn khoảng ba lần so với một card L40S. Điểm bù lại là **128 GB bộ nhớ hợp nhất** cho phép chạy mô hình lớn hơn nhiều so với card 24 GB — ba mô hình bắt buộc chỉ chiếm khoảng 14,2 GiB, còn lại khoảng 110 GB dành cho mô hình ngôn ngữ. Đề nghị **đo thử tốc độ sinh token trên đúng mô hình sẽ triển khai** trước khi chốt chỉ tiêu ở §5.4.

**Thứ ba — máy chủ AI là thiết bị hạng máy trạm.** ThinkStation PGX nặng 1,2 kg, dung tích 1,13 lít, nguồn USB-C 240W: không có nguồn dự phòng, không hot-swap, không lắp rack, bảo hành theo hạng máy trạm. Đây là lựa chọn hợp lệ về mặt kỹ thuật và có ưu thế rõ rệt về bộ nhớ hợp nhất trên mỗi đơn vị chi phí, nhưng **khác hạng thiết bị so với máy chủ ứng dụng**. Đề nghị đơn vị xác nhận tiêu chí nghiệm thu tương ứng, hoặc chuyển sang máy chủ GPU dạng rack nếu yêu cầu về nguồn dự phòng và khung rack là bắt buộc.

### 5.4 Kiểm chứng năng lực: 50 người dùng

| **Bước tính** | **Kết quả** |
|:---|:---|
| Tải hỏi–đáp mỗi ngày | 50 người dùng × 20 câu = **1.000 câu/ngày** |
| Quy về tốc độ trung bình (8 giờ làm việc) | ≈ **2,1 câu/phút** |
| Giờ cao điểm (giả định gấp 3 lần trung bình) | ≈ **6,3 câu/phút** |
| Năng lực cấu hình khuyến nghị | **15–30 truy vấn/phút** |
| **Hệ số dư theo tải** | **2,4× – 4,8×** |
| Phiên đồng thời cao điểm | **10–15 phiên** |
| Năng lực phiên đồng thời | **50–100 phiên** |
| **Hệ số dư theo phiên** | **3,3× – 10×** |
| **Mục tiêu nghiệm thu về thời gian phản hồi** | **p95 ≤ 30 giây; ký tự đầu tiên ≤ 5 giây; không lỗi time-out hàng loạt ở 15 phiên đồng thời** |

**Kết luận theo tính toán thiết kế:** 50 người dùng nằm trong vùng vận hành thoải mái của cấu hình khuyến nghị. Đây là **kết quả tính toán trên thông số thiết kế**, chưa phải kết quả đo trên hệ thống của đơn vị — xem §5.8 về phạm vi cam kết. Mục tiêu nghiệm thu về thời gian phản hồi ở bảng trên được đo thực tế theo §5.8 trên đúng mô hình triển khai.

### 5.5 Kiểm chứng năng lực: 100 nhiệm vụ

Giả định khối lượng dùng cho tính toán (điều chỉnh được theo số liệu thực tế của đơn vị): 30–50 tài liệu mỗi nhiệm vụ, trung bình 75 trang mỗi tài liệu — tương đương **3.000–5.000 tài liệu và 225.000–375.000 trang** cho 100 nhiệm vụ.

| **Bước tính** | **Kịch bản thận trọng** | **Kịch bản cao** |
|:---|:---|:---|
| Thời gian nạp dữ liệu ban đầu với 2–3 khe OCR | **~75–110 giờ (4–5 ngày)** | **~125–190 giờ (6–8 ngày)** |
| Nếu tài liệu đã có lớp văn bản (không cần OCR) | Nhanh hơn khoảng **một bậc độ lớn** |  |
| Nạp một nhiệm vụ mới phát sinh (2.250–3.750 trang) | **~1–2 giờ** | **~1,5–3 giờ** |
| Đối chiếu tuân thủ (giả định 2 lượt/nhiệm vụ/tháng) | 200 lượt/tháng ≈ **10 lượt/ngày làm việc** |  |
| Thời gian máy cho 10 lượt × 100 tiêu chí | **~1 giờ/ngày** trên một luồng; hệ thống chạy 3–5 luồng song song |  |
| Một lượt đối chiếu 100 tiêu chí × 40 tài liệu (mục tiêu nghiệm thu) | **≤ 60 phút, chạy công việc nền** |  |
| Từ khi xác nhận văn bản mới đến khi tra cứu được | **≤ 1 giờ** |  |
| Ảnh hưởng của đợt nạp nền tới hỏi–đáp | **Độ trễ hỏi–đáp tăng ≤ 20%** |  |

**Kết luận theo tính toán thiết kế:** 100 nhiệm vụ đang vận hành là **tải thường xuyên nhẹ**. Điểm nặng duy nhất là **đợt nạp dữ liệu ban đầu**, và đó là công việc một lần, chạy được ngoài giờ. Thời gian nạp nêu trên được tính từ thông số thiết kế và cần đo lại trên dữ liệu thật — xem §5.8. Vì lời gọi mô hình ở chế độ nền được điều tiết tách biệt với lời gọi tương tác, **đợt nạp không làm chậm người dùng đang hỏi–đáp**.

**Khuyến nghị vận hành cho giai đoạn nạp ban đầu:** chia kho tài liệu thành các đợt theo nhiệm vụ, nạp ngoài giờ làm việc, theo dõi trên bảng điều khiển hàng đợi.

### 5.6 Dữ liệu, lưu trữ và sao lưu

Khối lượng dữ liệu có thể quy đổi theo hai cách, và báo cáo dùng cả hai có chủ đích:

| **Cơ sở quy đổi** | **Cách tính** | **Kết quả cho 100 nhiệm vụ** |
|:---|:---|:---|
| **Theo số tài liệu** | 30–50 tài liệu × 75 trang mỗi nhiệm vụ | 3.000–5.000 tài liệu; 225.000–375.000 trang; **~36–60 GB** dữ liệu nghiệp vụ |
| **Theo trần dung lượng** | Trần khoảng **1 GB tài liệu nguồn** mỗi nhiệm vụ | ~100 GB tài liệu nguồn; ~15–45 GB dữ liệu dẫn xuất; **~115–145 GB** |

Cộng ảnh container (~85 GB) và tệp mô hình (~11 GB), cấu hình đề xuất ở §5.3 đáp ứng: **02 × 1,92 TB NVMe (RAID 1) cho dữ liệu và 02 × 960 GB NVMe (RAID 1) cho hệ điều hành** trên máy chủ ứng dụng, bổ sung **khoảng 5 TB lưu trữ sao lưu tách rời** cho sao lưu và cho các nhiệm vụ đã đóng. Ở nhịp 100 nhiệm vụ mỗi năm, mức này cho dư địa **4–5 năm** tăng trưởng; mở rộng tới hàng trăm nghìn tài liệu chỉ cần tăng đĩa mà không đổi kiến trúc.

| **Cơ chế** | **Nội dung** |
|:---|:---|
| **Sao lưu CSDL** | Hằng ngày, cộng nhật ký giao dịch liên tục cho phục hồi tại thời điểm (PITR) |
| **Sao lưu kho tệp** | Theo thời gian thực, đa phiên bản |
| **Chỉ mục tìm kiếm và đồ thị** | Dữ liệu dẫn xuất, dựng lại được; vẫn sao lưu để rút ngắn thời gian phục hồi |
| **Mã hóa bản sao lưu** | Mã hóa trước khi đưa ra ngoài |
| **Mục tiêu phục hồi** | RTO ≤ 1 giờ khi khôi phục cấu hình, CSDL hoặc chỉ mục vector từ bản sao lưu; RTO ≤ 4 giờ khi khôi phục toàn bộ một máy chủ · RPO ≤ 24 giờ (CSDL có nhật ký giao dịch liên tục nên lượng dữ liệu mất thực tế tính bằng phút) |
| **Diễn tập phục hồi** | Hằng quý, có biên bản; kịch bản gồm xóa thử một chỉ mục rồi khôi phục và đo thời gian |

### 5.7 Điểm nghẽn đã biết và cách xử lý

Báo cáo nêu thẳng các giới hạn để lãnh đạo có cơ sở ra quyết định:

| **Điểm nghẽn** | **Biểu hiện** | **Cách xử lý** |
|:---|:---|:---|
| **OCR xử lý một tài liệu tại một thời điểm** | Đợt nạp lớn kéo dài | Nâng số khe OCR **cùng với** bộ nhớ GPU tương ứng (mỗi khe thêm khoảng 8 GiB VRAM và 9 GiB RAM); hoặc chia đợt nạp ngoài giờ; tệp lớn được chia trang để không chặn hàng đợi (§4.1) |
| **Mô hình ngôn ngữ ở cửa sổ 32.000 token** chỉ duy trì được khoảng 1,6 yêu cầu dài đồng thời | Độ trễ hỏi–đáp tăng khi nhiều người hỏi câu rất dài | Chỉ dùng cửa sổ lớn cho trích xuất và đối chiếu (chạy nền); giữ cửa sổ hỏi–đáp ở 8.000–16.000 token; cấp GPU riêng cho mô hình ngôn ngữ |
| **Một lượt đối chiếu đồng bộ có giới hạn thời gian và số dòng** | Trần 30 phút, tối đa 200 dòng mỗi lượt | Chia bộ tiêu chí thành nhiều lượt; kết quả từng lượt được lưu vào hồ sơ đối chiếu của nhiệm vụ (§4.4) và xuất CSV, Word; khối lượng lớn hơn chạy theo công việc nền; ở chế độ công việc nền, một lượt 100 tiêu chí × 40 tài liệu hoàn thành trong 60 phút (§5.5) |
| **Đổi mô hình nhúng buộc đánh chỉ mục lại toàn bộ** | Là dự án có lịch trình, không phải thay đổi cấu hình | Chốt mô hình nhúng ngay từ giai đoạn thiết kế |
| **Thêm thực thể ứng dụng không làm tăng năng lực mô hình** | Xếp hàng tệ hơn khi điểm cuối mô hình đã bão hòa | Mở rộng ở đúng chỗ: CSDL, chỉ mục tìm kiếm và điểm cuối mô hình mới là trần năng lực thật |
| **Môi trường vận hành và tiến trình nền dùng chung một tiến trình** | Tải nền nặng có thể ảnh hưởng độ trễ API | Đã giảm thiểu bằng nhóm tiến trình cô lập theo loại việc và điều tiết lời gọi mô hình nền riêng |

### 5.8 Phương pháp đo và nghiệm thu năng lực

Năng lực nêu trong báo cáo này được kiểm chứng bằng đo trên **bộ tài liệu và đề cương mẫu của đơn vị**, không đo trên dữ liệu tổng hợp. Ba nhóm chỉ tiêu:

| **Nhóm chỉ tiêu** | **Nội dung đo** | **Tham chiếu** |
|:---|:---|:---|
| **Hiệu năng** | Các mốc p50/p95 cho tải tệp, đọc trang, OCR, trích xuất, nhúng, truy hồi, hỏi–đáp và đối chiếu | §5.4, §5.5 |
| **Năng lực quy mô** | Throughput và số phiên đồng thời đạt được so với yêu cầu 50 người dùng và 100 nhiệm vụ | §5.4, §5.5 |
| **Độ chính xác** | Chỉ số lỗi ký tự và lỗi từ của đọc tài liệu scan; tỷ lệ chính xác của trích xuất thuộc tính và quan hệ; precision và recall của truy hồi; tỷ lệ dẫn nguồn đúng; tỷ lệ phát hiện đúng, tỷ lệ bỏ sót; độ nhất quán; tỷ lệ nội dung không có căn cứ | §4.2 |

**Chất lượng được đặt ngang hàng với tốc độ.** Một hệ thống trả lời nhanh nhưng dẫn sai nguồn hoặc bỏ sót vi phạm không có giá trị với công tác kiểm tra. Vì vậy bộ chỉ tiêu nghiệm thu đo trực tiếp chất lượng kết quả trên bộ hồ sơ mẫu có đáp án chuẩn — lấy từ các đợt kiểm tra đã kết thúc, trong đó kết luận của đoàn kiểm tra là đáp án đối chiếu:

| **Chỉ tiêu** | **Cách đo** | **Ngưỡng đề xuất** |
|:---|:---|:---|
| Độ chính xác của đề xuất kết luận | Tỷ lệ tiêu chí mà đề xuất của hệ thống trùng với kết luận của đoàn kiểm tra | ≥ 85% |
| Tỷ lệ dẫn nguồn đúng | Tỷ lệ trích dẫn trỏ đúng tài liệu, đúng vị trí và thực sự chứa nội dung được dùng làm căn cứ; chấm thủ công trên mẫu | ≥ 95% |
| Tỷ lệ cảnh báo sai | Trên bộ hồ sơ tuân thủ hoàn toàn, tỷ lệ tiêu chí bị đề xuất “Chưa đáp ứng” | \< 5% |
| Tỷ lệ bỏ sót | Trong các vi phạm đoàn kiểm tra đã kết luận, tỷ lệ hệ thống không phát hiện hoặc xếp nhầm là “Đáp ứng” | ≤ 5% (phát hiện ≥ 95% sai phạm) |
| Tỷ lệ nội dung không có căn cứ | Tỷ lệ câu trả lời, đề xuất chứa thông tin không truy được về đoạn nguồn | ≤ 2% |
| Độ nhất quán | Chạy lặp 3 lần cùng đầu vào, cùng cấu hình; tỷ lệ tiêu chí cho cùng một đề xuất | ≥ 95% |
| Chất lượng đọc bản scan | Tỷ lệ ký tự đúng trên bộ tài liệu scan mẫu, tính trên từng tệp | ≥ 95% tiếng Việt; ≥ 90% tiếng Anh |
| Phát hiện thiếu, sai so với đề cương | Tỷ lệ mục thiếu, sai được nêu rõ | ≥ 90% |
| Phát hiện mâu thuẫn với bằng chứng | Trên bộ case có mâu thuẫn đã biết | 100% |
| Mâu thuẫn số liệu | Số liệu lệch giữa các bảng, giữa báo cáo và phụ lục | ≥ 95% |
| Logic thời gian | Case sai trình tự ngày được gắn cờ | 100% |
| Đối chiếu nhật ký, biên bản phỏng vấn | Mâu thuẫn được phát hiện | ≥ 80% |
| Hiểu ngữ nghĩa | Câu diễn đạt khác cùng ý khớp đúng điều khoản | ≥ 90% |
| Quan hệ và hiệu lực văn bản | Chiều quan hệ và tình trạng hiệu lực đúng trên bộ ≥ 20 cặp quan hệ | 100% |
| Câu hỏi ngoài phạm vi kho | Tỷ lệ câu được báo “không có nguồn” | 100% |
| Bảng biểu | Cột số tiền, ngày, mức phí đọc đúng | ≥ 90% |
| Phân loại, cấu trúc, trích xuất | Phân loại tài liệu; nhận diện tiêu đề, số điều; từng trường trích xuất | ≥ 90% mỗi chỉ tiêu |
| Tóm tắt và gợi ý đánh giá | Bản tóm tắt được chuyên gia chấm Đạt; mức trùng ý của bảng đánh giá với bản chuẩn | ≥ 80% |
| Báo cáo sinh tự động | Đủ bốn phần; trường bắt buộc trong mẫu Word; thể thức văn bản | 100% |
| Hiệu quả | Thời gian xử lý 10 hồ sơ so với làm thủ công | Giảm ≥ 50% |
| Kết nối ra ngoài | Lưu lượng ra Internet trong suốt thời gian đo | 0 byte |
| Hiệu năng | Các mốc p50/p95 như bảng trên; thời gian phản hồi hỏi–đáp p95 | ≤ 30 giây; theo §5.4, §5.5 |

Ngưỡng trên lấy theo Checklist POC của NHNN (16/04/2026). Để các ngưỡng 95–100% có ý nghĩa thống kê, bộ đo tối thiểu gồm ≥ 30 hồ sơ có sai phạm đã biết cho mỗi nhóm đối chiếu, ≥ 10 hồ sơ tuân thủ hoàn toàn, ≥ 50 câu hỏi có đáp án và ≥ 20 câu hỏi ngoài phạm vi. Tỷ lệ bỏ sót được ưu tiên hơn tỷ lệ cảnh báo sai: một đề xuất sai sẽ bị cán bộ loại ở bước xác nhận, còn một vi phạm bị bỏ sót thì không ai nhìn thấy. Bộ đo được chạy lại sau mỗi lần thay mô hình, mẫu prompt hoặc cấu hình truy hồi (§4.8).

**Nguyên tắc nghiệm thu.** Các chỉ tiêu chất lượng ở bảng trên là chỉ tiêu nghiệm thu, đo trên bộ hồ sơ mẫu của đơn vị và ghi vào biên bản nghiệm thu. Các con số về quy mô và hiệu năng ở §5.4–§5.6 là năng lực thiết kế; chúng trở thành cam kết sau khi đo tải trên dữ liệu thật trong cùng giai đoạn nghiệm thu.

**Hồ sơ bàn giao phục vụ nghiệm thu:** danh mục thành phần hạ tầng và tài nguyên mô hình; SBOM kèm kết quả quét lỗ hổng; tài liệu kiến trúc, vận hành, quản trị và tham chiếu API; cấu hình và mẫu danh mục sao lưu; bộ tài liệu mẫu, đề cương mẫu và kế hoạch kiểm thử có tiêu chí đạt/không đạt.

## 6. Bản quyền và chi phí sở hữu

### 6.1 Nguồn gốc và mô hình bản quyền

Knowledge Platform được xây dựng trên **Tencent WeKnora**, nền tảng tri thức mã nguồn mở phát hành theo **giấy phép MIT**. Phần nền chung — nạp tài liệu đa định dạng, tìm kiếm, kiểm soát truy cập, tích hợp mô hình — đến từ nền tảng đó và tiếp tục nhận cải tiến từ thượng nguồn. Các năng lực **pháp lý Việt Nam, tích hợp định danh doanh nghiệp, bộ máy trích xuất có cấu trúc và bộ đối chiếu tuân thủ là phần phát triển riêng** xây trên nền đó.

| **Thành phần** | **Nguồn gốc** | **Giấy phép** | **Hệ quả với đơn vị sử dụng** |
|:---|:---|:---|:---|
| Nền tảng chung | Tencent WeKnora (mã nguồn mở) | MIT | Cho phép sử dụng, sửa đổi, phân phối, kể cả trong sản phẩm thương mại; chỉ yêu cầu giữ thông báo bản quyền |
| Lớp nghiệp vụ pháp lý, trích xuất, tuân thủ, tích hợp định danh | Katalyst Vietnam phát triển | Theo hợp đồng bàn giao | Bàn giao mã nguồn đầy đủ, quyền sử dụng vĩnh viễn và quyền tự phát triển tiếp |

Lớp phát triển riêng được tổ chức thành **các mô-đun tách biệt**, chỉ có một số sửa đổi nhỏ và có đánh dấu trên tệp dùng chung. Đây là quyết định kỹ thuật có mục đích quản trị: giữ cho việc hợp nhất bản phát hành mới từ thượng nguồn là công việc định kỳ nhẹ.

### 6.2 Giấy phép các thành phần chính

| **Thành phần** | **Giấy phép** | **Lưu ý tuân thủ** |
|:---|:---|:---|
| PostgreSQL, Apache AGE, Milvus, Keycloak, vLLM, nginx, Go, Vue 3, TypeScript, Docker Engine, Langfuse (phần lõi) | Apache 2.0 / BSD / MIT | Tự do sử dụng thương mại |
| **Redis** | Từ bản 7.4: RSALv2 / SSPLv1 | Tự dùng nội bộ không phát sinh nghĩa vụ. Muốn giữ giấy phép BSD thuần: dùng Redis ≤ 7.2 hoặc Valkey (BSD-3) |
| **MinIO** | AGPL-3.0 | Dùng nội bộ, không phân phối ra ngoài thì không phát sinh nghĩa vụ công bố mã. **Phương án tránh AGPL hoàn toàn:** dùng dịch vụ tương thích S3 sẵn có hoặc đĩa cục bộ |
| **MinerU** (OCR) | AGPL-3.0 | Tự vận hành nội bộ, không phân phối lại thì không phát sinh nghĩa vụ công bố. Có phương án thay thế nếu chính sách nội bộ không chấp nhận AGPL |
| Mô hình ngôn ngữ và nhúng (Qwen, BGE) | Apache 2.0 / MIT | Cho phép sử dụng thương mại; cần đối chiếu đúng biến thể kích thước triển khai |

**Nguyên tắc rà soát:** giấy phép được ghi theo phiên bản đang sử dụng tại thời điểm lập báo cáo. Trước khi bàn giao, đội triển khai xuất **danh mục thành phần phần mềm (SBOM)** và rà soát lại toàn bộ giấy phép bằng công cụ tự động, kèm biên bản, để bảo đảm khớp với chính sách bản quyền của đơn vị.

### 6.3 Chi phí bản quyền

| **Hạng mục** | **Chi phí bản quyền** |
|:---|:---|
| Nền tảng và toàn bộ thành phần hạ tầng | **0 đồng** — mã nguồn mở |
| Trọng số mô hình AI tự vận hành | **0 đồng** — giấy phép cho phép sử dụng thương mại |
| Phí theo người dùng | **Không có.** Thêm người dùng thứ 51, 100 hay 500 không phát sinh phí bản quyền |
| Phí theo số tài liệu hoặc số truy vấn | **Không có** khi tự vận hành mô hình |
| Chi phí thực tế | Phần cứng, vận hành, và dịch vụ triển khai/hỗ trợ theo hợp đồng |

Đây là khác biệt đáng kể so với các nền tảng thương mại tính phí theo người dùng hoặc theo lượng truy vấn: **chi phí của hệ thống này tăng theo hạ tầng, không tăng theo số người dùng.**

## 7. Bảo mật

### 7.1 Kiểm soát truy cập, mã hóa và triển khai kín

| **Lớp** | **Cơ chế** |
|:---|:---|
| **Đăng nhập người dùng** | SSO qua Keycloak/OIDC, liên kết trực tiếp với AD/LDAP nội bộ của đơn vị; vai trò ánh xạ từ nhóm trong hệ thống định danh; chính sách mật khẩu mạnh do hệ thống định danh áp dụng; tự khóa phiên sau 15 phút không hoạt động; xác thực đa yếu tố bắt buộc với tài khoản quản trị |
| **Ứng dụng máy** | Token RS256 do hệ thống định danh cấp, kiểm tra chữ ký, nhà phát hành, đối tượng và hạn dùng trên **từng** yêu cầu |
| **Tích hợp lập trình** | Khóa API phạm vi không gian làm việc; **quyền truy cập theo từng tuyến là chọn tham gia** — tuyến mới mặc định bị từ chối với khóa API cho tới khi khai báo ngược lại |
| **Phân quyền** | Vai trò nghiệp vụ Super Admin / Admin / Checker / Maker / Người xem (§2.5) ánh xạ xuống quyền trên từng kho tri thức (Chủ sở hữu / Quản trị / Người đóng góp / Người xem), kể cả quyền nhận qua chia sẻ; một người không vừa khởi tạo vừa phê duyệt cùng một tài liệu; người dùng thường không xem được cấu hình, mô hình và nhật ký của người khác |
| **Tắt xác thực mật khẩu nội bộ** | Khi đã cấu hình hệ thống định danh, đăng ký, đăng nhập, đổi mật khẩu và cả việc quản trị viên đặt lại mật khẩu đều bị từ chối — đây là **biện pháp an toàn**, không phải tùy chọn tiện dụng, nhằm chặn đường vòng qua xác thực đa yếu tố, qua việc vô hiệu hóa tài khoản và qua việc thu hồi quyền |
| **Mã hóa khi lưu** | Tài liệu gốc, bằng chứng và tệp xuất trong kho tệp được mã hóa phía máy chủ; cơ sở dữ liệu, chỉ mục tìm kiếm và kho vector nằm trên phân vùng đĩa mã hóa (ổ tự mã hóa trên máy chủ AI, mã hóa phân vùng trên máy chủ ứng dụng); bản sao lưu mã hóa trước khi rời máy chủ; khóa mã hóa quản lý tách khỏi dữ liệu. Khóa mô hình và thông tin bí mật mã hóa AES-256; khóa hệ thống phải đúng 32 byte và cấu hình sai bị phát hiện **ngay lúc khởi động** |
| **Mã hóa khi truyền** | TLS 1.2 trở lên |
| **Cô lập dữ liệu** | Mọi dữ liệu thuộc đúng một không gian làm việc; dữ liệu không vượt ranh giới trừ khi có lượt chia sẻ tường minh, thu hồi được và kiểm toán được |
| **Phân vùng dữ liệu** | Ba vùng tách biệt: dữ liệu nghiệp vụ nhạy cảm (tài liệu, bằng chứng theo nhiệm vụ); dữ liệu suy luận (chỉ mục, vector, bộ nhớ đệm); dữ liệu đánh giá (bộ hồ sơ mẫu, phản hồi người dùng, kết quả đo). Mỗi vùng nằm ở bucket, schema riêng với quyền truy cập riêng. Hệ thống không dùng dữ liệu nghiệp vụ để huấn luyện mô hình; việc tinh chỉnh mô hình, nếu có, chỉ dùng vùng dữ liệu đánh giá sau khi đơn vị phê duyệt |
| **Triển khai kín** | Ở cấu hình bàn giao, mọi tích hợp ra ngoài đều tắt và không thành phần nào cần kết nối ra ngoài để vận hành; giám sát lưu lượng và chính sách tường lửa chặn kết nối ra ngoài, nên dữ liệu kiểm tra, tài liệu mật và thông tin hệ thống không thể bị gửi ra ngoài kể cả khi cấu hình nhầm. Mọi lời gọi mô hình đi tới điểm cuối nội bộ trên hai máy chủ AI qua một cổng duy nhất; danh sách điểm cuối hiển thị trên màn hình quản trị (§4.12) và trong tài liệu kiến trúc. Khi nghiệm thu, hệ thống chạy với chiều ra Internet bị chặn và lưu lượng được ghi bằng tcpdump/Wireshark: chỉ tiêu 0 byte ra Internet |
| **Nhật ký kiểm toán** | Ghi mọi truy vấn hỏi–đáp, tìm kiếm và đối chiếu (người dùng, thời điểm, loại truy vấn, nội dung, nguồn được trả về), cùng tải lên và xóa tài liệu, thay đổi cấu hình, thành viên, thông tin bí mật và cấp quyền chia sẻ; nhật ký chỉ ghi thêm và tách khỏi quyền quản trị nội dung. Vết quan trắc ghi từng giai đoạn xử lý và từng lời gọi mô hình kèm thời gian, số token và điểm cuối được gọi |
| **Tuân thủ quy định ngành** | Bàn giao bảng đáp ứng từng yêu cầu của Thông tư 09/2020/TT-NHNN về an toàn hệ thống thông tin trong hoạt động ngân hàng, theo cấp độ hệ thống được đơn vị phê duyệt; SBOM và kết quả quét lỗ hổng không còn lỗ hổng mức Cao, Nghiêm trọng chưa xử lý khi nghiệm thu |

### 7.2 Bảo vệ trước tấn công qua nội dung tài liệu

Nội dung tài liệu do người dùng tải lên là **dữ liệu không tin cậy**: một tệp có thể chứa câu chữ được viết ra để điều khiển mô hình thay vì để được đọc. Năm lớp kiểm soát được áp nối tiếp nhau:

| **Lớp** | **Cơ chế** |
|:---|:---|
| **1. Ranh giới dữ liệu và chỉ thị** | Nội dung trích từ tài liệu được đưa vào ngữ cảnh như dữ liệu được trích dẫn, không phải chỉ thị; mẫu prompt nằm trong tệp mẫu tách biệt khỏi nội dung tài liệu |
| **2. Kiểm soát mọi điểm cuối ra ngoài** | Điểm cuối mô hình, bộ đọc tài liệu, tải ảnh từ xa và nạp URL đều qua **danh sách máy chủ được phép** — tài liệu độc hại không thể khiến máy chủ dò quét mạng nội bộ |
| **3. Cô lập thực thi** | Kỹ năng tác tử và mã phân tích dữ liệu chạy trong sandbox cô lập kèm bộ kiểm tra lệnh |
| **4. Cổng phê duyệt công cụ** | Lời gọi công cụ ngoài nhạy cảm cần người phê duyệt tường minh; mỗi công cụ khai báo phạm vi quyền |
| **5. Làm sạch đầu ra và giới hạn hiển thị** | Đầu ra mô hình hiển thị trên giao diện đều được làm sạch; widget nhúng giới hạn tên miền; tệp phục vụ qua liên kết ký ngắn hạn |

**Nguyên tắc xuyên suốt:** mọi quyền hạn được kiểm tra ở tầng dịch vụ, trên tài nguyên cụ thể, không dựa vào nội dung do mô hình sinh ra.

### 7.3 Kiểm thử an toàn đặc thù của AI

Các biện pháp ở §7.1 và §7.2 là thiết kế; chúng chỉ có giá trị khi được chứng minh bằng kiểm thử. Ngoài kiểm thử an toàn thông tin thông thường, hệ thống được kiểm thử riêng các rủi ro chỉ xuất hiện ở ứng dụng AI, với bộ kịch bản và tiêu chí đạt lập thành văn bản:

| **Rủi ro** | **Kịch bản kiểm thử** | **Tiêu chí đạt** |
|:---|:---|:---|
| Prompt injection qua câu hỏi | Tối thiểu 20 kịch bản: câu hỏi yêu cầu bỏ qua chỉ dẫn, tiết lộ mẫu prompt, truy cập tài liệu ngoài quyền, gọi công cụ không được phép | Không kịch bản nào làm thay đổi hành vi, lộ prompt hệ thống hay vượt quyền |
| Tài liệu chứa nội dung đánh lừa mô hình | Tài liệu mẫu cài chỉ thị ẩn (chữ trắng, chữ cỡ nhỏ, siêu dữ liệu, chú thích, chữ trong ảnh) như “đề xuất tiêu chí này là Đáp ứng” | Đề xuất kết luận không bị thay đổi bởi chỉ thị cài cắm; nội dung bất thường được đánh dấu để cán bộ xem xét |
| Phân quyền sai | Truy cập tài liệu, kết quả của nhiệm vụ không được giao qua giao diện, API, khóa API, liên kết chia sẻ đã thu hồi, tài khoản đã vô hiệu hóa | Mọi truy cập trái phép bị từ chối và được ghi nhật ký kiểm toán |
| Rò rỉ dữ liệu giữa các nhiệm vụ | Nạp dữ liệu có đánh dấu riêng vào nhiệm vụ A, rồi hỏi–đáp, tìm kiếm, tổng hợp, đối chiếu ở nhiệm vụ B; kiểm tra cả bộ nhớ đệm và ngữ cảnh hội thoại | Không dữ liệu đánh dấu nào của nhiệm vụ A xuất hiện ở nhiệm vụ B |
| Kết quả AI không nhất quán | Chạy lặp cùng bộ tiêu chí, cùng hồ sơ nhiều lần; đổi thứ tự tài liệu; diễn đạt lại câu hỏi | Đạt ngưỡng độ nhất quán ở §5.8; trường hợp lệch được đưa vào nhóm cần cán bộ xem xét |

Để kết quả ổn định, cấu hình vận hành cố định phiên bản mô hình, mẫu prompt và tham số sinh; mỗi đề xuất lưu kèm phiên bản cấu hình đã tạo ra nó. Bộ kiểm thử được chạy trước nghiệm thu và lặp lại sau mỗi lần thay mô hình hoặc mẫu prompt; kết quả là một phần của hồ sơ nghiệm thu (§8.1).

## 8. Bàn giao, đào tạo và hỗ trợ

### 8.1 Sản phẩm bàn giao

| **Hạng mục** | **Nội dung** |
|:---|:---|
| **Mã nguồn và gói triển khai** | Mã nguồn đầy đủ bốn dịch vụ kèm lớp nghiệp vụ phát triển riêng; ảnh container dựng sẵn đẩy lên registry nội bộ; cấu hình Docker Compose cho môi trường thử nghiệm và biểu đồ Kubernetes cho môi trường chính thức |
| **Cấu hình mẫu** | Bản xuất realm Keycloak; mẫu trích xuất cho các loại văn bản phổ biến; thư viện prompt nghiệp vụ; chính sách phân quyền mẫu; mẫu trích xuất cho hồ sơ tín dụng, hợp đồng, chứng từ |
| **Dữ liệu** | Toàn bộ dữ liệu nằm trên hạ tầng của đơn vị, thuộc sở hữu của đơn vị, không có cơ chế nào gửi ra ngoài |
| **Tài liệu** | Kiến trúc, vận hành, hướng dẫn người dùng, hướng dẫn quản trị, hướng dẫn phát triển, tham chiếu API; đặc tả từng agent (§4.12); quy trình cập nhật mô hình; tài liệu cấu hình và số đo của mô hình nén; sơ đồ luồng gọi mô hình nội bộ; bảng đáp ứng Thông tư 09/2020/TT-NHNN |
| **Bộ kiểm thử và hồ sơ kỹ thuật** | Kiểm thử đơn vị, kiểm thử tích hợp API, bộ tài liệu mẫu để nghiệm thu, kế hoạch kiểm thử có tiêu chí đạt/không đạt; bộ hồ sơ mẫu có đáp án chuẩn cho chỉ tiêu chất lượng (§5.8); bộ kịch bản và kết quả kiểm thử an toàn đặc thù của AI (§7.3); SBOM và kết quả quét lỗ hổng; biên bản rà soát giấy phép |

### 8.2 Đào tạo và chuyển giao

| **Đối tượng** | **Nội dung** | **Hình thức** |
|:---|:---|:---|
| **Cán bộ nghiệp vụ** | Tải tài liệu, rà soát và hiệu đính thuộc tính, hỏi–đáp có trích dẫn, đọc trích dẫn và kiểm chứng nguồn, chạy đối chiếu và xuất kết quả | Đào tạo trực tiếp, tài liệu hướng dẫn và video ngắn |
| **Trưởng nhóm / người phê duyệt** | Rà soát kết quả trích xuất, đọc báo cáo đối chiếu, đánh giá độ tin cậy | Đào tạo trực tiếp và tình huống mẫu |
| **Quản trị nghiệp vụ** | Cấu hình kho tri thức, mẫu trích xuất, mẫu prompt, quản lý thành viên và chia sẻ | Workshop chuyên sâu |
| **Quản trị hệ thống** | Triển khai, giám sát, hàng đợi, sao lưu và phục hồi, xử lý sự cố, nâng cấp | Workshop chuyên sâu và tài liệu vận hành |
| **Đội phát triển nội bộ** | Kiến trúc, điểm mở rộng, API, quy trình dựng và phát hành | Chuyển giao mã nguồn và hướng dẫn phát triển |

### 8.3 Hỗ trợ sau bàn giao

- Cam kết mức dịch vụ hỗ trợ: phản hồi ≤ 2 giờ, khắc phục sự cố nghiêm trọng ≤ 24 giờ; các mức ưu tiên thấp hơn theo phụ lục hợp đồng.
- Cập nhật mô hình AI và hợp nhất bản phát hành thượng nguồn định kỳ theo quy trình ở §4.12; mọi gói cập nhật được chuyển giao dưới dạng ngoại tuyến.
- Bảo hành phần mềm 12 tháng kể từ ngày nghiệm thu; phần cứng theo chính sách của hãng, mục tiêu 36 tháng tại chỗ.
- Cập nhật bản vá bảo mật hằng tháng; lỗ hổng mức nghiêm trọng xử lý ngay khi có bản vá.
- Kênh hỗ trợ qua hệ thống ticket; workshop định kỳ chia sẻ kết quả đo chất lượng.

## 9. Rủi ro và ràng buộc đã biết

| **Rủi ro / ràng buộc** | **Hệ quả với kế hoạch** | **Biện pháp** |
|:---|:---|:---|
| **OCR bản scan không đạt độ chính xác tuyệt đối** | Sai lệch nội dung có thể dẫn tới kết luận sai | Hệ thống chỉ ra vùng cần kiểm chứng tới từng đoạn (§4.2); bản scan không được coi là đã đúng khi chưa có xác nhận của người dùng; sai lệch phát hiện và sửa được tại chỗ; hiệu đính có hiệu lực vĩnh viễn |
| **Chỉ mục tìm kiếm tách khỏi cơ sở dữ liệu quan hệ** | Hai bên có thể lệch nhau nếu thao tác xóa hỏng giữa chừng | Có công việc đối soát và dọn dẹp định kỳ; cần giám sát thật chứ không giả định là đúng |
| **Giấy phép của một số thành phần là AGPL hoặc RSALv2/SSPL** | Có thể vướng chính sách bản quyền nội bộ | Có phương án thay thế cho từng thành phần (Valkey, dịch vụ S3 sẵn có, bộ OCR khác); rà soát lại bằng SBOM trước bàn giao |
| **Bộ nhớ GPU là ràng buộc cứng của mô hình tự vận hành** | Tăng số người dùng đồng thời chạm trần năng lực mô hình trước tiên | Cấp GPU riêng cho mô hình ngôn ngữ; mở rộng theo hướng dẫn ở §5.7 |
| **Xây trên nền mã nguồn mở thượng nguồn** | Phải hợp nhất bản phát hành thượng nguồn định kỳ | Chi phí bảo trì định kỳ đã dự trù; lớp phát triển riêng tổ chức thành mô-đun tách biệt để giảm công hợp nhất |
| **Máy chủ AI chạy kiến trúc Arm64** | Bộ máy OCR cần có bản Arm64; nếu không có thì phải đổi phương án | Kiểm chứng trước khi ký cấu hình; phương án dự phòng là bố trí OCR trên máy chủ x86_64 có GPU (§5.3.4) |
| **Máy chủ AI thuộc hạng máy trạm** | Không nguồn dự phòng, không hot-swap, bảo hành hạng máy trạm — khác hạng thiết bị so với máy chủ ứng dụng | Đơn vị xác nhận tiêu chí nghiệm thu tương ứng, hoặc chuyển sang máy chủ GPU dạng rack (§5.3.4) |
| **Tốc độ sinh token của mô hình ngôn ngữ** | Băng thông bộ nhớ 273 GB/s thấp hơn khoảng ba lần so với card L40S, ảnh hưởng trực tiếp chỉ tiêu ở §5.4 | Đo thử trên đúng mô hình sẽ triển khai trước khi chốt chỉ tiêu (§5.3.4) |
| **Kết quả POC chưa được kiểm chứng lại** | Hai lỗi mức cao ở POC (chiều quan hệ văn bản, trả lời khi không có nguồn) nếu tái diễn sẽ ảnh hưởng trực tiếp tới tính đúng của kết luận | Chạy lại toàn bộ kịch bản POC trên phiên bản khắc phục trước khi nghiệm thu; ghi kết quả tại §12 |

Bốn giới hạn kỹ thuật vận hành — OCR xử lý một tài liệu tại một thời điểm, cửa sổ ngữ cảnh của mô hình ngôn ngữ, trần đối chiếu đồng bộ và việc đổi mô hình nhúng — đã được nêu ở §5.7 kèm biện pháp xử lý và không lặp lại ở đây.

## 10. Ma trận đáp ứng yêu cầu

### 10.1 Ma trận đáp ứng yêu cầu

| **Yêu cầu** | **Đánh giá** | **Phạm vi và căn cứ** |
|:---|:---|:---|
| 100 nhiệm vụ nghiệp vụ | **Trong phạm vi thiết kế** | Thuộc nhóm năng lực quy mô, xác lập bằng đo tải (§5.5). Đợt nạp ban đầu 4–8 ngày, chạy ngoài giờ |
| 50 người dùng | **Trong phạm vi thiết kế** | Thuộc nhóm năng lực quy mô, xác lập bằng đo tải (§5.4). 10–15 phiên đồng thời cao điểm so với thiết kế 50–100 phiên |
| Khối lượng tài liệu 3.000–5.000 | **Trong phạm vi thiết kế** | Thuộc nhóm năng lực quy mô, xác lập bằng đo tải (§5.6) |
| Dung lượng lưu trữ | **Đạt theo cấu hình bàn giao** | Thuộc phạm vi cấu hình: 1 TB lưu trữ nóng cộng ~5 TB lưu trữ dự phòng (§5.6) |
| Triển khai kín, dữ liệu không rời tổ chức | **Đạt — thuộc phạm vi chức năng** | Cam kết ngay khi bàn giao (§5.1, §7.1) |
| Không phát sinh phí bản quyền theo người dùng | **Đạt — thuộc phạm vi bản quyền** | Cam kết ngay khi bàn giao (§6.3) |
| Trích dẫn tới Điều, Khoản | **Đạt — thuộc phạm vi chức năng** | Cam kết ngay khi bàn giao (§4.1, §4.3) |
| Không trả về văn bản hết hiệu lực như luật hiện hành | **Đạt — thuộc phạm vi chức năng** | Cam kết ngay khi bàn giao (§4.6) |
| Nhật ký kiểm toán đầy đủ | **Đạt — thuộc phạm vi chức năng** | Cam kết ngay khi bàn giao (§7.1) |
| AI hỗ trợ, cán bộ quyết định kết luận | Đạt — thuộc phạm vi chức năng | Cam kết ngay khi bàn giao (§2.4, §4.4) |
| Bộ tiêu chí có cấu trúc, ba trạng thái đề xuất | Đạt — thuộc phạm vi chức năng | Cam kết ngay khi bàn giao (§4.4) |
| Xử lý bằng chứng kỹ thuật CNTT | Đạt — thuộc phạm vi triển khai | Bộ đọc chuyên biệt theo danh mục thiết bị, công cụ quét của đơn vị (§4.5) |
| Mã hóa đầy đủ khi lưu và khi truyền | Đạt — thuộc phạm vi cấu hình | Cam kết ngay khi bàn giao (§7.1) |
| Kiểm thử rủi ro đặc thù của AI | Đạt — thuộc hồ sơ nghiệm thu | Bộ kịch bản và tiêu chí đạt (§7.3) |
| Độ chính xác, dẫn nguồn đúng, phát hiện đúng, bỏ sót | Trong phạm vi thiết kế | Thuộc nhóm chỉ tiêu chất lượng, xác lập bằng đo nghiệm thu (§5.8) |
| Nạp tài liệu đa định dạng, tệp tới 100 MB / 300 trang | Đạt — thuộc phạm vi chức năng | §4.1 |
| OCR tiếng Việt, tiếng Anh; bảng biểu; số liệu nhiễu | Trong phạm vi thiết kế | Thuộc nhóm chỉ tiêu chất lượng, xác lập bằng đo nghiệm thu (§4.2, §5.8) |
| Phân loại tài liệu, làm sạch trước khi đánh chỉ mục | Đạt — thuộc phạm vi chức năng | §4.1 |
| Quan hệ văn bản hai chiều, bốn trạng thái hiệu lực | Đạt — thuộc phạm vi chức năng | §4.6; khắc phục lỗi POC 16/04 (§12) |
| Nhất quán số liệu, logic thời gian | Đạt — thuộc phạm vi chức năng | §4.4 |
| Thể thức báo cáo theo Nghị định 30/2020/NĐ-CP | Đạt — thuộc phạm vi chức năng | §4.8 |
| Quản trị mô hình, prompt, phản hồi người dùng, đặc tả agent | Đạt — thuộc phạm vi chức năng | §4.12 |
| AD/LDAP, khóa phiên, MFA quản trị; nhật ký mọi truy vấn; phân vùng dữ liệu | Đạt — thuộc phạm vi cấu hình | §7.1 |
| Sao lưu, phục hồi cấu hình, CSDL, chỉ mục \< 1 giờ | Đạt — thuộc phạm vi cấu hình | §5.6 |
| Đáp ứng Checklist POC 16/04/2026 | Xem Phụ lục A | Phụ lục A; tình trạng khắc phục lỗi POC tại §12 |

**Cách đọc bảng này.** Các dòng đánh giá “Trong phạm vi thiết kế” thuộc năng lực quy mô và chất lượng: phụ thuộc vào dữ liệu thật và điều kiện hạ tầng thực tế, nên được xác lập bằng bước đo nghiệm thu ở §5.8. Các dòng đánh giá “Đạt” thuộc phạm vi chức năng và cấu hình, được cam kết khi bàn giao và kiểm chứng bằng kiểm thử chức năng.

### 10.2 Điểm mở rộng không cần thay đổi kiến trúc

| **Muốn thêm…** | **Công việc cần làm** | **Có cần thay đổi kiến trúc** |
|:---|:---|:---|
| Một nhà cung cấp mô hình AI mới | Một hồ sơ nhà cung cấp sau giao diện mô hình sẵn có | Không |
| Một bộ máy tìm kiếm hoặc kho tệp mới | Một hiện thực của giao diện sẵn có | Không |
| Một định dạng tài liệu hoặc chiến lược chia đoạn mới | Một mô-đun đăng ký vào tầng tương ứng | Không |
| **Một mẫu trích xuất mới** | **Một mục cấu hình — không cần viết mã** | Không |
| Một nền tảng chat hoặc nguồn dữ liệu mới | Một bộ chuyển đổi theo khuôn sẵn có | Không |
| Một công cụ mới cho tác tử | Một công cụ đăng ký kèm phạm vi quyền khai báo | Không |
| Một loại công việc nền mới | Một bộ xử lý đăng ký vào hàng đợi phù hợp | Không |

Tính nhất quán của bảng này là điểm đáng lưu ý: **phần lớn các yêu cầu nghe như “hỗ trợ thêm X” là cấu hình hoặc một mô-đun nhỏ, không phải việc thay đổi kiến trúc.** Các yêu cầu thực sự cần thay đổi cấu trúc là những yêu cầu làm đổi hình thái truy hồi, đổi mô hình phân quyền, hoặc đổi ranh giới đồng bộ và bất đồng bộ.

## 11. Kết luận và kiến nghị

### 11.1 Kết luận

Knowledge Platform đáp ứng đủ yêu cầu nghiệp vụ và quy mô đặt ra:

- **Về năng lực nghiệp vụ:** hệ thống xử lý trọn vẹn ba nhóm đối chiếu trọng tâm — đề cương kiểm tra, bằng chứng đính kèm và văn bản quy phạm — với kết quả từng dòng kèm bằng chứng trích nguyên văn. Đây là điểm khác biệt quyết định so với công cụ tìm kiếm hoặc trợ lý AI thông thường: kết luận truy được nguồn nên bảo vệ được trước hội đồng.
- **Về kiểm tra CNTT:** hệ thống đọc và đối chiếu được bằng chứng kỹ thuật — cấu hình, nhật ký, kết quả quét, danh mục tài sản, ảnh chụp màn hình — với bộ tiêu chí có cấu trúc; mỗi tiêu chí được đề xuất Đáp ứng, Chưa đáp ứng hoặc Chưa đủ căn cứ, kèm dẫn nguồn, và kết luận cuối cùng luôn thuộc về cán bộ, đoàn kiểm tra.
- **Về quy mô:** cấu hình khuyến nghị được thiết kế cho 100 nhiệm vụ và 50 người dùng, có dư địa ở cả ba chiều: số phiên đồng thời, khối lượng tài liệu và dung lượng lưu trữ. Điểm nặng duy nhất là đợt nạp dữ liệu ban đầu. **Đây là năng lực thiết kế; các con số quy mô cần được xác lập bằng đo nghiệm thu trên dữ liệu thật trước khi trở thành cam kết hợp đồng** (§5.8).
- **Về chủ quyền dữ liệu:** toàn bộ mô hình, OCR, định danh và lưu trữ tự vận hành trong mạng nội bộ; ở cấu hình bàn giao không có dữ liệu nào được gửi ra ngoài, và dữ liệu được mã hóa cả khi lưu lẫn khi truyền.
- **Về chi phí:** nền tảng mã nguồn mở, không phí theo người dùng và không phí theo truy vấn. Chi phí tăng theo hạ tầng, không tăng theo số người dùng.
- **Về đáp ứng POC:** phiên bản 2.1 bổ sung đủ sáu nhóm yêu cầu A–F của Checklist POC (Phụ lục A); các vấn đề ghi nhận trong POC ngày 10/04 và 16/04/2026 đều có biện pháp khắc phục và được kiểm chứng lại theo §12.

Các giới hạn kỹ thuật đã được nêu thẳng ở §5.7 và §9, mỗi giới hạn kèm biện pháp xử lý cụ thể. Không có giới hạn nào ảnh hưởng tới khả năng đáp ứng quy mô 100 nhiệm vụ và 50 người dùng.

### 11.2 Kiến nghị

1.  **Chốt cấu hình triển khai.** Đề nghị phê duyệt cấu hình ở §5.3 gồm 01 máy chủ ứng dụng SR630 V4 (16 nhân, 128 GB, ổ RAID 1) và 02 máy chủ AI ThinkStation PGX, cộng lưu trữ sao lưu ~5 TB, switch 10 GbE và UPS. Đây là cấu hình mà thiết kế chỉ ra là phù hợp với quy mô 100 nhiệm vụ và 50 người dùng; cấu hình này cùng các thông số ở §5.8 là cơ sở để đo nghiệm thu. Ba lưu ý kỹ thuật ở §5.3.4 cần được chốt trước khi ký.
2.  **Chốt số liệu khối lượng thực tế.** Đề nghị đơn vị cung cấp số tài liệu, số trang và dung lượng trung bình mỗi nhiệm vụ, để thay hai cơ sở quy đổi ở §5.6 bằng số đo thực tế trước khi ký phụ lục hợp đồng.
3.  **Tổ chức đo nghiệm thu trên dữ liệu thật.** Đề nghị dành một giai đoạn đo trên bộ tài liệu và đề cương mẫu của đơn vị, ghi kết quả vào biên bản nghiệm thu theo bộ chỉ tiêu ở §5.8. Số liệu trong báo cáo này là năng lực thiết kế và kết quả đo trên hệ thống tham chiếu, **không phải cam kết mức dịch vụ** cho tới khi hoàn thành bước này. Đề nghị hai bên thống nhất bằng văn bản rằng các chỉ tiêu quy mô chỉ trở thành nghĩa vụ hợp đồng sau bước này.
4.  **Bố trí hạ tầng thuộc trách nhiệm đơn vị.** Đề nghị chuẩn bị sớm bốn hạng mục ảnh hưởng tới tiến độ triển khai: vị trí lưu trữ sao lưu tách rời, máy chủ trung gian cho kết nối quản trị, hệ thống phòng chống mã độc, và lịch kiểm tra đánh giá định kỳ.
5.  **Lập kế hoạch nạp dữ liệu ban đầu.** Đề nghị chia kho tài liệu thành các đợt theo nhiệm vụ và nạp ngoài giờ làm việc để không ảnh hưởng công việc thường xuyên.
6.  **Kiểm chứng lại kết quả POC.** Đề nghị tổ chức một buổi chạy lại toàn bộ kịch bản POC (Checklist 16/04/2026 và các vấn đề ghi nhận ngày 10/04, 16/04) trên phiên bản khắc phục, với bộ dữ liệu mẫu theo quy mô ở §5.8; kết quả được ghi vào §12 và Phụ lục A.


---

# Mức đáp ứng đã kiểm trên mã nguồn (15/10/2026, commit 96d3345e)

Nguồn: `samples/kvault_docs/doi-chieu-nang-luc-knowledge-vault-0.8.0-96d3345e.md`. Bảng này là căn cứ xếp mức trong fit.md, ưu tiên hơn lời báo cáo phía trên. "Có sẵn" là có mã chạy, chưa phải đã nghiệm thu trên hệ thống thật.

**Kết quả:** 168 năng lực/tuyên bố: **75 Có sẵn**, **62 Một phần**, **12 Chưa có**, **19 Không kiểm được**.

Điểm cần xử lý khi dùng báo cáo bán hàng: cổng từ chối thiếu nguồn của agent pháp lý đã bị gỡ ngày 12/10 (`sbv_source_guard.go`), trong khi đặc tả vẫn mô tả cổng cũ; chưa có audit job nền, tự lưu trữ dài hạn văn bản hết hiệu lực, cổng OCR bắt buộc trước kết luận vi phạm, hoặc snapshot version prompt đầy đủ. Các chức năng đối chiếu/bằng chứng CNTT/KIE/Word export có mã thực và được đánh giá riêng theo đúng giới hạn, không gom thành “chưa có” toàn bộ nhóm.

| # | Năng lực (mục báo cáo) | Mức | Căn cứ trong mã | Ghi chú |
| --- | --- | --- | --- | --- |
| 1 | Nạp PDF, PDF scan, Word, Excel, PowerPoint, ảnh, Markdown, HTML, EPUB, text, trang web (§1.2; §4.1; §10.1) | Có sẵn | `docreader/parser/registry.py`: `ParserEngineRegistry.get_parser_class`; các parser `pdf_parser.py`, `docx2_parser.py`, `excel_parser.py`, `markitdown_parser.py`, `epub_parser.py`, `web_parser.py`; `internal/infrastructure/docparser/engine_registry.go`. | Có đường xử lý thực; PPT/PPTX/CSV chuyển sang Markitdown, OCR phụ thuộc engine và mô hình đã cấu hình. Không có nghĩa mọi tệp cùng đuôi đều đọc thành công. |
| 2 | OCR tiếng Việt, tiếng Anh tự vận hành (§1.2; §4.1) | Có sẵn | `internal/infrastructure/docparser/mineru_converter.go`: `MinerUReader.Read`, `callFileParse`; `docreader/parser/pdf_parser.py`: định tuyến từng trang; engine MinerU/PaddleOCR trong `internal/infrastructure/docparser/`. | Có bộ nối tới OCR tự vận hành; docreader không tự chạy OCR. Phải cấp endpoint nội bộ và trọng số phù hợp; độ chính xác xem dòng về nghiệm thu. |
| 3 | Chia đoạn Chương → Mục → Điều → Khoản → Điểm, giữ đường dẫn (§1.2; §4.1; §10.1) | Có sẵn | `internal/infrastructure/chunker/legal_splitter.go`: `chunkLegal`, `reChapter`, `reSection`, `reArticle`, `reClause`, `rePoint`; `internal/application/service/knowledge_process.go`: lưu `DocumentChunkMetadata.Hierarchy`. | Chọn strategy `legal`; breadcrumb được dùng trong `frontend/src/components/doc-content.vue` và `GlobalCommandPalette/useSearch.ts`. Không suy từ đây rằng mọi trích dẫn của LLM đều chính xác. |
| 4 | Nhận cấu trúc OCR mất dấu, mất khoảng trắng; có chia đoạn dự phòng (§4.1) | Có sẵn | `internal/infrastructure/chunker/legal_splitter.go`: regex dung sai OCR; `internal/infrastructure/chunker/strategy.go`: chọn chiến lược và fallback. | Có nhận dạng các biến thể đã mã hóa; không phải bộ sửa mọi lỗi OCR. |
| 5 | Bảng PDF/scan/Excel thành ô có kiểu số tiền, ngày, mức phí thống nhất (§4.1) | Một phần | `docreader/parser/excel_parser.py`; `internal/infrastructure/docparser/html_table_normalizer.go`; `internal/kie/kie.go`: `normalize`; `internal/itevidence/figures.go`: `ExtractFigures`. | Có đọc bảng và trích trường theo schema, nhưng chưa có mô hình ô có kiểu thống nhất cho mọi parser; PDF builtin không xử lý bảng như MinerU. Chỉ nói hỗ trợ bảng theo engine/schema đã cấu hình. |
| 6 | Tự phân loại tài liệu khi nạp, cán bộ sửa nhãn (§4.1; §4.11; §10.1) | Có sẵn | `internal/doctype/doctype.go`: phân loại quy tắc rồi KIE/LLM; `internal/application/service/doc_type_hook.go`: `classifyDocType`; `internal/types/knowledge_fields.go`: `SetFields`. | Danh mục loại cấu hình được; khi không quyết định được có `khac`/không có nhãn, không bảo đảm phân loại đúng mọi tài liệu. |
| 7 | Nhãn phân loại tự quyết định mẫu trích xuất (§4.1) | Một phần | `internal/application/service/doc_kie.go`: `pickKIEPreset`, `resolveKIEPresetFor`; `internal/kie/preset.go`: `MatchPreset`. | Mẫu được chọn theo pin/cấu hình, tên tệp, loại tệp, nội dung và ưu tiên strategy pháp lý; chưa thấy ánh xạ tổng quát từ nhãn phân loại sang mẫu. Chỉ nói có chọn mẫu theo các quy tắc hiện có. |
| 8 | Làm sạch header/footer, số trang, dòng lặp, ký tự rác trước đánh chỉ mục (§4.1; §10.1) | Có sẵn | `internal/infrastructure/chunker/page_noise.go`: `CleanPageNoise`; `internal/application/service/knowledge_process.go`: làm sạch trước chia đoạn. | Có thuật toán làm sạch theo quy tắc. Không cam kết loại hết mọi header/footer hoặc không xóa nhầm trên mọi bố cục. |
| 9 | Nhận tệp 100 MB, PDF tối đa 300 trang ở cấu hình SBV (§4.1; §10.1; §12) | Có sẵn | `internal/sbvingest/limits.go`: `ValidateMultipart`, `ValidateReader`, `PDFPages`; `deploy/sbv/ingest.compose.yml`, `ingest.env.example`. | Cấu hình phải được áp dụng cho app/frontend/docreader; 300 trang là giới hạn PDF. Có qpdf kiểm tra trước lưu/hàng đợi, không phải số đo upload 100 MB thành công trên hạ tầng thật. |
| 10 | Từ chối ngay mọi tệp hỏng/vượt giới hạn, không treo hàng đợi (§4.1) | Một phần | `internal/sbvingest/limits.go`: `ValidateReader` giới hạn byte, qpdf đếm trang với timeout 30 giây; `internal/application/service/sbv_ingest.go`: `rejectSBVDocument`. | Có chặn kích thước và PDF lỗi khi bật chính sách trang; chưa có kiểm định cấu trúc trước upload cho tất cả Office/ảnh/EPUB. Chỉ cam kết các kiểm tra đầu vào đã thực hiện; lỗi parser khác được ghi khi xử lý. |
| 11 | Tải lên trả về rồi xử lý nền (§4.1) | Có sẵn | `internal/application/service/knowledge_create.go`; `knowledge_process.go`; `dms_publication.go`: `PublishDMSKnowledge`, đưa `TypeDocumentProcess` vào Asynq. | Đường nạp thường có hàng đợi; DMS workflow giữ bản gốc và chỉ xử lý sau phê duyệt/công bố. Không phải upload nào cũng OCR ngay. |
| 12 | Tự chia PDF scan lớn thành lô trang rồi ghép, giữ trang gốc (§4.1; §5.7; §12) | Có sẵn | `internal/infrastructure/docparser/mineru_batch.go`: `mineruBatchPages`, `readPDFBatches`; `mineru_converter.go`: nhánh gọi batch. | Bật `WEKNORA_MINERU_BATCH_PAGES`; lô xử lý tuần tự, có dịch số trang và ghi `ocr_failed_pages`. Biến ở tệp env mẫu cần được truyền vào tiến trình thực. |
| 13 | Chia trang bảo đảm tệp lớn không chặn các tệp khác (§4.1; §5.7) | Một phần | `internal/infrastructure/docparser/mineru_batch.go`: vòng lặp tuần tự; `mineru_converter.go`: `mineruSem`, `callFileParse`. | Có chia nhỏ lời gọi OCR và giới hạn đồng thời; chưa có bộ lập lịch công bằng theo trang hoặc cam kết chống đói hàng đợi. Chỉ nói chia lô giúp giới hạn mỗi lần gọi, vẫn có thể phải chờ khe OCR. |
| 14 | Hiển thị trạng thái từng tệp theo thời gian thực (§3.4.1; §4.1; §12) | Một phần | `internal/dms/workflow.go`: `publicationState`, `publicationStates`; `internal/types/knowledge_review.go`; `frontend/src/views/kp/KpDocuments.vue` và màn hình knowledge. | Có trạng thái parse/review/publication và cơ chế tải lại/polling; chưa thấy một luồng push thống nhất đúng toàn bộ chuỗi OCR → Maker → Checker → chỉ mục. Chỉ nói giao diện cập nhật trạng thái theo từng luồng và chu kỳ tải lại. |
| 15 | Luồng nạp bắt buộc OCR → Maker → Checker → mới đánh chỉ mục cho mọi tài liệu (§3.4.1; §4.2) | Một phần | `internal/application/service/knowledge_review.go`: `SubmitReview` đòi `ParseStatusCompleted`; `internal/dms/workflow.go`: giữ bản gốc trước xử lý; `dms_publication.go`: công bố rồi mới parse. | Có hai workflow khác nhau: Inbox được parse trước duyệt; DMS duyệt bản gốc trước OCR. Chỉ nói có luồng duyệt khi bật cấu hình tương ứng, chưa có cổng xác nhận OCR phổ quát như sơ đồ báo cáo. |
| 16 | Tài liệu chưa xác nhận tuyệt đối không tham gia mọi truy hồi/đối chiếu (§3.4.1; §4.2) | Một phần | `internal/dms/workflow.go`: tạo knowledge `awaiting_ingest`, `disabled`; `internal/application/service/knowledge_review.go`: chuyển tài liệu từ Inbox sang đích sau duyệt. | DMS có cách ly trước công bố; Inbox của workflow cũ đã hoàn tất xử lý trước submit. Chỉ nói kho chính thức nhận tài liệu theo workflow đã bật; không bảo đảm tất cả đường nạp/kho đều bị chặn bởi một cổng OCR chung. |
| 17 | Maker–Checker hai người bắt buộc trên mọi đường duyệt (§1.2; §3.4.5; §7.1; §12) | Một phần | `internal/dms/versions.go`: nhánh review chặn `actor == SubmittedBy` hoặc `OwnerID`; `internal/application/service/knowledge_review.go`: `Approve`; `repository/knowledge_review.go`: `ClaimReview` không có điều kiện khác người submit. | DMS có kiểm tra khác người gửi/chủ tài liệu; đường knowledge-review cũ chưa thấy kiểm tra tương đương trong service/repository. Chỉ cam kết tách người trong workflow DMS được bật và kiểm soát cấu hình vai trò ở các đường còn lại. |
| 18 | Ghi người thực hiện, thời điểm và chuyển trạng thái phiếu (§3.4.5) | Có sẵn | `internal/dms/handler.go`, `versions.go`, `workflow.go`: ghi event trong transaction; `internal/application/repository/knowledge_review.go`: `SubmitReview`, `ClaimReview`, `RejectReview`. | Có dấu vết chuyển trạng thái, người gửi/người duyệt, thời gian. Tính đầy đủ và bất biến toàn hệ thống được đánh giá riêng ở nhóm audit. |
| 19 | Word/Excel/text/PDF có lớp văn bản giữ nguyên và đúng 100%, không qua OCR (§4.2) | Không kiểm được | `docreader/parser/pdf_parser.py`: quyết định từng trang text/scan; các parser Word/Excel bóc văn bản; `internal/infrastructure/docparser/engine_registry.go`: chọn engine. | Có bóc lớp text, nhưng định tuyến có thể đưa trang/tệp qua OCR và làm sạch có thể đổi nội dung. Không có kết quả nghiệm thu chứng minh 100% trên từng tệp. |
| 20 | Điểm tin cậy OCR theo trang/đoạn và cảnh báo dưới ngưỡng (§4.2) | Một phần | `internal/infrastructure/chunker/ocr_confidence.go`: `ScoreOCRText`, `LowOCRPages`, `FlagOCRLowConfidence`; `internal/application/service/ocr_review.go`: `applyOCRConfidence`. | Có điểm heuristic theo hình dạng từ/ký tự, mặc định ngưỡng 0,85, không phải xác suất từ OCR hay CER thực; đoạn quá ngắn không được chấm. Chỉ nói có cờ nghi ngờ để hỗ trợ rà soát. |
| 21 | Mọi sai lệch OCR đều phát hiện được (§4.2) | Một phần | `internal/infrastructure/chunker/ocr_confidence.go`: ghi rõ từ đọc sai nhưng vẫn thành âm tiết hợp lệ không bị phát hiện. | Có bắt một số dấu hiệu nhiễu; không phát hiện được mọi sai lệch nội dung. Cần người đối chiếu với bản gốc. |
| 22 | Hiệu đính đoạn trực tiếp và cập nhật chỉ mục (§4.2) | Có sẵn | `internal/application/service/chunk.go`: `UpdateDocumentChunk`, `syncChunkIndex`, `rebuildParentContent`; `frontend/src/components/doc-content.vue`. | Có sửa và nhúng lại đoạn liên quan; có thể đồng bộ đoạn cha/ảnh con và cập nhật nội dung dẫn xuất, nên câu “chỉ riêng một đoạn” cần hiểu theo các phụ thuộc này. |
| 23 | Hiệu đính nội dung tồn tại vĩnh viễn qua mọi lần nạp lại (§4.2) | Một phần | `internal/application/service/ocr_review.go`: `carryChunkEdits`, `matchChunkEdits` so khớp chính xác `SourceContent`. | Có khôi phục khi văn bản parser gốc trùng khớp; đổi OCR/chunking khiến bản sửa không được áp lại tự động, chỉ còn ở hàng soft-delete. Chỉ cam kết giữ và áp lại bản sửa khi nguồn đoạn còn khớp. |
| 24 | Hiệu đính thuộc tính được giữ, bộ trích xuất không ghi đè trường verified (§1.2; §4.2; §4.7) | Có sẵn | `internal/types/knowledge_fields.go`: `SetFields`, `VerifiedFields`; `internal/application/service/doc_kie.go`: `ApplyKIEMetadata`; `legal_kie_hook.go`: giữ quan hệ đã xác minh. | Có cờ verified trên bản ghi và bỏ qua khi trích lại. Phạm vi là tài liệu/bản ghi còn tồn tại; xóa rồi nạp thành tài liệu mới không có cam kết “vĩnh viễn”. |
| 25 | Độ tin cậy và tô vùng đến từng ô bảng, gồm vùng ảnh gốc (§4.2) | Chưa có | Không tìm thấy mô hình tọa độ ô/vùng ảnh kèm OCR confidence xuyên suốt parser → chunk → frontend. `ocr_review.go` và `ocr_confidence.go` chỉ có cờ/điểm theo văn bản và trang. | Hiện có cờ trang/đoạn và giá trị nghi ngờ; chưa có bản đồ độ tin cậy/tô vùng từng ô gắn ảnh gốc. |
| 26 | Không tự sửa số nhiễu; gắn cờ số tiền/tỷ lệ/ngày đọc không chắc (§4.2) | Có sẵn | `internal/kie/numcheck.go`: `CheckNumber`, `numberInSource`, `UncertainNumbersInText`; `kie.go`: `normalize`; `internal/itevidence/figures.go`: `uncertainty`. | Có giữ số nhiễu và cờ `uncertain_number`; phạm vi trường số và mẫu token đã hỗ trợ. Ngày bị OCR thành một ngày hợp lệ khác vẫn cần người kiểm chứng. |
| 27 | Chặn dùng đoạn OCR chưa xác minh làm căn cứ duy nhất cho “Chưa đáp ứng” (§4.2) | Chưa có | `internal/application/service/compliance.go`: `ComplianceEvidence` không mang cờ xác minh OCR; `compliance_assess.go`: `assess`/`fromAnswers` kiểm nguồn và độ tin cậy quyết định nhưng không kiểm `OCRLowConfidence`/trạng thái xác minh. | Chưa có cổng OCR ở bộ phán quyết. Cán bộ phải tự kiểm chứng đoạn nguồn trước khi chấp nhận đề xuất. |
| 28 | Chặn số nghi ngờ khỏi kết luận mâu thuẫn (§4.2; §4.4) | Có sẵn | `internal/itevidence/figures.go`: `CheckFigures`, `comparePair`, `compareTotal`, `uncertainty`, trạng thái `figure_uncertain`. | Bảng số có cờ nhiễu/đơn vị không rõ được chuyển thành cần đối chiếu bản gốc. Không phải bảo đảm phát hiện mọi số đọc sai nhưng có vẻ hợp lệ. |
| 29 | OCR tiếng Việt ≥95%, tiếng Anh ≥90%, từng tệp; CER/WER (§4.2; §10.1) | Không kiểm được | `cmd/sbveval/ocr.go`, `ocr_test.go`; `docs/sbv/eval/README.md`: công cụ so ground truth và kết quả OCR. | Có công cụ đo, chưa có bằng chứng chạy trên bộ hồ sơ thật trong phạm vi đọc này. Điểm heuristic 0,85 không chứng minh đạt ngưỡng nghiệm thu. |
| 30 | Hỏi tiếng Việt, trả lời có tham chiếu đoạn nguồn/liên kết nguồn (§1.2; §3.4.2; §4.3; §4.11; §10.1) | Có sẵn | `internal/application/service/session_knowledge_qa.go`: `KnowledgeQAByEvent`, `emitKnowledgeReferencesEvent`; `sbv_evidence_warnings.go`: `answerEvidenceReferences`; `frontend/src/views/chat/components/botmsg.vue`. | Có pipeline tham chiếu và trình xem nguồn. Đúng tuyệt đối số Điều/Khoản/Điểm trong mọi câu trả lời vẫn cần đo, không suy từ sự tồn tại của reference. |
| 31 | Hai chế độ trả lời trực tiếp và tác tử nhiều bước (§4.3) | Có sẵn | `internal/application/service/session_knowledge_qa.go`: `KnowledgeQA`; `session_agent_qa.go`: `AgentQA`; `internal/agent/tools/legal_validity.go`, `legal_neighbors.go`. | Có thực thi agent và tool pháp lý; hành vi dùng tool phụ thuộc cấu hình/prompt/mô hình. |
| 32 | Không có nguồn thì luôn dừng và trả “không đủ căn cứ” (§1.2; §3.4.2; §4.3; §12) | Một phần | `internal/application/service/sbv_source_guard.go`: `injectLegalEvidence` trả nil khi không có nguồn/lỗi; `session_agent_qa.go`: gọi hàm này; `session_knowledge_qa.go`: `handleFallbackResponse` chọn fixed hoặc model. | Agent không còn cổng dừng thiếu nguồn; QA thường vẫn có fallback theo cấu hình. Chỉ nói có hướng dẫn và lựa chọn fallback, chưa có bảo đảm từ chối bắt buộc trên mọi đường. |
| 33 | Chặn hỏi văn bản chưa nạp, không nhầm với văn bản khác (§4.3; §12, POC TT09/2020) | Chưa có | `internal/application/service/sbv_source_guard.go`: đầu file ghi cổng 2.2 đã gỡ 12/10; `injectLegalEvidence` không gọi `sourceguard.Refuse`; `internal/sourceguard/guard.go` còn utility nhưng không tạo cổng thực thi tại đây. | Chưa có cổng kiểm danh tính văn bản đang hoạt động như mô tả POC; không được coi mã utility/test còn lại là đã khắc phục trong luồng agent. |
| 34 | Mô hình bị cưỡng chế chỉ dùng kho, không thể dùng kiến thức nền (§3.4.2; §4.3) | Một phần | `internal/agent/tools/knowledge_search.go`: hướng dẫn nguồn; `internal/application/service/sbv_source_guard.go`: thêm quoted context; `config/prompt_templates/agent_system_prompt.yaml`: quy tắc kho là nguồn duy nhất. | Có ràng buộc bằng prompt và quyền truy hồi, chưa có bộ kiểm chứng mọi phát biểu đầu ra. Chỉ nói trả lời được hướng dẫn dựa trên tài liệu, cần kiểm chứng trích dẫn. |
| 35 | Truy hồi lai vector/từ khóa, khử dấu, rerank (§4.3) | Có sẵn | `internal/application/service/knowledgebase_search*.go`; `internal/textfold/`; `internal/agent/tools/knowledge_search.go`: tìm kiếm/rerank; các retriever Milvus/Postgres/OpenSearch. | Có các đường truy hồi; hiệu quả tùy engine, chỉ mục và mô hình rerank đã bật. |
| 36 | Bộ lọc pháp lý thực thi trước kho vector (§3.4.2; §4.3) | Có sẵn | `internal/application/service/legal_search_filter.go`: `applyLegalSearchFilter`, `matchLegalCandidates`; `repository/knowledge_legal_filter.go`: `ListLegalCandidates`. | Khi request có `LegalFilter`, giải thành danh sách knowledge ID rồi giao retriever; rỗng trả rỗng. Đây là năng lực có điều kiện theo tham số. |
| 37 | Mọi câu hỏi pháp lý tự lọc hiệu lực, không bao giờ đưa luật hết hiệu lực như hiện hành (§3.4.2; §4.3; §10.1) | Một phần | `legal_search_filter.go`: bỏ qua nếu filter zero; `sbv_source_guard.go`: `injectLegalEvidence` không truyền `LegalFilter`; `internal/agent/tools/knowledge_search.go`: tìm kiếm theo SearchTargets. | Có lọc khi người gọi yêu cầu và có tool/metadata hiệu lực; chưa cưỡng chế filter hiệu lực trên mọi lượt agent. Chỉ nói có công cụ kiểm hiệu lực và lọc rõ ràng theo truy vấn. |
| 38 | Cảnh báo nổi bật khi thiếu văn bản thay thế/sửa đổi/bãi bỏ (§4.3; §12) | Một phần | `internal/legal/evidence_warnings.go`: `EvidenceWarnings`; `service/sbv_evidence_warnings.go`; `frontend/src/sbv/chat/EvidenceWarningBanner.vue`. | Có cảnh báo trạng thái không rõ, đồ thị không truy cập được và quan hệ đã biết nhưng chưa xác minh; đồ thị đọc được mà không có cạnh không tự chứng minh thiếu/đủ kho. Chỉ nói cảnh báo các giới hạn bằng chứng hệ thống nhận diện được. |
| 39 | Hiểu diễn đạt lại ≥90%, dẫn nguồn đúng theo Điều/Khoản (§4.3; §10.1) | Không kiểm được | `cmd/sbveval/qa_score.go`; `docs/sbv/eval/qa-cases.sample.yaml`. | Có cách chấm và mẫu câu hỏi; không có số đo nghiệm thu trên hồ sơ khách hàng trong lần đối chiếu này. |
| 40 | Bóc danh mục từ bảng đề cương và các Điều, không gọi LLM (§4.4) | Có sẵn | `internal/compliance/table.go`: `ParseTable`, `FilterRows`; `articles.go`: parser Điều; `handler/compliance.go`: `ExtractDecuongItems`, `ExtractVanBanItems`. | Bóc xác định; nguồn bảng HTML/Markdown hoặc văn bản có cấu trúc. Bảng Excel sau parse không thành bảng phù hợp có thể bị `ErrNoTable`; không phải mọi nguồn đều bóc được. |
| 41 | Bóc danh mục không giới hạn số dòng (§4.4) | Có sẵn | `internal/handler/compliance.go`: `extractItems` trả tổng và `TooManyRows`; `internal/compliance/compliance.go`: `MaxRows` chỉ dùng trần audit. | Không cắt ở trần audit 200 khi bóc danh mục, nhưng vẫn có timeout bóc 1 phút và giới hạn tài nguyên; “không giới hạn” chỉ hiểu là không áp trần 200 ở bước này. |
| 42 | Mỗi tài liệu đích được tìm kiếm và chấm riêng (§3.4.3; §4.4) | Có sẵn | `internal/application/service/compliance_table.go`: `RunTableAudit`; `compliance_articles.go`: `RunArticleAudit`; `handler/compliance.go`: `runAudit`, yêu cầu `target_ids`. | Có vòng xử lý theo tiêu chí × tài liệu, giới hạn đồng thời 5. Cùng KB theo guard hiện hành. |
| 43 | Bằng chứng sao chép từ truy hồi, không để LLM tự viết (§3.4.3; §4.4) | Có sẵn | `internal/application/service/compliance.go`: `ComplianceEvidence`, `evidenceFromHit`; `compliance_assess.go`: chọn chỉ số excerpt và lấy từ pool. | Mã sao chép nội dung từ hit; snippet trả về bị cắt tối đa 500 ký tự, prompt hit tối đa 2.500 ký tự. Nguyên văn đoạn con không có nghĩa toàn văn Điều. |
| 44 | Mỗi dòng luôn có đủ nguyên văn yêu cầu, vi phạm và vị trí gốc (§1.2; §4.4) | Một phần | `internal/application/service/compliance.go`: `ComplianceEvidence` có chunk ID, page khi biết; `compliance_assess.go`: có thể không có evidence; `handler/compliance.go`: hàng yêu cầu do client gửi. | Có excerpt nguồn và hit khi tìm được; thiếu nguồn/page hoặc yêu cầu sửa tay không có chứng cứ trang gốc tương ứng. Chỉ nói trả các trích đoạn tìm được và đánh dấu phần thiếu, không hứa đủ cặp trích dẫn cho mọi dòng. |
| 45 | Ba trạng thái đề xuất và mức tin cậy/ưu tiên rà soát (§4.4; §10.1) | Có sẵn | `internal/application/service/compliance_assess.go`: `AssessMet`, `AssessNotMet`, `AssessInsufficient`, `ComplianceAssessment`, `fromAnswers`. | Phải bật/gọi `assess=true` và có decision backend phù hợp; endpoint mention-check cơ bản chỉ trả mentioned/not_mentioned/error. Confidence là của bộ quyết định, không phải xác suất sai phạm đúng thực tế. |
| 46 | Lỗi xử lý tách khỏi không nhắc tới/thiếu căn cứ (§4.4) | Có sẵn | `internal/application/service/compliance.go`: `ComplianceStatusError`; `compliance_assess.go`: `AssessUnavailable`; `compliance_table.go`, `compliance_articles.go`. | Có trạng thái lỗi theo cặp tiêu chí–tài liệu, không gộp với not_mentioned. Cần xem trạng thái thay vì chỉ đếm dòng không có hit. |
| 47 | Không có trích đoạn thì không đề xuất đáp ứng/vi phạm (§4.4) | Có sẵn | `internal/application/service/compliance_assess.go`: pool rỗng trả insufficient, `fromAnswers` hạ xuống insufficient nếu verdict chắc chắn mà evidence nil. | Có cổng tồn tại excerpt; chưa kiểm chứng tự động excerpt có thật sự chứng minh vi phạm hay không. |
| 48 | Cán bộ xác nhận/điều chỉnh kết luận, lưu lý do/người/thời gian (§4.4; §4.11; §10.1) | Có sẵn | `internal/documentreview/decisions.go`: `Decision`, `AddDecision`, `ListDecisions`; `frontend/src/kp-ui/document-review/ReviewResults.vue`. | Có quyết định nối thêm với đề xuất gốc và lý do đổi. Case thuộc người dùng; không tự suy thành quy trình ký duyệt kết luận cấp đoàn/cấp cơ quan. |
| 49 | Đối chiếu số tiền/tỷ lệ/số lượng và tổng–chi tiết bằng quy tắc (§4.4; §10.1) | Có sẵn | `internal/itevidence/figures.go`: `ExtractFigures`, `ExtractFiguresCSV`, `CheckFigures`, `comparePair`, `compareTotal`; `handler/compliance_itevidence.go`: `reportFigures`. | Thực hiện trên bảng và mẫu nhãn/đơn vị nhận diện được; không phải bộ suy luận số liệu tùy ý trong mọi văn bản. |
| 50 | Kiểm tra trình tự ngày bằng quy tắc, có hai đoạn nguồn (§4.4; §10.1) | Có sẵn | `internal/compliance/timeline.go`: `LoadTimeline`, `DocDate`, `CheckTimeline`; `internal/handler/compliance_timeline.go`. | Có vai trò tài liệu và quan hệ before/after cấu hình. Thiếu ngày trả chưa đủ căn cứ; nhận dạng ngày theo heuristic, không bao phủ mọi logic thời gian nghiệp vụ. |
| 51 | Đối chiếu báo cáo với biên bản phỏng vấn (§4.4) | Có sẵn | `internal/itevidence/interview.go`: `ParseInterview`, `parseInterviewEvidence`, `crossInterview`; `checks.go`: `CrossCheck`. | Có đọc lượt hỏi/đáp và so các thực hành/tần suất đã mã hóa; không phải hiểu mọi phát biểu/phỏng vấn tùy ý. |
| 52 | Tự điền bảng đánh giá hồ sơ từ kết quả (§4.4; §4.8) | Có sẵn | `internal/sbvexport/export.go`: `Row`, `WriteCSV`, `WriteXLSX`; `docx.go`: `WriteDOCX`; `frontend/src/kp-ui/document-review/ReviewResults.vue`. | Có kết xuất các cột đánh giá/căn cứ/kết luận theo mẫu hiện tại. Mẫu riêng của đơn vị phải tuân thủ hợp đồng placeholder. |
| 53 | Bộ tiêu chí cấu trúc, phiên bản, tái sử dụng, khóa bản công bố (§4.4; §10.1) | Có sẵn | `internal/criteria/criteria.go`: `Criterion`, `BasisRef`, `Validate`, `Rows`; `handler.go`: `Create`, `Update`, `Publish`. | Có mã tiêu chí, căn cứ, bằng chứng, phương pháp và technical check; tối đa 200 tiêu chí/bộ. Không có trường nhóm riêng như ví dụ báo cáo, có thể thể hiện qua mã/tên. |
| 54 | Bộ tiêu chí tự cập nhật khi căn cứ đổi hiệu lực (§4.4) | Chưa có | `internal/criteria/handler.go` chỉ có CRUD/version/publish/rows; không thấy subscriber/job cập nhật criteria từ thay đổi hiệu lực trong `internal/criteria/`, `legal_effectiveness_job.go`. | Hiện cần người rà soát, tạo bản tiêu chí mới rồi công bố; chưa có tự động cập nhật bộ tiêu chí theo đồ thị hiệu lực. |
| 55 | Mỗi tiêu chí đối chiếu đồng thời hồ sơ, bằng chứng và căn cứ (§4.4) | Một phần | `internal/handler/compliance.go`: `audit`, `CheckLegalBasis`, `evidence_ids`; `compliance_assess.go`: kết hợp technical verdict; `criteria.go`: `TechnicalCheck`. | Có ghép căn cứ, báo cáo và bằng chứng kỹ thuật theo check đã khai báo; phụ thuộc cờ và định dạng, không phải mọi tiêu chí tự hiểu mọi loại bằng chứng. Chỉ nói hỗ trợ ghép ba nguồn cho check/cấu hình được hỗ trợ. |
| 56 | Lưu case, nhiều lượt chạy và kết luận cán bộ (§4.4) | Có sẵn | `internal/documentreview/handler.go`: `Case`, `Create`, `Update`; `decisions.go`; `frontend/src/views/kp/KpDocumentReview.vue`: state checks/runs và lưu case. | Có payload case lưu nhiều run trên giao diện, revision chống ghi đè đồng thời; bật `WEKNORA_DOCUMENT_REVIEW_ENABLED`. |
| 57 | Hồ sơ đối chiếu có phiên bản bất biến, truy lại đúng nguồn sau nhiều năm (§4.4) | Một phần | `internal/documentreview/handler.go`: `Update` ghi đè Payload và tăng Revision; `decisions.go`: append kết luận; `compliance.go`: dẫn ID chunk/page hiện có. | Có lịch sử run trong state và log kết luận; chưa có lịch sử mọi bản Payload bất biến hay snapshot nguyên bản mọi evidence/prompt. Chỉ cam kết lưu case hiện tại/các run còn trong state và quyết định đã ghi, phụ thuộc giữ tài liệu và sao lưu. |
| 58 | Chạy đối chiếu lớn bằng công việc nền (§5.7) | Chưa có | `internal/handler/compliance.go`: `audit` chạy trong request context với 30 phút; `internal/router/routes_legal.go`: chỉ endpoint audit đồng bộ; không thấy loại task/worker đối chiếu nền. | Hiện chia yêu cầu thành nhiều lượt đồng bộ trong trần 200 dòng; chưa có audit job nền với tiếp tục/retry/progress như tuyên bố. |
| 59 | 100 tiêu chí × 40 tài liệu hoàn thành trong 60 phút (§5.7) | Không kiểm được | `internal/handler/compliance.go`: hàng × tài liệu; `service/compliance.go`: concurrency 5; chưa có kết quả đo cho quy mô này. | Không thể xác nhận thời gian từ mã; đường công việc nền được hứa riêng chưa có ở dòng trước. |
| 60 | Đọc mọi cấu hình router/switch/firewall/server/database thành khối có thiết bị/tệp/dòng (§4.5) | Một phần | `internal/itevidence/parse.go`: `Detect`, `parseConfig`, `configLine`, tập regex cấu hình và hostname; `checks.go`: các kiểm tra xác định. | Có một số mẫu Cisco/FortiOS/sshd và cấu hình hệ thống, trích dòng/host; chưa có parser mọi hãng/DB hay mô hình khối cấu hình tổng quát. Chỉ chốt danh mục định dạng thực sự hỗ trợ theo regex hiện có. |
| 61 | Chuẩn hóa mọi nhật ký, lọc thời gian/loại sự kiện trước LLM (§4.5) | Một phần | `internal/itevidence/parse.go`: `parseSyslog`, `logStamp`; `checks.go`: `checkLogRetention`; `handler/compliance_itevidence.go`: `ITEvidenceRequest`. | Có syslog/ISO timestamp, login fail/config change và khoảng đầu–cuối; request chưa có bộ lọc time-range/event như báo cáo. Chỉ nói phân tích các sự kiện/mẫu log đã hỗ trợ. |
| 62 | Đọc PDF/CSV/XML mọi công cụ quét, kiểm trạng thái và hạn khắc phục (§4.5) | Một phần | `internal/itevidence/parse.go`: `parseNessus`, `parseScanCSV`; `checks.go`: `checkVulns`. | Có Nessus XML và CSV theo cột được nhận diện, phát hiện high/critical đang mở; chưa có parser chuyên biệt PDF mọi công cụ hoặc quy tắc hạn khắc phục đầy đủ. PDF chỉ qua pipeline văn bản chung. |
| 63 | Đọc Excel/CSV thành danh mục tài sản đầy đủ, đối chiếu chéo mọi tài sản (§4.5) | Một phần | `internal/itevidence/parse.go`: `parseInventory` đọc CSV; `checks.go`: `checkEOL`, `CrossCheck`; parser Excel chung tách văn bản. | Có CSV tài sản, phát hiện một số OS hết hỗ trợ và so số lượng; chưa có bộ nối XLSX nguyên bản vào parser kỹ thuật hay phép nối tổng quát tài sản giữa log/scan/inventory. Chỉ nói hỗ trợ CSV/schema và check đã có. |
| 64 | Ảnh chụp màn hình được VLM đọc ngữ cảnh, có nguồn ảnh (§4.5) | Có sẵn | `internal/application/service/knowledge_process.go`: xử lý image caption/OCR; `internal/models/vlm/`; `docreader/parser/image_parser.py`; `internal/types/faq.go`: metadata ảnh. | Có mô tả ảnh/nhận chữ và liên kết nguồn theo pipeline đa phương thức khi bật VLM. Việc endpoint nội bộ/độ đúng từng màn hình cần kiểm ở triển khai. |
| 65 | Hồ sơ kỹ thuật khác được đọc như văn bản, trích thuộc tính theo mẫu (§4.5) | Có sẵn | `docreader/parser/registry.py`; `internal/kie/kie.go`: `Extract`; `internal/application/service/doc_kie.go`. | Có đọc và KIE theo mẫu. Sơ đồ mạng dạng ảnh cần VLM; không có bộ kiểm chứng đồ thị mạng khớp danh mục một cách tổng quát. |
| 66 | Đối chiếu chéo báo cáo với bằng chứng kỹ thuật, kèm nguồn (§4.5) | Có sẵn | `internal/itevidence/checks.go`: `ExtractClaims`, `CrossCheck`; `internal/application/service/compliance_assess.go`: ghép technical verdict; `handler/compliance_itevidence.go`. | Có so các claim/check được mã hóa, không phải mọi khẳng định tự do trong báo cáo. Có trường xung đột và trích dòng bằng chứng. |
| 67 | Giữ tệp gốc và mã băm khi nạp (§4.5) | Có sẵn | `internal/dms/versions.go`: SHA-256 lúc upload; `dms/model.go`: `Version.SHA256`; `dms/recovery.go`: kiểm lại hash; `knowledge_create.go`: `FileHash`. | DMS có version và SHA-256; hash hỗ trợ phát hiện thay đổi, không tự biến kho tệp thành WORM hay bảo đảm dữ liệu tồn tại nhiều năm. |
| 68 | Bảo vệ bằng chứng kỹ thuật theo phạm vi nhiệm vụ (§4.5) | Có sẵn | `internal/handler/compliance_itevidence.go`: `loadITEvidence` kiểm KnowledgeBaseID và dùng `GetKnowledgeFile`; `internal/dms/workflow.go`: scope theo tenant/owner/checker. | Có kiểm quyền/phạm vi dữ liệu. Mã hóa toàn bộ nội dung kỹ thuật khi lưu và truyền thuộc phần hạ tầng, xem nhóm bảo mật. |
| 69 | Trích dẫn đúng thiết bị/tệp/dòng/ảnh ≥95% (§4.5) | Không kiểm được | `internal/itevidence/parse.go`: `Fact.Host`, `Line`, `Text`; metadata ảnh của pipeline VLM. | Có trường vị trí; chưa có bộ kết quả đo chứng minh ≥95% trên định dạng của đơn vị. |
| 70 | Bốn trạng thái hiệu lực, tính lại khi đọc/truy vấn (§1.2; §3.4.4; §4.6; §10.1; §12) | Có sẵn | `internal/legal/effectiveness.go`: `InferStatus`; `chronology.go`: `FoldSupersession`; `internal/application/service/legal_effectiveness_read.go`: phủ trạng thái khi đọc; `legal_search_filter.go`. | Có hiệu lực/chưa hiệu lực/hết hiệu lực/không xác định dựa ngày và quan hệ đã biết; không khẳng định kho đầy đủ hoặc LLM luôn diễn đạt đúng kết quả. |
| 71 | Năm quan hệ pháp lý, hướng thuận/ngược tách rõ (§4.6; §10.1; §12) | Có sẵn | `internal/legal/graph.go`: `Canonicalize`, `ProjectLegalGraph`; `chronology.go`: `RelationFields`, `RelationMetadata`; `repository/legalgraph/age.go`. | Một cạnh thuận là nguồn sự thật; chiều ngược được suy ra khi đọc, không lưu hai bản độc lập. `THAY_THE`, `BAI_BO`, `SUA_DOI`, `CAN_CU`, `HUONG_DAN` có mã. |
| 72 | Thay thế/bãi bỏ làm văn bản đích hết hiệu lực theo ngày nguồn (§1.2; §3.4.4; §4.6) | Có sẵn | `internal/legal/graph.go`: `ProjectLegalGraph`; `internal/legal/chronology.go`: `SupersessionEdge.Verdict`; `repository/legalgraph/effectiveness.go`; `service/legal_effectiveness_read.go`. | Có xét hướng, thứ tự ban hành và ngày hiệu lực nguồn; nguồn tương lai chưa làm đích hết hiệu lực. Cần AGE và dữ liệu quan hệ hợp lệ; không đồng nghĩa sửa metadata gốc của mọi văn bản. |
| 73 | Tự lan truyền cả sửa đổi thành tình trạng/nội dung pháp lý đã hợp nhất (§1.2; §4.6) | Một phần | `internal/legal/graph.go`: `IsSuperseding` chỉ nhận THAY_THE/BAI_BO; SUA_DOI có cạnh nhưng không làm hết hiệu lực; `legal_kie_hook.go`: chiếu quan hệ. | Có đồ thị sửa đổi để tra cứu, chưa có hợp nhất nội dung Điều/Khoản bị sửa hoặc bộ suy luận hiệu lực từng phần. Chỉ nói theo dõi quan hệ sửa đổi; cán bộ phải đọc điều khoản liên quan. |
| 74 | Loại ngày hiệu lực do LLM bịa, không có trong nguồn (§4.6) | Có sẵn | `internal/kie/kie.go`: `grounded`, kiểm nguồn cho ngày; `internal/legal/kie_plugin.go`: `legalPostExtract`. | Có đối chiếu giá trị ngày với đoạn đầu vào và chuẩn hóa; không kiểm chứng được bản scan gốc có đọc nhầm thành một ngày hợp lệ khác hay không. |
| 75 | Chặn quan hệ ngược thời gian, lưu cảnh báo cho người kiểm (§4.6; §12) | Có sẵn | `internal/legal/chronology.go`: `checkChronology`, `SupersessionEdge.Verdict`; `graph.go`: `ProjectLegalGraph`; `service/legal_kie_hook.go`: `writeLegalRelationWarnings`. | Quan hệ ngược bị từ chối; thiếu bằng chứng thứ tự có trạng thái/cảnh báo không chắc. Có test quan hệ và thứ tự, không phải biên bản chạy lại POC. |
| 76 | Tác vụ rà soát hiệu lực hằng ngày (§4.6; §12) | Có sẵn | `internal/application/service/legal_effectiveness_job.go`: `NewLegalEffectivenessRunner`, `Run`; `internal/container/legal_effectiveness.go`: `startLegalEffectiveness`. | Có cron, nhưng mặc định tắt nếu `LEGAL_EFFECTIVENESS_RECOMPUTE_CRON` rỗng. Chỉ xác nhận có khả năng bật lịch chạy, chưa xác nhận triển khai đã bật. |
| 77 | Cảnh báo văn bản sắp có/sắp hết hiệu lực (§4.6) | Chưa có | `internal/application/service/legal_effectiveness_job.go`: `Run` chỉ cập nhật status/log khi thay đổi; không tìm thấy hàng đợi thông báo hay cảnh báo trước mốc ngày trong các module pháp lý/frontend đã đọc. | Hiện có tính/cập nhật trạng thái; chưa có thông báo chủ động trước ngày hiệu lực/hết hiệu lực. |
| 78 | Làm nổi bật trường pháp lý quan trọng cho Checker và kèm đoạn nguồn (§4.6) | Một phần | `frontend/src/utils/legalCheckerHighlight.ts`; `frontend/src/components/legal-metadata.vue`; `internal/types/knowledge_fields.go`: giá trị/verified/uncertain. | Có nhấn mạnh trường quan trọng và cảnh báo quan hệ; chưa có provenance đoạn nguồn chính xác cho từng trường trích xuất để luôn hiển thị cạnh nó. Chỉ nói hỗ trợ ưu tiên rà soát trường và mở tài liệu nguồn. |
| 79 | Sau xác nhận, chỉ mục và quan hệ cập nhật ≤1 giờ, mọi câu trả lời dùng trạng thái mới (§4.6) | Không kiểm được | `internal/application/service/dms_publication.go`: enqueue; `knowledge_process.go`, `legal_kie_hook.go`: hậu xử lý/chiếu đồ thị, có đường best-effort. | Độ trễ cần đo gồm hàng đợi, OCR, mô hình, AGE và lỗi retry. Không có SLA cưỡng chế một giờ hoặc bằng chứng mọi phiên/cache đã được làm mới. |
| 80 | Căn cứ/Hướng dẫn tự xác định Điều/Khoản và phân ba mức liên quan (§4.6) | Một phần | `internal/criteria/criteria.go`: `BasisRef.Clause`, `Relation` hỗ trợ nhập trực tiếp/viện dẫn; `internal/compliance/basis.go`; `internal/legal/graph.go`: cạnh cấp văn bản. | Có nhập căn cứ tới Điều/Khoản và hai loại quan hệ tiêu chí; chưa thấy tự trích/định hạng ba mức cho mọi cạnh CAN_CU/HUONG_DAN. Chỉ nói có biểu diễn căn cứ do người cấu hình và đồ thị cấp văn bản. |
| 81 | Tự thu hồi vector văn bản hết hiệu lực và chuyển gốc/hồ sơ sang lưu trữ dài hạn (§4.6) | Chưa có | Không tìm thấy job lưu trữ vòng đời pháp lý trong `internal/legal/`, `service/legal_effectiveness*`, `repository/legalgraph/`; job hiệu lực không xóa vector/chuyển kho. | Hiện văn bản có thể mang nhãn hết hiệu lực và tiếp tục được tra cứu theo bộ lọc; chưa có quy trình tự động archive/thu hồi tài nguyên theo tuổi hết hiệu lực. |
| 82 | Trích số hiệu, loại, ngày, cơ quan, người ký, lĩnh vực và mảng quan hệ (§1.2; §4.7) | Có sẵn | `internal/kie/kie.go`: `Extract`; `internal/legal/kie.go`, `kie_plugin.go`; `internal/application/service/doc_kie.go`: `runDocumentKIE`; `config/kie_presets.yaml`. | Có mẫu pháp lý và pipeline KIE; độ đúng từng trường và đầy đủ kho quan hệ phải đo trên dữ liệu thật. |
| 83 | Ưu tiên trường verified khi truy hồi, thống nhất tuyệt đối QA và đối chiếu (§4.7; §12) | Một phần | `internal/types/knowledge_fields.go`: `KnowledgeField`, `VerifiedFieldInstruction`; `internal/agent/tools/knowledge_search.go`: metadata; `compliance_assess.go`: state chứa yêu cầu/căn cứ/excerpts. | QA nhận trường verified và chỉ dẫn ưu tiên; bộ phán quyết đối chiếu không có cơ chế ưu tiên mọi trường verified tương đương. Chỉ nói thuộc tính được bảo vệ khi trích lại và cung cấp cho các đường đã tích hợp; không bảo đảm hai luồng luôn kết luận giống nhau. |
| 84 | Sửa ngày/quan hệ tự chiếu lại đồ thị (§4.7) | Có sẵn | `internal/application/service/legal_kie_hook.go`: `ReprojectLegalGraph`, `projectLegalGraph`; `internal/handler/kie.go`: `UpdateKnowledgeFields`. | Có gọi chiếu lại từ metadata đã sửa. Ghi đồ thị là best-effort, lỗi cần kiểm log/rà soát; không phải giao dịch nguyên tử với mọi kho chỉ mục. |
| 85 | Thêm loại trích xuất bằng cấu hình, mẫu tín dụng/hợp đồng/chứng từ, báo thiếu bắt buộc (§4.7) | Có sẵn | `internal/kie/preset.go`: `LoadPresets`, `Validate`; `kie.go`: `Extract`; `service/doc_kie.go`: `KIEPresetsForConfig`, `ApplyKIEMetadata`; `types/knowledge_fields.go`: `KIEMissingKey`. | Có schema cấu hình và cờ missing/uncertain; quy tắc trích xuất mới đặc thù có thể cần plugin mã. ≥90% mỗi trường là mục tiêu cần đo. |
| 86 | Tóm tắt tài liệu dài bằng map–reduce, giữ mọi ý/rủi ro/trích dẫn (§4.8) | Một phần | `internal/application/service/knowledge_process.go`: `getSummary`, `sampleLongContent` lấy đầu 60%, cuối 20%, giữa 20% rồi gọi model; `wiki_ingest_batch.go`: Map/Reduce phục vụ wiki. | Có tóm tắt tài liệu và tổng hợp wiki, nhưng tóm tắt tài liệu dài hiện lấy mẫu, không map–reduce bao phủ toàn văn; chưa bảo đảm đủ ý và trích dẫn. Chỉ nói hỗ trợ tóm tắt trong ngân sách đầu vào, cần rà soát phần bị lược. |
| 87 | Tổng hợp nhiều tài liệu/nhiều nhiệm vụ theo quyền (§4.8) | Một phần | `internal/application/service/session_knowledge_qa.go`: `resolveKnowledgeBasesFromAgent`, `buildSearchTargets`; `wiki_ingest_batch.go`: tổng hợp tài liệu theo KB. | Có truy hồi/tổng hợp nhiều tài liệu và kho được chia sẻ, chưa có mô hình “nhiệm vụ” cùng báo cáo hợp nhất liên nhiệm vụ như mô tả. Chỉ nói tổng hợp trong phạm vi KB/tenant/chia sẻ được cấp quyền. |
| 88 | Sinh dự thảo báo cáo đủ mô tả, căn cứ, kết luận, kiến nghị (§4.8) | Có sẵn | `internal/compliance/report.go`: `BuildReport`, `Finalize`, `GroundBasis`, `MissingParts`; `internal/handler/compliance_report.go`: `auditReport`. | Sinh xác định từ kết quả audit, không phải LLM tự viết báo cáo tùy ý; phần thiếu được ghi “Chưa đủ căn cứ”, không tự bổ sung căn cứ ngoài đầu vào. |
| 89 | Điền Word mẫu của đơn vị bằng placeholder (§4.8) | Có sẵn | `internal/sbvexport/docx.go`: `LoadTemplate`, `WriteDOCX`, `TemplateEnv`; `internal/sbvexport/handler.go`: `Export`. | Có mẫu tích hợp và `WEKNORA_SBV_DOCX_TEMPLATE`; placeholder phải nằm trong một XML run, có giới hạn bảng lồng. Không phải mọi tệp Word mẫu đều dùng được ngay. |
| 90 | Thể thức báo cáo đáp ứng tuyệt đối Nghị định 30 và quy chuẩn riêng (§4.8; §10.1) | Một phần | `internal/sbvexport/template/word/` có thiết lập trang/font/header; `nd30_test.go` có test A4/lề/font/quốc hiệu; `docs/sbv/the-thuc-nd30.md` nêu giới hạn. | Có mẫu và kiểm tra một số tiêu chí thể thức, chưa chứng minh mọi loại văn bản và mẫu riêng đều hợp chuẩn. Chỉ nói mẫu mặc định có các thiết lập đã mã hóa, cần cơ quan duyệt mẫu cuối. |
| 91 | Tự rà soát chính tả/ngữ pháp trước xuất bản (§4.8) | Chưa có | Không tìm thấy bộ soát chính tả/ngữ pháp hoặc bước bắt buộc tương ứng trong `internal/compliance/report.go`, `internal/sbvexport/`, handler xuất báo cáo. | Hiện cán bộ tự biên tập và rà soát nội dung trước phát hành; chưa có chức năng soát lỗi ngôn ngữ tự động bắt buộc. |
| 92 | Xuất kết quả CSV, Excel, Word (§1.2; §4.8; §4.11) | Có sẵn | `internal/sbvexport/export.go`: `WriteCSV`, `WriteXLSX`; `docx.go`: `WriteDOCX`; `handler.go`: `Export`; `router/router.go`: `/document-review/export`. | Có endpoint và giao diện kết quả; giới hạn request export 8 MB, cần bật document review. CSV có BOM tiếng Việt; mẫu có cột căn cứ/kết luận cán bộ. |
| 93 | Đo định kỳ chất lượng truy hồi và câu trả lời, so đường cơ sở (§4.8) | Một phần | `internal/application/service/evaluation.go`; `cmd/sbveval/qa.go`, `qa_score.go`, `load.go`, `ocr.go`; `docs/sbv/eval/README.md`. | Có công cụ chạy/chấm và xuất kết quả; chưa thấy lịch định kỳ tự động cùng quản lý baseline bắt buộc cho mọi thay đổi. Chỉ nói có thể chủ động chạy bộ đo và so kết quả. |
| 94 | Tìm kiếm ngữ nghĩa/bảng lệnh nhanh, breadcrumb, bộ lọc pháp lý từng truy vấn (§4.9) | Có sẵn | `frontend/src/components/GlobalCommandPalette/useSearch.ts`: metadata hierarchy, `legal_filter`; `internal/application/service/legal_search_filter.go`. | Bộ lọc hiệu lực trong bảng lệnh nhanh chỉ áp dụng khi có scope một KB; không đồng nghĩa mọi tìm kiếm xuyên kho đều tự lọc pháp lý. |
| 95 | Đồ thị trực quan quan hệ văn bản và đồ thị thực thể (§4.9) | Có sẵn | `internal/handler/legal_graph.go`: `ListLegalGraph`, `GetLegalGraphFull`, `GetLegalGraphRelated`; `service/graph.go`: `BuildGraph`; `frontend/src/views/legal-graph/LegalGraph.vue`. | Hai dữ liệu/luồng khác nhau; cần AGE/backend đồ thị và bật trích thực thể tương ứng. |
| 96 | Wiki biên tập, thư mục, revision, issue; quyền sửa hẹp hơn quyền đọc (§4.9) | Có sẵn | `internal/application/service/wiki_page.go`: `CreatePage`, `UpdatePage`, `ListRevisions`, `GetRevision`, `CreateIssue`; `internal/router/rbac.go`: `OwnedWikiKBOrAdmin`; giao diện `views/knowledge/wiki/`. | Có lịch sử revision nhưng có `pruneRevisions`, không được gọi lưu vĩnh viễn mọi bản. Quyền đọc/sửa được kiểm theo tuyến/KB. |
| 97 | Chia sẻ có bản ghi, thu hồi và kiểm toán (§4.9) | Có sẵn | `internal/application/service/kbshare.go`: `CreateShare`, `UpdateSharePermission`, `RemoveShare`, `CheckTenantKBPermission`; `resource.go`: resource/grant; middleware audit. | Có chia sẻ KB/tài nguyên theo cơ chế đã triển khai. Phải phân biệt thu hồi bản ghi chia sẻ với hiệu lực một URL HMAC đã phát trước đó. |
| 98 | Mọi tệp chỉ có URL ký ngắn hạn, danh sách đích cho phép, không có truy cập công khai trực tiếp (§4.9; §7.2) | Một phần | `internal/router/files.go`: `servePresignedFiles`, `presignedFileHandler`; `internal/utils/presign.go`: `SignFileURL`, TTL mặc định 2 giờ; `internal/storageurl/`. | Có URL ký và resource grant, đồng thời URL presigned là truy cập không cần phiên đăng nhập khi còn chữ ký/hạn. Không thấy thu hồi từng URL HMAC hay allowlist đích người nhận trên đường này. Chỉ nói cấp URL có hạn và bảo vệ các đường tải theo cơ chế cụ thể. |
| 99 | Đóng nhiệm vụ, chọn Private → Public để công bố tri thức dùng lại (§4.9; §4.11) | Chưa có | Không tìm thấy trạng thái đóng nhiệm vụ và chuyển visibility Private/Public trong `internal/`, frontend tương ứng. DMS publication ở `dms/workflow.go` là đưa bản gốc đã duyệt vào KB chính thức, không phải công bố khi đóng nhiệm vụ. | Hiện có chia sẻ KB và công bố tài liệu DMS theo workflow; chưa có luồng kết thúc nhiệm vụ/công bố tri thức như báo cáo. |
| 100 | REST API cho các chức năng giao diện (§4.10) | Có sẵn | `internal/router/router.go`, `routes_legal.go`, `routes_auth_tenant.go` và các handler; `frontend/src/api/` gọi các tuyến tương ứng. | Có API thực, gồm cấu hình, KB, tài liệu, QA, đối chiếu. Không diễn giải “đầy đủ” thành mọi chức năng đều có hợp đồng ổn định hay SDK tương ứng. |
| 101 | MCP server gọi năng lực với cùng danh tính/quyền người gọi (§4.10) | Một phần | `mcp-server/weknora_mcp_server.py`: `WeKnoraClient`, HTTP token middleware; client toàn cục lấy `WEKNORA_API_KEY` và gửi `X-API-Key`. | Có MCP và backend vẫn kiểm quyền khóa API; không tự chuyển danh tính OIDC của từng người gọi sang backend, phạm vi theo khóa dịch vụ được cấu hình. Chỉ nói MCP hoạt động trong quyền API key của server. |
| 102 | SDK Go và CLI cho kho/tài liệu/đoạn/tìm kiếm/QA (§4.10) | Có sẵn | `client/client.go`, `knowledgebase.go`, `knowledge.go`, `chunk.go`, `session.go`; `cli/cmd/`. | Có mã SDK/CLI thực; không chứng minh bao phủ mọi tính năng tùy biến SBV hay mọi tuyến frontend. |
| 103 | Thêm provider/search/storage/parser/chunker/KIE/channel/datasource/tool bằng cấu hình hoặc mô-đun (§4.10) | Có sẵn | `internal/models/provider/`, `application/repository/retriever/`; `docreader/parser/registry.py`; `internal/infrastructure/chunker/strategy.go`; `internal/kie/preset.go`; `internal/datasource/connector/`, `internal/agent/tools/`. | Có interface/registry/mô-đun mở rộng. Không phải đổi mọi provider hoặc định dạng chỉ sửa cấu hình; một số cần viết adapter, build và kiểm thử. |
| 104 | Cán bộ nạp/sửa thuộc tính/QA/đối chiếu/xuất kết quả (§4.11) | Có sẵn | Các handler knowledge/KIE/session/compliance/export; `internal/router/rbac.go`, `routes_legal.go`; `frontend/src/views/kp/`. | Các thao tác có mã và phân quyền; khả năng sử dụng thực tế phụ thuộc vai trò, feature flag và mô hình đã cấu hình. |
| 105 | Trưởng nhóm duyệt, xác nhận OCR và xem báo cáo tin cậy toàn diện (§4.11) | Một phần | `internal/dms/versions.go`, `knowledge_review.go`: duyệt; `compliance_assess.go`: confidence/priority; `frontend/src/kp-ui/document-review/ReviewResults.vue`. | Có duyệt tài liệu và xem tin cậy đề xuất; chưa có cổng xác nhận OCR chung và báo cáo chất lượng toàn diện cho trưởng nhóm. Chỉ nói rà soát các chỉ số/cờ và quy trình duyệt đang có. |
| 106 | Quản trị nghiệp vụ cấu hình KB/KIE/prompt/thành viên/chia sẻ/công bố (§4.11) | Một phần | `internal/router/rbac.go`, `routes_legal.go`; `frontend/src/views/settings/`, editor agent; `kbshare.go`. | Có các chức năng cấu hình KB/KIE/agent/thành viên/chia sẻ theo quyền; chưa có công bố Private/Public khi đóng nhiệm vụ và thư viện prompt có version như hứa. Chỉ mô tả từng cấu hình đã có. |
| 107 | Bảng lãnh đạo về tiến độ/kết quả kiểm tra, tuân thủ theo đơn vị (§4.11) | Một phần | `frontend/src/kp-ui/home/dashboardState.ts`: thống kê collection/session; `home/useDashboard.ts`, `KpDashboard.vue`; `views/kp/KpHome.vue`. | Có dashboard tài liệu/hội thoại/hàng đợi theo quyền; chưa thấy báo cáo tuân thủ theo đơn vị hay tiến độ nhiệm vụ nghiệp vụ. Chỉ nói dashboard hoạt động kho và hệ thống. |
| 108 | Quản trị giám sát/hàng đợi/audit, sao lưu/phục hồi/nâng cấp qua giao diện (§4.11) | Một phần | `internal/router/task_inspector.go`: `QueueStats`; frontend settings/audit; `scripts/backup.sh`, `restore.sh`; `internal/airuntime/report.go`. | Có giao diện một số số liệu và script vận hành; chưa có màn hình sao lưu/phục hồi/nâng cấp đầy đủ hoặc số liệu GPU. Chỉ nói vận hành kết hợp giao diện với script/quy trình kỹ thuật. |
| 109 | Quản lý nhiều mô hình, chọn theo từng chức năng (§4.12) | Có sẵn | `internal/handler/model.go`: CRUD/list provider; `internal/types/model.go`; `service/custom_agent.go`; `internal/airuntime/report.go`: roles chat/rerank/embedding/KIE/VLM/ASR/decision. | Có nhiều bản ghi model và chọn model theo KB/agent/chức năng. Chạy vật lý đồng thời hai LLM cần hai endpoint hoặc serving phù hợp. |
| 110 | Chạy ≥2 LLM đồng thời, chuyển mô hình gián đoạn ≤15 phút (§4.12) | Không kiểm được | Cấu hình model nhiều endpoint trong `internal/types/model.go`, `internal/handler/model.go`; không có phép đo chuyển model tại triển khai. | Phụ thuộc tải trọng số, VRAM, serving, rollout và dữ liệu; không suy ra thời gian gián đoạn từ CRUD model. |
| 111 | Hỗ trợ/bàn giao 4-bit, 8-bit kèm số đo so bản gốc (§4.12) | Một phần | `internal/models/provider/`, `internal/models/chat/`: gọi model qua API; compose vLLM chỉ minh chứng cấu hình serving; không thấy gói benchmark bản nén theo dữ liệu đơn vị trong `docs/sbv/`. | Ứng dụng có thể gọi endpoint phục vụ model nén nếu tương thích; chưa có cấu hình/gói số đo bàn giao 4/8-bit cụ thể. Chỉ nói tương thích endpoint, cần xác lập biến thể và đo riêng. |
| 112 | Quy trình cập nhật model offline → eval/an toàn → baseline → chỉ cho dùng nếu không giảm (§4.12) | Một phần | `docs/sbv/eval/README.md`: chạy khi đổi model; công cụ `cmd/sbveval/`; `docs/sbv/kiem-tra-offline.md`: chuẩn bị trọng số offline. | Có hướng dẫn đo và chuẩn bị offline, chưa có quy trình phát hành đầy đủ/điều kiện chặn đổi model tự động cùng baseline gắn version. Chỉ nói phải vận hành kiểm soát đổi model thủ công bằng bộ đo đã có. |
| 113 | Sáu nghiệp vụ có prompt/chức năng xử lý (§4.12) | Có sẵn | `internal/application/service/compliance_table.go`, `compliance_articles.go`; `internal/kie/kie.go`: `BuildPrompt`; `knowledge_process.go`: `getSummary`; prompt agent pháp lý; `internal/compliance/report.go`: `BuildReport`. | Có hiện thực sáu nghiệp vụ; sinh báo cáo bốn phần hiện dùng mẫu xác định, không phải một prompt LLM riêng. Không suy thành thư viện prompt có quản lý phiên bản. |
| 114 | Thư viện prompt có version; mọi đề xuất lưu đúng version prompt/cấu hình (§4.12; §7.3) | Chưa có | `internal/documentreview/decisions.go`: Proposed/Verdict/Reason; `internal/types/decision_criteria.go`; `internal/feedback/feedback.go`: AgentID/ModelID; không có snapshot/version prompt bắt buộc. Version criteria ở `internal/criteria/` là tiêu chí nghiệp vụ. | Hiện prompt ở mã/cấu hình và cấu hình agent có thể thay đổi; chưa có dấu vết version prompt/model/config đầy đủ trên từng đề xuất. |
| 115 | Màn hình mô hình/endpoint/tham số/agent/tool chỉ Super Admin (§4.12; §12) | Có sẵn | `internal/airuntime/handler.go`: `Register`, `Load`; `report.go`: `Build`; `frontend/src/kp-ui/settings/AiRuntime.vue`; kiểm quyền system-admin ở router. | Có thống kê cấu hình toàn deployment, phân loại endpoint nội bộ/ngoài/không rõ. Không bảo đảm tất cả endpoint thực tế nội bộ chỉ vì có màn hình. |
| 116 | Cùng màn hình có phiên đang hoạt động, GPU, hàng đợi (§4.12) | Một phần | `internal/airuntime/report.go`: `Unsupported` ghi rõ `active user sessions`, `GPU resource usage`; `internal/router/task_inspector.go`: hàng đợi ở API riêng. | Có thống kê cấu hình và hàng đợi riêng; chưa có số liệu GPU/phiên đang hoạt động trong AI Runtime. Chỉ hứa các trường API hiện trả. |
| 117 | Mỗi agent có đặc tả bàn giao đầy đủ và Super Admin quản trị (§4.12; §12) | Một phần | `docs/sbv/dac-ta-agent-hoi-dap-phap-ly.md`; `internal/types/builtin_agent_config.go`, `service/custom_agent.go`; đặc tả pháp lý mô tả `guardLegalAgent` đã bị thay bằng `injectLegalEvidence`. | Có đặc tả agent pháp lý nhưng một số mô tả lỗi thời, chưa thấy bộ đặc tả đầy đủ cho mọi agent; sửa agent theo nhiều cấp quyền, không chỉ Super Admin. Chỉ bàn giao đặc tả được kiểm khớp lại với cấu hình và mã hiện hành. |
| 118 | Thích/Không thích/sửa câu trả lời, lưu và lọc dashboard (§4.12) | Có sẵn | `internal/feedback/feedback.go`: `Submit`, `ListSession`, `Summary`, `Load`; `frontend/src/sbv/chat/MessageFeedback.vue`; `kp-ui/settings/FeedbackDashboard.vue`. | Có phản hồi cho assistant message của phiên người dùng sở hữu; đánh giá lại ghi đè bản hiện tại. “Sửa” lưu correction riêng, không sửa lại nội dung message gốc. |
| 119 | 100% phản hồi lưu cùng nguồn/config version và tự đưa vào bộ đo (§4.12) | Một phần | `internal/feedback/feedback.go`: Feedback chỉ lưu message/session/user/rating/correction/agent/model; Load nối question/answer; không thấy nối tự động sang bộ case `sbveval`. | Có lưu phản hồi và đối chiếu câu hỏi/câu trả lời còn trong DB, chưa snapshot nguồn/config version hoặc tự nhập vào eval. Chỉ nói có dashboard để người vận hành chọn phản hồi đưa vào bộ đo. |
| 120 | OCR một tài liệu/lần và tăng khe bằng cấu hình (§5.7) | Có sẵn | `docker-compose.yml`: `WEKNORA_MINERU_MAX_CONCURRENCY` mặc định 1; `internal/infrastructure/docparser/mineru_converter.go`: semaphore, mặc định mã thuần là 2; `docreader/parser/concurrency.py`. | Cấu hình compose tuần tự hóa MinerU theo tiến trình app; semaphore không phải giới hạn phân tán toàn cụm. Tăng replica có thể tăng tổng lời gọi vào cùng OCR. |
| 121 | Mỗi khe OCR thêm ~8 GiB VRAM/9 GiB RAM; cửa sổ 32k chỉ ~1,6 yêu cầu (§5.7) | Không kiểm được | Mã semaphore và cấu hình model không chứng minh số bộ nhớ/thông lượng; không có benchmark phần cứng của cấu hình đề xuất trong phạm vi đọc. | Các con số là ước tính phụ thuộc model/serving/GPU/KV cache; cần đo trên đúng bản model và độ dài đầu vào. |
| 122 | Giới hạn audit đồng bộ 30 phút/200 dòng (§5.7) | Có sẵn | `internal/handler/compliance.go`: `complianceAuditTimeout = 30 * time.Minute`, `prepareAudit`; `internal/compliance/compliance.go`: `MaxRows = 200`. | Là số dòng tổng mỗi request; công việc thực tăng theo dòng × tài liệu. Phải chia lượt; không có tiếp tục bền vững khi request bị hủy. |
| 123 | Đổi model nhúng có thể giữ nguyên chỉ mục cũ (§5.7, đối chiếu giới hạn) | Một phần | `internal/application/service/knowledgebase.go`: `SetEmbeddingModel` đổi binding; các đường search dùng model đã chọn; `knowledge_process.go`: tạo embeddings khi xử lý. | Có đổi binding nhưng chưa thấy chuyển đổi toàn bộ vector cũ tự động/an toàn theo version. Cách nói đúng theo giới hạn báo cáo: đổi model nhúng là đợt đánh chỉ mục lại, không chỉ đổi cấu hình rồi dùng chung vector cũ. |
| 124 | Thêm replica ứng dụng tự giải quyết trần model (§5.7, đối chiếu giới hạn) | Không kiểm được | `internal/container/container.go`: governor theo model/Redis; app tiếp tục gọi cùng endpoint model. | Không có bằng chứng tuyến tính theo replica; số đo phải bao gồm DB/vector/model/OCR. Giới hạn báo cáo nêu là hợp lý về luồng mã, không phải số liệu năng lực. |
| 125 | Đã có pool nền theo loại việc và điều tiết model nền riêng (§5.7) | Có sẵn | `internal/container/container.go`: pool chuyên dụng, `registerModelConcurrencyLimiter`, `registerLiteModelConcurrencyLimiter`, mặc định model concurrency 32. | Có cô lập dung lượng worker/goroutine và semaphore model; vẫn cùng tiến trình/chung CPU/RAM/DB, không phải process isolation hay ưu tiên tài nguyên cứng. |
| 126 | SSO Keycloak/OIDC, ánh xạ nhóm sang workspace/vai trò (§1.2; §7.1; §10.1; §12) | Có sẵn | `internal/middleware/keycloak_jwt.go`: `TryAuthenticate`, `Verify`; `internal/keycloakrbac/parser.go`; `service/user.go`: `LoginWithOIDC`; `user_oidc_keycloak_sync.go`. | Có mã xác thực và đồng bộ quyền. Cần cấu hình issuer/audience/JWKS/OIDC đúng và chạy thử tài khoản thật. |
| 127 | Liên kết trực tiếp AD/LDAP, mật khẩu mạnh, MFA quản trị bắt buộc (§7.1; §10.1) | Không kiểm được | `docs/sbv/xac-thuc.md`: mục AD/LDAP và MFA ghi rõ vận hành, không code; ứng dụng dùng token Keycloak. | Không có cấu hình realm/AD đang chạy hay kết quả kiểm OTP trong phạm vi đọc; OIDC không tự chứng minh MFA bắt buộc hay chính sách mật khẩu đã áp dụng. |
| 128 | Tự khóa phiên sau 15 phút không hoạt động (§7.1; §10.1) | Một phần | `frontend/src/utils/idleTimer.ts`, `idleLogout.ts`; `docs/sbv/xac-thuc.md`: cần đồng bộ SSO idle/token lifespan Keycloak. | Có timeout giao diện mặc định 15 phút và gọi logout; chưa có cưỡng chế idle thống nhất server-side cho mọi API token. Chỉ nói có tự đăng xuất giao diện, chính sách phiên IdP phải cấu hình riêng. |
| 129 | Token máy RS256 kiểm chữ ký/iss/aud/exp mỗi request (§7.1) | Có sẵn | `internal/middleware/keycloak_jwt.go`: `KeycloakValidator.Verify` dùng valid methods RS256, issuer, audience, expiration; `TryAuthenticate`. | Kiểm JWT mỗi yêu cầu với JWKS cache; không phải introspection tức thời trạng thái tài khoản tại IdP trên từng request. Thu hồi token phụ thuộc vòng đời token/đồng bộ quyền. |
| 130 | API key phạm vi workspace, tuyến mới mặc định từ chối (§7.1) | Có sẵn | `internal/router/rbac.go`: `apiKeyGroup`, `apiKeyRoute`, policy authorizer; `internal/middleware/` kiểm capability; `service/tenant_api_key.go`. | Có opt-in theo tuyến và capability, kiểm tài nguyên phía backend; không suy quyền của người gọi MCP từ đây. |
| 131 | Phân quyền Super Admin/Admin/Checker/Maker/Viewer trên mọi luồng như một mô hình duy nhất (§7.1; §12) | Một phần | `internal/keycloakrbac/parser.go`; `internal/router/rbac.go`; `service/knowledge_review.go`; `internal/dms/workflow.go`: `canReview` dùng role Viewer khi bật workflow. | Có quyền tenant/KB/capability và các workflow nhưng cách ánh xạ Maker/Checker khác nhau giữa DMS và workflow cũ. Chỉ nói có phân quyền theo mô hình cấu hình được, cần mô tả đúng từng workflow và không hứa một ánh xạ phổ quát. |
| 132 | Người thường không xem cấu hình hệ thống/nhật ký người khác (§7.1) | Có sẵn | `internal/router/rbac.go`: `SystemAdmin`, guard Admin; `internal/handler/audit_log.go`, `system_admin_audit_test.go`; `internal/airuntime/handler.go`. | Có guard backend và scope audit. Một số thông tin model cần để chọn khi QA có thể được cung cấp theo API quyền riêng, không phải mọi thông tin model đều bí mật với người dùng. |
| 133 | Tắt register/login/change/reset mật khẩu cục bộ khi IdP làm chủ (§7.1) | Có sẵn | `internal/application/service/keycloak_local_auth.go`; `user.go`: các guard local auth; `internal/keycloakrbac/local_auth.go`: ngoại lệ provisioning IdP. | Có chặn ở service, gồm reset mật khẩu; chỉ kích hoạt khi điều kiện cấu hình Keycloak tương ứng có hiệu lực. |
| 134 | Mã hóa bí mật AES-256, phát hiện khóa sai ngay khởi động (§7.1) | Có sẵn | `internal/utils/crypto.go`: AES-256-GCM; `internal/types/model.go`, `storagebackend.go`, `mcp.go`: hook lưu secret; `internal/runtime/startup.go`: `ValidateProductionEnv`. | Release mode buộc `SYSTEM_AES_KEY` đúng 32 byte; debug chỉ cảnh báo và có thể lưu không mã hóa. Phải dùng đúng mode, bảo quản/khôi phục khóa riêng. |
| 135 | Tài liệu gốc/bằng chứng/tệp xuất mã hóa phía storage; DB/vector/backup mã hóa, khóa tách (§7.1; §10.1) | Không kiểm được | `internal/application/service/file/`: adapter lưu tệp; không có bằng chứng bucket SSE/đĩa mã hóa của triển khai; `scripts/backup.sh` có mã hóa backup, không cấu hình toàn bộ storage. | AES secret trong app không chứng minh mã hóa file/DB/vector. Cần xác nhận cấu hình storage/volume/khóa thực tế; script backup chỉ bao phủ một cấu hình cụ thể. |
| 136 | TLS ≥1.2 cho mọi đường truyền (§7.1; §10.1) | Không kiểm được | `internal/common/redis_tls.go`: TLS min 1.2 khi bật; nhiều adapter và `docs/sbv/luong-goi-mo-hinh.md` cho phép endpoint HTTP; reverse proxy do triển khai quản lý. | Không có bằng chứng TLS trên toàn bộ browser→app→model/OCR/DB/storage. Phải kiểm các hop và chứng chỉ thực tế. |
| 137 | Cô lập tenant/KB và chia sẻ tường minh có thể thu hồi (§1.2; §7.1) | Có sẵn | `internal/router/rbac.go`: KB access guards; `service/kbshare.go`; `handler/compliance_itevidence.go`: kiểm membership KB; `documentreview/handler.go`: owner/tenant scope. | Có cơ chế phân quyền/cô lập trong mã. “Một nhiệm vụ = một vùng dữ liệu” cần quy ước triển khai vì không có thực thể nhiệm vụ thống nhất khắp ứng dụng. |
| 138 | Ba vùng nhạy cảm/suy luận/đánh giá có bucket/schema và quyền riêng (§7.1; §10.1) | Chưa có | Không tìm thấy policy bắt buộc ba vùng trong `deploy/sbv/`, `internal/feedback/`, `documentreview/`, models/repository; dữ liệu dùng các bảng trong DB ứng dụng và storage theo cấu hình. | Hiện có tách logic qua tenant/KB/bảng; chưa có triển khai ba vùng bucket/schema riêng như báo cáo. Muốn cam kết cần bổ sung cấu hình và kiểm quyền tương ứng. |
| 139 | Không dùng dữ liệu nghiệp vụ huấn luyện; fine-tune chỉ từ vùng được duyệt (§7.1) | Một phần | Trong pipeline đã đọc chỉ thấy inference/embedding/OCR và lưu feedback; không thấy job huấn luyện hoặc workflow duyệt tập fine-tune trong `internal/`, `deploy/sbv/`. | Mã ứng dụng hiện không có luồng training; chưa có cơ chế kiểm soát việc nhà cung cấp model/hạ tầng dùng dữ liệu hoặc quy trình fine-tune được duyệt. Chỉ nói ứng dụng thực hiện suy luận, chính sách training phải kiểm ở serving/nhà cung cấp. |
| 140 | Chạy kín, không dữ liệu nào ra Internet, tất cả model qua một cổng nội bộ (§1.2; §7.1; §10.1; §12) | Không kiểm được | `internal/airuntime/report.go`: phân loại endpoint, không cưỡng chế; `runtime/startup.go`: chỉ cảnh báo external decision; `docs/sbv/kiem-tra-offline.md`: yêu cầu tcpdump/egress audit; các provider ngoài vẫn tồn tại. | Có thể cấu hình nội bộ; chưa có bằng chứng firewall, gateway duy nhất hoặc pcap 0 byte của bản bàn giao. Không được suy “không thể cấu hình nhầm gửi ra ngoài” từ mã ứng dụng. |
| 141 | Nhật ký mọi QA/search/compliance và mọi thao tác đều đầy đủ, có nguồn trả về (§1.2; §7.1; §10.1) | Một phần | `internal/application/service/sbv_query_audit.go`: `WithQueryAudit`, `RecordQueryAudit`, `RecordSearchAudit`; `internal/handler/sbv_query_audit.go`; middleware audit. | Có nhiều hook; `RecordQueryAudit` bỏ qua lỗi ghi, cắt dài query, chat ghi trước sinh đáp án; search ghi count/ID scope chứ không snapshot toàn bộ nguồn. Chỉ nói có audit theo hook, chưa bảo đảm 100% đầy đủ/không mất. |
| 142 | Audit chỉ ghi thêm, tách khỏi mọi quyền xóa/sửa (§7.1) | Một phần | `internal/application/service/audit_log.go`: `Purge`; `audit_log_retention.go`: xóa theo retention; `repository/audit_log.go` lưu bảng DB thông thường. | Có API xem theo quyền và không có thao tác sửa nội dung thông thường, nhưng có purge và chưa có WORM/tài khoản DB append-only bắt buộc. Chỉ nói có audit với chính sách lưu giữ, chưa bảo đảm bất biến chống quản trị DB. |
| 143 | Trace từng giai đoạn/lời gọi model, token/thời gian/endpoint (§7.1) | Một phần | `internal/tracing/langfuse/`; `internal/types/` metadata LLM call; `internal/decision/` tracing; `internal/airuntime/report.go` liệt kê endpoint cấu hình. | Có quan trắc khi bật và cấu hình collector; chưa chứng minh mọi lời gọi đều có đủ token/endpoint hoặc trace luôn được lưu. Chỉ nói hỗ trợ tracing theo các điểm tích hợp, cần kiểm coverage và cấu hình collector nội bộ. |
| 144 | Có SBOM/giấy phép và không còn lỗ hổng Cao/Nghiêm trọng khi bàn giao (§7.1) | Không kiểm được | `docs/sbv/sbom/sbom-licenses.csv` có cả license unknown; `docs/sbv/gates/eval.md`: còn bước người vận hành; không có kết quả quét đúng image bàn giao trong phạm vi này. | Có danh mục thành phần nhưng chưa chứng minh sạch lỗ hổng/đủ license. Phải quét đúng binary/image/dependency đã chốt trước nghiệm thu. |
| 145 | Đáp ứng từng yêu cầu TT09/2020 theo cấp độ hệ thống được duyệt (§7.1) | Chưa có | Không tìm thấy bảng kiểm tuân thủ đầy đủ theo cấp độ đã phê duyệt trong `docs/sbv/`; nội dung KIE/QA về văn bản không phải hồ sơ đáp ứng ATTT hệ thống. | Hiện có một số cơ chế bảo mật và tài liệu kỹ thuật; chưa có hồ sơ chứng minh tuân thủ từng yêu cầu ngành theo cấp độ của đơn vị. |
| 146 | Tách nội dung tài liệu thành dữ liệu được trích dẫn, prompt riêng (§7.2) | Có sẵn | `internal/application/service/sbv_source_guard.go`: context được escape; `internal/decision/local.go`: `localSystemPrompt` và khối state; template prompt riêng trong config. | Có lớp phân tách dữ liệu/chỉ thị; đây là phòng vệ bằng định dạng và prompt, không bảo đảm LLM không bị injection. |
| 147 | Mọi endpoint ra ngoài chỉ được gọi theo allowlist host (§7.2) | Một phần | `internal/utils/security.go`: `ValidateURLForSSRF`, transport/DNS pinning, `SSRF_WHITELIST`; `service/parser_url_security.go`; `docreader/utils/ssrf.py`. | Có chống SSRF và ngoại lệ whitelist; URL công khai hợp lệ có thể được phép theo chính sách, không phải deny-all allowlist Internet cho toàn hệ thống. Chỉ nói có kiểm SSRF; egress allowlist cần tường lửa/cấu hình riêng. |
| 148 | Kỹ năng/mã phân tích chạy sandbox và bộ kiểm lệnh (§7.2) | Có sẵn | `internal/sandbox/manager.go`, `docker_remote_client.go`, `validator.go`; `internal/application/service/session_sandbox_gating_test.go`; `internal/agent/tools/` shell/data analysis. | Có sandbox/provider và kiểm lệnh ở các đường tương ứng; phải bật/cấu hình, không suy ra mọi tool là sandbox hoặc có cách ly mạng vật lý. |
| 149 | Công cụ nhạy cảm phải có phê duyệt người dùng/phạm vi quyền (§7.2) | Có sẵn | `internal/agent/tools/mcp_tool.go`: `NeedsApproval`, `RequestAndWait`; `internal/agent/approval/`; `internal/modelcontext/tool_policy.go` và allowed tools. | Có cổng phê duyệt theo policy công cụ và kiểm handle/phạm vi; policy phải khai báo đúng công cụ nhạy cảm, không mặc định mọi lời gọi đều hỏi duyệt. |
| 150 | Làm sạch mọi đầu ra, giới hạn widget/domain, tải tệp ký (§7.2) | Một phần | `frontend/src/utils/security.ts`, các đường markdown/DOMPurify; `internal/utils/security.go`: `SanitizeHTML`; `router/files.go`: presigned; cấu hình embed/channel. | Có sanitizer và các chính sách hiển thị/nhúng, nhưng chưa chứng minh coverage “mọi đầu ra” và URL ký không loại bỏ mọi rủi ro hiển thị/chia sẻ. Chỉ nói có lớp làm sạch và kiểm soát theo từng renderer/kênh đã tích hợp. |
| 151 | Chống lộ system prompt và nội dung chỉ thị ẩn (§7.3) | Một phần | `internal/promptguard/guard.go`: `Detector.Discloses`; `handler/session/sbv_prompt_guard.go`: giữ đầu 300 rune, lọc stream/persist; `docreader/parser/hidden_content.py`; `service/sbv_hidden_content.go`. | Có detector mẫu/12 từ liên tiếp và loại một số nội dung ẩn; không bắt mọi diễn đạt lại, chỉ thị trong ảnh hoặc phát hiện muộn sau phần đã stream. Chỉ nói có phòng vệ theo mẫu và cờ nội dung ẩn, vẫn cần kiểm thử tấn công thực. |
| 152 | Có bộ ≥20 kịch bản injection, kiểm nhất quán nhiều lượt và chạy khi đổi model (§7.3) | Có sẵn | `docs/sbv/eval/qa-cases.sample.yaml`: 22 kịch bản injection mẫu; `cmd/sbveval/qa.go`, `qa_score.go`: số kịch bản/tối thiểu số lần; `docs/sbv/eval/README.md`. | Có công cụ và kịch bản khởi đầu; chạy định kỳ/đổi model hiện là thao tác vận hành. Không phải kết quả “100% chặn”. |
| 153 | Mọi truy cập trái phép bị từ chối và ghi log; không rò chéo nhiệm vụ; AI luôn nhất quán (§7.3; §10.1) | Không kiểm được | Có test `sbv_revoked_access_test.go`, `sbv_query_audit_test.go`, các test RBAC/scope và bộ `sbveval`; chưa có biên bản E2E đúng môi trường/các kênh. | Unit test và mã guard không chứng minh toàn bộ UI/API/key/share/revoked user/cache/conversation đều đã đạt bộ nghiệm thu. Không chạy các phép thử đó trong nhiệm vụ chỉ đọc này. |
| 154 | Cố định model/prompt/tham số; mọi đề xuất truy được cấu hình sinh ra (§7.3) | Một phần | `internal/types/model.go`, `custom_agent.go` lưu cấu hình có thể cập nhật; `documentreview/decisions.go` lưu đề xuất/engine; `feedback.go` chỉ lưu AgentID/ModelID. | Có tham số cấu hình nhưng thiếu snapshot bất biến model revision/prompt/temperature/tool policy trên từng kết quả. Chỉ nói có ID model/agent và dữ liệu đề xuất đã lưu, chưa tái hiện đầy đủ cấu hình lịch sử. |
| 155 | 100 nhiệm vụ, 50 người, 3.000–5.000 tài liệu, 10–15/50–100 phiên, nạp đầu 4–8 ngày (§10.1) | Không kiểm được | `internal/types/tenant.go`, KB/session/documentreview có bản ghi; `cmd/sbveval/load.go`; `docs/sbv/eval/README.md`. | Không có kết quả đo đúng workload trong phạm vi này; “nhiệm vụ” chưa là thực thể nghiệp vụ thống nhất. Công cụ load mặc định dùng một token, không tự chứng minh 50 tài khoản thật. |
| 156 | 1 TB lưu trữ nóng/~5 TB dự phòng đủ theo cấu hình (§10.1) | Không kiểm được | Storage adapters và compose chỉ mô tả dịch vụ/volume; chưa có inventory máy/RAID/dung lượng còn trống/retention thật. | Cần kiểm hạ tầng và hệ số lưu trữ thực; không suy đủ dung lượng từ số tài liệu hoặc cấu hình mẫu. |
| 157 | Không phí bản quyền theo người dùng/truy vấn/tài liệu, người thứ 500 không phát sinh (§1.2; §10.1) | Một phần | `LICENSE`: nền tảng MIT có ngoại lệ thư viện bên thứ ba; `docs/sbv/sbom/sbom-licenses.csv`: AGPL/unknown; `internal/types/tenant.go`: cấu hình quota, không phải hợp đồng giá. | Mã nền không thu phí seat theo MIT; chưa có căn cứ chốt miễn mọi phí của lớp tùy biến/model/serving/hợp đồng. Chỉ nói giấy phép nền không áp phí seat; tổng điều kiện sở hữu phải chốt theo thành phần và hợp đồng. |
| 158 | Độ chính xác/đúng nguồn/phát hiện ≥95%/bỏ sót/cảnh báo sai <5% và giảm thời gian (§4.4; §4.8; §10.1) | Không kiểm được | `internal/acceptance/acceptance.go`; `cmd/sbveval/qa_score.go`, `ocr.go`, `load.go`; có công cụ/ngưỡng nhưng chưa có bộ kết quả nghiệm thu thực. | 101/114 so 86/114 trong comment `compliance_articles.go` là số tham chiếu nội bộ một phép đo, không chứng minh mọi KPI hay dữ liệu khách hàng. |
| 159 | Sao lưu/phục hồi cấu hình, CSDL, mọi chỉ mục <1 giờ không mất dữ liệu (§4.11; §10.1) | Một phần | `scripts/backup.sh`, `restore.sh`: mã hóa Postgres/AGE và local files; comment nêu không backup Milvus; không thấy backup toàn bộ env/config/secret/model/index của mọi backend. | Có script cho stack Postgres/AGE/local cụ thể, chưa có coverage toàn cấu hình/backend hoặc snapshot nhất quán xuyên kho khi còn ghi. Chỉ nói hỗ trợ backup stack đó; RPO/RTO và khôi phục đủ thành phần phải diễn tập riêng. |
| 160 | Thời gian phục hồi <1 giờ (§10.1) | Không kiểm được | `scripts/restore.sh` có thao tác phục hồi nhưng không có số đo dung lượng/tốc độ/diễn tập trong phạm vi này. | Phụ thuộc kích thước backup, I/O, cấu hình/model/index cần nạp lại; chưa có bằng chứng đạt RTO. |
| 161 | Toàn bộ Checklist POC 16/04 đã đáp ứng và các lỗi đã khắc phục (§10.1; §12) | Một phần | `docs/sbv/gates/poc.md`, `phase1.md`, `phase2.md`, `eval.md` còn ghi chưa kiểm live; §12 báo cáo nguồn ghi “Chờ kiểm chứng lại”; cổng thiếu nguồn hiện đã gỡ. | Có nhiều thay đổi mã để xử lý POC, chưa có kết quả chạy lại đầy đủ và một cơ chế đã bị thay đổi. Chỉ nói đã có các hạng mục triển khai, cần xác nhận từng kịch bản; không gọi là POC đã đạt. |
| 162 | POC hiệu lực ngược chiều: quan hệ hai chiều, chronology, unknown, cron, agent dùng thuộc tính (§12 dòng 1) | Một phần | `internal/legal/chronology.go`, `effectiveness.go`; `service/legal_effectiveness_job.go`; `agent/tools/get_document_info.go`; đặc tả pháp lý còn lệch prompt/tool. | Phần suy luận và công cụ có mã, cron cần bật, agent không bị cưỡng chế luôn dùng kiểm hiệu lực trước trả lời. Chỉ nói đã bổ sung kiểm soát mã; chưa bảo đảm lỗi POC không tái diễn hay đã kiểm chứng lại. |
| 163 | POC upload >80 MB và thấy phê duyệt (§12 dòng 3) | Một phần | `internal/sbvingest/limits.go`; `deploy/sbv/ingest.compose.yml`; `mineru_batch.go`; `internal/dms/workflow.go`: trạng thái publication. | Có giới hạn/cơ chế chia lô và trạng thái; chưa có số đo upload >80 MB end-to-end hoặc một chuỗi trạng thái duyệt thống nhất mọi luồng. Chỉ nói đã có cấu hình/cơ chế để kiểm lại trên môi trường bàn giao. |
| 164 | POC Checker được gán quyền thao tác được, có test từng vai trò (§12 dòng 4) | Một phần | `internal/keycloakrbac/parser_test.go`, `middleware/keycloak_capability_tenant_test.go`; `internal/dms/workflow_test.go`; hai mô hình duyệt DMS/knowledge-review. | Có kiểm thử quyền ở mức mã; chưa chứng minh tài khoản Checker thật qua Keycloak→giao diện→duyệt đã đạt. Chỉ nói có test vai trò và cần xác nhận mapping/workflow thực tế. |
| 165 | POC xem model/gọi API nội bộ được kiểm chứng bằng lưu lượng (§12 dòng 5) | Một phần | `internal/airuntime/handler.go`, `report.go`; `frontend/src/kp-ui/settings/AiRuntime.vue`; `docs/sbv/kiem-tra-offline.md`. | Có màn hình cấu hình và hướng dẫn bắt gói; chưa có pcap và không cưỡng chế mọi endpoint nội bộ. Chỉ nói có thể kiểm kê endpoint, chưa chứng nhận không có lưu lượng ngoài. |
| 166 | POC cảnh báo kho thiếu và nhấn mạnh cho Checker đã giải quyết hoàn toàn (§12 dòng 6) | Một phần | `internal/legal/evidence_warnings.go`; `frontend/src/sbv/chat/EvidenceWarningBanner.vue`; `frontend/src/utils/legalCheckerHighlight.ts`. | Có cờ/cảnh báo đã biết và nhấn mạnh trường; chưa phát hiện được mọi thiếu hụt kho hoặc gắn nguồn đầy đủ cho từng trường. Chỉ nói hỗ trợ phát hiện giới hạn đã biết, cán bộ vẫn kiểm kho và văn bản thay thế. |
| 167 | POC bàn giao Agents.md/kỹ năng/quy trình legal_qa_agent (§12 dòng 7) | Một phần | `docs/sbv/dac-ta-agent-hoi-dap-phap-ly.md` có đặc tả; cấu hình agent/skill và `internal/agent/skills/legal_advisor_wiring_test.go`; `sbv_source_guard.go` đã đổi hành vi sau tài liệu. | Có tài liệu và test nối cấu hình, chưa có bằng chứng bàn giao và đặc tả chưa khớp cổng nguồn hiện tại. Chỉ nói có bản tài liệu cần cập nhật/đối chiếu trước bàn giao. |
| 168 | POC mọi rủi ro thành test case và toàn checklist có kế hoạch nghiệm thu (§12 dòng 8) | Một phần | `docs/sbv/eval/qa-cases.sample.yaml`, `docs/sbv/gates/`; `cmd/sbveval/`; unit test SBV rải trong mã. | Có nhiều case và công cụ, chưa có traceability đủ mọi yêu cầu/rủi ro kèm kết quả thực tế; một số case là mẫu phải thay dữ liệu. Chỉ nói có bộ khởi đầu để hoàn thiện và chạy nghiệm thu. |

### Những điều không được hứa với khách hàng

Mỗi dòng “Một phần”/“Chưa có” ở bảng trên có một câu cấm hứa tương ứng dưới đây. “Cách nói đúng” là phạm vi có thể mô tả từ mã hiện tại, không phải cam kết chất lượng/hiệu năng đã nghiệm thu. Các dòng “Không kiểm được” cũng không được đổi thành “Đạt” nếu chưa có bằng chứng triển khai hoặc số đo.

- **Dòng 5 — Một phần:** Không được hứa “Bảng PDF/scan/Excel thành ô có kiểu số tiền, ngày, mức phí thống nhất (§4.1)”. **Cách nói đúng:** Có đọc bảng và trích trường theo schema, nhưng chưa có mô hình ô có kiểu thống nhất cho mọi parser; PDF builtin không xử lý bảng như MinerU. Chỉ nói hỗ trợ bảng theo engine/schema đã cấu hình.

- **Dòng 7 — Một phần:** Không được hứa “Nhãn phân loại tự quyết định mẫu trích xuất (§4.1)”. **Cách nói đúng:** Mẫu được chọn theo pin/cấu hình, tên tệp, loại tệp, nội dung và ưu tiên strategy pháp lý; chưa thấy ánh xạ tổng quát từ nhãn phân loại sang mẫu. Chỉ nói có chọn mẫu theo các quy tắc hiện có.

- **Dòng 10 — Một phần:** Không được hứa “Từ chối ngay mọi tệp hỏng/vượt giới hạn, không treo hàng đợi (§4.1)”. **Cách nói đúng:** Có chặn kích thước và PDF lỗi khi bật chính sách trang; chưa có kiểm định cấu trúc trước upload cho tất cả Office/ảnh/EPUB. Chỉ cam kết các kiểm tra đầu vào đã thực hiện; lỗi parser khác được ghi khi xử lý.

- **Dòng 13 — Một phần:** Không được hứa “Chia trang bảo đảm tệp lớn không chặn các tệp khác (§4.1; §5.7)”. **Cách nói đúng:** Có chia nhỏ lời gọi OCR và giới hạn đồng thời; chưa có bộ lập lịch công bằng theo trang hoặc cam kết chống đói hàng đợi. Chỉ nói chia lô giúp giới hạn mỗi lần gọi, vẫn có thể phải chờ khe OCR.

- **Dòng 14 — Một phần:** Không được hứa “Hiển thị trạng thái từng tệp theo thời gian thực (§3.4.1; §4.1; §12)”. **Cách nói đúng:** Có trạng thái parse/review/publication và cơ chế tải lại/polling; chưa thấy một luồng push thống nhất đúng toàn bộ chuỗi OCR → Maker → Checker → chỉ mục. Chỉ nói giao diện cập nhật trạng thái theo từng luồng và chu kỳ tải lại.

- **Dòng 15 — Một phần:** Không được hứa “Luồng nạp bắt buộc OCR → Maker → Checker → mới đánh chỉ mục cho mọi tài liệu (§3.4.1; §4.2)”. **Cách nói đúng:** Có hai workflow khác nhau: Inbox được parse trước duyệt; DMS duyệt bản gốc trước OCR. Chỉ nói có luồng duyệt khi bật cấu hình tương ứng, chưa có cổng xác nhận OCR phổ quát như sơ đồ báo cáo.

- **Dòng 16 — Một phần:** Không được hứa “Tài liệu chưa xác nhận tuyệt đối không tham gia mọi truy hồi/đối chiếu (§3.4.1; §4.2)”. **Cách nói đúng:** DMS có cách ly trước công bố; Inbox của workflow cũ đã hoàn tất xử lý trước submit. Chỉ nói kho chính thức nhận tài liệu theo workflow đã bật; không bảo đảm tất cả đường nạp/kho đều bị chặn bởi một cổng OCR chung.

- **Dòng 17 — Một phần:** Không được hứa “Maker–Checker hai người bắt buộc trên mọi đường duyệt (§1.2; §3.4.5; §7.1; §12)”. **Cách nói đúng:** DMS có kiểm tra khác người gửi/chủ tài liệu; đường knowledge-review cũ chưa thấy kiểm tra tương đương trong service/repository. Chỉ cam kết tách người trong workflow DMS được bật và kiểm soát cấu hình vai trò ở các đường còn lại.

- **Dòng 20 — Một phần:** Không được hứa “Điểm tin cậy OCR theo trang/đoạn và cảnh báo dưới ngưỡng (§4.2)”. **Cách nói đúng:** Có điểm heuristic theo hình dạng từ/ký tự, mặc định ngưỡng 0,85, không phải xác suất từ OCR hay CER thực; đoạn quá ngắn không được chấm. Chỉ nói có cờ nghi ngờ để hỗ trợ rà soát.

- **Dòng 21 — Một phần:** Không được hứa “Mọi sai lệch OCR đều phát hiện được (§4.2)”. **Cách nói đúng:** Có bắt một số dấu hiệu nhiễu; không phát hiện được mọi sai lệch nội dung. Cần người đối chiếu với bản gốc.

- **Dòng 23 — Một phần:** Không được hứa “Hiệu đính nội dung tồn tại vĩnh viễn qua mọi lần nạp lại (§4.2)”. **Cách nói đúng:** Có khôi phục khi văn bản parser gốc trùng khớp; đổi OCR/chunking khiến bản sửa không được áp lại tự động, chỉ còn ở hàng soft-delete. Chỉ cam kết giữ và áp lại bản sửa khi nguồn đoạn còn khớp.

- **Dòng 25 — Chưa có:** Không được hứa “Độ tin cậy và tô vùng đến từng ô bảng, gồm vùng ảnh gốc (§4.2)”. **Cách nói đúng:** Hiện có cờ trang/đoạn và giá trị nghi ngờ; chưa có bản đồ độ tin cậy/tô vùng từng ô gắn ảnh gốc.

- **Dòng 27 — Chưa có:** Không được hứa “Chặn dùng đoạn OCR chưa xác minh làm căn cứ duy nhất cho “Chưa đáp ứng” (§4.2)”. **Cách nói đúng:** Chưa có cổng OCR ở bộ phán quyết. Cán bộ phải tự kiểm chứng đoạn nguồn trước khi chấp nhận đề xuất.

- **Dòng 32 — Một phần:** Không được hứa “Không có nguồn thì luôn dừng và trả “không đủ căn cứ” (§1.2; §3.4.2; §4.3; §12)”. **Cách nói đúng:** Agent không còn cổng dừng thiếu nguồn; QA thường vẫn có fallback theo cấu hình. Chỉ nói có hướng dẫn và lựa chọn fallback, chưa có bảo đảm từ chối bắt buộc trên mọi đường.

- **Dòng 33 — Chưa có:** Không được hứa “Chặn hỏi văn bản chưa nạp, không nhầm với văn bản khác (§4.3; §12, POC TT09/2020)”. **Cách nói đúng:** Chưa có cổng kiểm danh tính văn bản đang hoạt động như mô tả POC; không được coi mã utility/test còn lại là đã khắc phục trong luồng agent.

- **Dòng 34 — Một phần:** Không được hứa “Mô hình bị cưỡng chế chỉ dùng kho, không thể dùng kiến thức nền (§3.4.2; §4.3)”. **Cách nói đúng:** Có ràng buộc bằng prompt và quyền truy hồi, chưa có bộ kiểm chứng mọi phát biểu đầu ra. Chỉ nói trả lời được hướng dẫn dựa trên tài liệu, cần kiểm chứng trích dẫn.

- **Dòng 37 — Một phần:** Không được hứa “Mọi câu hỏi pháp lý tự lọc hiệu lực, không bao giờ đưa luật hết hiệu lực như hiện hành (§3.4.2; §4.3; §10.1)”. **Cách nói đúng:** Có lọc khi người gọi yêu cầu và có tool/metadata hiệu lực; chưa cưỡng chế filter hiệu lực trên mọi lượt agent. Chỉ nói có công cụ kiểm hiệu lực và lọc rõ ràng theo truy vấn.

- **Dòng 38 — Một phần:** Không được hứa “Cảnh báo nổi bật khi thiếu văn bản thay thế/sửa đổi/bãi bỏ (§4.3; §12)”. **Cách nói đúng:** Có cảnh báo trạng thái không rõ, đồ thị không truy cập được và quan hệ đã biết nhưng chưa xác minh; đồ thị đọc được mà không có cạnh không tự chứng minh thiếu/đủ kho. Chỉ nói cảnh báo các giới hạn bằng chứng hệ thống nhận diện được.

- **Dòng 44 — Một phần:** Không được hứa “Mỗi dòng luôn có đủ nguyên văn yêu cầu, vi phạm và vị trí gốc (§1.2; §4.4)”. **Cách nói đúng:** Có excerpt nguồn và hit khi tìm được; thiếu nguồn/page hoặc yêu cầu sửa tay không có chứng cứ trang gốc tương ứng. Chỉ nói trả các trích đoạn tìm được và đánh dấu phần thiếu, không hứa đủ cặp trích dẫn cho mọi dòng.

- **Dòng 54 — Chưa có:** Không được hứa “Bộ tiêu chí tự cập nhật khi căn cứ đổi hiệu lực (§4.4)”. **Cách nói đúng:** Hiện cần người rà soát, tạo bản tiêu chí mới rồi công bố; chưa có tự động cập nhật bộ tiêu chí theo đồ thị hiệu lực.

- **Dòng 55 — Một phần:** Không được hứa “Mỗi tiêu chí đối chiếu đồng thời hồ sơ, bằng chứng và căn cứ (§4.4)”. **Cách nói đúng:** Có ghép căn cứ, báo cáo và bằng chứng kỹ thuật theo check đã khai báo; phụ thuộc cờ và định dạng, không phải mọi tiêu chí tự hiểu mọi loại bằng chứng. Chỉ nói hỗ trợ ghép ba nguồn cho check/cấu hình được hỗ trợ.

- **Dòng 57 — Một phần:** Không được hứa “Hồ sơ đối chiếu có phiên bản bất biến, truy lại đúng nguồn sau nhiều năm (§4.4)”. **Cách nói đúng:** Có lịch sử run trong state và log kết luận; chưa có lịch sử mọi bản Payload bất biến hay snapshot nguyên bản mọi evidence/prompt. Chỉ cam kết lưu case hiện tại/các run còn trong state và quyết định đã ghi, phụ thuộc giữ tài liệu và sao lưu.

- **Dòng 58 — Chưa có:** Không được hứa “Chạy đối chiếu lớn bằng công việc nền (§5.7)”. **Cách nói đúng:** Hiện chia yêu cầu thành nhiều lượt đồng bộ trong trần 200 dòng; chưa có audit job nền với tiếp tục/retry/progress như tuyên bố.

- **Dòng 60 — Một phần:** Không được hứa “Đọc mọi cấu hình router/switch/firewall/server/database thành khối có thiết bị/tệp/dòng (§4.5)”. **Cách nói đúng:** Có một số mẫu Cisco/FortiOS/sshd và cấu hình hệ thống, trích dòng/host; chưa có parser mọi hãng/DB hay mô hình khối cấu hình tổng quát. Chỉ chốt danh mục định dạng thực sự hỗ trợ theo regex hiện có.

- **Dòng 61 — Một phần:** Không được hứa “Chuẩn hóa mọi nhật ký, lọc thời gian/loại sự kiện trước LLM (§4.5)”. **Cách nói đúng:** Có syslog/ISO timestamp, login fail/config change và khoảng đầu–cuối; request chưa có bộ lọc time-range/event như báo cáo. Chỉ nói phân tích các sự kiện/mẫu log đã hỗ trợ.

- **Dòng 62 — Một phần:** Không được hứa “Đọc PDF/CSV/XML mọi công cụ quét, kiểm trạng thái và hạn khắc phục (§4.5)”. **Cách nói đúng:** Có Nessus XML và CSV theo cột được nhận diện, phát hiện high/critical đang mở; chưa có parser chuyên biệt PDF mọi công cụ hoặc quy tắc hạn khắc phục đầy đủ. PDF chỉ qua pipeline văn bản chung.

- **Dòng 63 — Một phần:** Không được hứa “Đọc Excel/CSV thành danh mục tài sản đầy đủ, đối chiếu chéo mọi tài sản (§4.5)”. **Cách nói đúng:** Có CSV tài sản, phát hiện một số OS hết hỗ trợ và so số lượng; chưa có bộ nối XLSX nguyên bản vào parser kỹ thuật hay phép nối tổng quát tài sản giữa log/scan/inventory. Chỉ nói hỗ trợ CSV/schema và check đã có.

- **Dòng 73 — Một phần:** Không được hứa “Tự lan truyền cả sửa đổi thành tình trạng/nội dung pháp lý đã hợp nhất (§1.2; §4.6)”. **Cách nói đúng:** Có đồ thị sửa đổi để tra cứu, chưa có hợp nhất nội dung Điều/Khoản bị sửa hoặc bộ suy luận hiệu lực từng phần. Chỉ nói theo dõi quan hệ sửa đổi; cán bộ phải đọc điều khoản liên quan.

- **Dòng 77 — Chưa có:** Không được hứa “Cảnh báo văn bản sắp có/sắp hết hiệu lực (§4.6)”. **Cách nói đúng:** Hiện có tính/cập nhật trạng thái; chưa có thông báo chủ động trước ngày hiệu lực/hết hiệu lực.

- **Dòng 78 — Một phần:** Không được hứa “Làm nổi bật trường pháp lý quan trọng cho Checker và kèm đoạn nguồn (§4.6)”. **Cách nói đúng:** Có nhấn mạnh trường quan trọng và cảnh báo quan hệ; chưa có provenance đoạn nguồn chính xác cho từng trường trích xuất để luôn hiển thị cạnh nó. Chỉ nói hỗ trợ ưu tiên rà soát trường và mở tài liệu nguồn.

- **Dòng 80 — Một phần:** Không được hứa “Căn cứ/Hướng dẫn tự xác định Điều/Khoản và phân ba mức liên quan (§4.6)”. **Cách nói đúng:** Có nhập căn cứ tới Điều/Khoản và hai loại quan hệ tiêu chí; chưa thấy tự trích/định hạng ba mức cho mọi cạnh CAN_CU/HUONG_DAN. Chỉ nói có biểu diễn căn cứ do người cấu hình và đồ thị cấp văn bản.

- **Dòng 81 — Chưa có:** Không được hứa “Tự thu hồi vector văn bản hết hiệu lực và chuyển gốc/hồ sơ sang lưu trữ dài hạn (§4.6)”. **Cách nói đúng:** Hiện văn bản có thể mang nhãn hết hiệu lực và tiếp tục được tra cứu theo bộ lọc; chưa có quy trình tự động archive/thu hồi tài nguyên theo tuổi hết hiệu lực.

- **Dòng 83 — Một phần:** Không được hứa “Ưu tiên trường verified khi truy hồi, thống nhất tuyệt đối QA và đối chiếu (§4.7; §12)”. **Cách nói đúng:** QA nhận trường verified và chỉ dẫn ưu tiên; bộ phán quyết đối chiếu không có cơ chế ưu tiên mọi trường verified tương đương. Chỉ nói thuộc tính được bảo vệ khi trích lại và cung cấp cho các đường đã tích hợp; không bảo đảm hai luồng luôn kết luận giống nhau.

- **Dòng 86 — Một phần:** Không được hứa “Tóm tắt tài liệu dài bằng map–reduce, giữ mọi ý/rủi ro/trích dẫn (§4.8)”. **Cách nói đúng:** Có tóm tắt tài liệu và tổng hợp wiki, nhưng tóm tắt tài liệu dài hiện lấy mẫu, không map–reduce bao phủ toàn văn; chưa bảo đảm đủ ý và trích dẫn. Chỉ nói hỗ trợ tóm tắt trong ngân sách đầu vào, cần rà soát phần bị lược.

- **Dòng 87 — Một phần:** Không được hứa “Tổng hợp nhiều tài liệu/nhiều nhiệm vụ theo quyền (§4.8)”. **Cách nói đúng:** Có truy hồi/tổng hợp nhiều tài liệu và kho được chia sẻ, chưa có mô hình “nhiệm vụ” cùng báo cáo hợp nhất liên nhiệm vụ như mô tả. Chỉ nói tổng hợp trong phạm vi KB/tenant/chia sẻ được cấp quyền.

- **Dòng 90 — Một phần:** Không được hứa “Thể thức báo cáo đáp ứng tuyệt đối Nghị định 30 và quy chuẩn riêng (§4.8; §10.1)”. **Cách nói đúng:** Có mẫu và kiểm tra một số tiêu chí thể thức, chưa chứng minh mọi loại văn bản và mẫu riêng đều hợp chuẩn. Chỉ nói mẫu mặc định có các thiết lập đã mã hóa, cần cơ quan duyệt mẫu cuối.

- **Dòng 91 — Chưa có:** Không được hứa “Tự rà soát chính tả/ngữ pháp trước xuất bản (§4.8)”. **Cách nói đúng:** Hiện cán bộ tự biên tập và rà soát nội dung trước phát hành; chưa có chức năng soát lỗi ngôn ngữ tự động bắt buộc.

- **Dòng 93 — Một phần:** Không được hứa “Đo định kỳ chất lượng truy hồi và câu trả lời, so đường cơ sở (§4.8)”. **Cách nói đúng:** Có công cụ chạy/chấm và xuất kết quả; chưa thấy lịch định kỳ tự động cùng quản lý baseline bắt buộc cho mọi thay đổi. Chỉ nói có thể chủ động chạy bộ đo và so kết quả.

- **Dòng 98 — Một phần:** Không được hứa “Mọi tệp chỉ có URL ký ngắn hạn, danh sách đích cho phép, không có truy cập công khai trực tiếp (§4.9; §7.2)”. **Cách nói đúng:** Có URL ký và resource grant, đồng thời URL presigned là truy cập không cần phiên đăng nhập khi còn chữ ký/hạn. Không thấy thu hồi từng URL HMAC hay allowlist đích người nhận trên đường này. Chỉ nói cấp URL có hạn và bảo vệ các đường tải theo cơ chế cụ thể.

- **Dòng 99 — Chưa có:** Không được hứa “Đóng nhiệm vụ, chọn Private → Public để công bố tri thức dùng lại (§4.9; §4.11)”. **Cách nói đúng:** Hiện có chia sẻ KB và công bố tài liệu DMS theo workflow; chưa có luồng kết thúc nhiệm vụ/công bố tri thức như báo cáo.

- **Dòng 101 — Một phần:** Không được hứa “MCP server gọi năng lực với cùng danh tính/quyền người gọi (§4.10)”. **Cách nói đúng:** Có MCP và backend vẫn kiểm quyền khóa API; không tự chuyển danh tính OIDC của từng người gọi sang backend, phạm vi theo khóa dịch vụ được cấu hình. Chỉ nói MCP hoạt động trong quyền API key của server.

- **Dòng 105 — Một phần:** Không được hứa “Trưởng nhóm duyệt, xác nhận OCR và xem báo cáo tin cậy toàn diện (§4.11)”. **Cách nói đúng:** Có duyệt tài liệu và xem tin cậy đề xuất; chưa có cổng xác nhận OCR chung và báo cáo chất lượng toàn diện cho trưởng nhóm. Chỉ nói rà soát các chỉ số/cờ và quy trình duyệt đang có.

- **Dòng 106 — Một phần:** Không được hứa “Quản trị nghiệp vụ cấu hình KB/KIE/prompt/thành viên/chia sẻ/công bố (§4.11)”. **Cách nói đúng:** Có các chức năng cấu hình KB/KIE/agent/thành viên/chia sẻ theo quyền; chưa có công bố Private/Public khi đóng nhiệm vụ và thư viện prompt có version như hứa. Chỉ mô tả từng cấu hình đã có.

- **Dòng 107 — Một phần:** Không được hứa “Bảng lãnh đạo về tiến độ/kết quả kiểm tra, tuân thủ theo đơn vị (§4.11)”. **Cách nói đúng:** Có dashboard tài liệu/hội thoại/hàng đợi theo quyền; chưa thấy báo cáo tuân thủ theo đơn vị hay tiến độ nhiệm vụ nghiệp vụ. Chỉ nói dashboard hoạt động kho và hệ thống.

- **Dòng 108 — Một phần:** Không được hứa “Quản trị giám sát/hàng đợi/audit, sao lưu/phục hồi/nâng cấp qua giao diện (§4.11)”. **Cách nói đúng:** Có giao diện một số số liệu và script vận hành; chưa có màn hình sao lưu/phục hồi/nâng cấp đầy đủ hoặc số liệu GPU. Chỉ nói vận hành kết hợp giao diện với script/quy trình kỹ thuật.

- **Dòng 111 — Một phần:** Không được hứa “Hỗ trợ/bàn giao 4-bit, 8-bit kèm số đo so bản gốc (§4.12)”. **Cách nói đúng:** Ứng dụng có thể gọi endpoint phục vụ model nén nếu tương thích; chưa có cấu hình/gói số đo bàn giao 4/8-bit cụ thể. Chỉ nói tương thích endpoint, cần xác lập biến thể và đo riêng.

- **Dòng 112 — Một phần:** Không được hứa “Quy trình cập nhật model offline → eval/an toàn → baseline → chỉ cho dùng nếu không giảm (§4.12)”. **Cách nói đúng:** Có hướng dẫn đo và chuẩn bị offline, chưa có quy trình phát hành đầy đủ/điều kiện chặn đổi model tự động cùng baseline gắn version. Chỉ nói phải vận hành kiểm soát đổi model thủ công bằng bộ đo đã có.

- **Dòng 114 — Chưa có:** Không được hứa “Thư viện prompt có version; mọi đề xuất lưu đúng version prompt/cấu hình (§4.12; §7.3)”. **Cách nói đúng:** Hiện prompt ở mã/cấu hình và cấu hình agent có thể thay đổi; chưa có dấu vết version prompt/model/config đầy đủ trên từng đề xuất.

- **Dòng 116 — Một phần:** Không được hứa “Cùng màn hình có phiên đang hoạt động, GPU, hàng đợi (§4.12)”. **Cách nói đúng:** Có thống kê cấu hình và hàng đợi riêng; chưa có số liệu GPU/phiên đang hoạt động trong AI Runtime. Chỉ hứa các trường API hiện trả.

- **Dòng 117 — Một phần:** Không được hứa “Mỗi agent có đặc tả bàn giao đầy đủ và Super Admin quản trị (§4.12; §12)”. **Cách nói đúng:** Có đặc tả agent pháp lý nhưng một số mô tả lỗi thời, chưa thấy bộ đặc tả đầy đủ cho mọi agent; sửa agent theo nhiều cấp quyền, không chỉ Super Admin. Chỉ bàn giao đặc tả được kiểm khớp lại với cấu hình và mã hiện hành.

- **Dòng 119 — Một phần:** Không được hứa “100% phản hồi lưu cùng nguồn/config version và tự đưa vào bộ đo (§4.12)”. **Cách nói đúng:** Có lưu phản hồi và đối chiếu câu hỏi/câu trả lời còn trong DB, chưa snapshot nguồn/config version hoặc tự nhập vào eval. Chỉ nói có dashboard để người vận hành chọn phản hồi đưa vào bộ đo.

- **Dòng 123 — Một phần:** Không được hứa “Đổi model nhúng có thể giữ nguyên chỉ mục cũ (§5.7, đối chiếu giới hạn)”. **Cách nói đúng:** Có đổi binding nhưng chưa thấy chuyển đổi toàn bộ vector cũ tự động/an toàn theo version. Cách nói đúng theo giới hạn báo cáo: đổi model nhúng là đợt đánh chỉ mục lại, không chỉ đổi cấu hình rồi dùng chung vector cũ.

- **Dòng 128 — Một phần:** Không được hứa “Tự khóa phiên sau 15 phút không hoạt động (§7.1; §10.1)”. **Cách nói đúng:** Có timeout giao diện mặc định 15 phút và gọi logout; chưa có cưỡng chế idle thống nhất server-side cho mọi API token. Chỉ nói có tự đăng xuất giao diện, chính sách phiên IdP phải cấu hình riêng.

- **Dòng 131 — Một phần:** Không được hứa “Phân quyền Super Admin/Admin/Checker/Maker/Viewer trên mọi luồng như một mô hình duy nhất (§7.1; §12)”. **Cách nói đúng:** Có quyền tenant/KB/capability và các workflow nhưng cách ánh xạ Maker/Checker khác nhau giữa DMS và workflow cũ. Chỉ nói có phân quyền theo mô hình cấu hình được, cần mô tả đúng từng workflow và không hứa một ánh xạ phổ quát.

- **Dòng 138 — Chưa có:** Không được hứa “Ba vùng nhạy cảm/suy luận/đánh giá có bucket/schema và quyền riêng (§7.1; §10.1)”. **Cách nói đúng:** Hiện có tách logic qua tenant/KB/bảng; chưa có triển khai ba vùng bucket/schema riêng như báo cáo. Muốn cam kết cần bổ sung cấu hình và kiểm quyền tương ứng.

- **Dòng 139 — Một phần:** Không được hứa “Không dùng dữ liệu nghiệp vụ huấn luyện; fine-tune chỉ từ vùng được duyệt (§7.1)”. **Cách nói đúng:** Mã ứng dụng hiện không có luồng training; chưa có cơ chế kiểm soát việc nhà cung cấp model/hạ tầng dùng dữ liệu hoặc quy trình fine-tune được duyệt. Chỉ nói ứng dụng thực hiện suy luận, chính sách training phải kiểm ở serving/nhà cung cấp.

- **Dòng 141 — Một phần:** Không được hứa “Nhật ký mọi QA/search/compliance và mọi thao tác đều đầy đủ, có nguồn trả về (§1.2; §7.1; §10.1)”. **Cách nói đúng:** Có nhiều hook; `RecordQueryAudit` bỏ qua lỗi ghi, cắt dài query, chat ghi trước sinh đáp án; search ghi count/ID scope chứ không snapshot toàn bộ nguồn. Chỉ nói có audit theo hook, chưa bảo đảm 100% đầy đủ/không mất.

- **Dòng 142 — Một phần:** Không được hứa “Audit chỉ ghi thêm, tách khỏi mọi quyền xóa/sửa (§7.1)”. **Cách nói đúng:** Có API xem theo quyền và không có thao tác sửa nội dung thông thường, nhưng có purge và chưa có WORM/tài khoản DB append-only bắt buộc. Chỉ nói có audit với chính sách lưu giữ, chưa bảo đảm bất biến chống quản trị DB.

- **Dòng 143 — Một phần:** Không được hứa “Trace từng giai đoạn/lời gọi model, token/thời gian/endpoint (§7.1)”. **Cách nói đúng:** Có quan trắc khi bật và cấu hình collector; chưa chứng minh mọi lời gọi đều có đủ token/endpoint hoặc trace luôn được lưu. Chỉ nói hỗ trợ tracing theo các điểm tích hợp, cần kiểm coverage và cấu hình collector nội bộ.

- **Dòng 145 — Chưa có:** Không được hứa “Đáp ứng từng yêu cầu TT09/2020 theo cấp độ hệ thống được duyệt (§7.1)”. **Cách nói đúng:** Hiện có một số cơ chế bảo mật và tài liệu kỹ thuật; chưa có hồ sơ chứng minh tuân thủ từng yêu cầu ngành theo cấp độ của đơn vị.

- **Dòng 147 — Một phần:** Không được hứa “Mọi endpoint ra ngoài chỉ được gọi theo allowlist host (§7.2)”. **Cách nói đúng:** Có chống SSRF và ngoại lệ whitelist; URL công khai hợp lệ có thể được phép theo chính sách, không phải deny-all allowlist Internet cho toàn hệ thống. Chỉ nói có kiểm SSRF; egress allowlist cần tường lửa/cấu hình riêng.

- **Dòng 150 — Một phần:** Không được hứa “Làm sạch mọi đầu ra, giới hạn widget/domain, tải tệp ký (§7.2)”. **Cách nói đúng:** Có sanitizer và các chính sách hiển thị/nhúng, nhưng chưa chứng minh coverage “mọi đầu ra” và URL ký không loại bỏ mọi rủi ro hiển thị/chia sẻ. Chỉ nói có lớp làm sạch và kiểm soát theo từng renderer/kênh đã tích hợp.

- **Dòng 151 — Một phần:** Không được hứa “Chống lộ system prompt và nội dung chỉ thị ẩn (§7.3)”. **Cách nói đúng:** Có detector mẫu/12 từ liên tiếp và loại một số nội dung ẩn; không bắt mọi diễn đạt lại, chỉ thị trong ảnh hoặc phát hiện muộn sau phần đã stream. Chỉ nói có phòng vệ theo mẫu và cờ nội dung ẩn, vẫn cần kiểm thử tấn công thực.

- **Dòng 154 — Một phần:** Không được hứa “Cố định model/prompt/tham số; mọi đề xuất truy được cấu hình sinh ra (§7.3)”. **Cách nói đúng:** Có tham số cấu hình nhưng thiếu snapshot bất biến model revision/prompt/temperature/tool policy trên từng kết quả. Chỉ nói có ID model/agent và dữ liệu đề xuất đã lưu, chưa tái hiện đầy đủ cấu hình lịch sử.

- **Dòng 157 — Một phần:** Không được hứa “Không phí bản quyền theo người dùng/truy vấn/tài liệu, người thứ 500 không phát sinh (§1.2; §10.1)”. **Cách nói đúng:** Mã nền không thu phí seat theo MIT; chưa có căn cứ chốt miễn mọi phí của lớp tùy biến/model/serving/hợp đồng. Chỉ nói giấy phép nền không áp phí seat; tổng điều kiện sở hữu phải chốt theo thành phần và hợp đồng.

- **Dòng 159 — Một phần:** Không được hứa “Sao lưu/phục hồi cấu hình, CSDL, mọi chỉ mục <1 giờ không mất dữ liệu (§4.11; §10.1)”. **Cách nói đúng:** Có script cho stack Postgres/AGE/local cụ thể, chưa có coverage toàn cấu hình/backend hoặc snapshot nhất quán xuyên kho khi còn ghi. Chỉ nói hỗ trợ backup stack đó; RPO/RTO và khôi phục đủ thành phần phải diễn tập riêng.

- **Dòng 161 — Một phần:** Không được hứa “Toàn bộ Checklist POC 16/04 đã đáp ứng và các lỗi đã khắc phục (§10.1; §12)”. **Cách nói đúng:** Có nhiều thay đổi mã để xử lý POC, chưa có kết quả chạy lại đầy đủ và một cơ chế đã bị thay đổi. Chỉ nói đã có các hạng mục triển khai, cần xác nhận từng kịch bản; không gọi là POC đã đạt.

- **Dòng 162 — Một phần:** Không được hứa “POC hiệu lực ngược chiều: quan hệ hai chiều, chronology, unknown, cron, agent dùng thuộc tính (§12 dòng 1)”. **Cách nói đúng:** Phần suy luận và công cụ có mã, cron cần bật, agent không bị cưỡng chế luôn dùng kiểm hiệu lực trước trả lời. Chỉ nói đã bổ sung kiểm soát mã; chưa bảo đảm lỗi POC không tái diễn hay đã kiểm chứng lại.

- **Dòng 163 — Một phần:** Không được hứa “POC upload >80 MB và thấy phê duyệt (§12 dòng 3)”. **Cách nói đúng:** Có giới hạn/cơ chế chia lô và trạng thái; chưa có số đo upload >80 MB end-to-end hoặc một chuỗi trạng thái duyệt thống nhất mọi luồng. Chỉ nói đã có cấu hình/cơ chế để kiểm lại trên môi trường bàn giao.

- **Dòng 164 — Một phần:** Không được hứa “POC Checker được gán quyền thao tác được, có test từng vai trò (§12 dòng 4)”. **Cách nói đúng:** Có kiểm thử quyền ở mức mã; chưa chứng minh tài khoản Checker thật qua Keycloak→giao diện→duyệt đã đạt. Chỉ nói có test vai trò và cần xác nhận mapping/workflow thực tế.

- **Dòng 165 — Một phần:** Không được hứa “POC xem model/gọi API nội bộ được kiểm chứng bằng lưu lượng (§12 dòng 5)”. **Cách nói đúng:** Có màn hình cấu hình và hướng dẫn bắt gói; chưa có pcap và không cưỡng chế mọi endpoint nội bộ. Chỉ nói có thể kiểm kê endpoint, chưa chứng nhận không có lưu lượng ngoài.

- **Dòng 166 — Một phần:** Không được hứa “POC cảnh báo kho thiếu và nhấn mạnh cho Checker đã giải quyết hoàn toàn (§12 dòng 6)”. **Cách nói đúng:** Có cờ/cảnh báo đã biết và nhấn mạnh trường; chưa phát hiện được mọi thiếu hụt kho hoặc gắn nguồn đầy đủ cho từng trường. Chỉ nói hỗ trợ phát hiện giới hạn đã biết, cán bộ vẫn kiểm kho và văn bản thay thế.

- **Dòng 167 — Một phần:** Không được hứa “POC bàn giao Agents.md/kỹ năng/quy trình legal_qa_agent (§12 dòng 7)”. **Cách nói đúng:** Có tài liệu và test nối cấu hình, chưa có bằng chứng bàn giao và đặc tả chưa khớp cổng nguồn hiện tại. Chỉ nói có bản tài liệu cần cập nhật/đối chiếu trước bàn giao.

- **Dòng 168 — Một phần:** Không được hứa “POC mọi rủi ro thành test case và toàn checklist có kế hoạch nghiệm thu (§12 dòng 8)”. **Cách nói đúng:** Có nhiều case và công cụ, chưa có traceability đủ mọi yêu cầu/rủi ro kèm kết quả thực tế; một số case là mẫu phải thay dữ liệu. Chỉ nói có bộ khởi đầu để hoàn thiện và chạy nghiệm thu.

### Lưu ý nội bộ

- **Phạm vi chứng cứ và POC:** kết quả này là đối chiếu tĩnh đúng commit. Không được dùng test file, comment số đo hay gate “passed” như biên bản nghiệm thu. `docs/sbv/gates/poc.md`, `phase1.md`, `phase2.md` nêu chưa kiểm live; `eval.md` dành việc chạy thật cho người vận hành. §12 đầu vào vẫn ghi chờ kiểm chứng/bàn giao. Chưa có số đo triển khai khách hàng trong lần đọc này.

- **OCR một tài liệu/lần:** compose mặc định `WEKNORA_MINERU_MAX_CONCURRENCY=1`; hàm `mineruMaxConcurrency()` nếu chạy ngoài compose mặc định **2**. Semaphore là trong một tiến trình, không phải toàn cụm: tăng app replica có thể cùng lúc dồn tải vào một endpoint OCR. PDF batching là tuần tự trong một job; không có scheduler công bằng bảo đảm một tệp nặng không chặn tệp khác. Khoảng **8 GiB VRAM/9 GiB RAM mỗi khe** trong báo cáo chưa được chứng minh bằng mã/số đo trên máy đích.

- **Giới hạn nạp:** 100 MB/300 trang cần bật override SBV đồng nhất trên các lớp; giới hạn trang chỉ cho PDF và cần qpdf. `WEKNORA_MINERU_BATCH_PAGES` là opt-in; chỉ xuất hiện trong tệp env không chứng minh đã vào môi trường container. Mã batch ghi trang lỗi; cần kiểm `ocr_failed_pages`, không đồng nhất job kết thúc với đọc đủ mọi trang. Đường phân tích bằng chứng CNTT riêng có trần **32 MiB/tệp, 200 tệp/request** (`handler/compliance_itevidence.go`), nhỏ hơn giới hạn upload tổng quát.

- **Cửa sổ ngữ cảnh:** context window là giới hạn model/serving cộng lịch sử, tool output, nguồn và output budget; 32k không phải dung lượng văn bản đầu vào ròng. `getSummary` đang lấy mẫu đầu/giữa/cuối khi vượt ngân sách, nên có thể bỏ sót nội dung. Wiki có Map/Reduce riêng, không được dùng làm bằng chứng tóm tắt đầy đủ mọi tài liệu. Các con số **1,6 yêu cầu dài**, khuyến nghị **8k–16k** và tốc độ đồng thời phải đo với đúng model, KV cache, GPU và tỷ lệ token đầu vào/đầu ra.

- **Trần đối chiếu:** **30 phút/200 dòng mỗi request**, concurrency cặp xử lý **5** (`compliance.go`, `handler/compliance.go`). Chi phí tăng theo **dòng × tài liệu**; trần 200 không có nghĩa 200 phép gọi model. Một lượt có thể thêm call cho phán quyết. Chưa có job nền bền vững/tiếp tục sau hủy; chia lượt và lưu/xuất thủ công theo chức năng hiện tại. Không có căn cứ hứa 100 × 40 trong 60 phút. Excerpt trong prompt tối đa **2.500 ký tự/hit**, snippet trả khách tối đa **500 ký tự**; trích nguyên văn có thể chỉ là phần đầu của đoạn.

- **Đổi mô hình nhúng:** vector phụ thuộc model, số chiều và cách chuẩn hóa. `SetEmbeddingModel` đổi binding không chứng minh vector cũ đã được chuyển. Phải coi đổi model là đợt đánh chỉ mục lại/đổi chỉ mục có quản lý; giữ khả năng quay về model/chỉ mục cũ và không trộn vector khác model vào một không gian tra cứu.

- **Hiệu lực pháp lý:** bật AGE và nạp đủ nguồn quan hệ mới kiểm được thay thế/bãi bỏ. Cron hiệu lực mặc định tắt nếu không đặt lịch. Đồ thị vắng/lỗi hoặc không có cạnh không chứng minh văn bản còn hiệu lực/kho đã đầy đủ. SUA_DOI chỉ là quan hệ, chưa có hợp nhất điều khoản/hiệu lực từng phần. Lỗi đồ thị/chiếu lại có thể là best-effort; cần quan sát log. Chưa có cảnh báo sắp hết hiệu lực, tự archive hay sửa tự động mọi cạnh lịch sử sai.

- **Cổng thiếu nguồn và đặc tả lệch mã:** `injectLegalEvidence` hiện không từ chối khi rỗng/lỗi, trái mô tả `guardLegalAgent` trong đặc tả SBV. Utility `sourceguard.Refuse` và test cũ còn tồn tại không tạo bảo đảm khi không được gọi. Prompt “chỉ dùng kho” và reference không chứng minh mọi mệnh đề đều có nguồn. Không hứa đã xử lý dứt điểm tình huống TT09/2020 chưa được nạp.

- **OCR confidence/hiệu đính:** điểm heuristic mặc định 0,85 không phải CER 85% hay xác suất OCR đúng; có thể bỏ lọt lỗi vẫn là từ/số hợp lệ. Không có heatmap từng ô/vùng ảnh. Bản sửa chunk chỉ áp lại khi SourceContent trùng; trường verified được giữ trong cùng bản ghi. Xóa/nạp mới hoặc đổi kết quả OCR/chia đoạn không có bảo đảm khôi phục mọi hiệu đính. Bộ phán quyết chưa cưỡng chế chặn đoạn OCR chưa xác minh làm nguồn duy nhất.

- **Workflow và dữ liệu nhiệm vụ:** có DMS workflow và Inbox→Official workflow khác nhau, cần nêu rõ feature flag và mapping quyền đang dùng. DMS có kiểm tra khác người gửi/chủ tài liệu; đường knowledge-review cũ không có cùng điều kiện trong service/repository. Không có thực thể “nhiệm vụ nghiệp vụ” thống nhất kèm đóng nhiệm vụ/công bố Private→Public. Case review là dữ liệu tenant/người dùng; revision là khóa chống ghi đồng thời, không phải kho lưu mọi revision bất biến.

- **Model/prompt/feedback:** cấu hình CSDL của agent có thể ưu tiên YAML; ID model/agent không phải fingerprint trọng số hay version prompt. AI Runtime chỉ kiểm kê cấu hình, không đo GPU/phiên đang hoạt động và không chặn endpoint ngoài. Feedback lưu bản đánh giá hiện tại, có thể cập nhật; chưa snapshot nguồn/config hay tự thêm vào eval. Đổi model nén hoặc model mới cần bộ đo thực, không dựa vào tính tương thích OpenAI API để suy chất lượng.

- **Bảo mật triển khai:** release mode mới buộc khóa AES 32 byte; AES-GCM trong app chủ yếu bảo vệ secret, không phải file, DB hay vector. Keycloak MFA/AD/LDAP/idle server-side là cấu hình vận hành. JWT hợp lệ đến hạn không tương đương hỏi IdP trạng thái tài khoản mỗi request. Chống SSRF không phải firewall deny-all egress; nội dung và endpoint ngoài vẫn có đường cấu hình. Muốn xác nhận 0 byte phải kiểm cấu hình thật, cache trọng số/image offline, collector nội bộ, firewall, cả trình duyệt và capture gói như `docs/sbv/kiem-tra-offline.md`.

- **Audit và lưu giữ:** có hook nhưng ghi audit không làm thất bại nghiệp vụ khi DB audit lỗi. Query có cắt dài, không phải mọi audit chứa đầy đủ nguồn/đáp án; `Purge` và retention có thể xóa lịch sử. Chưa có WORM/append-only DB bắt buộc. URL HMAC mặc định **2 giờ**, mang tính bearer khi còn hạn; thu hồi share record không mặc nhiên hủy một URL ký đã phát. Không đưa thông tin nhạy cảm đầy đủ vào log/debug nếu cấu hình vận hành không cần.

- **Sao lưu/phục hồi:** script hiện mã hóa Postgres/AGE/local files theo các container/volume được chỉ định; không bao phủ mặc định mọi model, secret, cấu hình và backend Milvus/MinIO/S3 khác. Chưa có chứng cứ snapshot đồng bộ khi đang ghi hoặc RPO bằng 0; cần giữ khóa giải mã tách biệt và diễn tập đầy đủ để xác định RTO. Không suy “<1 giờ, không mất dữ liệu” từ việc có script.

- **Giấy phép AGPL/SSPL:** `LICENSE` ghi nền MIT có ngoại lệ thành phần thứ ba. `docs/sbv/sbom/sbom-licenses.csv` có **ebooklib AGPLv3+**, nhiều mục `unknown`; `docs/sbv/gates/eval.md` còn yêu cầu rà các thành phần copyleft/image. Báo cáo đầu vào nêu MinerU/MinIO AGPL và Redis theo phiên bản có RSAL/SSPL. Trong repo không có đủ giấy phép gói image/trọng số thực tế để xác nhận toàn bộ các nhãn đó hoặc kết luận “dùng nội bộ luôn không phát sinh nghĩa vụ”. Phải chốt đúng thành phần/phiên bản và điều kiện bàn giao; không coi bản nền MIT là bằng chứng toàn bộ sản phẩm/phụ thuộc đều MIT, không hứa đã tránh hết AGPL/SSPL. Không có kết luận pháp lý mới ngoài chứng cứ repo trong báo cáo này.

- **Arm64:** máy NVIDIA Grace trong cấu hình đề xuất là Arm64; các nhánh kiến trúc của `docker/Dockerfile.docreader` không chứng minh MinerU/VLM/CUDA, toàn bộ native dependency và model chạy đúng trên máy đó. `docker/Dockerfile.sandbox` còn ghi target CubeSandbox base chỉ linux/amd64. Chưa có số đo/biên bản Arm64 trong phạm vi đọc. Cần chốt image/wheel/driver/model thực tế; đường lui OCR x86_64 phải tính cả GPU, mạng và thời gian vận hành. Không suy tokens/giây từ TOPS danh nghĩa hay từ benchmark x86 khác.

## Tình trạng 8 vấn đề POC (mục 12 của báo cáo)

Nguồn: `samples/kvault_docs/kiem-chung-poc-96d3345e-20261015.md`, log ở `samples/kvault_docs/poc-verification-20261015-logs/`. Mức "Có mã, chưa kiểm chứng" thì không được ghi là đã khắc phục xong; nói "đã có bản sửa, sẽ chạy lại kịch bản POC trong giai đoạn nghiệm thu".

| # | Vấn đề POC | Mã khắc phục | Test và kết quả chạy | Mức | Việc còn thiếu |
|---|---|---|---|---|---|
| 1 | **POC 16/04 – mục 1:** AI suy luận ngược chiều thay thế TT 07/2014 ↔ TT 15/2013, đánh dấu sai hiệu lực. | [internal/legal/chronology.go](knowledge-vault/internal/legal/chronology.go): `checkChronology`, `SupersessionEdge.Verdict`, `RelationFields`, `RelationMetadata`; `internal/legal/graph.go`: `ProjectLegalGraph`; `internal/legal/effectiveness.go`: `InferStatus` có 4 trạng thái. [internal/agent/tools/legal_validity.go](knowledge-vault/internal/agent/tools/legal_validity.go): `LegalGetValidityTool.resolveOne` kiểm lại cạnh khi đọc. `internal/application/service/legal_effectiveness_read.go`: `ResolveLegalKnowledgeRead`, phủ trạng thái hiện hành lên bản sao; `internal/agent/tools/doc_fields.go`: `writeDocumentFieldsXML` truyền cờ verified và quy tắc ưu tiên trường. `internal/application/service/legal_effectiveness_job.go`: `NewLegalEffectivenessRunner`, `Run`; `internal/container/legal_effectiveness.go`: `startLegalEffectiveness`, **mặc định tắt**. Các hunk nối pipeline có dấu `kp-port`. | **PASS:** `TestRelationshipChronology_Req2_5`, `TestSpecPairForwardFields_Req2_5`, `TestReversedSpecPairWarning_Req2_5`, `TestStoredSupersessionEdgeChronology_Req2_5`, `TestEffectiveness`, `TestRecomputeDaily_Req2_6` trong `internal/legal/*_test.go`. **PASS:** `internal/agent/tools/legal_validity_test.go::TestValidityToolIgnoresReversedStoredEdge`: chính TT 15/2013 → TT 07/2014 không làm TT 07/2014 hết hiệu lực; đảo về chiều hợp lệ làm TT 15/2013 hết hiệu lực. `TestLegalValidityFourStatesAndFutureReplacement_Req2_6` cũng **PASS**. **PASS:** service `TestLegalReadOverlayAllFourStates_Req2_6`, `TestEffectivenessCronRegistration_Req2_6`, `TestEffectivenessJobMetadataAndGraphFailure_Req2_6`; frontend `legalEffectiveness.test.ts`. Log G01, G05, G11, F01 ở cuối file. | **Đã kiểm chứng** | Đã chứng minh quy tắc chiều quan hệ và trạng thái trên fixture, chưa chứng minh kết luận pháp lý thực tế của hai thông tư hoặc câu trả lời cuối của LLM. Worklog `2026-10-07-sbv-t01.md` có PASS của test AGE giả lập; `2026-10-08-sbv-legal-safety-fix.md` có hồi quy cạnh cũ, vẫn để bước chạy thật tại manual gate. Chưa thấy biên bản chạy lại đúng POC 16/04 trên bản triển khai. Job hằng ngày cần kiểm tra đã bật cron tại nơi triển khai. Test AGE và `CHAT-038` trong QA plan: **cần hạ tầng, không chạy**. |
| 2 | **POC 10/04 – mục 3:** hỏi TT 09/2020 chưa nạp, AI dùng văn bản khác để trả lời không có căn cứ. | [internal/sourceguard/guard.go](knowledge-vault/internal/sourceguard/guard.go): `Refuse`, `RequestedNumbers` đối chiếu đúng danh tính tài liệu, không nhận số hiệu chỉ xuất hiện trong nội dung dẫn chiếu. **Tại HEAD này, tìm `Refuse(` toàn bộ `internal/` chỉ thấy định nghĩa và test, không thấy caller sản xuất.** [internal/application/service/sbv_source_guard.go](knowledge-vault/internal/application/service/sbv_source_guard.go): `injectLegalEvidence` ghi rõ **never refuses**; `session_agent_qa.go` gọi hàm này. `internal/agent/answer_gate.go`: `finishAnswerGate` có nhánh từ chối thiếu bằng chứng, nhưng `internal/types/answer_gate.go::IsEnabled` yêu cầu cấu hình bật; mục legal advisor trong `config/builtin_agents.yaml` **không khai báo answer_gate**. Prompt và skill `legal-answer` còn quy tắc chỉ dùng nguồn trong kho. | **PASS:** `internal/sourceguard/guard_test.go::TestRefuse_Req2_2` có TT 09/2020 thiếu, TT 09/2020 khác cơ quan, viết tắt và số hiệu chỉ được dẫn chiếu; `TestOutOfScopeQuestions_Req2_2` **PASS**. **PASS:** `TestQualifiedEvidenceScope` kiểm chất lượng nguồn; không kiểm việc từ chối câu trả lời. **PASS:** `TestLegalEvidenceInjectionNeverRefuses` xác nhận thiếu nguồn/lỗi truy hồi vẫn để agent tiếp tục. **PASS:** `internal/agent/answer_gate_test.go::TestAnswerGateNoEvidenceAndCancellation`, nhưng test bật gate rõ ràng và dùng câu hỏi `q`, không tái hiện TT 09/2020 chưa nạp trong agent mặc định. YAML có `poc-tt09-chua-nap`, `poc-tt09-viet-tat`; chưa chạy chúng với API thật. G02, G09, G11, G12, G14. | **Có mã, chưa kiểm chứng** | Không dùng PASS của hàm không được nối vào sản xuất để kết luận POC đã đóng. Worklog `2026-10-07-sbv-t04.md` mô tả guard cũ; `2026-10-12-answer-gate-second-rebase.md` xác nhận đã đổi refusal guard sang evidence injection. Worklog `2026-10-09-sbv-live-fix-safety.md` ghi **lỗi live** câu ngoài phạm vi rồi yêu cầu chạy lại sau redeploy. Worklog answer-gate có 12 case API PASS bằng endpoint mô hình giả, không phải TT 09/2020 của POC. Cần test agent mặc định với kho có tài liệu khác nhưng thiếu TT 09/2020, kiểm SSE, câu trả lời lưu và việc không sinh nội dung sai. Kịch bản đó: **cần hạ tầng, không chạy**. |
| 3 | **POC 10/04 – mục 1; POC 16/04 – mục 2:** tệp trên 80 MB không tải xong; chưa thấy trạng thái phê duyệt. | [internal/sbvingest/limits.go](knowledge-vault/internal/sbvingest/limits.go): `MaxFileSizeMB`, `PageLimit`, `ValidateMultipart`, `ValidateReader`, `PDFPages`; giới hạn qua `MAX_FILE_SIZE_MB` và `MAX_PDF_PAGES`, **100/300 phải được cấu hình**, không phải mặc định bắt buộc. `internal/application/service/knowledge_create.go::createKnowledgeFromFile` và `knowledge_submission.go::Submit` dùng admission trước lưu/queue. [internal/infrastructure/docparser/mineru_batch.go](knowledge-vault/internal/infrastructure/docparser/mineru_batch.go): `MinerUReader.readPDFBatches`, chia bằng qpdf; `WEKNORA_MINERU_BATCH_PAGES` điều khiển bật. `frontend/src/kp-ui/documents/fileLifecycle.ts::fileLifecycle` và `KnowledgeSubmissionDrawer.vue` hiển thị trạng thái từng tệp, có hunk `kp-port(T08)`. | **PASS:** `TestT06SizeBoundaryAndLegacyGate` chấp nhận đúng 100 MiB, từ chối +1 byte; `TestT06FileSizeConfigurationCannotOverflowProtocolLimits`; service `TestT06AdmissionRejectsOversizeBeforeSaveOrEnqueue`. **FAIL:** `internal/sbvingest/limits_test.go::TestT06PDFPageBoundaryAndCorruptIsolation`; **FAIL:** service `TestT06SharedAdmissionPDFPageBoundary`. Máy không có `qpdf`; lỗi quan sát được là “PDF hỏng, bị khóa hoặc không đọc được…”, test service đòi “300 trang” nhưng không nhận. **PASS:** `TestT07PageContent`, `TestT07ImageNamespaceExactReferences`, chỉ kiểm dữ liệu trang/ảnh, không thực hiện upload/OCR tệp lớn. Frontend `fileLifecycle.test.ts`, `documentUploadLimit.test.ts`: **PASS**. G07, G09, G13, F01. | **Có mã, chưa kiểm chứng** | Cần qpdf để chạy thành công hai test ranh giới trang; không kết luận lỗi mã từ lần FAIL ở môi trường thiếu công cụ. Chưa chạy tệp PDF thật >80 MB qua HTTP → OCR chia lô → trạng thái phê duyệt. Worklog `2026-10-08-sbv-t07.md` ghi pytest bridge chạy binary Go với OCR giả, gồm padded 100 MiB/300 trang; đây là bằng chứng lịch sử, không đo công suất OCR thật. T06/T07/T08 đều ghi còn human/live gate. `docs/sbv/gioi-han-nap-tai-lieu.md` có cách cấu hình. Kịch bản thật, native probe cần công cụ/fixture bổ sung và MinerU thật: **cần hạ tầng, không chạy**. |
| 4 | **POC 10/04 – mục 2:** Checker đã gán quyền nhưng chưa thao tác được. | [internal/keycloakrbac/parser.go](knowledge-vault/internal/keycloakrbac/parser.go): `ParseTenantGroups`, ánh xạ maker/viewer/admin theo nhóm. [internal/dms/workflow.go](knowledge-vault/internal/dms/workflow.go): `canReview`, `workflowScope`, `validChecker`, `Checkers`. `internal/dms/versions.go::Handler.Review` kiểm người được phân công và quyết định; `frontend/src/kp-ui/documents/DocumentWorkflowPanel.vue` cung cấp thao tác. Luồng DMS mới: Maker=maker, Checker=viewer được phân công, IT=admin; bật qua `WEKNORA_DMS_WORKFLOW_ENABLED`. | **PASS:** `internal/keycloakrbac/parser_test.go::TestPrivateMakerGroupAndExistingCheckerMapping`. **PASS:** `internal/dms/workflow_test.go::TestWorkflowPrivateDocumentsAndAssignedChecker`: giao tài liệu cho Checker, Checker xem hàng chờ và tải bản gốc, approve trả 200 và tạo bản Inbox; Checker khác 404, Maker/IT không approve được. **PASS:** `TestWorkflowNoSelfApprovalAfterRoleChange`, `internal/dms/handler_test.go::TestRolePermissions`. Test dùng Gin thật + SQLite + kho tệp giả, không cần DB/mạng ngoài. G06, G08. | **Đã kiểm chứng** | PASS xác nhận luồng DMS có phân công của mã hiện tại, không chứng nhận tài khoản/screen cũ trong POC hoặc SSO thật. Worklog `2026-10-14-dms-maker-checker-it-workflow.md` ghi test PASS nhưng chưa live UAT và chưa đổi Keycloak/deployment. Worklog `2026-10-14-keycloak-knowledge-page-permissions.md` cho thấy **KB review khác DMS**: KB approve cần Admin/Owner; không suy quyền DMS sang KB. Chưa thấy biên bản POC Checker chạy lại với tài khoản thật. Cần kiểm vai trò, cờ workflow và đúng màn hình tại bản triển khai; Keycloak/API/browser: **cần hạ tầng, không chạy**. |
| 5 | **POC 10/04 – mục 4:** chưa xem được cấu hình mô hình; hỏi “gọi API từ đâu”. | [internal/airuntime/handler.go](knowledge-vault/internal/airuntime/handler.go): `Handler`, `Load`; `report.go::Build`, `locality.go::Locality`; `internal/router/ai_runtime.go::registerAIRuntimeRoutes` đăng ký `GET /api/v1/system/admin/ai-runtime`, chỉ system admin. `frontend/src/kp-ui/settings/AiRuntime.vue` và `aiRuntimeRows.ts::toAiRuntimeRows` hiển thị mô hình/đích gọi/tham số/agent/OCR. [docs/sbv/luong-goi-mo-hinh.md](knowledge-vault/docs/sbv/luong-goi-mo-hinh.md) mô tả luồng gọi; `scripts/sbv/egress-audit.sh` và `docs/sbv/kiem-tra-offline.md` cung cấp kiểm tra tĩnh và quy trình bắt gói. | **PASS:** `internal/airuntime/airuntime_test.go::TestLocality_Req7_1`, `TestBuild_AllFieldsNoSecrets_Req7_1`, `TestEndpointAdminOnly_Req7_1`, `TestLoad_SQLite`; frontend `aiRuntimeRows.test.ts` **PASS**, kiểm dữ liệu bảng và menu dành system admin. Các test này **không ghi lưu lượng**, không chứng minh mọi endpoint thật nội bộ. `TestLoad_Postgres` cần `AIRUNTIME_TEST_DSN`, không chọn chạy. G10, F01. | **Có mã, chưa kiểm chứng** | Còn xác nhận màn hình trên bundle triển khai và bắt gói lúc chat/KIE/OCR/embedding/rerank. Worklog T11/T12 ghi chưa kiểm E2E/browser; TEST-RESULTS lịch sử có Settings PASS nhưng cả lỗi tên model `${TYPESAFE_MODEL}`, không có PCAP. Tài liệu luồng gọi nêu mặc định provisioning có `https://api.deepseek.com/v1` nếu bật tính năng mà không override; `Locality` chỉ xét host đầu tiên, không biết proxy nội bộ có chuyển tiếp ra Internet. Không thấy biên bản egress đáp ứng 0 byte. Postgres thật/tcpdump trên stack: **cần hạ tầng, không chạy**. |
| 6 | **POC 16/04 – rủi ro:** kho thiếu văn bản có thể khiến người dùng hiểu nhầm văn bản còn hiệu lực. | [internal/legal/evidence_warnings.go](knowledge-vault/internal/legal/evidence_warnings.go): `EvidenceWarnings`, cảnh báo `unknown_status`, `relation_evidence_unavailable`, `unverified_THAY_THE` và thứ tự quan hệ chưa xác minh. `internal/application/service/sbv_evidence_warnings.go::answerEvidenceReferences` giữ snapshot theo nguồn được phép và phát qua đường KB/agent. `frontend/src/sbv/chat/EvidenceWarningBanner.vue` gắn phía trên câu trả lời trong `views/chat/components/botmsg.vue`. [frontend/src/utils/legalCheckerHighlight.ts](knowledge-vault/frontend/src/utils/legalCheckerHighlight.ts): `checkerHighlights`; `components/legal-metadata.vue` làm nổi bật thay thế/bị thay thế/hiệu lực/ngày hiệu lực cho Checker. | **PASS:** `internal/legal/evidence_warnings_test.go::TestEvidenceWarnings_Req2_9`, có `missing replacement`, `graph unavailable`, `unknown plus missing replacement`; `TestChronologyUnverifiableWarning_Req2_9`. **PASS:** service `TestAnswerEvidenceWarningsScopedSnapshot_Req2_9`, `TestKnowledgeAndLegalAgentWarningsReachReferenceEvents_Req2_9`: thiếu bản liên quan, sai KB/tenant, parse lỗi hoặc thiếu ngày vẫn cảnh báo; warning đến references của KB/agent và giữ qua Value/Scan. Frontend `evidenceWarnings.test.ts`, `legalCheckerHighlight.test.ts`: **PASS**, gồm lưu/tải lại cờ và trường sai chiều/không xác định/rỗng. G03, G11, F01. | **Đã kiểm chứng** | Đã chứng minh cảnh báo với **quan hệ đã biết mà thiếu bằng chứng**, hiệu lực không xác định hoặc graph không dùng được. Không chứng minh tự phát hiện văn bản thay thế chưa được biết đến trong kho: comment của `EvidenceWarnings` và worklog T05 nêu giới hạn này. Worklog T05 có test AGE PASS lịch sử, T13 có test helper PASS nhưng chưa live UI. Chưa thấy biên bản POC 16/04 chạy lại banner/Checker với tài liệu thật. `TestWarningInventoryGraphRead_Req2_9` cần `AGE_TEST_DSN` và kiểm UI thật: **cần hạ tầng, không chạy**. |
| 7 | **POC 16/04 – phản hồi:** bàn giao đặc tả legal_qa_agent, Agents.md, kỹ năng và quy trình. | Có [docs/sbv/dac-ta-agent-hoi-dap-phap-ly.md](knowledge-vault/docs/sbv/dac-ta-agent-hoi-dap-phap-ly.md); cấu hình thật ở `config/builtin_agents.yaml`, `config/prompt_templates/agent_system_prompt.yaml`, `skills/preloaded/legal-answer/SKILL.md`. `internal/agent/skills/legal_advisor_wiring_test.go::TestLegalAdvisorWiring` kiểm sự nối agent–skill–prompt. `AGENTS.md` ở gốc là quy ước làm việc repo, không phải toàn bộ đặc tả nghiệp vụ agent. | **PASS:** `TestLegalAdvisorWiring` kiểm skill parse/validate, agent chọn đúng skill, có model/rerank và system prompt tồn tại. Test **không kiểm sự đúng đắn của toàn bộ tài liệu đặc tả** hay việc bàn giao. Đối chiếu thấy mục 5 của đặc tả vẫn nói `guardLegalAgent`/`sourceguard.Refuse` từ chối trước engine; mã hiện tại dùng `injectLegalEvidence` không từ chối, như dòng 2. G04. | **Có mã, chưa kiểm chứng** | Cần đồng bộ đặc tả với commit 96d3345e, ghi rõ gate tùy chọn và luồng hiện tại; cần danh mục artifact và biên bản bàn giao đúng yêu cầu. `docs/sbv/gates/poc.md` đánh dấu T10 xong nhưng là gate do lead thông qua theo chỉ dẫn, không phải biên bản bàn giao NHNN. Chưa thấy biên bản bàn giao trong worklog hoặc user-guide/TEST-RESULTS. Không sửa tài liệu nguồn trong lần kiểm tra này. |
| 8 | **POC 16/04 – phản hồi:** chuyển toàn bộ rủi ro đã thảo luận thành test case POC. | [docs/sbv/eval/qa-cases.sample.yaml](knowledge-vault/docs/sbv/eval/qa-cases.sample.yaml) có TT 09/2020 chưa nạp/viết tắt, TT 15/2013 hiệu lực, TT 07/2014 thay thế, dầu khí, injection. `cmd/sbveval/qa.go`, `qa_score.go` có runner/chấm kết quả; `docs/sbv/eval/README.md` hướng dẫn. [docs/kp-port/QA-TEST-PLAN.md](knowledge-vault/docs/kp-port/QA-TEST-PLAN.md) là kế hoạch manual, có FILE/RBAC/LEGAL/CHAT, ví dụ `CHAT-038`, `CHAT-042`; không phải log đã thực thi. Các test mã cụ thể của 7 dòng trên cũng tồn tại. `tests/` trong checkout tìm được `tests/miniprogram/miniprogram.test.js`, không phải bộ 8 case POC này. | **PASS:** `cmd/sbveval/qa_test.go::TestSampleCases_Req8_1`, `TestValidateCases`, `TestScoreQA_AllMetrics`, `TestRefused_Req2_2`. Test sample chỉ đọc YAML và kiểm đủ nhóm/số lượng; scorer dùng câu trả lời giả, **không chạy YAML lên API**. Không thấy trong các nguồn đã kiểm tra một kết quả chạy duy nhất đối chiếu đủ 8 dòng POC với tiêu chí và artifact thực tế. G12. | **Có mã, chưa kiểm chứng** | README gọi YAML là **mẫu**, yêu cầu người phụ trách bổ sung câu hỏi/tài liệu thật trước gate eval. Worklog `2026-10-08-sbv-t30.md` ghi test công cụ PASS, không phải đủ case POC chạy PASS. Cần ma trận truy vết cả 8 vấn đề → case → fixture → kết quả, gồm upload/phê duyệt/Checker/model-egress/bàn giao; cần xử lý các thiếu hụt ở dòng 2, 3, 5, 7. Chạy `sbveval qa` và QA plan với hệ thống thật: **cần hạ tầng, không chạy**. |
