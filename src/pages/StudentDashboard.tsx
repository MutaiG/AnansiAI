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

// Lazy load AI components with proper error handling
import { Suspense, lazy } from "react";

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

const LazyBehaviorAnalytics = lazy(() =>
  import("@/components/BehaviorAnalytics").catch(() => ({
    default: () => (
      <div className="p-8 text-center">
        <Activity className="w-8 h-8 mx-auto mb-2 text-purple-600" />
        <p className="text-gray-600">
          Behavior Analytics temporarily unavailable
        </p>
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

interface StudentDashboardData {
  profile: StudentProfile;
  enrolledCourses: DashboardCourse[];
  upcomingDeadlines: Assignment[];
  recentSubmissions: Submission[];
  behaviorSummary: {
    todaysFocus: number;
    weeklyEngagement: number;
    currentMood: Mood;
    riskLevel: "low" | "medium" | "high";
  };
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    earnedDate: Date;
    points: number;
    category: string;
  }>;
  notifications: Array<{
    id: string;
    type: "assignment" | "grade" | "system" | "ai_insight";
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    priority: "low" | "medium" | "high";
  }>;
}

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

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

        // In a real app, this would come from your backend API
        // For now, we'll use mock data that matches our types
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
              preferredStyle: LearningStyle.Visual,
              preferredModalities: [
                LearningModality.Interactive,
                LearningModality.Visual,
              ],
              difficultyPreference: "adaptive",
              pacePreference: "moderate",
              feedbackFrequency: "immediate",
            },
            emotionalState: {
              currentMood: Mood.Focused,
              stressLevel: 0.3,
              confidenceLevel: 0.75,
              motivationLevel: 0.8,
              lastUpdated: new Date(),
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
              recommendedApproaches: [
                "Visual learning materials",
                "Interactive problem-solving",
                "Collaborative projects",
                "Regular feedback loops",
              ],
            },
            parentContactInfo: {
              primaryParentName: "Sarah Johnson",
              primaryParentEmail: "sarah.johnson@email.com",
              primaryParentPhone: "+1-555-0123",
              emergencyContactName: "Mark Johnson",
              emergencyContactPhone: "+1-555-0124",
            },
            privacySettings: {
              dataSharing: "educational_only" as any,
              parentalAccess: true,
              behaviorTracking: true,
              aiPersonalization: true,
              thirdPartyIntegrations: false,
            },
            lastUpdated: new Date(),
            createdAt: new Date(),
          },
          enrolledCourses: [
            {
              id: "course_001",
              title: "Advanced Mathematics",
              subject: {
                id: "math_adv",
                name: "Advanced Mathematics",
                description: "Calculus and advanced algebraic concepts",
                grade: "10-12",
                isActive: true,
                levels: [],
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              progress: 75,
              instructor: "Dr. Sarah Chen",
              totalLessons: 48,
              completedLessons: 36,
              upcomingAssignments: [],
              recentGrade: 94,
              aiRecommended: true,
            },
            {
              id: "course_002",
              title: "Biology Advanced Placement",
              subject: {
                id: "bio_ap",
                name: "Biology AP",
                description: "Advanced placement biology course",
                grade: "11-12",
                isActive: true,
                levels: [],
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              progress: 68,
              instructor: "Prof. Michael Torres",
              totalLessons: 52,
              completedLessons: 35,
              upcomingAssignments: [],
              recentGrade: 89,
            },
            {
              id: "course_003",
              title: "World History Honors",
              subject: {
                id: "hist_honors",
                name: "World History Honors",
                description:
                  "Comprehensive world history with critical analysis",
                grade: "10-11",
                isActive: true,
                levels: [],
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              progress: 82,
              instructor: "Ms. Emily Rodriguez",
              totalLessons: 40,
              completedLessons: 33,
              upcomingAssignments: [],
              recentGrade: 96,
            },
          ],
          upcomingDeadlines: [],
          recentSubmissions: [],
          behaviorSummary: {
            todaysFocus: 78,
            weeklyEngagement: 85,
            currentMood: Mood.Focused,
            riskLevel: "low",
          },
          achievements: [
            {
              id: "ach_001",
              title: "Math Wizard",
              description:
                "Completed 10 consecutive math assignments with 90%+ scores",
              earnedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
              points: 150,
              category: "Academic Excellence",
            },
            {
              id: "ach_002",
              title: "Study Streak",
              description:
                "Maintained daily study habit for 7 consecutive days",
              earnedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
              points: 100,
              category: "Consistency",
            },
          ],
          notifications: [
            {
              id: "notif_001",
              type: "ai_insight",
              title: "AI Learning Recommendation",
              message:
                "Based on your recent performance, I recommend focusing on integration techniques in calculus. You're showing great progress!",
              timestamp: new Date(Date.now() - 30 * 60 * 1000),
              read: false,
              priority: "medium",
            },
            {
              id: "notif_002",
              type: "assignment",
              title: "Math Assignment Due Soon",
              message: "Your calculus homework is due in 6 hours",
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
              read: false,
              priority: "high",
            },
            {
              id: "notif_003",
              type: "grade",
              title: "Biology Quiz Graded",
              message: "Great work! You scored 94% on your latest biology quiz",
              timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
              read: false,
              priority: "medium",
            },
          ],
        };

        setDashboardData(mockData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
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
                    {notifications.filter((n) => !n.read).length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {notifications.filter((n) => !n.read).length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.slice(0, 5).map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="p-3 cursor-pointer"
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
                            {notification.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-1"></div>
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                  {notifications.length === 0 && (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No new notifications
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
                            {behaviorSummary.todaysFocus}%
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
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <BookOpen className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900 flex items-center gap-2">
                                {course.title}
                                {course.aiRecommended && (
                                  <Badge className="bg-purple-100 text-purple-700">
                                    <Brain className="w-3 h-3 mr-1" />
                                    AI Recommended
                                  </Badge>
                                )}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {course.instructor} • {course.completedLessons}/
                                {course.totalLessons} lessons
                              </p>
                              {course.recentGrade && (
                                <p className="text-sm text-green-600 font-medium">
                                  Latest: {course.recentGrade}%
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="w-32 mb-2">
                              <Progress
                                value={course.progress}
                                className="h-2"
                              />
                            </div>
                            <p className="text-sm text-gray-600">
                              {course.progress}% complete
                            </p>
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
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {enrolledCourses.map((course) => (
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
                            <CardDescription>
                              {course.instructor}
                            </CardDescription>
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
                            <Button size="sm" className="flex-1">
                              <Play className="w-4 h-4 mr-2" />
                              Continue Learning
                            </Button>
                            <Button variant="outline" size="sm">
                              <BarChart3 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center p-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></div>
                      <span>Loading Analytics...</span>
                    </div>
                  }
                >
                  <LazyBehaviorAnalytics
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
                </Suspense>
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
                    Total Points:{" "}
                    {achievements.reduce((sum, ach) => sum + ach.points, 0)}
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
                                <p className="text-lg font-bold text-yellow-600">
                                  +{achievement.points}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {achievement.earnedDate.toLocaleDateString()}
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
                      <span>{behaviorSummary.todaysFocus}%</span>
                    </div>
                    <Progress
                      value={behaviorSummary.todaysFocus}
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Engagement</span>
                      <span>{behaviorSummary.weeklyEngagement}%</span>
                    </div>
                    <Progress
                      value={behaviorSummary.weeklyEngagement}
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
    </div>
  );
};

export default StudentDashboard;
