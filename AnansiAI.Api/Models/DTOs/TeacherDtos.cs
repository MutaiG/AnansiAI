namespace AnansiAI.Api.Models.DTOs;

public class TeacherDashboardDto
{
    public TeacherProfileDto TeacherProfile { get; set; } = new();
    public TeacherStatsDto Stats { get; set; } = new();
    public List<ClassDto> Classes { get; set; } = new();
    public List<StudentDataDto> Students { get; set; } = new();
    public List<AIAlertDto> AIAlerts { get; set; } = new();
    public List<AITwinInsightDto> AITwinInsights { get; set; } = new();
    public List<RecentActivityDto> RecentActivity { get; set; } = new();
    public List<LessonContentDto> LessonContent { get; set; } = new();
}

public class TeacherProfileDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Avatar { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string Experience { get; set; } = string.Empty;
    public double Rating { get; set; }
    public List<string> Certifications { get; set; } = new();
    public string Bio { get; set; } = string.Empty;
}

public class TeacherStatsDto
{
    public int TotalStudents { get; set; }
    public int ActiveClasses { get; set; }
    public int PendingSubmissions { get; set; }
    public int AverageProgress { get; set; }
    public int StrugglingSStudents { get; set; }
    public int ExcellingStudents { get; set; }
    public int WeeklyEngagement { get; set; }
    public int CompletionRate { get; set; }
}

public class ClassDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Grade { get; set; } = string.Empty;
    public int StudentCount { get; set; }
    public int Progress { get; set; }
    public string NextLesson { get; set; } = string.Empty;
    public string Schedule { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class StudentDataDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Avatar { get; set; }
    public string Grade { get; set; } = string.Empty;
    public string Class { get; set; } = string.Empty;
    public int OverallProgress { get; set; }
    public string LastActive { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string CurrentMood { get; set; } = string.Empty;
    public double RiskScore { get; set; }
    public List<string> AiRecommendations { get; set; } = new();
    public int RecentSubmissions { get; set; }
    public int AverageGrade { get; set; }
}

public class AIAlertDto
{
    public string Id { get; set; } = string.Empty;
    public string StudentId { get; set; } = string.Empty;
    public string StudentName { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Severity { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Timestamp { get; set; } = string.Empty;
    public bool ActionTaken { get; set; }
    public List<string> Recommendations { get; set; } = new();
}

public class LessonContentDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Difficulty { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string CreatedAt { get; set; } = string.Empty;
    public int StudentsCompleted { get; set; }
    public int AverageScore { get; set; }
    public int EstimatedDuration { get; set; }
}

public class AITwinInsightDto
{
    public string Id { get; set; } = string.Empty;
    public string StudentId { get; set; } = string.Empty;
    public string StudentName { get; set; } = string.Empty;
    public string TwinLearningStage { get; set; } = "initializing"; // initializing, learning, adapting, optimized
    public PersonalityTraitsDto PersonalityTraits { get; set; } = new();
    public LearningPreferencesDto LearningPreferences { get; set; } = new();
    public EmotionalStateDto EmotionalState { get; set; } = new();
    public BehaviorAnalysisDto BehaviorAnalysis { get; set; } = new();
    public TwinAdaptationsDto TwinAdaptations { get; set; } = new();
    public PrivacySettingsDto PrivacySettings { get; set; } = new();
    public string LastTwinInteraction { get; set; } = string.Empty;
    public int TwinEffectivenessScore { get; set; } = 0; // 1-100
}

public class PersonalityTraitsDto
{
    public string LearningStyle { get; set; } = string.Empty;
    public string Motivation { get; set; } = string.Empty;
    public List<string> Strengths { get; set; } = new();
    public List<string> Challenges { get; set; } = new();
}

public class LearningPreferencesDto
{
    public string PreferredPace { get; set; } = "medium"; // slow, medium, fast
    public List<string> PreferredFormat { get; set; } = new();
    public string OptimalStudyTime { get; set; } = string.Empty;
    public int DifficultyPreference { get; set; } = 5; // 1-10
}

public class EmotionalStateDto
{
    public string CurrentMood { get; set; } = string.Empty;
    public int StressLevel { get; set; } = 5; // 1-10
    public int ConfidenceLevel { get; set; } = 5; // 1-10
    public int EngagementLevel { get; set; } = 5; // 1-10
}

public class BehaviorAnalysisDto
{
    public float RiskScore { get; set; } = 0; // From BehaviorLog.RiskScore
    public List<string> FlaggedBehaviors { get; set; } = new();
    public List<string> PositivePatterns { get; set; } = new();
    public int LastSessionQuality { get; set; } = 5; // 1-10
}

public class TwinAdaptationsDto
{
    public List<string> ContentAdjustments { get; set; } = new();
    public List<string> PacingChanges { get; set; } = new();
    public List<string> SupportStrategies { get; set; } = new();
    public List<string> NextRecommendations { get; set; } = new();
}

public class PrivacySettingsDto
{
    public bool AllowPersonalityAnalysis { get; set; } = true;
    public bool AllowBehaviorTracking { get; set; } = true;
    public bool AllowInteractionRecording { get; set; } = true;
    public bool ParentNotificationEnabled { get; set; } = true;
}

public class RecentActivityDto
{
    public string Id { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Timestamp { get; set; } = string.Empty;
}

// Request DTOs
public class CreateClassRequest
{
    public string Name { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Grade { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Schedule { get; set; }
    public int? MaxStudents { get; set; }
}

public class CreateContentRequest
{
    public string Title { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Difficulty { get; set; } = string.Empty;
}

public class UpdateTeacherProfileRequest
{
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Subject { get; set; }
    public string? Bio { get; set; }
    public List<string>? Certifications { get; set; }
}

public class ResolveAlertRequest
{
    public string AlertId { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string? Notes { get; set; }
}

// Analytics DTOs
public class ClassAnalyticsDto
{
    public string ClassId { get; set; } = string.Empty;
    public string ClassName { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public int TotalStudents { get; set; }
    public int AverageProgress { get; set; }
    public int EngagementRate { get; set; }
    public int CompletionRate { get; set; }
    public int AverageGrade { get; set; }
    public List<string> StrugglingStiudents { get; set; } = new();
    public List<string> TopPerformers { get; set; } = new();
    public List<WeeklyTrendDto> WeeklyTrends { get; set; } = new();
    public List<AssignmentStatDto> AssignmentStats { get; set; } = new();
    public List<string> AIInsights { get; set; } = new();
}

public class WeeklyTrendDto
{
    public string Week { get; set; } = string.Empty;
    public int Engagement { get; set; }
    public int Completion { get; set; }
    public int RiskFlags { get; set; }
}

public class AssignmentStatDto
{
    public string AssignmentId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int Submissions { get; set; }
    public int AverageScore { get; set; }
    public int CompletionRate { get; set; }
}

public class ContentAnalyticsDto
{
    public string ContentId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public int ViewCount { get; set; }
    public int CompletionCount { get; set; }
    public int AverageTimeSpent { get; set; }
    public double DropoffRate { get; set; }
    public int DifficultyRating { get; set; }
    public List<string> StudentFeedback { get; set; } = new();
    public List<PerformanceDataDto> PerformanceData { get; set; } = new();
    public List<string> AIRecommendations { get; set; } = new();
}

public class PerformanceDataDto
{
    public string Date { get; set; } = string.Empty;
    public int Views { get; set; }
    public int Completions { get; set; }
    public int AverageTime { get; set; }
}

// Update request DTOs
public class UpdateClassRequest
{
    public string? Name { get; set; }
    public string? Grade { get; set; }
    public string? Description { get; set; }
    public string? Schedule { get; set; }
    public string? NextLesson { get; set; }
    public int? MaxStudents { get; set; }
}

public class UpdateContentRequest
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Difficulty { get; set; }
    public string? Status { get; set; }
}
