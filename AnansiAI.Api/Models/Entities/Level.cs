using System.ComponentModel.DataAnnotations;

namespace AnansiAI.Api.Models.Entities;

public class Level
{
    public int LevelId { get; set; }

    [Required, MaxLength(200)]
    public string LevelName { get; set; } = string.Empty;

    public int SubjectId { get; set; }

    [Required]
    public string TeacherId { get; set; } = string.Empty; // FK to Identity user

    public bool IsActive { get; set; } = true;

    public int MaxStudents { get; set; } = 30;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual Subject Subject { get; set; } = null!;
    public virtual AppUser Teacher { get; set; } = null!;
    public virtual ICollection<LevelStudents> LevelStudents { get; set; } = new List<LevelStudents>();
}

public class LevelStudents
{
    public int LevelId { get; set; }

    [Required]
    public string StudentId { get; set; } = string.Empty; // FK to identity user

    public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;

    public LevelStudentStatus Status { get; set; } = LevelStudentStatus.Active;

    // Navigation properties
    public virtual Level Level { get; set; } = null!;
    public virtual AppUser Student { get; set; } = null!;
}

public enum LevelStudentStatus
{
    Active,
    Inactive,
    Completed,
    Withdrawn
}
