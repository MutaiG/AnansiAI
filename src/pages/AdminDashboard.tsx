import React, { useState, useEffect, useMemo, Suspense, lazy } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Brain,
  Users,
  Settings,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Bell,
  LogOut,
  Plus,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Calendar,
  BarChart3,
  Shield,
  Database,
  Monitor,
  FileText,
  Key,
  EyeOff,
  Activity,
  Zap,
  GraduationCap,
  UserPlus,
  School,
  Award,
  Target,
  TrendingDown,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Star,
  BookOpen,
  PieChart,
  LineChart,
  BarChart,
  Calendar as CalendarIcon,
  Save,
  X,
  CheckSquare,
  AlertCircle,
  Info,
  Lightbulb,
  Cog,
  Database as DatabaseIcon,
  Globe,
  Lock,
  Unlock,
  Upload,
  UserCheck,
  UserX,
  MessageSquare,
  Archive,
  Copy,
  Send,
  MoreHorizontal,
  CircleDot,
  Layers,
  PlusCircle,
  Briefcase,
  Building,
  ClipboardList,
  Play,
  Smile,
  Heart,
  Focus,
  Coffee,
  Headphones,
  Sparkles,
  TrendingUp as Trending,
  Timer,
  ChevronRight,
  ExternalLink,
  DollarSign,
  Calendar as CalendarDays,
  Clock as ClockIcon,
  Users as UsersIcon,
  BrainCircuit,
  Gamepad2,
  Trophy,
  Bookmark,
  ThumbsUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useAdminDashboard,
  useCreateUser,
  useUpdateUser,
  useCreateSubject,
} from "@/hooks/useAdminApi";
import type {
  AdminDashboardData,
  UserData,
  SystemAlert,
  SubjectData,
} from "@/hooks/useAdminApi";
import { MessageModal, type SystemMessage } from "@/components/MessageModal";
import usePageTitle from "@/hooks/usePageTitle";
import { Mood } from "@/types/education";

// Lazy load AI components for better performance
const LazyBehaviorAnalytics = lazy(() =>
  import("@/components/BehaviorAnalytics").catch(() => ({
    default: () => (
      <div className="p-8 text-center">
        <Activity className="w-12 h-12 mx-auto mb-4 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Behavior Analytics
        </h3>
        <p className="text-gray-600">
          Advanced behavior analytics temporarily unavailable
        </p>
      </div>
    ),
  })),
);

const LazyAITwinChat = lazy(() =>
  import("@/components/AITwinChat").catch(() => ({
    default: () => (
      <div className="p-4 text-center">
        <Brain className="w-8 h-8 mx-auto mb-2 text-blue-600" />
        <p className="text-gray-600">
          AI Twin monitoring temporarily unavailable
        </p>
      </div>
    ),
  })),
);

const AdminDashboard = () => {
  usePageTitle("Admin Dashboard - Anansi AI");
  const navigate = useNavigate();

  // API hooks
  const { data: dashboardData, loading, error, reload } = useAdminDashboard();
  const { createUser, loading: createUserLoading } = useCreateUser();
  const { updateUser, loading: updateUserLoading } = useUpdateUser();
  const { createSubject, loading: createSubjectLoading } = useCreateSubject();

  const [selectedTab, setSelectedTab] = useState("overview");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);
  const [isAIConfigOpen, setIsAIConfigOpen] = useState(false);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [isAIMonitorOpen, setIsAIMonitorOpen] = useState(false);
  const [isBehaviorReportOpen, setIsBehaviorReportOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [subjectSearchQuery, setSubjectSearchQuery] = useState("");
  const [usersPage, setUsersPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Message modal state
  const [currentMessage, setCurrentMessage] = useState<SystemMessage | null>(
    null,
  );
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  // Show message function
  const showMessage = (message: SystemMessage) => {
    setCurrentMessage(message);
    setIsMessageModalOpen(true);
  };

  const closeMessageModal = () => {
    setIsMessageModalOpen(false);
    setCurrentMessage(null);
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleSelectAllUsers = () => {
    const currentPageUsers = filteredUsers.slice(
      (usersPage - 1) * usersPerPage,
      usersPage * usersPerPage,
    );
    const allSelected = currentPageUsers.every((user) =>
      selectedUsers.includes(user.id),
    );

    if (allSelected) {
      setSelectedUsers((prev) =>
        prev.filter((id) => !currentPageUsers.map((u) => u.id).includes(id)),
      );
    } else {
      setSelectedUsers((prev) => [
        ...new Set([...prev, ...currentPageUsers.map((u) => u.id)]),
      ]);
    }
  };

  const handleBulkAction = (action: string) => {
    const count = selectedUsers.length;
    let actionText = "";

    switch (action) {
      case "activate":
        actionText = "activated";
        break;
      case "deactivate":
        actionText = "deactivated";
        break;
      case "delete":
        actionText = "deleted";
        break;
      case "export":
        actionText = "exported";
        break;
    }

    showMessage({
      id: Date.now().toString(),
      type: action === "delete" ? "warning" : "success",
      priority: "medium",
      title: `Bulk ${action.charAt(0).toUpperCase() + action.slice(1)}`,
      message: `${count} user${count > 1 ? "s" : ""} ${actionText} successfully.`,
      timestamp: new Date().toISOString(),
    });

    setSelectedUsers([]);
  };

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "student" as "student" | "teacher",
    regNo: "",
    grade: "",
    subject: "",
    bio: "",
    experience: "",
  });

  const [newSubject, setNewSubject] = useState({
    name: "",
    description: "",
    category: "",
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

  const [aiConfig, setAIConfig] = useState({
    responseAccuracy: [85],
    personalityLevel: [70],
    helpfulnessLevel: [90],
    creativityLevel: [60],
    enableAdvancedFeatures: true,
    autoUpdateModels: true,
    dataRetentionDays: 90,
    aiTwinEnabled: true,
    behaviorTrackingEnabled: true,
    personalizedLearning: true,
  });

  const [schoolSettings, setSchoolSettings] = useState({
    schoolName: "",
    adminName: "",
    department: "",
  });

  // Extract data with fallbacks - memoized to prevent recreation
  const adminInfo = useMemo(() => {
    if (dashboardData?.adminProfile) {
      return {
        name: dashboardData.adminProfile.fullName,
        school: dashboardData.adminProfile.schoolName,
        lastLogin: dashboardData.adminProfile.lastLogin,
        role: dashboardData.adminProfile.role,
        department: "Administration", // Default value since not in interface
        email: dashboardData.adminProfile.email,
        phoneNumber: dashboardData.adminProfile.phoneNumber,
      };
    }
    return {
      name: "Dr. Sarah Johnson",
      school: "Westfield High School",
      lastLogin: "Today, 9:30 AM",
      role: "Principal",
      department: "Administration",
      email: "admin@school.edu",
      phoneNumber: "+1-555-0123",
    };
  }, [dashboardData?.adminProfile]);

  // Authentication check
  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (!userRole || !["ADMIN", "SUPER_ADMIN"].includes(userRole)) {
      // Auto-set admin role for development
      localStorage.setItem("userRole", "ADMIN");
      localStorage.setItem("userId", "ADM001");
      localStorage.setItem("userName", "Dr. Sarah Johnson");
      console.log("Setting admin role for development");
    }
  }, []);

  // Initialize school settings when adminInfo is available
  useEffect(() => {
    if (adminInfo && adminInfo.name) {
      setSchoolSettings((prev) => {
        // Only update if values are actually different
        if (
          prev.schoolName !== (adminInfo.school || "") ||
          prev.adminName !== (adminInfo.name || "") ||
          prev.department !== (adminInfo.department || "")
        ) {
          return {
            schoolName: adminInfo.school || "",
            adminName: adminInfo.name || "",
            department: adminInfo.department || "",
          };
        }
        return prev;
      });
    }
  }, [adminInfo.school, adminInfo.name, adminInfo.department]);

  const schoolStats = {
    totalStudents: dashboardData?.schoolStats?.totalStudents ?? 1247,
    totalTeachers: dashboardData?.schoolStats?.totalTeachers ?? 89,
    totalClasses: 34, // Not in interface, using fallback
    totalSubjects: dashboardData?.schoolStats?.totalSubjects ?? 12,
    avgPerformance: dashboardData?.schoolStats?.avgPerformance ?? 87,
    systemUptime: dashboardData?.schoolStats?.systemUptime ?? 99.8,
    dataStorage: dashboardData?.schoolStats?.dataStorage ?? 45.2,
    activeUsers: dashboardData?.schoolStats?.activeUsers ?? 234,
    dailyLogins: dashboardData?.schoolStats?.dailyLogins ?? 456,
    coursesCreated: 28, // Not in interface, using fallback
    assignmentsCompleted: 1847, // Not in interface, using fallback
    aiInteractions: 892, // Not in interface, using fallback
    behaviorAlerts: 15, // Not in interface, using fallback
    avgEngagement: 78, // Not in interface, using fallback
    achievementsEarned: 156, // Not in interface, using fallback
  };

  const systemAlerts = dashboardData?.systemAlerts || [];
  const users = dashboardData?.users || [];
  const subjects = dashboardData?.subjects || [];

  // Mock AI and behavior data (would come from API in real system)
  const aiSystemStats = {
    totalInteractions: 8924,
    activeAITwins: 892,
    avgAccuracy: 94.2,
    behaviorAlertsToday: 12,
    moodAnalysisActive: 1156,
    personalizedRecommendations: 2341,
    studentEngagementUp: 15.3,
    averageSessionTime: "24 min",
  };

  const recentBehaviorAlerts = [
    {
      id: "ba001",
      studentName: "Alex Thompson",
      type: "Engagement Drop",
      severity: "medium",
      timestamp: "2 hours ago",
      description: "Significant decrease in course engagement",
    },
    {
      id: "ba002",
      studentName: "Sarah Wilson",
      type: "Mood Change",
      severity: "low",
      timestamp: "4 hours ago",
      description: "Detected shift to stressed mood state",
    },
    {
      id: "ba003",
      studentName: "Mike Chen",
      type: "Performance Alert",
      severity: "high",
      timestamp: "6 hours ago",
      description: "Struggling with Mathematics concepts",
    },
  ];

  const topPerformingStudents = [
    { name: "Emma Davis", grade: "A+", subject: "Science", progress: 98 },
    {
      name: "James Rodriguez",
      grade: "A",
      subject: "Mathematics",
      progress: 96,
    },
    { name: "Olivia Johnson", grade: "A", subject: "English", progress: 94 },
    { name: "Noah Brown", grade: "A-", subject: "History", progress: 92 },
  ];

  const handleAddUser = async () => {
    if (!newUser.name) {
      showMessage({
        id: Date.now().toString(),
        type: "error",
        priority: "medium",
        title: "Validation Error",
        message: "Please enter the user's name",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (
      newUser.role === "teacher" &&
      (!newUser.email || !newUser.phone || !newUser.subject)
    ) {
      showMessage({
        id: Date.now().toString(),
        type: "error",
        priority: "medium",
        title: "Validation Error",
        message:
          "Please fill in all required fields for teacher (email, phone, and subject)",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (newUser.role === "student" && (!newUser.regNo || !newUser.grade)) {
      showMessage({
        id: Date.now().toString(),
        type: "error",
        priority: "medium",
        title: "Validation Error",
        message: "Please fill in registration number and grade for student",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      const userData = {
        fullName: newUser.name,
        email:
          newUser.email ||
          `${newUser.regNo || "temp"}@${adminInfo.school.replace(/\s+/g, "").toLowerCase()}.edu`,
        phoneNumber: newUser.phone,
        address: "", // Could be added to form
        role: newUser.role.toUpperCase() as "STUDENT" | "TEACHER",
      };

      const success = await createUser(userData);

      if (success) {
        showMessage({
          id: Date.now().toString(),
          type: "success",
          priority: "high",
          title: "User Created Successfully",
          message: `New ${newUser.role} account has been created successfully.`,
          details: `The user can now log in using their email address: ${userData.email}${newUser.role === "student" ? "\n\nAI Twin will be automatically configured for personalized learning." : ""}`,
          timestamp: new Date().toISOString(),
          requiresResponse: false,
        });

        setIsAddUserOpen(false);
        setNewUser({
          name: "",
          email: "",
          phone: "",
          role: "student",
          regNo: "",
          grade: "",
          subject: "",
          bio: "",
          experience: "",
        });

        // Reload dashboard to show new user
        reload();
      } else {
        showMessage({
          id: Date.now().toString(),
          type: "error",
          priority: "high",
          title: "User Creation Failed",
          message:
            "Failed to create user. Please check the information and try again.",
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error creating user:", error);
      showMessage({
        id: Date.now().toString(),
        type: "error",
        priority: "critical",
        title: "System Error",
        message: "An unexpected error occurred while creating the user.",
        details:
          error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handleAddSubject = async () => {
    if (!newSubject.name || !newSubject.description) {
      showMessage({
        id: Date.now().toString(),
        type: "error",
        priority: "medium",
        title: "Validation Error",
        message: "Please fill in both subject name and description",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      const success = await createSubject({
        subjectName: newSubject.name,
        description: newSubject.description,
      });

      if (success) {
        showMessage({
          id: Date.now().toString(),
          type: "success",
          priority: "high",
          title: "Subject Created Successfully",
          message: `Subject "${newSubject.name}" has been added to the system.`,
          details:
            "AI will automatically generate personalized content for this subject.",
          timestamp: new Date().toISOString(),
        });

        setIsAddSubjectOpen(false);
        setNewSubject({ name: "", description: "", category: "" });
        reload();
      } else {
        showMessage({
          id: Date.now().toString(),
          type: "error",
          priority: "high",
          title: "Subject Creation Failed",
          message: "Failed to create subject. Please try again.",
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error creating subject:", error);
      showMessage({
        id: Date.now().toString(),
        type: "error",
        priority: "critical",
        title: "System Error",
        message: "An unexpected error occurred while creating the subject.",
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage({
        id: Date.now().toString(),
        type: "error",
        priority: "medium",
        title: "Password Mismatch",
        message: "New passwords don't match. Please try again.",
        timestamp: new Date().toISOString(),
      });
      return;
    }
    if (passwordData.newPassword.length < 8) {
      showMessage({
        id: Date.now().toString(),
        type: "error",
        priority: "medium",
        title: "Weak Password",
        message: "Password must be at least 8 characters long.",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Simulate password change
    console.log("Password change requested");
    showMessage({
      id: Date.now().toString(),
      type: "success",
      priority: "medium",
      title: "Password Changed",
      message: "Your password has been updated successfully.",
      timestamp: new Date().toISOString(),
    });

    setIsPasswordChangeOpen(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleSaveSchoolSettings = () => {
    console.log("Saving school settings:", schoolSettings);
    showMessage({
      id: Date.now().toString(),
      type: "success",
      priority: "medium",
      title: "Settings Saved",
      message: "School information has been updated successfully.",
      timestamp: new Date().toISOString(),
    });
  };

  const handleExportReport = () => {
    showMessage({
      id: Date.now().toString(),
      type: "info",
      priority: "low",
      title: "Export Started",
      message:
        "Your comprehensive report is being generated and will be downloaded shortly.",
      details:
        "Report includes user analytics, AI insights, and behavior patterns.",
      timestamp: new Date().toISOString(),
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const handleViewUser = (user: UserData) => {
    setSelectedUser(user);
    setIsUserDetailsOpen(true);
  };

  const handleEditUser = (user: UserData) => {
    setNewUser({
      name: user.fullName,
      email: user.email,
      phone: user.phoneNumber || "",
      role: (user.role?.toLowerCase() || "student") as "student" | "teacher",
      regNo: "",
      grade: "",
      subject: "",
      bio: "",
      experience: "",
    });
    setIsAddUserOpen(true);
  };

  const handleDeleteUser = (user: UserData) => {
    showMessage({
      id: Date.now().toString(),
      type: "warning",
      priority: "high",
      title: "Confirm Deletion",
      message: `Are you sure you want to delete ${user.fullName}? This action cannot be undone.`,
      details:
        "This will also remove all associated AI Twin data and learning progress.",
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: "confirm",
          label: "Delete User",
          variant: "destructive",
          action: () => {
            // Implement actual deletion
            showMessage({
              id: Date.now().toString(),
              type: "success",
              priority: "medium",
              title: "User Deleted",
              message: `${user.fullName} has been removed from the system.`,
              timestamp: new Date().toISOString(),
            });
          },
        },
      ],
    });
  };

  const handleViewAITwin = (user: UserData) => {
    showMessage({
      id: Date.now().toString(),
      type: "info",
      priority: "medium",
      title: `${user.fullName}'s AI Twin`,
      message: "AI Twin Analytics & Personalization Data",
      details: `• Learning Style: Visual/Kinesthetic\n• Engagement Level: High (${Math.floor(Math.random() * 20) + 80}%)\n• Preferred Learning Time: Morning\n��� Strengths: Mathematics, Science\n• Areas for Improvement: Essay Writing\n• AI Interactions Today: ${Math.floor(Math.random() * 50) + 20}\n• Mood Analysis: Focused & Motivated\n• Personalized Recommendations: ${Math.floor(Math.random() * 10) + 5} pending`,
      timestamp: new Date().toISOString(),
      requiresResponse: false,
    });
  };

  const handleToggleUserStatus = (user: UserData) => {
    const newStatus = user.isActive ? "inactive" : "active";
    showMessage({
      id: Date.now().toString(),
      type: "success",
      priority: "medium",
      title: "User Status Updated",
      message: `${user.fullName} has been ${newStatus === "active" ? "activated" : "deactivated"}.`,
      details:
        newStatus === "active"
          ? "User can now access the system and AI Twin services."
          : "User access has been temporarily suspended.",
      timestamp: new Date().toISOString(),
    });
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.fullName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.id || "").toLowerCase().includes(searchQuery.toLowerCase());

    const userRole = user.role ? user.role.toLowerCase() : "";
    const matchesRole = filterRole === "all" || userRole === filterRole;

    const userStatus = user.isActive ? "active" : "inactive";
    const matchesStatus = filterStatus === "all" || userStatus === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Filter subjects based on search
  const filteredSubjects = subjects.filter(
    (subject) =>
      (subject.subjectName || "")
        .toLowerCase()
        .includes(subjectSearchQuery.toLowerCase()) ||
      (subject.description || "")
        .toLowerCase()
        .includes(subjectSearchQuery.toLowerCase()),
  );

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role.toLowerCase()) {
      case "teacher":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "student":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case "info":
        return <Info className="w-4 h-4 text-blue-600" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Create notifications array from system alerts for compatibility
  const notifications = systemAlerts.map((alert) => ({
    id: alert.id,
    type: alert.type as
      | "alert"
      | "system"
      | "user"
      | "maintenance"
      | "performance",
    title: alert.title,
    message: alert.message,
    time: alert.timestamp,
    read: alert.resolved,
    priority: alert.severity as "high" | "medium" | "low",
  }));

  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const highPriorityAlerts = systemAlerts.filter(
    (alert) => alert.severity === "high",
  ).length;

  // Available subjects for teacher assignment
  const availableSubjects = subjects
    .map((subject) => subject.subjectName)
    .concat([
      "Mathematics",
      "Science",
      "English",
      "History",
      "Geography",
      "Physics",
      "Chemistry",
      "Biology",
      "Computer Science",
      "Art",
      "Music",
      "Physical Education",
    ]);

  // Remove duplicates
  const uniqueSubjects = [...new Set(availableSubjects)];

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg font-medium text-gray-600">
            Loading Admin Dashboard...
          </p>
          <p className="text-sm text-gray-500">
            Initializing AI systems and behavior analytics...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Error Loading Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">{error}</p>
            <Button onClick={reload} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <img
                  src="https://cdn.builder.io/api/v1/assets/2d09da496e544a1eab05e596d02031d8/twinternet-logo-b18833?format=webp&width=800"
                  alt="AnansiAI Logo"
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <h1 className="font-bold text-xl text-gray-800">AnansiAI</h1>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <BrainCircuit className="w-3 h-3" />
                    Admin Portal
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* AI Status Indicator */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium">AI Active</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>AI systems running normally</p>
                    <p className="text-xs text-gray-500">
                      {aiSystemStats.activeAITwins} AI Twins active
                    </p>
                  </TooltipContent>
                </Tooltip>

                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => setIsNotificationOpen(true)}
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </Button>

                {/* Quick AI Monitor */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsAIMonitorOpen(true)}
                    >
                      <Brain className="w-5 h-5 text-purple-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>AI System Monitor</p>
                  </TooltipContent>
                </Tooltip>

                {/* Settings */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Settings className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Account Settings</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setIsPasswordChangeOpen(true)}
                    >
                      <Key className="w-4 h-4 mr-2" />
                      Change Password
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsAIConfigOpen(true)}>
                      <Brain className="w-4 h-4 mr-2" />
                      AI Configuration
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback>
                      {(adminInfo.name || "")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium text-gray-800">
                      {adminInfo.name}
                    </p>
                    <p className="text-gray-600">{adminInfo.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  School Administration Center
                </h2>
                <p className="text-gray-600 flex items-center gap-2">
                  <School className="w-4 h-4" />
                  Welcome back, {adminInfo.name} • {adminInfo.school}
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Last login: {adminInfo.lastLogin}
                  </div>
                  <div className="flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    {schoolStats.activeUsers} users active
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg">
                  <p className="text-sm font-medium">AI Accuracy</p>
                  <p className="text-xl font-bold">
                    {aiSystemStats.avgAccuracy}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* High Priority Alerts */}
          {highPriorityAlerts > 0 && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">
                {highPriorityAlerts} High Priority Alert
                {highPriorityAlerts > 1 ? "s" : ""} Require Attention
              </AlertTitle>
              <AlertDescription className="text-red-700">
                Please review the system alerts in the notifications panel.
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-4"
                  onClick={() => setIsNotificationOpen(true)}
                >
                  View Alerts
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Main Dashboard Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="subjects" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Subjects
              </TabsTrigger>
              <TabsTrigger
                value="ai-insights"
                className="flex items-center gap-2"
              >
                <Brain className="w-4 h-4" />
                AI Insights
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Reports
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Enhanced Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="relative overflow-hidden border-l-4 border-l-blue-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Students
                    </CardTitle>
                    <Users className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {(schoolStats.totalStudents || 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +5.2% from last month
                    </p>
                    <div className="mt-2">
                      <Progress value={78} className="h-1" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-l-4 border-l-green-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active AI Twins
                    </CardTitle>
                    <Brain className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {aiSystemStats.activeAITwins.toLocaleString()}
                    </div>
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {aiSystemStats.avgAccuracy}% accuracy
                    </p>
                    <div className="mt-2">
                      <Progress value={94} className="h-1" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-l-4 border-l-purple-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Engagement Rate
                    </CardTitle>
                    <Activity className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">
                      {schoolStats.avgEngagement}%
                    </div>
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />+
                      {aiSystemStats.studentEngagementUp}% this week
                    </p>
                    <div className="mt-2">
                      <Progress
                        value={schoolStats.avgEngagement}
                        className="h-1"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-l-4 border-l-orange-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Achievements
                    </CardTitle>
                    <Trophy className="h-4 w-4 text-orange-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">
                      {schoolStats.achievementsEarned}
                    </div>
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      This month
                    </p>
                    <div className="mt-2">
                      <Progress value={85} className="h-1" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions and AI Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-blue-600" />
                      Quick Actions
                    </CardTitle>
                    <CardDescription>
                      Common administrative tasks
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      className="w-full"
                      onClick={() => setIsAddUserOpen(true)}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add User
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsAddSubjectOpen(true)}
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Subject
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsBehaviorReportOpen(true)}
                    >
                      <Activity className="w-4 h-4 mr-2" />
                      Behavior Report
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleExportReport}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-purple-600" />
                      AI System Overview
                    </CardTitle>
                    <CardDescription>
                      Real-time AI performance and insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Total Interactions
                          </span>
                          <span className="font-semibold">
                            {aiSystemStats.totalInteractions.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Avg Session
                          </span>
                          <span className="font-semibold">
                            {aiSystemStats.averageSessionTime}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Mood Analysis
                          </span>
                          <span className="font-semibold">
                            {aiSystemStats.moodAnalysisActive}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Recommendations
                          </span>
                          <span className="font-semibold">
                            {aiSystemStats.personalizedRecommendations.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Alerts Today
                          </span>
                          <span className="font-semibold text-orange-600">
                            {aiSystemStats.behaviorAlertsToday}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Engagement Up
                          </span>
                          <span className="font-semibold text-green-600">
                            +{aiSystemStats.studentEngagementUp}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setIsAIMonitorOpen(true)}
                      >
                        <Brain className="w-4 h-4 mr-2" />
                        View AI Monitor
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Behavior Alerts and Top Performers */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      Recent Behavior Alerts
                    </CardTitle>
                    <CardDescription>
                      Latest AI-detected behavior patterns
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recentBehaviorAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Activity className="w-4 h-4 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">
                              {alert.studentName}
                            </p>
                            <Badge
                              className={getSeverityBadgeClass(alert.severity)}
                            >
                              {alert.severity}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600">{alert.type}</p>
                          <p className="text-xs text-gray-500">
                            {alert.timestamp}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsBehaviorReportOpen(true)}
                    >
                      View All Alerts
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-600" />
                      Top Performing Students
                    </CardTitle>
                    <CardDescription>
                      Students excelling with AI assistance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {topPerformingStudents.map((student, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"
                      >
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-semibold text-sm">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">
                              {student.name}
                            </p>
                            <span className="font-semibold text-green-600">
                              {student.grade}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">
                            {student.subject}
                          </p>
                          <div className="mt-1">
                            <Progress
                              value={student.progress}
                              className="h-1"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      View All Students
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    User Management
                  </h3>
                  <p className="text-sm text-gray-600">
                    Manage students and teachers • {filteredUsers.length} of{" "}
                    {users.length} users • {aiSystemStats.activeAITwins} AI
                    Twins active
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleBulkAction("export")}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export All
                  </Button>
                  <Button onClick={() => setIsAddUserOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </div>

              {/* Search and Filters */}
              <Card>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="Search users by name, email, or registration number..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <Select value={filterRole} onValueChange={setFilterRole}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Roles</SelectItem>
                          <SelectItem value="student">Students</SelectItem>
                          <SelectItem value="teacher">Teachers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Select
                        value={filterStatus}
                        onValueChange={setFilterStatus}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Users Table */}
              <Card>
                {selectedUsers.length > 0 && (
                  <div className="p-4 border-b bg-blue-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">
                          {selectedUsers.length} user
                          {selectedUsers.length > 1 ? "s" : ""} selected
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleBulkAction("activate")}
                        >
                          <UserCheck className="w-4 h-4 mr-1" />
                          Activate
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleBulkAction("deactivate")}
                        >
                          <UserX className="w-4 h-4 mr-1" />
                          Deactivate
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleBulkAction("export")}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Export
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleBulkAction("delete")}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <input
                            type="checkbox"
                            checked={filteredUsers
                              .slice(
                                (usersPage - 1) * usersPerPage,
                                usersPage * usersPerPage,
                              )
                              .every((user) => selectedUsers.includes(user.id))}
                            onChange={handleSelectAllUsers}
                            className="rounded border-gray-300"
                            aria-label="Select all users"
                            title="Select all users"
                            placeholder="Select all users"
                          />
                        </TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>AI Twin</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <div className="flex flex-col items-center gap-2">
                              <Users className="w-8 h-8 text-gray-400" />
                              <p className="text-gray-500">
                                {searchQuery ||
                                filterRole !== "all" ||
                                filterStatus !== "all"
                                  ? "No users match your filters"
                                  : "No users found"}
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers
                          .slice(
                            (usersPage - 1) * usersPerPage,
                            usersPage * usersPerPage,
                          )
                          .map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>
                                <input
                                  type="checkbox"
                                  checked={selectedUsers.includes(user.id)}
                                  onChange={() => handleSelectUser(user.id)}
                                  className="rounded border-gray-300"
                                  aria-label={`Select user ${user.fullName}`}
                                  title={`Select user ${user.fullName}`}
                                  placeholder={`Select user ${user.fullName}`}
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src={user.photoUrl} />
                                    <AvatarFallback>
                                      {(user.fullName || "")
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">
                                      {user.fullName}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {user.email}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={getRoleBadgeClass(
                                    user.role?.toLowerCase() || "",
                                  )}
                                >
                                  {user.role?.toLowerCase() || "unknown"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={getStatusBadgeClass(
                                    user.isActive ? "active" : "inactive",
                                  )}
                                >
                                  {user.isActive ? "active" : "inactive"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {user.role?.toLowerCase() === "student" ? (
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm text-gray-600">
                                      Active
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-sm text-gray-400">
                                    N/A
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>{user.lastLogin}</TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => handleViewUser(user)}
                                    >
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Profile
                                    </DropdownMenuItem>
                                    {user.role?.toLowerCase() === "student" && (
                                      <DropdownMenuItem
                                        onClick={() => handleViewAITwin(user)}
                                      >
                                        <Brain className="w-4 h-4 mr-2" />
                                        View AI Twin
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                      onClick={() => handleEditUser(user)}
                                    >
                                      <Edit className="w-4 h-4 mr-2" />
                                      Edit User
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleToggleUserStatus(user)
                                      }
                                    >
                                      {user.isActive ? (
                                        <>
                                          <UserX className="w-4 h-4 mr-2" />
                                          Deactivate
                                        </>
                                      ) : (
                                        <>
                                          <UserCheck className="w-4 h-4 mr-2" />
                                          Activate
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() => handleDeleteUser(user)}
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete User
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                      )}
                    </TableBody>
                  </Table>
                  {filteredUsers.length > usersPerPage && (
                    <div className="flex items-center justify-between p-4 border-t">
                      <div className="text-sm text-gray-600">
                        Showing {(usersPage - 1) * usersPerPage + 1} to{" "}
                        {Math.min(
                          usersPage * usersPerPage,
                          filteredUsers.length,
                        )}{" "}
                        of {filteredUsers.length} users
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setUsersPage((prev) => Math.max(1, prev - 1))
                          }
                          disabled={usersPage === 1}
                        >
                          Previous
                        </Button>
                        <div className="flex items-center gap-1">
                          {Array.from(
                            {
                              length: Math.ceil(
                                filteredUsers.length / usersPerPage,
                              ),
                            },
                            (_, i) => i + 1,
                          )
                            .slice(
                              Math.max(0, usersPage - 3),
                              Math.min(
                                Math.ceil(filteredUsers.length / usersPerPage),
                                usersPage + 2,
                              ),
                            )
                            .map((page) => (
                              <Button
                                key={page}
                                variant={
                                  page === usersPage ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => setUsersPage(page)}
                                className="w-8 h-8 p-0"
                              >
                                {page}
                              </Button>
                            ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setUsersPage((prev) =>
                              Math.min(
                                Math.ceil(filteredUsers.length / usersPerPage),
                                prev + 1,
                              ),
                            )
                          }
                          disabled={
                            usersPage >=
                            Math.ceil(filteredUsers.length / usersPerPage)
                          }
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subjects" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Subject Management
                  </h3>
                  <p className="text-sm text-gray-600">
                    Manage school subjects • {filteredSubjects.length} of{" "}
                    {subjects.length} subjects • AI-powered content generation
                    enabled
                  </p>
                </div>
                <Button onClick={() => setIsAddSubjectOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Subject
                </Button>
              </div>

              {/* Subject Search */}
              <Card>
                <CardContent className="p-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search subjects by name or description..."
                      value={subjectSearchQuery}
                      onChange={(e) => setSubjectSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Subjects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSubjects.length === 0 ? (
                  <Card className="col-span-full">
                    <CardContent className="p-8 text-center">
                      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">
                        {subjectSearchQuery
                          ? "No subjects match your search"
                          : "No subjects found"}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredSubjects.map((subject) => (
                    <Card
                      key={subject.subjectId}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                            {subject.subjectName}
                          </CardTitle>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Brain className="w-4 h-4 mr-2" />
                                AI Content
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Subject
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Subject
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">
                          {subject.description}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">
                            ID: {subject.subjectId}
                          </span>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-purple-100 text-purple-700">
                              <Brain className="w-3 h-3 mr-1" />
                              AI Enhanced
                            </Badge>
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700"
                            >
                              Active
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="ai-insights" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Brain className="w-6 h-6 text-purple-600" />
                    AI System Insights
                  </h3>
                  <p className="text-sm text-gray-600">
                    Monitor AI behavior analysis, recommendations, and system
                    performance
                  </p>
                </div>
                <Button onClick={() => setIsAIMonitorOpen(true)}>
                  <Brain className="w-4 h-4 mr-2" />
                  Open AI Monitor
                </Button>
              </div>

              {/* AI System Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-purple-200 bg-purple-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-800">
                      <BrainCircuit className="w-5 h-5" />
                      AI Twins Active
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {aiSystemStats.activeAITwins}
                    </div>
                    <p className="text-sm text-purple-700">
                      Operating at {aiSystemStats.avgAccuracy}% accuracy
                    </p>
                    <div className="mt-4">
                      <Progress value={94} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-800">
                      <Activity className="w-5 h-5" />
                      Behavior Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {aiSystemStats.moodAnalysisActive}
                    </div>
                    <p className="text-sm text-blue-700">
                      Students under mood analysis
                    </p>
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-blue-600">
                        <span>Happy: 67%</span>
                        <span>Focused: 23%</span>
                        <span>Stressed: 10%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <Lightbulb className="w-5 h-5" />
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {aiSystemStats.personalizedRecommendations.toLocaleString()}
                    </div>
                    <p className="text-sm text-green-700">
                      Generated this month
                    </p>
                    <div className="mt-4">
                      <Progress value={87} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Behavior Analytics Component */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-orange-600" />
                    System-wide Behavior Analytics
                  </CardTitle>
                  <CardDescription>
                    Real-time behavior monitoring and analysis across all
                    students
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense
                    fallback={
                      <div className="flex items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="ml-2">
                          Loading behavior analytics...
                        </span>
                      </div>
                    }
                  >
                    <LazyBehaviorAnalytics
                      studentId="system-overview"
                      currentMood={Mood.Neutral}
                      riskScore={0.15}
                    />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      System Performance
                    </CardTitle>
                    <CardDescription>
                      Monitor system health and performance metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>System Uptime</span>
                        <span>{schoolStats.systemUptime}%</span>
                      </div>
                      <Progress
                        value={schoolStats.systemUptime}
                        className="h-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>AI Processing Load</span>
                        <span>67%</span>
                      </div>
                      <Progress value={67} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Data Storage Used</span>
                        <span>{schoolStats.dataStorage}%</span>
                      </div>
                      <Progress
                        value={schoolStats.dataStorage}
                        className="h-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Average Performance</span>
                        <span>{schoolStats.avgPerformance}%</span>
                      </div>
                      <Progress
                        value={schoolStats.avgPerformance}
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-600" />
                      Usage Statistics
                    </CardTitle>
                    <CardDescription>
                      Daily activity and engagement metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {schoolStats.activeUsers}
                        </div>
                        <p className="text-xs text-gray-600">Active Users</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {schoolStats.dailyLogins}
                        </div>
                        <p className="text-xs text-gray-600">Daily Logins</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {schoolStats.coursesCreated}
                        </div>
                        <p className="text-xs text-gray-600">Courses Created</p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {(
                            schoolStats.assignmentsCompleted || 0
                          ).toLocaleString()}
                        </div>
                        <p className="text-xs text-gray-600">
                          Assignments Completed
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t">
                      <h4 className="font-medium mb-3">
                        AI Engagement Metrics
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>AI Interactions Today</span>
                          <span className="font-semibold">
                            {Math.floor(aiSystemStats.totalInteractions / 30)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Avg Session Time</span>
                          <span className="font-semibold">
                            {aiSystemStats.averageSessionTime}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Student Satisfaction</span>
                          <span className="font-semibold text-green-600">
                            92%
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      User Analytics Report
                    </CardTitle>
                    <CardDescription>
                      Comprehensive user analytics, engagement, and performance
                      data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div>• User activity patterns</div>
                      <div>• Learning progress analytics</div>
                      <div>• AI interaction summaries</div>
                    </div>
                    <Button className="w-full" onClick={handleExportReport}>
                      <Download className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-purple-600" />
                      AI Performance Report
                    </CardTitle>
                    <CardDescription>
                      AI Twin effectiveness, behavior analysis, and
                      recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div>• AI Twin accuracy metrics</div>
                      <div>• Behavior prediction success</div>
                      <div>• Personalization effectiveness</div>
                    </div>
                    <Button className="w-full" onClick={handleExportReport}>
                      <Download className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      Academic Performance
                    </CardTitle>
                    <CardDescription>
                      Student achievements, progress tracking, and learning
                      outcomes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div>• Grade distributions</div>
                      <div>• Subject performance</div>
                      <div>• Achievement statistics</div>
                    </div>
                    <Button className="w-full" onClick={handleExportReport}>
                      <Download className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-orange-600" />
                      Behavior Analysis Report
                    </CardTitle>
                    <CardDescription>
                      Student behavior patterns, mood analysis, and
                      interventions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div>• Mood trend analysis</div>
                      <div>• Risk factor identification</div>
                      <div>• Intervention effectiveness</div>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => setIsBehaviorReportOpen(true)}
                    >
                      <Activity className="w-4 h-4 mr-2" />
                      View Live Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-red-600" />
                      System Security Report
                    </CardTitle>
                    <CardDescription>
                      Security events, access logs, and system integrity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div>• Login activity logs</div>
                      <div>• Security incident reports</div>
                      <div>• Data access audits</div>
                    </div>
                    <Button className="w-full" onClick={handleExportReport}>
                      <Download className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                      Custom Reports
                    </CardTitle>
                    <CardDescription>
                      Build custom reports with specific metrics and timeframes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div>• Custom date ranges</div>
                      <div>• Specific user groups</div>
                      <div>• Multiple data sources</div>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      Build Custom Report
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>School Information</CardTitle>
                    <CardDescription>
                      Manage basic school information and administrative
                      settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="schoolName">School Name</Label>
                      <Input
                        id="schoolName"
                        value={schoolSettings.schoolName}
                        onChange={(e) =>
                          setSchoolSettings({
                            ...schoolSettings,
                            schoolName: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="adminName">Administrator Name</Label>
                      <Input
                        id="adminName"
                        value={schoolSettings.adminName}
                        onChange={(e) =>
                          setSchoolSettings({
                            ...schoolSettings,
                            adminName: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={schoolSettings.department}
                        onChange={(e) =>
                          setSchoolSettings({
                            ...schoolSettings,
                            department: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                    <Button
                      className="w-full"
                      onClick={handleSaveSchoolSettings}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-purple-600" />
                      AI System Configuration
                    </CardTitle>
                    <CardDescription>
                      Configure AI behavior, analytics, and personalization
                      settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">AI Twin System</p>
                        <p className="text-sm text-gray-500">
                          Enable personalized AI companions for students
                        </p>
                      </div>
                      <Button
                        variant={aiConfig.aiTwinEnabled ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                          setAIConfig({
                            ...aiConfig,
                            aiTwinEnabled: !aiConfig.aiTwinEnabled,
                          })
                        }
                      >
                        {aiConfig.aiTwinEnabled ? "Enabled" : "Disabled"}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Behavior Tracking</p>
                        <p className="text-sm text-gray-500">
                          Monitor student behavior and mood patterns
                        </p>
                      </div>
                      <Button
                        variant={
                          aiConfig.behaviorTrackingEnabled
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          setAIConfig({
                            ...aiConfig,
                            behaviorTrackingEnabled:
                              !aiConfig.behaviorTrackingEnabled,
                          })
                        }
                      >
                        {aiConfig.behaviorTrackingEnabled
                          ? "Enabled"
                          : "Disabled"}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Personalized Learning</p>
                        <p className="text-sm text-gray-500">
                          Adapt content based on individual learning patterns
                        </p>
                      </div>
                      <Button
                        variant={
                          aiConfig.personalizedLearning ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          setAIConfig({
                            ...aiConfig,
                            personalizedLearning:
                              !aiConfig.personalizedLearning,
                          })
                        }
                      >
                        {aiConfig.personalizedLearning ? "Enabled" : "Disabled"}
                      </Button>
                    </div>
                    <div className="pt-4">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setIsAIConfigOpen(true)}
                      >
                        <Cog className="w-4 h-4 mr-2" />
                        Advanced AI Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Configuration</CardTitle>
                    <CardDescription>
                      Advanced system settings and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-500">
                          Receive system alerts and reports via email
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Data Backup</p>
                        <p className="text-sm text-gray-500">
                          Automatic daily backups of all system data
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Setup
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Security Settings</p>
                        <p className="text-sm text-gray-500">
                          Configure access controls and security policies
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-indigo-600" />
                      Data & Privacy
                    </CardTitle>
                    <CardDescription>
                      Manage data retention and privacy settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Data Retention Period</Label>
                      <Select defaultValue="90">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="180">180 days</SelectItem>
                          <SelectItem value="365">1 year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Privacy Level</Label>
                      <Select defaultValue="balanced">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="strict">Strict</SelectItem>
                          <SelectItem value="balanced">Balanced</SelectItem>
                          <SelectItem value="permissive">Permissive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Shield className="w-4 h-4 mr-2" />
                      Privacy Policy Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Add User Dialog */}
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Add New User
                </DialogTitle>
                <DialogDescription>
                  Create a new student or teacher account. AI Twin integration
                  is automatically provided for students.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="role">User Role *</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value) =>
                      setNewUser({
                        ...newUser,
                        role: value as "student" | "teacher",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4" />
                          Student
                        </div>
                      </SelectItem>
                      <SelectItem value="teacher">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Teacher
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    placeholder="Enter full name"
                  />
                </div>

                {newUser.role === "student" && (
                  <>
                    <div>
                      <Label htmlFor="regNo">Registration Number *</Label>
                      <Input
                        id="regNo"
                        value={newUser.regNo}
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            regNo: e.target.value,
                          })
                        }
                        placeholder="e.g., ST2024001"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="grade">Grade *</Label>
                      <Select
                        value={newUser.grade}
                        onValueChange={(value) =>
                          setNewUser({ ...newUser, grade: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="9th">9th Grade</SelectItem>
                          <SelectItem value="10th">10th Grade</SelectItem>
                          <SelectItem value="11th">11th Grade</SelectItem>
                          <SelectItem value="12th">12th Grade</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="studentEmail">Email (Optional)</Label>
                      <Input
                        id="studentEmail"
                        type="email"
                        value={newUser.email}
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            email: e.target.value,
                          })
                        }
                        placeholder="student@example.com (optional)"
                      />
                    </div>
                  </>
                )}

                {newUser.role === "teacher" && (
                  <>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            email: e.target.value,
                          })
                        }
                        placeholder="teacher@school.edu"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={newUser.phone}
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            phone: e.target.value,
                          })
                        }
                        placeholder="+1-555-0123"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Select
                        value={newUser.subject}
                        onValueChange={(value) =>
                          setNewUser({ ...newUser, subject: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {uniqueSubjects.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="experience">Experience (Optional)</Label>
                      <Input
                        id="experience"
                        value={newUser.experience}
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            experience: e.target.value,
                          })
                        }
                        placeholder="e.g., 5 years"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio (Optional)</Label>
                      <Textarea
                        id="bio"
                        value={newUser.bio}
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            bio: e.target.value,
                          })
                        }
                        placeholder="Brief description about the teacher..."
                        rows={3}
                      />
                    </div>
                  </>
                )}

                {newUser.role === "student" && (
                  <Alert>
                    <Brain className="h-4 w-4" />
                    <AlertTitle>AI Twin Integration</AlertTitle>
                    <AlertDescription>
                      An AI Twin will be automatically created for this student
                      to provide personalized learning assistance and behavior
                      monitoring.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddUserOpen(false)}
                  disabled={createUserLoading}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddUser} disabled={createUserLoading}>
                  {createUserLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Create User
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add Subject Dialog */}
          <Dialog open={isAddSubjectOpen} onOpenChange={setIsAddSubjectOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Add New Subject
                </DialogTitle>
                <DialogDescription>
                  Create a new subject with AI-powered content generation
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="subjectName">Subject Name *</Label>
                  <Input
                    id="subjectName"
                    value={newSubject.name}
                    onChange={(e) =>
                      setNewSubject({ ...newSubject, name: e.target.value })
                    }
                    placeholder="e.g., Advanced Mathematics"
                  />
                </div>
                <div>
                  <Label htmlFor="subjectDescription">Description *</Label>
                  <Textarea
                    id="subjectDescription"
                    value={newSubject.description}
                    onChange={(e) =>
                      setNewSubject({
                        ...newSubject,
                        description: e.target.value,
                      })
                    }
                    placeholder="Brief description of the subject..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="subjectCategory">Category (Optional)</Label>
                  <Select
                    value={newSubject.category}
                    onValueChange={(value) =>
                      setNewSubject({ ...newSubject, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="languages">Languages</SelectItem>
                      <SelectItem value="social-studies">
                        Social Studies
                      </SelectItem>
                      <SelectItem value="arts">Arts</SelectItem>
                      <SelectItem value="physical-education">
                        Physical Education
                      </SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Alert>
                  <Brain className="h-4 w-4" />
                  <AlertTitle>AI Enhancement</AlertTitle>
                  <AlertDescription>
                    AI will automatically generate personalized content,
                    assessments, and learning paths for this subject.
                  </AlertDescription>
                </Alert>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddSubjectOpen(false)}
                  disabled={createSubjectLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddSubject}
                  disabled={createSubjectLoading}
                >
                  {createSubjectLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Create Subject
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* User Details Dialog */}
          <Dialog open={isUserDetailsOpen} onOpenChange={setIsUserDetailsOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Details
                </DialogTitle>
                <DialogDescription>
                  View detailed information about the user and their AI Twin
                </DialogDescription>
              </DialogHeader>
              {selectedUser && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={selectedUser.photoUrl} />
                      <AvatarFallback className="text-lg">
                        {(selectedUser.fullName || "")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">
                        {selectedUser.fullName}
                      </h3>
                      <p className="text-gray-600">{selectedUser.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getRoleBadgeClass(selectedUser.role)}>
                          {selectedUser.role}
                        </Badge>
                        <Badge
                          className={getStatusBadgeClass(
                            selectedUser.isActive ? "active" : "inactive",
                          )}
                        >
                          {selectedUser.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {selectedUser.role === "STUDENT" && (
                          <Badge className="bg-purple-100 text-purple-700">
                            <Brain className="w-3 h-3 mr-1" />
                            AI Twin Active
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        User ID
                      </Label>
                      <p className="mt-1">{selectedUser.id}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Phone
                      </Label>
                      <p className="mt-1">
                        {selectedUser.phoneNumber || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Last Active
                      </Label>
                      <p className="mt-1">{selectedUser.lastLogin}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Account Status
                      </Label>
                      <p className="mt-1 capitalize">
                        {selectedUser.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>

                  {selectedUser.role === "STUDENT" && (
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-medium text-purple-800 mb-2 flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        AI Twin Status
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <span className="text-green-600 font-medium">
                            Active
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Accuracy:</span>
                          <span className="font-medium">94.2%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Interactions:</span>
                          <span className="font-medium">1,247</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Interaction:</span>
                          <span className="font-medium">2 hours ago</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsUserDetailsOpen(false)}
                >
                  Close
                </Button>
                {selectedUser && (
                  <>
                    {selectedUser.role === "STUDENT" && (
                      <Button
                        variant="outline"
                        onClick={() => handleViewAITwin(selectedUser)}
                      >
                        <Brain className="w-4 h-4 mr-2" />
                        View AI Twin
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => handleEditUser(selectedUser)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit User
                    </Button>
                  </>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* AI Monitor Dialog */}
          <Dialog open={isAIMonitorOpen} onOpenChange={setIsAIMonitorOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  AI System Monitor
                </DialogTitle>
                <DialogDescription>
                  Real-time monitoring of AI Twin systems and behavior analytics
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* AI System Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">AI Twins</p>
                          <p className="text-2xl font-bold text-purple-600">
                            {aiSystemStats.activeAITwins}
                          </p>
                        </div>
                        <Brain className="w-8 h-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Accuracy</p>
                          <p className="text-2xl font-bold text-green-600">
                            {aiSystemStats.avgAccuracy}%
                          </p>
                        </div>
                        <Target className="w-8 h-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Interactions</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {Math.floor(aiSystemStats.totalInteractions / 1000)}
                            K
                          </p>
                        </div>
                        <MessageSquare className="w-8 h-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Live AI Chat Monitor */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Live AI Interactions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Suspense
                      fallback={
                        <div className="flex items-center justify-center p-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          <span className="ml-2">Loading AI monitor...</span>
                        </div>
                      }
                    >
                      <LazyAITwinChat
                        studentId="admin-monitor"
                        currentLessonId={undefined}
                        emotionalState={Mood.Neutral}
                        className="h-96"
                      />
                    </Suspense>
                  </CardContent>
                </Card>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAIMonitorOpen(false)}
                >
                  Close Monitor
                </Button>
                <Button onClick={() => setIsAIConfigOpen(true)}>
                  <Cog className="w-4 h-4 mr-2" />
                  AI Settings
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Behavior Report Dialog */}
          <Dialog
            open={isBehaviorReportOpen}
            onOpenChange={setIsBehaviorReportOpen}
          >
            <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-orange-600" />
                  Comprehensive Behavior Report
                </DialogTitle>
                <DialogDescription>
                  Real-time behavior analytics and insights across all students
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center p-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span className="ml-2">
                        Loading behavior analytics...
                      </span>
                    </div>
                  }
                >
                  <LazyBehaviorAnalytics
                    studentId="system-wide"
                    currentMood={Mood.Neutral}
                    riskScore={0.15}
                  />
                </Suspense>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsBehaviorReportOpen(false)}
                >
                  Close Report
                </Button>
                <Button onClick={handleExportReport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Notifications Dialog */}
          <Dialog
            open={isNotificationOpen}
            onOpenChange={setIsNotificationOpen}
          >
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </DialogTitle>
                <DialogDescription>
                  {unreadNotifications > 0
                    ? `You have ${unreadNotifications} unread notifications`
                    : "You're all caught up!"}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-96">
                <div className="space-y-4">
                  {notifications.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">
                      No notifications available
                    </p>
                  ) : (
                    notifications.slice(0, 10).map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg border ${
                          notification.read
                            ? "bg-gray-50"
                            : "bg-blue-50 border-blue-200"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm">
                                {notification.title}
                              </h4>
                              <Badge
                                variant="outline"
                                className={`text-xs ${getPriorityBadgeClass(
                                  notification.priority,
                                )}`}
                              >
                                {notification.priority}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsNotificationOpen(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Password Change Dialog */}
          <Dialog
            open={isPasswordChangeOpen}
            onOpenChange={setIsPasswordChangeOpen}
          >
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Change Password
                </DialogTitle>
                <DialogDescription>
                  Update your account password for enhanced security
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      placeholder="Enter current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          current: !showPasswords.current,
                        })
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
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="Enter new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          new: !showPasswords.new,
                        })
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
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="Confirm new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          confirm: !showPasswords.confirm,
                        })
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
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsPasswordChangeOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handlePasswordChange}>
                  <Key className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Message Modal */}
          <MessageModal
            isOpen={isMessageModalOpen}
            onClose={closeMessageModal}
            message={currentMessage}
          />
        </main>
      </div>
    </TooltipProvider>
  );
};

export default AdminDashboard;
