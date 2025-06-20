using System.ComponentModel.DataAnnotations;

namespace AnansiAI.Api.Models.Entities;

public class Subject
{
    public int SubjectId { get; set; }

    [Required, MaxLength(200)]
    public string SubjectName { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    [Required]
    public string CreatedById { get; set; } = string.Empty; // FK to identity user

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual AppUser CreatedBy { get; set; } = null!;
    public virtual ICollection<Level> Levels { get; set; } = new List<Level>();
    public virtual ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
}
