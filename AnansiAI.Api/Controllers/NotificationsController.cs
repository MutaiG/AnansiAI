using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AnansiAI.Api.Data;
using AnansiAI.Api.Models.DTOs;
using AnansiAI.Api.Models.Entities;

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

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<Notification>>>> GetNotifications()
    {
        try
        {
            var userId = GetCurrentUserId();
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId || n.UserId == null) // User-specific or global notifications
                .OrderByDescending(n => n.Time)
                .Take(50)
                .ToListAsync();

            return Ok(new ApiResponse<List<Notification>>
            {
                Success = true,
                Data = notifications
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting notifications");
            return Ok(new ApiResponse<List<Notification>>
            {
                Success = false,
                Error = "Failed to get notifications"
            });
        }
    }

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

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        return int.Parse(userIdClaim?.Value ?? "0");
    }
}
