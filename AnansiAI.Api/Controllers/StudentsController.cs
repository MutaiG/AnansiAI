using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AnansiAI.Api.Data;
using AnansiAI.Api.Models.DTOs;
using AnansiAI.Api.Models.Entities;
using System.Security.Claims;
using System.Text.Json;

namespace AnansiAI.Api.Controllers;

[ApiController]
[Route("api/students")]
[Authorize]
public class StudentsController : ControllerBase
{
    private readonly AnansiDbContext _context;
    private readonly ILogger<StudentsController> _logger;

    public StudentsController(AnansiDbContext context, ILogger<StudentsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/students/dashboard
    [HttpGet("dashboard")]
    public async Task<ActionResult<ApiResponse<StudentDashboardDto>>> GetStudentDashboard()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            // Get or create student profile
            var studentProfile = await GetOrCreateStudentProfile(userId);

            // Get enrolled courses
            var enrolledCourses = await GetStudentCourses(userId);

            // Get behavior summary
            var behaviorSummary = await GetBehaviorSummary(userId);

            // Get achievements
            var achievements = await GetStudentAchievements(userId);

            // Get notifications
            var notifications = await GetStudentNotifications(userId);

            var dashboardData = new StudentDashboardDto
            {
                Profile = MapToStudentProfileDto(studentProfile),
                EnrolledCourses = enrolledCourses,
                BehaviorSummary = behaviorSummary,
                Achievements = achievements,
                Notifications = notifications
            };

            return Ok(new ApiResponse<StudentDashboardDto>
            {
                Success = true,
                Data = dashboardData
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting student dashboard for user {UserId}", User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            return Ok(new ApiResponse<StudentDashboardDto>
            {
                Success = false,
                Error = "Failed to load dashboard data"
            });
        }
    }

    // GET: api/students/courses/{courseId}/lessons
    [HttpGet("courses/{courseId}/lessons")]
    public async Task<ActionResult<ApiResponse<List<LessonDto>>>> GetCourseLessons(int courseId)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            // Check if student is enrolled in the course
            var enrollment = await _context.CourseEnrollments
                .FirstOrDefaultAsync(e => e.CourseId == courseId && e.StudentId == userId);

            if (enrollment == null)
            {
                return Forbid("Not enrolled in this course");
            }

            var lessons = await _context.Lessons
                .Where(l => l.SubjectId == courseId) // Assuming course relates to subject
                .Select(l => new LessonDto
                {
                    Id = l.LessonId.ToString(),
                    Title = l.Title,
                    Description = l.Description ?? string.Empty,
                    Type = "video", // Default type
                    Duration = l.EstimatedDurationMinutes,
                    Completed = false, // You might want to track this separately
                    Content = new LessonContentDto
                    {
                        TextContent = l.Content ?? "Lesson content goes here...",
                        VideoUrl = l.VideoUrl,
                        QuizQuestions = new List<object>(),
                        InteractiveElements = new List<object>()
                    }
                })
                .ToListAsync();

            return Ok(new ApiResponse<List<LessonDto>>
            {
                Success = true,
                Data = lessons
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting course lessons for course {CourseId}", courseId);
            return Ok(new ApiResponse<List<LessonDto>>
            {
                Success = false,
                Error = "Failed to load lessons"
            });
        }
    }

    // GET: api/students/courses/{courseId}/discussion
    [HttpGet("courses/{courseId}/discussion")]
    public async Task<ActionResult<ApiResponse<CourseDiscussionDto>>> GetCourseDiscussion(int courseId)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var posts = await _context.DiscussionPosts
                .Include(p => p.Author)
                .Include(p => p.Replies)
                    .ThenInclude(r => r.Author)
                .Include(p => p.PostLikes)
                .Where(p => p.CourseId == courseId)
                .OrderByDescending(p => p.IsPinned)
                .ThenByDescending(p => p.CreatedAt)
                .Select(p => new DiscussionPostDto
                {
                    Id = p.PostId.ToString(),
                    Author = new AuthorDto
                    {
                        Name = p.Author.FullName,
                        Role = "student", // Simplified for now
                        Avatar = p.Author.PhotoUrl
                    },
                    Title = p.Title,
                    Content = p.Content,
                    Timestamp = p.CreatedAt,
                    Likes = p.Likes,
                    IsPinned = p.IsPinned,
                    Tags = JsonSerializer.Deserialize<List<string>>(p.Tags) ?? new List<string>(),
                    IsLiked = p.PostLikes.Any(pl => pl.UserId == userId),
                    Replies = p.Replies.Select(r => new DiscussionReplyDto
                    {
                        Id = r.ReplyId.ToString(),
                        Author = new AuthorDto
                        {
                            Name = r.Author.FullName,
                            Role = "student",
                            Avatar = r.Author.PhotoUrl
                        },
                        Content = r.Content,
                        Timestamp = r.CreatedAt,
                        Likes = r.Likes,
                        IsLiked = r.ReplyLikes.Any(rl => rl.UserId == userId)
                    }).ToList()
                })
                .ToListAsync();

            var discussion = new CourseDiscussionDto
            {
                Id = courseId.ToString(),
                CourseId = courseId.ToString(),
                Posts = posts
            };

            return Ok(new ApiResponse<CourseDiscussionDto>
            {
                Success = true,
                Data = discussion
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting course discussion for course {CourseId}", courseId);
            return Ok(new ApiResponse<CourseDiscussionDto>
            {
                Success = false,
                Error = "Failed to load discussion"
            });
        }
    }

    // POST: api/students/notifications/read-all
    [HttpPost("notifications/read-all")]
    public async Task<ActionResult<ApiResponse<bool>>> MarkAllNotificationsAsRead()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var notifications = await _context.Notifications
                .Where(n => n.UserId == int.Parse(userId) && !n.Read)
                .ToListAsync();

            foreach (var notification in notifications)
            {
                notification.Read = true;
                notification.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<bool>
            {
                Success = true,
                Data = true
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error marking all notifications as read");
            return Ok(new ApiResponse<bool>
            {
                Success = false,
                Error = "Failed to mark all notifications as read"
            });
        }
    }

    // POST: api/students/notifications/{notificationId}/read
    [HttpPost("notifications/{notificationId}/read")]
    public async Task<ActionResult<ApiResponse<bool>>> MarkNotificationAsRead(int notificationId)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.Id == notificationId && n.UserId == int.Parse(userId));

            if (notification != null)
            {
                notification.Read = true;
                notification.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }

            return Ok(new ApiResponse<bool>
            {
                Success = true,
                Data = true
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error marking notification as read {NotificationId}", notificationId);
            return Ok(new ApiResponse<bool>
            {
                Success = false,
                Error = "Failed to mark notification as read"
            });
        }
    }

    // Private helper methods
    private async Task<StudentProfile> GetOrCreateStudentProfile(string userId)
    {
        var profile = await _context.StudentProfiles
            .FirstOrDefaultAsync(p => p.StudentId == userId);

        if (profile == null)
        {
            // Create default student profile
            profile = new StudentProfile
            {
                StudentId = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.StudentProfiles.Add(profile);
            await _context.SaveChangesAsync();
        }

        return profile;
    }

    private async Task<List<EnrolledCourseDto>> GetStudentCourses(string userId)
    {
        var enrollments = await _context.CourseEnrollments
            .Include(e => e.Course)
                .ThenInclude(c => c.Subject)
            .Include(e => e.Course)
                .ThenInclude(c => c.Instructor)
            .Include(e => e.Course)
                .ThenInclude(c => c.Assignments)
            .Where(e => e.StudentId == userId && e.Status == "active")
            .ToListAsync();

        return enrollments.Select(e => new EnrolledCourseDto
        {
            Id = e.Course.CourseId.ToString(),
            Title = e.Course.Title,
            Instructor = e.Course.Instructor.FullName,
            Progress = e.Progress,
            CompletedLessons = e.CompletedLessons,
            TotalLessons = _context.Lessons.Count(l => l.SubjectId == e.Course.SubjectId),
            RecentGrade = e.CurrentGrade,
            AIRecommended = e.IsAIRecommended,
            Subject = new SubjectDto
            {
                SubjectId = e.Course.Subject.SubjectId,
                Name = e.Course.Subject.SubjectName,
                Description = e.Course.Subject.Description
            },
            UpcomingAssignments = e.Course.Assignments
                .Where(a => a.DueDate > DateTime.UtcNow && a.IsActive)
                .Select(a => new AssignmentDto
                {
                    Id = a.AssignmentId.ToString(),
                    Title = a.Title,
                    DueDate = a.DueDate,
                    Priority = "medium", // You can add priority logic here
                    Status = "pending"
                })
                .ToList()
        }).ToList();
    }

    private async Task<BehaviorSummaryDto> GetBehaviorSummary(string userId)
    {
        var latestBehavior = await _context.BehaviorLogs
            .Where(b => b.StudentId == userId)
            .OrderByDescending(b => b.CreatedAt)
            .FirstOrDefaultAsync();

        return new BehaviorSummaryDto
        {
            CurrentMood = latestBehavior?.Details ?? "Neutral",
            RiskLevel = "low", // You can implement risk calculation logic
            EngagementScore = 0.8,
            FocusScore = 0.75,
            RecentActivities = new List<string> { "Completed Math Lesson", "Participated in Discussion" },
            LastActivity = latestBehavior?.CreatedAt ?? DateTime.UtcNow.AddHours(-1)
        };
    }

    private async Task<List<AchievementDto>> GetStudentAchievements(string userId)
    {
        return await _context.StudentAchievements
            .Where(a => a.StudentId == userId)
            .OrderByDescending(a => a.EarnedDate)
            .Select(a => new AchievementDto
            {
                Id = a.AchievementId.ToString(),
                Title = a.Title,
                Description = a.Description,
                Category = a.Category,
                EarnedDate = a.EarnedDate,
                IconUrl = a.IconUrl,
                IsNew = a.IsNew
            })
            .ToListAsync();
    }

    private async Task<List<NotificationDto>> GetStudentNotifications(string userId)
    {
        return await _context.Notifications
            .Where(n => n.UserId == int.Parse(userId))
            .OrderByDescending(n => n.Time)
            .Take(10)
            .Select(n => new NotificationDto
            {
                Id = n.Id.ToString(),
                Type = n.Type.ToString(),
                Title = n.Title,
                Message = n.Message,
                Timestamp = n.Time,
                Read = n.Read,
                Priority = n.Priority.ToString()
            })
            .ToListAsync();
    }

    private static StudentProfileDto MapToStudentProfileDto(StudentProfile profile)
    {
        return new StudentProfileDto
        {
            Id = profile.StudentProfileId.ToString(),
            AppUserId = profile.StudentId,
            PersonalityTraits = new PersonalityTraitsDto
            {
                Openness = profile.Openness,
                Conscientiousness = profile.Conscientiousness,
                Extraversion = profile.Extraversion,
                Agreeableness = profile.Agreeableness,
                Neuroticism = profile.Neuroticism
            },
            LearningPreferences = new LearningPreferencesDto
            {
                PreferredStyle = profile.PreferredLearningStyle,
                PreferredModalities = JsonSerializer.Deserialize<List<string>>(profile.PreferredModalities) ?? new List<string>(),
                DifficultyPreference = profile.DifficultyPreference,
                PacePreference = profile.PacePreference,
                FeedbackFrequency = profile.FeedbackFrequency
            },
            EmotionalState = new EmotionalStateDto
            {
                CurrentMood = profile.CurrentMood,
                StressLevel = profile.StressLevel,
                ConfidenceLevel = profile.ConfidenceLevel,
                MotivationLevel = profile.MotivationLevel,
                LastUpdated = profile.EmotionalStateLastUpdated
            },
            AIPersonalityAnalysis = new AIPersonalityAnalysisDto
            {
                DominantTraits = JsonSerializer.Deserialize<List<string>>(profile.DominantTraits) ?? new List<string>(),
                LearningArchetype = profile.LearningArchetype,
                StrengthAreas = JsonSerializer.Deserialize<List<string>>(profile.StrengthAreas) ?? new List<string>(),
                GrowthAreas = JsonSerializer.Deserialize<List<string>>(profile.GrowthAreas) ?? new List<string>(),
                RecommendedActivities = JsonSerializer.Deserialize<List<string>>(profile.RecommendedActivities) ?? new List<string>(),
                ConfidenceScore = profile.AIConfidenceScore,
                LastAnalysis = profile.LastAIAnalysis
            },
            PrivacySettings = new PrivacySettingsDto
            {
                ShareLearningData = profile.ShareLearningData,
                ShareBehaviorAnalytics = profile.ShareBehaviorAnalytics,
                AllowPersonalization = profile.AllowPersonalization,
                ShowInLeaderboards = profile.ShowInLeaderboards,
                DataRetentionPreference = profile.DataRetentionPreference
            }
        };
    }
}
