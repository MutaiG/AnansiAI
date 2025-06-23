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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "@/hooks/useAdminApi";
import usePageTitle from "@/hooks/usePageTitle";

// Remove the local interfaces as they're now imported from useAdminApi

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
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);
  const [isAIConfigOpen, setIsAIConfigOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "student" as "student" | "teacher",
    regNo: "",
    grade: "",
    subject: "",
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
  });

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

  // Extract data from API response with fallbacks
  const adminInfo = {
    name: dashboardData?.adminProfile?.fullName || "Administrator",
    id: dashboardData?.adminProfile?.id || "ADM001",
    school: dashboardData?.adminProfile?.schoolName || "School",
    avatar: "",
    role: dashboardData?.adminProfile?.role || "Admin",
    lastLogin: dashboardData?.adminProfile?.lastLogin || "Today",
  };

  const schoolStats = {
    totalStudents: dashboardData?.schoolStats?.totalStudents || 0,
    totalTeachers: dashboardData?.schoolStats?.totalTeachers || 0,
    activeUsers: dashboardData?.schoolStats?.activeUsers || 0,
    systemUptime: dashboardData?.schoolStats?.systemUptime || 99.0,
    avgPerformance: dashboardData?.schoolStats?.avgPerformance || 0,
    aiAccuracy: 94.2, // This would come from AI metrics
    coursesCreated: dashboardData?.schoolStats?.totalSubjects || 0,
    assignmentsCompleted: dashboardData?.schoolStats?.totalAssignments || 0,
  };

  const notifications: Notification[] = [
    {
      id: "1",
      type: "alert",
      title: "System Performance Alert",
      message:
        "High memory usage detected on server cluster - immediate attention required",
      time: "5 min ago",
      read: false,
      priority: "high",
    },
    {
      id: "2",
      type: "user",
      title: "New User Registrations",
      message: "12 new teacher accounts pending approval and activation",
      time: "45 min ago",
      read: false,
      priority: "medium",
    },
    {
      id: "3",
      type: "performance",
      title: "Student Performance Update",
      message:
        "Weekly performance analytics report is now available for review",
      time: "2 hours ago",
      read: true,
      priority: "low",
    },
    {
      id: "4",
      type: "maintenance",
      title: "Scheduled System Maintenance",
      message: "Planned maintenance window tonight from 11 PM to 2 AM",
      time: "4 hours ago",
      read: true,
      priority: "medium",
    },
    {
      id: "5",
      type: "system",
      title: "AI Model Update Complete",
      message:
        "Latest machine learning models deployed successfully across all courses",
      time: "1 day ago",
      read: true,
      priority: "low",
    },
  ];

  const systemAlerts: SystemAlert[] = [
    {
      id: "1",
      type: "warning",
      title: "Database Performance Issue",
      message:
        "Database response times are 40% above normal thresholds. Consider optimizing queries.",
      time: "15 min ago",
      priority: "high",
      actionRequired: true,
    },
    {
      id: "2",
      type: "success",
      title: "User Activity Milestone",
      message:
        "Congratulations! 95% student engagement rate achieved this week.",
      time: "1 hour ago",
      priority: "low",
      actionRequired: false,
    },
    {
      id: "3",
      type: "error",
      title: "AI Service Disruption",
      message:
        "Machine learning inference service experiencing intermittent failures in Math module.",
      time: "2 hours ago",
      priority: "high",
      actionRequired: true,
    },
    {
      id: "4",
      type: "info",
      title: "Security Update Available",
      message: "New security patches available for immediate deployment.",
      time: "6 hours ago",
      priority: "medium",
      actionRequired: true,
    },
  ];

  const users: User[] = [
    {
      id: "USR001",
      name: "Alex Johnson",
      role: "student",
      regNo: "ST2024001",
      grade: "10th",
      status: "active",
      lastLogin: "2 hours ago",
      joinDate: "Jan 15, 2024",
      performance: 89,
      courses: 6,
    },
    {
      id: "USR002",
      name: "Sarah Chen",
      email: "sarah.chen@school.edu",
      phone: "+1-555-0123",
      role: "teacher",
      subject: "Mathematics",
      status: "active",
      lastLogin: "30 min ago",
      joinDate: "Aug 20, 2023",
      courses: 4,
    },
    {
      id: "USR003",
      name: "Maria Rodriguez",
      role: "student",
      regNo: "ST2024002",
      grade: "11th",
      status: "active",
      lastLogin: "1 day ago",
      joinDate: "Jan 20, 2024",
      performance: 94,
      courses: 7,
    },
    {
      id: "USR004",
      name: "David Wilson",
      email: "david.wilson@school.edu",
      phone: "+1-555-0456",
      role: "teacher",
      subject: "Science",
      status: "pending",
      lastLogin: "Never",
      joinDate: "Mar 1, 2024",
      courses: 0,
    },
    {
      id: "USR005",
      name: "Emily Davis",
      role: "student",
      regNo: "ST2024003",
      grade: "9th",
      status: "active",
      lastLogin: "5 hours ago",
      joinDate: "Feb 10, 2024",
      performance: 76,
      courses: 5,
    },
    {
      id: "USR006",
      name: "Michael Thompson",
      email: "michael.t@school.edu",
      phone: "+1-555-0789",
      role: "teacher",
      subject: "English Literature",
      status: "active",
      lastLogin: "1 hour ago",
      joinDate: "Sep 5, 2023",
      courses: 3,
    },
  ];

  const handleLogout = () => {
    navigate("/login");
  };

  const handleSettings = () => {
    navigate("/admin-settings");
  };

  const handleSchedule = () => {
    navigate("/admin-schedule");
  };

  const handleAddUser = () => {
    if (!newUser.name) {
      alert("Please enter the user's name");
      return;
    }

    if (
      newUser.role === "teacher" &&
      (!newUser.email || !newUser.phone || !newUser.subject)
    ) {
      alert("Please fill in all required fields for teacher role");
      return;
    }

    if (newUser.role === "student" && (!newUser.regNo || !newUser.grade)) {
      alert("Please fill in all required fields for student role");
      return;
    }

    // Generate login ID and password
    const loginId =
      newUser.role === "student"
        ? `${newUser.regNo}-STU-${Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, "0")}`
        : `${adminInfo.school.replace(/\s+/g, "").substring(0, 3).toUpperCase()}-TCH-${Math.floor(
            Math.random() * 1000,
          )
            .toString()
            .padStart(3, "0")}`;

    const tempPassword = Math.random().toString(36).slice(-8);

    console.log("Creating user:", { ...newUser, loginId, tempPassword });
    alert(
      `User created successfully!\n\nLogin ID: ${loginId}\nTemporary Password: ${tempPassword}\n\nThe user must change their password on first login.`,
    );

    setIsAddUserOpen(false);
    setNewUser({
      name: "",
      email: "",
      phone: "",
      role: "student",
      regNo: "",
      grade: "",
      subject: "",
    });
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete user "${userName}"? This action cannot be undone.`,
      )
    ) {
      console.log(`Deleting user: ${userId}`);
      alert(`User "${userName}" deleted successfully!`);
    }
  };

  const handleEditUser = (userId: string) => {
    navigate(`/admin/users/${userId}/edit`);
  };

  const handleViewUser = (userId: string) => {
    navigate(`/admin/users/${userId}/profile`);
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

    alert("Password changed successfully!");
    setIsPasswordChangeOpen(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleExportReport = () => {
    console.log("Exporting comprehensive school report...");
    alert("Report exported successfully! Check your downloads folder.");
  };

  const handleScheduleReports = () => {
    navigate("/admin/reports/schedule");
  };

  const handleReviewPatterns = () => {
    navigate("/admin/alerts/patterns");
  };

  const handleScheduleUpdates = () => {
    navigate("/admin/system/updates");
  };

  const handleConfigureAI = () => {
    console.log("AI Configuration updated:", aiConfig);
    alert("AI configuration saved successfully!");
    setIsAIConfigOpen(false);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.regNo?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-accent-100 text-accent-700";
      case "inactive":
        return "bg-secondary-100 text-secondary-700";
      case "pending":
        return "bg-warning-100 text-warning-700";
      default:
        return "bg-secondary-100 text-secondary-700";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-warning-600" />;
      case "info":
        return <Info className="w-4 h-4 text-blue-600" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-destructive-600" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-accent-600" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive-100 text-destructive-700";
      case "medium":
        return "bg-warning-100 text-warning-700";
      case "low":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-secondary-100 text-secondary-700";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="w-4 h-4 text-destructive-600" />;
      case "system":
        return <Settings className="w-4 h-4 text-blue-600" />;
      case "user":
        return <Users className="w-4 h-4 text-accent-600" />;
      case "maintenance":
        return <Cog className="w-4 h-4 text-warning-600" />;
      case "performance":
        return <TrendingUp className="w-4 h-4 text-primary-600" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const highPriorityAlerts = systemAlerts.filter(
    (alert) => alert.priority === "high",
  ).length;

  return (
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
                <h1 className="font-bold text-xl text-secondary-800">
                  AnansiAI
                </h1>
                <p className="text-xs text-secondary-500">Admin Portal</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
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
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Notifications</DialogTitle>
                    <DialogDescription>
                      {unreadNotifications > 0
                        ? `You have ${unreadNotifications} unread notifications`
                        : "You're all caught up!"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-lg border ${
                          notification.read
                            ? "bg-secondary-50 border-secondary-200"
                            : "bg-blue-50 border-blue-200"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1 space-y-1">
                            <div className="flex items-start justify-between">
                              <h4 className="font-medium text-secondary-800 text-sm">
                                {notification.title}
                              </h4>
                              <Badge
                                className={getPriorityColor(
                                  notification.priority,
                                )}
                              >
                                {notification.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-secondary-600">
                              {notification.message}
                            </p>
                            <p className="text-xs text-secondary-500">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={adminInfo.avatar} />
                      <AvatarFallback className="bg-primary-100 text-primary-700">
                        {adminInfo.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-secondary-800">
                        {adminInfo.name}
                      </p>
                      <p className="text-xs text-secondary-500">
                        {adminInfo.role}
                      </p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Administrator</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSettings}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSchedule}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setIsPasswordChangeOpen(true)}
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Change Password
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-secondary-800 mb-2">
                School Administration Center
              </h2>
              <p className="text-secondary-600 flex items-center gap-2">
                <School className="w-4 h-4" />
                Welcome back, {adminInfo.name} • {adminInfo.school}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-secondary-600">Last login</p>
              <p className="font-medium text-secondary-800">
                {adminInfo.lastLogin}
              </p>
            </div>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger
              value="ai-oversight"
              className="flex items-center gap-2"
            >
              <Brain className="w-4 h-4" />
              AI Oversight
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* School Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-secondary-600">
                        Total Students
                      </p>
                      <p className="text-2xl font-bold text-secondary-800">
                        {schoolStats.totalStudents.toLocaleString()}
                      </p>
                      <p className="text-xs text-accent-600 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        +12% this month
                      </p>
                    </div>
                    <div className="p-3 bg-primary-100 rounded-lg">
                      <GraduationCap className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-secondary-600">
                        Total Teachers
                      </p>
                      <p className="text-2xl font-bold text-secondary-800">
                        {schoolStats.totalTeachers}
                      </p>
                      <p className="text-xs text-accent-600 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        +3 new this week
                      </p>
                    </div>
                    <div className="p-3 bg-accent-100 rounded-lg">
                      <Users className="w-6 h-6 text-accent-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-secondary-600">Active Users</p>
                      <p className="text-2xl font-bold text-secondary-800">
                        {schoolStats.activeUsers}
                      </p>
                      <p className="text-xs text-accent-600 flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        94% online rate
                      </p>
                    </div>
                    <div className="p-3 bg-warning-100 rounded-lg">
                      <Activity className="w-6 h-6 text-warning-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-secondary-600">
                        System Uptime
                      </p>
                      <p className="text-2xl font-bold text-secondary-800">
                        {schoolStats.systemUptime}%
                      </p>
                      <p className="text-xs text-accent-600 flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        Excellent performance
                      </p>
                    </div>
                    <div className="p-3 bg-accent-100 rounded-lg">
                      <Zap className="w-6 h-6 text-accent-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* System Alerts */}
              <div className="lg:col-span-2">
                <Card className="card-elevated">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-warning-600" />
                          System Alerts
                          {highPriorityAlerts > 0 && (
                            <Badge className="bg-destructive-100 text-destructive-700 ml-2">
                              {highPriorityAlerts} High Priority
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          Critical system notifications requiring attention
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleReviewPatterns}
                        >
                          Review Patterns
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleScheduleUpdates}
                        >
                          Schedule Updates
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {systemAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="p-4 bg-secondary-50 rounded-lg border border-secondary-100 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-start gap-3">
                          {getAlertIcon(alert.type)}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-secondary-800">
                                {alert.title}
                              </h4>
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={getPriorityColor(alert.priority)}
                                >
                                  {alert.priority}
                                </Badge>
                                {alert.actionRequired && (
                                  <Badge className="bg-destructive-100 text-destructive-700">
                                    Action Required
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-secondary-600 mb-3">
                              {alert.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-secondary-500">
                                {alert.time}
                              </p>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  View Details
                                </Button>
                                {alert.actionRequired && (
                                  <Button size="sm" className="btn-primary">
                                    Take Action
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                    <DialogTrigger asChild>
                      <Button className="btn-primary w-full">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>
                          Create a new student or teacher account
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="role">User Role</Label>
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
                              <SelectItem value="student">Student</SelectItem>
                              <SelectItem value="teacher">Teacher</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="name">Full Name</Label>
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
                              <Label htmlFor="regNo">Registration Number</Label>
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
                              />
                            </div>
                            <div>
                              <Label htmlFor="grade">Grade</Label>
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
                                  <SelectItem value="10th">
                                    10th Grade
                                  </SelectItem>
                                  <SelectItem value="11th">
                                    11th Grade
                                  </SelectItem>
                                  <SelectItem value="12th">
                                    12th Grade
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        )}

                        {newUser.role === "teacher" && (
                          <>
                            <div>
                              <Label htmlFor="email">Email</Label>
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
                              />
                            </div>
                            <div>
                              <Label htmlFor="phone">Phone Number</Label>
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
                              />
                            </div>
                            <div>
                              <Label htmlFor="subject">Subject</Label>
                              <Input
                                id="subject"
                                value={newUser.subject}
                                onChange={(e) =>
                                  setNewUser({
                                    ...newUser,
                                    subject: e.target.value,
                                  })
                                }
                                placeholder="e.g., Mathematics"
                              />
                            </div>
                          </>
                        )}
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsAddUserOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleAddUser}>Create User</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleExportReport}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>

                  <Button variant="outline" className="w-full">
                    <Monitor className="w-4 h-4 mr-2" />
                    System Status
                  </Button>

                  <Button variant="outline" className="w-full">
                    <Database className="w-4 h-4 mr-2" />
                    Backup Data
                  </Button>

                  <Button variant="outline" className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sync Systems
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Performance Overview */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>
                    Key performance indicators for your school
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">
                        Average Student Performance
                      </span>
                      <span className="font-bold">
                        {schoolStats.avgPerformance}%
                      </span>
                    </div>
                    <Progress
                      value={schoolStats.avgPerformance}
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">AI Accuracy Rate</span>
                      <span className="font-bold">
                        {schoolStats.aiAccuracy}%
                      </span>
                    </div>
                    <Progress value={schoolStats.aiAccuracy} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center p-4 bg-primary-50 rounded-lg">
                      <div className="text-2xl font-bold text-primary-600">
                        {schoolStats.coursesCreated}
                      </div>
                      <p className="text-xs text-secondary-600">
                        Courses Created
                      </p>
                    </div>
                    <div className="text-center p-4 bg-accent-50 rounded-lg">
                      <div className="text-2xl font-bold text-accent-600">
                        {schoolStats.assignmentsCompleted.toLocaleString()}
                      </div>
                      <p className="text-xs text-secondary-600">
                        Assignments Completed
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest school activities and updates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-secondary-50 rounded-lg">
                    <div className="p-2 bg-accent-100 rounded-lg">
                      <Users className="w-4 h-4 text-accent-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        New Teacher Registration
                      </p>
                      <p className="text-xs text-secondary-600">
                        Dr. Jennifer Lee joined Mathematics department
                      </p>
                      <p className="text-xs text-secondary-500">2 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-secondary-50 rounded-lg">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <BookOpen className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Course Update</p>
                      <p className="text-xs text-secondary-600">
                        Advanced Physics curriculum updated with new modules
                      </p>
                      <p className="text-xs text-secondary-500">5 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-secondary-50 rounded-lg">
                    <div className="p-2 bg-warning-100 rounded-lg">
                      <Award className="w-4 h-4 text-warning-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        Achievement Milestone
                      </p>
                      <p className="text-xs text-secondary-600">
                        School reached 95% student engagement rate
                      </p>
                      <p className="text-xs text-secondary-500">1 day ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-secondary-800">
                  User Management
                </h3>
                <p className="text-sm text-secondary-600">
                  Manage students and teachers • {filteredUsers.length} of{" "}
                  {users.length} users
                </p>
              </div>
              <Button
                className="btn-primary"
                onClick={() => setIsAddUserOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>

            {/* Search and Filters */}
            <Card className="card-elevated">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
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

            {/* Users Table */}
            <Card className="card-elevated">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-primary-100 text-primary-700">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-secondary-800">
                              {user.name}
                            </p>
                            <p className="text-xs text-secondary-500">
                              {user.regNo || user.subject} • Joined{" "}
                              {user.joinDate}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <Badge
                            className={
                              user.role === "teacher"
                                ? "bg-accent-100 text-accent-700"
                                : "bg-primary-100 text-primary-700"
                            }
                          >
                            {user.role}
                          </Badge>
                          {user.grade && (
                            <p className="text-xs text-secondary-500 mt-1">
                              {user.grade}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {user.email && (
                            <div className="flex items-center gap-1 text-xs text-secondary-600">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </div>
                          )}
                          {user.phone && (
                            <div className="flex items-center gap-1 text-xs text-secondary-600">
                              <Phone className="w-3 h-3" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.performance ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {user.performance}%
                              </span>
                              <div className="w-12 h-2 bg-secondary-200 rounded">
                                <div
                                  className="h-full bg-accent-500 rounded"
                                  style={{ width: `${user.performance}%` }}
                                ></div>
                              </div>
                            </div>
                            <p className="text-xs text-secondary-500">
                              {user.courses} courses
                            </p>
                          </div>
                        ) : (
                          <div className="text-xs text-secondary-500">
                            {user.courses || 0} courses
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{user.lastLogin}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            title="View Profile"
                            onClick={() => handleViewUser(user.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Edit User"
                            onClick={() => handleEditUser(user.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive-600 hover:text-destructive-700 hover:bg-destructive-50"
                            title="Delete User"
                            onClick={() => handleDeleteUser(user.id, user.name)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="ai-oversight" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-secondary-800">
                  AI Oversight & Configuration
                </h3>
                <p className="text-sm text-secondary-600">
                  Monitor and configure AI systems across your school
                </p>
              </div>
              <Button
                className="btn-primary"
                onClick={() => setIsAIConfigOpen(true)}
              >
                <Brain className="w-4 h-4 mr-2" />
                Configure AI
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* AI Performance */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>AI Performance Metrics</CardTitle>
                  <CardDescription>
                    Real-time AI system performance indicators
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Response Accuracy</span>
                      <span className="font-bold">
                        {aiConfig.responseAccuracy[0]}%
                      </span>
                    </div>
                    <Progress
                      value={aiConfig.responseAccuracy[0]}
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Student Satisfaction</span>
                      <span className="font-bold">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">System Efficiency</span>
                      <span className="font-bold">88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center p-4 bg-primary-50 rounded-lg">
                      <div className="text-2xl font-bold text-primary-600">
                        24.7K
                      </div>
                      <p className="text-xs text-secondary-600">
                        AI Interactions Today
                      </p>
                    </div>
                    <div className="text-center p-4 bg-accent-50 rounded-lg">
                      <div className="text-2xl font-bold text-accent-600">
                        99.2%
                      </div>
                      <p className="text-xs text-secondary-600">
                        Uptime This Month
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Configuration Preview */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>AI System Status</CardTitle>
                  <CardDescription>
                    Current AI configuration and status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-accent-100 rounded-lg">
                        <Brain className="w-4 h-4 text-accent-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Core AI Engine</p>
                        <p className="text-xs text-secondary-600">
                          Latest model deployed
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-accent-100 text-accent-700">
                      Active
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <Shield className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Safety Filters</p>
                        <p className="text-xs text-secondary-600">
                          Content moderation enabled
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-accent-100 text-accent-700">
                      Active
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-warning-100 rounded-lg">
                        <Database className="w-4 h-4 text-warning-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          Learning Analytics
                        </p>
                        <p className="text-xs text-secondary-600">
                          Real-time insights
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-accent-100 text-accent-700">
                      Active
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Globe className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Language Models</p>
                        <p className="text-xs text-secondary-600">
                          Multi-language support
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-accent-100 text-accent-700">
                      Active
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Usage Analytics */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>AI Usage Analytics</CardTitle>
                <CardDescription>
                  Detailed insights into AI system usage patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-secondary-800">
                      Subject Distribution
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Mathematics</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-secondary-200 rounded">
                            <div className="w-12 h-2 bg-primary-500 rounded"></div>
                          </div>
                          <span className="text-xs">35%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Science</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-secondary-200 rounded">
                            <div className="w-10 h-2 bg-accent-500 rounded"></div>
                          </div>
                          <span className="text-xs">28%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">English</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-secondary-200 rounded">
                            <div className="w-8 h-2 bg-warning-500 rounded"></div>
                          </div>
                          <span className="text-xs">22%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">History</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-secondary-200 rounded">
                            <div className="w-4 h-2 bg-blue-500 rounded"></div>
                          </div>
                          <span className="text-xs">15%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-secondary-800">
                      Peak Usage Hours
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">9:00 - 11:00 AM</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-secondary-200 rounded">
                            <div className="w-full h-2 bg-primary-500 rounded"></div>
                          </div>
                          <span className="text-xs">100%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">1:00 - 3:00 PM</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-secondary-200 rounded">
                            <div className="w-14 h-2 bg-accent-500 rounded"></div>
                          </div>
                          <span className="text-xs">85%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">7:00 - 9:00 PM</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-secondary-200 rounded">
                            <div className="w-10 h-2 bg-warning-500 rounded"></div>
                          </div>
                          <span className="text-xs">65%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-secondary-800">
                      Question Types
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Problem Solving</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-secondary-200 rounded">
                            <div className="w-12 h-2 bg-primary-500 rounded"></div>
                          </div>
                          <span className="text-xs">42%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Concept Explanation</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-secondary-200 rounded">
                            <div className="w-10 h-2 bg-accent-500 rounded"></div>
                          </div>
                          <span className="text-xs">33%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Homework Help</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-secondary-200 rounded">
                            <div className="w-6 h-2 bg-warning-500 rounded"></div>
                          </div>
                          <span className="text-xs">25%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Configuration Dialog */}
            <Dialog open={isAIConfigOpen} onOpenChange={setIsAIConfigOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>AI System Configuration</DialogTitle>
                  <DialogDescription>
                    Configure AI behavior and performance parameters for your
                    school
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label>
                        Response Accuracy Level: {aiConfig.responseAccuracy[0]}%
                      </Label>
                      <Slider
                        value={aiConfig.responseAccuracy}
                        onValueChange={(value) =>
                          setAIConfig({ ...aiConfig, responseAccuracy: value })
                        }
                        max={100}
                        min={50}
                        step={5}
                        className="mt-2"
                      />
                      <p className="text-xs text-secondary-600 mt-1">
                        Higher values provide more accurate but potentially
                        slower responses
                      </p>
                    </div>

                    <div>
                      <Label>
                        Personality Level: {aiConfig.personalityLevel[0]}%
                      </Label>
                      <Slider
                        value={aiConfig.personalityLevel}
                        onValueChange={(value) =>
                          setAIConfig({ ...aiConfig, personalityLevel: value })
                        }
                        max={100}
                        min={0}
                        step={10}
                        className="mt-2"
                      />
                      <p className="text-xs text-secondary-600 mt-1">
                        Controls how personable and engaging the AI responses
                        are
                      </p>
                    </div>

                    <div>
                      <Label>
                        Helpfulness Level: {aiConfig.helpfulnessLevel[0]}%
                      </Label>
                      <Slider
                        value={aiConfig.helpfulnessLevel}
                        onValueChange={(value) =>
                          setAIConfig({ ...aiConfig, helpfulnessLevel: value })
                        }
                        max={100}
                        min={0}
                        step={10}
                        className="mt-2"
                      />
                      <p className="text-xs text-secondary-600 mt-1">
                        Determines how much assistance the AI provides
                      </p>
                    </div>

                    <div>
                      <Label>
                        Creativity Level: {aiConfig.creativityLevel[0]}%
                      </Label>
                      <Slider
                        value={aiConfig.creativityLevel}
                        onValueChange={(value) =>
                          setAIConfig({ ...aiConfig, creativityLevel: value })
                        }
                        max={100}
                        min={0}
                        step={10}
                        className="mt-2"
                      />
                      <p className="text-xs text-secondary-600 mt-1">
                        Controls creative problem-solving approaches
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="dataRetention">
                        Data Retention Period (days)
                      </Label>
                      <Input
                        id="dataRetention"
                        type="number"
                        value={aiConfig.dataRetentionDays}
                        onChange={(e) =>
                          setAIConfig({
                            ...aiConfig,
                            dataRetentionDays: parseInt(e.target.value),
                          })
                        }
                        min={30}
                        max={365}
                        className="mt-1"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="advancedFeatures"
                        checked={aiConfig.enableAdvancedFeatures}
                        onChange={(e) =>
                          setAIConfig({
                            ...aiConfig,
                            enableAdvancedFeatures: e.target.checked,
                          })
                        }
                        className="rounded"
                      />
                      <Label htmlFor="advancedFeatures" className="text-sm">
                        Enable Advanced AI Features
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="autoUpdate"
                        checked={aiConfig.autoUpdateModels}
                        onChange={(e) =>
                          setAIConfig({
                            ...aiConfig,
                            autoUpdateModels: e.target.checked,
                          })
                        }
                        className="rounded"
                      />
                      <Label htmlFor="autoUpdate" className="text-sm">
                        Automatically Update AI Models
                      </Label>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAIConfigOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleConfigureAI}>
                    Save Configuration
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-secondary-800">
                  School Analytics
                </h3>
                <p className="text-sm text-secondary-600">
                  Comprehensive insights and performance analytics
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleExportReport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
                <Button variant="outline" onClick={handleScheduleReports}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Reports
                </Button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Performance Trends */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>
                    Academic performance over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">This Month</span>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-accent-600" />
                        <span className="text-sm font-bold">+15.2%</span>
                      </div>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Last Month</span>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary-600" />
                        <span className="text-sm font-bold">+8.7%</span>
                      </div>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Quarter Average
                      </span>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-warning-600" />
                        <span className="text-sm font-bold">+12.1%</span>
                      </div>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center p-4 bg-accent-50 rounded-lg">
                      <div className="text-2xl font-bold text-accent-600">
                        A+
                      </div>
                      <p className="text-xs text-secondary-600">
                        Average Grade
                      </p>
                    </div>
                    <div className="text-center p-4 bg-primary-50 rounded-lg">
                      <div className="text-2xl font-bold text-primary-600">
                        94%
                      </div>
                      <p className="text-xs text-secondary-600">
                        Completion Rate
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Subject Performance */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Subject Performance</CardTitle>
                  <CardDescription>
                    Performance breakdown by subject area
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">Mathematics</span>
                        <span className="font-bold">89%</span>
                      </div>
                      <Progress value={89} className="h-2" />
                      <p className="text-xs text-secondary-600 mt-1">
                        125 students • 15% improvement
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">Science</span>
                        <span className="font-bold">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                      <p className="text-xs text-secondary-600 mt-1">
                        118 students • 8% improvement
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">English Literature</span>
                        <span className="font-bold">82%</span>
                      </div>
                      <Progress value={82} className="h-2" />
                      <p className="text-xs text-secondary-600 mt-1">
                        142 students • 12% improvement
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">History</span>
                        <span className="font-bold">78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                      <p className="text-xs text-secondary-600 mt-1">
                        98 students • 5% improvement
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analytics */}
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Student Engagement</CardTitle>
                  <CardDescription>Daily activity metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-1">
                      94.2%
                    </div>
                    <p className="text-sm text-secondary-600">
                      Average Daily Engagement
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Active Sessions</span>
                      <span className="text-sm font-medium">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg. Session Duration</span>
                      <span className="text-sm font-medium">45 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Questions Asked</span>
                      <span className="text-sm font-medium">3,420</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Assignments Completed</span>
                      <span className="text-sm font-medium">2,856</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Teacher Activity</CardTitle>
                  <CardDescription>Faculty engagement metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent-600 mb-1">
                      87
                    </div>
                    <p className="text-sm text-secondary-600">
                      Active Teachers
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Courses Created</span>
                      <span className="text-sm font-medium">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Assignments Posted</span>
                      <span className="text-sm font-medium">428</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Feedback Given</span>
                      <span className="text-sm font-medium">2,145</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">AI Interactions</span>
                      <span className="text-sm font-medium">892</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>System Usage</CardTitle>
                  <CardDescription>Platform utilization stats</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-warning-600 mb-1">
                      99.7%
                    </div>
                    <p className="text-sm text-secondary-600">System Uptime</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Peak Concurrent Users</span>
                      <span className="text-sm font-medium">952</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Data Storage Used</span>
                      <span className="text-sm font-medium">78.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">API Requests Today</span>
                      <span className="text-sm font-medium">45.2K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg. Response Time</span>
                      <span className="text-sm font-medium">1.2s</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-secondary-800">
                  Advanced Settings
                </h3>
                <p className="text-sm text-secondary-600">
                  Configure system settings and administrative preferences
                </p>
              </div>
              <Button onClick={handleSettings}>
                <Settings className="w-4 h-4 mr-2" />
                Advanced Configuration
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Account Settings */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Account Management</CardTitle>
                  <CardDescription>
                    Personal account and security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                    <div>
                      <p className="font-medium text-secondary-800">
                        Change Password
                      </p>
                      <p className="text-sm text-secondary-600">
                        Update your account password
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setIsPasswordChangeOpen(true)}
                    >
                      <Key className="w-4 h-4 mr-2" />
                      Change
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                    <div>
                      <p className="font-medium text-secondary-800">
                        Two-Factor Authentication
                      </p>
                      <p className="text-sm text-secondary-600">
                        Enhanced account security
                      </p>
                    </div>
                    <Button variant="outline">
                      <Shield className="w-4 h-4 mr-2" />
                      Enable
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                    <div>
                      <p className="font-medium text-secondary-800">
                        Session Management
                      </p>
                      <p className="text-sm text-secondary-600">
                        View and manage active sessions
                      </p>
                    </div>
                    <Button variant="outline">
                      <Monitor className="w-4 h-4 mr-2" />
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* System Configuration */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>System Configuration</CardTitle>
                  <CardDescription>
                    Platform-wide settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                    <div>
                      <p className="font-medium text-secondary-800">
                        Backup Settings
                      </p>
                      <p className="text-sm text-secondary-600">
                        Configure automatic backups
                      </p>
                    </div>
                    <Button variant="outline">
                      <Database className="w-4 h-4 mr-2" />
                      Configure
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                    <div>
                      <p className="font-medium text-secondary-800">
                        Email Notifications
                      </p>
                      <p className="text-sm text-secondary-600">
                        System alert preferences
                      </p>
                    </div>
                    <Button variant="outline">
                      <Mail className="w-4 h-4 mr-2" />
                      Update
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                    <div>
                      <p className="font-medium text-secondary-800">
                        Integration Settings
                      </p>
                      <p className="text-sm text-secondary-600">
                        Third-party service connections
                      </p>
                    </div>
                    <Button variant="outline">
                      <Globe className="w-4 h-4 mr-2" />
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Data Management */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>
                  Control data retention, export, and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-secondary-800">
                      Data Retention
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Student Records</span>
                        <Button variant="outline" size="sm">
                          7 Years
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Academic Data</span>
                        <Button variant="outline" size="sm">
                          5 Years
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">System Logs</span>
                        <Button variant="outline" size="sm">
                          1 Year
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-secondary-800">
                      Privacy Controls
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Data Anonymization</span>
                        <Badge className="bg-accent-100 text-accent-700">
                          Enabled
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">External Sharing</span>
                        <Badge className="bg-destructive-100 text-destructive-700">
                          Disabled
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Analytics Tracking</span>
                        <Badge className="bg-accent-100 text-accent-700">
                          Enabled
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Password Change Dialog */}
        <Dialog
          open={isPasswordChangeOpen}
          onOpenChange={setIsPasswordChangeOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
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
              <Button onClick={handlePasswordChange}>Change Password</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AdminDashboard;
