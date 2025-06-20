using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AnansiAI.Api.Models.Entities;

public class StudentProfile
{
    [Key]
    public int StudentProfileId { get; set; }
    
    [Required]
    public string StudentId { get; set; } = string.Empty;
    
    [ForeignKey("StudentId")]
    public AppUser Student { get; set; } = null!;
    
    // Personality Traits (0-1 scale)
    public double Openness { get; set; } = 0.5;
    public double Conscientiousness { get; set; } = 0.5;
    public double Extraversion { get; set; } = 0.5;
    public double Agreeableness { get; set; } = 0.5;
    public double Neuroticism { get; set; } = 0.5;
    
    // Learning Preferences
    public string PreferredLearningStyle { get; set; } = "Visual";
    public string PreferredModalities { get; set; } = "Interactive,Visual"; // JSON array as string
    public string DifficultyPreference { get; set; } = "adaptive";
    public string PacePreference { get; set; } = "moderate";
    public string FeedbackFrequency { get; set; } = "immediate";
    
    // Current Emotional State
    public string CurrentMood { get; set; } = "Neutral";
    public double StressLevel { get; set; } = 0.3;
    public double ConfidenceLevel { get; set; } = 0.7;
    public double MotivationLevel { get; set; } = 0.8;
    public DateTime EmotionalStateLastUpdated { get; set; } = DateTime.UtcNow;
    
    // AI Analysis
    public string DominantTraits { get; set; } = "analytical,creative"; // JSON array as string
    public string LearningArchetype { get; set; } = "The Explorer";
    public string StrengthAreas { get; set; } = "problem-solving,visual learning"; // JSON array as string
    public string GrowthAreas { get; set; } = "time management,verbal communication"; // JSON array as string
    public string RecommendedActivities { get; set; } = "interactive simulations,group projects"; // JSON array as string
    public double AIConfidenceScore { get; set; } = 0.85;
    public DateTime LastAIAnalysis { get; set; } = DateTime.UtcNow;
    
    // Privacy Settings
    public bool ShareLearningData { get; set; } = true;
    public bool ShareBehaviorAnalytics { get; set; } = false;
    public bool AllowPersonalization { get; set; } = true;
    public bool ShowInLeaderboards { get; set; } = true;
    public string DataRetentionPreference { get; set; } = "standard";
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public ICollection<CourseEnrollment> CourseEnrollments { get; set; } = new List<CourseEnrollment>();
    public ICollection<StudentAchievement> Achievements { get; set; } = new List<StudentAchievement>();
}

public class Course
{
    [Key]
    public int CourseId { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;
    
    [Required]
    public string InstructorId { get; set; } = string.Empty;
    
    [ForeignKey("InstructorId")]
    public AppUser Instructor { get; set; } = null!;
    
    [Required]
    public int SubjectId { get; set; }
    
    [ForeignKey("SubjectId")]
    public Subject Subject { get; set; } = null!;
    
    public bool IsActive { get; set; } = true;
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int MaxStudents { get; set; } = 30;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public ICollection<CourseEnrollment> Enrollments { get; set; } = new List<CourseEnrollment>();
    public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
    public ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();
    public ICollection<DiscussionPost> DiscussionPosts { get; set; } = new List<DiscussionPost>();
}

public class CourseEnrollment
{
    [Key]
    public int EnrollmentId { get; set; }
    
    [Required]
    public string StudentId { get; set; } = string.Empty;
    
    [ForeignKey("StudentId")]
    public AppUser Student { get; set; } = null!;
    
    [Required]
    public int CourseId { get; set; }
    
    [ForeignKey("CourseId")]
    public Course Course { get; set; } = null!;
    
    public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;
    public double Progress { get; set; } = 0.0;
    public int CompletedLessons { get; set; } = 0;
    public double? CurrentGrade { get; set; }
    public bool IsAIRecommended { get; set; } = false;
    public string Status { get; set; } = "active"; // active, completed, dropped
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class StudentAchievement
{
    [Key]
    public int AchievementId { get; set; }
    
    [Required]
    public string StudentId { get; set; } = string.Empty;
    
    [ForeignKey("StudentId")]
    public AppUser Student { get; set; } = null!;
    
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;
    
    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;
    
    public DateTime EarnedDate { get; set; } = DateTime.UtcNow;
    
    [MaxLength(500)]
    public string IconUrl { get; set; } = string.Empty;
    
    public bool IsNew { get; set; } = true;
    public int Points { get; set; } = 0;
}

public class DiscussionPost
{
    [Key]
    public int PostId { get; set; }
    
    [Required]
    public int CourseId { get; set; }
    
    [ForeignKey("CourseId")]
    public Course Course { get; set; } = null!;
    
    [Required]
    public string AuthorId { get; set; } = string.Empty;
    
    [ForeignKey("AuthorId")]
    public AppUser Author { get; set; } = null!;
    
    [Required]
    [MaxLength(300)]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(5000)]
    public string Content { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    public int Likes { get; set; } = 0;
    public bool IsPinned { get; set; } = false;
    public string Tags { get; set; } = string.Empty; // JSON array as string
    
    // Navigation properties
    public ICollection<DiscussionReply> Replies { get; set; } = new List<DiscussionReply>();
    public ICollection<PostLike> PostLikes { get; set; } = new List<PostLike>();
}

public class DiscussionReply
{
    [Key]
    public int ReplyId { get; set; }
    
    [Required]
    public int PostId { get; set; }
    
    [ForeignKey("PostId")]
    public DiscussionPost Post { get; set; } = null!;
    
    [Required]
    public string AuthorId { get; set; } = string.Empty;
    
    [ForeignKey("AuthorId")]
    public AppUser Author { get; set; } = null!;
    
    [Required]
    [MaxLength(2000)]
    public string Content { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    public int Likes { get; set; } = 0;
    
    // Navigation properties
    public ICollection<ReplyLike> ReplyLikes { get; set; } = new List<ReplyLike>();
}

public class PostLike
{
    [Key]
    public int PostLikeId { get; set; }
    
    [Required]
    public int PostId { get; set; }
    
    [ForeignKey("PostId")]
    public DiscussionPost Post { get; set; } = null!;
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    [ForeignKey("UserId")]
    public AppUser User { get; set; } = null!;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class ReplyLike
{
    [Key]
    public int ReplyLikeId { get; set; }
    
    [Required]
    public int ReplyId { get; set; }
    
    [ForeignKey("ReplyId")]
    public DiscussionReply Reply { get; set; } = null!;
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    [ForeignKey("UserId")]
    public AppUser User { get; set; } = null!;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
