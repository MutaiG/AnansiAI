using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AnansiAI.Api.Models.Entities;

public class BehaviorLog
{
    public int BehaviorLogId { get; set; }

    [Required]
    public string StudentId { get; set; } = string.Empty; // FK to identity user

    public int LessonId { get; set; }

    [Required, MaxLength(100)]
    public string SessionId { get; set; } = string.Empty;

    public BehaviorActionType ActionType { get; set; }

    [Column(TypeName = "jsonb")]
    public string Details { get; set; } = "{}"; // JSON for detailed behavior data

    [Range(0.0f, 1.0f)]
    public float RiskScore { get; set; } = 0.0f; // AI-calculated risk score

    public bool Flagged { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual AppUser Student { get; set; } = null!;
    public virtual Lesson Lesson { get; set; } = null!;
}

public enum BehaviorActionType
{
    // Learning behaviors
    LessonStarted,
    LessonCompleted,
    LessonAbandoned,
    QuestionAnswered,
    QuestionSkipped,
    
    // Interaction behaviors
    ClickPattern,
    ScrollPattern,
    TimeSpentOnTask,
    FocusLoss,
    FocusReturn,
    
    // Social behaviors
    HelpRequested,
    PeerInteraction,
    TeacherInteraction,
    
    // Risk indicators
    FrustrationDetected,
    ConfusionDetected,
    DisengagementDetected,
    ExcessiveGuessing,
    
    // Positive indicators
    FlowStateDetected,
    MasteryAchieved,
    ImprovementShown,
    HelpProvided
}

public class TwinInteraction
{
    public int InteractionId { get; set; }

    [Required]
    public string StudentId { get; set; } = string.Empty; // FK to identity user

    public int? LessonId { get; set; } // Optional - can be general conversation

    [Required, MaxLength(100)]
    public string SessionId { get; set; } = string.Empty;

    public InteractionType InteractionType { get; set; }

    [Column(TypeName = "jsonb")]
    public string StudentMessage { get; set; } = "{}"; // JSON for message content

    [Column(TypeName = "jsonb")]
    public string TwinResponse { get; set; } = "{}"; // JSON for AI response

    [Column(TypeName = "jsonb")]
    public string ContextData { get; set; } = "{}"; // JSON for context information

    public float SentimentScore { get; set; } = 0.0f; // AI-analyzed sentiment

    public bool Flagged { get; set; } = false;

    [MaxLength(500)]
    public string? FlagReason { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual AppUser Student { get; set; } = null!;
    public virtual Lesson? Lesson { get; set; }
}

public enum InteractionType
{
    QuestionAnswering,
    ConceptExplanation,
    MotivationalSupport,
    BehaviorGuidance,
    GeneralConversation,
    EmergencySupport,
    LearningAssessment,
    PersonalityAnalysis
}
