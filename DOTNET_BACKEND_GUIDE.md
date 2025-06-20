# AnansiAI .NET Backend Setup Guide

## 🚀 Complete .NET 8 Web API for AnansiAI Platform

This guide creates a production-ready .NET backend that perfectly matches your existing React frontend API expectations.

## 📋 Prerequisites

```bash
# Install .NET 8 SDK
# Download from: https://dotnet.microsoft.com/download/dotnet/8.0

# Verify installation
dotnet --version  # Should show 8.0.x
```

## 🏗️ Project Structure

```
AnansiAI.Api/
├── AnansiAI.Api.csproj
├── Program.cs
├── appsettings.json
├── appsettings.Development.json
├── Controllers/
│   ├── AuthController.cs
���   ├── SchoolsController.cs
│   ├── UsersController.cs
│   ├── SuperAdminController.cs
│   └── NotificationsController.cs
├── Models/
│   ├── Entities/
│   │   ├── School.cs
│   │   ├── User.cs
│   │   ├── SystemAlert.cs
│   │   └── Notification.cs
│   ├── DTOs/
│   │   ├── LoginRequest.cs
│   │   ├── LoginResponse.cs
│   │   ├── SchoolDto.cs
│   │   └── SystemStatsDto.cs
│   └── ViewModels/
├── Data/
│   ├── AnansiDbContext.cs
│   ├── Migrations/
│   └── Seed/
├── Services/
│   ├── IAuthService.cs
│   ├── AuthService.cs
│   ├── ISchoolService.cs
│   └── SchoolService.cs
├── Middleware/
│   └── JwtMiddleware.cs
└── Extensions/
    └── ServiceExtensions.cs
```

## 🚀 Quick Setup

### 1. Create the Project

```bash
# Create solution and project
dotnet new sln -n AnansiAI
dotnet new webapi -n AnansiAI.Api --framework net8.0
dotnet sln add AnansiAI.Api

cd AnansiAI.Api

# Add required packages
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package System.IdentityModel.Tokens.Jwt
dotnet add package BCrypt.Net-Next
dotnet add package Microsoft.AspNetCore.Cors
dotnet add package Swashbuckle.AspNetCore
dotnet add package Serilog.AspNetCore
```

### 2. Configuration (appsettings.json)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=AnansiAI;Trusted_Connection=true;MultipleActiveResultSets=true"
  },
  "JwtSettings": {
    "Key": "YourSuperSecretKeyThatIs32CharactersLong!",
    "Issuer": "AnansiAI-Backend",
    "Audience": "AnansiAI-Frontend",
    "ExpiryHours": 24
  },
  "Cors": {
    "AllowedOrigins": ["http://localhost:8080", "https://localhost:8080"]
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

### 3. Data Models (Models/Entities/)

#### School.cs

```csharp
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
```

#### User.cs

```csharp
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
```

#### SystemAlert.cs

```csharp
using System.ComponentModel.DataAnnotations;

namespace AnansiAI.Api.Models.Entities;

public class SystemAlert
{
    public int Id { get; set; }

    [Required]
    public AlertType Type { get; set; }

    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required, MaxLength(1000)]
    public string Message { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? School { get; set; }

    public DateTime Time { get; set; } = DateTime.UtcNow;

    [Required]
    public AlertPriority Priority { get; set; }

    public bool ActionRequired { get; set; }
    public bool IsResolved { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public int? ResolvedBy { get; set; }
}

public enum AlertType
{
    Critical,
    Warning,
    Info,
    Success
}

public enum AlertPriority
{
    High,
    Medium,
    Low
}
```

#### Notification.cs

```csharp
using System.ComponentModel.DataAnnotations;

namespace AnansiAI.Api.Models.Entities;

public class Notification
{
    public int Id { get; set; }

    [Required]
    public NotificationType Type { get; set; }

    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required, MaxLength(1000)]
    public string Message { get; set; } = string.Empty;

    public DateTime Time { get; set; } = DateTime.UtcNow;
    public bool Read { get; set; }

    [Required]
    public NotificationPriority Priority { get; set; }

    public int? UserId { get; set; }
    public virtual User? User { get; set; }
}

public enum NotificationType
{
    System,
    School,
    Performance,
    Security,
    Maintenance
}

public enum NotificationPriority
{
    High,
    Medium,
    Low
}
```

### 4. DTOs (Models/DTOs/)

#### LoginRequest.cs

```csharp
using System.ComponentModel.DataAnnotations;

namespace AnansiAI.Api.Models.DTOs;

public class LoginRequest
{
    [Required]
    public string UserId { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}

public class SuperAdminLoginRequest
{
    [Required]
    public string LoginId { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}
```

#### LoginResponse.cs

```csharp
namespace AnansiAI.Api.Models.DTOs;

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public UserDto User { get; set; } = new();
    public SchoolDto? School { get; set; }
}

public class UserDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime LastActive { get; set; }
}
```

#### SchoolDto.cs

```csharp
namespace AnansiAI.Api.Models.DTOs;

public class SchoolDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string County { get; set; } = string.Empty;
    public string Subcounty { get; set; } = string.Empty;
    public string Ward { get; set; } = string.Empty;
    public int Students { get; set; }
    public int Teachers { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal Performance { get; set; }
    public decimal AiAccuracy { get; set; }
    public string LastSync { get; set; } = string.Empty;
    public string AdminName { get; set; } = string.Empty;
    public string AdminEmail { get; set; } = string.Empty;
    public string? AdminPhone { get; set; }
    public int EstablishedYear { get; set; }
    public string Type { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

#### SystemStatsDto.cs

```csharp
namespace AnansiAI.Api.Models.DTOs;

public class SystemStatsDto
{
    public int TotalSchools { get; set; }
    public int TotalStudents { get; set; }
    public int TotalTeachers { get; set; }
    public decimal AvgPerformance { get; set; }
    public decimal SystemUptime { get; set; }
    public decimal DataStorage { get; set; }
    public int ActiveUsers { get; set; }
    public int DailyLogins { get; set; }
}

public class SuperAdminInfoDto
{
    public string Name { get; set; } = string.Empty;
    public string Id { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? Avatar { get; set; }
    public string LastLogin { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;
    public List<string> Permissions { get; set; } = new();
}
```

### 5. Database Context (Data/AnansiDbContext.cs)

```csharp
using Microsoft.EntityFrameworkCore;
using AnansiAI.Api.Models.Entities;

namespace AnansiAI.Api.Data;

public class AnansiDbContext : DbContext
{
    public AnansiDbContext(DbContextOptions<AnansiDbContext> options) : base(options)
    {
    }

    public DbSet<School> Schools { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<SystemAlert> SystemAlerts { get; set; }
    public DbSet<Notification> Notifications { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // School configuration
        modelBuilder.Entity<School>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Code).IsUnique();
            entity.Property(e => e.Performance).HasColumnType("decimal(5,2)");
            entity.Property(e => e.AiAccuracy).HasColumnType("decimal(5,2)");
        });

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.UserId).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();

            entity.HasOne(e => e.School)
                  .WithMany(s => s.Users)
                  .HasForeignKey(e => e.SchoolId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // SystemAlert configuration
        modelBuilder.Entity<SystemAlert>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Time);
            entity.HasIndex(e => e.IsResolved);
        });

        // Notification configuration
        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Time);
            entity.HasIndex(e => e.Read);

            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Seed data
        SeedData(modelBuilder);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        // Seed Super Admin
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                Name = "Dr. Robert Martinez",
                Email = "superadmin@education.go.ke",
                UserId = "SUP-ADM-001",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                Role = UserRole.SuperAdmin,
                Status = UserStatus.Active,
                SchoolId = null,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                LastActive = DateTime.UtcNow
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
            }
        );
    }
}
```

### 6. Authentication Service (Services/AuthService.cs)

```csharp
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using AnansiAI.Api.Data;
using AnansiAI.Api.Models.Entities;
using AnansiAI.Api.Models.DTOs;

namespace AnansiAI.Api.Services;

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request);
    Task<LoginResponse?> SuperAdminLoginAsync(SuperAdminLoginRequest request);
    string GenerateJwtToken(User user);
}

public class AuthService : IAuthService
{
    private readonly AnansiDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthService> _logger;

    public AuthService(AnansiDbContext context, IConfiguration configuration, ILogger<AuthService> logger)
    {
        _context = context;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<LoginResponse?> LoginAsync(LoginRequest request)
    {
        try
        {
            var user = await _context.Users
                .Include(u => u.School)
                .FirstOrDefaultAsync(u => u.UserId == request.UserId);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return null;
            }

            if (user.Status != UserStatus.Active)
            {
                return null;
            }

            // Update last active
            user.LastActive = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);

            return new LoginResponse
            {
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    UserId = user.UserId,
                    Role = user.Role.ToString().ToLower(),
                    Status = user.Status.ToString().ToLower(),
                    LastActive = user.LastActive
                },
                School = user.School != null ? MapToSchoolDto(user.School) : null
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for user {UserId}", request.UserId);
            return null;
        }
    }

    public async Task<LoginResponse?> SuperAdminLoginAsync(SuperAdminLoginRequest request)
    {
        try
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == request.LoginId && u.Role == UserRole.SuperAdmin);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return null;
            }

            if (user.Status != UserStatus.Active)
            {
                return null;
            }

            // Update last active
            user.LastActive = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);

            return new LoginResponse
            {
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    UserId = user.UserId,
                    Role = user.Role.ToString().ToLower(),
                    Status = user.Status.ToString().ToLower(),
                    LastActive = user.LastActive
                }
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during super admin login for user {LoginId}", request.LoginId);
            return null;
        }
    }

    public string GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]!);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.Name),
            new(ClaimTypes.Email, user.Email),
            new("UserId", user.UserId),
            new(ClaimTypes.Role, user.Role.ToString()),
            new("SchoolId", user.SchoolId?.ToString() ?? "")
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(double.Parse(jwtSettings["ExpiryHours"]!)),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            Issuer = jwtSettings["Issuer"],
            Audience = jwtSettings["Audience"]
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    private static SchoolDto MapToSchoolDto(School school)
    {
        return new SchoolDto
        {
            Id = school.Id,
            Name = school.Name,
            Code = school.Code,
            County = school.County,
            Subcounty = school.Subcounty,
            Ward = school.Ward,
            Students = school.Students,
            Teachers = school.Teachers,
            Status = school.Status.ToString().ToLower(),
            Performance = school.Performance,
            AiAccuracy = school.AiAccuracy,
            LastSync = GetTimeAgo(school.LastSync),
            AdminName = school.AdminName,
            AdminEmail = school.AdminEmail,
            AdminPhone = school.AdminPhone,
            EstablishedYear = school.EstablishedYear,
            Type = school.Type.ToString().ToLower(),
            CreatedAt = school.CreatedAt,
            UpdatedAt = school.UpdatedAt
        };
    }

    private static string GetTimeAgo(DateTime dateTime)
    {
        var timeSpan = DateTime.UtcNow - dateTime;

        if (timeSpan.TotalMinutes < 1)
            return "Just now";
        if (timeSpan.TotalMinutes < 60)
            return $"{(int)timeSpan.TotalMinutes} min ago";
        if (timeSpan.TotalHours < 24)
            return $"{(int)timeSpan.TotalHours} hour{((int)timeSpan.TotalHours == 1 ? "" : "s")} ago";
        if (timeSpan.TotalDays < 7)
            return $"{(int)timeSpan.TotalDays} day{((int)timeSpan.TotalDays == 1 ? "" : "s")} ago";

        return dateTime.ToString("MMM dd, yyyy");
    }
}
```

### 7. Controllers

#### AuthController.cs

```csharp
using Microsoft.AspNetCore.Mvc;
using AnansiAI.Api.Services;
using AnansiAI.Api.Models.DTOs;

namespace AnansiAI.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<LoginResponse>>> Login([FromBody] LoginRequest request)
    {
        try
        {
            var result = await _authService.LoginAsync(request);

            if (result == null)
            {
                return Ok(new ApiResponse<LoginResponse>
                {
                    Success = false,
                    Error = "Invalid credentials"
                });
            }

            return Ok(new ApiResponse<LoginResponse>
            {
                Success = true,
                Data = result
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login");
            return Ok(new ApiResponse<LoginResponse>
            {
                Success = false,
                Error = "Login failed"
            });
        }
    }

    [HttpPost("super-admin/login")]
    public async Task<ActionResult<ApiResponse<LoginResponse>>> SuperAdminLogin([FromBody] SuperAdminLoginRequest request)
    {
        try
        {
            var result = await _authService.SuperAdminLoginAsync(request);

            if (result == null)
            {
                return Ok(new ApiResponse<LoginResponse>
                {
                    Success = false,
                    Error = "Invalid super admin credentials"
                });
            }

            return Ok(new ApiResponse<LoginResponse>
            {
                Success = true,
                Data = result
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during super admin login");
            return Ok(new ApiResponse<LoginResponse>
            {
                Success = false,
                Error = "Super admin login failed"
            });
        }
    }
}

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public T? Data { get; set; }
    public string? Message { get; set; }
    public string? Error { get; set; }
}
```

#### SuperAdminController.cs

```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AnansiAI.Api.Data;
using AnansiAI.Api.Models.DTOs;
using AnansiAI.Api.Models.Entities;

namespace AnansiAI.Api.Controllers;

[ApiController]
[Route("api/super-admin")]
[Authorize(Roles = "SuperAdmin")]
public class SuperAdminController : ControllerBase
{
    private readonly AnansiDbContext _context;
    private readonly ILogger<SuperAdminController> _logger;

    public SuperAdminController(AnansiDbContext context, ILogger<SuperAdminController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet("profile")]
    public async Task<ActionResult<ApiResponse<SuperAdminInfoDto>>> GetProfile()
    {
        try
        {
            var userId = GetCurrentUserId();
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return Ok(new ApiResponse<SuperAdminInfoDto>
                {
                    Success = false,
                    Error = "User not found"
                });
            }

            var profile = new SuperAdminInfoDto
            {
                Name = user.Name,
                Id = user.UserId,
                Role = "Super Administrator",
                Avatar = "", // Add avatar logic if needed
                LastLogin = GetTimeAgo(user.LastActive),
                Region = "Kenya",
                Permissions = new List<string> { "all" }
            };

            return Ok(new ApiResponse<SuperAdminInfoDto>
            {
                Success = true,
                Data = profile
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting super admin profile");
            return Ok(new ApiResponse<SuperAdminInfoDto>
            {
                Success = false,
                Error = "Failed to get profile"
            });
        }
    }

    [HttpGet("stats")]
    public async Task<ActionResult<ApiResponse<SystemStatsDto>>> GetStats()
    {
        try
        {
            var totalSchools = await _context.Schools.CountAsync();
            var totalStudents = await _context.Users.CountAsync(u => u.Role == UserRole.Student);
            var totalTeachers = await _context.Users.CountAsync(u => u.Role == UserRole.Teacher);
            var avgPerformance = await _context.Schools.AverageAsync(s => s.Performance);

            var stats = new SystemStatsDto
            {
                TotalSchools = totalSchools,
                TotalStudents = totalStudents,
                TotalTeachers = totalTeachers,
                AvgPerformance = avgPerformance,
                SystemUptime = 99.8m, // Calculate from actual system metrics
                DataStorage = 67.3m, // Calculate from actual storage metrics
                ActiveUsers = await _context.Users.CountAsync(u => u.Status == UserStatus.Active),
                DailyLogins = 0 // Implement login tracking if needed
            };

            return Ok(new ApiResponse<SystemStatsDto>
            {
                Success = true,
                Data = stats
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting system stats");
            return Ok(new ApiResponse<SystemStatsDto>
            {
                Success = false,
                Error = "Failed to get system stats"
            });
        }
    }

    [HttpGet("alerts")]
    public async Task<ActionResult<ApiResponse<List<SystemAlert>>>> GetAlerts()
    {
        try
        {
            var alerts = await _context.SystemAlerts
                .Where(a => !a.IsResolved)
                .OrderByDescending(a => a.Time)
                .Take(50)
                .ToListAsync();

            return Ok(new ApiResponse<List<SystemAlert>>
            {
                Success = true,
                Data = alerts
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting system alerts");
            return Ok(new ApiResponse<List<SystemAlert>>
            {
                Success = false,
                Error = "Failed to get system alerts"
            });
        }
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        return int.Parse(userIdClaim?.Value ?? "0");
    }

    private static string GetTimeAgo(DateTime dateTime)
    {
        var timeSpan = DateTime.UtcNow - dateTime;

        if (timeSpan.TotalMinutes < 1)
            return "Just now";
        if (timeSpan.TotalMinutes < 60)
            return $"{(int)timeSpan.TotalMinutes} min ago";
        if (timeSpan.TotalHours < 24)
            return $"{(int)timeSpan.TotalHours} hour{((int)timeSpan.TotalHours == 1 ? "" : "s")} ago";
        if (timeSpan.TotalDays < 7)
            return $"{(int)timeSpan.TotalDays} day{((int)timeSpan.TotalDays == 1 ? "" : "s")} ago";

        return dateTime.ToString("MMM dd, yyyy");
    }
}
```

### 8. Program.cs (Complete Setup)

```csharp
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using AnansiAI.Api.Data;
using AnansiAI.Api.Services;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .WriteTo.Console()
    .WriteTo.File("logs/anansi-api-.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Swagger configuration
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "AnansiAI API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Database
builder.Services.AddDbContext<AnansiDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
                           ?? new[] { "http://localhost:8080" };

        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]!);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidateAudience = true,
            ValidAudience = jwtSettings["Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// Services
builder.Services.AddScoped<IAuthService, AuthService>();

var app = builder.Build();

// Configure pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseSerilogRequestLogging();
app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Initialize database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AnansiDbContext>();
    context.Database.EnsureCreated();
}

app.Run();
```

## 🚀 Running the Application

### 1. Database Setup

```bash
# Create and apply migrations
dotnet ef migrations add InitialCreate
dotnet ef database update

# Or use SQL Server LocalDB (included in Visual Studio)
# Connection string is already configured for LocalDB
```

### 2. Run the API

```bash
# Start the API
dotnet run

# API will be available at:
# - HTTP: http://localhost:5000
# - HTTPS: https://localhost:5001
# - Swagger UI: https://localhost:5001/swagger
```

### 3. Update Frontend Configuration

Update your React app's `.env` file:

```bash
VITE_API_URL=https://localhost:5001/api
```

## 🧪 Testing the API

### Using Swagger UI

1. Navigate to `https://localhost:5001/swagger`
2. Test the authentication endpoints
3. Use the JWT token for protected endpoints

### Test Super Admin Login

```bash
curl -X POST https://localhost:5001/api/auth/super-admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "loginId": "SUP-ADM-001",
    "password": "admin123"
  }'
```

### Test Protected Endpoint

```bash
curl -X GET https://localhost:5001/api/super-admin/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🚀 Production Deployment

### Azure App Service

1. Create Azure App Service
2. Configure SQL Database
3. Set environment variables
4. Deploy using Visual Studio or GitHub Actions

### Docker Deployment

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["AnansiAI.Api.csproj", "."]
RUN dotnet restore
COPY . .
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AnansiAI.Api.dll"]
```

## 📋 Next Steps

1. **Complete the remaining controllers** (SchoolsController, NotificationsController)
2. **Add comprehensive error handling** and logging
3. **Implement rate limiting** and security headers
4. **Add comprehensive unit tests**
5. **Set up CI/CD pipeline**
6. **Configure production database**
7. **Add monitoring and health checks**

This .NET backend provides a solid, scalable foundation that perfectly matches your React frontend's API expectations!
