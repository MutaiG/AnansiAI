import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Brain,
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  Play,
  CheckCircle,
  Calendar,
  Bell,
  Settings,
  LogOut,
  Target,
  Users,
  MessageSquare,
  BarChart3,
  Star,
  GraduationCap,
  Activity,
  AlertTriangle,
  Lightbulb,
  Smile,
  Heart,
  Zap,
  Filter,
  Search,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import apiWithFallback from "@/services/apiWithFallback";
import { autoApiService } from "@/services/cloudApiService";

// Import AI components directly
import { Suspense, lazy } from "react";
import BehaviorAnalytics from "@/components/BehaviorAnalytics";

const LazyAITwinChat = lazy(() =>
  import("@/components/AITwinChat").catch(() => ({
    default: () => (
      <div className="p-4 text-center">
        <Brain className="w-8 h-8 mx-auto mb-2 text-blue-600" />
        <p className="text-gray-600">AI Twin Chat temporarily unavailable</p>
      </div>
    ),
  })),
);

const LazyStudentProfileManager = lazy(() =>
  import("@/components/StudentProfileManager").catch(() => ({
    default: () => (
      <div className="p-8 text-center">
        <div className="max-w-md mx-auto">
          <Settings className="w-12 h-12 mx-auto mb-4 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Profile Manager
          </h3>
          <p className="text-gray-600 mb-6">
            The advanced profile manager is temporarily unavailable. Basic
            profile information is shown below.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 text-left">
            <h4 className="font-medium text-gray-900 mb-3">Current Profile</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Name:</span> Alex Johnson
              </div>
              <div>
                <span className="font-medium">Student ID:</span> STU001
              </div>
              <div>
                <span className="font-medium">Grade:</span> 10th Grade
              </div>
              <div>
                <span className="font-medium">Learning Style:</span> Visual
              </div>
              <div>
                <span className="font-medium">Current Mood:</span> Focused
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <h5 className="font-medium text-gray-900 mb-2">
                Privacy Settings
              </h5>
              <div className="text-sm text-gray-600">
                <div>✓ Behavior tracking enabled</div>
                <div>✓ AI personalization active</div>
                <div>✓ Educational data sharing only</div>
              </div>
            </div>
          </div>

          <Button className="mt-6" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    ),
  })),
);

// Import comprehensive types
import {
  StudentProfile,
  Subject,
  Level,
  Lesson,
  Assignment,
  Submission,
  BehaviorLog,
  Mood,
  LearningStyle,
  LearningModality,
} from "@/types/education";

interface DashboardCourse {
  id: string;
  title: string;
  subject: Subject;
  progress: number;
  nextLesson?: Lesson;
  instructor: string;
  totalLessons: number;
  completedLessons: number;
  upcomingAssignments: Assignment[];
  recentGrade?: number;
  aiRecommended?: boolean;
}

// Backend DTO interfaces to match API responses
interface StudentDashboardData {
  profile: {
    id: string;
    appUserId: string;
    personalityTraits: {
      openness: number;
      conscientiousness: number;
      extraversion: number;
      agreeableness: number;
      neuroticism: number;
    };
    learningPreferences: {
      preferredStyle: string;
      preferredModalities: string[];
      difficultyPreference: string;
      pacePreference: string;
      feedbackFrequency: string;
    };
    emotionalState: {
      currentMood: string;
      stressLevel: number;
      confidenceLevel: number;
      motivationLevel: number;
      lastUpdated: string;
    };
    aiPersonalityAnalysis: {
      dominantTraits: string[];
      learningArchetype: string;
      strengthAreas: string[];
      growthAreas: string[];
      recommendedActivities: string[];
      confidenceScore: number;
      lastAnalysis: string;
    };
    privacySettings: {
      shareLearningData: boolean;
      shareBehaviorAnalytics: boolean;
      allowPersonalization: boolean;
      showInLeaderboards: boolean;
      dataRetentionPreference: string;
    };
  };
  enrolledCourses: Array<{
    id: string;
    title: string;
    instructor: string;
    progress: number;
    completedLessons: number;
    totalLessons: number;
    recentGrade?: number;
    aiRecommended: boolean;
    subject: {
      subjectId: number;
      name: string;
      description: string;
    };
    upcomingAssignments: Array<{
      id: string;
      title: string;
      dueDate: string;
      priority: string;
      status: string;
    }>;
  }>;
  behaviorSummary: {
    currentMood: string;
    riskLevel: string;
    engagementScore: number;
    focusScore: number;
    recentActivities: string[];
    lastActivity: string;
  };
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    earnedDate: string;
    iconUrl: string;
    isNew: boolean;
  }>;
  notifications: Array<{
    id: string;
    type: string;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    priority: string;
  }>;
}

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  // New state for enhanced functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    progress: "all", // all, completed, in-progress, not-started
    subject: "all", // all, math, science, english, etc.
    difficulty: "all", // all, beginner, intermediate, advanced
  });
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [courseAnalyticsOpen, setCourseAnalyticsOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState<any[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [notificationDetailOpen, setNotificationDetailOpen] = useState(false);

  // Auto-clear action feedback after 3 seconds
  useEffect(() => {
    if (lastAction) {
      const timer = setTimeout(() => setLastAction(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastAction]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [dashboardData, setDashboardData] =
    useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        // Force cloud mode check - bypass all network calls in cloud environments
        const isCloudMode =
          import.meta.env.VITE_FORCE_CLOUD_MODE === "true" ||
          window.location.hostname.includes("fly.dev") ||
          window.location.hostname.includes("builder.codes");

        if (isCloudMode) {
          // Directly use mock data in cloud environments - no network calls
          const { MockApiService } = await import("@/services/mockData");
          const response = await MockApiService.getStudentDashboard();

          if (response.success && response.data) {
            setDashboardData(response.data);
            setNotificationsList(response.data.notifications);
            setLoading(false);
            return;
          }
        }

        // Use cloud API service if available, otherwise use fallback API
        const apiService = autoApiService || apiWithFallback;
        const response = await apiService.getStudentDashboard();

        if (response.success && response.data) {
          setDashboardData(response.data);
          setNotificationsList(response.data.notifications);
        } else {
          console.error("Failed to load dashboard data:", response.error);
          // Fallback to mock data if API fails
          const mockData: StudentDashboardData = {
            profile: {
              id: "student_001",
              appUserId: "user_001",
              personalityTraits: {
                openness: 0.75,
                conscientiousness: 0.82,
                extraversion: 0.65,
                agreeableness: 0.78,
                neuroticism: 0.35,
              },
              learningPreferences: {
                preferredStyle: "Visual",
                preferredModalities: ["Interactive", "Visual"],
                difficultyPreference: "adaptive",
                pacePreference: "moderate",
                feedbackFrequency: "immediate",
              },
              emotionalState: {
                currentMood: "Focused",
                stressLevel: 0.3,
                confidenceLevel: 0.75,
                motivationLevel: 0.8,
                lastUpdated: new Date().toISOString(),
              },
              aiPersonalityAnalysis: {
                dominantTraits: ["analytical", "creative", "collaborative"],
                learningArchetype: "The Explorer",
                strengthAreas: [
                  "problem-solving",
                  "visual learning",
                  "pattern recognition",
                ],
                growthAreas: ["time management", "verbal communication"],
                recommendedActivities: [
                  "Visual learning materials",
                  "Interactive problem-solving",
                  "Collaborative projects",
                  "Regular feedback loops",
                ],
                confidenceScore: 0.85,
                lastAnalysis: new Date().toISOString(),
              },
              privacySettings: {
                shareLearningData: true,
                shareBehaviorAnalytics: false,
                allowPersonalization: true,
                showInLeaderboards: true,
                dataRetentionPreference: "standard",
              },
            },
            enrolledCourses: [
              {
                id: "course_001",
                title: "Advanced Mathematics",
                instructor: "Dr. Sarah Chen",
                progress: 75,
                completedLessons: 36,
                totalLessons: 48,
                recentGrade: 94,
                aiRecommended: true,
                subject: {
                  subjectId: 1,
                  name: "Mathematics",
                  description: "Advanced mathematical concepts",
                },
                upcomingAssignments: [
                  {
                    id: "assign_001",
                    title: "Calculus Problem Set",
                    dueDate: new Date(
                      Date.now() + 3 * 24 * 60 * 60 * 1000,
                    ).toISOString(),
                    priority: "high",
                    status: "pending",
                  },
                ],
              },
              {
                id: "course_002",
                title: "Biology Advanced Placement",
                instructor: "Prof. Michael Torres",
                progress: 68,
                completedLessons: 35,
                totalLessons: 52,
                recentGrade: 89,
                aiRecommended: false,
                subject: {
                  subjectId: 2,
                  name: "Biology",
                  description: "Advanced placement biology",
                },
                upcomingAssignments: [
                  {
                    id: "assign_002",
                    title: "Lab Report",
                    dueDate: new Date(
                      Date.now() + 5 * 24 * 60 * 60 * 1000,
                    ).toISOString(),
                    priority: "medium",
                    status: "pending",
                  },
                ],
              },
              {
                id: "course_003",
                title: "World History Honors",
                instructor: "Ms. Emily Rodriguez",
                progress: 82,
                completedLessons: 33,
                totalLessons: 40,
                recentGrade: 96,
                aiRecommended: false,
                subject: {
                  subjectId: 3,
                  name: "History",
                  description: "World history honors course",
                },
                upcomingAssignments: [],
              },
            ],
            behaviorSummary: {
              currentMood: "Focused",
              riskLevel: "low",
              engagementScore: 0.85,
              focusScore: 0.78,
              recentActivities: [
                "Completed Math Lesson 12",
                "Participated in Biology Discussion",
                "Submitted History Assignment",
              ],
              lastActivity: new Date().toISOString(),
            },
            achievements: [
              {
                id: "ach_001",
                title: "Math Wizard",
                description:
                  "Completed 10 consecutive math assignments with 90%+ scores",
                category: "Academic Excellence",
                earnedDate: new Date(
                  Date.now() - 2 * 24 * 60 * 60 * 1000,
                ).toISOString(),
                iconUrl: "",
                isNew: false,
              },
              {
                id: "ach_002",
                title: "Study Streak",
                description:
                  "Maintained daily study habit for 7 consecutive days",
                category: "Consistency",
                earnedDate: new Date(
                  Date.now() - 1 * 24 * 60 * 60 * 1000,
                ).toISOString(),
                iconUrl: "",
                isNew: true,
              },
              {
                id: "ach_003",
                title: "Biology Expert",
                description:
                  "Scored above 90% on 5 consecutive biology quizzes",
                category: "Subject Mastery",
                earnedDate: new Date(
                  Date.now() - 3 * 24 * 60 * 60 * 1000,
                ).toISOString(),
                iconUrl: "",
                isNew: false,
              },
            ],
            notifications: [
              {
                id: "notif_001",
                type: "ai_insight",
                title: "AI Learning Recommendation",
                message:
                  "Based on your recent performance, I recommend focusing on integration techniques in calculus. You're showing great progress!",
                timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                read: false,
                priority: "medium",
              },
              {
                id: "notif_002",
                type: "assignment",
                title: "Math Assignment Due Soon",
                message: "Your calculus homework is due in 6 hours",
                timestamp: new Date(
                  Date.now() - 2 * 60 * 60 * 1000,
                ).toISOString(),
                read: false,
                priority: "high",
              },
              {
                id: "notif_003",
                type: "grade",
                title: "Biology Quiz Graded",
                message:
                  "Great work! You scored 94% on your latest biology quiz",
                timestamp: new Date(
                  Date.now() - 24 * 60 * 60 * 1000,
                ).toISOString(),
                read: false,
                priority: "medium",
              },
            ],
          };

          setDashboardData(mockData);
          setNotificationsList(mockData.notifications);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("anansi_token");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  // Enhanced functionality handlers
  const handleContinueLearning = (course: any) => {
    setLastAction(`Continuing ${course.title}`);
    console.log("Navigating to course:", course.title);

    // Navigate to lesson content with course data
    navigate("/lesson-content", {
      state: {
        course: course,
        lessonId: `${course.id}_lesson_${course.completedLessons + 1}`,
      },
    });
  };

  const handleCourseAnalytics = (course: any) => {
    setSelectedCourse(course);
    setCourseAnalyticsOpen(true);
    setLastAction(`Viewing analytics for ${course.title}`);
  };

  const handleSearch = () => {
    setShowSearchInput(!showSearchInput);
    if (!showSearchInput) {
      setLastAction("Search mode activated");
    } else {
      setSearchQuery("");
      setLastAction("Search cleared");
    }
  };

  const handleFilter = () => {
    setFilterDialogOpen(true);
    setLastAction("Opened filter options");
  };

  const applyFilters = () => {
    setFilterDialogOpen(false);
    setLastAction("Filters applied");
  };

  const resetFilters = () => {
    setSelectedFilters({
      progress: "all",
      subject: "all",
      difficulty: "all",
    });
    setLastAction("Filters reset");
  };

  // Filter courses based on search and filters
  const getFilteredCourses = () => {
    let filtered = enrolledCourses;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.subject.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Apply progress filter
    if (selectedFilters.progress !== "all") {
      filtered = filtered.filter((course) => {
        if (selectedFilters.progress === "completed")
          return course.progress === 100;
        if (selectedFilters.progress === "in-progress")
          return course.progress > 0 && course.progress < 100;
        if (selectedFilters.progress === "not-started")
          return course.progress === 0;
        return true;
      });
    }

    // Apply subject filter (simplified for demo)
    if (selectedFilters.subject !== "all") {
      filtered = filtered.filter((course) =>
        course.subject.name
          .toLowerCase()
          .includes(selectedFilters.subject.toLowerCase()),
      );
    }

    return filtered;
  };

  // Notification viewing - shows content before marking as read
  const viewNotification = (notification: any) => {
    setSelectedNotification(notification);
    setNotificationDetailOpen(true);
    setShowNotifications(false); // Close the dropdown
  };

  // Mark notification as read after viewing
  const markNotificationAsReadAfterViewing = async (notificationId: string) => {
    const notification = notificationsList.find((n) => n.id === notificationId);

    try {
      // Direct cloud mode check
      const isCloudMode =
        import.meta.env.VITE_FORCE_CLOUD_MODE === "true" ||
        window.location.hostname.includes("fly.dev") ||
        window.location.hostname.includes("builder.codes");

      if (isCloudMode) {
        const { MockApiService } = await import("@/services/mockData");
        const response =
          await MockApiService.markNotificationAsRead(notificationId);

        if (response.success) {
          setNotificationsList((prev) =>
            prev.map((notification) =>
              notification.id === notificationId
                ? { ...notification, read: true }
                : notification,
            ),
          );

          if (notification && !notification.read) {
            setLastAction(`Read: ${notification.title}`);
          }
        }

        setNotificationDetailOpen(false);
        setSelectedNotification(null);
        return;
      }

      const apiService = autoApiService || apiWithFallback;
      const response = await apiService.markNotificationAsRead(notificationId);

      if (response.success) {
        setNotificationsList((prev) =>
          prev.map((notification) =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification,
          ),
        );

        if (notification && !notification.read) {
          setLastAction(`Read: ${notification.title}`);
        }
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      setNotificationsList((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification,
        ),
      );
    }

    setNotificationDetailOpen(false);
    setSelectedNotification(null);
  };

  // Mark notification as unread
  const markNotificationAsUnread = async (notificationId: string) => {
    const notification = notificationsList.find((n) => n.id === notificationId);

    try {
      // Direct cloud mode check
      const isCloudMode =
        import.meta.env.VITE_FORCE_CLOUD_MODE === "true" ||
        window.location.hostname.includes("fly.dev") ||
        window.location.hostname.includes("builder.codes");

      if (isCloudMode) {
        // Simulate API call with mock service
        setNotificationsList((prev) =>
          prev.map((notification) =>
            notification.id === notificationId
              ? { ...notification, read: false }
              : notification,
          ),
        );

        if (notification && notification.read) {
          setLastAction(`Marked as unread: ${notification.title}`);
        }

        setNotificationDetailOpen(false);
        setSelectedNotification(null);
        return;
      }

      // For real API calls (local development)
      const apiService = autoApiService || apiWithFallback;
      // Note: Backend would need to implement markNotificationAsUnread endpoint
      // For now, just update UI
      setNotificationsList((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: false }
            : notification,
        ),
      );

      if (notification && notification.read) {
        setLastAction(`Marked as unread: ${notification.title}`);
      }

      setNotificationDetailOpen(false);
      setSelectedNotification(null);
    } catch (error) {
      console.error("Failed to mark notification as unread:", error);
      // Still update UI for better UX
      setNotificationsList((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: false }
            : notification,
        ),
      );
    }
  };

  // Notification handling
  const markNotificationAsRead = async (notificationId: string) => {
    // Find the notification to get its title for feedback
    const notification = notificationsList.find((n) => n.id === notificationId);

    try {
      // Call API to mark notification as read
      const response =
        await apiWithFallback.markNotificationAsRead(notificationId);

      if (response.success) {
        setNotificationsList((prev) =>
          prev.map((notification) =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification,
          ),
        );

        if (notification && !notification.read) {
          setLastAction(`Read: ${notification.title}`);

          // Auto-close dropdown after a short delay if all notifications are read
          setTimeout(() => {
            const unreadCount = notificationsList.filter((n) =>
              n.id === notificationId ? true : !n.read,
            ).length;
            if (unreadCount === 0) {
              setShowNotifications(false);
            }
          }, 1000);
        }
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      // Still update UI for better UX
      setNotificationsList((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification,
        ),
      );
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      // Direct cloud mode check
      const isCloudMode =
        import.meta.env.VITE_FORCE_CLOUD_MODE === "true" ||
        window.location.hostname.includes("fly.dev") ||
        window.location.hostname.includes("builder.codes");

      if (isCloudMode) {
        const { MockApiService } = await import("@/services/mockData");
        const response = await MockApiService.markAllNotificationsAsRead();

        if (response.success) {
          setNotificationsList((prev) =>
            prev.map((notification) => ({ ...notification, read: true })),
          );
          setLastAction("All notifications marked as read");

          setTimeout(() => {
            setShowNotifications(false);
          }, 1500);
        }
        return;
      }

      // Call API to mark all notifications as read
      const apiService = autoApiService || apiWithFallback;
      const response = await apiService.markAllNotificationsAsRead();

      if (response.success) {
        setNotificationsList((prev) =>
          prev.map((notification) => ({ ...notification, read: true })),
        );
        setLastAction("All notifications marked as read");

        // Auto-close dropdown after marking all as read
        setTimeout(() => {
          setShowNotifications(false);
        }, 1500);
      }
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      // Still update UI for better UX
      setNotificationsList((prev) =>
        prev.map((notification) => ({ ...notification, read: true })),
      );
      setLastAction("All notifications marked as read");
    }
  };

  const getMoodEmoji = (mood: Mood) => {
    switch (mood) {
      case Mood.Excited:
        return "🤩";
      case Mood.Happy:
        return "😊";
      case Mood.Neutral:
        return "😐";
      case Mood.Focused:
        return "🎯";
      case Mood.Stressed:
        return "😰";
      case Mood.Tired:
        return "😴";
      case Mood.Frustrated:
        return "😤";
      case Mood.Anxious:
        return "😨";
      default:
        return "😐";
    }
  };

  const getRiskLevelColor = (level: "low" | "medium" | "high") => {
    switch (level) {
      case "low":
        return "text-green-600 bg-green-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "high":
        return "text-red-600 bg-red-50";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "ai_insight":
        return <Brain className="w-4 h-4" />;
      case "assignment":
        return <BookOpen className="w-4 h-4" />;
      case "grade":
        return <Award className="w-4 h-4" />;
      case "system":
        return <Settings className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            Loading your personalized dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load dashboard data</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const {
    profile,
    enrolledCourses,
    behaviorSummary,
    achievements,
    notifications,
  } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-8 h-8 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">AnansiAI</h1>
              </div>
              <div className="hidden md:flex flex-col">
                <div className="text-sm text-gray-600">
                  Welcome back, Alex Johnson
                </div>
                {lastAction && (
                  <div className="text-xs text-green-600 animate-pulse">
                    ✓ {lastAction}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Mood Indicator */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                <span className="text-lg">
                  {getMoodEmoji(behaviorSummary.currentMood)}
                </span>
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {behaviorSummary.currentMood}
                </span>
              </div>

              {/* Notifications */}
              <DropdownMenu
                open={showNotifications}
                onOpenChange={setShowNotifications}
              >
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="w-5 h-5" />
                    {notificationsList.filter((n) => !n.read).length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {notificationsList.filter((n) => !n.read).length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="flex items-center justify-between p-3 border-b">
                    <span className="font-medium text-sm">Notifications</span>
                    {notificationsList.some((n) => !n.read) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllNotificationsAsRead}
                        className="text-xs h-auto p-1 text-blue-600 hover:text-blue-700"
                      >
                        Mark all read
                      </Button>
                    )}
                  </div>
                  {notificationsList.slice(0, 5).map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`p-3 cursor-pointer transition-all duration-200 ${
                        !notification.read
                          ? "bg-blue-50 hover:bg-blue-100 border-l-2 border-blue-400"
                          : "hover:bg-gray-50 opacity-75"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        viewNotification(notification);
                      }}
                    >
                      <div className="flex items-start gap-3 w-full">
                        <div className="p-1.5 rounded-lg bg-blue-50">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(
                              notification.timestamp,
                            ).toLocaleTimeString()}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-1"></div>
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                  {notificationsList.length === 0 && (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No notifications
                    </div>
                  )}
                  {notificationsList.length > 0 &&
                    notificationsList.filter((n) => !n.read).length === 0 && (
                      <div className="p-4 text-center text-gray-500 text-sm border-t">
                        All caught up! 🎉
                      </div>
                    )}
                  {notificationsList.length > 5 && (
                    <div className="p-3 text-center border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-blue-600 hover:text-blue-700"
                        onClick={() => {
                          setLastAction("Opened all notifications");
                          setShowNotifications(false);
                        }}
                      >
                        View all notifications ({notificationsList.length})
                      </Button>
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* AI Chat Toggle */}
              <Button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`${isChatOpen ? "bg-blue-600" : "bg-blue-500"} hover:bg-blue-700`}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                AI Twin
              </Button>

              {/* Profile Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt="Student" />
                      <AvatarFallback>AJ</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Alex Johnson</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="hover:bg-green-50 transition-colors cursor-pointer"
                    onClick={() => {
                      console.log("Opening profile from dropdown...");
                      setLastAction("Opened Profile Settings");
                      setIsProfileOpen(true);
                    }}
                  >
                    <Settings className="w-4 h-4 mr-2 text-green-600" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs
              value={selectedTab}
              onValueChange={setSelectedTab}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-2xl font-bold text-gray-900">
                            {enrolledCourses.length}
                          </p>
                          <p className="text-sm text-gray-600">
                            Active Courses
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-2xl font-bold text-gray-900">
                            {Math.round(
                              enrolledCourses.reduce(
                                (sum, course) => sum + course.progress,
                                0,
                              ) / enrolledCourses.length,
                            )}
                            %
                          </p>
                          <p className="text-sm text-gray-600">Avg Progress</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Target className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-2xl font-bold text-gray-900">
                            {Math.round(behaviorSummary.focusScore * 100)}%
                          </p>
                          <p className="text-sm text-gray-600">Focus Level</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <Award className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-2xl font-bold text-gray-900">
                            {achievements.length}
                          </p>
                          <p className="text-sm text-gray-600">Achievements</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Courses */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Your Courses
                    </CardTitle>
                    <CardDescription>
                      Continue your learning journey
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {enrolledCourses.map((course) => (
                        <div
                          key={course.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {course.title}
                            </h3>
                            <div className="flex gap-1">
                              {course.teacherCreated && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-blue-100 text-blue-800"
                                >
                                  <GraduationCap className="w-3 h-3 mr-1" />
                                  Teacher Created
                                </Badge>
                              )}
                              <Badge
                                variant={
                                  course.aiRecommended ? "default" : "outline"
                                }
                                className="text-xs"
                              >
                                {course.aiRecommended
                                  ? "AI Recommended"
                                  : course.subject.name}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* AI Insights */}
                <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-700">
                      <Brain className="w-5 h-5" />
                      AI Learning Insights
                    </CardTitle>
                    <CardDescription>
                      Personalized recommendations based on your learning
                      patterns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-white rounded-lg border border-purple-100">
                        <div className="flex items-start gap-3">
                          <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-900">
                              Study Recommendation
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Based on your learning style (
                              {profile.learningPreferences.preferredStyle}), I
                              recommend focusing on visual aids for your
                              upcoming calculus topics. Your recent performance
                              shows 15% improvement with visual materials.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-white rounded-lg border border-purple-100">
                        <div className="flex items-start gap-3">
                          <Heart className="w-5 h-5 text-red-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-900">
                              Emotional Check-in
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              You're showing great focus today! Your stress
                              levels are low (
                              {Math.round(
                                profile.emotionalState.stressLevel * 100,
                              )}
                              %), which is perfect for tackling challenging
                              concepts. Keep up the excellent work!
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="courses" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Your Courses
                    </h2>
                    <p className="text-gray-600">
                      Manage your learning journey
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleFilter}
                      className="hover:bg-blue-50 hover:border-blue-200 transition-colors"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSearch}
                      className={`transition-colors ${showSearchInput ? "bg-green-50 border-green-200" : "hover:bg-green-50 hover:border-green-200"}`}
                    >
                      <Search className="w-4 h-4 mr-2" />
                      {showSearchInput ? "Hide Search" : "Search"}
                    </Button>
                  </div>
                </div>

                {/* Search Input - appears when search is activated */}
                {showSearchInput && (
                  <div className="mb-6">
                    <div className="relative max-w-md">
                      <input
                        type="text"
                        placeholder="Search courses, instructors, subjects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        autoFocus
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    {searchQuery && (
                      <p className="text-sm text-gray-600 mt-2">
                        Showing {getFilteredCourses().length} of{" "}
                        {enrolledCourses.length} courses
                      </p>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {getFilteredCourses().map((course) => (
                    <Card
                      key={course.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {course.title}
                              {course.aiRecommended && (
                                <Badge className="bg-purple-100 text-purple-700">
                                  <Brain className="w-3 h-3 mr-1" />
                                  Recommended
                                </Badge>
                              )}
                            </CardTitle>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div>{course.instructor}</div>
                              {course.teacherCreated && course.schedule && (
                                <div className="flex items-center gap-1 text-xs text-blue-600">
                                  <Calendar className="w-3 h-3" />
                                  {course.schedule}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            {course.recentGrade && (
                              <div className="text-2xl font-bold text-green-600">
                                {course.recentGrade}%
                              </div>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Progress</span>
                              <span>{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>

                          <div className="flex justify-between text-sm text-gray-600">
                            <span>
                              Lessons: {course.completedLessons}/
                              {course.totalLessons}
                            </span>
                            <span>
                              Assignments: {course.upcomingAssignments.length}{" "}
                              pending
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1 hover:bg-blue-700 transition-colors"
                              onClick={() => handleContinueLearning(course)}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Continue Learning
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCourseAnalytics(course)}
                              className="hover:bg-purple-50 hover:border-purple-200 transition-colors"
                              title="View Course Analytics"
                            >
                              <BarChart3 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setLastAction(
                                  `Opened ${course.title} discussion`,
                                );
                                navigate("/course-discussion", {
                                  state: { course },
                                });
                              }}
                              className="hover:bg-green-50 hover:border-green-200 transition-colors"
                              title="Join Discussion"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <BehaviorAnalytics
                  studentId={dashboardData.profile.id}
                  currentMood={dashboardData.behaviorSummary.currentMood}
                  riskScore={
                    dashboardData.behaviorSummary.riskLevel === "low"
                      ? 0.2
                      : dashboardData.behaviorSummary.riskLevel === "medium"
                        ? 0.5
                        : 0.8
                  }
                  behaviorLogs={[]}
                  analytics={{
                    studentId: dashboardData.profile.id,
                    overallProgress: Math.round(
                      enrolledCourses.reduce(
                        (sum, course) => sum + course.progress,
                        0,
                      ) / enrolledCourses.length,
                    ),
                    subjectProgress: enrolledCourses.map((course) => ({
                      subjectId: parseInt(course.id.replace("course_", "")),
                      subjectName: course.subject.name,
                      progress: course.progress,
                      grade: "A-",
                      completedLessons: course.completedLessons,
                      totalLessons: course.totalLessons,
                      averageScore: course.recentGrade || 85,
                      timeSpent: course.completedLessons * 1.5,
                      lastActivity: new Date(),
                    })),
                    strengths: [
                      "problem-solving",
                      "visual learning",
                      "analytical thinking",
                    ],
                    improvementAreas: [
                      "time management",
                      "note-taking",
                      "verbal communication",
                    ],
                    recommendedActions: [
                      {
                        type: "practice",
                        title: "Complete Calculus Practice Set",
                        description:
                          "Focus on integration techniques based on your recent performance",
                        priority: "high",
                        estimatedTime: 30,
                        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
                      },
                      {
                        type: "review",
                        title: "Review Biology Cell Structure",
                        description:
                          "Strengthen understanding of cellular components",
                        priority: "medium",
                        estimatedTime: 20,
                      },
                      {
                        type: "break",
                        title: "Take a Short Break",
                        description:
                          "You've been focused for a while. A 10-minute break will help",
                        priority: "medium",
                        estimatedTime: 10,
                      },
                    ],
                    riskFactors: [],
                    achievements: achievements,
                    lastUpdated: new Date(),
                  }}
                  onRiskDetected={(risk) => {
                    console.log("Risk detected:", risk);
                  }}
                />
              </TabsContent>

              <TabsContent value="achievements" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Achievements
                    </h2>
                    <p className="text-gray-600">
                      Your learning milestones and accomplishments
                    </p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-700">
                    Total Achievements: {achievements.length}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement) => (
                    <Card
                      key={achievement.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-yellow-100 rounded-lg">
                            <Award className="w-6 h-6 text-yellow-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {achievement.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {achievement.description}
                            </p>
                            <div className="flex items-center justify-between mt-3">
                              <Badge variant="outline">
                                {achievement.category}
                              </Badge>
                              <div className="text-right">
                                <p className="text-xs text-gray-500">
                                  {new Date(
                                    achievement.earnedDate,
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      time: "9:00 AM",
                      subject: "Advanced Math",
                      type: "Class",
                    },
                    { time: "11:00 AM", subject: "Biology Lab", type: "Lab" },
                    {
                      time: "2:00 PM",
                      subject: "History Essay",
                      type: "Assignment",
                    },
                    {
                      time: "4:00 PM",
                      subject: "AI Study Session",
                      type: "AI Twin",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.subject}</p>
                        <p className="text-xs text-gray-600">
                          {item.time} • {item.type}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Wellness Check
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Risk Level</span>
                    <Badge
                      className={getRiskLevelColor(behaviorSummary.riskLevel)}
                    >
                      {behaviorSummary.riskLevel.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Focus</span>
                      <span>
                        {Math.round(behaviorSummary.focusScore * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={behaviorSummary.focusScore * 100}
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Engagement</span>
                      <span>
                        {Math.round(behaviorSummary.engagementScore * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={behaviorSummary.engagementScore * 100}
                      className="h-2"
                    />
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">
                      <Smile className="w-4 h-4 inline mr-1" />
                      You're doing great! Keep up the excellent work.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => setIsChatOpen(true)}
                  className="w-full justify-start hover:bg-blue-50 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat with AI Twin
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start hover:bg-green-50 hover:border-green-200 transition-colors"
                  onClick={() => {
                    console.log("Opening profile dialog...");
                    setLastAction("Opened Profile Manager");
                    setIsProfileOpen(true);
                  }}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Profile
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start hover:bg-purple-50 hover:border-purple-200 transition-colors"
                  onClick={() => {
                    console.log("Switching to analytics tab...");
                    setSelectedTab("analytics");
                  }}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Twin Chat Overlay */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-end p-4">
          <div className="w-full max-w-md h-[600px] bg-white rounded-lg shadow-2xl">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold">AI Twin Chat</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsChatOpen(false)}
                >
                  ×
                </Button>
              </div>
              <div className="flex-1">
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center p-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></div>
                      <span>Loading AI Chat...</span>
                    </div>
                  }
                >
                  <LazyAITwinChat
                    studentId={dashboardData.profile.id}
                    emotionalState={dashboardData.behaviorSummary.currentMood}
                    currentLessonId={undefined}
                    onInteractionLogged={(interaction) => {
                      console.log("AI interaction logged:", interaction);
                    }}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Manager Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              Manage Your Profile
            </DialogTitle>
            <DialogDescription>
              Customize your learning preferences, privacy settings, and AI
              personalization
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <Suspense
              fallback={
                <div className="flex items-center justify-center p-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <span className="text-gray-600">
                      Loading Profile Manager...
                    </span>
                  </div>
                </div>
              }
            >
              <LazyStudentProfileManager
                profile={dashboardData.profile}
                privacySettings={dashboardData.profile.privacySettings}
                onProfileUpdate={(updates) => {
                  console.log("Profile updated:", updates);
                  // In a real app, this would update the backend
                  alert(
                    "Profile updated successfully! Changes: " +
                      JSON.stringify(updates, null, 2),
                  );
                }}
                onPrivacyUpdate={(updates) => {
                  console.log("Privacy updated:", updates);
                  // In a real app, this would update the backend
                  alert(
                    "Privacy settings updated! Changes: " +
                      JSON.stringify(updates, null, 2),
                  );
                }}
                isMinor={false}
              />
            </Suspense>
          </div>
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Filter Courses</DialogTitle>
            <DialogDescription>
              Customize how you view your courses
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Progress Status
              </label>
              <select
                value={selectedFilters.progress}
                onChange={(e) =>
                  setSelectedFilters({
                    ...selectedFilters,
                    progress: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Courses</option>
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <select
                value={selectedFilters.subject}
                onChange={(e) =>
                  setSelectedFilters({
                    ...selectedFilters,
                    subject: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Subjects</option>
                <option value="math">Mathematics</option>
                <option value="science">Science</option>
                <option value="english">English</option>
                <option value="history">History</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={selectedFilters.difficulty}
                onChange={(e) =>
                  setSelectedFilters({
                    ...selectedFilters,
                    difficulty: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <Button onClick={resetFilters} variant="outline" className="flex-1">
              Reset
            </Button>
            <Button onClick={applyFilters} className="flex-1">
              Apply Filters
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Course Analytics Dialog */}
      <Dialog open={courseAnalyticsOpen} onOpenChange={setCourseAnalyticsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              {selectedCourse?.title} - Course Analytics
            </DialogTitle>
            <DialogDescription>
              Detailed performance and progress analytics for this course
            </DialogDescription>
          </DialogHeader>

          {selectedCourse && (
            <div className="space-y-6">
              {/* Course Overview Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedCourse.progress}%
                    </div>
                    <div className="text-sm text-gray-600">Progress</div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {selectedCourse.recentGrade || "N/A"}
                    </div>
                    <div className="text-sm text-gray-600">Latest Grade</div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {selectedCourse.completedLessons}
                    </div>
                    <div className="text-sm text-gray-600">Lessons Done</div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {selectedCourse.upcomingAssignments.length}
                    </div>
                    <div className="text-sm text-gray-600">Pending Tasks</div>
                  </div>
                </Card>
              </div>

              {/* Upcoming Assignments */}
              <Card className="p-4">
                <h4 className="font-medium mb-3">Upcoming Assignments</h4>
                <div className="space-y-2">
                  {selectedCourse.upcomingAssignments.map(
                    (assignment: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <div>
                          <div className="font-medium text-sm">
                            {assignment.title}
                          </div>
                          <div className="text-xs text-gray-600">
                            Due: {assignment.dueDate.toLocaleDateString()}
                          </div>
                        </div>
                        <Badge
                          variant={
                            assignment.priority === "high"
                              ? "destructive"
                              : "default"
                          }
                        >
                          {assignment.priority}
                        </Badge>
                      </div>
                    ),
                  )}
                  {selectedCourse.upcomingAssignments.length === 0 && (
                    <div className="text-center text-gray-500 py-4">
                      No pending assignments
                    </div>
                  )}
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    handleContinueLearning(selectedCourse);
                    setCourseAnalyticsOpen(false);
                  }}
                  className="flex-1"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Continue Learning
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setLastAction(`Opened ${selectedCourse.title} discussion`);
                    setCourseAnalyticsOpen(false);
                    navigate("/course-discussion", {
                      state: { course: selectedCourse },
                    });
                  }}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Discussion
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Notification Detail Modal */}
      <Dialog
        open={notificationDetailOpen}
        onOpenChange={setNotificationDetailOpen}
      >
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50">
                {selectedNotification &&
                  getNotificationIcon(selectedNotification.type)}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  {selectedNotification?.title}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {selectedNotification?.timestamp
                    ? new Date(selectedNotification.timestamp).toLocaleString()
                    : ""}
                </div>
              </div>
              {selectedNotification && !selectedNotification.read && (
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {selectedNotification?.message}
            </div>

            {selectedNotification?.priority === "high" && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs font-medium">High Priority</span>
                </div>
              </div>
            )}

            {selectedNotification?.type === "assignment" && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2 text-amber-800">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-medium">
                    Assignment Deadline
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setNotificationDetailOpen(false)}
              className="flex-1"
            >
              Close
            </Button>
            {selectedNotification && !selectedNotification.read && (
              <Button
                size="sm"
                onClick={() =>
                  markNotificationAsReadAfterViewing(selectedNotification.id)
                }
                className="flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Read
              </Button>
            )}
            {selectedNotification && selectedNotification.read && (
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  markNotificationAsUnread(selectedNotification.id)
                }
                className="flex-1"
              >
                <Bell className="w-4 h-4 mr-2" />
                Mark as Unread
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentDashboard;
