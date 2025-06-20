using System.ComponentModel.DataAnnotations;

namespace AnansiAI.Api.Models.Entities;

public class SystemAlert
{
    public int Id { get; set; }

    [Required]
    public AlertType Type { get; set; }

    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required, MaxLength(1000)]
    public string Message { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? School { get; set; }

    public DateTime Time { get; set; } = DateTime.UtcNow;

    [Required]
    public AlertPriority Priority { get; set; }

    public bool ActionRequired { get; set; }
    public bool IsResolved { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public int? ResolvedBy { get; set; }
}

public enum AlertType
{
    Critical,
    Warning,
    Info,
    Success
}

public enum AlertPriority
{
    High,
    Medium,
    Low
}
