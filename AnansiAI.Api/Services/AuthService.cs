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
