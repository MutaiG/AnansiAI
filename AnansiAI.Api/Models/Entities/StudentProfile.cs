using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AnansiAI.Api.Models.Entities;

public class StudentProfile
{
    public int ProfileId { get; set; }

    [Required]
    public string StudentId { get; set; } = string.Empty; // FK to Identity User

    [Column(TypeName = "jsonb")]
    public string PersonalityTraits { get; set; } = "{}"; // JSON for AI analysis

    [Column(TypeName = "jsonb")]
    public string LearningPreferences { get; set; } = "{}"; // JSON for personalized learning

    [Column(TypeName = "jsonb")]
    public string EmotionalState { get; set; } = "{}"; // JSON for emotional tracking

    [Column(TypeName = "jsonb")]
    public string ParentContactInfo { get; set; } = "{}"; // JSON for parent information

    public bool IsMinor { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual AppUser Student { get; set; } = null!;
}

public class PrivacySetting
{
    public int SettingId { get; set; }

    [Required]
    public string UserId { get; set; } = string.Empty; // FK to Identity User

    public bool AllowAiPersonalityAnalysis { get; set; } = true;

    public bool AllowBehaviorTracking { get; set; } = true;

    public bool AllowInteractionRecording { get; set; } = true;

    public DataSharingLevel DataSharingLevel { get; set; } = DataSharingLevel.Standard;

    public bool ParentNotificationEnabled { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual AppUser User { get; set; } = null!;
}

public enum DataSharingLevel
{
    Minimal,      // Only essential data
    Standard,     // Standard educational data
    Enhanced,     // Include behavior analytics
    Full          // All available data for research
}
