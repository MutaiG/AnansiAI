namespace AnansiAI.Api.Models.DTOs;

public class NotificationDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public bool Read { get; set; }
    public string Timestamp { get; set; } = string.Empty;
    public bool ActionRequired { get; set; }
    public string? RelatedEntityId { get; set; }
    public string? RelatedEntityType { get; set; }
    public string Metadata { get; set; } = "{}";
}

public class NotificationSummaryDto
{
    public int TotalCount { get; set; }
    public int UnreadCount { get; set; }
    public int PriorityCount { get; set; }
    public int AICount { get; set; }
    public int StudentCount { get; set; }
    public int ClassCount { get; set; }
    public int ActionRequiredCount { get; set; }
}

public class CreateNotificationRequest
{
    public string? TargetUserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = "info";
    public string Priority { get; set; } = "medium";
    public string Category { get; set; } = "general";
    public bool ActionRequired { get; set; } = false;
    public string? RelatedEntityId { get; set; }
    public string? RelatedEntityType { get; set; }
    public string? Metadata { get; set; }
}

public class NotificationActionRequest
{
    public string Action { get; set; } = string.Empty;
    public string? Notes { get; set; }
}
