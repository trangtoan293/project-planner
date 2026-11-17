---
name: actuals
description: Theo dõi dự án Hanas sau khi ký bằng Commercial Toolkit. Đóng băng Baseline từ Quote Version đã ký, phát mẫu chấm công, báo cáo lệch effort (theo dòng WBS, CR, rút dự phòng, tuần thiếu chấm công, margin thực tế), đóng dự án, hiệu chỉnh Norm Library. Dùng khi anh gõ /actuals <mã báo giá>, hoặc nói đã ký hợp đồng, kickoff, chấm công, dự án lệch bao nhiêu, nghiệm thu xong, hiệu chỉnh định mức.
---

# Đối chiếu ước lượng và thực tế

Tìm `TK` như bước 0 của skill `quote`; mọi lệnh chạy từ `$TK`. Dự án nằm ở `$TK/projects/<mã báo giá>/`, khác với `projects/<kh>/` của planner.

| Lúc | Việc |
|---|---|
| Ký hợp đồng | `init`: đóng băng Baseline, tạo mẫu chấm công |
| Hằng tuần | `report`: dashboard lệch effort |
| Nghiệm thu tổng thể xong | `close` |
| Có dự án mới đóng | `calibrate`: đề xuất sửa Norm |

## Ký hợp đồng

1. Hỏi anh phiên bản nào được ký; không mặc định là phiên bản mới nhất. Phiên bản đó phải đã sinh Excel (có `<mã>-v<N>-snapshot.json`), chưa có thì làm `/quote` trước.
2. Baseline không tạo lại được, nên nhắc anh xác nhận phiên bản rồi mới chạy:

   ```bash
   python3 toolkit/actuals.py init quotes/<mã>/v<N>.toml
   ```

3. Nhắc anh phát `projects/<mã>/timesheet.xlsx` cho đội ngay từ kickoff: mỗi người ghi MD hằng tuần theo dòng WBS hoặc mã CR, PM duyệt. Tuần đã qua không dựng lại được.

Thay đổi phạm vi sau khi ký đi qua Change Request (`CR-001`…), chấm công theo mã CR; không sửa Baseline.

## Báo cáo hằng tuần

```bash
cd "$TK/toolkit" && python3 -c "import json,sys,actuals; print(json.dumps(actuals.report(sys.argv[1])[1], ensure_ascii=False, default=str, indent=1))" ../projects/<mã>
```

Lệnh ghi lại `projects/<mã>/dashboard.xlsx` và in số. Trình anh:

- MD Baseline, MD thực tế trong phạm vi, dự phòng đã rút trên tổng dự phòng (`reserve_drawn` / `reserve_md`).
- Các dòng WBS lệch quá 30% (`variance_pct`, đúng ngưỡng tô đỏ của dashboard), lệch nhiều nhất trước.
- MD của từng CR.
- Tuần thiếu chấm công (`missing`) và dòng PM chưa duyệt (`unapproved`): phải đòi đội ghi, không điền bằng số ước lượng.
- Margin thực tế (`margin_pct`, chỉ có khi có Rate Card): chỉ nói với anh.
- Dòng `⚠`: lỗi trong `timesheet.xlsx`, chỉ rõ ô cần sửa.

## Nghiệm thu xong

Chỉ chạy khi anh xác nhận đã nghiệm thu tổng thể:

```bash
python3 toolkit/actuals.py close projects/<mã>
```

## Hiệu chỉnh định mức

```bash
python3 toolkit/actuals.py calibrate      # ra projects/norm-calibration.xlsx
```

Quy tắc của toolkit: chỉ dùng chấm công đã duyệt; dự án lệch quá 30% ở một WP chỉ dùng để rút kinh nghiệm; Norm đề xuất là trung vị khi có từ 3 dự án cùng lệch một hướng.

Trình anh các đề xuất. **Không tự sửa `data/estimation/norms.csv`.** Anh duyệt rồi mới sửa `norms.csv`, đổi `norm_library_version` trong `data/estimation/params.csv`, sau đó cập nhật `knowledge/estimation.md` §3 (số thực tế) và §5 của plugin.
