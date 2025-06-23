using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AnansiAI.Api.Data;
using AnansiAI.Api.Models.DTOs;
using AnansiAI.Api.Models.Entities;
using System.Security.Claims;
using System.Text.Json;

namespace AnansiAI.Api.Controllers;

[ApiController]
[Route("api/teachers")]
[Authorize]
public class TeachersController : ControllerBase
{
    private readonly AnansiDbContext _context;
    private readonly ILogger<TeachersController> _logger;

    public TeachersController(AnansiDbContext context, ILogger<TeachersController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/teachers/dashboard
    [HttpGet("dashboard")]
    public async Task<ActionResult<ApiResponse<TeacherDashboardDto>>> GetTeacherDashboard()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            // Get teacher's levels (classes)
            var teacherLevels = await _context.Levels
                .Include(l => l.Subject)
                .Include(l => l.LevelStudents)
                    .ThenInclude(ls => ls.Student)
                .Where(l => l.TeacherId == userId && l.IsActive)
                .ToListAsync();

            // Get all students under this teacher
            var studentIds = teacherLevels
                .SelectMany(l => l.LevelStudents)
                .Select(ls => ls.StudentId)
                .Distinct()
                .ToList();

            // Get student profiles
            var studentProfiles = await _context.StudentProfiles
                .Where(sp => studentIds.Contains(sp.StudentId))
                .ToListAsync();

            // Get recent behavior logs
            var recentBehaviorLogs = await _context.BehaviorLogs
                .Where(bl => studentIds.Contains(bl.StudentId))
                .OrderByDescending(bl => bl.CreatedAt)
                .Take(50)
                .ToListAsync();

            // Get assignments and submissions
            var assignments = await _context.Assignments
                .Include(a => a.Lesson)
                    .ThenInclude(l => l.Subject)
                .Include(a => a.Submissions)
                .Where(a => a.CreatedById == userId)
                .ToListAsync();

            // Get privacy settings for students
            var privacySettings = await _context.PrivacySettings
                .Where(ps => studentIds.Contains(ps.UserId))
                .ToListAsync();

            var dashboardData = new TeacherDashboardDto
            {
                TeacherProfile = await GetTeacherProfile(userId),
                Stats = CalculateTeacherStats(teacherLevels, studentProfiles, assignments),
                Classes = MapToClassDtos(teacherLevels),
                Students = await MapToStudentDtos(teacherLevels, studentProfiles, recentBehaviorLogs),
                AIAlerts = GenerateAIAlerts(studentProfiles, recentBehaviorLogs),
                AITwinInsights = await GenerateAITwinInsights(studentProfiles, recentBehaviorLogs, privacySettings),
                RecentActivity = await GetRecentActivity(userId),
                LessonContent = await GetTeacherContent(userId)
            };

            return Ok(new ApiResponse<TeacherDashboardDto>
            {
                Success = true,
                Data = dashboardData
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting teacher dashboard for user {UserId}", User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            return Ok(new ApiResponse<TeacherDashboardDto>
            {
                Success = false,
                Error = "Failed to load teacher dashboard"
            });
        }
    }

    // POST: api/teachers/classes
    [HttpPost("classes")]
    public async Task<ActionResult<ApiResponse<ClassDto>>> CreateClass([FromBody] CreateClassRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            // Get or create subject
            var subject = await _context.Subjects
                .FirstOrDefaultAsync(s => s.SubjectName.ToLower() == request.Subject.ToLower());

            if (subject == null)
            {
                subject = new Subject
                {
                    SubjectName = request.Subject,
                    Description = $"{request.Subject} curriculum",
                    IsActive = true,
                    CreatedById = userId,
                    CreatedAt = DateTime.UtcNow
                };
                _context.Subjects.Add(subject);
                await _context.SaveChangesAsync();
            }

            // Create new level (class)
            var newLevel = new Level
            {
                LevelName = request.Name,
                SubjectId = subject.SubjectId,
                TeacherId = userId,
                IsActive = true,
                MaxStudents = request.MaxStudents ?? 30,
                CreatedAt = DateTime.UtcNow
            };

            _context.Levels.Add(newLevel);
            await _context.SaveChangesAsync();

            var classDto = new ClassDto
            {
                Id = newLevel.LevelId.ToString(),
                Name = newLevel.LevelName,
                Subject = subject.SubjectName,
                Grade = request.Grade,
                StudentCount = 0,
                Progress = 0,
                NextLesson = "To be determined",
                Schedule = request.Schedule ?? "TBD",
                Status = "active",
                Description = request.Description ?? ""
            };

            return Ok(new ApiResponse<ClassDto>
            {
                Success = true,
                Data = classDto
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating class for user {UserId}", User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            return Ok(new ApiResponse<ClassDto>
            {
                Success = false,
                Error = "Failed to create class"
            });
        }
    }

    // POST: api/teachers/content
    [HttpPost("content")]
    public async Task<ActionResult<ApiResponse<LessonContentDto>>> CreateContent([FromBody] CreateContentRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            // Get subject
            var subject = await _context.Subjects
                .FirstOrDefaultAsync(s => s.SubjectName.ToLower() == request.Subject.ToLower());

            if (subject == null)
            {
                return BadRequest(new ApiResponse<LessonContentDto>
                {
                    Success = false,
                    Error = "Subject not found"
                });
            }

            if (request.Type.ToLower() == "lesson")
            {
                // Create lesson
                var lesson = new Lesson
                {
                    Title = request.Title,
                    SubjectId = subject.SubjectId,
                    Content = JsonSerializer.Serialize(new
                    {
                        description = request.Description,
                        type = "text",
                        modules = new object[0]
                    }),
                    DifficultyLevel = request.Difficulty.ToLower() switch
                    {
                        "easy" => 3,
                        "medium" => 5,
                        "hard" => 8,
                        _ => 5
                    },
                    CreatedbyId = userId,
                    ApprovalStatus = ApprovalStatus.Draft,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    Description = request.Description,
                    EstimatedDurationMinutes = 45
                };

                _context.Lessons.Add(lesson);
                await _context.SaveChangesAsync();

                var lessonDto = new LessonContentDto
                {
                    Id = lesson.LessonId.ToString(),
                    Title = lesson.Title,
                    Subject = subject.SubjectName,
                    Type = "lesson",
                    Difficulty = request.Difficulty,
                    Status = "draft",
                    CreatedAt = lesson.CreatedAt.ToString("yyyy-MM-dd"),
                    StudentsCompleted = 0,
                    AverageScore = 0,
                    EstimatedDuration = lesson.EstimatedDurationMinutes
                };

                return Ok(new ApiResponse<LessonContentDto>
                {
                    Success = true,
                    Data = lessonDto
                });
            }
            else if (request.Type.ToLower() == "assignment")
            {
                // For assignments, we need a lesson to attach to
                // For now, create a basic assignment structure
                var assignment = new Assignment
                {
                    Title = request.Title,
                    LessonId = 1, // This should be properly handled in a real scenario
                    QuestionType = QuestionType.Essay,
                    Content = JsonSerializer.Serialize(new
                    {
                        description = request.Description,
                        instructions = "Complete the following assignment",
                        questions = new object[0]
                    }),
                    Rubric = JsonSerializer.Serialize(new
                    {
                        criteria = new object[0],
                        totalPoints = 100
                    }),
                    CreatedById = userId,
                    ApprovalStatus = ApprovalStatus.Draft,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Assignments.Add(assignment);
                await _context.SaveChangesAsync();

                var assignmentDto = new LessonContentDto
                {
                    Id = assignment.AssignmentId.ToString(),
                    Title = assignment.Title,
                    Subject = subject.SubjectName,
                    Type = "assignment",
                    Difficulty = request.Difficulty,
                    Status = "draft",
                    CreatedAt = assignment.CreatedAt.ToString("yyyy-MM-dd"),
                    StudentsCompleted = 0,
                    AverageScore = 0,
                    EstimatedDuration = 30
                };

                return Ok(new ApiResponse<LessonContentDto>
                {
                    Success = true,
                    Data = assignmentDto
                });
            }

            return BadRequest(new ApiResponse<LessonContentDto>
            {
                Success = false,
                Error = "Unsupported content type"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating content for user {UserId}", User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            return Ok(new ApiResponse<LessonContentDto>
            {
                Success = false,
                Error = "Failed to create content"
            });
        }
    }

    // GET: api/teachers/students
    [HttpGet("students")]
    public async Task<ActionResult<ApiResponse<List<StudentDataDto>>>> GetTeacherStudents()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var teacherLevels = await _context.Levels
                .Include(l => l.LevelStudents)
                    .ThenInclude(ls => ls.Student)
                .Where(l => l.TeacherId == userId)
                .ToListAsync();

            var studentIds = teacherLevels
                .SelectMany(l => l.LevelStudents)
                .Select(ls => ls.StudentId)
                .Distinct()
                .ToList();

            var studentProfiles = await _context.StudentProfiles
                .Where(sp => studentIds.Contains(sp.StudentId))
                .ToListAsync();

            var recentBehaviorLogs = await _context.BehaviorLogs
                .Where(bl => studentIds.Contains(bl.StudentId))
                .OrderByDescending(bl => bl.CreatedAt)
                .ToListAsync();

            var students = await MapToStudentDtos(teacherLevels, studentProfiles, recentBehaviorLogs);

            return Ok(new ApiResponse<List<StudentDataDto>>
            {
                Success = true,
                Data = students
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting teacher students for user {UserId}", User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            return Ok(new ApiResponse<List<StudentDataDto>>
            {
                Success = false,
                Error = "Failed to load students"
            });
        }
    }

    // GET: api/teachers/classes/{id}/analytics
    [HttpGet("classes/{id}/analytics")]
    public async Task<ActionResult<ApiResponse<ClassAnalyticsDto>>> GetClassAnalytics(int id)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var level = await _context.Levels
                .Include(l => l.Subject)
                .Include(l => l.LevelStudents)
                    .ThenInclude(ls => ls.Student)
                .FirstOrDefaultAsync(l => l.LevelId == id && l.TeacherId == userId);

            if (level == null)
            {
                return Ok(new ApiResponse<ClassAnalyticsDto>
                {
                    Success = false,
                    Error = "Class not found"
                });
            }

            var studentIds = level.LevelStudents.Select(ls => ls.StudentId).ToList();

            var behaviorLogs = await _context.BehaviorLogs
                .Where(bl => studentIds.Contains(bl.StudentId))
                .ToListAsync();

            var submissions = await _context.Submissions
                .Include(s => s.Assignment)
                .Where(s => studentIds.Contains(s.StudentId))
                .ToListAsync();

            var analytics = new ClassAnalyticsDto
            {
                ClassId = id.ToString(),
                ClassName = level.LevelName,
                Subject = level.Subject.SubjectName,
                TotalStudents = level.LevelStudents.Count,
                AverageProgress = CalculateAverageProgress(studentIds, behaviorLogs),
                EngagementRate = CalculateEngagementRate(behaviorLogs),
                CompletionRate = CalculateCompletionRate(submissions),
                AverageGrade = CalculateAverageGrade(submissions),
                StrugglingStiudents = CalculateStrugglingStudents(studentIds, behaviorLogs),
                TopPerformers = CalculateTopPerformers(studentIds, submissions),
                WeeklyTrends = CalculateWeeklyTrends(behaviorLogs),
                AssignmentStats = CalculateAssignmentStats(submissions),
                AIInsights = GenerateClassAIInsights(behaviorLogs, submissions)
            };

            return Ok(new ApiResponse<ClassAnalyticsDto>
            {
                Success = true,
                Data = analytics
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting class analytics for class {ClassId}", id);
            return Ok(new ApiResponse<ClassAnalyticsDto>
            {
                Success = false,
                Error = "Failed to load analytics"
            });
        }
    }

    // PUT: api/teachers/classes/{id}
    [HttpPut("classes/{id}")]
    public async Task<ActionResult<ApiResponse<ClassDto>>> UpdateClass(int id, [FromBody] UpdateClassRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var level = await _context.Levels
                .Include(l => l.Subject)
                .FirstOrDefaultAsync(l => l.LevelId == id && l.TeacherId == userId);

            if (level == null)
            {
                return Ok(new ApiResponse<ClassDto>
                {
                    Success = false,
                    Error = "Class not found"
                });
            }

            // Update level properties
            if (!string.IsNullOrEmpty(request.Name))
                level.LevelName = request.Name;

            if (request.MaxStudents.HasValue)
                level.MaxStudents = request.MaxStudents.Value;

            await _context.SaveChangesAsync();

            var updatedClass = new ClassDto
            {
                Id = level.LevelId.ToString(),
                Name = level.LevelName,
                Subject = level.Subject.SubjectName,
                Grade = request.Grade ?? "10th",
                StudentCount = await _context.LevelStudents.CountAsync(ls => ls.LevelId == id),
                Progress = CalculateClassProgress(level),
                NextLesson = request.NextLesson ?? "To be determined",
                Schedule = request.Schedule ?? "TBD",
                Status = level.IsActive ? "active" : "inactive",
                Description = request.Description ?? ""
            };

            return Ok(new ApiResponse<ClassDto>
            {
                Success = true,
                Data = updatedClass
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating class {ClassId}", id);
            return Ok(new ApiResponse<ClassDto>
            {
                Success = false,
                Error = "Failed to update class"
            });
        }
    }

    // DELETE: api/teachers/classes/{id}
    [HttpDelete("classes/{id}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteClass(int id)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var level = await _context.Levels
                .Include(l => l.LevelStudents)
                .FirstOrDefaultAsync(l => l.LevelId == id && l.TeacherId == userId);

            if (level == null)
            {
                return Ok(new ApiResponse<object>
                {
                    Success = false,
                    Error = "Class not found"
                });
            }

            // Check if class has students
            if (level.LevelStudents.Any())
            {
                return Ok(new ApiResponse<object>
                {
                    Success = false,
                    Error = "Cannot delete class with enrolled students"
                });
            }

            _context.Levels.Remove(level);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Class deleted successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting class {ClassId}", id);
            return Ok(new ApiResponse<object>
            {
                Success = false,
                Error = "Failed to delete class"
            });
        }
    }

    // POST: api/teachers/classes/{id}/archive
    [HttpPost("classes/{id}/archive")]
    public async Task<ActionResult<ApiResponse<object>>> ArchiveClass(int id)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var level = await _context.Levels
                .FirstOrDefaultAsync(l => l.LevelId == id && l.TeacherId == userId);

            if (level == null)
            {
                return Ok(new ApiResponse<object>
                {
                    Success = false,
                    Error = "Class not found"
                });
            }

            level.IsActive = false;
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Class archived successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error archiving class {ClassId}", id);
            return Ok(new ApiResponse<object>
            {
                Success = false,
                Error = "Failed to archive class"
            });
        }
    }

    // POST: api/teachers/classes/{id}/duplicate
    [HttpPost("classes/{id}/duplicate")]
    public async Task<ActionResult<ApiResponse<ClassDto>>> DuplicateClass(int id)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var originalLevel = await _context.Levels
                .Include(l => l.Subject)
                .FirstOrDefaultAsync(l => l.LevelId == id && l.TeacherId == userId);

            if (originalLevel == null)
            {
                return Ok(new ApiResponse<ClassDto>
                {
                    Success = false,
                    Error = "Class not found"
                });
            }

            var duplicatedLevel = new Level
            {
                LevelName = $"{originalLevel.LevelName} (Copy)",
                SubjectId = originalLevel.SubjectId,
                TeacherId = userId,
                IsActive = true,
                MaxStudents = originalLevel.MaxStudents,
                CreatedAt = DateTime.UtcNow
            };

            _context.Levels.Add(duplicatedLevel);
            await _context.SaveChangesAsync();

            var duplicatedClass = new ClassDto
            {
                Id = duplicatedLevel.LevelId.ToString(),
                Name = duplicatedLevel.LevelName,
                Subject = originalLevel.Subject.SubjectName,
                Grade = "10th",
                StudentCount = 0,
                Progress = 0,
                NextLesson = "To be determined",
                Schedule = "TBD",
                Status = "active",
                Description = ""
            };

            return Ok(new ApiResponse<ClassDto>
            {
                Success = true,
                Data = duplicatedClass
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error duplicating class {ClassId}", id);
            return Ok(new ApiResponse<ClassDto>
            {
                Success = false,
                Error = "Failed to duplicate class"
            });
        }
    }

    // PUT: api/teachers/content/{id}
    [HttpPut("content/{id}")]
    public async Task<ActionResult<ApiResponse<LessonContentDto>>> UpdateContent(int id, [FromBody] UpdateContentRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            // Try to find as lesson first
            var lesson = await _context.Lessons
                .Include(l => l.Subject)
                .FirstOrDefaultAsync(l => l.LessonId == id && l.CreatedbyId == userId);

            if (lesson != null)
            {
                if (!string.IsNullOrEmpty(request.Title))
                    lesson.Title = request.Title;

                if (!string.IsNullOrEmpty(request.Description))
                    lesson.Description = request.Description;

                lesson.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                var updatedLesson = new LessonContentDto
                {
                    Id = lesson.LessonId.ToString(),
                    Title = lesson.Title,
                    Subject = lesson.Subject?.SubjectName ?? "Unknown",
                    Type = "lesson",
                    Difficulty = lesson.DifficultyLevel switch
                    {
                        <= 3 => "easy",
                        <= 6 => "medium",
                        _ => "hard"
                    },
                    Status = lesson.ApprovalStatus.ToString().ToLower(),
                    CreatedAt = lesson.CreatedAt.ToString("yyyy-MM-dd"),
                    StudentsCompleted = 0,
                    AverageScore = 0,
                    EstimatedDuration = lesson.EstimatedDurationMinutes
                };

                return Ok(new ApiResponse<LessonContentDto>
                {
                    Success = true,
                    Data = updatedLesson
                });
            }

            // Try to find as assignment
            var assignment = await _context.Assignments
                .Include(a => a.Lesson)
                    .ThenInclude(l => l.Subject)
                .FirstOrDefaultAsync(a => a.AssignmentId == id && a.CreatedById == userId);

            if (assignment != null)
            {
                if (!string.IsNullOrEmpty(request.Title))
                    assignment.Title = request.Title;

                assignment.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                var updatedAssignment = new LessonContentDto
                {
                    Id = assignment.AssignmentId.ToString(),
                    Title = assignment.Title,
                    Subject = assignment.Lesson?.Subject?.SubjectName ?? "Unknown",
                    Type = "assignment",
                    Difficulty = "medium",
                    Status = assignment.ApprovalStatus.ToString().ToLower(),
                    CreatedAt = assignment.CreatedAt.ToString("yyyy-MM-dd"),
                    StudentsCompleted = assignment.Submissions.Count,
                    AverageScore = assignment.Submissions.Any() ? (int)assignment.Submissions.Average(s => s.FinalGrade ?? 0) : 0,
                    EstimatedDuration = 30
                };

                return Ok(new ApiResponse<LessonContentDto>
                {
                    Success = true,
                    Data = updatedAssignment
                });
            }

            return Ok(new ApiResponse<LessonContentDto>
            {
                Success = false,
                Error = "Content not found"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating content {ContentId}", id);
            return Ok(new ApiResponse<LessonContentDto>
            {
                Success = false,
                Error = "Failed to update content"
            });
        }
    }

    // DELETE: api/teachers/content/{id}
    [HttpDelete("content/{id}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteContent(int id, [FromQuery] string type)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            if (type.ToLower() == "lesson")
            {
                var lesson = await _context.Lessons
                    .FirstOrDefaultAsync(l => l.LessonId == id && l.CreatedbyId == userId);

                if (lesson == null)
                {
                    return Ok(new ApiResponse<object>
                    {
                        Success = false,
                        Error = "Lesson not found"
                    });
                }

                // Check if lesson has assignments
                var hasAssignments = await _context.Assignments
                    .AnyAsync(a => a.LessonId == id);

                if (hasAssignments)
                {
                    return Ok(new ApiResponse<object>
                    {
                        Success = false,
                        Error = "Cannot delete lesson with assignments"
                    });
                }

                _context.Lessons.Remove(lesson);
            }
            else if (type.ToLower() == "assignment")
            {
                var assignment = await _context.Assignments
                    .Include(a => a.Submissions)
                    .FirstOrDefaultAsync(a => a.AssignmentId == id && a.CreatedById == userId);

                if (assignment == null)
                {
                    return Ok(new ApiResponse<object>
                    {
                        Success = false,
                        Error = "Assignment not found"
                    });
                }

                // Check if assignment has submissions
                if (assignment.Submissions.Any())
                {
                    return Ok(new ApiResponse<object>
                    {
                        Success = false,
                        Error = "Cannot delete assignment with submissions"
                    });
                }

                _context.Assignments.Remove(assignment);
            }
            else
            {
                return Ok(new ApiResponse<object>
                {
                    Success = false,
                    Error = "Invalid content type"
                });
            }

            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Content deleted successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting content {ContentId}", id);
            return Ok(new ApiResponse<object>
            {
                Success = false,
                Error = "Failed to delete content"
            });
        }
    }

    // GET: api/teachers/content/{id}/analytics
    [HttpGet("content/{id}/analytics")]
    public async Task<ActionResult<ApiResponse<ContentAnalyticsDto>>> GetContentAnalytics(int id, [FromQuery] string type)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            ContentAnalyticsDto analytics;

            if (type.ToLower() == "lesson")
            {
                var lesson = await _context.Lessons
                    .Include(l => l.Subject)
                    .FirstOrDefaultAsync(l => l.LessonId == id && l.CreatedbyId == userId);

                if (lesson == null)
                {
                    return Ok(new ApiResponse<ContentAnalyticsDto>
                    {
                        Success = false,
                        Error = "Lesson not found"
                    });
                }

                // Get behavior logs for this lesson
                var behaviorLogs = await _context.BehaviorLogs
                    .Where(bl => bl.LessonId == id)
                    .ToListAsync();

                analytics = new ContentAnalyticsDto
                {
                    ContentId = id.ToString(),
                    Title = lesson.Title,
                    Type = "lesson",
                    ViewCount = behaviorLogs.Count(bl => bl.ActionType == BehaviorActionType.LessonStarted),
                    CompletionCount = behaviorLogs.Count(bl => bl.ActionType == BehaviorActionType.LessonCompleted),
                    AverageTimeSpent = CalculateAverageTimeSpent(behaviorLogs),
                    DropoffRate = CalculateDropoffRate(behaviorLogs),
                    DifficultyRating = lesson.DifficultyLevel,
                    StudentFeedback = GenerateStudentFeedback(behaviorLogs),
                    PerformanceData = GeneratePerformanceData(behaviorLogs),
                    AIRecommendations = GenerateContentAIRecommendations(lesson, behaviorLogs)
                };
            }
            else if (type.ToLower() == "assignment")
            {
                var assignment = await _context.Assignments
                    .Include(a => a.Lesson)
                        .ThenInclude(l => l.Subject)
                    .Include(a => a.Submissions)
                    .FirstOrDefaultAsync(a => a.AssignmentId == id && a.CreatedById == userId);

                if (assignment == null)
                {
                    return Ok(new ApiResponse<ContentAnalyticsDto>
                    {
                        Success = false,
                        Error = "Assignment not found"
                    });
                }

                analytics = new ContentAnalyticsDto
                {
                    ContentId = id.ToString(),
                    Title = assignment.Title,
                    Type = "assignment",
                    ViewCount = assignment.Submissions.Count,
                    CompletionCount = assignment.Submissions.Count(s => s.ReviewStatus == ReviewStatus.Completed),
                    AverageTimeSpent = 30, // Default for assignments
                    DropoffRate = CalculateAssignmentDropoffRate(assignment),
                    DifficultyRating = 5, // Default assignment difficulty
                    StudentFeedback = GenerateAssignmentFeedback(assignment.Submissions.ToList()),
                    PerformanceData = GenerateAssignmentPerformanceData(assignment.Submissions.ToList()),
                    AIRecommendations = GenerateAssignmentAIRecommendations(assignment)
                };
            }
            else
            {
                return Ok(new ApiResponse<ContentAnalyticsDto>
                {
                    Success = false,
                    Error = "Invalid content type"
                });
            }

            return Ok(new ApiResponse<ContentAnalyticsDto>
            {
                Success = true,
                Data = analytics
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting content analytics for {ContentId}", id);
            return Ok(new ApiResponse<ContentAnalyticsDto>
            {
                Success = false,
                Error = "Failed to load analytics"
            });
        }
    }

    // PUT: api/teachers/profile
    [HttpPut("profile")]
    public async Task<ActionResult<ApiResponse<TeacherProfileDto>>> UpdateTeacherProfile([FromBody] UpdateTeacherProfileRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return Ok(new ApiResponse<TeacherProfileDto>
                {
                    Success = false,
                    Error = "User not found"
                });
            }

            // Update user properties
            if (!string.IsNullOrEmpty(request.Name))
                user.FullName = request.Name;

            if (!string.IsNullOrEmpty(request.Email))
                user.Email = request.Email;

            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            // Return updated profile
            var updatedProfile = new TeacherProfileDto
            {
                Id = userId,
                Name = user.FullName,
                Email = user.Email ?? "",
                Subject = request.Subject ?? "Mathematics", // This should come from teacher assignments
                Experience = "8 years", // This should be calculated or stored
                Rating = 4.8, // This should be calculated from feedback
                Certifications = request.Certifications ?? new List<string> { "Advanced Mathematics", "STEM Education" },
                Bio = request.Bio ?? "Passionate educator focused on innovative teaching methods."
            };

            return Ok(new ApiResponse<TeacherProfileDto>
            {
                Success = true,
                Data = updatedProfile,
                Message = "Profile updated successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating teacher profile for user {UserId}", User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            return Ok(new ApiResponse<TeacherProfileDto>
            {
                Success = false,
                Error = "Failed to update profile"
            });
        }
    }

    // GET: api/teachers/students/{id}/aitwin
    [HttpGet("students/{id}/aitwin")]
    public async Task<ActionResult<ApiResponse<AITwinInsightDto>>> GetStudentAITwinDetails(string id)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            // Verify teacher has access to this student
            var hasAccess = await _context.Levels
                .Include(l => l.LevelStudents)
                .AnyAsync(l => l.TeacherId == userId && l.LevelStudents.Any(ls => ls.StudentId == id));

            if (!hasAccess)
            {
                return Ok(new ApiResponse<AITwinInsightDto>
                {
                    Success = false,
                    Error = "Student not found or access denied"
                });
            }

            var profile = await _context.StudentProfiles
                .FirstOrDefaultAsync(sp => sp.StudentId == id);

            var behaviorLogs = await _context.BehaviorLogs
                .Where(bl => bl.StudentId == id)
                .OrderByDescending(bl => bl.CreatedAt)
                .ToListAsync();

            var privacy = await _context.PrivacySettings
                .FirstOrDefaultAsync(ps => ps.UserId == id);

            var user = await _context.Users.FindAsync(id);

            if (profile == null)
            {
                return Ok(new ApiResponse<AITwinInsightDto>
                {
                    Success = false,
                    Error = "Student profile not found"
                });
            }

            var personalityTraits = ParsePersonalityTraits(profile.PersonalityTraits);
            var learningPreferences = ParseLearningPreferences(profile.LearningPreferences);
            var emotionalState = ParseEmotionalState(profile.EmotionalState);
            var behaviorAnalysis = AnalyzeBehaviorPatterns(behaviorLogs);
            var twinStage = DetermineTwinLearningStage(profile, behaviorLogs);
            var effectiveness = CalculateTwinEffectiveness(profile, behaviorLogs, behaviorAnalysis);
            var adaptations = GenerateTwinAdaptations(personalityTraits, learningPreferences, emotionalState, behaviorAnalysis);

            var insight = new AITwinInsightDto
            {
                Id = $"twin_{profile.ProfileId}",
                StudentId = profile.StudentId,
                StudentName = user?.FullName ?? "Unknown Student",
                TwinLearningStage = twinStage,
                PersonalityTraits = personalityTraits,
                LearningPreferences = learningPreferences,
                EmotionalState = emotionalState,
                BehaviorAnalysis = behaviorAnalysis,
                TwinAdaptations = adaptations,
                PrivacySettings = new PrivacySettingsDto
                {
                    AllowPersonalityAnalysis = privacy?.AllowAiPersonalityAnalysis ?? true,
                    AllowBehaviorTracking = privacy?.AllowBehaviorTracking ?? true,
                    AllowInteractionRecording = privacy?.AllowInteractionRecording ?? true,
                    ParentNotificationEnabled = privacy?.ParentNotificationEnabled ?? true
                },
                LastTwinInteraction = behaviorLogs.FirstOrDefault()?.CreatedAt.ToString("yyyy-MM-dd HH:mm") ?? "No recent interaction",
                TwinEffectivenessScore = effectiveness
            };

            return Ok(new ApiResponse<AITwinInsightDto>
            {
                Success = true,
                Data = insight
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting AI Twin details for student {StudentId}", id);
            return Ok(new ApiResponse<AITwinInsightDto>
            {
                Success = false,
                Error = "Failed to load AI Twin details"
            });
        }
    }

    // Private helper methods
    private async Task<TeacherProfileDto> GetTeacherProfile(string userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return new TeacherProfileDto();

        return new TeacherProfileDto
        {
            Id = userId,
            Name = user.FullName,
            Email = user.Email ?? "",
            Subject = "Mathematics & Science", // This should come from teacher's subject assignments
            Experience = "8 years", // This should be calculated or stored
            Rating = 4.8, // This should be calculated from student feedback
            Certifications = new List<string> { "Advanced Mathematics", "STEM Education" },
            Bio = "Passionate educator focused on innovative teaching methods."
        };
    }

    private TeacherStatsDto CalculateTeacherStats(List<Level> levels, List<StudentProfile> profiles, List<Assignment> assignments)
    {
        var totalStudents = levels.SelectMany(l => l.LevelStudents).Count();
        var pendingSubmissions = assignments.SelectMany(a => a.Submissions).Count(s => s.ReviewStatus == ReviewStatus.Pending);

        return new TeacherStatsDto
        {
            TotalStudents = totalStudents,
            ActiveClasses = levels.Count,
            PendingSubmissions = pendingSubmissions,
            AverageProgress = 78, // This should be calculated from actual student progress
            StrugglingSStudents = profiles.Count(p => CalculateRiskScore(p) > 0.6),
            ExcellingStudents = profiles.Count(p => CalculateProgressFromProfile(p) > 85),
            WeeklyEngagement = 87, // This should be calculated from behavior logs
            CompletionRate = 92 // This should be calculated from assignment submissions
        };
    }

    private List<ClassDto> MapToClassDtos(List<Level> levels)
    {
        return levels.Select(level => new ClassDto
        {
            Id = level.LevelId.ToString(),
            Name = level.LevelName,
            Subject = level.Subject?.SubjectName ?? "Unknown",
            Grade = "10th", // This should come from level metadata
            StudentCount = level.LevelStudents.Count,
            Progress = CalculateClassProgress(level),
            NextLesson = "Next lesson topic", // This should come from curriculum planning
            Schedule = "Mon, Wed, Fri - 9:00 AM", // This should be stored in level metadata
            Status = level.IsActive ? "active" : "inactive",
            Description = level.Subject?.Description ?? ""
        }).ToList();
    }

    private async Task<List<StudentDataDto>> MapToStudentDtos(List<Level> levels, List<StudentProfile> profiles, List<BehaviorLog> behaviorLogs)
    {
        var students = new List<StudentDataDto>();

        foreach (var level in levels)
        {
            foreach (var levelStudent in level.LevelStudents)
            {
                var profile = profiles.FirstOrDefault(p => p.StudentId == levelStudent.StudentId);
                var recentBehavior = behaviorLogs
                    .Where(bl => bl.StudentId == levelStudent.StudentId)
                    .OrderByDescending(bl => bl.CreatedAt)
                    .FirstOrDefault();

                var student = new StudentDataDto
                {
                    Id = levelStudent.StudentId,
                    Name = levelStudent.Student?.FullName ?? "Unknown",
                    Email = levelStudent.Student?.Email ?? "",
                    Grade = "10th", // This should come from student metadata
                    Class = level.LevelName,
                    OverallProgress = CalculateProgressFromProfile(profile),
                    LastActive = recentBehavior?.CreatedAt.ToString("yyyy-MM-dd HH:mm") ?? "Unknown",
                    Status = DetermineStudentStatus(profile, recentBehavior),
                    CurrentMood = ExtractMoodFromProfile(profile),
                    RiskScore = CalculateRiskScore(profile),
                    AiRecommendations = GenerateRecommendations(profile),
                    RecentSubmissions = 0, // Calculate from actual submissions
                    AverageGrade = 85 // Calculate from actual grades
                };

                students.Add(student);
            }
        }

        return students.DistinctBy(s => s.Id).ToList();
    }

    private List<AIAlertDto> GenerateAIAlerts(List<StudentProfile> profiles, List<BehaviorLog> behaviorLogs)
    {
        var alerts = new List<AIAlertDto>();

        foreach (var profile in profiles)
        {
            var riskScore = CalculateRiskScore(profile);
            var recentBehavior = behaviorLogs
                .Where(bl => bl.StudentId == profile.StudentId)
                .OrderByDescending(bl => bl.CreatedAt)
                .Take(5)
                .ToList();

            if (riskScore > 0.7)
            {
                alerts.Add(new AIAlertDto
                {
                    Id = Guid.NewGuid().ToString(),
                    StudentId = profile.StudentId,
                    StudentName = "Student", // Get from user table
                    Type = "academic",
                    Severity = "high",
                    Title = "High Risk Student Detected",
                    Message = "Student showing significant signs of struggle",
                    Timestamp = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm"),
                    ActionTaken = false,
                    Recommendations = new List<string>
                    {
                        "Schedule immediate one-on-one session",
                        "Review recent assignments",
                        "Consider additional support resources"
                    }
                });
            }
        }

        return alerts;
    }

    private async Task<List<RecentActivityDto>> GetRecentActivity(string userId)
    {
        // This would typically query various tables for recent teacher activities
        return new List<RecentActivityDto>
        {
            new RecentActivityDto
            {
                Id = "1",
                Type = "grading",
                Title = "Assignment graded",
                Description = "Algebra Quiz - Class 10A completed",
                Timestamp = DateTime.UtcNow.AddMinutes(-2).ToString("yyyy-MM-dd HH:mm")
            }
        };
    }

    private async Task<List<LessonContentDto>> GetTeacherContent(string userId)
    {
        var lessons = await _context.Lessons
            .Include(l => l.Subject)
            .Where(l => l.CreatedbyId == userId)
            .ToListAsync();

        var assignments = await _context.Assignments
            .Include(a => a.Lesson)
                .ThenInclude(l => l.Subject)
            .Where(a => a.CreatedById == userId)
            .ToListAsync();

        var content = new List<LessonContentDto>();

        content.AddRange(lessons.Select(l => new LessonContentDto
        {
            Id = l.LessonId.ToString(),
            Title = l.Title,
            Subject = l.Subject?.SubjectName ?? "Unknown",
            Type = "lesson",
            Difficulty = l.DifficultyLevel switch
            {
                <= 3 => "easy",
                <= 6 => "medium",
                _ => "hard"
            },
            Status = l.ApprovalStatus.ToString().ToLower(),
            CreatedAt = l.CreatedAt.ToString("yyyy-MM-dd"),
            StudentsCompleted = 0, // Calculate from actual completions
            AverageScore = 0, // Calculate from actual scores
            EstimatedDuration = l.EstimatedDurationMinutes
        }));

        content.AddRange(assignments.Select(a => new LessonContentDto
        {
            Id = a.AssignmentId.ToString(),
            Title = a.Title,
            Subject = a.Lesson?.Subject?.SubjectName ?? "Unknown",
            Type = "assignment",
            Difficulty = "medium", // Determine from assignment complexity
            Status = a.ApprovalStatus.ToString().ToLower(),
            CreatedAt = a.CreatedAt.ToString("yyyy-MM-dd"),
            StudentsCompleted = a.Submissions.Count,
            AverageScore = a.Submissions.Any() ? (int)a.Submissions.Average(s => s.FinalGrade ?? 0) : 0,
            EstimatedDuration = 30
        }));

        return content.OrderByDescending(c => c.CreatedAt).ToList();
    }

    // AI Twin Insights Generation based on StudentProfile, BehaviorLog, and PrivacySetting entities
    private async Task<List<AITwinInsightDto>> GenerateAITwinInsights(
        List<StudentProfile> profiles,
        List<BehaviorLog> behaviorLogs,
        List<PrivacySetting> privacySettings)
    {
        var insights = new List<AITwinInsightDto>();

        foreach (var profile in profiles)
        {
            var studentBehaviorLogs = behaviorLogs
                .Where(bl => bl.StudentId == profile.StudentId)
                .OrderByDescending(bl => bl.CreatedAt)
                .ToList();

            var privacy = privacySettings.FirstOrDefault(ps => ps.UserId == profile.StudentId);
            var user = await _context.Users.FindAsync(profile.StudentId);

            // Parse JSONB fields from StudentProfile
            var personalityTraits = ParsePersonalityTraits(profile.PersonalityTraits);
            var learningPreferences = ParseLearningPreferences(profile.LearningPreferences);
            var emotionalState = ParseEmotionalState(profile.EmotionalState);

            // Analyze behavior patterns
            var behaviorAnalysis = AnalyzeBehaviorPatterns(studentBehaviorLogs);

            // Determine twin learning stage based on data availability and effectiveness
            var twinStage = DetermineTwinLearningStage(profile, studentBehaviorLogs);

            // Calculate twin effectiveness based on student progress and behavior
            var effectiveness = CalculateTwinEffectiveness(profile, studentBehaviorLogs, behaviorAnalysis);

            // Generate AI adaptations and recommendations
            var adaptations = GenerateTwinAdaptations(personalityTraits, learningPreferences, emotionalState, behaviorAnalysis);

            var insight = new AITwinInsightDto
            {
                Id = $"twin_{profile.ProfileId}",
                StudentId = profile.StudentId,
                StudentName = user?.FullName ?? "Unknown Student",
                TwinLearningStage = twinStage,
                PersonalityTraits = personalityTraits,
                LearningPreferences = learningPreferences,
                EmotionalState = emotionalState,
                BehaviorAnalysis = behaviorAnalysis,
                TwinAdaptations = adaptations,
                PrivacySettings = new PrivacySettingsDto
                {
                    AllowPersonalityAnalysis = privacy?.AllowAiPersonalityAnalysis ?? true,
                    AllowBehaviorTracking = privacy?.AllowBehaviorTracking ?? true,
                    AllowInteractionRecording = privacy?.AllowInteractionRecording ?? true,
                    ParentNotificationEnabled = privacy?.ParentNotificationEnabled ?? true
                },
                LastTwinInteraction = studentBehaviorLogs.FirstOrDefault()?.CreatedAt.ToString("yyyy-MM-dd HH:mm") ?? "No recent interaction",
                TwinEffectivenessScore = effectiveness
            };

            insights.Add(insight);
        }

        return insights;
    }

    private PersonalityTraitsDto ParsePersonalityTraits(string personalityTraitsJson)
    {
        try
        {
            var traits = JsonSerializer.Deserialize<Dictionary<string, object>>(personalityTraitsJson);
            if (traits != null)
            {
                return new PersonalityTraitsDto
                {
                    LearningStyle = GetStringFromJson(traits, "learningStyle", "Visual-Kinesthetic"),
                    Motivation = GetStringFromJson(traits, "motivation", "Achievement-oriented"),
                    Strengths = GetListFromJson(traits, "strengths", new[] { "Problem solving", "Critical thinking" }),
                    Challenges = GetListFromJson(traits, "challenges", new[] { "Time management", "Test anxiety" })
                };
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to parse personality traits JSON: {Json}", personalityTraitsJson);
        }

        return new PersonalityTraitsDto
        {
            LearningStyle = "Analyzing...",
            Motivation = "Determining...",
            Strengths = new List<string> { "Data being collected" },
            Challenges = new List<string> { "Analysis in progress" }
        };
    }

    private LearningPreferencesDto ParseLearningPreferences(string learningPreferencesJson)
    {
        try
        {
            var preferences = JsonSerializer.Deserialize<Dictionary<string, object>>(learningPreferencesJson);
            if (preferences != null)
            {
                return new LearningPreferencesDto
                {
                    PreferredPace = GetStringFromJson(preferences, "preferredPace", "medium"),
                    PreferredFormat = GetListFromJson(preferences, "preferredFormat", new[] { "Interactive content", "Visual aids" }),
                    OptimalStudyTime = GetStringFromJson(preferences, "optimalStudyTime", "Morning (9-11 AM)"),
                    DifficultyPreference = GetIntFromJson(preferences, "difficultyPreference", 5)
                };
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to parse learning preferences JSON: {Json}", learningPreferencesJson);
        }

        return new LearningPreferencesDto
        {
            PreferredPace = "medium",
            PreferredFormat = new List<string> { "Analyzing preferences..." },
            OptimalStudyTime = "Determining optimal time...",
            DifficultyPreference = 5
        };
    }

    private EmotionalStateDto ParseEmotionalState(string emotionalStateJson)
    {
        try
        {
            var emotional = JsonSerializer.Deserialize<Dictionary<string, object>>(emotionalStateJson);
            if (emotional != null)
            {
                return new EmotionalStateDto
                {
                    CurrentMood = GetStringFromJson(emotional, "currentMood", "Focused"),
                    StressLevel = GetIntFromJson(emotional, "stressLevel", 5),
                    ConfidenceLevel = GetIntFromJson(emotional, "confidenceLevel", 7),
                    EngagementLevel = GetIntFromJson(emotional, "engagementLevel", 8)
                };
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to parse emotional state JSON: {Json}", emotionalStateJson);
        }

        return new EmotionalStateDto
        {
            CurrentMood = "Neutral",
            StressLevel = 5,
            ConfidenceLevel = 5,
            EngagementLevel = 5
        };
    }

    private BehaviorAnalysisDto AnalyzeBehaviorPatterns(List<BehaviorLog> behaviorLogs)
    {
        if (!behaviorLogs.Any())
        {
            return new BehaviorAnalysisDto
            {
                RiskScore = 0.3f,
                FlaggedBehaviors = new List<string>(),
                PositivePatterns = new List<string> { "Regular attendance" },
                LastSessionQuality = 7
            };
        }

        var avgRiskScore = behaviorLogs.Average(bl => bl.RiskScore);
        var flaggedLogs = behaviorLogs.Where(bl => bl.Flagged).ToList();
        var recentLogs = behaviorLogs.Take(5).ToList();

        var flaggedBehaviors = new List<string>();
        var positivePatterns = new List<string>();

        // Analyze flagged behaviors
        foreach (var flagged in flaggedLogs)
        {
            try
            {
                var details = JsonSerializer.Deserialize<Dictionary<string, object>>(flagged.Details);
                if (details != null && details.TryGetValue("issue", out var issue))
                {
                    flaggedBehaviors.Add(issue.ToString() ?? "Unknown issue");
                }
            }
            catch
            {
                flaggedBehaviors.Add("Behavioral concern detected");
            }
        }

        // Identify positive patterns
        var consecutiveSessions = recentLogs.Count(bl => bl.RiskScore < 0.3);
        if (consecutiveSessions >= 3)
        {
            positivePatterns.Add("Consistent good behavior");
        }

        var engagement = recentLogs.Where(bl => bl.ActionType == BehaviorActionType.InteractionCompleted).Count();
        if (engagement > 2)
        {
            positivePatterns.Add("High engagement level");
        }

        return new BehaviorAnalysisDto
        {
            RiskScore = avgRiskScore,
            FlaggedBehaviors = flaggedBehaviors,
            PositivePatterns = positivePatterns,
            LastSessionQuality = recentLogs.Any() ? (int)((1 - recentLogs.First().RiskScore) * 10) : 7
        };
    }

    private string DetermineTwinLearningStage(StudentProfile profile, List<BehaviorLog> behaviorLogs)
    {
        var daysSinceCreation = (DateTime.UtcNow - profile.CreatedAt).TotalDays;
        var behaviorDataPoints = behaviorLogs.Count;

        if (daysSinceCreation < 1 || behaviorDataPoints < 5)
            return "initializing";
        else if (daysSinceCreation < 7 || behaviorDataPoints < 20)
            return "learning";
        else if (daysSinceCreation < 30 || behaviorDataPoints < 50)
            return "adapting";
        else
            return "optimized";
    }

    private int CalculateTwinEffectiveness(StudentProfile profile, List<BehaviorLog> behaviorLogs, BehaviorAnalysisDto analysis)
    {
        var baseEffectiveness = 50;

        // Increase effectiveness based on data available
        baseEffectiveness += behaviorLogs.Count > 50 ? 20 : behaviorLogs.Count / 3;

        // Adjust based on behavior patterns
        if (analysis.RiskScore < 0.3) baseEffectiveness += 15;
        else if (analysis.RiskScore > 0.7) baseEffectiveness -= 20;

        // Positive patterns boost effectiveness
        baseEffectiveness += analysis.PositivePatterns.Count * 5;

        // Negative patterns reduce effectiveness
        baseEffectiveness -= analysis.FlaggedBehaviors.Count * 10;

        // Recent activity boosts effectiveness
        var recentActivity = behaviorLogs.Count(bl => bl.CreatedAt > DateTime.UtcNow.AddDays(-7));
        baseEffectiveness += recentActivity > 10 ? 10 : recentActivity;

        return Math.Clamp(baseEffectiveness, 10, 100);
    }

    private TwinAdaptationsDto GenerateTwinAdaptations(
        PersonalityTraitsDto personality,
        LearningPreferencesDto preferences,
        EmotionalStateDto emotional,
        BehaviorAnalysisDto behavior)
    {
        var adaptations = new TwinAdaptationsDto();

        // Content adjustments based on learning style and preferences
        if (personality.LearningStyle.Contains("Visual"))
        {
            adaptations.ContentAdjustments.Add("Increased visual content");
            adaptations.ContentAdjustments.Add("Diagram-based explanations");
        }

        if (preferences.PreferredPace == "fast")
        {
            adaptations.PacingChanges.Add("Accelerated progression");
            adaptations.PacingChanges.Add("Challenge mode enabled");
        }
        else if (preferences.PreferredPace == "slow")
        {
            adaptations.PacingChanges.Add("Extended review periods");
            adaptations.PacingChanges.Add("Smaller content chunks");
        }

        // Support strategies based on emotional state
        if (emotional.StressLevel > 7)
        {
            adaptations.SupportStrategies.Add("Stress reduction techniques");
            adaptations.SupportStrategies.Add("Mindfulness exercises");
        }

        if (emotional.ConfidenceLevel < 4)
        {
            adaptations.SupportStrategies.Add("Confidence building activities");
            adaptations.SupportStrategies.Add("Success celebration");
        }

        // Recommendations based on behavior analysis
        if (behavior.RiskScore > 0.6)
        {
            adaptations.NextRecommendations.Add("Immediate intervention needed");
            adaptations.NextRecommendations.Add("One-on-one support session");
        }
        else if (behavior.PositivePatterns.Count > 2)
        {
            adaptations.NextRecommendations.Add("Advanced challenges");
            adaptations.NextRecommendations.Add("Peer tutoring opportunity");
        }

        return adaptations;
    }

    // Helper methods for JSON parsing
    private string GetStringFromJson(Dictionary<string, object> dict, string key, string defaultValue)
    {
        return dict.TryGetValue(key, out var value) ? value?.ToString() ?? defaultValue : defaultValue;
    }

    private List<string> GetListFromJson(Dictionary<string, object> dict, string key, string[] defaultValue)
    {
        if (dict.TryGetValue(key, out var value))
        {
            try
            {
                if (value is JsonElement element && element.ValueKind == JsonValueKind.Array)
                {
                    return element.EnumerateArray()
                        .Select(item => item.GetString() ?? "")
                        .Where(s => !string.IsNullOrEmpty(s))
                        .ToList();
                }
            }
            catch
            {
                // Fall through to default
            }
        }
        return defaultValue.ToList();
    }

    private int GetIntFromJson(Dictionary<string, object> dict, string key, int defaultValue)
    {
        if (dict.TryGetValue(key, out var value))
        {
            if (int.TryParse(value?.ToString(), out var result))
                return result;
        }
        return defaultValue;
    }

    // Helper calculation methods
    private int CalculateProgressFromProfile(StudentProfile? profile)
    {
        if (profile == null) return 0;

        try
        {
            var emotionalState = JsonSerializer.Deserialize<Dictionary<string, object>>(profile.EmotionalState);
            if (emotionalState != null && emotionalState.TryGetValue("motivationLevel", out var motivation))
            {
                if (double.TryParse(motivation.ToString(), out var motivationValue))
                {
                    return (int)(motivationValue * 100);
                }
            }
        }
        catch
        {
            // Fallback if JSON parsing fails
        }

        return 75; // Default progress
    }

    private double CalculateRiskScore(StudentProfile? profile)
    {
        if (profile == null) return 0.5;

        try
        {
            var emotionalState = JsonSerializer.Deserialize<Dictionary<string, object>>(profile.EmotionalState);
            if (emotionalState != null)
            {
                var stressLevel = GetDoubleFromJson(emotionalState, "stressLevel", 0.3);
                var motivationLevel = GetDoubleFromJson(emotionalState, "motivationLevel", 0.8);
                var confidenceLevel = GetDoubleFromJson(emotionalState, "confidenceLevel", 0.7);

                return (stressLevel + (1 - motivationLevel) + (1 - confidenceLevel)) / 3;
            }
        }
        catch
        {
            // Fallback if JSON parsing fails
        }

        return 0.3; // Default low risk
    }

    private string DetermineStudentStatus(StudentProfile? profile, BehaviorLog? recentBehavior)
    {
        if (profile == null) return "inactive";

        var progress = CalculateProgressFromProfile(profile);
        var riskScore = CalculateRiskScore(profile);

        if (riskScore > 0.6) return "struggling";
        if (progress > 85) return "excelling";
        if (recentBehavior != null && recentBehavior.CreatedAt > DateTime.UtcNow.AddDays(-1)) return "active";

        return "inactive";
    }

    private string ExtractMoodFromProfile(StudentProfile? profile)
    {
        if (profile == null) return "Unknown";

        try
        {
            var emotionalState = JsonSerializer.Deserialize<Dictionary<string, object>>(profile.EmotionalState);
            if (emotionalState != null && emotionalState.TryGetValue("currentMood", out var mood))
            {
                return mood.ToString() ?? "Neutral";
            }
        }
        catch
        {
            // Fallback if JSON parsing fails
        }

        return "Neutral";
    }

    private List<string> GenerateRecommendations(StudentProfile? profile)
    {
        if (profile == null)
            return new List<string> { "No data available for recommendations" };

        var riskScore = CalculateRiskScore(profile);
        var progress = CalculateProgressFromProfile(profile);

        var recommendations = new List<string>();

        if (riskScore > 0.6)
        {
            recommendations.Add("Schedule immediate intervention");
            recommendations.Add("Consider one-on-one tutoring");
        }

        if (progress < 50)
        {
            recommendations.Add("Review fundamental concepts");
            recommendations.Add("Provide additional practice materials");
        }

        if (progress > 85)
        {
            recommendations.Add("Consider advanced challenges");
            recommendations.Add("Explore acceleration opportunities");
        }

        return recommendations.Any() ? recommendations : new List<string> { "Continue current approach" };
    }

    private int CalculateClassProgress(Level level)
    {
        // This would calculate based on lesson completions, assignment submissions, etc.
        return 75; // Placeholder
    }

    private double GetDoubleFromJson(Dictionary<string, object> dict, string key, double defaultValue)
    {
        if (dict.TryGetValue(key, out var value))
        {
            if (double.TryParse(value?.ToString(), out var result))
                return result;
        }
        return defaultValue;
    }

    // Analytics calculation methods
    private int CalculateAverageProgress(List<string> studentIds, List<BehaviorLog> behaviorLogs)
    {
        if (!studentIds.Any()) return 0;

        var progressScores = new List<int>();
        foreach (var studentId in studentIds)
        {
            var studentLogs = behaviorLogs.Where(bl => bl.StudentId == studentId).ToList();
            var completedLessons = studentLogs.Count(bl => bl.ActionType == BehaviorActionType.LessonCompleted);
            var totalLessons = studentLogs.Count(bl => bl.ActionType == BehaviorActionType.LessonStarted);

            var progress = totalLessons > 0 ? (completedLessons * 100) / totalLessons : 0;
            progressScores.Add(progress);
        }

        return progressScores.Any() ? (int)progressScores.Average() : 0;
    }

    private int CalculateEngagementRate(List<BehaviorLog> behaviorLogs)
    {
        if (!behaviorLogs.Any()) return 0;

        var engagedSessions = behaviorLogs.Count(bl =>
            bl.ActionType == BehaviorActionType.LessonCompleted ||
            bl.ActionType == BehaviorActionType.QuestionAnswered ||
            bl.ActionType == BehaviorActionType.FlowStateDetected);

        var totalSessions = behaviorLogs.Count(bl => bl.ActionType == BehaviorActionType.LessonStarted);

        return totalSessions > 0 ? (engagedSessions * 100) / totalSessions : 0;
    }

    private int CalculateCompletionRate(List<Submission> submissions)
    {
        if (!submissions.Any()) return 0;

        var completedSubmissions = submissions.Count(s => s.ReviewStatus == ReviewStatus.Completed);
        return (completedSubmissions * 100) / submissions.Count;
    }

    private int CalculateAverageGrade(List<Submission> submissions)
    {
        var graded = submissions.Where(s => s.FinalGrade.HasValue).ToList();
        return graded.Any() ? (int)graded.Average(s => s.FinalGrade!.Value) : 0;
    }

    private List<string> CalculateStrugglingStudents(List<string> studentIds, List<BehaviorLog> behaviorLogs)
    {
        var struggling = new List<string>();

        foreach (var studentId in studentIds)
        {
            var studentLogs = behaviorLogs.Where(bl => bl.StudentId == studentId).ToList();
            var avgRiskScore = studentLogs.Any() ? studentLogs.Average(bl => bl.RiskScore) : 0;

            if (avgRiskScore > 0.6)
            {
                struggling.Add(studentId);
            }
        }

        return struggling;
    }

    private List<string> CalculateTopPerformers(List<string> studentIds, List<Submission> submissions)
    {
        var performers = new List<string>();

        foreach (var studentId in studentIds)
        {
            var studentSubmissions = submissions.Where(s => s.StudentId == studentId && s.FinalGrade.HasValue).ToList();
            var avgGrade = studentSubmissions.Any() ? studentSubmissions.Average(s => s.FinalGrade!.Value) : 0;

            if (avgGrade >= 85)
            {
                performers.Add(studentId);
            }
        }

        return performers;
    }

    private List<WeeklyTrendDto> CalculateWeeklyTrends(List<BehaviorLog> behaviorLogs)
    {
        var trends = new List<WeeklyTrendDto>();
        var now = DateTime.UtcNow;

        for (int i = 4; i >= 0; i--)
        {
            var weekStart = now.AddDays(-7 * i).Date;
            var weekEnd = weekStart.AddDays(7);

            var weekLogs = behaviorLogs.Where(bl => bl.CreatedAt >= weekStart && bl.CreatedAt < weekEnd).ToList();

            trends.Add(new WeeklyTrendDto
            {
                Week = weekStart.ToString("MMM dd"),
                Engagement = weekLogs.Count(bl => bl.ActionType == BehaviorActionType.LessonCompleted),
                Completion = weekLogs.Count(bl => bl.ActionType == BehaviorActionType.LessonCompleted),
                RiskFlags = weekLogs.Count(bl => bl.Flagged)
            });
        }

        return trends;
    }

    private List<AssignmentStatDto> CalculateAssignmentStats(List<Submission> submissions)
    {
        var assignmentGroups = submissions.GroupBy(s => s.AssignmentId).ToList();
        var stats = new List<AssignmentStatDto>();

        foreach (var group in assignmentGroups.Take(5))
        {
            var assignmentSubmissions = group.ToList();
            var graded = assignmentSubmissions.Where(s => s.FinalGrade.HasValue).ToList();

            stats.Add(new AssignmentStatDto
            {
                AssignmentId = group.Key.ToString(),
                Name = $"Assignment {group.Key}",
                Submissions = assignmentSubmissions.Count,
                AverageScore = graded.Any() ? (int)graded.Average(s => s.FinalGrade!.Value) : 0,
                CompletionRate = assignmentSubmissions.Count > 0 ?
                    (assignmentSubmissions.Count(s => s.ReviewStatus == ReviewStatus.Completed) * 100) / assignmentSubmissions.Count : 0
            });
        }

        return stats;
    }

    private List<string> GenerateClassAIInsights(List<BehaviorLog> behaviorLogs, List<Submission> submissions)
    {
        var insights = new List<string>();

        var avgRiskScore = behaviorLogs.Any() ? behaviorLogs.Average(bl => bl.RiskScore) : 0;
        var flaggedCount = behaviorLogs.Count(bl => bl.Flagged);
        var avgGrade = submissions.Where(s => s.FinalGrade.HasValue).Any() ?
            submissions.Where(s => s.FinalGrade.HasValue).Average(s => s.FinalGrade!.Value) : 0;

        if (avgRiskScore < 0.3)
            insights.Add("Class shows excellent learning behavior patterns");
        else if (avgRiskScore > 0.6)
            insights.Add("Multiple students showing signs of struggle - consider intervention");

        if (avgGrade >= 85)
            insights.Add("Class performance is excellent - consider advanced challenges");
        else if (avgGrade < 70)
            insights.Add("Class may benefit from review sessions and additional support");

        if (flaggedCount > behaviorLogs.Count * 0.1)
            insights.Add("Elevated risk flags detected - monitor student wellbeing");

        return insights.Any() ? insights : new List<string> { "Class performing within normal parameters" };
    }

    private int CalculateAverageTimeSpent(List<BehaviorLog> behaviorLogs)
    {
        // This would typically calculate based on session durations
        // For now, return a reasonable estimate
        return behaviorLogs.Any() ? Math.Min(60, Math.Max(5, behaviorLogs.Count * 2)) : 0;
    }

    private double CalculateDropoffRate(List<BehaviorLog> behaviorLogs)
    {
        var started = behaviorLogs.Count(bl => bl.ActionType == BehaviorActionType.LessonStarted);
        var abandoned = behaviorLogs.Count(bl => bl.ActionType == BehaviorActionType.LessonAbandoned);

        return started > 0 ? (double)abandoned / started : 0;
    }

    private List<string> GenerateStudentFeedback(List<BehaviorLog> behaviorLogs)
    {
        var feedback = new List<string>();

        var frustrationEvents = behaviorLogs.Count(bl => bl.ActionType == BehaviorActionType.FrustrationDetected);
        var flowEvents = behaviorLogs.Count(bl => bl.ActionType == BehaviorActionType.FlowStateDetected);

        if (flowEvents > frustrationEvents)
            feedback.Add("Students generally find content engaging");
        else if (frustrationEvents > 0)
            feedback.Add("Some students experiencing difficulty");

        return feedback.Any() ? feedback : new List<string> { "Insufficient feedback data" };
    }

    private List<PerformanceDataDto> GeneratePerformanceData(List<BehaviorLog> behaviorLogs)
    {
        var data = new List<PerformanceDataDto>();
        var now = DateTime.UtcNow;

        for (int i = 6; i >= 0; i--)
        {
            var date = now.AddDays(-i).Date;
            var dayLogs = behaviorLogs.Where(bl => bl.CreatedAt.Date == date).ToList();

            data.Add(new PerformanceDataDto
            {
                Date = date.ToString("MMM dd"),
                Views = dayLogs.Count(bl => bl.ActionType == BehaviorActionType.LessonStarted),
                Completions = dayLogs.Count(bl => bl.ActionType == BehaviorActionType.LessonCompleted),
                AverageTime = dayLogs.Any() ? Math.Min(60, dayLogs.Count * 2) : 0
            });
        }

        return data;
    }

    private List<string> GenerateContentAIRecommendations(Lesson lesson, List<BehaviorLog> behaviorLogs)
    {
        var recommendations = new List<string>();

        var avgRiskScore = behaviorLogs.Any() ? behaviorLogs.Average(bl => bl.RiskScore) : 0;
        var dropoffRate = CalculateDropoffRate(behaviorLogs);

        if (dropoffRate > 0.3)
            recommendations.Add("High dropout rate - consider breaking content into smaller segments");

        if (avgRiskScore > 0.5)
            recommendations.Add("Students showing difficulty - add more examples or practice exercises");

        if (lesson.DifficultyLevel > 7 && avgRiskScore > 0.4)
            recommendations.Add("Consider reducing difficulty or adding prerequisite content");

        return recommendations.Any() ? recommendations : new List<string> { "Content performing well" };
    }

    private double CalculateAssignmentDropoffRate(Assignment assignment)
    {
        // Calculate based on assignment deadline vs submission rate
        var expectedSubmissions = 20; // This should come from class size
        var actualSubmissions = assignment.Submissions.Count;

        return expectedSubmissions > 0 ? 1 - ((double)actualSubmissions / expectedSubmissions) : 0;
    }

    private List<string> GenerateAssignmentFeedback(List<Submission> submissions)
    {
        var feedback = new List<string>();

        var graded = submissions.Where(s => s.FinalGrade.HasValue).ToList();
        if (graded.Any())
        {
            var avgGrade = graded.Average(s => s.FinalGrade!.Value);
            if (avgGrade >= 85)
                feedback.Add("Students demonstrating strong understanding");
            else if (avgGrade < 70)
                feedback.Add("Students may need additional support");
        }

        return feedback.Any() ? feedback : new List<string> { "Insufficient data for feedback" };
    }

    private List<PerformanceDataDto> GenerateAssignmentPerformanceData(List<Submission> submissions)
    {
        var data = new List<PerformanceDataDto>();
        var submissionGroups = submissions.GroupBy(s => s.CreatedAt.Date).OrderBy(g => g.Key).ToList();

        foreach (var group in submissionGroups.TakeLast(7))
        {
            var graded = group.Where(s => s.FinalGrade.HasValue).ToList();

            data.Add(new PerformanceDataDto
            {
                Date = group.Key.ToString("MMM dd"),
                Views = group.Count(),
                Completions = group.Count(s => s.ReviewStatus == ReviewStatus.Completed),
                AverageTime = graded.Any() ? (int)graded.Average(s => s.FinalGrade!.Value) : 0
            });
        }

        return data;
    }

    private List<string> GenerateAssignmentAIRecommendations(Assignment assignment)
    {
        var recommendations = new List<string>();

        var completionRate = assignment.Submissions.Any() ?
            assignment.Submissions.Count(s => s.ReviewStatus == ReviewStatus.Completed) / (double)assignment.Submissions.Count : 0;

        if (completionRate < 0.5)
            recommendations.Add("Low completion rate - consider extending deadline or clarifying instructions");

        var graded = assignment.Submissions.Where(s => s.FinalGrade.HasValue).ToList();
        if (graded.Any())
        {
            var avgGrade = graded.Average(s => s.FinalGrade!.Value);
            if (avgGrade < 70)
                recommendations.Add("Consider providing additional examples or practice opportunities");
        }

        return recommendations.Any() ? recommendations : new List<string> { "Assignment performing as expected" };
    }
}
