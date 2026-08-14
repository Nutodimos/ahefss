-- Seed data for AHEFSS Elevation Era

INSERT INTO academic_sessions (id, session_code, theme_title, is_pioneer, is_active) VALUES 
('22222222-2222-2222-2222-222222222222', '2025/2026', 'The Elevation Era', true, true);

INSERT INTO executive_members (id, session_id, full_name, office_position, display_order, photo_url, bio_quote, whatsapp_url) VALUES 
('exec-1', '22222222-2222-2222-2222-222222222222', 'Abdulwarees Olaitan Abdulazeez', 'President', 1, 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720144/fkoeef89qbzvnpkp5fd3.jpg', 'Leading the elevation of our standard across all academic and professional fronts.', 'https://wa.me/2349038384360'),
('exec-2', '22222222-2222-2222-2222-222222222222', 'Mary Oyindamola Oloruntele', 'Vice President', 2, 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720146/rrtd4roqdmrsmihc1efj.jpg', 'Fostering academic excellence and student welfare.', 'https://wa.me/2347047151664'),
('exec-3', '22222222-2222-2222-2222-222222222222', 'Aishat Olapeju Adigun', 'General Secretary', 3, 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720140/kkjvpakyqwkjfz9dx8jj.jpg', 'Ensuring seamless documentation and transparent governance.', 'https://wa.me/2349049085215'),
('exec-4', '22222222-2222-2222-2222-222222222222', 'Gbemisola Deborah Daniel', 'Assistant General Secretary', 4, 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720140/kkjvpakyqwkjfz9dx8jj.jpg', 'Supporting administrative coordination and record management.', 'https://wa.me/2349065271978'),
('exec-5', '22222222-2222-2222-2222-222222222222', 'Abigeal Oluwaseun Owoyemi', 'Director of Finance', 5, 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720140/kkjvpakyqwkjfz9dx8jj.jpg', 'Managing financial integrity and prudent resource allocation.', 'https://wa.me/2347049895821'),
('exec-6', '22222222-2222-2222-2222-222222222222', 'Zulaikho Taiye Alaya', 'Welfare Secretary', 6, 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720140/kkjvpakyqwkjfz9dx8jj.jpg', 'Championing student wellbeing, comfort, and inclusion.', 'https://wa.me/2349063425921'),
('exec-7', '22222222-2222-2222-2222-222222222222', 'Blessing Ahueiza Suleiman', 'Public Relations Officer', 7, 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720140/kkjvpakyqwkjfz9dx8jj.jpg', 'Amplifying student voices and broadcasting association achievements.', 'https://wa.me/2348145555412'),
('exec-8', '22222222-2222-2222-2222-222222222222', 'Abdulwakil Adeyemo', 'Sport Secretary', 8, 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720140/kkjvpakyqwkjfz9dx8jj.jpg', 'Promoting physical wellness, athletic spirit, and sports competitions.', 'https://wa.me/2349053293652'),
('exec-9', '22222222-2222-2222-2222-222222222222', 'Salmat Ibrahim', 'Social Secretary', 9, 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720140/kkjvpakyqwkjfz9dx8jj.jpg', 'Curating vibrant, engaging, and memorable social events.', 'https://wa.me/2349075951276'),
('exec-10', '22222222-2222-2222-2222-222222222222', 'Mubashiroh Muhammed-Raji', 'Librarian', 10, 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720140/kkjvpakyqwkjfz9dx8jj.jpg', 'Overseeing academic resources, study materials, and information access.', 'https://wa.me/2348081599450');

INSERT INTO events (id, session_id, title, event_type, event_date, flyer_banner_url, summary_text, photo_gallery, attendees_count) VALUES 
('event-meet-executives', '22222222-2222-2222-2222-222222222222', 'Meet Your Executives', 'Inauguration', '2025-11-01', 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720149/m3tw3n6qamoiqobfuimn.jpg', 'The official unveiling of The Elevation Era executive cabinet — meet the dedicated team of leaders serving the pioneer AHEFSS administration.', ARRAY['https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720149/m3tw3n6qamoiqobfuimn.jpg', 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720144/fkoeef89qbzvnpkp5fd3.jpg', 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720146/rrtd4roqdmrsmihc1efj.jpg']::TEXT[], 300);

INSERT INTO projects (id, session_id, title, cover_image_url, summary_text, photo_gallery, display_order) VALUES 
('project-dept-signage', '22222222-2222-2222-2222-222222222222', 'Departmental Signage & Identity Project', 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720666/grynsm8lc9lo7llr8v8k.jpg', 'A landmark infrastructure project that gave the department a permanent visual identity — branded signage, directional boards, and department identity graphics designed and installed for lasting legacy.', ARRAY['https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720673/ajcxeyb0mkl6qx2oeny6.png', 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720681/qd2ruvjdr86qapnxbsck.png', 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720687/zmovcrmrisead1fnawsl.png', 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720691/vx1c0si8v13zbejgh1ss.png', 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720697/eh3yasxzjpvxcorwynoi.png', 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720730/kvhnlaknb1fy9ogtqeiy.png']::TEXT[], 1);

INSERT INTO lecturers (id, session_id, full_name, is_hod, photo_url, display_order) VALUES 
('lec-1', '22222222-2222-2222-2222-222222222222', 'Head of Department (HOD)', true, 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720140/kkjvpakyqwkjfz9dx8jj.jpg', 1),
('lec-2', '22222222-2222-2222-2222-222222222222', 'Prof. O. A. Adebayo', false, NULL, 2),
('lec-3', '22222222-2222-2222-2222-222222222222', 'Dr. Mrs. C. F. Okonkwo', false, NULL, 3),
('lec-4', '22222222-2222-2222-2222-222222222222', 'Dr. K. E. Ibrahim', false, NULL, 4),
('lec-5', '22222222-2222-2222-2222-222222222222', 'Engr. T. O. Alabi', false, NULL, 5),
('lec-6', '22222222-2222-2222-2222-222222222222', 'Mrs. A. M. Bello', false, NULL, 6),
('lec-7', '22222222-2222-2222-2222-222222222222', 'Mr. S. B. Oladipo', false, NULL, 7);

INSERT INTO founder (id, full_name, photo_url, title, message) VALUES 
('11111111-1111-1111-1111-111111111111', 'Abdulwarees', 'https://res.cloudinary.com/q9jb9wvk/image/upload/v1786720143/vbpkjj4kbjqp8kefnijt.jpg', 'President, The Elevation Era', 'Welcome, AHEFFSITES!
On behalf of the founding team of The Elevation Era, I am thrilled to welcome you to the official digital portal of the Association of Home Economics and Food Science Students (AHEFSS).

When this administration took office, our core mission was encapsulated in our name: to elevate the standard of our department across all fronts. Achieving this was no small task, but by God''s grace and through the unwavering support of our Head of Department, our Staff Adviser, our esteemed lecturers, a dedicated executive council, and the entire AHEFSSITE body, we were able to push boundaries and do better.

The creation of this website stems from a critical challenge we identified: a persistent gap in information regarding the association''s work. For too long, many students were unaware of the association''s active presence, let alone the impactful programs and events being organized for their growth.

We built this platform to change that narrative permanently. This platform serves three vital purposes:
1. A Living Showcase: To bring visibility to every event, workshop, and project carried out for the benefit of our students.
2. A Permanent Legacy Archive: To ensure that the history, hard work, and milestones of our association are preserved for years to come—far beyond traditional paper handover forms.
3. A Blueprint for Future Leadership: To provide incoming administrations with a clear view of what has been accomplished, setting a benchmark that inspires higher participation and even greater achievements in every new academic session.

This portal represents the bedrock of our legacy. As you explore the achievements of The Elevation Era, I hope it fills you with pride in our department and inspires you to actively engage with the association moving forward.

Welcome aboard, and keep elevating!');

