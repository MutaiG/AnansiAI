-- Sample data for Student Dashboard functionality
-- Run this script after applying the database migrations

-- Insert sample users (students and instructors)
INSERT INTO AspNetUsers (Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed, PhoneNumber, PhoneNumberConfirmed, TwoFactorEnabled, LockoutEnabled, AccessFailedCount, FullName, Address, PhotoUrl, IsActive, LastLogin, CreatedAt, UpdatedAt)
VALUES 
('student-001', 'alex.johnson@student.edu', 'ALEX.JOHNSON@STUDENT.EDU', 'alex.johnson@student.edu', 'ALEX.JOHNSON@STUDENT.EDU', 1, '+254712345678', 1, 0, 0, 0, 'Alex Johnson', '123 Nairobi St', NULL, 1, GETDATE(), GETDATE(), GETDATE()),
('instructor-001', 'dr.rodriguez@school.edu', 'DR.RODRIGUEZ@SCHOOL.EDU', 'dr.rodriguez@school.edu', 'DR.RODRIGUEZ@SCHOOL.EDU', 1, '+254723456789', 1, 0, 0, 0, 'Dr. Maria Rodriguez', '456 Teacher Ave', NULL, 1, GETDATE(), GETDATE(), GETDATE()),
('instructor-002', 'prof.wilson@school.edu', 'PROF.WILSON@SCHOOL.EDU', 'prof.wilson@school.edu', 'PROF.WILSON@SCHOOL.EDU', 1, '+254734567890', 1, 0, 0, 0, 'Prof. James Wilson', '789 Faculty Rd', NULL, 1, GETDATE(), GETDATE(), GETDATE()),
('instructor-003', 'ms.thompson@school.edu', 'MS.THOMPSON@SCHOOL.EDU', 'ms.thompson@school.edu', 'MS.THOMPSON@SCHOOL.EDU', 1, '+254745678901', 1, 0, 0, 0, 'Ms. Sarah Thompson', '321 Literature Ln', NULL, 1, GETDATE(), GETDATE(), GETDATE());

-- Insert sample courses
INSERT INTO Courses (Title, Description, InstructorId, SubjectId, IsActive, StartDate, EndDate, MaxStudents, CreatedAt, UpdatedAt)
VALUES 
('Advanced Calculus', 'Comprehensive calculus course covering advanced integration and differential equations', 'instructor-001', 1, 1, DATEADD(month, -2, GETDATE()), DATEADD(month, 4, GETDATE()), 30, GETDATE(), GETDATE()),
('Molecular Biology', 'In-depth study of cellular processes and molecular mechanisms', 'instructor-002', 3, 1, DATEADD(month, -1, GETDATE()), DATEADD(month, 5, GETDATE()), 25, GETDATE(), GETDATE()),
('English Literature', 'Analysis of classic and contemporary literary works', 'instructor-003', 2, 1, DATEADD(month, -3, GETDATE()), DATEADD(month, 3, GETDATE()), 20, GETDATE(), GETDATE());

-- Insert course enrollments for our sample student
INSERT INTO CourseEnrollments (StudentId, CourseId, EnrolledAt, Progress, CompletedLessons, CurrentGrade, IsAIRecommended, Status, UpdatedAt)
VALUES 
('student-001', 1, DATEADD(month, -2, GETDATE()), 68.0, 12, 87.0, 1, 'active', GETDATE()),
('student-001', 2, DATEADD(month, -1, GETDATE()), 45.0, 8, 92.0, 0, 'active', GETDATE()),
('student-001', 3, DATEADD(month, -3, GETDATE()), 82.0, 14, 78.0, 0, 'active', GETDATE());

-- Insert sample student profile
INSERT INTO StudentProfiles (StudentId, Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism, 
    PreferredLearningStyle, PreferredModalities, DifficultyPreference, PacePreference, FeedbackFrequency,
    CurrentMood, StressLevel, ConfidenceLevel, MotivationLevel, EmotionalStateLastUpdated,
    DominantTraits, LearningArchetype, StrengthAreas, GrowthAreas, RecommendedActivities, 
    AIConfidenceScore, LastAIAnalysis, ShareLearningData, ShareBehaviorAnalytics, 
    AllowPersonalization, ShowInLeaderboards, DataRetentionPreference, CreatedAt, UpdatedAt)
VALUES 
('student-001', 0.75, 0.82, 0.65, 0.78, 0.35,
    'Visual', '["Interactive", "Visual"]', 'adaptive', 'moderate', 'immediate',
    'Focused', 0.3, 0.75, 0.8, GETDATE(),
    '["analytical", "creative", "collaborative"]', 'The Explorer', 
    '["problem-solving", "visual learning", "analytical thinking"]',
    '["time management", "note-taking", "verbal communication"]',
    '["interactive simulations", "group projects", "visual aids"]',
    0.85, GETDATE(), 1, 0, 1, 1, 'standard', GETDATE(), GETDATE());

-- Insert sample assignments
INSERT INTO Assignments (Title, Description, LessonId, Instructions, MaxScore, DueDate, IsActive, CreatedById, CreatedAt, UpdatedAt)
VALUES 
('Integration Techniques', 'Practice advanced integration methods', 1, 'Complete problems 1-15 in chapter 8', 100, DATEADD(day, 5, GETDATE()), 1, 'instructor-001', GETDATE(), GETDATE()),
('Problem Set 4', 'Mixed calculus problems', 1, 'Solve all problems in problem set 4', 50, DATEADD(day, 8, GETDATE()), 1, 'instructor-001', GETDATE(), GETDATE()),
('Lab Report: DNA Extraction', 'Write a comprehensive lab report', 2, 'Document your DNA extraction process and results', 100, DATEADD(day, 3, GETDATE()), 1, 'instructor-002', GETDATE(), GETDATE());

-- Insert sample achievements
INSERT INTO StudentAchievements (StudentId, Title, Description, Category, EarnedDate, IconUrl, IsNew, Points)
VALUES 
('student-001', 'Math Wizard', 'Completed 10 calculus lessons with >85% score', 'academic', DATEADD(day, -5, GETDATE()), '/icons/math-wizard.svg', 1, 100),
('student-001', 'Active Participant', 'Posted 5 meaningful discussion contributions', 'engagement', DATEADD(day, -10, GETDATE()), '/icons/discussion.svg', 0, 50),
('student-001', 'Quick Learner', 'Completed lesson in under expected time', 'efficiency', DATEADD(day, -15, GETDATE()), '/icons/speed.svg', 0, 75);

-- Insert sample notifications
INSERT INTO Notifications (Type, Title, Message, Time, Read, Priority, UserId, UpdatedAt)
VALUES 
(1, 'Assignment Due Soon', 'Integration Techniques assignment is due in 5 days', DATEADD(hour, -3, GETDATE()), 0, 2, 1, GETDATE()),
(2, 'New Grade Posted', 'Your Biology Lab Report has been graded: 92%', DATEADD(hour, -6, GETDATE()), 0, 1, 1, GETDATE()),
(0, 'AI Study Recommendation', 'Based on your progress, consider reviewing integration by parts', DATEADD(hour, -12, GETDATE()), 1, 0, 1, GETDATE()),
(1, 'Course Update', 'New materials have been added to your English Literature course', DATEADD(day, -1, GETDATE()), 0, 1, 1, GETDATE()),
(0, 'Study Reminder', 'Don''t forget to review today''s lessons before tomorrow''s class', DATEADD(hour, -18, GETDATE()), 1, 0, 1, GETDATE());

-- Insert sample discussion posts
INSERT INTO DiscussionPosts (CourseId, AuthorId, Title, Content, CreatedAt, UpdatedAt, Likes, IsPinned, Tags)
VALUES 
(1, 'instructor-001', 'Welcome to Advanced Calculus!', 'Welcome everyone to our Advanced Calculus course! This is your space to ask questions, share insights, and collaborate with your classmates. Please remember to be respectful and constructive in all discussions.', DATEADD(day, -7, GETDATE()), DATEADD(day, -7, GETDATE()), 23, 1, '["announcement", "welcome"]'),
(1, 'student-001', 'Question about Integration by Parts', 'Hi everyone! I''m having trouble with the integration by parts method we covered in lesson 5. Could someone explain the LIATE rule again? Thanks!', DATEADD(day, -2, GETDATE()), DATEADD(day, -2, GETDATE()), 8, 0, '["question", "integration"]'),
(2, 'instructor-002', 'Lab Safety Reminder', 'Please remember to follow all safety protocols during our upcoming DNA extraction lab. Wear appropriate PPE and handle all chemicals with care.', DATEADD(day, -3, GETDATE()), DATEADD(day, -3, GETDATE()), 15, 1, '["safety", "lab"]');

-- Insert sample discussion replies
INSERT INTO DiscussionReplies (PostId, AuthorId, Content, CreatedAt, UpdatedAt, Likes)
VALUES 
(1, 'student-001', 'Thank you Dr. Rodriguez! Really excited to be part of this course.', DATEADD(day, -6, GETDATE()), DATEADD(day, -6, GETDATE()), 5),
(2, 'instructor-001', 'Great question! LIATE stands for Logarithms, Inverse trig, Algebraic, Trigonometric, Exponential. This is the order of priority for choosing u in integration by parts. Would you like to schedule office hours to go through some examples?', DATEADD(day, -1, GETDATE()), DATEADD(day, -1, GETDATE()), 12),
(3, 'student-001', 'Thanks for the reminder, Prof. Wilson! I''ll make sure to review the safety protocols before lab.', DATEADD(day, -2, GETDATE()), DATEADD(day, -2, GETDATE()), 3);

-- Insert sample behavior logs
INSERT INTO BehaviorLogs (StudentId, LessonId, SessionId, ActionType, Details, RiskScore, Flagged, CreatedAt)
VALUES 
('student-001', 1, 'session-001', 1, '{"action":"lesson_started","duration":0,"context":{"lesson":"Advanced Integration"}}', 0.1, 0, DATEADD(hour, -2, GETDATE())),
('student-001', 1, 'session-001', 3, '{"action":"question_answered","duration":45,"context":{"correct":true,"attempts":1}}', 0.1, 0, DATEADD(hour, -1, GETDATE())),
('student-001', 2, 'session-002', 1, '{"action":"lesson_started","duration":0,"context":{"lesson":"Molecular Genetics"}}', 0.2, 0, DATEADD(hour, -4, GETDATE()));

-- Sample lesson content
UPDATE Lessons SET Content = 'Welcome to Advanced Calculus! In this lesson, we will explore the fundamental concepts of integration and how they apply to real-world problems. You will learn about various integration techniques including substitution, integration by parts, and partial fractions.', VideoUrl = 'https://example.com/calculus-lesson-1' WHERE LessonId = 1;
UPDATE Lessons SET Content = 'Molecular Biology focuses on the structure and function of molecules that are essential to life. In this lesson, we will examine DNA, RNA, and proteins at the molecular level.', VideoUrl = 'https://example.com/biology-lesson-1' WHERE LessonId = 2;
