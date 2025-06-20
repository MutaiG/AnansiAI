using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AnansiAI.Api.Models.Entities;

public class Submission
{
    public int SubmissionId { get; set; }

    public int AssignmentId { get; set; }

    [Required]
    public string StudentId { get; set; } = string.Empty; // FK to identity user

    [Column(TypeName = "jsonb")]
    public string Content { get; set; } = "{}"; // JSON content for flexible submission structure

    [Range(0, 100)]
    public float? AutoGrade { get; set; }

    [Range(0, 100)]
    public float? TeacherGrade { get; set; }

    [Range(0, 100)]
    public float? FinalGrade { get; set; }

    [MaxLength(2000)]
    public string? Feedback { get; set; }

    public ReviewStatus ReviewStatus { get; set; } = ReviewStatus.Pending;

    public string? ReviewedById { get; set; } // FK to identity user

    public DateTime? ReviewedAt { get; set; }

    public bool Flagged { get; set; } = false;

    [MaxLength(500)]
    public string? FlagReason { get; set; }

    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

    public DateTime? GradedAt { get; set; }

    // Navigation properties
    public virtual Assignment Assignment { get; set; } = null!;
    public virtual AppUser Student { get; set; } = null!;
    public virtual AppUser? ReviewedBy { get; set; }
}

public enum ReviewStatus
{
    Pending,
    InReview,
    Approved,
    Rejected,
    RequiresRevision,
    Graded
}
