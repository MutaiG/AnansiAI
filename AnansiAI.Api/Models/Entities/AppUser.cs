using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace AnansiAI.Api.Models.Entities;

public class AppUser : IdentityUser
{
    [Required, MaxLength(200)]
    public string FullName { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Address { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? PhotoUrl { get; set; }

    public override string? PhoneNumber { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime LastLogin { get; set; } = DateTime.UtcNow;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual ICollection<StudentProfile> StudentProfiles { get; set; } = new List<StudentProfile>();
    public virtual ICollection<PrivacySetting> PrivacySettings { get; set; } = new List<PrivacySetting>();
    public virtual ICollection<Level> Levels { get; set; } = new List<Level>();
    public virtual ICollection<Lesson> CreatedLessons { get; set; } = new List<Lesson>();
    public virtual ICollection<Lesson> ApprovedLessons { get; set; } = new List<Lesson>();
    public virtual ICollection<Assignment> CreatedAssignments { get; set; } = new List<Assignment>();
    public virtual ICollection<Assignment> ApprovedAssignments { get; set; } = new List<Assignment>();
    public virtual ICollection<Submission> Submissions { get; set; } = new List<Submission>();
    public virtual ICollection<TwinInteraction> TwinInteractions { get; set; } = new List<TwinInteraction>();
    public virtual ICollection<ContentReview> ContentReviews { get; set; } = new List<ContentReview>();
    public virtual ICollection<BehaviorLog> BehaviorLogs { get; set; } = new List<BehaviorLog>();
    public virtual ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();
    public virtual ICollection<Subject> CreatedSubjects { get; set; } = new List<Subject>();
    public virtual ICollection<LevelStudents> LevelStudents { get; set; } = new List<LevelStudents>();
    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    public virtual ICollection<NotificationAction> NotificationActions { get; set; } = new List<NotificationAction>();
}
