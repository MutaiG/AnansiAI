using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AnansiAI.Api.Models.Entities;

public class Notification
{
    public int Id { get; set; }

    [Required]
    public NotificationType Type { get; set; }

    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required, MaxLength(1000)]
    public string Message { get; set; } = string.Empty;

    public DateTime Time { get; set; } = DateTime.UtcNow;
    public bool Read { get; set; }

    [Required]
    public NotificationPriority Priority { get; set; }

    [Required]
    public NotificationCategory Category { get; set; } = NotificationCategory.General;

    public bool ActionRequired { get; set; } = false;

    [MaxLength(100)]
    public string? RelatedEntityId { get; set; }

    [MaxLength(50)]
    public string? RelatedEntityType { get; set; }

    [Column(TypeName = "jsonb")]
    public string? Metadata { get; set; } = "{}";

    public string? UserId { get; set; } // Changed to string to match identity user
    public virtual AppUser? User { get; set; }

    // Navigation property for actions taken on this notification
    public virtual ICollection<NotificationAction> Actions { get; set; } = new List<NotificationAction>();
}

public class NotificationAction
{
    public int Id { get; set; }

    public int NotificationId { get; set; }

    [Required]
    public string UserId { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string Action { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Notes { get; set; }

    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual Notification Notification { get; set; } = null!;
    public virtual AppUser User { get; set; } = null!;
}

public enum NotificationType
{
    Info,
    Warning,
    Error,
    Success,
    Alert,
    System,
    School,
    Performance,
    Security,
    Maintenance
}

public enum NotificationPriority
{
    Critical,
    High,
    Medium,
    Low
}

public enum NotificationCategory
{
    General,
    AI,
    Student,
    Class,
    Assignment,
    System,
    Security,
    Performance,
    Behavior,
    Academic
}
