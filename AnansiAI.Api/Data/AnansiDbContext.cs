using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using AnansiAI.Api.Models.Entities;

namespace AnansiAI.Api.Data;

public class AnansiDbContext : IdentityDbContext<AppUser>
{
    public AnansiDbContext(DbContextOptions<AnansiDbContext> options) : base(options)
    {
    }

    // Legacy entities (keeping for compatibility)
    public DbSet<School> Schools { get; set; }
    public DbSet<SystemAlert> SystemAlerts { get; set; }
    public DbSet<Notification> Notifications { get; set; }

    // New comprehensive education entities
    public DbSet<Subject> Subjects { get; set; }
    public DbSet<Level> Levels { get; set; }
    public DbSet<LevelStudents> LevelStudents { get; set; }
    public DbSet<Lesson> Lessons { get; set; }
    public DbSet<Assignment> Assignments { get; set; }
    public DbSet<Submission> Submissions { get; set; }
    public DbSet<StudentProfile> StudentProfiles { get; set; }
    public DbSet<PrivacySetting> PrivacySettings { get; set; }
    public DbSet<BehaviorLog> BehaviorLogs { get; set; }
    public DbSet<TwinInteraction> TwinInteractions { get; set; }
    public DbSet<ContentReview> ContentReviews { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // AppUser configuration
        modelBuilder.Entity<AppUser>(entity =>
        {
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.FullName).IsRequired().HasMaxLength(200);
        });

        // Subject configuration
        modelBuilder.Entity<Subject>(entity =>
        {
            entity.HasKey(e => e.SubjectId);
            entity.HasIndex(e => e.SubjectName);
            entity.HasOne(e => e.CreatedBy)
                  .WithMany(u => u.CreatedSubjects)
                  .HasForeignKey(e => e.CreatedById)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Level configuration
        modelBuilder.Entity<Level>(entity =>
        {
            entity.HasKey(e => e.LevelId);
            entity.HasOne(e => e.Subject)
                  .WithMany(s => s.Levels)
                  .HasForeignKey(e => e.SubjectId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Teacher)
                  .WithMany(u => u.Levels)
                  .HasForeignKey(e => e.TeacherId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // LevelStudents configuration (composite key)
        modelBuilder.Entity<LevelStudents>(entity =>
        {
            entity.HasKey(e => new { e.LevelId, e.StudentId });
            entity.HasOne(e => e.Level)
                  .WithMany(l => l.LevelStudents)
                  .HasForeignKey(e => e.LevelId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Student)
                  .WithMany(u => u.LevelStudents)
                  .HasForeignKey(e => e.StudentId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Lesson configuration
        modelBuilder.Entity<Lesson>(entity =>
        {
            entity.HasKey(e => e.LessonId);
            entity.HasIndex(e => e.Title);
            entity.HasOne(e => e.Subject)
                  .WithMany(s => s.Lessons)
                  .HasForeignKey(e => e.SubjectId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.CreatedBy)
                  .WithMany(u => u.CreatedLessons)
                  .HasForeignKey(e => e.CreatedById)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.ApprovedBy)
                  .WithMany(u => u.ApprovedLessons)
                  .HasForeignKey(e => e.ApprovedById)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // Assignment configuration
        modelBuilder.Entity<Assignment>(entity =>
        {
            entity.HasKey(e => e.AssignmentId);
            entity.HasIndex(e => e.Title);
            entity.HasOne(e => e.Lesson)
                  .WithMany(l => l.Assignments)
                  .HasForeignKey(e => e.LessonId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.CreatedBy)
                  .WithMany(u => u.CreatedAssignments)
                  .HasForeignKey(e => e.CreatedById)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.ApprovedBy)
                  .WithMany(u => u.ApprovedAssignments)
                  .HasForeignKey(e => e.ApprovedById)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // Submission configuration
        modelBuilder.Entity<Submission>(entity =>
        {
            entity.HasKey(e => e.SubmissionId);
            entity.HasIndex(e => new { e.AssignmentId, e.StudentId });
            entity.HasOne(e => e.Assignment)
                  .WithMany(a => a.Submissions)
                  .HasForeignKey(e => e.AssignmentId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Student)
                  .WithMany(u => u.Submissions)
                  .HasForeignKey(e => e.StudentId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.ReviewedBy)
                  .WithMany()
                  .HasForeignKey(e => e.ReviewedById)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // StudentProfile configuration
        modelBuilder.Entity<StudentProfile>(entity =>
        {
            entity.HasKey(e => e.ProfileId);
            entity.HasIndex(e => e.StudentId).IsUnique();
            entity.HasOne(e => e.Student)
                  .WithMany(u => u.StudentProfiles)
                  .HasForeignKey(e => e.StudentId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // PrivacySetting configuration
        modelBuilder.Entity<PrivacySetting>(entity =>
        {
            entity.HasKey(e => e.SettingId);
            entity.HasIndex(e => e.UserId).IsUnique();
            entity.HasOne(e => e.User)
                  .WithMany(u => u.PrivacySettings)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // BehaviorLog configuration
        modelBuilder.Entity<BehaviorLog>(entity =>
        {
            entity.HasKey(e => e.BehaviorLogId);
            entity.HasIndex(e => new { e.StudentId, e.CreatedAt });
            entity.HasIndex(e => e.SessionId);
            entity.HasOne(e => e.Student)
                  .WithMany(u => u.BehaviorLogs)
                  .HasForeignKey(e => e.StudentId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Lesson)
                  .WithMany(l => l.BehaviorLogs)
                  .HasForeignKey(e => e.LessonId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // TwinInteraction configuration
        modelBuilder.Entity<TwinInteraction>(entity =>
        {
            entity.HasKey(e => e.InteractionId);
            entity.HasIndex(e => new { e.StudentId, e.CreatedAt });
            entity.HasIndex(e => e.SessionId);
            entity.HasOne(e => e.Student)
                  .WithMany(u => u.TwinInteractions)
                  .HasForeignKey(e => e.StudentId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Lesson)
                  .WithMany(l => l.TwinInteractions)
                  .HasForeignKey(e => e.LessonId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // ContentReview configuration
        modelBuilder.Entity<ContentReview>(entity =>
        {
            entity.HasKey(e => e.ReviewId);
            entity.HasIndex(e => new { e.ContentType, e.ContentId });
            entity.HasOne(e => e.Reviewer)
                  .WithMany(u => u.ContentReviews)
                  .HasForeignKey(e => e.ReviewerId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // AuditLog configuration
        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.HasKey(e => e.AuditLogId);
            entity.HasIndex(e => new { e.UserId, e.Timestamp });
            entity.HasIndex(e => new { e.EntityName, e.EntityId });
            entity.HasOne(e => e.User)
                  .WithMany(u => u.AuditLogs)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.TargetUser)
                  .WithMany()
                  .HasForeignKey(e => e.TargetUserId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // Legacy entities (keeping for compatibility)
        ConfigureLegacyEntities(modelBuilder);

        // Seed comprehensive data
        SeedComprehensiveData(modelBuilder);
    }

    private void ConfigureLegacyEntities(ModelBuilder modelBuilder)
    {
        // School configuration (legacy)
        modelBuilder.Entity<School>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Code).IsUnique();
            entity.Property(e => e.Performance).HasColumnType("decimal(5,2)");
            entity.Property(e => e.AiAccuracy).HasColumnType("decimal(5,2)");
        });

        // SystemAlert configuration (legacy)
        modelBuilder.Entity<SystemAlert>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Time);
            entity.HasIndex(e => e.IsResolved);
        });

        // Notification configuration (legacy)
        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Time);
            entity.HasIndex(e => e.Read);
        });
    }

    private static void SeedComprehensiveData(ModelBuilder modelBuilder)
    {
        // Seed Core Subjects
        modelBuilder.Entity<Subject>().HasData(
            new Subject
            {
                SubjectId = 1,
                SubjectName = "Mathematics",
                Description = "Comprehensive mathematics curriculum covering algebra, geometry, and calculus",
                IsActive = true,
                CreatedById = "super-admin-001",
                CreatedAt = DateTime.UtcNow
            },
            new Subject
            {
                SubjectId = 2,
                SubjectName = "English Language",
                Description = "English language arts including literature, writing, and communication",
                IsActive = true,
                CreatedById = "super-admin-001",
                CreatedAt = DateTime.UtcNow
            },
            new Subject
            {
                SubjectId = 3,
                SubjectName = "Science",
                Description = "General science covering biology, chemistry, and physics",
                IsActive = true,
                CreatedById = "super-admin-001",
                CreatedAt = DateTime.UtcNow
            },
            new Subject
            {
                SubjectId = 4,
                SubjectName = "Computer Science",
                Description = "Programming, algorithms, and computational thinking",
                IsActive = true,
                CreatedById = "super-admin-001",
                CreatedAt = DateTime.UtcNow
            }
        );

        // Seed sample schools
        modelBuilder.Entity<School>().HasData(
            new School
            {
                Id = 1,
                Name = "Nairobi Academy",
                Code = "NAC",
                County = "Nairobi",
                Subcounty = "Westlands",
                Ward = "Parklands",
                Students = 1250,
                Teachers = 85,
                Status = SchoolStatus.Active,
                Performance = 89,
                AiAccuracy = 94,
                AdminName = "Dr. Sarah Johnson",
                AdminEmail = "admin@nairobiacademy.ac.ke",
                AdminPhone = "+254 701 234 567",
                EstablishedYear = 1985,
                Type = SchoolType.Secondary,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new School
            {
                Id = 2,
                Name = "Mombasa International School",
                Code = "MIS",
                County = "Mombasa",
                Subcounty = "Nyali",
                Ward = "Frere Town",
                Students = 890,
                Teachers = 62,
                Status = SchoolStatus.Active,
                Performance = 85,
                AiAccuracy = 91,
                AdminName = "Prof. James Mwangi",
                AdminEmail = "admin@mombasainternational.ac.ke",
                AdminPhone = "+254 722 345 678",
                EstablishedYear = 1992,
                Type = SchoolType.Secondary,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new School
            {
                Id = 3,
                Name = "Kisumu Primary School",
                Code = "KPS",
                County = "Kisumu",
                Subcounty = "Kisumu Central",
                Ward = "Market Milimani",
                Students = 650,
                Teachers = 45,
                Status = SchoolStatus.Active,
                Performance = 78,
                AiAccuracy = 87,
                AdminName = "Mary Achieng",
                AdminEmail = "admin@kisumuprimary.ac.ke",
                AdminPhone = "+254 733 456 789",
                EstablishedYear = 1978,
                Type = SchoolType.Primary,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        );

        // Seed system alerts
        modelBuilder.Entity<SystemAlert>().HasData(
            new SystemAlert
            {
                Id = 1,
                Type = AlertType.Critical,
                Title = "Database Connection Issue",
                Message = "Primary database connection is experiencing intermittent failures",
                School = "Nairobi Academy",
                Time = DateTime.UtcNow.AddHours(-2),
                Priority = AlertPriority.High,
                ActionRequired = true,
                IsResolved = false
            },
            new SystemAlert
            {
                Id = 2,
                Type = AlertType.Warning,
                Title = "High CPU Usage",
                Message = "Server CPU usage has been above 80% for the last 30 minutes",
                Time = DateTime.UtcNow.AddMinutes(-45),
                Priority = AlertPriority.Medium,
                ActionRequired = false,
                IsResolved = false
            }
        );

        // Seed notifications
        modelBuilder.Entity<Notification>().HasData(
            new Notification
            {
                Id = 1,
                Type = NotificationType.System,
                Title = "System Maintenance Scheduled",
                Message = "Scheduled maintenance will occur on Sunday at 2:00 AM",
                Time = DateTime.UtcNow.AddHours(-1),
                Read = false,
                Priority = NotificationPriority.Medium,
                UserId = 1
            },
            new Notification
            {
                Id = 2,
                Type = NotificationType.Performance,
                Title = "Weekly Performance Report",
                Message = "Your weekly system performance report is ready for review",
                Time = DateTime.UtcNow.AddHours(-3),
                Read = false,
                Priority = NotificationPriority.Low,
                UserId = 1
            }
        );
    }
}
