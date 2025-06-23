using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AnansiAI.Api.Data;
using AnansiAI.Api.Models.DTOs;
using AnansiAI.Api.Models.Entities;
using System.Security.Claims;

namespace AnansiAI.Api.Controllers;

[ApiController]
[Route("api/notifications")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly AnansiDbContext _context;
    private readonly ILogger<NotificationsController> _logger;

    public NotificationsController(AnansiDbContext context, ILogger<NotificationsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/notifications
    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<NotificationDto>>>> GetNotifications([FromQuery] string? filter = null, [FromQuery] int page = 1, [FromQuery] int limit = 50)
    {
        try
        {
            var userId = GetCurrentUserId();
            var query = _context.Notifications
                .Where(n => n.UserId == userId || n.UserId == null);

            // Apply filters
            if (!string.IsNullOrEmpty(filter))
            {
                switch (filter.ToLower())
                {
                    case "unread":
                        query = query.Where(n => !n.Read);
                        break;
                    case "priority":
                        query = query.Where(n => n.Priority == NotificationPriority.High || n.Priority == NotificationPriority.Critical);
                        break;
                    case "ai":
                        query = query.Where(n => n.Category == NotificationCategory.AI);
                        break;
                    case "students":
                        query = query.Where(n => n.Category == NotificationCategory.Student);
                        break;
                    case "classes":
                        query = query.Where(n => n.Category == NotificationCategory.Class);
                        break;
                }
            }

            var notifications = await query
                .OrderByDescending(n => n.Time)
                .Skip((page - 1) * limit)
                .Take(limit)
                .Select(n => new NotificationDto
                {
                    Id = n.Id.ToString(),
                    Title = n.Title,
                    Message = n.Message,
                    Type = n.Type.ToString().ToLower(),
                    Priority = n.Priority.ToString().ToLower(),
                    Category = n.Category.ToString().ToLower(),
                    Read = n.Read,
                    Timestamp = n.Time.ToString("yyyy-MM-dd HH:mm:ss"),
                    ActionRequired = n.ActionRequired,
                    RelatedEntityId = n.RelatedEntityId,
                    RelatedEntityType = n.RelatedEntityType,
                    Metadata = n.Metadata ?? "{}"
                })
                .ToListAsync();

            return Ok(new ApiResponse<List<NotificationDto>>
            {
                Success = true,
                Data = notifications
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting notifications for user {UserId}", GetCurrentUserId());
            return Ok(new ApiResponse<List<NotificationDto>>
            {
                Success = false,
                Error = "Failed to get notifications"
            });
        }
    }

    // GET: api/notifications/summary
    [HttpGet("summary")]
    public async Task<ActionResult<ApiResponse<NotificationSummaryDto>>> GetNotificationSummary()
    {
        try
        {
            var userId = GetCurrentUserId();
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId || n.UserId == null)
                .ToListAsync();

            var summary = new NotificationSummaryDto
            {
                TotalCount = notifications.Count,
                UnreadCount = notifications.Count(n => !n.Read),
                PriorityCount = notifications.Count(n => n.Priority == NotificationPriority.High || n.Priority == NotificationPriority.Critical),
                AICount = notifications.Count(n => n.Category == NotificationCategory.AI),
                StudentCount = notifications.Count(n => n.Category == NotificationCategory.Student),
                ClassCount = notifications.Count(n => n.Category == NotificationCategory.Class),
                ActionRequiredCount = notifications.Count(n => n.ActionRequired)
            };

            return Ok(new ApiResponse<NotificationSummaryDto>
            {
                Success = true,
                Data = summary
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting notification summary for user {UserId}", GetCurrentUserId());
            return Ok(new ApiResponse<NotificationSummaryDto>
            {
                Success = false,
                Error = "Failed to get notification summary"
            });
        }
    }

    // PUT: api/notifications/{id}/read
    [HttpPut("{id}/read")]
    public async Task<ActionResult<ApiResponse<object>>> MarkAsRead(int id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.Id == id && (n.UserId == userId || n.UserId == null));

            if (notification == null)
            {
                return Ok(new ApiResponse<object>
                {
                    Success = false,
                    Error = "Notification not found"
                });
            }

            notification.Read = true;
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Notification marked as read"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error marking notification as read");
            return Ok(new ApiResponse<object>
            {
                Success = false,
                Error = "Failed to mark notification as read"
            });
        }
    }

    // PUT: api/notifications/mark-all-read
    [HttpPut("mark-all-read")]
    public async Task<ActionResult<ApiResponse<object>>> MarkAllAsRead()
    {
        try
        {
            var userId = GetCurrentUserId();
            var notifications = await _context.Notifications
                .Where(n => (n.UserId == userId || n.UserId == null) && !n.Read)
                .ToListAsync();

            foreach (var notification in notifications)
            {
                notification.Read = true;
            }

            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = $"{notifications.Count} notifications marked as read"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error marking all notifications as read");
            return Ok(new ApiResponse<object>
            {
                Success = false,
                Error = "Failed to mark all notifications as read"
            });
        }
    }

    // DELETE: api/notifications/{id}
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteNotification(int id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);

            if (notification == null)
            {
                return Ok(new ApiResponse<object>
                {
                    Success = false,
                    Error = "Notification not found"
                });
            }

            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Notification deleted successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting notification {NotificationId}", id);
            return Ok(new ApiResponse<object>
            {
                Success = false,
                Error = "Failed to delete notification"
            });
        }
    }

    // POST: api/notifications/{id}/action
    [HttpPost("{id}/action")]
    public async Task<ActionResult<ApiResponse<object>>> TakeAction(int id, [FromBody] NotificationActionRequest request)
    {
        try
        {
            var userId = GetCurrentUserId();
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.Id == id && (n.UserId == userId || n.UserId == null));

            if (notification == null)
            {
                return Ok(new ApiResponse<object>
                {
                    Success = false,
                    Error = "Notification not found"
                });
            }

            // Mark as read and action taken
            notification.Read = true;
            notification.ActionRequired = false;

            // Log the action taken
            var actionLog = new NotificationAction
            {
                NotificationId = id,
                UserId = userId,
                Action = request.Action,
                Notes = request.Notes,
                Timestamp = DateTime.UtcNow
            };

            _context.NotificationActions.Add(actionLog);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Action recorded successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error taking action on notification {NotificationId}", id);
            return Ok(new ApiResponse<object>
            {
                Success = false,
                Error = "Failed to record action"
            });
        }
    }

    // POST: api/notifications/create
    [HttpPost("create")]
    public async Task<ActionResult<ApiResponse<object>>> CreateNotification([FromBody] CreateNotificationRequest request)
    {
        try
        {
            var userId = GetCurrentUserId();

            var notification = new Notification
            {
                UserId = string.IsNullOrEmpty(request.TargetUserId) ? userId : request.TargetUserId,
                Title = request.Title,
                Message = request.Message,
                Type = Enum.Parse<NotificationType>(request.Type, true),
                Priority = Enum.Parse<NotificationPriority>(request.Priority, true),
                Category = Enum.Parse<NotificationCategory>(request.Category, true),
                ActionRequired = request.ActionRequired,
                RelatedEntityId = request.RelatedEntityId,
                RelatedEntityType = request.RelatedEntityType,
                Metadata = request.Metadata ?? "{}",
                Time = DateTime.UtcNow,
                Read = false
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Notification created successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating notification");
            return Ok(new ApiResponse<object>
            {
                Success = false,
                Error = "Failed to create notification"
            });
        }
    }

    private string GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        return userIdClaim?.Value ?? "";
    }
}
