import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  GraduationCap,
  Settings,
  Shield,
  BarChart3,
  Calendar,
  Bell,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Search,
  Filter,
  UserPlus,
  BookOpen,
  Clock,
  Award,
  AlertTriangle,
  CheckCircle,
  Monitor,
  HardDrive,
  Wifi,
  Lock,
  Unlock,
  RefreshCw,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  status: "active" | "inactive" | "suspended";
  lastActive: string;
  createdAt: string;
}

interface Device {
  id: string;
  assignedTo: string;
  model: string;
  status: "active" | "offline" | "maintenance" | "lost";
  lastSeen: string;
  batteryLevel?: number;
}

interface AIOverride {
  id: string;
  teacher: string;
  student: string;
  lesson: string;
  reason: string;
  timestamp: string;
  approved: boolean;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "student" as "student" | "teacher",
    grade: "",
    subject: "",
  });

  // Mock data
  const adminInfo = {
    name: "Dr. Emily Rodriguez",
    id: "ADM001",
    role: "School Administrator",
    avatar: "",
  };

  const users: User[] = [
    {
      id: "STU001",
      name: "Alex Johnson",
      email: "alex.johnson@school.edu",
      role: "student",
      status: "active",
      lastActive: "2 hours ago",
      createdAt: "2024-01-15",
    },
    {
      id: "STU002",
      name: "Maria Garcia",
      email: "maria.garcia@school.edu",
      role: "student",
      status: "active",
      lastActive: "1 day ago",
      createdAt: "2024-01-15",
    },
    {
      id: "TCH001",
      name: "Sarah Chen",
      email: "sarah.chen@school.edu",
      role: "teacher",
      status: "active",
      lastActive: "30 min ago",
      createdAt: "2024-01-10",
    },
    {
      id: "TCH002",
      name: "Michael Brown",
      email: "michael.brown@school.edu",
      role: "teacher",
      status: "inactive",
      lastActive: "1 week ago",
      createdAt: "2024-01-08",
    },
  ];

  const devices: Device[] = [
    {
      id: "DEV001",
      assignedTo: "Alex Johnson (STU001)",
      model: "iPad Pro 11",
      status: "active",
      lastSeen: "2 hours ago",
      batteryLevel: 85,
    },
    {
      id: "DEV002",
      assignedTo: "Maria Garcia (STU002)",
      model: "iPad Air",
      status: "offline",
      lastSeen: "1 day ago",
      batteryLevel: 15,
    },
    {
      id: "DEV003",
      assignedTo: "Sarah Chen (TCH001)",
      model: "MacBook Pro",
      status: "active",
      lastSeen: "30 min ago",
      batteryLevel: 78,
    },
  ];

  const aiOverrides: AIOverride[] = [
    {
      id: "OVR001",
      teacher: "Sarah Chen",
      student: "Alex Johnson",
      lesson: "Advanced Calculus",
      reason: "Student needs more challenging content",
      timestamp: "2 hours ago",
      approved: true,
    },
    {
      id: "OVR002",
      teacher: "Michael Brown",
      student: "Maria Garcia",
      lesson: "Basic Algebra",
      reason: "Reduce difficulty due to struggle",
      timestamp: "1 day ago",
      approved: false,
    },
  ];

  const schoolStats = {
    totalStudents: 1250,
    totalTeachers: 85,
    totalClasses: 42,
    activeDevices: 1180,
    avgPerformance: 78,
    aiAccuracy: 92,
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const handleCreateUser = () => {
    // Generate ID based on role
    const prefix = newUser.role === "student" ? "STU" : "TCH";
    const newId = `${prefix}${String(users.filter((u) => u.role === newUser.role).length + 1).padStart(3, "0")}`;

    console.log("Creating user:", { ...newUser, id: newId });
    setIsCreateUserOpen(false);
    setNewUser({
      name: "",
      email: "",
      role: "student",
      grade: "",
      subject: "",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-accent-100 text-accent-700";
      case "inactive":
        return "bg-secondary-100 text-secondary-700";
      case "suspended":
        return "bg-destructive-100 text-destructive-700";
      case "offline":
        return "bg-warning-100 text-warning-700";
      case "maintenance":
        return "bg-primary-100 text-primary-700";
      case "lost":
        return "bg-destructive-100 text-destructive-700";
      default:
        return "bg-secondary-100 text-secondary-700";
    }
  };

  const getDeviceIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Monitor className="w-4 h-4 text-accent-600" />;
      case "offline":
        return <Wifi className="w-4 h-4 text-warning-600" />;
      case "maintenance":
        return <HardDrive className="w-4 h-4 text-primary-600" />;
      case "lost":
        return <AlertTriangle className="w-4 h-4 text-destructive-600" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

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
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive-500 rounded-full"></span>
              </Button>

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
                        {adminInfo.id}
                      </p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    System Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Shield className="w-4 h-4 mr-2" />
                    Security
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
          <h2 className="text-3xl font-bold text-secondary-800 mb-2">
            School Administration Dashboard
          </h2>
          <p className="text-secondary-600">
            Manage users, monitor systems, and oversee educational operations
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:grid-cols-6 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="devices" className="flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              Devices
            </TabsTrigger>
            <TabsTrigger
              value="ai-oversight"
              className="flex items-center gap-2"
            >
              <Brain className="w-4 h-4" />
              AI Oversight
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* School Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                      <p className="text-sm text-secondary-600">Teachers</p>
                      <p className="text-2xl font-bold text-secondary-800">
                        {schoolStats.totalTeachers}
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
                      <p className="text-sm text-secondary-600">
                        Active Devices
                      </p>
                      <p className="text-2xl font-bold text-secondary-800">
                        {schoolStats.activeDevices.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-warning-100 rounded-lg">
                      <Monitor className="w-6 h-6 text-warning-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-secondary-600">AI Accuracy</p>
                      <p className="text-2xl font-bold text-secondary-800">
                        {schoolStats.aiAccuracy}%
                      </p>
                    </div>
                    <div className="p-3 bg-secondary-100 rounded-lg">
                      <Brain className="w-6 h-6 text-secondary-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-secondary-600">
                        Avg Performance
                      </p>
                      <p className="text-2xl font-bold text-secondary-800">
                        {schoolStats.avgPerformance}%
                      </p>
                    </div>
                    <div className="p-3 bg-primary-100 rounded-lg">
                      <Award className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-secondary-600">
                        Active Classes
                      </p>
                      <p className="text-2xl font-bold text-secondary-800">
                        {schoolStats.totalClasses}
                      </p>
                    </div>
                    <div className="p-3 bg-accent-100 rounded-lg">
                      <BookOpen className="w-6 h-6 text-accent-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="card-elevated lg:col-span-2">
                <CardHeader>
                  <CardTitle>System Alerts</CardTitle>
                  <CardDescription>
                    Important notifications requiring admin attention
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-warning-50 rounded-lg border border-warning-200">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-warning-600" />
                      <div>
                        <h4 className="font-medium text-secondary-800">
                          High AI Override Rate
                        </h4>
                        <p className="text-sm text-secondary-600 mt-1">
                          Teachers are overriding AI recommendations 15% more
                          than usual this week.
                        </p>
                        <Button size="sm" variant="outline" className="mt-3">
                          Review Patterns
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                    <div className="flex items-start gap-3">
                      <Monitor className="w-5 h-5 text-primary-600" />
                      <div>
                        <h4 className="font-medium text-secondary-800">
                          Device Update Available
                        </h4>
                        <p className="text-sm text-secondary-600 mt-1">
                          85 devices need software updates for enhanced
                          security.
                        </p>
                        <Button size="sm" variant="outline" className="mt-3">
                          Schedule Updates
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Dialog
                    open={isCreateUserOpen}
                    onOpenChange={setIsCreateUserOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="btn-primary w-full">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New User</DialogTitle>
                        <DialogDescription>
                          Add a new student or teacher to the system
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
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
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={newUser.email}
                            onChange={(e) =>
                              setNewUser({ ...newUser, email: e.target.value })
                            }
                            placeholder="user@school.edu"
                          />
                        </div>
                        <div>
                          <Label htmlFor="role">Role</Label>
                          <Select
                            value={newUser.role}
                            onValueChange={(value: "student" | "teacher") =>
                              setNewUser({ ...newUser, role: value })
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
                        {newUser.role === "student" && (
                          <div>
                            <Label htmlFor="grade">Grade</Label>
                            <Select
                              value={newUser.grade}
                              onValueChange={(value) =>
                                setNewUser({ ...newUser, grade: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select grade level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pre-K">Pre-K</SelectItem>
                                <SelectItem value="Kindergarten">
                                  Kindergarten
                                </SelectItem>
                                <SelectItem value="1st Grade">
                                  1st Grade
                                </SelectItem>
                                <SelectItem value="2nd Grade">
                                  2nd Grade
                                </SelectItem>
                                <SelectItem value="3rd Grade">
                                  3rd Grade
                                </SelectItem>
                                <SelectItem value="4th Grade">
                                  4th Grade
                                </SelectItem>
                                <SelectItem value="5th Grade">
                                  5th Grade
                                </SelectItem>
                                <SelectItem value="6th Grade">
                                  6th Grade
                                </SelectItem>
                                <SelectItem value="7th Grade">
                                  7th Grade
                                </SelectItem>
                                <SelectItem value="8th Grade">
                                  8th Grade
                                </SelectItem>
                                <SelectItem value="9th Grade">
                                  9th Grade
                                </SelectItem>
                                <SelectItem value="10th Grade">
                                  10th Grade
                                </SelectItem>
                                <SelectItem value="11th Grade">
                                  11th Grade
                                </SelectItem>
                                <SelectItem value="12th Grade">
                                  12th Grade
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        {newUser.role === "teacher" && (
                          <div>
                            <Label htmlFor="subject">Subject</Label>
                            <Select
                              value={newUser.subject}
                              onValueChange={(value) =>
                                setNewUser({ ...newUser, subject: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select teaching subject" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Mathematics">
                                  Mathematics
                                </SelectItem>
                                <SelectItem value="English Language Arts">
                                  English Language Arts
                                </SelectItem>
                                <SelectItem value="Science">Science</SelectItem>
                                <SelectItem value="Biology">Biology</SelectItem>
                                <SelectItem value="Chemistry">
                                  Chemistry
                                </SelectItem>
                                <SelectItem value="Physics">Physics</SelectItem>
                                <SelectItem value="History">History</SelectItem>
                                <SelectItem value="Social Studies">
                                  Social Studies
                                </SelectItem>
                                <SelectItem value="Geography">
                                  Geography
                                </SelectItem>
                                <SelectItem value="Physical Education">
                                  Physical Education
                                </SelectItem>
                                <SelectItem value="Art">Art</SelectItem>
                                <SelectItem value="Music">Music</SelectItem>
                                <SelectItem value="Foreign Language">
                                  Foreign Language
                                </SelectItem>
                                <SelectItem value="Spanish">Spanish</SelectItem>
                                <SelectItem value="French">French</SelectItem>
                                <SelectItem value="Computer Science">
                                  Computer Science
                                </SelectItem>
                                <SelectItem value="Health Education">
                                  Health Education
                                </SelectItem>
                                <SelectItem value="Special Education">
                                  Special Education
                                </SelectItem>
                                <SelectItem value="Library Sciences">
                                  Library Sciences
                                </SelectItem>
                                <SelectItem value="Counseling">
                                  Counseling
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsCreateUserOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleCreateUser}>Create User</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline" className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Reports
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Maintenance
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-secondary-800">
                User Management
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button
                  className="btn-primary"
                  size="sm"
                  onClick={() => setIsCreateUserOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>

            <Card className="card-elevated">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-secondary-100 text-secondary-700">
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
                            <p className="text-sm text-secondary-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-secondary-600">
                        {user.lastActive}
                      </TableCell>
                      <TableCell className="text-sm text-secondary-600">
                        {user.createdAt}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="devices" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-secondary-800">
                Device Management
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sync All
                </Button>
                <Button variant="outline" size="sm">
                  <Lock className="w-4 h-4 mr-2" />
                  Lock Devices
                </Button>
              </div>
            </div>

            <Card className="card-elevated">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Battery</TableHead>
                    <TableHead>Last Seen</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {devices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {getDeviceIcon(device.status)}
                          <div>
                            <p className="font-medium text-secondary-800">
                              {device.model}
                            </p>
                            <p className="text-sm text-secondary-500">
                              {device.id}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {device.assignedTo}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(device.status)}>
                          {device.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {device.batteryLevel && (
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-2 bg-secondary-200 rounded">
                              <div
                                className={`h-full rounded ${
                                  device.batteryLevel > 50
                                    ? "bg-accent-500"
                                    : device.batteryLevel > 20
                                      ? "bg-warning-500"
                                      : "bg-destructive-500"
                                }`}
                                style={{ width: `${device.batteryLevel}%` }}
                              />
                            </div>
                            <span className="text-sm text-secondary-600">
                              {device.batteryLevel}%
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-secondary-600">
                        {device.lastSeen}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Lock className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <RefreshCw className="w-4 h-4" />
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
              <h3 className="text-xl font-semibold text-secondary-800">
                AI Oversight & Control
              </h3>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Configure AI
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Recent AI Overrides</CardTitle>
                  <CardDescription>
                    Teacher interventions in AI recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {aiOverrides.map((override) => (
                    <div
                      key={override.id}
                      className="p-4 bg-secondary-50 rounded-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-secondary-800">
                              {override.lesson}
                            </h4>
                            <Badge
                              className={
                                override.approved
                                  ? "bg-accent-100 text-accent-700"
                                  : "bg-warning-100 text-warning-700"
                              }
                            >
                              {override.approved ? "Approved" : "Pending"}
                            </Badge>
                          </div>
                          <p className="text-sm text-secondary-600 mb-1">
                            <strong>Teacher:</strong> {override.teacher}
                          </p>
                          <p className="text-sm text-secondary-600 mb-1">
                            <strong>Student:</strong> {override.student}
                          </p>
                          <p className="text-sm text-secondary-600 mb-2">
                            <strong>Reason:</strong> {override.reason}
                          </p>
                          <p className="text-xs text-secondary-500">
                            {override.timestamp}
                          </p>
                        </div>
                        {!override.approved && (
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>AI Performance Metrics</CardTitle>
                  <CardDescription>
                    System-wide AI effectiveness
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-1">
                      92%
                    </div>
                    <p className="text-sm text-secondary-600">
                      Overall Accuracy
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-secondary-600">
                          Content Recommendations
                        </span>
                        <span className="text-sm font-medium">95%</span>
                      </div>
                      <div className="w-full bg-secondary-200 rounded-full h-2">
                        <div
                          className="bg-accent-500 h-2 rounded-full"
                          style={{ width: "95%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-secondary-600">
                          Difficulty Adjustment
                        </span>
                        <span className="text-sm font-medium">88%</span>
                      </div>
                      <div className="w-full bg-secondary-200 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full"
                          style={{ width: "88%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-secondary-600">
                          Student Grouping
                        </span>
                        <span className="text-sm font-medium">91%</span>
                      </div>
                      <div className="w-full bg-secondary-200 rounded-full h-2">
                        <div
                          className="bg-warning-500 h-2 rounded-full"
                          style={{ width: "91%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-secondary-800">
                School Analytics
              </h3>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Reports
                </Button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>
                    School-wide academic performance over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-accent-600 mb-1">
                      +8.5%
                    </div>
                    <p className="text-sm text-secondary-600">
                      Performance improvement this semester
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Mathematics</span>
                        <span>85%</span>
                      </div>
                      <div className="w-full bg-secondary-200 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full"
                          style={{ width: "85%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Science</span>
                        <span>78%</span>
                      </div>
                      <div className="w-full bg-secondary-200 rounded-full h-2">
                        <div
                          className="bg-accent-500 h-2 rounded-full"
                          style={{ width: "78%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>History</span>
                        <span>82%</span>
                      </div>
                      <div className="w-full bg-secondary-200 rounded-full h-2">
                        <div
                          className="bg-warning-500 h-2 rounded-full"
                          style={{ width: "82%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>System Usage</CardTitle>
                  <CardDescription>
                    Platform engagement and utilization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-center mb-6">
                    <div className="p-4 bg-primary-50 rounded-lg">
                      <div className="text-2xl font-bold text-primary-600">
                        94%
                      </div>
                      <p className="text-sm text-secondary-600">
                        Daily Active Users
                      </p>
                    </div>
                    <div className="p-4 bg-accent-50 rounded-lg">
                      <div className="text-2xl font-bold text-accent-600">
                        6.8h
                      </div>
                      <p className="text-sm text-secondary-600">
                        Avg. Session Time
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Student Engagement</span>
                      <span>92%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Teacher Adoption</span>
                      <span>88%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Content Completion</span>
                      <span>76%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-secondary-800">
                System Settings
              </h3>
              <Button>
                <Settings className="w-4 h-4 mr-2" />
                Advanced Settings
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>AI Configuration</CardTitle>
                  <CardDescription>
                    Configure AI behavior and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-secondary-800">
                        Auto-adapt Difficulty
                      </p>
                      <p className="text-sm text-secondary-600">
                        Allow AI to adjust content difficulty
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-secondary-800">
                        Teacher Override Required
                      </p>
                      <p className="text-sm text-secondary-600">
                        Require approval for major changes
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-secondary-800">
                        Student Data Collection
                      </p>
                      <p className="text-sm text-secondary-600">
                        Control data collection scope
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Security & Privacy</CardTitle>
                  <CardDescription>
                    School-wide security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-secondary-800">
                        Data Encryption
                      </p>
                      <p className="text-sm text-secondary-600">
                        End-to-end encryption status
                      </p>
                    </div>
                    <Badge className="bg-accent-100 text-accent-700">
                      Active
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-secondary-800">
                        Access Logs
                      </p>
                      <p className="text-sm text-secondary-600">
                        User activity monitoring
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Logs
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-secondary-800">
                        Data Retention
                      </p>
                      <p className="text-sm text-secondary-600">
                        Configure data storage policies
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
