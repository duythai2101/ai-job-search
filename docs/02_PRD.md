# Vica — Product Requirements Document (PRD)

**Nền tảng tìm việc thông minh ứng dụng AI**

| | |
|---|---|
| **Sản phẩm** | Vica |
| **Loại tài liệu** | Product Requirements Document (PRD) |
| **Phiên bản** | 1.0 |
| **Ngày** | 13/06/2026 |
| **Trạng thái** | MVP đã triển khai |

---

## 1. Mục tiêu tài liệu

PRD này mô tả chi tiết các yêu cầu chức năng và phi chức năng của Vica, làm cơ sở để phát triển, kiểm thử và nghiệm thu sản phẩm. Tài liệu phản ánh phạm vi MVP đã được hiện thực trong mã nguồn.

---

## 2. Tổng quan sản phẩm

Vica là web app full-stack gồm:
- **Frontend** Next.js 14 (App Router) — giao diện người dùng.
- **Backend** FastAPI — REST API + xử lý AI + scraping.
- **Supabase** — PostgreSQL, Auth (JWT), Row-Level Security.
- **Google Gemini** — toàn bộ tính năng AI.

Hệ thống phục vụ một loại người dùng: **ứng viên tìm việc** (job seeker). Mọi dữ liệu được phân tách theo người dùng nhờ RLS.

---

## 3. Personas & User Roles

| Vai trò | Mô tả | Quyền |
|--------|-------|------|
| **Khách (Guest)** | Chưa đăng nhập | Xem landing page, đăng ký, đăng nhập |
| **Người dùng (Authenticated user)** | Đã đăng nhập & hoàn tất onboarding | Toàn quyền với dữ liệu của chính mình: tìm việc, đánh giá, CV, ứng tuyển, chat, hồ sơ |
| **Người dùng chưa onboard** | Đã đăng nhập, chưa hoàn tất onboarding | Bị middleware chuyển hướng về `/onboarding` |

---

## 4. User Stories (Câu chuyện người dùng)

1. *Là ứng viên,* tôi muốn **upload CV và để AI tạo hồ sơ tự động** để không phải nhập liệu thủ công.
2. *Là ứng viên,* tôi muốn **tìm việc trên nhiều cổng cùng lúc** để tiết kiệm thời gian.
3. *Là ứng viên,* tôi muốn **AI chấm điểm độ phù hợp của tôi với một tin tuyển dụng** để quyết định có nên ứng tuyển không.
4. *Là ứng viên,* tôi muốn **tạo CV riêng cho từng vị trí và nhận gợi ý cải thiện** để tăng tỷ lệ qua vòng lọc.
5. *Là ứng viên,* tôi muốn **AI viết thư xin việc** dựa trên tin tuyển dụng và hồ sơ của tôi.
6. *Là ứng viên,* tôi muốn **theo dõi tất cả đơn ứng tuyển trên một bảng Kanban** để không bỏ sót.
7. *Là ứng viên,* tôi muốn **xem phân tích thị trường** (kỹ năng hot, mức lương) để định vị bản thân.
8. *Là ứng viên,* tôi muốn **hỏi trợ lý AI ngay trên trang đang xem** để được tư vấn theo đúng ngữ cảnh.
9. *Là ứng viên,* tôi muốn **xem tổng quan tiến độ tìm việc** trên dashboard để biết mình đang ở đâu.

---

## 5. Yêu cầu chức năng (Functional Requirements)

### FR-1. Xác thực & Onboarding

| ID | Yêu cầu | Mô tả |
|----|---------|-------|
| FR-1.1 | Đăng ký | Người dùng đăng ký bằng email/mật khẩu qua Supabase Auth (`/auth/register`) |
| FR-1.2 | Đăng nhập | Đăng nhập qua Supabase (`/auth/login`); phiên lưu bằng cookie JWT |
| FR-1.3 | Bảo vệ route | Middleware chặn người chưa đăng nhập khỏi các trang trong app, chuyển hướng về `/auth/login` |
| FR-1.4 | Chuyển hướng onboarding | Người dùng chưa hoàn tất onboarding bị chuyển về `/onboarding` |
| FR-1.5 | Upload & bóc tách CV | Người dùng upload file CV (PDF/TXT); API `POST /onboarding/parse-cv` dùng AI trích xuất tên, kỹ năng, các mục và gợi ý, tạo hồ sơ |
| FR-1.6 | Kéo-thả & bỏ qua | Hỗ trợ kéo-thả file; có thể "Bỏ qua" bước onboarding |

### FR-2. Tìm kiếm việc làm

| ID | Yêu cầu | Mô tả |
|----|---------|-------|
| FR-2.1 | Tìm kiếm đa nguồn | `GET /jobs/search` thu thập song song từ VietnamWorks, TopCV, ITviec, CareerViet theo từ khóa & địa điểm |
| FR-2.2 | Khử trùng lặp | Kết quả gộp và loại trùng theo URL trước khi hiển thị |
| FR-2.3 | Bộ lọc nguồn | Lọc theo cổng việc làm (chip filter) |
| FR-2.4 | Gợi ý tìm nhanh | Hiển thị các từ khóa tìm kiếm nhanh |
| FR-2.5 | Danh sách kết quả | Mỗi việc làm hiển thị: logo công ty, tiêu đề, công ty, badge nguồn/remote, lương, địa điểm, kỹ năng |
| FR-2.6 | Lưu việc làm | Người dùng có thể bookmark; `GET /jobs/saved` liệt kê việc đã lưu |
| FR-2.7 | Đánh dấu đã xem | `POST /jobs/{id}/mark-seen` để theo dõi và khử trùng |

### FR-3. Chi tiết việc làm & Đánh giá độ phù hợp (AI)

| ID | Yêu cầu | Mô tả |
|----|---------|-------|
| FR-3.1 | Xem chi tiết | `GET /jobs/{id}` hiển thị mô tả, yêu cầu, phúc lợi, kỹ năng, lương |
| FR-3.2 | Đánh giá độ phù hợp | `POST /jobs/{id}/evaluate-fit` trả về điểm 4 tiêu chí (kỹ năng kỹ thuật, kinh nghiệm, văn hóa & hành vi, định hướng nghề nghiệp), điểm tổng (0–100), verdict, điểm mạnh, khoảng cách, khuyến nghị |
| FR-3.3 | Hiển thị trực quan | Mỗi tiêu chí hiển thị bằng thanh điểm; điểm mạnh/khoảng cách dạng danh sách |
| FR-3.4 | Lưu vào tracker | Từ trang chi tiết, người dùng lưu việc làm vào danh sách ứng tuyển kèm điểm fit |
| FR-3.5 | Mở chat theo ngữ cảnh | Nút "Hỏi AI về chiến lược ứng tuyển" mở panel chat với ngữ cảnh việc làm này |

### FR-4. CV Builder

| ID | Yêu cầu | Mô tả |
|----|---------|-------|
| FR-4.1 | Danh sách CV | `GET /cv/` liệt kê CV (tiêu đề, vị trí/công ty mục tiêu, cờ "CV chính", ngày cập nhật) |
| FR-4.2 | Tạo CV | `POST /cv/` tạo CV mới với các mục mặc định (mục tiêu nghề nghiệp, kinh nghiệm, học vấn, kỹ năng) |
| FR-4.3 | Chỉnh sửa CV | `PATCH /cv/{id}` cập nhật các mục và sinh lại HTML |
| FR-4.4 | Xóa CV | `DELETE /cv/{id}` (có xác nhận) |
| FR-4.5 | Xuất PDF | `GET /cv/{id}/pdf` xuất CV ra PDF (WeasyPrint) |
| FR-4.6 | Phân tích CV bằng AI | `POST /cv/{id}/analyze` gợi ý cải thiện theo từng mục (loại: weakness/keyword/reframe/add/remove) |
| FR-4.7 | Quản lý gợi ý | `GET /cv/{id}/suggestions` liệt kê; `POST /cv/{id}/suggestions/apply` đánh dấu đã áp dụng |
| FR-4.8 | Sinh cover letter | `POST /cv/cover-letter/generate` tạo thư xin việc theo tin tuyển dụng + hồ sơ, có lựa chọn ngôn ngữ & tông giọng |

### FR-5. Theo dõi ứng tuyển

| ID | Yêu cầu | Mô tả |
|----|---------|-------|
| FR-5.1 | Tạo đơn | `POST /applications/` tạo từ việc làm hoặc nhập thủ công |
| FR-5.2 | Danh sách | `GET /applications/` liệt kê đơn (join dữ liệu việc làm) |
| FR-5.3 | Kanban | Hiển thị theo cột trạng thái: bookmarked → applied → interview → offer / rejected / withdrawn |
| FR-5.4 | Dạng bảng | Chế độ xem bảng với dropdown đổi trạng thái nhanh |
| FR-5.5 | Cập nhật | `PATCH /applications/{id}` cập nhật trạng thái, ghi chú, ngày phỏng vấn, liên kết CV/cover letter |
| FR-5.6 | Xóa | `DELETE /applications/{id}` |
| FR-5.7 | Thống kê | `GET /applications/stats` trả về tổng, phân bố theo trạng thái, số active, tỷ lệ thành công |
| FR-5.8 | Điểm fit | Mỗi đơn hiển thị thanh điểm fit (nếu có) |

### FR-6. Dashboard (Tổng quan)

| ID | Yêu cầu | Mô tả |
|----|---------|-------|
| FR-6.1 | Lời chào theo giờ | Hiển thị lời chào (sáng/chiều/tối) kèm tên người dùng |
| FR-6.2 | Chỉ số chính | 5 chỉ số: tổng đơn, đang active, tỷ lệ thành công, việc đã khám phá, điểm fit trung bình (`GET /analytics/user/activity` + `/applications/stats`) |
| FR-6.3 | Biểu đồ pipeline | Biểu đồ tròn phân bố đơn theo trạng thái |
| FR-6.4 | Thao tác nhanh | Liên kết nhanh tới Tìm việc, Ứng tuyển, Tạo CV, và nút mở chat AI |

### FR-7. Phân tích thị trường

| ID | Yêu cầu | Mô tả |
|----|---------|-------|
| FR-7.1 | Xem insight | `GET /analytics/market` trả về dữ liệu thị trường đã cache (lọc theo ngành tùy chọn) |
| FR-7.2 | Làm mới | `POST /analytics/market/refresh` để AI phân tích lại từ mẫu việc làm gần nhất |
| FR-7.3 | Nội dung | Top kỹ năng, top ngành/lĩnh vực, khoảng lương, loại hình công việc, top địa điểm, các nhận định AI |
| FR-7.4 | Trực quan hó | Biểu đồ cột/tròn (Recharts) + dải số liệu tổng quan |

### FR-8. Hồ sơ cá nhân

| ID | Yêu cầu | Mô tả |
|----|---------|-------|
| FR-8.1 | Thông tin cơ bản | `GET /profile/`, `PATCH /profile/`: tên, địa điểm, SĐT, liên kết (LinkedIn/GitHub/portfolio), trạng thái, vị trí/địa điểm mục tiêu |
| FR-8.2 | Học vấn | Thêm/sửa/xóa (`/profile/education`) |
| FR-8.3 | Kinh nghiệm | Thêm/sửa/xóa (`/profile/experience`) |
| FR-8.4 | Kỹ năng | Thêm/xóa/cập nhật hàng loạt (`/profile/skills`), phân nhóm: chính/phụ/chuyên môn/công cụ |

### FR-9. Trợ lý AI nhúng (Context-aware Chat)

| ID | Yêu cầu | Mô tả |
|----|---------|-------|
| FR-9.1 | Nút mở chat | Nút tròn nổi góc dưới phải, ẩn khi panel mở |
| FR-9.2 | Panel trượt | Panel rộng 420px trượt từ phải; nội dung chính co lại nhường chỗ; đóng bằng nút X hoặc phím Esc |
| FR-9.3 | Nhận biết ngữ cảnh | Tự xác định ngữ cảnh theo route (job / cv / jobs / applications / market / dashboard / general) và hiển thị gợi ý prompt phù hợp |
| FR-9.4 | Hội thoại mới theo trang | Khi đổi ngữ cảnh trang, hội thoại được làm mới |
| FR-9.5 | Phản hồi streaming | `POST /chat/send` trả về luồng (streaming) hiển thị dần từng phần; header `X-Session-Id` |
| FR-9.6 | Quản lý phiên | `GET/POST /chat/sessions`, `GET /chat/sessions/{id}/messages`; tự tạo phiên khi gửi tin đầu |
| FR-9.7 | Mở từ nơi khác | Có thể kích hoạt mở chat từ các trang khác qua sự kiện toàn cục (`vica:open-chat`) |

---

## 6. Yêu cầu phi chức năng (Non-Functional Requirements)

| Loại | Yêu cầu |
|------|---------|
| **Bảo mật** | Auth JWT qua Supabase; Row-Level Security đảm bảo người dùng chỉ truy cập dữ liệu của mình; backend dùng service role cho scraping |
| **Hiệu năng** | Tìm kiếm đa nguồn chạy song song; phản hồi chat dạng streaming để giảm độ trễ cảm nhận; phân tích thị trường được cache |
| **Khả dụng (UX)** | Giao diện responsive; chuyển động mượt (Framer Motion); toast thông báo (react-hot-toast); trạng thái loading/skeleton |
| **Khả năng bảo trì** | Scraper tách module theo từng cổng; lớp service AI tập trung tại `services/gemini.py`; kiểu dữ liệu dùng chung trong `lib/types.ts` |
| **Khả năng mở rộng** | Enum nguồn việc làm có sẵn `jobsgo`/`other` để bổ sung cổng mới; context_type của chat dễ mở rộng |
| **Khả dụng ngôn ngữ** | Giao diện và nội dung AI bằng tiếng Việt; cover letter hỗ trợ chọn ngôn ngữ |
| **Khả năng tiếp cận** | Dùng Radix UI (component có sẵn a11y); hỗ trợ điều hướng bàn phím (Esc đóng chat, Enter/Space mở upload) |

---

## 7. Mô hình dữ liệu (Data Model)

Các thực thể chính (Supabase PostgreSQL):

| Bảng | Trường tiêu biểu |
|------|------------------|
| **profiles** | full_name, email, location, phone, linkedin/github/portfolio_url, current_status, target_roles[], target_locations[], deal_breakers[], onboarding_completed |
| **education** | degree, field, institution, start_year, end_year, gpa, thesis, highlights[] |
| **experience** | job_title, company, location, start_date, end_date, is_current, responsibilities[], achievements[], technologies[] |
| **skills** | name, category (primary/secondary/domain/tool), level, years_experience |
| **cvs** | title, target_role, target_company, profile_statement, sections (JSONB), html_content, pdf_url, is_master, version |
| **cover_letters** | title, content, html_content, language, job_posting_id |
| **job_postings** | source, title, company, company_logo_url, location, is_remote, description, requirements[], benefits[], skills_required[], salary_min/max/currency/negotiable, employment_type, experience_years_min/max, posted_at, deadline, url (unique), is_active, raw_data (JSONB) |
| **applications** | status, fit_score, fit_evaluation (JSONB), salary_expected, applied_at, interview_at, notes, company_name, role_title, source_url, job_posting_id, cv_id, cover_letter_id |
| **seen_jobs** | user_id, job_posting_id |
| **chat_sessions** | title, context_type, context_id |
| **chat_messages** | session_id, role, content, metadata |
| **cv_suggestions** | section, suggestion_type, original_text, suggested_text, reason, is_applied |
| **market_analytics** | category, data (JSONB), period, date |

**Enum quan trọng:**
- Nguồn việc làm: `vietnamworks` · `topcv` · `itviec` · `careerviet` · `jobsgo` · `other`
- Trạng thái ứng tuyển: `bookmarked` · `applied` · `interview` · `offer` · `rejected` · `withdrawn`
- Nhóm kỹ năng: `primary` · `secondary` · `domain` · `tool`
- Trạng thái hiện tại: `employed` · `unemployed` · `freelance` · `student`
- Loại gợi ý CV: `weakness` · `keyword` · `reframe` · `add` · `remove`

---

## 8. Bản đồ API (tóm tắt)

| Nhóm | Endpoint chính |
|------|----------------|
| **Jobs** | `GET /jobs/search`, `GET /jobs/saved`, `GET /jobs/{id}`, `POST /jobs/{id}/evaluate-fit`, `POST /jobs/{id}/mark-seen` |
| **CV** | `GET/POST /cv/`, `GET/PATCH/DELETE /cv/{id}`, `GET /cv/{id}/pdf`, `POST /cv/{id}/analyze`, `GET /cv/{id}/suggestions`, `POST /cv/{id}/suggestions/apply`, `POST /cv/cover-letter/generate` |
| **Applications** | `GET/POST /applications/`, `GET /applications/stats`, `GET/PATCH/DELETE /applications/{id}` |
| **Chat** | `GET/POST /chat/sessions`, `GET /chat/sessions/{id}/messages`, `POST /chat/send` |
| **Profile** | `GET/PATCH /profile/`, `POST/PATCH/DELETE /profile/education|experience`, `POST/DELETE/PUT /profile/skills` |
| **Analytics** | `GET /analytics/market`, `POST /analytics/market/refresh`, `GET /analytics/jobs/summary`, `GET /analytics/user/activity` |
| **Onboarding** | `POST /onboarding/parse-cv` |
| **Hệ thống** | `GET /health` |

---

## 9. Tính năng AI (Gemini) chi tiết

| Tính năng | Đầu vào | Đầu ra |
|-----------|---------|--------|
| **Đánh giá độ phù hợp** | Hồ sơ người dùng + tin tuyển dụng | Điểm 4 tiêu chí, điểm tổng, verdict, strengths, gaps, recommendation |
| **Phân tích CV** | Các mục CV | Gợi ý theo mục (weakness/keyword/reframe/add/remove) |
| **Sinh cover letter** | Tin tuyển dụng + hồ sơ + ngôn ngữ/tông | Thư 3–4 đoạn (~300–400 từ), HTML + plain text |
| **Chat theo ngữ cảnh** | Hồ sơ + loại ngữ cảnh + lịch sử | Phản hồi streaming |
| **Bóc tách CV upload** | File PDF/TXT | Cấu trúc hồ sơ: tên, điểm theo mục, vấn đề, gợi ý |
| **Phân tích thị trường** | Mẫu việc làm đã scrape | top_skills, top_sectors, salary_ranges, employment_types, top_locations, insights |

---

## 10. Tiêu chí nghiệm thu (Acceptance Criteria — ví dụ tiêu biểu)

- **Onboarding:** Upload một CV PDF hợp lệ → hệ thống tạo hồ sơ với tên và ít nhất một nhóm kỹ năng; file sai định dạng → hiện toast lỗi, không crash.
- **Đánh giá độ phù hợp:** Nhấn "Đánh giá độ phù hợp" trên một tin → trong vòng thời gian hợp lý hiển thị đủ 4 thanh điểm + điểm tổng + khuyến nghị.
- **Kanban:** Kéo/đổi trạng thái một đơn → trạng thái được lưu (PATCH thành công) và phản ánh ngay trên UI.
- **Chat ngữ cảnh:** Mở chat trên trang chi tiết việc làm → gợi ý prompt liên quan đến việc làm đó; phản hồi hiển thị dần (streaming).
- **Bảo mật:** Người dùng A không thể truy cập CV/đơn ứng tuyển của người dùng B (chặn bởi RLS).
- **Xuất PDF:** Nhấn tải PDF của một CV → file PDF tải về mở được, đúng nội dung.

---

## 11. Phụ thuộc & Giả định

- **Phụ thuộc ngoài:** Supabase (DB/Auth), Google Gemini (AI), 4 cổng việc làm (nguồn dữ liệu).
- **Giả định:** Người dùng đồng ý upload CV; các cổng việc làm giữ cấu trúc HTML tương đối ổn định; Gemini đáp ứng được nội dung tiếng Việt chất lượng.

---

*Tài liệu này đi kèm với: **Brief** (tổng quan dự án) và **Wireframe / UI Flow** (luồng màn hình và bố cục giao diện).*
