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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Brain,
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  Users,
  Calendar,
  Bell,
  Settings,
  LogOut,
  Target,
  Zap,
  MessageSquare,
  BarChart3,
  Star,
  Plus,
  Eye,
  Edit,
  AlertTriangle,
  CheckCircle,
  XCircle,
  GraduationCap,
  FileText,
  Download,
  Upload,
  Filter,
  Search,
  Trash2,
  Key,
  EyeOff,
  Activity,
  HelpCircle,
  Share,
  Send,
  ChevronRight,
  FileBarChart,
  UserPlus,
  Copy,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Student {
  id: string;
  name: string;
  email: string;
  grade: string;
  class: string;
  overallProgress: number;
  lastActive: string;
  status: "active" | "struggling" | "excelling";
  avatar?: string;
  gpa: number;
  assignments: { completed: number; total: number };
  quizzes: { completed: number; total: number };
}

interface Class {
  id: string;
  name: string;
  subject: string;
  grade: string;
  students: number;
  avgProgress: number;
  nextSession: string;
  aiOverrides: number;
  description: string;
  schedule: string;
}

interface AIAlert {
  id: string;
  type: "attention" | "success" | "warning";
  student: string;
  studentId: string;
  message: string;
  time: string;
  action?: string;
  priority: "high" | "medium" | "low";
}

interface Content {
  id: string;
  title: string;
  type: "lesson" | "quiz" | "assignment";
  subject: string;
  created: string;
  status: "published" | "draft";
  students: number;
  description: string;
  difficulty: "easy" | "medium" | "hard";
}

interface Notification {
  id: string;
  type: "alert" | "submission" | "reminder" | "announcement";
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: "low" | "medium" | "high";
}

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isCreateClassOpen, setIsCreateClassOpen] = useState(false);
  const [isCreateContentOpen, setIsCreateContentOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);
  const [isStudentDetailOpen, setIsStudentDetailOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [newClass, setNewClass] = useState({
    name: "",
    subject: "",
    grade: "",
    description: "",
    schedule: "",
  });
  const [newContent, setNewContent] = useState({
    title: "",
    type: "lesson",
    subject: "",
    description: "",
    difficulty: "medium",
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

  // Mock data
  const teacherInfo = {
    name: "Sarah Chen",
    id: "TCH001",
    subject: "Mathematics & Science",
    avatar: "",
    classes: 5,
    students: 127,
    experience: "8 years",
    rating: 4.8,
  };

  const notifications: Notification[] = [
    {
      id: "1",
      type: "submission",
      title: "New Assignment Submission",
      message: "Alex Johnson submitted Calculus Assignment #3",
      time: "30 min ago",
      read: false,
      priority: "medium",
    },
    {
      id: "2",
      type: "alert",
      title: "Student Twin Alert",
      message: "Maria Rodriguez needs attention in Algebra",
      time: "1 hour ago",
      read: false,
      priority: "high",
    },
    {
      id: "3",
      type: "reminder",
      title: "Class Schedule",
      message: "Advanced Math class starts in 15 minutes",
      time: "2 hours ago",
      read: true,
      priority: "medium",
    },
    {
      id: "4",
      type: "announcement",
      title: "System Update",
      message: "New grading features are now available",
      time: "1 day ago",
      read: false,
      priority: "low",
    },
  ];

  const students: Student[] = [
    {
      id: "STU001",
      name: "Alex Johnson",
      email: "alex.johnson@student.edu",
      grade: "10th",
      class: "Math Advanced",
      overallProgress: 85,
      lastActive: "2 hours ago",
      status: "excelling",
      avatar: "",
      gpa: 3.8,
      assignments: { completed: 8, total: 10 },
      quizzes: { completed: 5, total: 6 },
    },
    {
      id: "STU002",
      name: "Maria Rodriguez",
      email: "maria.rodriguez@student.edu",
      grade: "10th",
      class: "Math Basic",
      overallProgress: 65,
      lastActive: "1 day ago",
      status: "struggling",
      gpa: 2.9,
      assignments: { completed: 6, total: 10 },
      quizzes: { completed: 3, total: 6 },
    },
    {
      id: "STU003",
      name: "David Kim",
      email: "david.kim@student.edu",
      grade: "11th",
      class: "Math Advanced",
      overallProgress: 92,
      lastActive: "30 min ago",
      status: "excelling",
      gpa: 4.0,
      assignments: { completed: 10, total: 10 },
      quizzes: { completed: 6, total: 6 },
    },
    {
      id: "STU004",
      name: "Emma Wilson",
      email: "emma.wilson@student.edu",
      grade: "10th",
      class: "Science Basic",
      overallProgress: 78,
      lastActive: "4 hours ago",
      status: "active",
      gpa: 3.4,
      assignments: { completed: 7, total: 9 },
      quizzes: { completed: 4, total: 5 },
    },
    {
      id: "STU005",
      name: "James Thompson",
      email: "james.thompson@student.edu",
      grade: "11th",
      class: "Science Advanced",
      overallProgress: 88,
      lastActive: "1 hour ago",
      status: "excelling",
      gpa: 3.7,
      assignments: { completed: 9, total: 10 },
      quizzes: { completed: 5, total: 6 },
    },
  ];

  const classes: Class[] = [
    {
      id: "CLS001",
      name: "Advanced Mathematics",
      subject: "Mathematics",
      grade: "10th-11th",
      students: 25,
      avgProgress: 78,
      nextSession: "Today 2:00 PM",
      aiOverrides: 3,
      description: "Advanced calculus and analytical geometry",
      schedule: "Mon, Wed, Fri 2:00-3:30 PM",
    },
    {
      id: "CLS002",
      name: "Basic Science",
      subject: "Science",
      grade: "9th-10th",
      students: 30,
      avgProgress: 82,
      nextSession: "Tomorrow 10:00 AM",
      aiOverrides: 1,
      description: "Fundamentals of physics, chemistry, and biology",
      schedule: "Tue, Thu 10:00-11:30 AM",
    },
    {
      id: "CLS003",
      name: "Algebra Fundamentals",
      subject: "Mathematics",
      grade: "9th",
      students: 22,
      avgProgress: 65,
      nextSession: "Today 4:00 PM",
      aiOverrides: 5,
      description: "Basic algebraic concepts and problem-solving",
      schedule: "Daily 4:00-5:00 PM",
    },
  ];

  const aiAlerts: AIAlert[] = [
    {
      id: "1",
      type: "attention",
      student: "Maria Rodriguez",
      studentId: "STU002",
      message:
        "Student twin indicates difficulty with quadratic equations. Recommend additional practice sessions and personalized tutoring.",
      time: "1 hour ago",
      priority: "high",
    },
    {
      id: "2",
      type: "success",
      student: "David Kim",
      studentId: "STU003",
      message:
        "Exceptional performance detected. Student ready for advanced challenge problems and accelerated coursework.",
      time: "2 hours ago",
      priority: "medium",
    },
    {
      id: "3",
      type: "warning",
      student: "Emma Wilson",
      studentId: "STU004",
      message:
        "Declining engagement in recent lessons. Consider personalized intervention and alternative learning approaches.",
      time: "3 hours ago",
      priority: "high",
    },
    {
      id: "4",
      type: "attention",
      student: "Alex Johnson",
      studentId: "STU001",
      message:
        "Student showing interest in advanced topics. Opportunity for enrichment activities and mentorship role.",
      time: "5 hours ago",
      priority: "low",
    },
  ];

  const recentContent: Content[] = [
    {
      id: "CON001",
      title: "Quadratic Equations Practice",
      type: "quiz",
      subject: "Mathematics",
      created: "2 days ago",
      status: "published",
      students: 45,
      description: "Comprehensive quiz on quadratic equations and graphing",
      difficulty: "medium",
    },
    {
      id: "CON002",
      title: "Cell Division Interactive Lesson",
      type: "lesson",
      subject: "Science",
      created: "1 week ago",
      status: "published",
      students: 30,
      description: "Interactive lesson on mitosis and meiosis",
      difficulty: "easy",
    },
    {
      id: "CON003",
      title: "Physics Lab: Motion Analysis",
      type: "assignment",
      subject: "Science",
      created: "3 days ago",
      status: "draft",
      students: 0,
      description: "Hands-on lab experiment analyzing projectile motion",
      difficulty: "hard",
    },
  ];

  // Event handlers
  const handleLogout = () => {
    navigate("/login");
  };

  const handleCreateClass = () => {
    if (
      newClass.name &&
      newClass.subject &&
      newClass.grade &&
      newClass.description
    ) {
      const classData = { ...newClass, id: `CLS${Date.now()}` };
      console.log("Creating class:", classData);
      alert(`Class "${newClass.name}" created successfully!`);
      setIsCreateClassOpen(false);
      setNewClass({
        name: "",
        subject: "",
        grade: "",
        description: "",
        schedule: "",
      });
    } else {
      alert("Please fill in all required fields");
    }
  };

  const handleCreateContent = () => {
    if (
      newContent.title &&
      newContent.type &&
      newContent.subject &&
      newContent.description
    ) {
      const contentData = { ...newContent, id: `CON${Date.now()}` };
      console.log("Creating content:", contentData);
      alert(`${newContent.type} "${newContent.title}" created successfully!`);
      setIsCreateContentOpen(false);
      setNewContent({
        title: "",
        type: "lesson",
        subject: "",
        description: "",
        difficulty: "medium",
      });
    } else {
      alert("Please fill in all required fields");
    }
  };

  const handleDeleteClass = (classId: string, className: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${className}"? This action cannot be undone.`,
      )
    ) {
      console.log(`Deleting class: ${classId}`);
      alert(`Class "${className}" deleted successfully!`);
    }
  };

  const handleDeleteStudent = (studentId: string, studentName: string) => {
    if (
      window.confirm(
        `Are you sure you want to remove "${studentName}" from your classes?`,
      )
    ) {
      console.log(`Removing student: ${studentId}`);
      alert(`Student "${studentName}" removed successfully!`);
    }
  };

  const handleDeleteContent = (contentId: string, contentTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${contentTitle}"?`)) {
      console.log(`Deleting content: ${contentId}`);
      alert(`Content "${contentTitle}" deleted successfully!`);
    }
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

  const handleViewStudent = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (student) {
      setSelectedStudent(student);
      setIsStudentDetailOpen(true);
    }
  };

  const handleContactStudent = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (student) {
      navigate(`/message/${studentId}`, {
        state: { student, teacher: teacherInfo },
      });
    }
  };

  const handleReviewProgress = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (student) {
      navigate(`/student-progress/${studentId}`, {
        state: { student, teacher: teacherInfo },
      });
    }
  };

  const handleAssignChallenge = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (student) {
      navigate(`/assign-challenge/${studentId}`, {
        state: { student, teacher: teacherInfo },
      });
    }
  };

  const handleViewClass = (classId: string) => {
    const classData = classes.find((c) => c.id === classId);
    if (classData) {
      navigate(`/class/${classId}`, { state: { class: classData } });
    }
  };

  const handleManageClass = (classId: string) => {
    const classData = classes.find((c) => c.id === classId);
    if (classData) {
      navigate(`/class/${classId}/manage`, { state: { class: classData } });
    }
  };

  const handleImportContent = () => {
    // Simulate file import
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.docx,.pptx";
    input.onchange = () => {
      if (input.files && input.files[0]) {
        alert(`Importing content from ${input.files[0].name}...`);
        setTimeout(() => {
          alert("Content imported successfully!");
        }, 2000);
      }
    };
    input.click();
  };

  const handleGenerateWithAI = () => {
    navigate("/ai-content-generator", {
      state: { teacher: teacherInfo, classes },
    });
  };

  const handleGetStarted = () => {
    navigate("/content-builder", { state: { teacher: teacherInfo } });
  };

  const handleExportReport = () => {
    const reportData = {
      teacher: teacherInfo,
      classes: classes.map((c) => ({
        name: c.name,
        students: c.students,
        avgProgress: c.avgProgress,
      })),
      students: students.map((s) => ({
        name: s.name,
        progress: s.overallProgress,
        status: s.status,
      })),
      generatedAt: new Date().toISOString(),
    };

    console.log("Exporting report:", reportData);
    alert("Analytics report exported successfully!");
  };

  const handleScheduleReport = () => {
    navigate("/schedule-report", { state: { teacher: teacherInfo } });
  };

  const handleOpenSchedule = () => {
    navigate("/teacher-schedule", {
      state: { teacher: teacherInfo, classes },
    });
  };

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-700";
      case "struggling":
        return "bg-warning-100 text-warning-700";
      case "excelling":
        return "bg-accent-100 text-accent-700";
      case "published":
        return "bg-accent-100 text-accent-700";
      case "draft":
        return "bg-secondary-100 text-secondary-700";
      default:
        return "bg-secondary-100 text-secondary-700";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "attention":
        return <AlertTriangle className="w-4 h-4 text-warning-600" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-accent-600" />;
      case "warning":
        return <XCircle className="w-4 h-4 text-destructive-600" />;
      default:
        return <Brain className="w-4 h-4 text-primary-600" />;
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-accent-100 text-accent-700";
      case "medium":
        return "bg-warning-100 text-warning-700";
      case "hard":
        return "bg-destructive-100 text-destructive-700";
      default:
        return "bg-secondary-100 text-secondary-700";
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const unreadNotifications = notifications.filter((n) => !n.read).length;

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
                <p className="text-xs text-secondary-500">Teacher Portal</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Quick Actions */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCreateContentOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Quick Create
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
                      Stay updated with student activities and alerts
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
                            {notification.type === "submission" && (
                              <FileText className="w-4 h-4 text-primary-600" />
                            )}
                            {notification.type === "alert" && (
                              <AlertTriangle className="w-4 h-4 text-warning-600" />
                            )}
                            {notification.type === "reminder" && (
                              <Clock className="w-4 h-4 text-blue-600" />
                            )}
                            {notification.type === "announcement" && (
                              <Bell className="w-4 h-4 text-purple-600" />
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
                      <AvatarImage src={teacherInfo.avatar} />
                      <AvatarFallback className="bg-primary-100 text-primary-700">
                        {teacherInfo.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-secondary-800">
                        {teacherInfo.name}
                      </p>
                      <p className="text-xs text-secondary-500">
                        {teacherInfo.id} • {teacherInfo.subject}
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
                  <DropdownMenuItem onClick={handleExportReport}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
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
                  <Input value={teacherInfo.name} disabled />
                </div>
                <div>
                  <Label>Teacher ID</Label>
                  <Input value={teacherInfo.id} disabled />
                </div>
                <div>
                  <Label>Subject</Label>
                  <Input value={teacherInfo.subject} disabled />
                </div>
                <div>
                  <Label>Experience</Label>
                  <Input value={teacherInfo.experience} disabled />
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
              <h3 className="text-lg font-medium">Teaching Preferences</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Grading Scale</Label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="percentage">Percentage (0-100)</option>
                    <option value="gpa">GPA (0.0-4.0)</option>
                    <option value="letter">Letter Grades (A-F)</option>
                  </select>
                </div>
                <div>
                  <Label>AI Assistance Level</Label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="high">High - Maximum insights</option>
                    <option value="medium">Medium - Balanced approach</option>
                    <option value="low">Low - Minimal suggestions</option>
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

      {/* Student Detail Dialog */}
      <Dialog open={isStudentDetailOpen} onOpenChange={setIsStudentDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>
              Comprehensive view of student progress and information
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedStudent.avatar} />
                  <AvatarFallback className="bg-primary-100 text-primary-700 text-lg">
                    {selectedStudent.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">
                    {selectedStudent.name}
                  </h3>
                  <p className="text-secondary-600">{selectedStudent.email}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge className={getStatusColor(selectedStudent.status)}>
                      {selectedStudent.status}
                    </Badge>
                    <span className="text-sm text-secondary-500">
                      GPA: {selectedStudent.gpa}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Assignments</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary-600">
                        {selectedStudent.assignments.completed}
                      </span>
                      <span className="text-sm text-secondary-600">
                        / {selectedStudent.assignments.total}
                      </span>
                    </div>
                    <Progress
                      value={
                        (selectedStudent.assignments.completed /
                          selectedStudent.assignments.total) *
                        100
                      }
                      className="mt-2"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Quizzes</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-accent-600">
                        {selectedStudent.quizzes.completed}
                      </span>
                      <span className="text-sm text-secondary-600">
                        / {selectedStudent.quizzes.total}
                      </span>
                    </div>
                    <Progress
                      value={
                        (selectedStudent.quizzes.completed /
                          selectedStudent.quizzes.total) *
                        100
                      }
                      className="mt-2"
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleContactStudent(selectedStudent.id)}
                  className="flex-1"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Student
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleReviewProgress(selectedStudent.id)}
                  className="flex-1"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Review Progress
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Class Dialog */}
      <Dialog open={isCreateClassOpen} onOpenChange={setIsCreateClassOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Class</DialogTitle>
            <DialogDescription>
              Set up a new class for your students
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Class Name *</Label>
              <Input
                value={newClass.name}
                onChange={(e) =>
                  setNewClass((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Advanced Mathematics"
              />
            </div>
            <div>
              <Label>Subject *</Label>
              <Select
                value={newClass.subject}
                onValueChange={(value) =>
                  setNewClass((prev) => ({ ...prev, subject: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="History">History</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Grade Level *</Label>
              <Select
                value={newClass.grade}
                onValueChange={(value) =>
                  setNewClass((prev) => ({ ...prev, grade: value }))
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
                  <SelectItem value="Mixed">Mixed Grades</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description *</Label>
              <Textarea
                value={newClass.description}
                onChange={(e) =>
                  setNewClass((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Brief description of the class"
              />
            </div>
            <div>
              <Label>Schedule</Label>
              <Input
                value={newClass.schedule}
                onChange={(e) =>
                  setNewClass((prev) => ({ ...prev, schedule: e.target.value }))
                }
                placeholder="e.g., Mon, Wed, Fri 2:00-3:30 PM"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateClassOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateClass}>Create Class</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Content Dialog */}
      <Dialog open={isCreateContentOpen} onOpenChange={setIsCreateContentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Content</DialogTitle>
            <DialogDescription>
              Create lessons, quizzes, or assignments for your students
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title *</Label>
              <Input
                value={newContent.title}
                onChange={(e) =>
                  setNewContent((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Content title"
              />
            </div>
            <div>
              <Label>Type *</Label>
              <Select
                value={newContent.type}
                onValueChange={(value) =>
                  setNewContent((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lesson">Lesson</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Subject *</Label>
              <Select
                value={newContent.subject}
                onValueChange={(value) =>
                  setNewContent((prev) => ({ ...prev, subject: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="History">History</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Difficulty</Label>
              <Select
                value={newContent.difficulty}
                onValueChange={(value) =>
                  setNewContent((prev) => ({ ...prev, difficulty: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description *</Label>
              <Textarea
                value={newContent.description}
                onChange={(e) =>
                  setNewContent((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Content description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateContentOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateContent}>Create Content</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-secondary-800 mb-2">
                Welcome back, {teacherInfo.name}!
              </h2>
              <p className="text-secondary-600">
                Manage your classes, track student progress, and create engaging
                content with AI assistance
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-warning-500" />
                <span className="text-lg font-bold text-warning-600">
                  {teacherInfo.rating}
                </span>
              </div>
              <div className="text-sm text-secondary-600">
                {teacherInfo.classes} classes • {teacherInfo.students} students
              </div>
            </div>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="classes" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Classes
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Students
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
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
                        Total Classes
                      </p>
                      <p className="text-2xl font-bold text-secondary-800">
                        {classes.length}
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
                        Total Students
                      </p>
                      <p className="text-2xl font-bold text-secondary-800">
                        {students.length}
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
                      <p className="text-sm text-secondary-600">Avg Progress</p>
                      <p className="text-2xl font-bold text-secondary-800">
                        {Math.round(
                          classes.reduce(
                            (sum, cls) => sum + cls.avgProgress,
                            0,
                          ) / classes.length,
                        )}
                        %
                      </p>
                    </div>
                    <div className="p-3 bg-warning-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-warning-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-secondary-600">Twin Alerts</p>
                      <p className="text-2xl font-bold text-secondary-800">
                        {aiAlerts.length}
                      </p>
                    </div>
                    <div className="p-3 bg-secondary-100 rounded-lg">
                      <Brain className="w-6 h-6 text-secondary-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Student Twin Alerts */}
              <div className="lg:col-span-2">
                <Card className="card-elevated">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Brain className="w-5 h-5 text-primary-600" />
                          Student Twin Alerts
                        </CardTitle>
                        <CardDescription>
                          AI-powered insights about your students
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {aiAlerts.slice(0, 3).map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-4 bg-secondary-50 rounded-lg border border-secondary-100 ${getPriorityColor(alert.priority)}`}
                      >
                        <div className="flex items-start gap-3">
                          {getAlertIcon(alert.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-secondary-800">
                                {alert.student}
                              </h4>
                              <Badge
                                className={`text-xs ${
                                  alert.priority === "high"
                                    ? "bg-destructive-100 text-destructive-700"
                                    : alert.priority === "medium"
                                      ? "bg-warning-100 text-warning-700"
                                      : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {alert.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-secondary-600 mb-2">
                              {alert.message}
                            </p>
                            <p className="text-xs text-secondary-500">
                              {alert.time}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleReviewProgress(alert.studentId)
                              }
                            >
                              Review Progress
                            </Button>
                            <Button
                              size="sm"
                              onClick={() =>
                                handleAssignChallenge(alert.studentId)
                              }
                            >
                              Assign Challenge
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleContactStudent(alert.studentId)
                              }
                            >
                              Contact Student
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Today's Schedule */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Today's Schedule</CardTitle>
                  <CardDescription>Your upcoming classes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {classes.map((cls) => (
                    <div
                      key={cls.id}
                      className="p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors cursor-pointer"
                      onClick={() => handleViewClass(cls.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-secondary-800">
                            {cls.name}
                          </h4>
                          <p className="text-sm text-secondary-600">
                            {cls.nextSession}
                          </p>
                          <p className="text-xs text-secondary-500">
                            {cls.students} students
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-secondary-400" />
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleOpenSchedule}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    View Full Schedule
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="classes" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-secondary-800">
                  Class Management
                </h3>
                <p className="text-sm text-secondary-600">
                  {classes.length} active classes •{" "}
                  {classes.reduce((sum, cls) => sum + cls.students, 0)} total
                  students
                </p>
              </div>
              <Button
                className="btn-primary"
                onClick={() => setIsCreateClassOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Class
              </Button>
            </div>

            <div className="grid gap-6">
              {classes.map((cls) => (
                <Card key={cls.id} className="card-elevated">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary-100 rounded-lg">
                          <GraduationCap className="w-6 h-6 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-secondary-800">
                            {cls.name}
                          </h3>
                          <p className="text-sm text-secondary-600">
                            {cls.subject} • {cls.grade} • {cls.students}{" "}
                            students
                          </p>
                          <p className="text-xs text-secondary-500 mt-1">
                            {cls.description}
                          </p>
                          <p className="text-xs text-secondary-500">
                            Schedule: {cls.schedule}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-secondary-800">
                            Avg Progress
                          </p>
                          <p className="text-lg font-bold text-accent-600">
                            {cls.avgProgress}%
                          </p>
                          <p className="text-xs text-secondary-500">
                            Next: {cls.nextSession}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewClass(cls.id)}
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleManageClass(cls.id)}
                          >
                            <Edit className="w-4 h-4" />
                            Manage
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive-600 hover:text-destructive-700"
                            onClick={() => handleDeleteClass(cls.id, cls.name)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-secondary-800">
                  Student Management
                </h3>
                <p className="text-sm text-secondary-600">
                  {filteredStudents.length} students shown
                </p>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
                  <Input
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="excelling">Excelling</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="struggling">Struggling</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card className="card-elevated">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={student.avatar} />
                            <AvatarFallback className="bg-primary-100 text-primary-700">
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-secondary-800">
                              {student.name}
                            </p>
                            <p className="text-sm text-secondary-500">
                              {student.id}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {student.grade}
                      </TableCell>
                      <TableCell className="text-sm">{student.class}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {student.overallProgress}%
                          </span>
                          <div className="w-16 h-2 bg-secondary-200 rounded">
                            <div
                              className="h-full bg-accent-500 rounded"
                              style={{ width: `${student.overallProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-secondary-600">
                        {student.lastActive}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(student.status)}>
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            title="View Details"
                            onClick={() => handleViewStudent(student.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Contact Student"
                            onClick={() => handleContactStudent(student.id)}
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Review Progress"
                            onClick={() => handleReviewProgress(student.id)}
                          >
                            <BarChart3 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive-600 hover:text-destructive-700"
                            title="Remove Student"
                            onClick={() =>
                              handleDeleteStudent(student.id, student.name)
                            }
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

          <TabsContent value="content" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-secondary-800">
                  Content Management
                </h3>
                <p className="text-sm text-secondary-600">
                  Create and manage your teaching materials
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleImportContent}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
                <Button
                  className="btn-primary"
                  size="sm"
                  onClick={() => setIsCreateContentOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Content
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Quick Create</CardTitle>
                  <CardDescription>
                    Get started with content creation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full btn-primary"
                    onClick={handleGetStarted}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Get Started
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setNewContent({ ...newContent, type: "quiz" });
                      setIsCreateContentOpen(true);
                    }}
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Create Quiz
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleGenerateWithAI}
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Generate with AI
                  </Button>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Recent Content</CardTitle>
                  <CardDescription>Your latest creations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentContent.map((content) => (
                      <div
                        key={content.id}
                        className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm">
                              {content.title}
                            </p>
                            <Badge
                              className={getDifficultyColor(content.difficulty)}
                            >
                              {content.difficulty}
                            </Badge>
                          </div>
                          <p className="text-xs text-secondary-600">
                            {content.type} • {content.subject}
                          </p>
                          <p className="text-xs text-secondary-500">
                            {content.created} • {content.students} students
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(content.status)}>
                            {content.status}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDeleteContent(content.id, content.title)
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-secondary-800">
                Analytics Dashboard
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleExportReport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
                <Button variant="outline" onClick={handleScheduleReport}>
                  <Clock className="w-4 h-4 mr-2" />
                  Schedule Reports
                </Button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Class Performance</CardTitle>
                  <CardDescription>Average progress by class</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {classes.map((cls) => (
                      <div key={cls.id}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            {cls.name}
                          </span>
                          <span className="text-sm text-secondary-600">
                            {cls.avgProgress}%
                          </span>
                        </div>
                        <Progress value={cls.avgProgress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Student Engagement</CardTitle>
                  <CardDescription>
                    Activity and participation metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-accent-600 mb-1">
                        87%
                      </div>
                      <p className="text-sm text-secondary-600">
                        Average Engagement Rate
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-primary-50 rounded-lg">
                        <div className="text-lg font-bold text-primary-600">
                          {
                            students.filter(
                              (s) =>
                                s.status === "active" ||
                                s.status === "excelling",
                            ).length
                          }
                        </div>
                        <p className="text-xs text-secondary-600">
                          Active Today
                        </p>
                      </div>
                      <div className="p-3 bg-warning-50 rounded-lg">
                        <div className="text-lg font-bold text-warning-600">
                          92%
                        </div>
                        <p className="text-xs text-secondary-600">
                          Completion Rate
                        </p>
                      </div>
                      <div className="p-3 bg-accent-50 rounded-lg">
                        <div className="text-lg font-bold text-accent-600">
                          4.2
                        </div>
                        <p className="text-xs text-secondary-600">Avg Score</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Detailed Analytics</CardTitle>
                <CardDescription>
                  Comprehensive performance insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600 mb-2">
                      {Math.round(
                        (students.filter((s) => s.status === "excelling")
                          .length /
                          students.length) *
                          100,
                      )}
                      %
                    </div>
                    <p className="text-sm text-secondary-600">
                      Students Excelling
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning-600 mb-2">
                      {students.filter((s) => s.status === "struggling").length}
                    </div>
                    <p className="text-sm text-secondary-600">
                      Students Need Help
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-600 mb-2">
                      {aiAlerts.filter((a) => a.priority === "high").length}
                    </div>
                    <p className="text-sm text-secondary-600">
                      High Priority Alerts
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default TeacherDashboard;
