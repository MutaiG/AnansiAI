using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AnansiAI.Api.Data;
using AnansiAI.Api.Models.DTOs;
using AnansiAI.Api.Models.Entities;

namespace AnansiAI.Api.Controllers;

[ApiController]
[Route("api/schools")]
[Authorize]
public class SchoolsController : ControllerBase
{
    private readonly AnansiDbContext _context;
    private readonly ILogger<SchoolsController> _logger;

    public SchoolsController(AnansiDbContext context, ILogger<SchoolsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<ActionResult<ApiResponse<List<SchoolDto>>>> GetSchools()
    {
        try
        {
            var schools = await _context.Schools
                .Include(s => s.Users)
                .ToListAsync();

            var schoolDtos = schools.Select(MapToSchoolDto).ToList();

            return Ok(new ApiResponse<List<SchoolDto>>
            {
                Success = true,
                Data = schoolDtos
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting schools");
            return Ok(new ApiResponse<List<SchoolDto>>
            {
                Success = false,
                Error = "Failed to get schools"
            });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<SchoolDto>>> GetSchool(int id)
    {
        try
        {
            var school = await _context.Schools
                .Include(s => s.Users)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (school == null)
            {
                return Ok(new ApiResponse<SchoolDto>
                {
                    Success = false,
                    Error = "School not found"
                });
            }

            return Ok(new ApiResponse<SchoolDto>
            {
                Success = true,
                Data = MapToSchoolDto(school)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting school {SchoolId}", id);
            return Ok(new ApiResponse<SchoolDto>
            {
                Success = false,
                Error = "Failed to get school"
            });
        }
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<ActionResult<ApiResponse<SchoolDto>>> CreateSchool([FromBody] CreateSchoolRequest request)
    {
        try
        {
            // Check if school code already exists
            var existingSchool = await _context.Schools
                .FirstOrDefaultAsync(s => s.Code == request.Code);

            if (existingSchool != null)
            {
                return Ok(new ApiResponse<SchoolDto>
                {
                    Success = false,
                    Error = "School code already exists"
                });
            }

            var school = new School
            {
                Name = request.Name,
                Code = request.Code,
                County = request.County,
                Subcounty = request.Subcounty,
                Ward = request.Ward,
                AdminName = request.AdminName,
                AdminEmail = request.AdminEmail,
                AdminPhone = request.AdminPhone,
                EstablishedYear = request.EstablishedYear,
                Type = Enum.Parse<SchoolType>(request.Type, true),
                Status = SchoolStatus.Pending,
                Students = 0,
                Teachers = 0,
                Performance = 0,
                AiAccuracy = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Schools.Add(school);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<SchoolDto>
            {
                Success = true,
                Data = MapToSchoolDto(school)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating school");
            return Ok(new ApiResponse<SchoolDto>
            {
                Success = false,
                Error = "Failed to create school"
            });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<ActionResult<ApiResponse<SchoolDto>>> UpdateSchool(int id, [FromBody] CreateSchoolRequest request)
    {
        try
        {
            var school = await _context.Schools.FindAsync(id);

            if (school == null)
            {
                return Ok(new ApiResponse<SchoolDto>
                {
                    Success = false,
                    Error = "School not found"
                });
            }

            // Check if new code conflicts with existing schools
            var existingSchool = await _context.Schools
                .FirstOrDefaultAsync(s => s.Code == request.Code && s.Id != id);

            if (existingSchool != null)
            {
                return Ok(new ApiResponse<SchoolDto>
                {
                    Success = false,
                    Error = "School code already exists"
                });
            }

            school.Name = request.Name;
            school.Code = request.Code;
            school.County = request.County;
            school.Subcounty = request.Subcounty;
            school.Ward = request.Ward;
            school.AdminName = request.AdminName;
            school.AdminEmail = request.AdminEmail;
            school.AdminPhone = request.AdminPhone;
            school.EstablishedYear = request.EstablishedYear;
            school.Type = Enum.Parse<SchoolType>(request.Type, true);
            school.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<SchoolDto>
            {
                Success = true,
                Data = MapToSchoolDto(school)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating school {SchoolId}", id);
            return Ok(new ApiResponse<SchoolDto>
            {
                Success = false,
                Error = "Failed to update school"
            });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteSchool(int id)
    {
        try
        {
            var school = await _context.Schools
                .Include(s => s.Users)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (school == null)
            {
                return Ok(new ApiResponse<object>
                {
                    Success = false,
                    Error = "School not found"
                });
            }

            // Check if school has users
            if (school.Users.Any())
            {
                return Ok(new ApiResponse<object>
                {
                    Success = false,
                    Error = "Cannot delete school with existing users"
                });
            }

            _context.Schools.Remove(school);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "School deleted successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting school {SchoolId}", id);
            return Ok(new ApiResponse<object>
            {
                Success = false,
                Error = "Failed to delete school"
            });
        }
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
