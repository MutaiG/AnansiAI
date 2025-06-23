import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  Users,
  BookOpen,
  Calendar,
  BarChart3,
  Settings,
  Bell,
  Search,
  Filter,
  Plus,
  ChevronRight,
  AlertTriangle,
  TrendingUp,
  Clock,
  Star,
  User,
  GraduationCap,
  FileText,
  Target,
  Zap,
  Award,
  MessageSquare,
  Activity,
  CheckCircle,
  AlertCircle,
  Eye,
  MoreHorizontal,
  Download,
  Upload,
  UserCheck,
  UserX,
  Send,
  Trash2,
  MessageCircle,
  Info,
  LogOut,
  Edit,
  Lightbulb,
  Copy,
  Archive,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useNotifications } from "@/hooks/useNotifications";
import { NotificationCenter } from "@/components/NotificationCenter";
import { MessageModal } from "@/components/MessageModal";
import DevelopmentBanner from "@/components/DevelopmentBanner";
import { IntegrationStatus } from "@/components/IntegrationStatus";
import usePageTitle from "@/hooks/usePageTitle";
import { useTeacherDashboard, useUpdateProfile } from "@/hooks/useTeacherApi";

// Types for the teacher dashboard
interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  subject: string;
  experience: string;
  rating: number;
  certifications: string[];
  bio: string;
  schoolId?: string;
  schoolName?: string;
}

interface TeacherStats {
  totalStudents: number;
  activeClasses: number;
  pendingSubmissions: number;
  averageProgress: number;
  strugglingStudents: number;
  excellingStudents: number;
  weeklyEngagement: number;
  completionRate: number;
}

interface ClassData {
  id: string;
  name: string;
  subject: string;
  grade: string;
  studentCount: number;
  progress: number;
  nextLesson: string;
  schedule: string;
  status: string;
  description: string;
  studentsEnrolled?: number;
  averageGrade?: number;
  lastUpdated?: string;
}

interface StudentData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  grade: string;
  class: string;
  overallProgress: number;
  lastActive: string;
  status: "active" | "struggling" | "excelling" | "inactive";
  currentMood: string;
  riskScore: number;
  aiRecommendations: string[];
  recentSubmissions: number;
  averageGrade: number;
}

interface AIAlert {
  id: string;
  studentId: string;
  studentName: string;
  type: "behavioral" | "academic" | "engagement" | "emotional";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  message: string;
  timestamp: string;
  actionTaken: boolean;
  recommendations: string[];
}

interface LessonContent {
  id: string;
  title: string;
  subject: string;
  type: "lesson" | "assignment" | "quiz" | "project";
  difficulty: "easy" | "medium" | "hard";
  status: "draft" | "published" | "archived";
  createdAt: string;
  studentsCompleted: number;
  averageScore: number;
  estimatedDuration: number;
  description?: string;
}

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
}

interface AITwinInsight {
  id: string;
  studentId: string;
  studentName: string;
  twinLearningStage: string;
  personalityTraits: any;
  learningPreferences: any;
  emotionalState: any;
  behaviorAnalysis: any;
  twinAdaptations: any;
  privacySettings: any;
  lastTwinInteraction: string;
  twinEffectivenessScore: number;
}

interface TeacherDashboardData {
  teacherProfile: TeacherProfile;
  stats: TeacherStats;
  classes: ClassData[];
  students: StudentData[];
  aiAlerts: AIAlert[];
  recentActivity: RecentActivity[];
  lessonContent: LessonContent[];
  aiTwinInsights?: AITwinInsight[];
  loading?: boolean;
  error?: string | null;
}

interface Message {
  id: string;
  title: string;
  message: string;
  from?: { name: string; role: string };
  timestamp: string;
  priority: "low" | "medium" | "high" | "critical";
  isRead: boolean;
  type: string;
}

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Use real API hooks
  const {
    data: dashboardData,
    loading,
    error,
    reload: loadDashboardData,
  } = useTeacherDashboard();
  const { updateProfile, loading: profileLoading } = useUpdateProfile();

  // Page state
  const [activeTab, setActiveTab] = useState("overview");
  const [lastAction, setLastAction] = useState<{
    type: string;
    message: string;
  } | null>(null);

  // Modal and form states
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [showCreateContent, setShowCreateContent] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);

  // Form states
  const [classForm, setClassForm] = useState({
    name: "",
    subject: "",
    grade: "",
    description: "",
    schedule: "",
  });

  const [contentForm, setContentForm] = useState({
    title: "",
    type: "lesson",
    subject: "",
    description: "",
    difficulty: "medium",
  });

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    subject: "",
    bio: "",
    certifications: [] as string[],
  });

  // Notification system
  const {
    notifications,
    messages,
    unreadCount,
    urgentCount,
    addNotification,
    addMessage,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAll,
    getMessageById,
  } = useNotifications();

  // Page title
  usePageTitle("Teacher Dashboard - Anansi AI");

  // Auto-dismiss last action after 5 seconds
  useEffect(() => {
    if (lastAction) {
      const timer = setTimeout(() => {
        setLastAction(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [lastAction]);

  // Initialize user role for development
  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (!userRole || !["TEACHER", "ADMIN", "SUPER_ADMIN"].includes(userRole)) {
      localStorage.setItem("userRole", "TEACHER");
      console.log("Setting teacher role for development");
    }
  }, []);

  // Profile settings handlers
  const handleOpenProfileSettings = () => {
    if (dashboardData?.teacherProfile) {
      setProfileForm({
        name: dashboardData.teacherProfile.name,
        email: dashboardData.teacherProfile.email,
        subject: dashboardData.teacherProfile.subject,
        bio: dashboardData.teacherProfile.bio,
        certifications: dashboardData.teacherProfile.certifications,
      });
    }
    setShowProfileSettings(true);
  };

  const handleSaveProfile = async () => {
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      setLastAction({
        type: "error",
        message: "Name and email are required",
      });
      return;
    }

    try {
      // Call real API
      const updatedProfile = await updateProfile({
        name: profileForm.name,
        email: profileForm.email,
        subject: profileForm.subject,
        bio: profileForm.bio,
        certifications: profileForm.certifications,
      });

      if (updatedProfile) {
        // Reload dashboard data to get updated profile
        await loadDashboardData();

        setShowProfileSettings(false);
        setLastAction({
          type: "success",
          message: "Profile updated successfully!",
        });

        addNotification({
          type: "system",
          priority: "low",
          title: "Profile Updated",
          message: "Your profile information has been updated successfully.",
          isRead: false,
        });
      } else {
        setLastAction({
          type: "error",
          message: "Failed to update profile. Please try again.",
        });
      }
    } catch (error) {
      setLastAction({
        type: "error",
        message: "Failed to update profile. Please try again.",
      });
    }
  };

  // Handler functions
  const handleResolveAlert = (alertId: string) => {
    setLastAction({ type: "success", message: "Alert marked as resolved" });
  };

  const handleNotificationAction = (actionId: string, notification: any) => {
    console.log("Notification action:", actionId, notification);
  };

  const handleMessageAction = (actionId: string, message: any) => {
    console.log("Message action:", actionId, message);
  };

  const handleMessageReply = (messageId: string, reply: string) => {
    console.log("Message reply:", messageId, reply);
  };

  const handleShowMessage = (messageId: string) => {
    const message = getMessageById(messageId);
    if (message) {
      setSelectedMessage(message);
      setShowMessageModal(true);
    }
  };

  const handleCreateClass = async () => {
    if (!classForm.name.trim() || !classForm.subject.trim()) {
      setLastAction({
        type: "error",
        message: "Please fill in required fields",
      });
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowCreateClass(false);
      setLastAction({
        type: "success",
        message: `Class "${classForm.name}" created successfully!`,
      });

      setClassForm({
        name: "",
        subject: "",
        grade: "",
        description: "",
        schedule: "",
      });

      addNotification({
        type: "class",
        priority: "medium",
        title: "Class Created Successfully",
        message: `${classForm.name} has been created and is now available to students.`,
        isRead: false,
      });
    } catch (error) {
      setLastAction({
        type: "error",
        message: "Failed to create class. Please try again.",
      });
    }
  };

  const handleCreateContent = async () => {
    if (!contentForm.title.trim() || !contentForm.subject.trim()) {
      setLastAction({
        type: "error",
        message: "Please fill in required fields",
      });
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowCreateContent(false);
      setLastAction({
        type: "success",
        message: `${contentForm.type} "${contentForm.title}" created successfully!`,
      });

      setContentForm({
        title: "",
        type: "lesson",
        subject: "",
        description: "",
        difficulty: "medium",
      });

      addNotification({
        type: "content",
        priority: "medium",
        title: "Content Created Successfully",
        message: `${contentForm.title} has been created and is ready for use.`,
        isRead: false,
      });
    } catch (error) {
      setLastAction({
        type: "error",
        message: "Failed to create content. Please try again.",
      });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600">
            Loading Teacher Dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Dashboard</AlertTitle>
          <AlertDescription className="mt-2">
            {error}
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full"
              onClick={loadDashboardData}
            >
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Brain className="h-8 w-8 text-primary" />
                <div>
                  <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                    <button
                      onClick={() => navigate("/")}
                      className="hover:text-gray-700 transition-colors"
                    >
                      Anansi AI
                    </button>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-gray-900 font-medium">
                      Teacher Dashboard
                    </span>
                  </nav>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Teacher Dashboard
                  </h1>
                  <p className="text-sm text-gray-600">
                    Welcome back,{" "}
                    {dashboardData?.teacherProfile?.name || "Teacher"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Action feedback */}
              {lastAction && (
                <div
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${
                    lastAction.type === "success"
                      ? "bg-green-100 text-green-800"
                      : lastAction.type === "error"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {lastAction.type === "success" && (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  {lastAction.type === "error" && (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  {lastAction.type === "info" && <Info className="h-4 w-4" />}
                  <span>{lastAction.message}</span>
                </div>
              )}

              {/* Messages */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <MessageCircle className="h-5 w-5" />
                    {messages.length > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                        {messages.length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80" align="end">
                  <DropdownMenuLabel>System Messages</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {messages.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No messages</p>
                    </div>
                  ) : (
                    <div className="max-h-80 overflow-y-auto">
                      {messages.slice(0, 5).map((message) => (
                        <DropdownMenuItem
                          key={message.id}
                          className="flex flex-col items-start p-3 cursor-pointer"
                          onClick={() => handleShowMessage(message.id)}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-medium text-sm">
                              {message.title}
                            </span>
                            <Badge
                              variant={
                                message.priority === "critical"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {message.priority}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {message.message}
                          </p>
                          <span className="text-xs text-gray-400 mt-1">
                            {message.from?.name} •{" "}
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </DropdownMenuItem>
                      ))}
                      {messages.length > 5 && (
                        <DropdownMenuItem
                          className="text-center text-blue-600 hover:text-blue-800"
                          onClick={() => setShowMessageModal(true)}
                        >
                          View all {messages.length} messages
                        </DropdownMenuItem>
                      )}
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Notifications */}
              <DropdownMenu
                open={showNotificationCenter}
                onOpenChange={setShowNotificationCenter}
              >
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-96" align="end">
                  <NotificationCenter
                    notifications={notifications}
                    onMarkAsRead={markAsRead}
                    onMarkAllAsRead={markAllAsRead}
                    onDismiss={dismissNotification}
                    onClearAll={clearAll}
                  />
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Profile Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={dashboardData?.teacherProfile?.avatar}
                        alt={dashboardData?.teacherProfile?.name}
                      />
                      <AvatarFallback>
                        {dashboardData?.teacherProfile?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">
                        {dashboardData?.teacherProfile?.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {dashboardData?.teacherProfile?.email}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Badge variant="outline" className="text-xs">
                          Teacher
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {dashboardData?.teacherProfile?.subject}
                        </Badge>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleOpenProfileSettings()}>
                    <Settings className="mr-2 h-4 w-4" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/login")}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-6 py-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger
              value="overview"
              className="flex items-center space-x-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="students"
              className="flex items-center space-x-2"
            >
              <Users className="h-4 w-4" />
              <span>Students</span>
            </TabsTrigger>
            <TabsTrigger
              value="classes"
              className="flex items-center space-x-2"
            >
              <BookOpen className="h-4 w-4" />
              <span>Classes</span>
            </TabsTrigger>
            <TabsTrigger
              value="content"
              className="flex items-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>Content</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center space-x-2"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Students
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardData?.stats?.totalStudents || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Across all classes
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Classes
                  </CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardData?.stats?.activeClasses || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Across all grade levels
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg Progress
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardData?.stats?.averageProgress || 0}%
                  </div>
                  <Progress
                    value={dashboardData?.stats?.averageProgress || 0}
                    className="mt-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending Reviews
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {dashboardData?.stats?.pendingSubmissions || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Submissions to review
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* AI Insights and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Twin Learning Center */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-purple-500" />
                    <span>AI Twin Learning Center</span>
                    <Badge variant="secondary" className="text-xs">
                      {dashboardData?.aiTwinInsights?.length || 0} Active Twins
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <Brain className="h-12 w-12 mx-auto text-purple-500 mb-3" />
                      <p className="text-gray-600">
                        AI Twin insights coming soon
                      </p>
                      <p className="text-sm text-gray-500">
                        Monitor student learning with AI companions
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-orange-500" />
                    <span>Quick Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2"
                      onClick={() => setShowCreateClass(true)}
                    >
                      <Plus className="h-5 w-5" />
                      <span className="text-sm">New Class</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2"
                      onClick={() => setShowCreateContent(true)}
                    >
                      <FileText className="h-5 w-5" />
                      <span className="text-sm">New Content</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2"
                      onClick={() => setActiveTab("students")}
                    >
                      <Users className="h-5 w-5" />
                      <span className="text-sm">View Students</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2"
                      onClick={() => setActiveTab("analytics")}
                    >
                      <BarChart3 className="h-5 w-5" />
                      <span className="text-sm">View Analytics</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Students</h2>
              <div className="flex items-center space-x-2">
                <Input placeholder="Search students..." className="w-64" />
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600">
                    Student data will be loaded here
                  </p>
                  <p className="text-sm text-gray-500">
                    Monitor student progress and AI Twin interactions
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Classes Tab */}
          <TabsContent value="classes" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Classes</h2>
              <Button onClick={() => setShowCreateClass(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Class
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData?.classes?.map((classItem) => (
                <Card
                  key={classItem.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {classItem.name}
                      </CardTitle>
                      <Badge variant="secondary">{classItem.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {classItem.subject} • {classItem.grade}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Students</span>
                        <span className="font-medium">
                          {classItem.studentCount}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">
                            {classItem.progress}%
                          </span>
                        </div>
                        <Progress value={classItem.progress} className="h-2" />
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-600">
                          Next: {classItem.nextLesson}
                        </p>
                        <p className="text-gray-500">{classItem.schedule}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) || (
                <div className="col-span-full text-center py-8">
                  <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600">No classes available</p>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => setShowCreateClass(true)}
                  >
                    Create your first class
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Content</h2>
              <Button onClick={() => setShowCreateContent(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Content
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData?.lessonContent?.map((content) => (
                <Card
                  key={content.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{content.title}</CardTitle>
                      <Badge
                        variant={
                          content.status === "published"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {content.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {content.type} • {content.subject}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Difficulty</span>
                        <Badge variant="outline" size="sm">
                          {content.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Completed</span>
                        <span className="font-medium">
                          {content.studentsCompleted} students
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Avg Score</span>
                        <span className="font-medium">
                          {content.averageScore}%
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {content.estimatedDuration} min
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) || (
                <div className="col-span-full text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600">No content available</p>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => setShowCreateContent(true)}
                  >
                    Create your first content
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics</h2>

            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600">
                    Analytics dashboard coming soon
                  </p>
                  <p className="text-sm text-gray-500">
                    Track student performance and AI insights
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Class Dialog */}
      <Dialog open={showCreateClass} onOpenChange={setShowCreateClass}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Class</DialogTitle>
            <DialogDescription>
              Set up a new class for your students.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="class-name">Class Name *</Label>
                <Input
                  id="class-name"
                  value={classForm.name}
                  onChange={(e) =>
                    setClassForm({ ...classForm, name: e.target.value })
                  }
                  placeholder="e.g., Mathematics 10A"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class-subject">Subject *</Label>
                <Select
                  value={classForm.subject}
                  onValueChange={(value) =>
                    setClassForm({ ...classForm, subject: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="English">English Language</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="Social Studies">
                      Social Studies
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="class-grade">Grade</Label>
                <Select
                  value={classForm.grade}
                  onValueChange={(value) =>
                    setClassForm({ ...classForm, grade: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Grade 9">Grade 9</SelectItem>
                    <SelectItem value="Grade 10">Grade 10</SelectItem>
                    <SelectItem value="Grade 11">Grade 11</SelectItem>
                    <SelectItem value="Grade 12">Grade 12</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="class-schedule">Schedule</Label>
                <Input
                  id="class-schedule"
                  value={classForm.schedule}
                  onChange={(e) =>
                    setClassForm({ ...classForm, schedule: e.target.value })
                  }
                  placeholder="e.g., Mon, Wed, Fri - 9:00 AM"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="class-description">Description</Label>
              <Textarea
                id="class-description"
                value={classForm.description}
                onChange={(e) =>
                  setClassForm({ ...classForm, description: e.target.value })
                }
                placeholder="Brief description of the class..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateClass(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateClass}>Create Class</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Content Dialog */}
      <Dialog open={showCreateContent} onOpenChange={setShowCreateContent}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Content</DialogTitle>
            <DialogDescription>
              Create lessons, assignments, or other educational content.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="content-title">Title *</Label>
                <Input
                  id="content-title"
                  value={contentForm.title}
                  onChange={(e) =>
                    setContentForm({ ...contentForm, title: e.target.value })
                  }
                  placeholder="e.g., Introduction to Algebra"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content-type">Type *</Label>
                <Select
                  value={contentForm.type}
                  onValueChange={(value) =>
                    setContentForm({ ...contentForm, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lesson">Lesson</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="content-subject">Subject *</Label>
                <Select
                  value={contentForm.subject}
                  onValueChange={(value) =>
                    setContentForm({ ...contentForm, subject: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="English">English Language</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="Social Studies">
                      Social Studies
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content-difficulty">Difficulty</Label>
                <Select
                  value={contentForm.difficulty}
                  onValueChange={(value) =>
                    setContentForm({ ...contentForm, difficulty: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content-description">Description</Label>
              <Textarea
                id="content-description"
                value={contentForm.description}
                onChange={(e) =>
                  setContentForm({
                    ...contentForm,
                    description: e.target.value,
                  })
                }
                placeholder="Describe the content objectives and activities..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateContent(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateContent}>Create Content</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Profile Settings Dialog */}
      <Dialog open={showProfileSettings} onOpenChange={setShowProfileSettings}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Profile Settings</span>
            </DialogTitle>
            <DialogDescription>
              Update your profile information and preferences.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Full Name *</Label>
                <Input
                  id="profile-name"
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, name: e.target.value })
                  }
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-email">Email *</Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, email: e.target.value })
                  }
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-subject">Primary Subject</Label>
              <Select
                value={profileForm.subject}
                onValueChange={(value) =>
                  setProfileForm({ ...profileForm, subject: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your primary subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="English Language">
                    English Language
                  </SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="Social Studies">Social Studies</SelectItem>
                  <SelectItem value="Computer Science">
                    Computer Science
                  </SelectItem>
                  <SelectItem value="Arts">Arts</SelectItem>
                  <SelectItem value="Physical Education">
                    Physical Education
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-bio">Bio</Label>
              <Textarea
                id="profile-bio"
                value={profileForm.bio}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, bio: e.target.value })
                }
                placeholder="Tell us about your teaching philosophy and experience..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Certifications</Label>
              <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-md min-h-[40px]">
                {profileForm.certifications.map((cert, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {cert}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-red-100"
                      onClick={() => {
                        const newCerts = profileForm.certifications.filter(
                          (_, i) => i !== index,
                        );
                        setProfileForm({
                          ...profileForm,
                          certifications: newCerts,
                        });
                      }}
                    >
                      ×
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a certification"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      const newCert = e.currentTarget.value.trim();
                      if (!profileForm.certifications.includes(newCert)) {
                        setProfileForm({
                          ...profileForm,
                          certifications: [
                            ...profileForm.certifications,
                            newCert,
                          ],
                        });
                      }
                      e.currentTarget.value = "";
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    const input =
                      e.currentTarget.parentElement?.querySelector("input");
                    if (input?.value.trim()) {
                      const newCert = input.value.trim();
                      if (!profileForm.certifications.includes(newCert)) {
                        setProfileForm({
                          ...profileForm,
                          certifications: [
                            ...profileForm.certifications,
                            newCert,
                          ],
                        });
                      }
                      input.value = "";
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowProfileSettings(false)}
              disabled={profileLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} disabled={profileLoading}>
              {profileLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message Modal */}
      <MessageModal
        isOpen={showMessageModal}
        onClose={() => {
          setShowMessageModal(false);
          setSelectedMessage(null);
        }}
        message={selectedMessage}
        onAction={handleMessageAction}
        onReply={handleMessageReply}
      />

      {/* Integration Status Component */}
      <IntegrationStatus />

      {/* Development Banner */}
      <DevelopmentBanner />
    </div>
  );
};

export default TeacherDashboard;
