# Format proposal

Rút ra từ 3 proposal mẫu trong `samples/proposal_sample/`. **Mẫu chỉ dùng để lấy cấu trúc và văn phong. Không chép ngày, số liệu, tên khách, phạm vi hay stack công nghệ từ mẫu** (xem mục 4).

## 1. Chọn loại tài liệu

| Tình huống | Loại | Mẫu tham chiếu |
|---|---|---|
| Khách gửi RFP, BRD hoặc email yêu cầu (doanh nghiệp, ngân hàng, công ty tài chính) | **A. Đề xuất giải pháp và phương án triển khai** | mẫu loại A trong `samples/proposal_sample/` (nếu có) |
| Gói thầu theo E-HSMT (đấu thầu qua mạng) | **B. Giải pháp và phương pháp luận tổng quát** | mẫu loại B trong `samples/proposal_sample/` (nếu có) |

## 2. Loại A: khung mục lục

Trang bìa (điền qua front matter của `md2docx.py`): vendor · tên tài liệu · tên giải pháp · "DÀNH CHO <KHÁCH HÀNG> (<VIẾT TẮT>)" · "Phản hồi yêu cầu: …" · "Căn cứ: <tài liệu khách + ngày>" · tháng/năm · "Phiên bản x.y. Tài liệu lưu hành nội bộ giữa <KH> và <Vendor>".

1. **TÓM TẮT ĐỀ XUẤT**
   - 1.1 Bối cảnh: hệ thống hiện có, khoảng trống, yêu cầu của khách. Kết thúc bằng bảng **STT | Hạng mục | Phạm vi | Căn cứ RFP** với 4 hạng mục cố định: Phần mềm · Dịch vụ triển khai · Bảo hành, hỗ trợ, bảo trì · Đào tạo và chuyển giao.
   - 1.2 Trả lời từng "outcome" hoặc mục tiêu khách nêu: bảng **Khách cần hiểu | Trả lời tóm tắt | Chi tiết (Mục X của tài liệu này)**.
   - 1.3 Kết quả bàn giao và cách đáp ứng (tùy RFP).
   - 1.4 Điểm nổi bật trong đề xuất: 4–5 bullet, mỗi bullet là một lợi ích cụ thể có căn cứ.
   - 1.5 Vị trí trả lời các nội dung RFP: bảng **Nội dung RFP | Trả lời tại**. Bắt buộc phủ 100% mục yêu cầu của khách.
2. **HIỂU BIẾT VỀ BÀI TOÁN CỦA <KH>**: 2.1 Khó khăn hiện tại · 2.2 Ràng buộc kỹ thuật và hướng xử lý (bảng **Ràng buộc (mục RFP) | Hướng xử lý**) · 2.3 **Những điều đề xuất này không làm** · 2.4 Phạm vi công việc (2.4.1 Phần mềm, 2.4.2 Dịch vụ triển khai, 2.4.3 Bảo hành/bảo trì, 2.4.4 Đào tạo; mỗi mục có dòng "Không bao gồm: …").
3. **KIẾN TRÚC ĐỀ XUẤT**: cách tiếp cận (các nguyên tắc), kiến trúc tổng thể (hình + bảng **Lớp | Cấu phần service | Trách nhiệm trong dự án**), luồng dữ liệu chạy qua hệ thống trong một ngày/kỳ.
4. **CÔNG NGHỆ ĐỀ XUẤT**: stack theo hạng mục RFP; bảng lý do/kỹ năng/độ phức tạp; mô tả từng service của sản phẩm, mỗi service kết thúc bằng đoạn **"Áp dụng cho <KH>:"**.
5–9. **Các mục nghiệp vụ theo RFP** (thu thập dữ liệu, nạp lịch sử/gia tăng, chất lượng và đối soát, data mart/báo cáo, BI, …). Mỗi mục trả lời đúng một mục RFP, dùng bảng **Trường hợp | Cách xử lý** hoặc **Cơ chế | Cách làm | Áp dụng cho**.
10. **VẬN HÀNH**: supported / troubleshot / recovered / extended; sao lưu, khôi phục; RPO/RTO theo BCP của khách.
11. **BẢO MẬT VÀ BẢO VỆ DỮ LIỆU CÁ NHÂN**: bảng **Hạng mục | Cách làm**, nêu Nghị định 13/2023/NĐ-CP.
12. **BÀN GIAO VÀ CHUYỂN GIAO**: cách chuyển giao, bảng tài liệu theo thời điểm, sở hữu mã nguồn, các khóa đào tạo, việc khách cần chuẩn bị.
13. **SO SÁNH PHƯƠNG ÁN** (khi RFP hỏi): Sản phẩm so với tự xây và cloud, theo đúng tiêu chí RFP. Kết bằng **Khuyến nghị:**.
14. **KẾ HOẠCH TRIỂN KHAI**: 14.1 bảng **Hạng mục | Thời gian (T1–T4 = tuần) | Nội dung | Kết quả** · 14.2 mốc sớm nhất có giá trị · 14.3 phụ thuộc và yêu cầu với khách (**Bên | Cần cung cấp | Thời điểm**) · 14.4 giả định ảnh hưởng tiến độ · 14.5 phương pháp quản lý (Hybrid, sprint 2 tuần, steering hằng tháng) · 14.6 nhân sự (**Vị trí | SL | Công việc chính** + dòng **Tổng**; bảng phân vai **Giai đoạn | Vendor | Khách**).
15. **ƯỚC TÍNH CHI PHÍ**: chi phí một lần, chi phí định kỳ, giả định. **Giá luôn để "[…]"**, kèm câu "Đơn giá và khối lượng chi tiết nằm trong Bảng báo giá kèm theo". Có thể đưa bảng effort MD (xem mẫu loại A, mục 11.2).
16. **RỦI RO VÀ BIỆN PHÁP GIẢM THIỂU**: mỗi rủi ro là một mục con, kèm bảng 2 cột, 4 dòng **Độ rủi ro | Miêu tả | Biện pháp giảm nhẹ | Trách nhiệm**.
17. **BẢO HÀNH, HỖ TRỢ VÀ BẢO TRÌ**: thời gian (hypercare/bảo hành/bảo trì) · phạm vi (**Thuộc bảo hành | Không thuộc**) · phân loại sự cố (Khẩn cấp/Cao/Trung bình/Thấp) · quy trình 5 bước · bảo trì định kỳ · thay đổi và yêu cầu mới (quỹ man-day).

Phụ lục: A. Câu hỏi thường gặp (câu hỏi in đậm + trả lời ngắn) · B. Đối chiếu tiêu chí đánh giá (**Tiêu chí | Đáp ứng | Mục**).

## 3. Loại B: hồ sơ thầu (E-HSMT)

Khung dưới đây rút từ một proposal loại B đã nộp (103 trang), **chỉ lấy cấu trúc**. Bản mẫu mô tả Hanas bản cũ (NiFi…): không chép tên cấu phần, số liệu, nội dung.

Đánh số **I → 1 → 1.1 → 1.1.1 → a → i → •**; in đậm tiêu đề từ cấp I đến cấp a.
Mọi mục phải trích đúng căn cứ "(theo Khoản x, Mục y, Chương V – E-HSMT)".
Trong markdown, tiêu đề loại B ghi **số đầy đủ** để tham chiếu không trùng: `# II. CÁCH TIẾP CẬN…`, `## II.1. Giải pháp kỹ thuật`, `### II.1.1. Kiến trúc`. "Trả lời tại" trong `01-requirements.md` ghi `Mục II.1.1`.

| **Chương** | **Mục con nên có** |
|---|---|
| I. Hiểu rõ mục đích gói thầu | Mô tả khái quát dự án và gói thầu · Phạm vi và tiến độ cung cấp · **Mục tiêu tách theo chiều** (dữ liệu và tích hợp; xử lý, khai thác; quản trị dữ liệu; an toàn, bảo mật; giám sát, vận hành; mở rộng, AI/ML) · Phạm vi công việc theo từng hạng mục E-HSMT · **Dự kiến kết quả đạt được viết theo lợi ích** (nguồn số liệu thống nhất, kiểm toán được, thích ứng thay đổi, chi phí bảo trì, chất lượng dữ liệu…), mỗi lợi ích một đoạn ngắn có căn cứ |
| II. Cách tiếp cận và phương pháp luận | **1. Giải pháp kỹ thuật:** điểm nổi bật · nguyên tắc thiết kế · kiến trúc tổng thể · **mô hình dữ liệu** (các vùng, mô hình hình sao) · các yêu cầu chính, **trích nguyên văn** từng Điểm E-HSMT rồi trả lời · **phương án DR** khi E-HSMT nhắc trung tâm dữ liệu dự phòng · tích hợp hệ thống hiện có (hiện trạng nguồn, nguyên tắc, phương án từng loại dữ liệu). **2. Các đầu việc chi tiết:** "Đầu việc 1…n", mỗi đầu việc có bước con và kết quả; trong đó **danh mục báo cáo**. **3. Phân tích chi tiết từng chức năng** theo lớp phần mềm (thu thập, lưu trữ, xử lý, mô hình, quản trị, truy vấn, trực quan hóa, quản trị hệ thống) |
| III. Sáng kiến cải tiến | Sáng kiến cụ thể, đo được (ví dụ rút ngắn N ngày, bổ sung báo cáo ngoài phạm vi), chỉ dựa trên tính năng có sẵn và đã được anh duyệt |
| IV. Kế hoạch triển khai | Bảng kế hoạch theo ngày N · danh mục tài liệu bàn giao · điều kiện nghiệm thu · phương pháp quản lý (mốc, vòng lặp ngắn, quản lý thay đổi, rủi ro và phụ thuộc, báo cáo và phối hợp) · **từng giai đoạn** (khảo sát, thiết kế, xây dựng, SIT, UAT, go-live, bảo hành) **có Mục tiêu / Nội dung / Kết quả** · **rủi ro cụ thể** (thay đổi yêu cầu, người dùng không tham gia, chậm phản hồi, hạ tầng chưa sẵn, dữ liệu nguồn thiếu…), mỗi rủi ro một mục |
| V. Đào tạo, chuyển giao | Hình thức và đối tượng từng khóa · nội dung theo E-HSMT và kết quả sau đào tạo · kiểm tra, đánh giá, xác nhận hoàn thành · danh mục và phương thức chuyển giao tài liệu |
| VI. Bố trí nhân sự | Tổ chức nhân sự · bảng phân công nhân sự chủ chốt (đúng số lượng, vị trí E-HSMT) · **vai trò và trách nhiệm theo từng giai đoạn** |
| VII. Bảo hành, bảo trì, hỗ trợ | Phạm vi và thời gian · bảo hành của hãng · bảo hành dịch vụ triển khai · mức sự cố và thời gian phản hồi · quy trình tiếp nhận, xử lý |

Kết bằng **Phụ lục A. Giả định** và **Phụ lục B. Bảng đối chiếu yêu cầu E-HSMT** (**Yêu cầu | Căn cứ | Đáp ứng | Mục**).

Quy tắc riêng loại B:
- **Trích nguyên văn** yêu cầu E-HSMT (cột "Yêu cầu (trích nguyên văn Điểm x)") trước khi trả lời, không diễn giải: diễn giải làm rơi cụm bổ nghĩa ("chi tiết mã lỗi", "theo tài khoản/thẻ").
- **Danh mục báo cáo** là bảng `STT | Tên báo cáo | Mô tả (chép nguyên Phụ lục) | Nhóm | Hình thức triển khai (bảng, bảng điều khiển, bảng + chi tiết)`, đủ mọi dòng của phụ lục.
- Không thu hẹp yêu cầu bắt buộc bằng giả định hay điều kiện (xem `knowledge/<sp>-commercial.md`, dòng "Nguyên tắc hồ sơ thầu").
- Độ dài tham khảo: bản loại B đã nộp 103 trang, danh mục báo cáo 27 trang. Phần II là phần dài nhất.

## 4. Quy tắc viết (áp dụng cả A và B)

- Tiếng Việt, câu ngắn, khẳng định, không sáo rỗng ("hàng đầu", "toàn diện", "tối ưu" không có số liệu đi kèm thì bỏ). Giữ nguyên tên sản phẩm, giao thức và thuật ngữ kỹ thuật tiếng Anh.
- Gọi khách bằng tên viết tắt nhất quán (ví dụ KHA). Tham chiếu chéo bằng "Mục X của tài liệu này".
- Mọi yêu cầu của khách đều có chỗ trả lời và có cột "Căn cứ". Không bỏ sót mục nào của RFP.
- Phạm vi có giới hạn đếm được ("tối đa 3 dashboard", "tối đa 10 chỉ số"). Vượt giới hạn thì xử lý bằng change request.
- Giá để "[…]". Tiến độ ghi theo tuần T1… (loại A) hoặc ngày N1… (loại B), kèm tháng/năm thực tế **tính từ kickoff trong `00-params.txt`**.
- **Mô tả sản phẩm lấy từ `knowledge/<sp>-product.md`**, không lấy từ proposal mẫu. Không hứa các mục trong bảng "Những điều không được hứa với khách hàng".
- Tên vendor nhất quán trong toàn tài liệu (bìa, header, thân bài). Một mẫu cũ bị lẫn tên hai vendor, không lặp lại lỗi này.
- Bảng: dòng đầu là tiêu đề, chữ đậm. Markdown viết `| **Cột** | ... |`; `md2docx.py` tự tô nền xanh.
