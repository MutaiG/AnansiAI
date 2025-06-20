using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AnansiAI.Api.Models.Entities;

public class Assignment
{
    public int AssignmentId { get; set; }

    public int LessonId { get; set; }

    [Required, MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    public QuestionType QuestionType { get; set; }

    [Column(TypeName = "jsonb")]
    public string Content { get; set; } = "{}"; // JSON content for flexible assignment structure

    [Column(TypeName = "jsonb")]
    public string Rubric { get; set; } = "{}"; // JSON rubric for grading

    public DateTime? Deadline { get; set; }

    [Required]
    public string CreatedById { get; set; } = string.Empty; // FK to identity user

    public ApprovalStatus ApprovalStatus { get; set; } = ApprovalStatus.Draft;

    public string? ApprovedById { get; set; } // FK to identity user

    public DateTime? ApprovedAt { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual Lesson Lesson { get; set; } = null!;
    public virtual AppUser CreatedBy { get; set; } = null!;
    public virtual AppUser? ApprovedBy { get; set; }
    public virtual ICollection<Submission> Submissions { get; set; } = new List<Submission>();
}

public enum QuestionType
{
    MultipleChoice,
    Essay,
    ShortAnswer,
    TrueFalse,
    Matching,
    FillInTheBlanks,
    CodeSubmission,
    ProjectSubmission,
    Presentation,
    PeerReview
}
