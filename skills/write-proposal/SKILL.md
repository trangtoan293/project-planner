---
name: write-proposal
description: Viết proposal Hanas đúng format từ yêu cầu khách hàng trong projects/<kh>/01-input/. Dùng khi anh gõ /write-proposal <kh>.
disable-model-invocation: true
---

# Viết proposal

Quy tắc chung (bắt buộc): làm trong thư mục có `projects/`; đọc mục "Quy tắc chống dữ liệu cũ" trong `${CLAUDE_PLUGIN_ROOT}/CLAUDE.md` trước khi bắt đầu.

Đầu vào: `projects/<kh>/01-input/` (RFP, BRD, email, biên bản họp, bảng làm rõ). Đầu ra: `00-params.txt`, `01-requirements.md`, `02-proposal.md`, `02-proposal.docx`.

## Agent và việc chạy song song

| Bước | Agent (`${CLAUDE_PLUGIN_ROOT}/agents/`) | Chạy song song |
|---|---|---|
| 2.1 Tách yêu cầu | `proposal-req-extractor` | Mỗi file một agent; file trên 15 trang chia khoảng ~12 trang, mỗi khoảng một agent |
| 2.2 Đối chiếu Hanas | `proposal-fit-analyst` | Chạy nền trong lúc em tổng hợp 9 mục |
| 4 Viết | `proposal-section-writer` | Mỗi nhóm mục một agent, ghi file phần riêng |
| 7 Review | `proposal-reviewer-coverage`, `-hanas`, `-consistency`, `-client`, `-style` | Cả 5 agent cùng lúc |

**Mặc định chạy agent bằng Codex** để tiết kiệm token Claude: `${CLAUDE_PLUGIN_ROOT}/scripts/codex_agent.sh <agent> <file-báo-cáo> "<nhiệm vụ>"` (gpt-6.1-sol, reasoning high; chạy từ thư mục có `projects/`), mỗi agent một lệnh Bash chạy nền (`run_in_background`), cùng một lượt. Mỗi agent ghi file riêng; đọc báo cáo trong file khi lệnh xong. Chỉ dùng subagent Claude (công cụ Agent, `subagent_type: presale:<agent>`, model sonnet) khi Codex lỗi hoặc máy không có `codex` CLI. Footer AGENTS (mod `agent-monitor`, cài toàn cục) hiện cả hai loại.

Gọi các agent chạy song song **trong cùng một lượt** (nhiều lệnh trong một tin nhắn). Phần nào phụ thuộc kết quả phần trước thì chờ: bước 2.2 cần bảng R của 2.1, bước 7 cần proposal đã ghép xong. Em (agent chính) giữ việc ghép, đánh số, interview anh và sửa lỗi. Agent con không hỏi anh.

## 1. Chuẩn bị và đọc hết tài liệu

- Chưa có `projects/<kh>/`: tạo `01-input/`, copy `${CLAUDE_PLUGIN_ROOT}/templates/00-params.txt` vào, rồi dừng lại và nhờ anh bỏ tài liệu vào.
- Chuyển **từng file** trong `01-input/` sang text ở `01-input/.text/<file>.txt`, giữ mốc trang `=== p<n>`: `pandoc` cho .docx, `fitz` cho .pdf, `openpyxl` cho .xlsx. PDF scan (trang không có chữ) thì báo anh, không đoán.
- Đọc **hết** từng file, kể cả phụ lục, bảng, chú thích, ghi chú cuối bảng. File dài thì đọc theo đoạn cho tới trang cuối. Ghi "đã đọc trang 1–N/N" vào đầu `01-requirements.md`. Dòng bảng bị ngắt sang trang sau thì ghép lại.
- Đọc `${CLAUDE_PLUGIN_ROOT}/knowledge/hanas-product.md`, `${CLAUDE_PLUGIN_ROOT}/knowledge/proposal-format.md`, `${CLAUDE_PLUGIN_ROOT}/CONTEXT.md`.
- **Không đọc proposal mẫu để lấy nội dung.** Chỉ mở `${CLAUDE_PLUGIN_ROOT}/samples/proposal_sample/` khi cần xem cách trình bày một loại bảng.

## 2. Tổng hợp yêu cầu (làm TRƯỚC khi hỏi và viết)

Copy `${CLAUDE_PLUGIN_ROOT}/templates/01-requirements.md` thành `projects/<kh>/01-requirements.md`. Làm theo thứ tự: tách yêu cầu nguyên tử trước, tổng hợp 9 mục sau, vì mỗi ý trong phần tổng hợp phải trỏ về mã R.

### 2.1 Tách yêu cầu nguyên tử

Giao cho `proposal-req-extractor` chạy song song (xem bảng agent ở đầu). Nhận các file `01-input/.text/req-*.md`, ghép theo thứ tự tài liệu, đánh lại mã R, bỏ dòng trùng ở chỗ hai khoảng trang giáp nhau. Em tự đọc lại những đoạn agent báo là điểm lạ.

Bảng cuối file, cột **Mã | Trích yêu cầu | Loại | Nguồn (tài liệu, mục/trang) | Trả lời tại | Trả lời tóm tắt**, mã R01, R02…

- Đi lần lượt **từng mục, từng bullet, từng dòng bảng**, kể cả phụ lục. Một bullet là một dòng. Câu dạng "should explain X, Y, Z" thành 3 dòng. Bảng khách yêu cầu điền (ví dụ bảng so sánh 12 tiêu chí) thì mỗi dòng bảng là một yêu cầu. Danh mục báo cáo thì mỗi báo cáo là một dòng.
- Cột **Trích yêu cầu** ghi sát nguyên văn, không tóm tắt gộp. Con số giữ nguyên (210 ngày, 5 phút, 20 học viên). Không bỏ cụm bổ nghĩa và định nghĩa: "chi tiết mã lỗi", "tại thời điểm giao dịch", "theo tài khoản/thẻ", "(*bắt buộc)".
- Cột **Loại** chọn một trong: `Câu hỏi` (khách hỏi trực tiếp, phải trả lời thẳng) · `Phải giải thích` · `Kết quả` · `Chức năng` · `Phi chức năng` · `Dịch vụ` · `Ràng buộc` · `Không mong đợi` · `Tiêu chí đánh giá` · `Bối cảnh`.
- Đánh dấu ⚑ những yêu cầu đụng danh sách "không được hứa" trong `hanas-product.md`, và những yêu cầu mình định để ngoài phạm vi.
- Đếm số yêu cầu theo từng mục tài liệu, ví dụ "§8: 8 · §16: 17 · PL1: 40", để anh kiểm nhanh có sót mục nào không.

### 2.2 Tổng hợp 9 mục

Ghép xong bảng R thì gọi `proposal-fit-analyst` chạy nền, rồi em tổng hợp 9 mục trong lúc chờ. Có `fit.md` thì bổ sung ⚑ và đưa các dòng `Phát triển`, `Không đáp ứng`, `Chưa rõ` vào mục 9.

Điền đủ 9 mục trong phần **Tổng hợp yêu cầu**. Mỗi gạch đầu dòng ngắn, kèm mã R và nhãn [T] (trích) hoặc [S] (em suy ra). Mục nào tài liệu không nói thì ghi "Tài liệu không nêu" và đưa vào mục 9.

| Mục | Tìm ở đâu trong tài liệu khách | Lưu ý khi đọc |
|---|---|---|
| 1. Mục tiêu | Purpose, Mục tiêu dự án đầu tư, Bối cảnh | Tách mục tiêu kinh doanh (vì sao) khỏi hạng mục mua sắm (mua gì). |
| 2. Yêu cầu | Yêu cầu chức năng/kỹ thuật, Required outcomes, yêu cầu kiểm thử, bảo hành, đào tạo | Chia 2.1 chức năng / 2.2 phi chức năng / 2.3 dịch vụ. Ngưỡng định lượng (thời gian chạy, SLA phản hồi, số học viên, số ngày) ghi đủ số. |
| 3. Phạm vi | Bảng phạm vi, tiến độ cung cấp, danh mục báo cáo, nhân sự chủ chốt | Đếm được thì đếm. Tiến độ ghi đúng cách khách tính (ví dụ "N ngày kể từ hợp đồng có hiệu lực"). Nhân sự khách quy định là giới hạn `team_max`. |
| 4. Công nghệ | Môi trường hiện tại, yêu cầu tương thích, hạ tầng tham khảo | Phân rõ **bắt buộc** (định dạng, chuẩn, mô hình triển khai, xác thực) với **khách đang có** và **mở cho vendor đề xuất**. Khách mở nhưng đã có sẵn nền tảng thì phải so sánh với cái sẵn có. |
| 5. Kết quả | Expected outcome, Kết quả dự kiến, danh mục tài liệu/biên bản bàn giao | Ghi cả outcome lẫn sản phẩm bàn giao, kèm điều kiện nghiệm thu. |
| 6. Nên làm | Phần "should", "preference", "vendor may propose", tiêu chí cộng điểm | Gồm cả ưu tiên ngầm, ví dụ khách nhấn mạnh "đội nhỏ tự vận hành được" thì nên chọn giải pháp đơn giản. |
| 7. Không nên làm | "What X does not expect", "không được", điều kiện loại | Thêm điều cấm suy ra từ yêu cầu bắt buộc, ghi [S]. Ví dụ "cấu phần phải thay thế được" suy ra không khóa khách vào công cụ độc quyền; "không đề xuất 1 người cho nhiều vị trí" suy ra bảng nhân sự phải tách người. |
| 8. Tiêu chí đánh giá | Key questions, tiêu chí đánh giá, tiêu chí lợi thế | Không có thì suy từ mục tiêu, ghi [S]. |
| 9. Khoảng trống | Toàn bộ | Xem danh sách dấu hiệu bên dưới. |

Dấu hiệu phải đưa vào mục 9:

- Danh mục "báo cáo" có dòng thực chất là **chức năng ứng dụng** (tra cứu có nhập liệu, quy trình xử lý case, cập nhật trạng thái, gửi email). Effort khác hẳn báo cáo.
- Báo cáo hoặc chức năng cần **nguồn ngoài nguồn chính** (trang nhật ký, JIRA, hệ thống khác cần tích hợp).
- Khách nói thông tin chi tiết **sẽ cung cấp sau** (mapping, BRD, quy tắc đối soát, tần suất). Ghi giả định em sẽ dùng để ước lượng.
- Mâu thuẫn giữa các mục: hai mốc tiến độ khác nhau, số lượng không khớp, thuật ngữ dùng hai nghĩa.
- Ngưỡng hiệu năng hoặc SLA mà Hanas chưa chắc đạt.
- Tài liệu nhắc hạ tầng dự phòng (TTDL dự phòng, DR, sao lưu) mà không nói rõ phạm vi: hỏi anh, mặc định đề xuất phương án DR thay vì để ngoài phạm vi.
- Mọi dòng ⚑.

Thuật ngữ, từ viết tắt nghiệp vụ của khách thì ghi vào bảng **Thuật ngữ của khách**. Không ghi vào `${CLAUDE_PLUGIN_ROOT}/CONTEXT.md`, vì đó là thuật ngữ của repo.

### 2.3 Dừng lại cho anh xem

Trước khi báo, lấy ngẫu nhiên 10 đoạn trong tài liệu khách (mỗi đoạn một gạch đầu dòng hoặc dòng bảng), kiểm từng đoạn có đủ ý trong `01-requirements.md` không, kể cả cụm bổ nghĩa. Thiếu ý nào thì sửa dòng R và lấy thêm 10 đoạn. Review vòng 1 của một gói thầu thật bắt được 3 dòng R sót ý bằng đúng cách này.


Báo anh: số trang đã đọc, số yêu cầu theo mục, 9 mục tổng hợp (mỗi mục 2–4 dòng chính), và số điểm trong mục 9. Anh xem xong mới sang bước 3.

## 3. Interview anh để chốt

Interview theo cách của skill `grill-me` (Matt Pocock): hỏi từng câu, mỗi câu kèm đề xuất của em, đi lần lượt từng nhánh quyết định. Skill này chỉ anh gõ được (`/grill-me`); em không gọi được thì tự hỏi theo đúng cách đó. Danh sách câu hỏi lấy từ **mục 9** và các dòng [S] quan trọng, cộng các tham số dưới đây nếu tài liệu chưa trả lời. Áp dụng thêm cách làm của skill `domain-modeling` khi gặp thuật ngữ mơ hồ: đề xuất một nghĩa chính xác, đưa một tình huống cụ thể để anh chọn (ví dụ "Báo cáo #36 có cho người dùng nhập kết quả xác minh không, hay chỉ xem?").

- **Tối đa 7–9 câu.** Chọn những điểm ảnh hưởng phạm vi, effort hoặc có thể làm loại hồ sơ. Các điểm nhỏ còn lại em tự đặt giả định theo đề xuất của mình, gom vào **một câu cuối** để anh duyệt cả danh sách một lần.
- **Hồ sơ thầu (loại B):** đề xuất của em không được thu hẹp yêu cầu bắt buộc của E-HSMT (giới hạn số vòng, ngưỡng có ngoại lệ, change request cho mục khách đã yêu cầu). Phương án mặc định là "đáp ứng đủ, điều kiện chỉ là căn cứ thiết kế, rủi ro tính vào giá". Nếu anh vẫn muốn thu hẹp thì nói rõ rủi ro bị chấm không đạt. Xem dòng "Nguyên tắc hồ sơ thầu" trong `${CLAUDE_PLUGIN_ROOT}/knowledge/hanas-commercial.md`.
- Hỏi **từng câu một**, câu quan trọng nhất trước (câu ảnh hưởng phạm vi và effort nhiều nhất). Mỗi câu kèm đề xuất của em và căn cứ (mã R, mục tài liệu).
- Chia câu hỏi làm 2 nhóm. **Câu về sản phẩm Hanas** (giấy phép, SLA hãng, bản OSS/Enterprise, tính năng có hay chưa) ghi vào `${CLAUDE_PLUGIN_ROOT}/knowledge/hanas-commercial.md` để khách sau dùng lại; trước khi hỏi, đọc file này, câu nào đã có thì không hỏi lại. **Câu riêng của khách** ghi vào `01-requirements.md`.
- Câu tài liệu đã trả lời thì không hỏi, chỉ liệt kê một lần để anh xác nhận.
- Anh trả lời câu nào thì **cập nhật ngay** `01-requirements.md`: chuyển ý đó từ mục 9 sang mục tương ứng, nhãn [C dd/mm]. Không gom cuối buổi.
- Dừng khi mục 9 chỉ còn những câu anh quyết định để làm giả định trong proposal (ghi rõ "Giả định: …").

Tham số phải chốt:

1. Loại tài liệu (A: đề xuất giải pháp / B: hồ sơ thầu) và tên viết tắt của khách.
2. **Hạn nộp hồ sơ (`submit_by`), kickoff, deadline, các mốc bắt buộc** (go-live từng đợt, nghiệm thu). Không có trong tài liệu thì hỏi. **Không suy ra từ dự án khác.**
3. Phạm vi: trong / ngoài phạm vi, nguồn dữ liệu, số lượng đếm được (báo cáo, domain, dashboard…).
4. Mô tả Hanas theo bản nào: **bản mới** trong `hanas-product.md` (Dremio, dbt Studio, Catalog…) là mặc định. Nếu khách đã nhận tài liệu bản cũ (NiFi, Airflow, Ranger…) thì hỏi anh.
5. Giới hạn đội ngũ (số người tối đa mỗi vai trò), nếu khách hoặc E-HSMT có quy định.
6. Khách cần những tính năng nào nằm trong danh sách "không được hứa" → đưa vào phạm vi phát triển, ghi rõ.

Ghi kết quả vào `00-params.txt` (kickoff, deadline, holidays, team_max, milestones, stale_terms). Nhắc anh xác nhận ngày lễ và Tết của năm triển khai.

## 4. Viết proposal (song song theo nhóm mục)

- Em lập dàn ý `02-proposal.md` theo khung trong `${CLAUDE_PLUGIN_ROOT}/knowledge/proposal-format.md`: danh sách mục, mỗi mục trả lời những R nào. Mọi R phải có một mục nhận.
- Dàn ý loại B theo bảng khung ở mục 3 của `proposal-format.md` (rút từ một proposal loại B đã nộp): đủ mô hình dữ liệu, DR, tích hợp hệ thống hiện có, phân tích chức năng theo lớp, giai đoạn có Mục tiêu / Nội dung / Kết quả. Danh mục báo cáo chép nguyên mô tả của phụ lục.
- Chia dàn ý thành 3–5 nhóm mục, mỗi nhóm một `proposal-section-writer`, gọi song song. Mỗi agent ghi `02-proposal.parts/<nn>-<tên>.md` và tự rà câu chữ bằng skill `humanizer`.
- Phần tóm tắt (mục 1 loại A, mục I loại B) và bảng "Vị trí trả lời các nội dung RFP" em viết **sau cùng**, vì phụ thuộc mọi mục khác.
- Ghép các phần thành `02-proposal.md`, thêm front matter điền trang bìa (xem đầu file `${CLAUDE_PLUGIN_ROOT}/scripts/md2docx.py`). Đọc một lượt cả bài để nối mạch, bỏ trùng lặp giữa các phần, thống nhất thuật ngữ.
- Quy tắc nội dung vẫn như cũ: ngày **chỉ tính từ `00-params.txt`** (tuần T1 = tuần chứa kickoff); nhân sự khớp `team_max`; giá để "[…]"; viết theo `01-requirements.md`, không theo trí nhớ về RFP. Mục 6–7 của phần tổng hợp đi vào mục "Những điều đề xuất này không làm" và phần nguyên tắc tiếp cận; mục 9 còn lại đi vào giả định. Mục nào khách yêu cầu giải thích nhiều ý thì trình bày bằng bảng, mỗi ý một dòng.

## 5. Rà lại từng yêu cầu

Mở lại `01-requirements.md` và xét từng dòng:

- **Trả lời tại**: chỉ ghi **một** mục cụ thể, ví dụ `Mục 5.2`. Không ghi khoảng như "Mục 5–11", không ghi cả chương.
- **Trả lời tóm tắt**: chép câu trả lời từ đúng mục đó, tối đa 1 câu. Nếu không chép ra được câu nào trả lời **đúng ý yêu cầu**, tức là mục đó trả lời chưa tới: quay lại sửa proposal, không sửa câu tóm tắt cho khớp.
- Yêu cầu loại `Câu hỏi` phải được trả lời thẳng, có con số hoặc ngày nếu khách hỏi về thời điểm.

## 6. Kiểm tra tự động

```bash
python3 ${CLAUDE_PLUGIN_ROOT}/scripts/check_plan.py projects/<kh>/00-params.txt - projects/<kh>/02-proposal.md
```

Sửa tới khi `KẾT QUẢ: ĐẠT`. Lỗi máy bắt được thì sửa trước, để vòng review tập trung vào nội dung.

## 7. Review nghiêm ngặt trước khi gửi khách

Gọi **cùng lúc** 5 agent: `proposal-reviewer-coverage` (đủ và đúng ý từng R), `proposal-reviewer-hanas` (không hứa quá sản phẩm), `proposal-reviewer-consistency` (số, ngày, nhân sự, tên), `proposal-reviewer-client` (đóng vai người chấm phía khách), `proposal-reviewer-style` (câu chữ theo humanizer).

1. Gộp kết quả vào `projects/<kh>/02-review.md`: mỗi vòng một mục `## Vòng n`, bảng `| Mức | Reviewer | Vị trí | Vấn đề | Đã xử lý |`, kết bằng dòng `CÒN LẠI: CRITICAL <n> · HIGH <n>` (không tính ô `[…]` chờ thông tin thật).
2. Giao `proposal-fixer` sửa (một agent cho cả file, chạy bằng `codex-agent`). Sửa **mọi** CRITICAL và HIGH; MEDIUM sửa khi hợp lý, không sửa thì ghi lý do; LOW tùy. Sửa nội dung proposal, không sửa yêu cầu hay params để lách.
3. Vòng sau chỉ chạy lại những reviewer còn CRITICAL/HIGH, cộng `proposal-reviewer-consistency` (vì sửa chỗ này dễ lệch chỗ khác). Tối đa 3 vòng. Hết 3 vòng vẫn còn CRITICAL/HIGH thì dừng, báo anh từng lỗi.
4. Hết CRITICAL/HIGH thì trình anh: số lỗi đã sửa theo mức, MEDIUM để lại và lý do, nhận xét của `proposal-reviewer-client` (3 điểm mạnh, 3 điểm yếu, câu khách có thể hỏi). **Anh đồng ý** thì em mới ghi dòng cuối `KẾT LUẬN: ĐẠT` vào `02-review.md`.

## 8. Xuất file

```bash
python3 ${CLAUDE_PLUGIN_ROOT}/scripts/md2docx.py projects/<kh>/02-proposal.md projects/<kh>/02-proposal.docx
```

Script không xuất nếu `02-review.md` chưa có `KẾT LUẬN: ĐẠT`. Cần bản nháp nội bộ trước khi review thì thêm `--draft` (ra file `-NHAP.docx`, không gửi khách).

## Hoàn thành khi

- [ ] Đã đọc hết mọi trang của mọi file (ghi ở đầu `01-requirements.md`).
- [ ] Mọi bullet, mọi dòng bảng của tài liệu khách đều có trong `01-requirements.md` (đã báo anh số yêu cầu theo từng mục).
- [ ] Đủ 9 mục tổng hợp, không mục nào trống; mục 9 chỉ còn giả định anh đã đồng ý.
- [ ] Mọi dòng có "Trả lời tại" trỏ tới một mục có thật, và "Trả lời tóm tắt" trả lời đúng ý yêu cầu. `check_plan.py` kiểm phần mục có thật.
- [ ] Không còn `TODO`, `???` hay `<...>` trong proposal.
- [ ] `check_plan.py` (chế độ chỉ proposal) in `KẾT QUẢ: ĐẠT`, và anh đã xem từng dòng WARN.
- [ ] `02-review.md` có `KẾT LUẬN: ĐẠT`: 5 reviewer không còn CRITICAL/HIGH và anh đã duyệt.
- [ ] Đã sinh `02-proposal.docx`. Báo anh: đường dẫn file, danh sách giả định đã đưa vào, các câu hỏi còn mở.
