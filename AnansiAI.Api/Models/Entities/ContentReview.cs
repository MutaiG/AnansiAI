using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AnansiAI.Api.Models.Entities;

public class ContentReview
{
    public int ReviewId { get; set; }

    public int ContentId { get; set; } // References lesson, assignment, or submission

    public ContentTypeEnum ContentType { get; set; }

    [Required]
    public string ReviewerId { get; set; } = string.Empty; // FK to identity user

    public ReviewStatus ReviewStatus { get; set; } = ReviewStatus.Pending;

    [MaxLength(2000)]
    public string? ReviewNotes { get; set; }

    public ReviewPriority Priority { get; set; } = ReviewPriority.Medium;

    public DateTime? ReviewedAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual AppUser Reviewer { get; set; } = null!;
}

public enum ContentTypeEnum
{
    Lesson,
    Assignment,
    Submission,
    TwinInteraction,
    StudentProfile,
    GeneralContent
}

public enum ReviewPriority
{
    Low,
    Medium,
    High,
    Critical,
    Emergency
}

// Base entity interface for common properties
public interface IEntity
{
    int Id { get; }
}

// Base entity class with common audit fields
public abstract class BaseEntity
{
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class AuditLog : BaseEntity, IEntity
{
    public int AuditLogId { get; set; }

    [Required]
    public string UserId { get; set; } = string.Empty; // FK to identity user

    [Required, MaxLength(200)]
    public string UserFullName { get; set; } = string.Empty;

    [MaxLength(450)]
    public string? TargetUserId { get; set; } // User acted upon

    [MaxLength(45)]
    public string IPAddress { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string ActionType { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string EntityName { get; set; } = string.Empty;

    public int EntityId { get; set; }

    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    [Column(TypeName = "jsonb")]
    public string OldValues { get; set; } = "{}"; // JSON for old values

    [Column(TypeName = "jsonb")]
    public string NewValues { get; set; } = "{}"; // JSON for new values

    [Column(TypeName = "jsonb")]
    public string Details { get; set; } = "{}"; // JSON for additional details

    [MaxLength(500)]
    public string? UserAgent { get; set; }

    public int RowId { get; set; } // ID of row affected

    // Navigation properties
    public virtual AppUser User { get; set; } = null!;
    public virtual AppUser? TargetUser { get; set; }

    // IEntity implementation
    int IEntity.Id => AuditLogId;
}
