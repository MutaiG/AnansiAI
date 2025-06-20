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

public class CreateSchoolRequest
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string County { get; set; } = string.Empty;
    public string Subcounty { get; set; } = string.Empty;
    public string Ward { get; set; } = string.Empty;
    public string AdminName { get; set; } = string.Empty;
    public string AdminEmail { get; set; } = string.Empty;
    public string? AdminPhone { get; set; }
    public int EstablishedYear { get; set; }
    public string Type { get; set; } = string.Empty;
}

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
