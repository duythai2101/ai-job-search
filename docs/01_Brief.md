# Vica — Project Brief

**Nền tảng tìm việc thông minh ứng dụng AI cho thị trường Việt Nam**

| | |
|---|---|
| **Tên sản phẩm** | Vica |
| **Loại tài liệu** | Project Brief |
| **Phiên bản** | 1.0 |
| **Ngày** | 13/06/2026 |
| **Trạng thái** | MVP đã triển khai (web app full-stack) |

---

## 1. Tóm tắt điều hành (Executive Summary)

**Vica** là một nền tảng web ứng dụng trí tuệ nhân tạo, giúp người tìm việc tại Việt Nam quản lý trọn vẹn hành trình ứng tuyển trong một công cụ duy nhất: từ **tìm kiếm việc làm** trên nhiều cổng tuyển dụng, **đánh giá độ phù hợp bằng AI**, **xây dựng và tối ưu CV**, **theo dõi tiến độ ứng tuyển**, đến **phân tích thị trường lao động** và **trợ lý AI tư vấn theo ngữ cảnh** trên mọi trang.

Thay vì buộc ứng viên phải mở 4–5 trang tuyển dụng khác nhau, tự đánh giá xem mình có phù hợp hay không, rồi chỉnh sửa CV thủ công và theo dõi đơn ứng tuyển bằng Excel rời rạc — Vica gom toàn bộ quy trình đó vào một luồng làm việc liền mạch, có AI đồng hành ở từng bước.

---

## 2. Bối cảnh & Vấn đề (Problem Statement)

Người tìm việc tại Việt Nam, đặc biệt là sinh viên mới ra trường và người đi làm những năm đầu, đang gặp các điểm đau (pain points) sau:

| # | Vấn đề | Hệ quả |
|---|--------|--------|
| 1 | **Phân mảnh nguồn tin** — tin tuyển dụng nằm rải rác trên VietnamWorks, TopCV, ITviec, CareerViet… | Tốn thời gian tìm trùng lặp, dễ bỏ sót cơ hội tốt |
| 2 | **Không biết mình có phù hợp không** — JD dài, mơ hồ, khó tự đánh giá khách quan | Ứng tuyển tràn lan, tỷ lệ phản hồi thấp, mất động lực |
| 3 | **CV không được tối ưu cho từng vị trí** — dùng một CV chung cho mọi nơi | Bị loại ngay từ vòng lọc hồ sơ (ATS / nhà tuyển dụng) |
| 4 | **Mất kiểm soát pipeline ứng tuyển** — theo dõi bằng trí nhớ hoặc bảng tính | Quên deadline, quên follow-up, không biết đang ở đâu trong quá trình |
| 5 | **Thiếu hiểu biết về thị trường** — không nắm được kỹ năng nào đang "hot", mức lương tham chiếu | Định vị bản thân sai, kỳ vọng lương không thực tế |

**Tóm lại:** quy trình tìm việc hiện tại rời rạc, thủ công và thiếu phản hồi thông minh. Người dùng phải tự xâu chuỗi nhiều công cụ mà không có "người đồng hành" hiểu được ngữ cảnh của họ.

---

## 3. Giải pháp (Solution)

Vica giải quyết các vấn đề trên bằng **một nền tảng hợp nhất, lấy AI làm trung tâm**:

1. **Tổng hợp việc làm đa nguồn** — một ô tìm kiếm trả về kết quả đã gộp và khử trùng lặp từ 4 cổng việc làm Việt Nam.
2. **AI chấm điểm độ phù hợp** — mỗi tin tuyển dụng được đánh giá theo 4 tiêu chí (kỹ năng kỹ thuật, kinh nghiệm, văn hóa & hành vi, định hướng nghề nghiệp), kèm điểm tổng, điểm mạnh, khoảng cách và khuyến nghị cụ thể.
3. **CV Builder thông minh** — tạo CV theo từng vị trí, nhận gợi ý cải thiện từ AI theo từng mục, xuất PDF chuyên nghiệp; AI sinh cả thư xin việc (cover letter).
4. **Theo dõi ứng tuyển dạng Kanban** — toàn bộ pipeline từ Lưu → Ứng tuyển → Phỏng vấn → Offer/Từ chối nằm gọn trong một bảng trực quan.
5. **Phân tích thị trường** — AI tổng hợp dữ liệu việc làm thực tế thành insight về kỹ năng hot, ngành nghề, khoảng lương và địa điểm.
6. **Trợ lý AI nhúng theo ngữ cảnh** — chatbot hiểu được trang người dùng đang xem (tin tuyển dụng, CV, danh sách ứng tuyển…) và tư vấn ngay tại chỗ.

---

## 4. Đối tượng người dùng mục tiêu (Target Audience)

**Người dùng chính:**
- Sinh viên năm cuối / mới tốt nghiệp đang tìm việc đầu tiên hoặc thực tập.
- Người đi làm 0–3 năm kinh nghiệm muốn chuyển việc và cần định hướng.

**Đặc điểm chung:**
- Quen dùng các nền tảng số, kỳ vọng trải nghiệm hiện đại, mượt mà.
- Cần hướng dẫn và phản hồi (feedback) chứ không chỉ một danh sách tin tuyển dụng thô.
- Nhạy cảm về chi phí — ưu tiên công cụ miễn phí.

**Persona tiêu biểu — "Thái, 22 tuổi":** sinh viên CNTT năm cuối, biết React cơ bản, đang rải hồ sơ nhiều nơi nhưng ít phản hồi, không chắc CV của mình đủ tốt chưa và không biết nên ưu tiên vị trí nào. Thái cần một công cụ vừa tìm việc, vừa "soi" hồ sơ giúp, vừa nói cho cậu biết mình đang đứng ở đâu.

---

## 5. Mục tiêu & Giá trị (Goals & Value Proposition)

**Tuyên ngôn giá trị:** *"Tìm việc thông minh, bắt đầu từ hôm nay."* — AI đồng hành toàn bộ hành trình tìm việc, trong một nền tảng duy nhất, hoàn toàn miễn phí.

**Mục tiêu sản phẩm:**
- Giảm thời gian tìm và sàng lọc việc làm phù hợp (một ô tìm kiếm thay vì nhiều trang).
- Tăng chất lượng hồ sơ ứng tuyển nhờ AI đánh giá và tối ưu CV theo từng vị trí.
- Giúp người dùng kiểm soát toàn bộ pipeline ứng tuyển, không bỏ sót cơ hội.
- Mang lại sự tự tin và định hướng thông qua phản hồi AI khách quan, theo ngữ cảnh.

---

## 6. Phạm vi MVP (Scope)

### Trong phạm vi (In scope) — đã triển khai
- Đăng ký / đăng nhập (Supabase Auth).
- Onboarding: upload CV → AI bóc tách → tạo hồ sơ.
- Tìm kiếm việc làm đa nguồn + bộ lọc.
- Trang chi tiết việc làm + AI đánh giá độ phù hợp.
- CV Builder: tạo/sửa/xóa CV, gợi ý AI theo mục, xuất PDF, sinh cover letter.
- Theo dõi ứng tuyển: Kanban + dạng bảng.
- Dashboard tổng quan + Phân tích thị trường.
- Trợ lý AI nhúng theo ngữ cảnh trên mọi trang.
- Quản lý hồ sơ cá nhân (học vấn, kinh nghiệm, kỹ năng).

### Ngoài phạm vi (Out of scope) — giai đoạn sau
- Ứng dụng di động native (hiện là web responsive).
- Nộp đơn trực tiếp tới nhà tuyển dụng từ trong Vica (one-click apply).
- Tài khoản dành cho nhà tuyển dụng / đăng tin.
- Tính năng cộng đồng, mạng lưới (networking), gợi ý mentor.
- Thanh toán / gói trả phí (premium).

---

## 7. Kiến trúc & Công nghệ (Tech Stack tổng quan)

| Lớp | Công nghệ |
|-----|-----------|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Radix UI, Framer Motion, Recharts |
| **Backend** | FastAPI (Python), Uvicorn |
| **Cơ sở dữ liệu & Auth** | Supabase (PostgreSQL + JWT Auth + Row-Level Security) |
| **AI** | Google Gemini (đánh giá độ phù hợp, phân tích CV, sinh cover letter, chat theo ngữ cảnh, phân tích thị trường, bóc tách CV) |
| **Thu thập dữ liệu việc làm** | Scraper riêng cho 4 cổng (BeautifulSoup4 + httpx) |
| **Xuất PDF** | WeasyPrint (HTML → PDF) |

**Nguồn việc làm tích hợp:** VietnamWorks, TopCV, ITviec, CareerViet.

---

## 8. Định hướng thiết kế (Design Direction)

- **Phong cách:** tối giản, đơn sắc, chuyên nghiệp — nền sáng, điểm nhấn `slate-900` (đen mực) cùng một màu nhấn xanh (blue) tiết chế.
- **Landing page:** concept "cinematic dark → light editorial" — hero nền tối với hiệu ứng aurora, spotlight bám chuột, headline động (kinetic typography), mockup dashboard 3D nghiêng theo chuột; phần thân sáng với bento grid và số liệu đếm tăng.
- **App nội bộ:** giao diện phẳng, nhiều khoảng trắng, sidebar thu gọn/mở rộng khi hover, panel AI trượt mượt từ cạnh phải.
- **Nguyên tắc trải nghiệm:** mượt mà, mềm mại, chuyển động có chủ đích (Framer Motion); nhất quán hệ thống thiết kế giữa landing page và các trang bên trong.

---

## 9. Chỉ số thành công (Success Metrics — đề xuất)

| Nhóm | Chỉ số |
|------|--------|
| **Kích hoạt (Activation)** | % người dùng hoàn tất onboarding (upload CV thành công) |
| **Tương tác (Engagement)** | Số lượt đánh giá độ phù hợp / người dùng; số CV được tạo; số phiên chat AI |
| **Giá trị cốt lõi** | % việc làm được lưu/ứng tuyển sau khi đánh giá; tỷ lệ chuyển từ "Ứng tuyển" → "Phỏng vấn" |
| **Giữ chân (Retention)** | Tỷ lệ quay lại theo tuần; số ứng tuyển đang active / người dùng |
| **Hài lòng** | Đánh giá định tính về chất lượng gợi ý AI |

---

## 10. Rủi ro & Giả định (Risks & Assumptions)

| Rủi ro | Giảm thiểu |
|--------|------------|
| Cấu trúc HTML của cổng việc làm thay đổi làm hỏng scraper | Thiết kế scraper theo module, dễ cập nhật từng cổng; cơ chế khử trùng lặp theo URL |
| Chất lượng/độ chính xác phản hồi AI | Prompt có cấu trúc theo từng tác vụ; luôn truyền hồ sơ người dùng làm ngữ cảnh |
| Phụ thuộc dịch vụ bên thứ ba (Gemini, Supabase) | Tách lớp service rõ ràng, có thể thay thế nhà cung cấp |
| Quyền truy cập / pháp lý khi scrape | Giới hạn tần suất, chỉ lấy dữ liệu công khai phục vụ cá nhân hóa cho người dùng |

**Giả định:** người dùng sẵn sàng upload CV để nhận giá trị cá nhân hóa; thị trường có đủ tin tuyển dụng công khai để scrape; AI đủ tốt để tạo phản hồi hữu ích theo ngữ cảnh tiếng Việt.

---

*Tài liệu này đi kèm với: **PRD** (yêu cầu sản phẩm chi tiết) và **Wireframe / UI Flow** (luồng màn hình và bố cục giao diện).*
