using System.ComponentModel.DataAnnotations;

namespace AnansiAI.Api.Models.Entities;

public class User
{
    public int Id { get; set; }

    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(200)]
    public string Email { get; set; } = string.Empty;

    [Required, MaxLength(50)]
    public string UserId { get; set; } = string.Empty; // e.g., NAC-STU-001

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    public UserRole Role { get; set; }

    public int? SchoolId { get; set; }

    [Required]
    public UserStatus Status { get; set; } = UserStatus.Active;

    public DateTime LastActive { get; set; } = DateTime.UtcNow;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual School? School { get; set; }
}

public enum UserRole
{
    Student,
    Teacher,
    Admin,
    SuperAdmin
}

public enum UserStatus
{
    Active,
    Inactive,
    Suspended
}
