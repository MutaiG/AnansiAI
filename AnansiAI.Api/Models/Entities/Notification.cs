using System.ComponentModel.DataAnnotations;

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

    public int? UserId { get; set; }
    public virtual User? User { get; set; }
}

public enum NotificationType
{
    System,
    School,
    Performance,
    Security,
    Maintenance
}

public enum NotificationPriority
{
    High,
    Medium,
    Low
}
