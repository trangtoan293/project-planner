---
name: auto-presale
description: Chạy tự động trọn quy trình presales cho projects/<kh>/ từ tài liệu khách tới proposal .docx, WBS và master plan, không dừng hỏi anh. Dùng khi anh gõ /auto-presale <kh>, thường kèm /goal để chạy tới khi scripts/check_auto.py in "AUTO: ĐẠT".
disable-model-invocation: true
---

# Chạy tự động trọn quy trình (autonomous e2e)

Làm đúng các bước của `/write-proposal`, `/analyze-proposal`, `/master-plan` (đọc 3 skill đó, mọi quy tắc của chúng vẫn áp dụng), **trừ** những điểm khác dưới đây. Mọi agent chạy bằng `${CLAUDE_PLUGIN_ROOT}/scripts/codex_agent.sh` từ thư mục làm việc (nơi có `projects/`), chạy nền song song khi các việc độc lập; footer AGENTS theo dõi.

Cách dùng khuyên dùng (Claude tự làm tiếp qua nhiều lượt đến khi đạt):

```
/goal python3 ${CLAUDE_PLUGIN_ROOT}/scripts/check_auto.py <kh> in ra "AUTO: ĐẠT"
/auto-presale <kh>
```

## Khác với chạy tay

1. **Không dừng hỏi anh.** Bỏ bước 2.3 ("dừng cho anh xem") và bước 3 (interview) của `/write-proposal`, bước 2.1 (duyệt milestone) và bước 3 (duyệt) của `/analyze-proposal`, bước 2 (chốt danh sách đầu việc với đội) và bước 5 (hỏi anh) của `/master-plan`.
2. **Tự chốt thay cho interview.** Với từng điểm ở mục 9 của `01-requirements.md` và mỗi tham số phải chốt, chọn phương án em sẽ ghi "(Recommended)" nếu hỏi anh, theo thứ tự ưu tiên:
   - Dòng đã chốt trong `${CLAUDE_PLUGIN_ROOT}/knowledge/<sp>-commercial.md` (giấy phép, K8S, CDC, view bảo mật…) và dòng [C] có sẵn trong `01-requirements.md`.
   - Hồ sơ thầu (loại B): **đáp ứng đủ yêu cầu bắt buộc**, điều kiện chỉ là căn cứ thiết kế, rủi ro tính vào giá; không giới hạn vòng, không ngoại lệ ngưỡng, không change request cho mục khách đã yêu cầu. DR: đề xuất phương án khi tài liệu nhắc hạ tầng dự phòng.
   - Ngày: `kickoff` trong `00-params.txt` nếu anh đã điền; nếu chưa, lấy theo tài liệu khách (ví dụ N1 = ngày hợp đồng có hiệu lực) và giả định thứ Hai đầu tiên sau 3 tuần kể từ hôm nay. Deadline, mốc tính từ đó.
   - Không tự thêm cam kết thương mại (miễn phí, giảm giá) ngoài tính năng có sẵn trong sản phẩm.

   Ghi mỗi điểm vào `01-requirements.md` với nhãn **`[D dd/mm]`** (draft tự chốt), và vào `00-auto-summary.md` mục "Quyết định tự chốt" (điểm · phương án · lý do · nếu anh không đồng ý thì sửa ở đâu).
3. **Review tự động đến khi sạch.** Bước 7 của `/write-proposal`: 4 reviewer song song → `proposal-fixer` → vòng 2 chỉ một `proposal-reviewer-consistency` kiểm các lỗi đã sửa; còn lỗi thì em tự sửa, không gọi thêm vòng. Mỗi vòng trong `02-review.md` kết bằng dòng `CÒN LẠI: CRITICAL <n> · HIGH <n>` (không tính ô `[…]` chờ thông tin thật). Khi vòng cuối là `CRITICAL 0 · HIGH 0` thì ghi `KẾT LUẬN: ĐẠT (tự động, anh xem 00-auto-summary.md trước khi gửi khách)` rồi xuất `02-proposal.docx`. Sau vòng 2 vẫn còn lỗi em không sửa được thì không ghi kết luận, ghi lỗi còn lại vào `00-auto-summary.md` và dừng.
4. **WBS:** `wbs-drafter` làm liền bước 2.1 và 2.2 trong một lượt (milestone tự chốt theo quy tắc 2.1, ghi vào "Quyết định tự chốt") → `wbs-reviewer`; còn CRITICAL/HIGH thì chạy lại `wbs-drafter` với danh sách lỗi, tối đa 2 vòng.
5. **Master plan:** `plan-builder` làm liền hai lượt (vẫn sinh `03-task-list.xlsx` để anh gửi đội rà sau); xong em chạy lại `check_plan.py ... | tee 04-check.txt` để xác nhận. Lệch với proposal ghi vào `00-auto-summary.md`, không tự sửa proposal sau khi đã có `KẾT LUẬN: ĐẠT` (sửa thì phải review lại).
6. **Chạy agent:** mặc định reasoning `high`, timeout 15 phút mỗi agent. Agent quá giờ hoặc lỗi thì chạy lại một lần; lần hai vẫn lỗi thì ghi vào `00-auto-summary.md` và làm phần đó bằng subagent Claude (sonnet).

## `00-auto-summary.md`

```
# Chạy tự động: <kh> (<ngày>)
## Kết quả
- proposal .docx, WBS (tổng MD), master plan (kickoff → kết thúc), check_auto
## Quyết định tự chốt
| Điểm | Phương án đã chọn | Lý do | Sửa ở đâu nếu anh không đồng ý |
## Lỗi còn lại sau review (MEDIUM/LOW, không sửa và lý do)
## Thông tin cần điền khi nộp ([…])
## Thời gian từng bước và agent đã chạy
```

## Hoàn thành khi

- [ ] `python3 ${CLAUDE_PLUGIN_ROOT}/scripts/check_auto.py <kh>` in `AUTO: ĐẠT`.
- [ ] Báo anh: đường dẫn `00-auto-summary.md`, số quyết định tự chốt, tổng MD, kickoff → kết thúc, và nhắc anh xem các dòng `[D]` trước khi gửi khách.
