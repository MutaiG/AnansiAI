using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AnansiAI.Api.Models.Entities;

public class StudentProfile
{
    public int ProfileId { get; set; }
    
    [Required]
    public string StudentId { get; set; } = string.Empty; // FK to Identity User
    
    [Column(TypeName = "jsonb")]
    public string PersonalityTraits { get; set; } = "{}"; //jsonb
    
    [Column(TypeName = "jsonb")]
    public string LearningPreferences { get; set; } = "{}"; //jsonb
    
    [Column(TypeName = "jsonb")]
    public string EmotionalState { get; set; } = "{}"; //jsonb
    
    [Column(TypeName = "jsonb")]
    public string ParentContactInfo { get; set; } = "{}"; //jsonb
    
    public bool IsMinor { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual AppUser Student { get; set; } = null!;
}
