using AnansiAI.Api.Models.Entities;

namespace AnansiAI.Api.Models.DTOs;

public class StudentDashboardDto
{
    public StudentProfileDto Profile { get; set; } = new();
    public List<EnrolledCourseDto> EnrolledCourses { get; set; } = new();
    public BehaviorSummaryDto BehaviorSummary { get; set; } = new();
    public List<AchievementDto> Achievements { get; set; } = new();
    public List<NotificationDto> Notifications { get; set; } = new();
}

public class StudentProfileDto
{
    public string Id { get; set; } = string.Empty;
    public string AppUserId { get; set; } = string.Empty;
    public PersonalityTraitsDto PersonalityTraits { get; set; } = new();
    public LearningPreferencesDto LearningPreferences { get; set; } = new();
    public EmotionalStateDto EmotionalState { get; set; } = new();
    public AIPersonalityAnalysisDto AIPersonalityAnalysis { get; set; } = new();
    public PrivacySettingsDto PrivacySettings { get; set; } = new();
}

public class PersonalityTraitsDto
{
    public double Openness { get; set; }
    public double Conscientiousness { get; set; }
    public double Extraversion { get; set; }
    public double Agreeableness { get; set; }
    public double Neuroticism { get; set; }
}

public class LearningPreferencesDto
{
    public string PreferredStyle { get; set; } = "Visual";
    public List<string> PreferredModalities { get; set; } = new();
    public string DifficultyPreference { get; set; } = "adaptive";
    public string PacePreference { get; set; } = "moderate";
    public string FeedbackFrequency { get; set; } = "immediate";
}

public class EmotionalStateDto
{
    public string CurrentMood { get; set; } = "Neutral";
    public double StressLevel { get; set; }
    public double ConfidenceLevel { get; set; }
    public double MotivationLevel { get; set; }
    public DateTime LastUpdated { get; set; }
}

public class AIPersonalityAnalysisDto
{
    public List<string> DominantTraits { get; set; } = new();
    public string LearningArchetype { get; set; } = string.Empty;
    public List<string> StrengthAreas { get; set; } = new();
    public List<string> GrowthAreas { get; set; } = new();
    public List<string> RecommendedActivities { get; set; } = new();
    public double ConfidenceScore { get; set; }
    public DateTime LastAnalysis { get; set; }
}

public class PrivacySettingsDto
{
    public bool AllowAiPersonalityAnalysis { get; set; } = true;
    public bool AllowBehaviorTracking { get; set; } = true;
    public bool AllowInteractionRecording { get; set; } = true;
    public string DataSharingLevel { get; set; } = "Standard";
    public bool ParentNotificationEnabled { get; set; } = true;

    // Legacy fields for backward compatibility
    public bool ShareLearningData { get; set; } = true;
    public bool ShareBehaviorAnalytics { get; set; } = false;
    public bool AllowPersonalization { get; set; } = true;
    public bool ShowInLeaderboards { get; set; } = true;
    public string DataRetentionPreference { get; set; } = "standard";
}

public class EnrolledCourseDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Instructor { get; set; } = string.Empty;
    public double Progress { get; set; }
    public int CompletedLessons { get; set; }
    public int TotalLessons { get; set; }
    public double? RecentGrade { get; set; }
    public bool AIRecommended { get; set; }
    public SubjectDto Subject { get; set; } = new();
    public List<AssignmentDto> UpcomingAssignments { get; set; } = new();
}

public class SubjectDto
{
    public int SubjectId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class AssignmentDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public string Priority { get; set; } = "medium";
    public string Status { get; set; } = "pending";
}

public class BehaviorSummaryDto
{
    public string CurrentMood { get; set; } = "Neutral";
    public string RiskLevel { get; set; } = "low";
    public double EngagementScore { get; set; }
    public double FocusScore { get; set; }
    public List<string> RecentActivities { get; set; } = new();
    public DateTime LastActivity { get; set; }
}

public class AchievementDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public DateTime EarnedDate { get; set; }
    public string IconUrl { get; set; } = string.Empty;
    public bool IsNew { get; set; }
}

public class NotificationDto
{
    public string Id { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public bool Read { get; set; }
    public string Priority { get; set; } = "medium";
}

public class LessonDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Type { get; set; } = "video";
    public int Duration { get; set; }
    public bool Completed { get; set; }
    public LessonContentDto Content { get; set; } = new();
}

public class LessonContentDto
{
    public string? VideoUrl { get; set; }
    public string? TextContent { get; set; }
    public List<object> QuizQuestions { get; set; } = new();
    public List<object> InteractiveElements { get; set; } = new();
}

public class CourseDiscussionDto
{
    public string Id { get; set; } = string.Empty;
    public string CourseId { get; set; } = string.Empty;
    public List<DiscussionPostDto> Posts { get; set; } = new();
}

public class DiscussionPostDto
{
    public string Id { get; set; } = string.Empty;
    public AuthorDto Author { get; set; } = new();
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public int Likes { get; set; }
    public List<DiscussionReplyDto> Replies { get; set; } = new();
    public bool IsPinned { get; set; }
    public List<string> Tags { get; set; } = new();
    public bool IsLiked { get; set; }
}

public class DiscussionReplyDto
{
    public string Id { get; set; } = string.Empty;
    public AuthorDto Author { get; set; } = new();
    public string Content { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public int Likes { get; set; }
    public bool IsLiked { get; set; }
}

public class AuthorDto
{
    public string Name { get; set; } = string.Empty;
    public string? Avatar { get; set; }
    public string Role { get; set; } = "student";
}

// Request DTOs for Profile Updates
public class UpdateStudentProfileRequest
{
    public PersonalityTraitsDto? PersonalityTraits { get; set; }
    public LearningPreferencesDto? LearningPreferences { get; set; }
    public EmotionalStateDto? EmotionalState { get; set; }
    public ParentContactInfoDto? ParentContactInfo { get; set; }
}

public class UpdatePrivacySettingsRequest
{
    public bool? AllowAiPersonalityAnalysis { get; set; }
    public bool? AllowBehaviorTracking { get; set; }
    public bool? AllowInteractionRecording { get; set; }
    public DataSharingLevel? DataSharingLevel { get; set; }
    public bool? ParentNotificationEnabled { get; set; }

    // Legacy fields for backward compatibility
    public bool? ShareLearningData { get; set; }
    public bool? ShareBehaviorAnalytics { get; set; }
    public bool? AllowPersonalization { get; set; }
    public bool? ShowInLeaderboards { get; set; }
    public string? DataRetentionPreference { get; set; }
}

public class TriggerPersonalityAnalysisRequest
{
    public bool ForceAnalysis { get; set; } = false;
    public string? Context { get; set; }
}

public class ParentContactInfoDto
{
    public ParentInfoDto? PrimaryParent { get; set; }
    public ParentInfoDto? SecondaryParent { get; set; }
    public EmergencyContactDto? EmergencyContact { get; set; }
    public CommunicationPreferencesDto? CommunicationPreferences { get; set; }
}

public class ParentInfoDto
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Relationship { get; set; } = "guardian";
    public string PreferredContact { get; set; } = "email";
}

public class EmergencyContactDto
{
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Relationship { get; set; } = string.Empty;
}

public class CommunicationPreferencesDto
{
    public string ProgressReports { get; set; } = "weekly";
    public List<string> AlertTypes { get; set; } = new();
    public string Language { get; set; } = "en";
    public string Timezone { get; set; } = "UTC";
}
