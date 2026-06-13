-- ============================================================
-- Vica — Mock data seed for a single test user
-- ============================================================
-- Run this in the Supabase SQL Editor (it uses the postgres/service
-- role, so it can write auth.users and bypass RLS).
--
-- Target user UID:
--   de0146f0-1d72-4f08-a4eb-75a2c75dc58b
-- The auth.users row for this UID must already exist (i.e. the user
-- has signed up). This script is idempotent — safe to re-run.
-- ============================================================

begin;

-- ── 0. Mark onboarding complete in auth metadata ──────────────
-- Middleware reads onboarding_completed from auth.users.raw_user_meta_data
-- (NOT the profiles table), so we must set it here to unlock the app.
update auth.users
set raw_user_meta_data =
  coalesce(raw_user_meta_data, '{}'::jsonb)
  || '{"full_name": "Nguyễn Đức Thái", "onboarding_completed": true}'::jsonb
where id = 'de0146f0-1d72-4f08-a4eb-75a2c75dc58b';

-- ── 1. Profile (upsert) ───────────────────────────────────────
insert into public.profiles (
  id, full_name, email, location, phone,
  linkedin_url, github_url, portfolio_url,
  current_status, target_roles, target_locations, deal_breakers,
  onboarding_completed
) values (
  'de0146f0-1d72-4f08-a4eb-75a2c75dc58b',
  'Nguyễn Đức Thái',
  'thai.nguyen@example.com',
  'TP. Hồ Chí Minh',
  '0901 234 567',
  'https://linkedin.com/in/thai-nguyen',
  'https://github.com/thainguyen',
  'https://thainguyen.dev',
  'student',
  array['Frontend Developer', 'Fullstack Developer'],
  array['TP. Hồ Chí Minh', 'Remote'],
  array['Tăng ca thường xuyên không lương', 'Không có lộ trình thăng tiến'],
  true
)
on conflict (id) do update set
  full_name = excluded.full_name,
  email = excluded.email,
  location = excluded.location,
  phone = excluded.phone,
  linkedin_url = excluded.linkedin_url,
  github_url = excluded.github_url,
  portfolio_url = excluded.portfolio_url,
  current_status = excluded.current_status,
  target_roles = excluded.target_roles,
  target_locations = excluded.target_locations,
  deal_breakers = excluded.deal_breakers,
  onboarding_completed = true;

-- Clean previous seed for this user (re-run friendly)
delete from public.cv_suggestions where user_id = 'de0146f0-1d72-4f08-a4eb-75a2c75dc58b';
delete from public.applications   where user_id = 'de0146f0-1d72-4f08-a4eb-75a2c75dc58b';
delete from public.seen_jobs      where user_id = 'de0146f0-1d72-4f08-a4eb-75a2c75dc58b';
delete from public.cvs            where user_id = 'de0146f0-1d72-4f08-a4eb-75a2c75dc58b';
delete from public.skills         where user_id = 'de0146f0-1d72-4f08-a4eb-75a2c75dc58b';
delete from public.experience     where user_id = 'de0146f0-1d72-4f08-a4eb-75a2c75dc58b';
delete from public.education      where user_id = 'de0146f0-1d72-4f08-a4eb-75a2c75dc58b';

-- ── 2. Education ──────────────────────────────────────────────
insert into public.education
  (id, user_id, degree, field, institution, start_year, end_year, gpa, thesis, highlights, sort_order)
values
  ('e0000000-0000-0000-0000-000000000001', 'de0146f0-1d72-4f08-a4eb-75a2c75dc58b',
   'Cử nhân', 'Khoa học Máy tính', 'Đại học Bách Khoa TP.HCM', 2021, 2025, 3.40,
   'Ứng dụng học sâu trong nhận diện văn bản tiếng Việt',
   array['Học bổng khuyến khích học tập 3 kỳ', 'Top 5 đồ án xuất sắc khoa CNTT'], 0);

-- ── 3. Experience ─────────────────────────────────────────────
insert into public.experience
  (id, user_id, job_title, company, location, start_date, end_date, is_current, responsibilities, achievements, technologies, sort_order)
values
  ('e1000000-0000-0000-0000-000000000001', 'de0146f0-1d72-4f08-a4eb-75a2c75dc58b',
   'Frontend Developer (Thực tập)', 'FPT Software', 'TP. Hồ Chí Minh', '2024-06-01', '2024-12-01', false,
   array['Phát triển giao diện cho hệ thống nội bộ bằng React và TypeScript', 'Tối ưu hiệu năng trang, giảm 30% thời gian tải'],
   array['Được giữ lại làm part-time sau kỳ thực tập'],
   array['React', 'TypeScript', 'Tailwind CSS', 'Git'], 0),
  ('e1000000-0000-0000-0000-000000000002', 'de0146f0-1d72-4f08-a4eb-75a2c75dc58b',
   'Cộng tác viên Web', 'CLB Lập trình BK', 'TP. Hồ Chí Minh', '2023-01-01', '2024-05-01', false,
   array['Xây dựng landing page cho các sự kiện của CLB'],
   array['Trang sự kiện đạt 5.000+ lượt đăng ký'],
   array['Next.js', 'Figma'], 1);

-- ── 4. Skills ─────────────────────────────────────────────────
insert into public.skills (id, user_id, name, category, level, years_experience)
values
  ('d0000000-0000-0000-0000-000000000001', 'de0146f0-1d72-4f08-a4eb-75a2c75dc58b', 'React', 'primary', 'advanced', 2.0),
  ('d0000000-0000-0000-0000-000000000002', 'de0146f0-1d72-4f08-a4eb-75a2c75dc58b', 'TypeScript', 'primary', 'advanced', 2.0),
  ('d0000000-0000-0000-0000-000000000003', 'de0146f0-1d72-4f08-a4eb-75a2c75dc58b', 'Next.js', 'primary', 'intermediate', 1.0),
  ('d0000000-0000-0000-0000-000000000004', 'de0146f0-1d72-4f08-a4eb-75a2c75dc58b', 'Tailwind CSS', 'secondary', 'advanced', null),
  ('d0000000-0000-0000-0000-000000000005', 'de0146f0-1d72-4f08-a4eb-75a2c75dc58b', 'Node.js', 'secondary', 'intermediate', null),
  ('d0000000-0000-0000-0000-000000000006', 'de0146f0-1d72-4f08-a4eb-75a2c75dc58b', 'Thiết kế UI/UX', 'domain', 'intermediate', null),
  ('d0000000-0000-0000-0000-000000000007', 'de0146f0-1d72-4f08-a4eb-75a2c75dc58b', 'Figma', 'tool', 'intermediate', null),
  ('d0000000-0000-0000-0000-000000000008', 'de0146f0-1d72-4f08-a4eb-75a2c75dc58b', 'Git', 'tool', 'advanced', null);

-- ── 5. Job postings (shared table) ────────────────────────────
delete from public.job_postings where id in (
  'a0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000003','a0000000-0000-0000-0000-000000000004',
  'a0000000-0000-0000-0000-000000000005','a0000000-0000-0000-0000-000000000006',
  'a0000000-0000-0000-0000-000000000007','a0000000-0000-0000-0000-000000000008'
);

insert into public.job_postings
  (id, external_id, source, title, company, location, is_remote, description,
   requirements, benefits, salary_min, salary_max, salary_currency, salary_negotiable,
   employment_type, experience_years_min, experience_years_max, skills_required,
   posted_at, deadline, url, is_active)
values
  ('a0000000-0000-0000-0000-000000000001', 'seed-1', 'vietnamworks',
   'Frontend Developer (React)', 'Tiki', 'TP. Hồ Chí Minh', true,
   'Tìm kiếm Frontend Developer đam mê xây dựng sản phẩm web hiệu năng cao. Làm việc trong môi trường Agile cùng team phát triển các tính năng mới.',
   array['Thành thạo React, TypeScript', 'Hiểu RESTful API', 'Kinh nghiệm Redux'],
   array['Lương tháng 13', 'Bảo hiểm sức khỏe', 'Làm việc hybrid'],
   18000000, 28000000, 'VND', false, 'full-time', 1, 3,
   array['React', 'TypeScript', 'Redux'], now() - interval '3 days', now() + interval '20 days',
   'https://www.vietnamworks.com/jobs/seed-1', true),

  ('a0000000-0000-0000-0000-000000000002', 'seed-2', 'topcv',
   'Product Engineer', 'MoMo', 'TP. Hồ Chí Minh', false,
   'Vị trí Product Engineer xây dựng các tính năng cốt lõi của ví điện tử, làm việc fullstack với Node.js và React.',
   array['2+ năm kinh nghiệm fullstack', 'Node.js, React', 'Kinh nghiệm PostgreSQL'],
   array['Lương cạnh tranh', 'ESOP', 'Bảo hiểm cao cấp'],
   25000000, 40000000, 'VND', false, 'full-time', 2, 5,
   array['Node.js', 'React', 'PostgreSQL'], now() - interval '5 days', now() + interval '18 days',
   'https://www.topcv.vn/jobs/seed-2', true),

  ('a0000000-0000-0000-0000-000000000003', 'seed-3', 'itviec',
   'Fullstack Developer', 'VNG', 'TP. Hồ Chí Minh', false,
   'Tham gia phát triển nền tảng quy mô lớn với Next.js và Node.js trên hạ tầng AWS.',
   array['Next.js, Node.js', 'Kinh nghiệm AWS', 'Tư duy hệ thống tốt'],
   array['Lương thỏa thuận', 'Môi trường quốc tế', 'Ngân sách học tập'],
   null, null, 'VND', true, 'full-time', 2, 4,
   array['Next.js', 'Node.js', 'AWS'], now() - interval '2 days', now() + interval '25 days',
   'https://itviec.com/jobs/seed-3', true),

  ('a0000000-0000-0000-0000-000000000004', 'seed-4', 'careerviet',
   'Junior UI/UX Designer', 'Haravan', 'TP. Hồ Chí Minh', false,
   'Thiết kế trải nghiệm người dùng cho nền tảng thương mại điện tử, phối hợp chặt với team frontend.',
   array['Thành thạo Figma', 'Tư duy thiết kế UI/UX', 'Portfolio tốt'],
   array['Lương tháng 13', 'Phụ cấp ăn trưa', 'Hybrid'],
   12000000, 18000000, 'VND', false, 'full-time', 0, 2,
   array['Figma', 'Thiết kế UI/UX'], now() - interval '6 days', now() + interval '15 days',
   'https://careerviet.vn/jobs/seed-4', true),

  ('a0000000-0000-0000-0000-000000000005', 'seed-5', 'topcv',
   'Frontend Intern', 'Shopee', 'TP. Hồ Chí Minh', true,
   'Cơ hội thực tập frontend cho sinh viên năm cuối, được mentor 1-1 và tham gia dự án thật.',
   array['Biết React, JavaScript', 'Tinh thần học hỏi', 'Có thể làm 4-5 buổi/tuần'],
   array['Trợ cấp thực tập', 'Cơ hội lên chính thức', 'Laptop'],
   8000000, 12000000, 'VND', false, 'internship', 0, 1,
   array['React', 'JavaScript'], now() - interval '1 day', now() + interval '22 days',
   'https://www.topcv.vn/jobs/seed-5', true),

  ('a0000000-0000-0000-0000-000000000006', 'seed-6', 'vietnamworks',
   'Data Analyst', 'Be Group', 'Hà Nội', false,
   'Phân tích dữ liệu vận hành, xây dựng dashboard và báo cáo hỗ trợ ra quyết định.',
   array['SQL, Python', 'Power BI hoặc Tableau', 'Tư duy phân tích'],
   array['Lương tháng 13', 'Bảo hiểm', 'Du lịch hằng năm'],
   16000000, 24000000, 'VND', false, 'full-time', 1, 3,
   array['SQL', 'Python', 'Power BI'], now() - interval '4 days', now() + interval '19 days',
   'https://www.vietnamworks.com/jobs/seed-6', true),

  ('a0000000-0000-0000-0000-000000000007', 'seed-7', 'itviec',
   'Mobile Developer (React Native)', 'ZaloPay', 'TP. Hồ Chí Minh', false,
   'Phát triển ứng dụng di động ví điện tử với React Native, tối ưu hiệu năng và trải nghiệm.',
   array['React Native, TypeScript', 'Kinh nghiệm publish app', 'Hiểu native module'],
   array['Lương hấp dẫn', 'ESOP', 'Bảo hiểm cao cấp'],
   20000000, 35000000, 'VND', false, 'full-time', 2, 4,
   array['React Native', 'TypeScript'], now() - interval '7 days', now() + interval '14 days',
   'https://itviec.com/jobs/seed-7', true),

  ('a0000000-0000-0000-0000-000000000008', 'seed-8', 'careerviet',
   'Backend Developer (Node.js)', 'Sapo', 'Hà Nội', false,
   'Xây dựng API và dịch vụ backend cho nền tảng bán hàng, làm việc với MongoDB và Docker.',
   array['Node.js, Express', 'MongoDB', 'Docker, CI/CD'],
   array['Lương tháng 13', 'Thưởng dự án', 'Hybrid'],
   18000000, 30000000, 'VND', false, 'full-time', 2, 4,
   array['Node.js', 'MongoDB', 'Docker'], now() - interval '8 days', now() + interval '16 days',
   'https://careerviet.vn/jobs/seed-8', true);

-- ── 6. CVs ────────────────────────────────────────────────────
insert into public.cvs
  (id, user_id, title, target_role, target_company, profile_statement, sections, html_content, is_master, version, created_at, updated_at)
values
  ('c0000000-0000-0000-0000-000000000001', 'de0146f0-1d72-4f08-a4eb-75a2c75dc58b',
   'CV Frontend Developer', 'Frontend Developer', 'Tiki',
   'Sinh viên CNTT năm cuối, 2 năm kinh nghiệm React/TypeScript, mong muốn phát triển ở vị trí Frontend Developer.',
   '[]'::jsonb,
   '<div style="font-family:Arial,sans-serif;color:#0f172a;padding:40px;line-height:1.6"><h1 style="margin:0;font-size:24px">Nguyễn Đức Thái</h1><p style="margin:4px 0;color:#475569">Frontend Developer · TP. Hồ Chí Minh · thai.nguyen@example.com</p><hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0"/><h2 style="font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#64748b">Mục tiêu nghề nghiệp</h2><p>Sinh viên CNTT năm cuối với 2 năm kinh nghiệm React/TypeScript.</p><h2 style="font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#64748b">Kinh nghiệm</h2><p><strong>Frontend Developer (Thực tập) — FPT Software</strong> (06/2024 – 12/2024)</p><ul><li>Phát triển giao diện hệ thống nội bộ bằng React, TypeScript</li><li>Tối ưu hiệu năng, giảm 30% thời gian tải</li></ul><h2 style="font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#64748b">Kỹ năng</h2><p>React · TypeScript · Next.js · Tailwind CSS · Node.js · Figma · Git</p></div>',
   true, 3, now() - interval '30 days', now() - interval '2 days'),

  ('c0000000-0000-0000-0000-000000000002', 'de0146f0-1d72-4f08-a4eb-75a2c75dc58b',
   'CV Fullstack', 'Fullstack Developer', 'VNG',
   'Định hướng fullstack với nền tảng frontend vững và Node.js.',
   '[]'::jsonb,
   '<div style="font-family:Arial,sans-serif;padding:40px"><h1>Nguyễn Đức Thái</h1><p>Fullstack Developer</p></div>',
   false, 1, now() - interval '12 days', now() - interval '5 days'),

  ('c0000000-0000-0000-0000-000000000003', 'de0146f0-1d72-4f08-a4eb-75a2c75dc58b',
   'CV Thực tập', 'Frontend Intern', null,
   'Bản CV tinh gọn cho các vị trí thực tập.',
   '[]'::jsonb,
   '<div style="font-family:Arial,sans-serif;padding:40px"><h1>Nguyễn Đức Thái</h1><p>Frontend Intern</p></div>',
   false, 2, now() - interval '20 days', now() - interval '8 days');

-- ── 7. Applications ───────────────────────────────────────────
insert into public.applications
  (id, user_id, job_posting_id, cv_id, status, fit_score, fit_evaluation, salary_expected, applied_at, interview_at, notes, company_name, role_title, source_url, created_at)
values
  ('b0000000-0000-0000-0000-000000000001', 'de0146f0-1d72-4f08-a4eb-75a2c75dc58b',
   'a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001',
   'applied', 84,
   '{"overall_score":84,"verdict":"Phù hợp cao","technical_skills":{"score":82,"notes":"Kỹ năng React, TypeScript rất phù hợp."},"experience_match":{"score":65,"notes":"Kinh nghiệm thực tập liên quan."},"cultural_fit":{"score":78,"notes":"Tinh thần học hỏi tốt."},"career_alignment":{"score":88,"notes":"Đúng định hướng nghề nghiệp."},"strengths":["Nền tảng React vững","Định hướng rõ ràng"],"gaps":["Chưa có kinh nghiệm CI/CD"],"recommendation":"Nên ứng tuyển và nhấn mạnh dự án thực tập."}'::jsonb,
   null, now() - interval '6 days', null, null, 'Tiki', 'Frontend Developer (React)', 'https://www.vietnamworks.com/jobs/seed-1', now() - interval '10 days'),

  ('b0000000-0000-0000-0000-000000000002', 'de0146f0-1d72-4f08-a4eb-75a2c75dc58b',
   'a0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002',
   'interview', 79, null, null, now() - interval '9 days', now() + interval '2 days',
   'Vòng kỹ thuật qua Google Meet, 10h sáng', 'MoMo', 'Product Engineer', 'https://www.topcv.vn/jobs/seed-2', now() - interval '12 days'),

  ('b0000000-0000-0000-0000-000000000003', 'de0146f0-1d72-4f08-a4eb-75a2c75dc58b',
   'a0000000-0000-0000-0000-000000000003', null,
   'bookmarked', 71, null, null, null, null, null, 'VNG', 'Fullstack Developer', 'https://itviec.com/jobs/seed-3', now() - interval '3 days'),

  ('b0000000-0000-0000-0000-000000000004', 'de0146f0-1d72-4f08-a4eb-75a2c75dc58b',
   'a0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000003',
   'offer', 90, null, 16000000, now() - interval '20 days', now() - interval '5 days',
   'Đã nhận offer, đang cân nhắc', 'Haravan', 'Junior UI/UX Designer', 'https://careerviet.vn/jobs/seed-4', now() - interval '25 days'),

  ('b0000000-0000-0000-0000-000000000005', 'de0146f0-1d72-4f08-a4eb-75a2c75dc58b',
   'a0000000-0000-0000-0000-000000000005', null,
   'applied', 68, null, null, now() - interval '4 days', null, null, 'Shopee', 'Frontend Intern', 'https://www.topcv.vn/jobs/seed-5', now() - interval '5 days'),

  ('b0000000-0000-0000-0000-000000000006', 'de0146f0-1d72-4f08-a4eb-75a2c75dc58b',
   'a0000000-0000-0000-0000-000000000007', null,
   'interview', 76, null, null, now() - interval '7 days', now() + interval '5 days',
   null, 'ZaloPay', 'Mobile Developer (React Native)', 'https://itviec.com/jobs/seed-7', now() - interval '9 days'),

  ('b0000000-0000-0000-0000-000000000007', 'de0146f0-1d72-4f08-a4eb-75a2c75dc58b',
   'a0000000-0000-0000-0000-000000000006', null,
   'rejected', 55, null, null, now() - interval '15 days', null, 'Yêu cầu kinh nghiệm cao hơn', 'Be Group', 'Data Analyst', 'https://www.vietnamworks.com/jobs/seed-6', now() - interval '17 days'),

  ('b0000000-0000-0000-0000-000000000008', 'de0146f0-1d72-4f08-a4eb-75a2c75dc58b',
   'a0000000-0000-0000-0000-000000000008', null,
   'bookmarked', 73, null, null, null, null, null, 'Sapo', 'Backend Developer (Node.js)', 'https://careerviet.vn/jobs/seed-8', now() - interval '2 days'),

  ('b0000000-0000-0000-0000-000000000009', 'de0146f0-1d72-4f08-a4eb-75a2c75dc58b',
   'a0000000-0000-0000-0000-000000000003', null,
   'withdrawn', 60, null, null, now() - interval '18 days', null, 'Đã rút do nhận offer khác', 'VNG', 'Fullstack Developer', 'https://itviec.com/jobs/seed-3', now() - interval '19 days');

-- ── 8. CV suggestions (for the master CV) ─────────────────────
insert into public.cv_suggestions
  (id, cv_id, user_id, section, suggestion_type, original_text, suggested_text, reason, is_applied)
values
  ('f0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'de0146f0-1d72-4f08-a4eb-75a2c75dc58b',
   'Mục tiêu nghề nghiệp', 'keyword', 'đam mê công nghệ', 'đam mê xây dựng sản phẩm web hiệu năng cao với React', 'Thêm từ khóa khớp với JD mục tiêu', false),
  ('f0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'de0146f0-1d72-4f08-a4eb-75a2c75dc58b',
   'Kinh nghiệm', 'reframe', 'Tối ưu hiệu năng trang', 'Giảm 30% thời gian tải trang nhờ code-splitting và lazy-loading', 'Định lượng kết quả gây ấn tượng hơn', false),
  ('f0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'de0146f0-1d72-4f08-a4eb-75a2c75dc58b',
   'Kỹ năng', 'add', null, 'Bổ sung kinh nghiệm viết unit test (Jest, React Testing Library)', 'JD yêu cầu kỹ năng testing', false),
  ('f0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000001', 'de0146f0-1d72-4f08-a4eb-75a2c75dc58b',
   'Mục tiêu nghề nghiệp', 'weakness', 'mong muốn học hỏi', 'đóng góp ngay vào việc phát triển tính năng', 'Tránh diễn đạt bị động, thiếu tự tin', false),
  ('f0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000001', 'de0146f0-1d72-4f08-a4eb-75a2c75dc58b',
   'Kinh nghiệm', 'remove', 'Sở thích: chơi game, xem phim', null, 'Thông tin không liên quan, nên loại bỏ', false);

-- ── 9. Seen jobs (drives "jobs explored" metric) ──────────────
insert into public.seen_jobs (user_id, job_posting_id)
select 'de0146f0-1d72-4f08-a4eb-75a2c75dc58b', id from public.job_postings
where id in (
  'a0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000003','a0000000-0000-0000-0000-000000000004',
  'a0000000-0000-0000-0000-000000000005','a0000000-0000-0000-0000-000000000006',
  'a0000000-0000-0000-0000-000000000007','a0000000-0000-0000-0000-000000000008'
)
on conflict (user_id, job_posting_id) do nothing;

-- ── 10. Market analytics (shared, read-only for users) ────────
delete from public.market_analytics where id = '0d000000-0000-0000-0000-000000000001';
insert into public.market_analytics (id, category, source, data, period, date)
values (
  '0d000000-0000-0000-0000-000000000001', 'overview', 'seed',
  '{
    "top_skills": [
      {"skill":"React","count":320},{"skill":"TypeScript","count":280},
      {"skill":"Node.js","count":240},{"skill":"Python","count":210},
      {"skill":"SQL","count":190},{"skill":"AWS","count":150}
    ],
    "top_sectors": [
      {"sector":"Công nghệ / Phần mềm","count":540},{"sector":"Thương mại điện tử","count":320},
      {"sector":"Tài chính / Fintech","count":260},{"sector":"Giáo dục","count":140},
      {"sector":"Logistics","count":90}
    ],
    "salary_ranges": [
      {"range":"< 15tr","count":120},{"range":"15-25tr","count":380},
      {"range":"25-35tr","count":290},{"range":"35-50tr","count":160},
      {"range":"> 50tr","count":70}
    ],
    "employment_types": [
      {"type":"Full-time","count":720},{"type":"Part-time","count":110},
      {"type":"Thực tập","count":130},{"type":"Freelance","count":60}
    ],
    "top_locations": [
      {"location":"TP. Hồ Chí Minh","count":610},{"location":"Hà Nội","count":430},
      {"location":"Đà Nẵng","count":120},{"location":"Remote","count":180}
    ],
    "insights": [
      "Nhu cầu tuyển dụng React và TypeScript tăng 18% so với quý trước — tổ hợp kỹ năng đáng đầu tư.",
      "Mức lương phổ biến cho frontend junior tại TP.HCM rơi vào 15-25 triệu/tháng.",
      "Hơn 25% tin tuyển dụng cho phép remote hoặc hybrid.",
      "Kỹ năng testing (Jest, Cypress) ngày càng được nhắc đến nhiều trong JD."
    ]
  }'::jsonb,
  'weekly', current_date
);

commit;

-- Done. Log in as the seeded user to see populated Dashboard, Jobs,
-- Applications, CV Builder, Analytics and Profile pages.
