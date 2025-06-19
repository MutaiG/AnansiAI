import { useState } from "react";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
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
  Zap,
  Users,
  MessageSquare,
  BarChart3,
  Star,
  Search,
  Filter,
  Volume2,
  Mic,
  Send,
  User,
  Key,
  Eye,
  EyeOff,
  GraduationCap,
  Edit,
  Download,
  Upload,
  Plus,
  Bookmark,
  Heart,
  Share,
  ChevronRight,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Course {
  id: string;
  title: string;
  subject: string;
  progress: number;
  nextLesson: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  aiRecommended: boolean;
  assignments: Assignment[];
  quizzes: Quiz[];
  instructor: string;
  totalLessons: number;
  completedLessons: number;
}

interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  score?: number;
  maxScore: number;
  description: string;
}

interface Quiz {
  id: string;
  title: string;
  questions: number;
  timeLimit: number;
  status: "available" | "completed" | "locked";
  score?: number;
  maxScore: number;
  attempts: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  date?: string;
  points: number;
  category: "academic" | "participation" | "milestone";
}

interface Notification {
  id: string;
  type: "assignment" | "grade" | "reminder" | "announcement";
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: "low" | "medium" | "high";
}

interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  members: number;
  nextSession: string;
  description: string;
}

interface AITwinSettings {
  personality: number;
  helpfulness: number;
  voiceEnabled: boolean;
  responsiveness: number;
  subjects: string[];
  learningStyle: "visual" | "auditory" | "kinesthetic" | "mixed";
}

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);
  const [isStudyGroupOpen, setIsStudyGroupOpen] = useState(false);
  const [isGoalSettingOpen, setIsGoalSettingOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    Array<{ sender: "user" | "ai"; message: string; time: string; id: string }>
  >([
    {
      id: "1",
      sender: "ai",
      message:
        "Hi Alex! I'm your AI twin. I've analyzed your learning patterns and I'm ready to help you succeed. What would you like to work on today?",
      time: "10:30 AM",
    },
  ]);
  const [aiSettings, setAiSettings] = useState<AITwinSettings>({
    personality: 75,
    helpfulness: 85,
    voiceEnabled: true,
    responsiveness: 70,
    subjects: ["Mathematics", "Science", "History"],
    learningStyle: "mixed",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [studyGoals, setStudyGoals] = useState({
    dailyStudyTime: 120,
    weeklyQuizzes: 3,
    monthlyAchievements: 2,
  });

  // Mock data
  const studentInfo = {
    name: "Alex Johnson",
    id: "STU001",
    grade: "10th Grade",
    avatar: "",
    gpa: 3.8,
    totalCredits: 24,
    rank: 15,
    classSize: 120,
  };

  const notifications: Notification[] = [
    {
      id: "1",
      type: "assignment",
      title: "Math Assignment Due Soon",
      message: "Your calculus homework is due in 6 hours",
      time: "2 hours ago",
      read: false,
      priority: "high",
    },
    {
      id: "2",
      type: "grade",
      title: "Biology Quiz Graded",
      message: "Great work! You scored 94% on your latest biology quiz",
      time: "1 day ago",
      read: false,
      priority: "medium",
    },
    {
      id: "3",
      type: "announcement",
      title: "Science Fair Registration",
      message: "Science fair next Friday - register by tomorrow",
      time: "2 days ago",
      read: true,
      priority: "low",
    },
    {
      id: "4",
      type: "reminder",
      title: "Study Group Session",
      message: "Math study group meeting in 30 minutes",
      time: "30 min ago",
      read: false,
      priority: "medium",
    },
  ];

  const courses: Course[] = [
    {
      id: "1",
      title: "Advanced Mathematics",
      subject: "Mathematics",
      progress: 75,
      nextLesson: "Calculus Fundamentals",
      difficulty: "Advanced",
      aiRecommended: true,
      instructor: "Dr. Sarah Chen",
      totalLessons: 48,
      completedLessons: 36,
      assignments: [
        {
          id: "a1",
          title: "Derivative Problems Set",
          dueDate: "Today at 11:59 PM",
          status: "pending",
          maxScore: 100,
          description: "Complete problems 1-25 from chapter 12",
        },
        {
          id: "a2",
          title: "Integration Exercises",
          dueDate: "Next Week",
          status: "pending",
          maxScore: 100,
          description: "Practice integration techniques",
        },
        {
          id: "a3",
          title: "Linear Algebra Project",
          dueDate: "Last Week",
          status: "graded",
          score: 92,
          maxScore: 100,
          description: "Matrix operations analysis",
        },
      ],
      quizzes: [
        {
          id: "q1",
          title: "Limits and Continuity",
          questions: 15,
          timeLimit: 30,
          status: "available",
          maxScore: 100,
          attempts: 0,
        },
        {
          id: "q2",
          title: "Basic Derivatives",
          questions: 20,
          timeLimit: 45,
          status: "completed",
          score: 88,
          maxScore: 100,
          attempts: 1,
        },
      ],
    },
    {
      id: "2",
      title: "World History",
      subject: "History",
      progress: 60,
      nextLesson: "Industrial Revolution",
      difficulty: "Intermediate",
      aiRecommended: false,
      instructor: "Prof. Michael Wilson",
      totalLessons: 32,
      completedLessons: 19,
      assignments: [
        {
          id: "a4",
          title: "Essay on WWI Impact",
          dueDate: "Friday",
          status: "submitted",
          maxScore: 100,
          description: "2000-word essay on social impacts",
        },
        {
          id: "a5",
          title: "Timeline Project",
          dueDate: "Next Month",
          status: "pending",
          maxScore: 150,
          description: "Create interactive timeline of major events",
        },
      ],
      quizzes: [
        {
          id: "q3",
          title: "Ancient Civilizations",
          questions: 25,
          timeLimit: 40,
          status: "completed",
          score: 92,
          maxScore: 100,
          attempts: 1,
        },
      ],
    },
    {
      id: "3",
      title: "Biology Fundamentals",
      subject: "Science",
      progress: 90,
      nextLesson: "Cell Division",
      difficulty: "Beginner",
      aiRecommended: true,
      instructor: "Dr. Emily Rodriguez",
      totalLessons: 28,
      completedLessons: 25,
      assignments: [
        {
          id: "a6",
          title: "Lab Report: Mitosis",
          dueDate: "Yesterday",
          status: "graded",
          score: 95,
          maxScore: 100,
          description: "Microscopy observation analysis",
        },
      ],
      quizzes: [
        {
          id: "q4",
          title: "Cell Structure",
          questions: 18,
          timeLimit: 35,
          status: "available",
          maxScore: 100,
          attempts: 0,
        },
      ],
    },
  ];

  const achievements: Achievement[] = [
    {
      id: "1",
      title: "Math Wizard",
      description: "Completed 10 math assignments with 90%+ scores",
      icon: "🧮",
      earned: true,
      date: "2024-01-15",
      points: 150,
      category: "academic",
    },
    {
      id: "2",
      title: "Study Streak Champion",
      description: "Maintained a 7-day consistent study streak",
      icon: "🔥",
      earned: true,
      date: "2024-01-10",
      points: 100,
      category: "milestone",
    },
    {
      id: "3",
      title: "Quiz Master",
      description: "Score 95%+ on 5 consecutive quizzes",
      icon: "🏆",
      earned: false,
      points: 200,
      category: "academic",
    },
    {
      id: "4",
      title: "Team Player",
      description: "Actively participated in 5 study groups",
      icon: "🤝",
      earned: true,
      date: "2024-01-08",
      points: 75,
      category: "participation",
    },
    {
      id: "5",
      title: "Early Bird",
      description: "Complete assignments 24+ hours before deadline 5 times",
      icon: "🌅",
      earned: false,
      points: 125,
      category: "milestone",
    },
  ];

  const studyGroups: StudyGroup[] = [
    {
      id: "1",
      name: "Advanced Math Study Circle",
      subject: "Mathematics",
      members: 8,
      nextSession: "Today 4:00 PM",
      description: "Collaborative problem-solving for calculus topics",
    },
    {
      id: "2",
      name: "Biology Lab Partners",
      subject: "Science",
      members: 6,
      nextSession: "Tomorrow 2:30 PM",
      description: "Lab experiment review and discussion",
    },
    {
      id: "3",
      name: "History Discussion Forum",
      subject: "History",
      members: 12,
      nextSession: "Thursday 3:00 PM",
      description: "Weekly discussions on historical events and their impact",
    },
  ];

  // Event handlers
  const handleLogout = () => {
    navigate("/login");
  };

  const handleStartReview = () => {
    // Create comprehensive review session based on weak areas
    const weakCourses = courses.filter((c) => c.progress < 80);
    const reviewData = {
      courses: weakCourses.length > 0 ? weakCourses : courses,
      focusAreas: ["problem-solving", "concept-review", "practice-tests"],
      estimatedTime: 45,
    };
    navigate("/review-session", { state: reviewData });
  };

  const handleFindGroups = () => {
    setIsStudyGroupOpen(true);
  };

  const handleJoinStudyGroup = (groupId: string) => {
    const group = studyGroups.find((g) => g.id === groupId);
    if (group) {
      navigate(`/study-group/${groupId}`, { state: { group, studentInfo } });
    }
  };

  const handleContinueCourse = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    navigate(`/course/${courseId}/lesson`, {
      state: { course, nextLesson: course?.nextLesson },
    });
  };

  const handleStartQuiz = (courseId: string, quizId: string) => {
    const course = courses.find((c) => c.id === courseId);
    const quiz = course?.quizzes.find((q) => q.id === quizId);
    navigate(`/quiz/${courseId}/${quizId}`, { state: { quiz, course } });
  };

  const handleViewAssignment = (courseId: string, assignmentId: string) => {
    const course = courses.find((c) => c.id === courseId);
    const assignment = course?.assignments.find((a) => a.id === assignmentId);
    navigate(`/assignment/${courseId}/${assignmentId}`, {
      state: { assignment, course },
    });
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        sender: "user" as const,
        message: chatMessage,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setChatHistory((prev) => [...prev, newMessage]);
      setChatMessage("");

      // Simulate AI response with more context-aware responses
      setTimeout(() => {
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          sender: "ai" as const,
          message: generateAIResponse(chatMessage),
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setChatHistory((prev) => [...prev, aiResponse]);
      }, 1500);
    }
  };

  const generateAIResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("math") || lowerMessage.includes("calculus")) {
      return "I see you're working on mathematics! Based on your current progress in Advanced Math (75%), I recommend focusing on the derivative problems first. Would you like me to create a personalized study plan?";
    }
    if (lowerMessage.includes("quiz") || lowerMessage.includes("test")) {
      return "Great question about quizzes! You have 2 available quizzes. The Limits and Continuity quiz might be perfect for reinforcing your calculus foundation. Shall I help you prepare?";
    }
    if (
      lowerMessage.includes("assignment") ||
      lowerMessage.includes("homework")
    ) {
      return "I notice you have a math assignment due today! Based on your learning style, I suggest breaking it into 3 sessions of 20 minutes each. Would you like specific tips for derivative problems?";
    }
    if (lowerMessage.includes("study") || lowerMessage.includes("help")) {
      return "I'm here to help optimize your study session! Looking at your performance data, you learn best with mixed visual and practical approaches. What specific topic would you like to tackle?";
    }

    const responses = [
      "That's an excellent question! Based on your learning pattern, I can provide personalized guidance. What specific area would you like to explore?",
      "I've analyzed your recent performance and can offer targeted suggestions. Are you looking for help with a particular subject?",
      "Great thinking! Your learning style suggests you'd benefit from a step-by-step approach. Let me break this down for you.",
      "I can see you're making great progress! Your current performance shows strength in practical applications. How can I help you build on that?",
      "Interesting point! Given your achievement in recent assignments, you're ready for more advanced concepts. What would you like to dive deeper into?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleUpdateAISettings = (
    setting: keyof AITwinSettings,
    value: any,
  ) => {
    setAiSettings((prev) => ({ ...prev, [setting]: value }));
    // Simulate saving settings
    setTimeout(() => {
      console.log("AI Settings updated:", { [setting]: value });
    }, 500);
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }

    // Simulate password change
    setTimeout(() => {
      alert("Password changed successfully!");
      setIsPasswordChangeOpen(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }, 1000);
  };

  const handleOpenSchedule = () => {
    navigate("/schedule", { state: { studentInfo, courses } });
  };

  const handleSetGoals = () => {
    setIsGoalSettingOpen(true);
  };

  const handleSaveGoals = () => {
    // Simulate saving goals
    setTimeout(() => {
      alert("Study goals updated successfully!");
      setIsGoalSettingOpen(false);
    }, 500);
  };

  const handleViewFullCalendar = () => {
    navigate("/calendar", {
      state: { courses, assignments: getAllAssignments() },
    });
  };

  const handleExportProgress = () => {
    // Simulate exporting progress report
    const progressData = {
      student: studentInfo,
      courses: courses.map((c) => ({
        title: c.title,
        progress: c.progress,
        grade: calculateCourseGrade(c),
      })),
      achievements: achievements.filter((a) => a.earned),
      gpa: studentInfo.gpa,
    };

    console.log("Exporting progress report:", progressData);
    alert("Progress report exported successfully!");
  };

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-warning-100 text-warning-700";
      case "submitted":
        return "bg-blue-100 text-blue-700";
      case "graded":
        return "bg-accent-100 text-accent-700";
      case "available":
        return "bg-primary-100 text-primary-700";
      case "completed":
        return "bg-accent-100 text-accent-700";
      case "locked":
        return "bg-secondary-100 text-secondary-700";
      default:
        return "bg-secondary-100 text-secondary-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-4 border-l-destructive-500";
      case "medium":
        return "border-l-4 border-l-warning-500";
      case "low":
        return "border-l-4 border-l-blue-500";
      default:
        return "";
    }
  };

  const getAllAssignments = () => {
    return courses.flatMap((course) =>
      course.assignments.map((assignment) => ({
        ...assignment,
        courseName: course.title,
        courseId: course.id,
      })),
    );
  };

  const calculateCourseGrade = (course: Course) => {
    const completedAssignments = course.assignments.filter(
      (a) => a.status === "graded",
    );
    if (completedAssignments.length === 0) return "N/A";

    const average =
      completedAssignments.reduce((sum, a) => sum + (a.score || 0), 0) /
      completedAssignments.length;
    if (average >= 90) return "A";
    if (average >= 80) return "B";
    if (average >= 70) return "C";
    if (average >= 60) return "D";
    return "F";
  };

  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const totalAchievementPoints = achievements
    .filter((a) => a.earned)
    .reduce((sum, a) => sum + a.points, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img
                src="https://cdn.builder.io/api/v1/assets/2d09da496e544a1eab05e596d02031d8/twinternet-logo-b18833?format=webp&width=800"
                alt="AnansiAI Logo"
                className="w-10 h-10 object-contain"
              />
              <div>
                <h1 className="font-bold text-xl text-secondary-800">
                  AnansiAI
                </h1>
                <p className="text-xs text-secondary-500">Student Portal</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Quick Actions */}
              <Button variant="ghost" size="sm" onClick={handleStartReview}>
                <Play className="w-4 h-4 mr-2" />
                Quick Review
              </Button>

              {/* Notifications */}
              <Dialog
                open={isNotificationOpen}
                onOpenChange={setIsNotificationOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadNotifications}
                      </span>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[600px] overflow-hidden">
                  <DialogHeader>
                    <DialogTitle>Notifications</DialogTitle>
                    <DialogDescription>
                      Stay updated with your assignments and announcements
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg border ${
                          notification.read
                            ? "bg-gray-50"
                            : "bg-white border-primary-200"
                        } ${getPriorityColor(notification.priority)}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-1 bg-primary-100 rounded">
                            {notification.type === "assignment" && (
                              <BookOpen className="w-4 h-4 text-primary-600" />
                            )}
                            {notification.type === "grade" && (
                              <Award className="w-4 h-4 text-accent-600" />
                            )}
                            {notification.type === "reminder" && (
                              <Clock className="w-4 h-4 text-warning-600" />
                            )}
                            {notification.type === "announcement" && (
                              <Bell className="w-4 h-4 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">
                              {notification.title}
                            </h4>
                            <p className="text-xs text-secondary-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-secondary-500 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={studentInfo.avatar} />
                      <AvatarFallback className="bg-primary-100 text-primary-700">
                        {studentInfo.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-secondary-800">
                        {studentInfo.name}
                      </p>
                      <p className="text-xs text-secondary-500">
                        {studentInfo.id} • {studentInfo.grade}
                      </p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleOpenSchedule}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportProgress}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Progress
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Manage your account settings and preferences
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Account Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input value={studentInfo.name} disabled />
                </div>
                <div>
                  <Label>Student ID</Label>
                  <Input value={studentInfo.id} disabled />
                </div>
                <div>
                  <Label>Grade</Label>
                  <Input value={studentInfo.grade} disabled />
                </div>
                <div>
                  <Label>Current GPA</Label>
                  <Input value={studentInfo.gpa.toString()} disabled />
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsPasswordChangeOpen(true)}
                className="w-full"
              >
                <Key className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Learning Preferences</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Preferred Learning Style</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={aiSettings.learningStyle}
                    onChange={(e) =>
                      handleUpdateAISettings("learningStyle", e.target.value)
                    }
                  >
                    <option value="visual">Visual</option>
                    <option value="auditory">Auditory</option>
                    <option value="kinesthetic">Kinesthetic</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
                <div>
                  <Label>Study Reminder Frequency</Label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Password Change Dialog */}
      <Dialog
        open={isPasswordChangeOpen}
        onOpenChange={setIsPasswordChangeOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Current Password</Label>
              <div className="relative">
                <Input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      current: !prev.current,
                    }))
                  }
                >
                  {showPasswords.current ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
            <div>
              <Label>New Password</Label>
              <div className="relative">
                <Input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() =>
                    setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                  }
                >
                  {showPasswords.new ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
            <div>
              <Label>Confirm New Password</Label>
              <div className="relative">
                <Input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      confirm: !prev.confirm,
                    }))
                  }
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsPasswordChangeOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handlePasswordChange} className="flex-1">
                Change Password
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Study Groups Dialog */}
      <Dialog open={isStudyGroupOpen} onOpenChange={setIsStudyGroupOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Available Study Groups</DialogTitle>
            <DialogDescription>
              Join study groups to collaborate with your peers
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {studyGroups.map((group) => (
              <Card key={group.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-secondary-800">
                      {group.name}
                    </h3>
                    <p className="text-sm text-secondary-600 mt-1">
                      {group.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-secondary-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {group.members} members
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {group.nextSession}
                      </span>
                      <Badge variant="outline">{group.subject}</Badge>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleJoinStudyGroup(group.id)}
                    className="ml-4"
                  >
                    Join Group
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Goal Setting Dialog */}
      <Dialog open={isGoalSettingOpen} onOpenChange={setIsGoalSettingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Study Goals</DialogTitle>
            <DialogDescription>
              Configure your daily and weekly learning objectives
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <Label>Daily Study Time (minutes)</Label>
              <Slider
                value={[studyGoals.dailyStudyTime]}
                onValueChange={(value) =>
                  setStudyGoals((prev) => ({
                    ...prev,
                    dailyStudyTime: value[0],
                  }))
                }
                max={300}
                min={30}
                step={15}
                className="mt-2"
              />
              <div className="flex justify-between text-sm text-secondary-500 mt-1">
                <span>30 min</span>
                <span className="font-medium">
                  {studyGoals.dailyStudyTime} min
                </span>
                <span>5 hours</span>
              </div>
            </div>

            <div>
              <Label>Weekly Quiz Target</Label>
              <Slider
                value={[studyGoals.weeklyQuizzes]}
                onValueChange={(value) =>
                  setStudyGoals((prev) => ({
                    ...prev,
                    weeklyQuizzes: value[0],
                  }))
                }
                max={10}
                min={1}
                step={1}
                className="mt-2"
              />
              <div className="flex justify-between text-sm text-secondary-500 mt-1">
                <span>1 quiz</span>
                <span className="font-medium">
                  {studyGoals.weeklyQuizzes} quizzes
                </span>
                <span>10 quizzes</span>
              </div>
            </div>

            <div>
              <Label>Monthly Achievement Goal</Label>
              <Slider
                value={[studyGoals.monthlyAchievements]}
                onValueChange={(value) =>
                  setStudyGoals((prev) => ({
                    ...prev,
                    monthlyAchievements: value[0],
                  }))
                }
                max={5}
                min={1}
                step={1}
                className="mt-2"
              />
              <div className="flex justify-between text-sm text-secondary-500 mt-1">
                <span>1</span>
                <span className="font-medium">
                  {studyGoals.monthlyAchievements} achievements
                </span>
                <span>5</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsGoalSettingOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveGoals}>Save Goals</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-secondary-800 mb-2">
                Welcome back, {studentInfo.name}!
              </h2>
              <p className="text-secondary-600">
                Ready to continue your learning journey? Your AI twin is here to
                help you succeed.
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-secondary-600">Current GPA</div>
              <div className="text-2xl font-bold text-primary-600">
                {studentInfo.gpa}
              </div>
              <div className="text-xs text-secondary-500">
                Rank {studentInfo.rank} of {studentInfo.classSize}
              </div>
            </div>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:grid-cols-6 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="ai-twin" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Twin
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Schedule
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-secondary-600">
                        Active Courses
                      </p>
                      <p className="text-2xl font-bold text-secondary-800">
                        {courses.length}
                      </p>
                    </div>
                    <div className="p-3 bg-primary-100 rounded-lg">
                      <BookOpen className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-secondary-600">Avg Progress</p>
                      <p className="text-2xl font-bold text-secondary-800">
                        {Math.round(
                          courses.reduce(
                            (sum, course) => sum + course.progress,
                            0,
                          ) / courses.length,
                        )}
                        %
                      </p>
                    </div>
                    <div className="p-3 bg-accent-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-accent-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-secondary-600">Achievements</p>
                      <p className="text-2xl font-bold text-secondary-800">
                        {achievements.filter((a) => a.earned).length}
                      </p>
                    </div>
                    <div className="p-3 bg-warning-100 rounded-lg">
                      <Award className="w-6 h-6 text-warning-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-secondary-600">Study Points</p>
                      <p className="text-2xl font-bold text-secondary-800">
                        {totalAchievementPoints}
                      </p>
                    </div>
                    <div className="p-3 bg-secondary-100 rounded-lg">
                      <Star className="w-6 h-6 text-secondary-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Jump into your learning</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={handleStartReview}
                    className="btn-primary w-full"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Smart Review
                  </Button>
                  <Button
                    onClick={handleFindGroups}
                    variant="outline"
                    className="w-full"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Find Study Groups
                  </Button>
                  <Button
                    onClick={handleSetGoals}
                    variant="outline"
                    className="w-full"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Set Study Goals
                  </Button>
                  <Button
                    onClick={handleViewFullCalendar}
                    variant="outline"
                    className="w-full"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    View Full Calendar
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Achievements */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Recent Achievements</CardTitle>
                  <CardDescription>Your latest accomplishments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {achievements
                    .filter((achievement) => achievement.earned)
                    .slice(0, 3)
                    .map((achievement) => (
                      <div
                        key={achievement.id}
                        className="flex items-center gap-3 p-3 bg-accent-50 rounded-lg"
                      >
                        <span className="text-2xl">{achievement.icon}</span>
                        <div className="flex-1">
                          <h4 className="font-medium text-secondary-800">
                            {achievement.title}
                          </h4>
                          <p className="text-sm text-secondary-600">
                            {achievement.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-secondary-500">
                              {achievement.date}
                            </p>
                            <Badge className="text-xs bg-primary-100 text-primary-700">
                              +{achievement.points} pts
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>

              {/* Progress Overview */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Course Progress</CardTitle>
                  <CardDescription>Your learning journey</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {courses.map((course) => (
                    <div key={course.id}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="text-sm font-medium text-secondary-800">
                            {course.title}
                          </span>
                          <div className="text-xs text-secondary-500">
                            {course.completedLessons}/{course.totalLessons}{" "}
                            lessons
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-secondary-600">
                            {course.progress}%
                          </span>
                          <div className="text-xs text-accent-600 font-medium">
                            Grade: {calculateCourseGrade(course)}
                          </div>
                        </div>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-secondary-800">
                  My Courses
                </h3>
                <p className="text-sm text-secondary-600">
                  {courses.length} active courses •{" "}
                  {
                    getAllAssignments().filter((a) => a.status === "pending")
                      .length
                  }{" "}
                  pending assignments
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="grid gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="card-elevated">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-100 rounded-lg">
                          <BookOpen className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {course.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{course.subject}</span>
                            <span>•</span>
                            <Badge variant="outline">{course.difficulty}</Badge>
                            {course.aiRecommended && (
                              <Badge className="bg-primary-100 text-primary-700">
                                <Brain className="w-3 h-3 mr-1" />
                                AI Recommended
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-secondary-500 mt-1">
                            Instructor: {course.instructor}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleContinueCourse(course.id)}
                        className="btn-primary"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Continue
                      </Button>
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
                        <div className="flex justify-between text-sm mt-2">
                          <p className="text-secondary-600">
                            Next: {course.nextLesson}
                          </p>
                          <p className="text-accent-600 font-medium">
                            Grade: {calculateCourseGrade(course)}
                          </p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Assignments */}
                        <div>
                          <h4 className="font-medium text-secondary-800 mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Assignments
                          </h4>
                          <div className="space-y-2">
                            {course.assignments.map((assignment) => (
                              <div
                                key={assignment.id}
                                className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors cursor-pointer"
                                onClick={() =>
                                  handleViewAssignment(course.id, assignment.id)
                                }
                              >
                                <div className="flex-1">
                                  <p className="text-sm font-medium">
                                    {assignment.title}
                                  </p>
                                  <p className="text-xs text-secondary-600">
                                    Due: {assignment.dueDate}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    className={getStatusColor(
                                      assignment.status,
                                    )}
                                  >
                                    {assignment.status}
                                  </Badge>
                                  {assignment.score && (
                                    <span className="text-sm font-medium">
                                      {assignment.score}/{assignment.maxScore}
                                    </span>
                                  )}
                                  <ChevronRight className="w-4 h-4 text-secondary-400" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Quizzes */}
                        <div>
                          <h4 className="font-medium text-secondary-800 mb-3 flex items-center gap-2">
                            <Brain className="w-4 h-4" />
                            Quizzes
                          </h4>
                          <div className="space-y-2">
                            {course.quizzes.map((quiz) => (
                              <div
                                key={quiz.id}
                                className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg"
                              >
                                <div className="flex-1">
                                  <p className="text-sm font-medium">
                                    {quiz.title}
                                  </p>
                                  <p className="text-xs text-secondary-600">
                                    {quiz.questions} questions •{" "}
                                    {quiz.timeLimit} min
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {quiz.status === "available" ? (
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        handleStartQuiz(course.id, quiz.id)
                                      }
                                    >
                                      Start Quiz
                                    </Button>
                                  ) : (
                                    <>
                                      <Badge
                                        className={getStatusColor(quiz.status)}
                                      >
                                        {quiz.status}
                                      </Badge>
                                      {quiz.score && (
                                        <span className="text-sm font-medium">
                                          {quiz.score}/{quiz.maxScore}
                                        </span>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ai-twin" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Chat Interface */}
              <div className="lg:col-span-2">
                <Card className="card-elevated h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-primary-600" />
                      AI Twin Chat
                    </CardTitle>
                    <CardDescription>
                      Chat with your AI twin for personalized learning support
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-2">
                      {chatHistory.map((chat) => (
                        <div
                          key={chat.id}
                          className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              chat.sender === "user"
                                ? "bg-primary-500 text-white"
                                : "bg-secondary-100 text-secondary-800"
                            }`}
                          >
                            <p className="text-sm">{chat.message}</p>
                            <p
                              className={`text-xs mt-1 ${
                                chat.sender === "user"
                                  ? "text-primary-100"
                                  : "text-secondary-500"
                              }`}
                            >
                              {chat.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ask your AI twin anything..."
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                      />
                      <Button onClick={handleSendMessage}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* AI Twin Settings */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Twin Settings</CardTitle>
                  <CardDescription>
                    Customize your AI twin's behavior
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium">Personality</Label>
                    <div className="mt-2">
                      <Slider
                        value={[aiSettings.personality]}
                        onValueChange={(value) =>
                          handleUpdateAISettings("personality", value[0])
                        }
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-secondary-500 mt-1">
                        <span>Formal</span>
                        <span>Friendly</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Helpfulness</Label>
                    <div className="mt-2">
                      <Slider
                        value={[aiSettings.helpfulness]}
                        onValueChange={(value) =>
                          handleUpdateAISettings("helpfulness", value[0])
                        }
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-secondary-500 mt-1">
                        <span>Hints</span>
                        <span>Detailed</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">
                      Responsiveness
                    </Label>
                    <div className="mt-2">
                      <Slider
                        value={[aiSettings.responsiveness]}
                        onValueChange={(value) =>
                          handleUpdateAISettings("responsiveness", value[0])
                        }
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-secondary-500 mt-1">
                        <span>Patient</span>
                        <span>Quick</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Voice Enabled</Label>
                    <Button
                      variant={aiSettings.voiceEnabled ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        handleUpdateAISettings(
                          "voiceEnabled",
                          !aiSettings.voiceEnabled,
                        )
                      }
                    >
                      {aiSettings.voiceEnabled ? (
                        <Volume2 className="w-4 h-4" />
                      ) : (
                        <Mic className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">
                      Learning Style
                    </Label>
                    <select
                      className="w-full mt-2 p-2 border rounded-md"
                      value={aiSettings.learningStyle}
                      onChange={(e) =>
                        handleUpdateAISettings("learningStyle", e.target.value)
                      }
                    >
                      <option value="visual">Visual</option>
                      <option value="auditory">Auditory</option>
                      <option value="kinesthetic">Kinesthetic</option>
                      <option value="mixed">Mixed</option>
                    </select>
                  </div>

                  <Button className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Advanced Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-secondary-800">
                  Achievements & Badges
                </h3>
                <p className="text-sm text-secondary-600">
                  {achievements.filter((a) => a.earned).length} of{" "}
                  {achievements.length} earned • {totalAchievementPoints} total
                  points
                </p>
              </div>
              <Button variant="outline">
                <Share className="w-4 h-4 mr-2" />
                Share Progress
              </Button>
            </div>

            <div className="grid gap-6">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-warning-600" />
                    Your Achievements
                  </CardTitle>
                  <CardDescription>
                    Track your learning milestones and accomplishments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                          achievement.earned
                            ? "bg-accent-50 border-accent-200 hover:bg-accent-100"
                            : "bg-secondary-50 border-secondary-200 opacity-60 hover:opacity-80"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-3xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-secondary-800">
                                {achievement.title}
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                {achievement.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-secondary-600 mb-2">
                              {achievement.description}
                            </p>
                            <div className="flex items-center gap-2">
                              {achievement.earned && achievement.date && (
                                <p className="text-xs text-accent-600 font-medium">
                                  Earned on {achievement.date}
                                </p>
                              )}
                              {!achievement.earned && (
                                <p className="text-xs text-secondary-500">
                                  Not yet earned
                                </p>
                              )}
                              <Badge className="text-xs bg-primary-100 text-primary-700">
                                {achievement.points} pts
                              </Badge>
                            </div>
                          </div>
                          {achievement.earned && (
                            <CheckCircle className="w-5 h-5 text-accent-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Achievement Progress</CardTitle>
                  <CardDescription>
                    Your overall achievement statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div className="p-4 bg-primary-50 rounded-lg">
                      <div className="text-2xl font-bold text-primary-600">
                        {achievements.filter((a) => a.earned).length}
                      </div>
                      <p className="text-sm text-secondary-600">Earned</p>
                    </div>
                    <div className="p-4 bg-warning-50 rounded-lg">
                      <div className="text-2xl font-bold text-warning-600">
                        {achievements.length}
                      </div>
                      <p className="text-sm text-secondary-600">Total</p>
                    </div>
                    <div className="p-4 bg-accent-50 rounded-lg">
                      <div className="text-2xl font-bold text-accent-600">
                        {Math.round(
                          (achievements.filter((a) => a.earned).length /
                            achievements.length) *
                            100,
                        )}
                        %
                      </div>
                      <p className="text-sm text-secondary-600">Completion</p>
                    </div>
                    <div className="p-4 bg-secondary-50 rounded-lg">
                      <div className="text-2xl font-bold text-secondary-600">
                        {totalAchievementPoints}
                      </div>
                      <p className="text-sm text-secondary-600">Points</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-secondary-800">
                  My Schedule
                </h3>
                <p className="text-sm text-secondary-600">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleViewFullCalendar}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Full Calendar
                </Button>
                <Button onClick={handleSetGoals}>
                  <Target className="w-4 h-4 mr-2" />
                  Set Goals
                </Button>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      Today's Schedule
                    </CardTitle>
                    <CardDescription>
                      Your classes and study sessions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          time: "9:00 AM",
                          subject: "Advanced Mathematics",
                          type: "Class",
                          status: "upcoming",
                          location: "Room 301",
                        },
                        {
                          time: "10:30 AM",
                          subject: "World History",
                          type: "Class",
                          status: "current",
                          location: "Room 205",
                        },
                        {
                          time: "1:00 PM",
                          subject: "Biology Study Session",
                          type: "Study Group",
                          status: "upcoming",
                          location: "Library",
                        },
                        {
                          time: "3:00 PM",
                          subject: "Math Assignment Due",
                          type: "Deadline",
                          status: "upcoming",
                          location: "Online",
                        },
                        {
                          time: "4:00 PM",
                          subject: "AI Twin Review Session",
                          type: "Personal Study",
                          status: "upcoming",
                          location: "Home",
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border transition-all hover:shadow-sm ${
                            item.status === "current"
                              ? "bg-primary-50 border-primary-200"
                              : "bg-secondary-50 border-secondary-200"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-2 rounded-lg ${
                                  item.status === "current"
                                    ? "bg-primary-100"
                                    : "bg-secondary-100"
                                }`}
                              >
                                {item.type === "Class" && (
                                  <GraduationCap className="w-4 h-4" />
                                )}
                                {item.type === "Study Group" && (
                                  <Users className="w-4 h-4" />
                                )}
                                {item.type === "Deadline" && (
                                  <Clock className="w-4 h-4" />
                                )}
                                {item.type === "Personal Study" && (
                                  <Brain className="w-4 h-4" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium text-secondary-800">
                                  {item.subject}
                                </h4>
                                <p className="text-sm text-secondary-600">
                                  {item.time} • {item.type} • {item.location}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                className={
                                  item.status === "current"
                                    ? "bg-primary-100 text-primary-700"
                                    : "bg-secondary-100 text-secondary-700"
                                }
                              >
                                {item.status}
                              </Badge>
                              {item.status === "current" && (
                                <Button size="sm">Join</Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Schedule management</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleViewFullCalendar}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      View Full Calendar
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Clock className="w-4 h-4 mr-2" />
                      Set Study Reminder
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleSetGoals}
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Plan Study Session
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleFindGroups}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Join Study Group
                    </Button>
                  </CardContent>
                </Card>

                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle>Study Goals</CardTitle>
                    <CardDescription>Today's objectives</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Daily Study Time</span>
                      <span className="text-sm font-medium">
                        {studyGoals.dailyStudyTime} min
                      </span>
                    </div>
                    <Progress value={65} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-secondary-500">
                      <span>78 min completed</span>
                      <span>35% done</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-secondary-800">
                  Performance Analytics
                </h3>
                <p className="text-sm text-secondary-600">
                  Track your academic progress and learning insights
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleExportProgress}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
                <Button variant="outline">
                  <Share className="w-4 h-4 mr-2" />
                  Share Progress
                </Button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent-600" />
                    Academic Performance
                  </CardTitle>
                  <CardDescription>
                    Your progress across all subjects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <div key={course.id}>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="text-sm font-medium text-secondary-800">
                              {course.title}
                            </span>
                            <div className="text-xs text-secondary-500">
                              Instructor: {course.instructor}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-sm text-secondary-600">
                              {course.progress}%
                            </span>
                            <div className="text-xs font-medium text-accent-600">
                              Grade: {calculateCourseGrade(course)}
                            </div>
                          </div>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Learning Statistics</CardTitle>
                  <CardDescription>
                    Your learning journey insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-accent-600 mb-1">
                        {Math.round(
                          courses.reduce(
                            (sum, course) => sum + course.progress,
                            0,
                          ) / courses.length,
                        )}
                        %
                      </div>
                      <p className="text-sm text-secondary-600">
                        Overall Progress
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 bg-primary-50 rounded-lg">
                        <div className="text-xl font-bold text-primary-600">
                          {courses.reduce(
                            (sum, course) => sum + course.assignments.length,
                            0,
                          )}
                        </div>
                        <p className="text-xs text-secondary-600">
                          Total Assignments
                        </p>
                      </div>
                      <div className="p-3 bg-warning-50 rounded-lg">
                        <div className="text-xl font-bold text-warning-600">
                          {courses.reduce(
                            (sum, course) =>
                              sum +
                              course.quizzes.filter(
                                (q) => q.status === "completed",
                              ).length,
                            0,
                          )}
                        </div>
                        <p className="text-xs text-secondary-600">
                          Quizzes Completed
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 bg-accent-50 rounded-lg">
                        <div className="text-xl font-bold text-accent-600">
                          7
                        </div>
                        <p className="text-xs text-secondary-600">
                          Study Streak
                        </p>
                      </div>
                      <div className="p-3 bg-secondary-50 rounded-lg">
                        <div className="text-xl font-bold text-secondary-600">
                          {studentInfo.gpa}
                        </div>
                        <p className="text-xs text-secondary-600">
                          Current GPA
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest learning activities and achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      action: "Completed Biology Quiz: Cell Structure",
                      score: "94%",
                      time: "2 hours ago",
                      type: "quiz",
                      color: "text-accent-600",
                    },
                    {
                      action: "Submitted Math Assignment: Derivatives",
                      score: "Pending",
                      time: "1 day ago",
                      type: "assignment",
                      color: "text-blue-600",
                    },
                    {
                      action: "Joined Advanced Math Study Group",
                      score: "1 hour",
                      time: "2 days ago",
                      type: "study",
                      color: "text-purple-600",
                    },
                    {
                      action: "Earned Achievement: Math Wizard",
                      score: "+150 pts",
                      time: "3 days ago",
                      type: "achievement",
                      color: "text-warning-600",
                    },
                    {
                      action: "AI Twin Session: Calculus Review",
                      score: "45 min",
                      time: "4 days ago",
                      type: "ai",
                      color: "text-primary-600",
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-white`}>
                          {activity.type === "quiz" && (
                            <Brain className="w-4 h-4 text-accent-600" />
                          )}
                          {activity.type === "assignment" && (
                            <FileText className="w-4 h-4 text-blue-600" />
                          )}
                          {activity.type === "study" && (
                            <Users className="w-4 h-4 text-purple-600" />
                          )}
                          {activity.type === "achievement" && (
                            <Award className="w-4 h-4 text-warning-600" />
                          )}
                          {activity.type === "ai" && (
                            <Brain className="w-4 h-4 text-primary-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-secondary-800">
                            {activity.action}
                          </h4>
                          <p className="text-xs text-secondary-600">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${activity.color}`}>
                          {activity.score}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {activity.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StudentDashboard;
