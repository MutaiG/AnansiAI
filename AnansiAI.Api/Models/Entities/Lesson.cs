using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AnansiAI.Api.Models.Entities;

public class Lesson
{
    public int LessonId { get; set; }

    public int SubjectId { get; set; }

    [Required, MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    [Column(TypeName = "jsonb")]
    public string Content { get; set; } = "{}"; // JSON content for flexible lesson structure

    [Range(1, 10)]
    public int DifficultyLevel { get; set; } = 1; // 1 to 10

    [Required]
    public string CreatedById { get; set; } = string.Empty; // FK to identity user

    public ApprovalStatus ApprovalStatus { get; set; } = ApprovalStatus.Draft;

    public string? ApprovedById { get; set; } // FK to identity user

    public DateTime? ApprovedAt { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual Subject Subject { get; set; } = null!;
    public virtual AppUser CreatedBy { get; set; } = null!;
    public virtual AppUser? ApprovedBy { get; set; }
    public virtual ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();
    public virtual ICollection<TwinInteraction> TwinInteractions { get; set; } = new List<TwinInteraction>();
    public virtual ICollection<BehaviorLog> BehaviorLogs { get; set; } = new List<BehaviorLog>();
}

public enum ApprovalStatus
{
    Draft,
    PendingReview,
    Approved,
    Rejected,
    RequiresRevision
}
