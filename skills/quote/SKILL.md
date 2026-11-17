---
name: quote
description: Lập và sửa báo giá Hanas bằng Commercial Toolkit. Từ thông số thương vụ (Edition, Named User, SLA, TCO) và WBS theo Norm Library (soạn mới, hoặc chuyển từ 03-wbs.md của /analyze-proposal) ra license, MD/MM, thời gian thô, MD theo mốc, lịch thanh toán, Excel bản sales/nội bộ/khách và phần giá của proposal; so hai phương án. Dùng khi anh gõ /quote <kh|mã báo giá>, hoặc hỏi báo giá, giá license, bao nhiêu MD, làm bao lâu, so phương án, tạo v2.
---

# Báo giá bằng Commercial Toolkit

Toolkit là nguồn gốc giá, Norm Library và Milestone Framework (ADR 0005 của toolkit). Skill này chỉ chạy lệnh của toolkit: không tự tính giá hay MD, không sửa `data/` của toolkit.

## 0. Tìm toolkit

`TK` = biến `HANAS_TOOLKIT`; trống thì lấy cwd nếu có `toolkit/quote.py`; vẫn không có thì hỏi anh đường dẫn và nhắc đặt `HANAS_TOOLKIT` trong mục `env` của `~/.claude/settings.json`. Thuật ngữ: `$TK/CONTEXT.md`; quy trình: `$TK/README.md`.

Báo giá nằm ở `$TK/quotes/<mã>/`, không nằm trong `projects/<kh>/` của planner.

## 1. Chọn phiên bản

- Xem đã có báo giá cho khách chưa: `grep -H '^customer' "$TK"/quotes/*/v*.toml`. Không chắc mã nào thì hỏi anh.
- **Báo giá mới:** mã `Q-<năm>-<số kế tiếp, 3 chữ số>` (bỏ qua `Q-2026-000`, đó là mẫu). Tạo thư mục, chép đúng 3 file đầu vào `v1.toml`, `v1-wbs.csv`, `v1-risks.csv` từ `quotes/Q-2026-000/`, sửa `quote`, `version = 1`, `customer`, `date`.
- **Sửa, hoặc phương án khác:** phiên bản đã sinh file thì giữ nguyên. Chép 3 file đầu vào của `v<N>` thành `v<N+1>`, tăng `version`, sửa phần thay đổi.
- Chỉ muốn thử nhanh license, SLA, TCO: không cần phiên bản mới, mở `<mã>-v<N>-sales.xlsx` và sửa ô vàng ở sheet Thương vụ (công thức tự tính lại). Dịch vụ tính từ WBS nên đổi dịch vụ thì phải ra phiên bản mới.

## 2. Điền `v<N>.toml`

Ý nghĩa từng khóa có ghi chú ngay trong file mẫu. Lấy từ tài liệu đang có trước, hỏi anh sau:

- Cwd có `projects/<kh>/` của planner: đọc `00-params.txt` (`team_max` → `[services.team]`), `01-requirements.md`, `02-proposal.md` (phạm vi, người dùng, nguồn dữ liệu, môi trường).
- Edition theo phạm vi: có dbt Studio hoặc Data Pipeline thì ít nhất Professional; có AI Agents hoặc Ontology thì Enterprise (`$TK/data/pricing/editions.csv`).
- Perpetual hay Subscription, cách đếm Named User theo User Type: theo `${CLAUDE_PLUGIN_ROOT}/knowledge/hanas-commercial.md`.
- Còn thiếu thì hỏi anh một lượt (AskUserQuestion), câu nào cũng có phương án đề xuất. Số nào tự giả định thì ghi lại để báo ở bước 5.

## 3. WBS và rủi ro

`v<N>-wbs.csv` có cột `line,wp_code,description,qty,s1,s2,s3,s4,milestone,scope_limit,role,md,reason`. `milestone` chỉ nhận mã trong `$TK/data/estimation/milestones.csv` (M0–M4, NT, HC).

**Đã có `projects/<kh>/03-wbs.md` được duyệt:** chuyển sang, không soạn lại. Cách chuyển ở [from-planner.md](from-planner.md).

**Chưa có:** soạn từ `$TK/data/estimation/norms.csv`.

- Mỗi thứ cam kết bàn giao là một dòng: WP khớp nhất, `qty` theo đơn vị của WP (cột `unit`), `scope_limit` ghi giới hạn cam kết (ví dụ "tối đa 6 dashboard"). WP có `min_edition` cao hơn Edition của thương vụ thì báo anh.
- Không khớp WP nào: `WP-CUSTOM`, bắt buộc có `role` (PM/BA/DEV/SysE/Tester), `md` và `reason`.
- Không thêm dòng PM hay dự phòng: toolkit tự tính PM (11,11% MD ngoài PM) và Risk Reserve.

Chấm `s1`–`s4` (0/1/2) cho WP có `scored = 1`, theo 4 tiêu chí của họ việc trong `criteria.csv`; WP có `scored = 0` để trống. Ghi lại lý do của từng điểm 2 để báo anh.

`v<N>-risks.csv` (`code,description,probability,impact_md`): rủi ro cụ thể làm tăng effort, lấy từ mục rủi ro hoặc "Chưa xác định" của proposal và `03-wbs.md`. Hồ sơ thầu thì đặt `tender = true`, toolkit tự đổi giả định thành rủi ro.

## 4. Xem trước số (chưa khóa phiên bản)

Lần sinh Excel đầu tiên chụp snapshot và khóa phiên bản; sau đó đổi đầu vào là phải lên `v<N+1>`. Vì vậy, khi còn sửa, chỉ xem số bằng lệnh này (không ghi file nào):

```bash
cd "$TK/toolkit" && python3 -c "import json,sys,quote; print(json.dumps(quote.fingerprint(quote.load_quote(sys.argv[1])), ensure_ascii=False, indent=1))" ../quotes/<mã>/v<N>.toml
```

"Đầu vào chưa hợp lệ" thì sửa file đầu vào rồi chạy lại. Dòng `⚠` là cảnh báo (ví dụ thiếu điểm Complexity): xử lý, hoặc nêu ở bước 5.

## 5. Trình anh

Ngắn gọn, ghi đơn vị, giải thích thuật ngữ ở lần đầu dùng (ví dụ "MM = 20 MD, tức một người làm một tháng"):

- **License:** giá niêm yết, chiết khấu Volume / Prepay / Deal, Total Discount và cấp duyệt (đối chiếu `$TK/data/pricing/approval-matrix.csv`), giá sau chiết khấu; SLA mỗi năm.
- **Dịch vụ:** tổng MD và MM, phần PM và dự phòng, MD theo milestone, thời gian thô (`duration`: low–high tuần với `team` người), giá dịch vụ.
- **Thanh toán:** các đợt theo mốc.
- **Margin** (`estimate.money.margin_pct`): chỉ nói với anh, không đưa vào file gửi khách.
- `versions` còn `draft`: nhắc đây là SỐ TẠM.
- Các giả định đã tự đặt ở bước 2–3.
- Chuyển từ `03-wbs.md`: so MD toolkit với planner, nêu chênh lệch tổng và các dòng lệch quá 10% kèm lý do.

Hỏi anh chốt hay sửa. Sửa thì quay lại bước 2–3; chưa sinh file nên vẫn là phiên bản cũ.

## 6. Sinh file (sau khi anh chốt)

```bash
cd "$TK"
python3 toolkit/quote.py quotes/<mã>/v<N>.toml                    # bản sales
python3 toolkit/quote.py quotes/<mã>/v<N>.toml --view internal    # bản nội bộ (WBS, margin, Cash Exposure)
```

Bản khách (`--view customer`) và phần giá của proposal (`python3 toolkit/proposal.py quotes/<mã>/v<N>.toml`) bị chặn khi còn số tạm. Chỉ thêm `--allow-draft` khi anh nói rõ là xem thử, và nhắc file đó không được gửi khách. Hết số tạm thì `<mã>-v<N>-proposal.md` thay phần giá "[…]" trong `02-proposal.md`.

Không sửa tay file sinh ra. Cần đổi số thì làm phiên bản mới.

## So hai phiên bản

Đọc hai file `<mã>-v<N>-snapshot.json`, lập một bảng: license sau chiết khấu, SLA/năm, tổng MD, MM, thời gian thô, giá dịch vụ, tổng thanh toán (margin chỉ nói với anh). Nêu đầu vào nào khác nhau bằng `diff` hai file `.toml` và hai file `-wbs.csv`.

## Hoàn thành khi

- [ ] Lệnh xem trước chạy không lỗi; cảnh báo đã xử lý hoặc đã báo anh.
- [ ] Anh đã chốt số; đã sinh bản sales và bản nội bộ.
- [ ] Nhắc anh: ký hợp đồng thì chạy `/actuals <mã>` để đóng băng Baseline và phát mẫu chấm công ngay từ kickoff.
