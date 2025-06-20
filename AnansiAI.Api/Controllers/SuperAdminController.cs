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
            var avgPerformance = await _context.Schools.AverageAsync(s => (double)s.Performance);

            var stats = new SystemStatsDto
            {
                TotalSchools = totalSchools,
                TotalStudents = totalStudents,
                TotalTeachers = totalTeachers,
                AvgPerformance = (decimal)avgPerformance,
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
