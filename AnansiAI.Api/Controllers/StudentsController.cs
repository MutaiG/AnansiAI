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

    // PUT: api/students/profile
    [HttpPut("profile")]
    public async Task<ActionResult<ApiResponse<StudentProfileDto>>> UpdateStudentProfile([FromBody] UpdateStudentProfileRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var profile = await _context.StudentProfiles
                .FirstOrDefaultAsync(p => p.StudentId == userId);

            if (profile == null)
            {
                return NotFound(new ApiResponse<StudentProfileDto>
                {
                    Success = false,
                    Error = "Student profile not found"
                });
            }

            // Update personality traits if provided
            if (request.PersonalityTraits != null)
            {
                profile.PersonalityTraits = JsonSerializer.Serialize(request.PersonalityTraits);
            }

            // Update learning preferences if provided
            if (request.LearningPreferences != null)
            {
                profile.LearningPreferences = JsonSerializer.Serialize(request.LearningPreferences);
            }

            // Update emotional state if provided
            if (request.EmotionalState != null)
            {
                profile.EmotionalState = JsonSerializer.Serialize(request.EmotionalState);
            }

            // Update parent contact info if provided
            if (request.ParentContactInfo != null)
            {
                profile.ParentContactInfo = JsonSerializer.Serialize(request.ParentContactInfo);
            }

            profile.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<StudentProfileDto>
            {
                Success = true,
                Data = MapToStudentProfileDto(profile)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating student profile for user {UserId}", User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            return Ok(new ApiResponse<StudentProfileDto>
            {
                Success = false,
                Error = "Failed to update profile"
            });
        }
    }

    // PUT: api/students/privacy-settings
    [HttpPut("privacy-settings")]
    public async Task<ActionResult<ApiResponse<PrivacySettingsDto>>> UpdatePrivacySettings([FromBody] UpdatePrivacySettingsRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            // Get or create privacy settings
            var privacySettings = await _context.PrivacySettings
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (privacySettings == null)
            {
                privacySettings = new PrivacySetting
                {
                    UserId = userId,
                    CreatedAt = DateTime.UtcNow
                };
                _context.PrivacySettings.Add(privacySettings);
            }

            // Update privacy settings if provided
            if (request.AllowAiPersonalityAnalysis.HasValue)
                privacySettings.AllowAiPersonalityAnalysis = request.AllowAiPersonalityAnalysis.Value;
                
            if (request.AllowBehaviorTracking.HasValue)
                privacySettings.AllowBehaviorTracking = request.AllowBehaviorTracking.Value;
                
            if (request.AllowInteractionRecording.HasValue)
                privacySettings.AllowInteractionRecording = request.AllowInteractionRecording.Value;
                
            if (request.ParentNotificationEnabled.HasValue)
                privacySettings.ParentNotificationEnabled = request.ParentNotificationEnabled.Value;
                
            if (request.DataSharingLevel.HasValue)
                privacySettings.DataSharingLevel = request.DataSharingLevel.Value;

            privacySettings.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var privacySettingsDto = new PrivacySettingsDto
            {
                AllowAiPersonalityAnalysis = privacySettings.AllowAiPersonalityAnalysis,
                AllowBehaviorTracking = privacySettings.AllowBehaviorTracking,
                AllowInteractionRecording = privacySettings.AllowInteractionRecording,
                ParentNotificationEnabled = privacySettings.ParentNotificationEnabled,
                DataSharingLevel = privacySettings.DataSharingLevel.ToString()
            };

            return Ok(new ApiResponse<PrivacySettingsDto>
            {
                Success = true,
                Data = privacySettingsDto
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating privacy settings for user {UserId}", User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            return Ok(new ApiResponse<PrivacySettingsDto>
            {
                Success = false,
                Error = "Failed to update privacy settings"
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
            // Create default student profile with JSONB structure
            profile = new StudentProfile
            {
                StudentId = userId,
                PersonalityTraits = JsonSerializer.Serialize(new
                {
                    openness = 0.5,
                    conscientiousness = 0.5,
                    extraversion = 0.5,
                    agreeableness = 0.5,
                    neuroticism = 0.5,
                    learningStyle = "Visual",
                    motivation = new[] { "Achievement", "Curiosity" },
                    strengths = new[] { "problem-solving", "visual learning" },
                    growthAreas = new[] { "time management", "verbal communication" },
                    lastAnalyzed = DateTime.UtcNow
                }),
                LearningPreferences = JsonSerializer.Serialize(new
                {
                    preferredPace = "moderate",
                    preferredDifficulty = "adaptive",
                    preferredModalities = new[] { "Interactive", "Visual" },
                    preferredTimeOfDay = "morning",
                    attentionSpan = 45,
                    breakPreference = 10,
                    feedbackStyle = "immediate",
                    collaborationPreference = "pairs"
                }),
                EmotionalState = JsonSerializer.Serialize(new
                {
                    currentMood = "Neutral",
                    stressLevel = 0.3,
                    motivationLevel = 0.8,
                    confidenceLevel = 0.7,
                    engagementLevel = 0.75,
                    frustrationLevel = 0.2,
                    lastUpdated = DateTime.UtcNow
                }),
                ParentContactInfo = JsonSerializer.Serialize(new
                {
                    primaryParent = new
                    {
                        name = "Parent Name",
                        email = "parent@email.com",
                        phone = "+1-555-0000",
                        relationship = "guardian"
                    },
                    emergencyContact = new
                    {
                        name = "Emergency Contact",
                        phone = "+1-555-0001",
                        relationship = "relative"
                    }
                }),
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
        // Simplified mock data for now
        return new List<EnrolledCourseDto>
        {
            new EnrolledCourseDto
            {
                Id = "1",
                Title = "Advanced Mathematics",
                Instructor = "Dr. Smith",
                Progress = 75.5,
                CompletedLessons = 8,
                TotalLessons = 12,
                RecentGrade = 88.5,
                AIRecommended = true,
                Subject = new SubjectDto
                {
                    SubjectId = 1,
                    Name = "Mathematics",
                    Description = "Advanced mathematics curriculum"
                }
            }
        };
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
            RiskLevel = "low",
            EngagementScore = 0.8,
            FocusScore = 0.75,
            RecentActivities = new List<string> { "Completed Math Lesson", "Participated in Discussion" },
            LastActivity = latestBehavior?.CreatedAt ?? DateTime.UtcNow.AddHours(-1)
        };
    }

    private async Task<List<AchievementDto>> GetStudentAchievements(string userId)
    {
        // Mock data for now
        return new List<AchievementDto>
        {
            new AchievementDto
            {
                Id = "1",
                Title = "Problem Solver",
                Description = "Completed 10 challenging problems",
                Category = "academic",
                EarnedDate = DateTime.UtcNow.AddDays(-5),
                IconUrl = "/icons/problem-solver.svg",
                IsNew = true
            }
        };
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
        // Deserialize JSONB fields
        var personalityTraits = JsonSerializer.Deserialize<Dictionary<string, object>>(profile.PersonalityTraits) ?? new();
        var learningPreferences = JsonSerializer.Deserialize<Dictionary<string, object>>(profile.LearningPreferences) ?? new();
        var emotionalState = JsonSerializer.Deserialize<Dictionary<string, object>>(profile.EmotionalState) ?? new();

        return new StudentProfileDto
        {
            Id = profile.ProfileId.ToString(),
            AppUserId = profile.StudentId,
            PersonalityTraits = new PersonalityTraitsDto
            {
                Openness = GetDoubleValue(personalityTraits, "openness", 0.5),
                Conscientiousness = GetDoubleValue(personalityTraits, "conscientiousness", 0.5),
                Extraversion = GetDoubleValue(personalityTraits, "extraversion", 0.5),
                Agreeableness = GetDoubleValue(personalityTraits, "agreeableness", 0.5),
                Neuroticism = GetDoubleValue(personalityTraits, "neuroticism", 0.5)
            },
            LearningPreferences = new LearningPreferencesDto
            {
                PreferredStyle = GetStringValue(personalityTraits, "learningStyle", "Visual"),
                PreferredModalities = GetStringArrayValue(learningPreferences, "preferredModalities", new[] { "Interactive", "Visual" }),
                DifficultyPreference = GetStringValue(learningPreferences, "preferredDifficulty", "adaptive"),
                PacePreference = GetStringValue(learningPreferences, "preferredPace", "moderate"),
                FeedbackFrequency = GetStringValue(learningPreferences, "feedbackStyle", "immediate")
            },
            EmotionalState = new EmotionalStateDto
            {
                CurrentMood = GetStringValue(emotionalState, "currentMood", "Neutral"),
                StressLevel = GetDoubleValue(emotionalState, "stressLevel", 0.3),
                ConfidenceLevel = GetDoubleValue(emotionalState, "confidenceLevel", 0.7),
                MotivationLevel = GetDoubleValue(emotionalState, "motivationLevel", 0.8),
                LastUpdated = GetDateTimeValue(emotionalState, "lastUpdated", DateTime.UtcNow)
            },
            AIPersonalityAnalysis = new AIPersonalityAnalysisDto
            {
                DominantTraits = GetStringArrayValue(personalityTraits, "strengths", new[] { "analytical", "creative" }),
                LearningArchetype = "The Explorer",
                StrengthAreas = GetStringArrayValue(personalityTraits, "strengths", new[] { "problem-solving", "visual learning" }),
                GrowthAreas = GetStringArrayValue(personalityTraits, "growthAreas", new[] { "time management", "verbal communication" }),
                RecommendedActivities = new List<string> { "interactive simulations", "group projects" },
                ConfidenceScore = 0.85,
                LastAnalysis = GetDateTimeValue(personalityTraits, "lastAnalyzed", DateTime.UtcNow)
            },
            PrivacySettings = new PrivacySettingsDto
            {
                ShareLearningData = true,
                ShareBehaviorAnalytics = false,
                AllowPersonalization = true,
                ShowInLeaderboards = true,
                DataRetentionPreference = "standard"
            }
        };
    }

    private static double GetDoubleValue(Dictionary<string, object> dict, string key, double defaultValue)
    {
        if (dict.TryGetValue(key, out var value))
        {
            if (value is JsonElement element && element.ValueKind == JsonValueKind.Number)
                return element.GetDouble();
            if (double.TryParse(value?.ToString(), out var result))
                return result;
        }
        return defaultValue;
    }

    private static string GetStringValue(Dictionary<string, object> dict, string key, string defaultValue)
    {
        if (dict.TryGetValue(key, out var value))
        {
            if (value is JsonElement element && element.ValueKind == JsonValueKind.String)
                return element.GetString() ?? defaultValue;
            return value?.ToString() ?? defaultValue;
        }
        return defaultValue;
    }

    private static DateTime GetDateTimeValue(Dictionary<string, object> dict, string key, DateTime defaultValue)
    {
        if (dict.TryGetValue(key, out var value))
        {
            if (value is JsonElement element && element.ValueKind == JsonValueKind.String)
            {
                if (DateTime.TryParse(element.GetString(), out var result))
                    return result;
            }
            if (DateTime.TryParse(value?.ToString(), out var result2))
                return result2;
        }
        return defaultValue;
    }

    private static List<string> GetStringArrayValue(Dictionary<string, object> dict, string key, string[] defaultValue)
    {
        if (dict.TryGetValue(key, out var value))
        {
            if (value is JsonElement element && element.ValueKind == JsonValueKind.Array)
            {
                return element.EnumerateArray()
                    .Where(e => e.ValueKind == JsonValueKind.String)
                    .Select(e => e.GetString()!)
                    .ToList();
            }
        }
        return defaultValue.ToList();
    }
}
