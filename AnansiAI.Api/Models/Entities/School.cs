using System.ComponentModel.DataAnnotations;

namespace AnansiAI.Api.Models.Entities;

public class School
{
    public int Id { get; set; }

    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required, MaxLength(10)]
    public string Code { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string County { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string Subcounty { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Ward { get; set; } = string.Empty;

    public int Students { get; set; }
    public int Teachers { get; set; }

    [Required]
    public SchoolStatus Status { get; set; } = SchoolStatus.Active;

    public decimal Performance { get; set; }
    public decimal AiAccuracy { get; set; }
    public DateTime LastSync { get; set; } = DateTime.UtcNow;

    [Required, MaxLength(200)]
    public string AdminName { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(200)]
    public string AdminEmail { get; set; } = string.Empty;

    [MaxLength(20)]
    public string? AdminPhone { get; set; }

    public int EstablishedYear { get; set; }

    [Required]
    public SchoolType Type { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual ICollection<User> Users { get; set; } = new List<User>();
}

public enum SchoolStatus
{
    Active,
    Maintenance,
    Inactive,
    Pending
}

public enum SchoolType
{
    Primary,
    Secondary,
    Mixed
}
