# Knowledge Vault: thông tin thương mại và câu trả lời đã chốt

Bổ sung cho `kvault-product.md`. Ghi những điều sổ tay không nói: giấy phép, hỗ trợ, phiên bản cấu phần, và câu trả lời anh đã chốt khi interview. Dùng lại cho mọi khách. Mỗi dòng ghi ngày chốt và nguồn.

| **Chủ đề** | **Câu trả lời** | **Chốt** |
|---|---|---|
| Nguồn gốc, giấy phép nền | Xây trên Tencent WeKnora (MIT). Lớp pháp lý, trích xuất, tuân thủ, định danh do Katalyst phát triển; bàn giao mã nguồn, quyền dùng vĩnh viễn theo hợp đồng. Không phí theo người dùng, tài liệu hay truy vấn khi tự vận hành mô hình. | Theo báo cáo năng lực v2.1 §6 (07/10/2026), **anh cần xác nhận** |
| Thành phần AGPL / SSPL | MinIO, MinerU (AGPL-3.0), Redis ≥ 7.4 (RSALv2/SSPL). Dùng nội bộ không phát sinh nghĩa vụ; phương án thay: S3 sẵn có hoặc đĩa cục bộ, Valkey, bộ OCR khác. Xuất SBOM và rà giấy phép trước bàn giao. | Theo báo cáo năng lực v2.1 §6.2 |
| Nguyên tắc hồ sơ thầu (loại B) | Không thu hẹp yêu cầu bắt buộc của E-HSMT bằng giả định hay điều kiện. Điều kiện chỉ là căn cứ thiết kế; rủi ro tính vào giá. | Dùng chung với Hanas, 14/10/2026 |
