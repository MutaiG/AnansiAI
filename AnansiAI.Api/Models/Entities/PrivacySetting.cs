using System.ComponentModel.DataAnnotations;

namespace AnansiAI.Api.Models.Entities;

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
    Minimal,    // Only essential data
    Standard,   // Standard educational data
    Enhanced,   // Include behavior analytics
    Full        // All available data for research
}
