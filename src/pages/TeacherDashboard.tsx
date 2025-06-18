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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Student {
  id: string;
  name: string;
  grade: string;
  class: string;
  overallProgress: number;
  lastActive: string;
  status: "active" | "struggling" | "excelling";
  avatar?: string;
}

interface Class {
  id: string;
  name: string;
  subject: string;
  students: number;
  avgProgress: number;
  nextSession: string;
  aiOverrides: number;
}

interface AIAlert {
  id: string;
  type: "attention" | "success" | "warning";
  student: string;
  message: string;
  time: string;
  action?: string;
}

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("overview");

  // Mock data
  const teacherInfo = {
    name: "Sarah Chen",
    id: "TCH001",
    subject: "Mathematics & Science",
    avatar: "",
  };

  const classes: Class[] = [
    {
      id: "1",
      name: "Advanced Mathematics",
      subject: "Mathematics",
      students: 28,
      avgProgress: 78,
      nextSession: "Today 2:00 PM",
      aiOverrides: 3,
    },
    {
      id: "2",
      name: "Physics Fundamentals",
      subject: "Science",
      students: 24,
      avgProgress: 65,
      nextSession: "Tomorrow 10:00 AM",
      aiOverrides: 1,
    },
    {
      id: "3",
      name: "AP Calculus",
      subject: "Mathematics",
      students: 18,
      avgProgress: 85,
      nextSession: "Tomorrow 2:00 PM",
      aiOverrides: 5,
    },
  ];

  const students: Student[] = [
    {
      id: "STU001",
      name: "Alex Johnson",
      grade: "10th",
      class: "Advanced Mathematics",
      overallProgress: 75,
      lastActive: "2 hours ago",
      status: "active",
    },
    {
      id: "STU002",
      name: "Maria Garcia",
      grade: "10th",
      class: "Advanced Mathematics",
      overallProgress: 45,
      lastActive: "1 day ago",
      status: "struggling",
    },
    {
      id: "STU003",
      name: "James Smith",
      grade: "10th",
      class: "Advanced Mathematics",
      overallProgress: 95,
      lastActive: "30 min ago",
      status: "excelling",
    },
    {
      id: "STU004",
      name: "Emma Wilson",
      grade: "10th",
      class: "Physics Fundamentals",
      overallProgress: 82,
      lastActive: "1 hour ago",
      status: "active",
    },
    {
      id: "STU005",
      name: "David Brown",
      grade: "11th",
      class: "AP Calculus",
      overallProgress: 88,
      lastActive: "3 hours ago",
      status: "excelling",
    },
  ];

  const aiAlerts: AIAlert[] = [
    {
      id: "1",
      type: "attention",
      student: "Maria Garcia",
      message: "Struggling with quadratic equations - may need intervention",
      time: "30 min ago",
      action: "Review Progress",
    },
    {
      id: "2",
      type: "success",
      student: "James Smith",
      message: "Completed advanced calculus module ahead of schedule",
      time: "1 hour ago",
      action: "Assign Challenge",
    },
    {
      id: "3",
      type: "warning",
      student: "Emma Wilson",
      message: "Hasn't logged in for 2 days - check attendance",
      time: "2 hours ago",
      action: "Contact Student",
    },
  ];

  const recentActivity = [
    {
      id: "1",
      type: "override",
      description: "Adjusted difficulty for 'Trigonometry Quiz'",
      time: "1 hour ago",
      class: "Advanced Mathematics",
    },
    {
      id: "2",
      type: "content",
      description: "Created new lesson: 'Newton's Laws Application'",
      time: "3 hours ago",
      class: "Physics Fundamentals",
    },
    {
      id: "3",
      type: "student",
      description: "Reviewed progress for struggling students",
      time: "5 hours ago",
      class: "Advanced Mathematics",
    },
  ];

  const handleLogout = () => {
    navigate("/login");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excelling":
        return "bg-accent-100 text-accent-700";
      case "struggling":
        return "bg-destructive-100 text-destructive-700";
      default:
        return "bg-primary-100 text-primary-700";
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
        return <Bell className="w-4 h-4" />;
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
                <p className="text-xs text-secondary-500">Teacher Portal</p>
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
                        {teacherInfo.id}
                      </p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule
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
            Welcome back, {teacherInfo.name.split(" ")[0]}!
          </h2>
          <p className="text-secondary-600">
            Monitor your classes and guide student learning
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="classes" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Classes
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Students
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-secondary-600">
                        Total Students
                      </p>
                      <p className="text-2xl font-bold text-secondary-800">
                        70
                      </p>
                    </div>
                    <div className="p-3 bg-primary-100 rounded-lg">
                      <Users className="w-6 h-6 text-primary-600" />
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
                      <p className="text-2xl font-bold text-secondary-800">3</p>
                    </div>
                    <div className="p-3 bg-accent-100 rounded-lg">
                      <BookOpen className="w-6 h-6 text-accent-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-secondary-600">AI Overrides</p>
                      <p className="text-2xl font-bold text-secondary-800">9</p>
                    </div>
                    <div className="p-3 bg-warning-100 rounded-lg">
                      <Brain className="w-6 h-6 text-warning-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-secondary-600">Avg. Score</p>
                      <p className="text-2xl font-bold text-secondary-800">
                        76%
                      </p>
                    </div>
                    <div className="p-3 bg-secondary-100 rounded-lg">
                      <Target className="w-6 h-6 text-secondary-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* AI Alerts */}
              <div className="lg:col-span-2">
                <Card className="card-elevated">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Brain className="w-5 h-5 text-primary-600" />
                          AI Student Alerts
                        </CardTitle>
                        <CardDescription>
                          Students requiring attention based on AI analysis
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {aiAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="p-4 bg-secondary-50 rounded-lg border border-secondary-100"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            {getAlertIcon(alert.type)}
                            <div className="flex-1">
                              <h4 className="font-medium text-secondary-800">
                                {alert.student}
                              </h4>
                              <p className="text-sm text-secondary-600 mt-1">
                                {alert.message}
                              </p>
                              <p className="text-xs text-secondary-500 mt-2">
                                {alert.time}
                              </p>
                            </div>
                          </div>
                          {alert.action && (
                            <Button size="sm" variant="outline">
                              {alert.action}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="p-2 bg-secondary-100 rounded-lg">
                        {activity.type === "override" && (
                          <Brain className="w-4 h-4 text-warning-600" />
                        )}
                        {activity.type === "content" && (
                          <FileText className="w-4 h-4 text-primary-600" />
                        )}
                        {activity.type === "student" && (
                          <Users className="w-4 h-4 text-accent-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-secondary-800">
                          {activity.description}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-secondary-500">
                            {activity.time}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {activity.class}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="classes" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-secondary-800">
                Your Classes
              </h3>
              <Button className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Class
              </Button>
            </div>

            <div className="grid gap-6">
              {classes.map((classItem) => (
                <Card key={classItem.id} className="card-interactive">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-secondary-800">
                            {classItem.name}
                          </h3>
                          {classItem.aiOverrides > 0 && (
                            <Badge className="bg-warning-100 text-warning-700">
                              {classItem.aiOverrides} AI Overrides
                            </Badge>
                          )}
                        </div>
                        <p className="text-secondary-600 mb-1">
                          {classItem.subject} • {classItem.students} students
                        </p>
                        <p className="text-sm text-secondary-500">
                          Next: {classItem.nextSession}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button size="sm" className="btn-primary">
                          <Edit className="w-4 h-4 mr-2" />
                          Manage
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-secondary-600">
                          Average Progress
                        </span>
                        <span className="font-medium text-secondary-800">
                          {classItem.avgProgress}%
                        </span>
                      </div>
                      <Progress value={classItem.avgProgress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-secondary-800">
                Student Management
              </h3>
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

            <Card className="card-elevated">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={student.avatar} />
                            <AvatarFallback className="bg-secondary-100 text-secondary-700">
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
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{student.class}</p>
                          <p className="text-xs text-secondary-500">
                            {student.grade} Grade
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>{student.overallProgress}%</span>
                          </div>
                          <Progress
                            value={student.overallProgress}
                            className="h-1 w-20"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(student.status)}>
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-secondary-600">
                        {student.lastActive}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="w-4 h-4" />
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
              <h3 className="text-xl font-semibold text-secondary-800">
                Content Management
              </h3>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
                <Button className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Content
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="card-interactive">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto p-4 bg-primary-100 rounded-2xl w-fit mb-4">
                    <BookOpen className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-secondary-800 mb-2">
                    Create Lesson
                  </h3>
                  <p className="text-sm text-secondary-600 mb-4">
                    Build interactive lessons with AI assistance
                  </p>
                  <Button className="btn-primary w-full">Get Started</Button>
                </CardContent>
              </Card>

              <Card className="card-interactive">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto p-4 bg-accent-100 rounded-2xl w-fit mb-4">
                    <Target className="w-8 h-8 text-accent-600" />
                  </div>
                  <h3 className="font-semibold text-secondary-800 mb-2">
                    Quiz Builder
                  </h3>
                  <p className="text-sm text-secondary-600 mb-4">
                    Generate adaptive quizzes automatically
                  </p>
                  <Button className="btn-primary w-full">Create Quiz</Button>
                </CardContent>
              </Card>

              <Card className="card-interactive">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto p-4 bg-warning-100 rounded-2xl w-fit mb-4">
                    <Brain className="w-8 h-8 text-warning-600" />
                  </div>
                  <h3 className="font-semibold text-secondary-800 mb-2">
                    AI Content
                  </h3>
                  <p className="text-sm text-secondary-600 mb-4">
                    Generate personalized content with AI
                  </p>
                  <Button className="btn-primary w-full">Generate</Button>
                </CardContent>
              </Card>
            </div>

            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Recent Content</CardTitle>
                <CardDescription>
                  Your recently created or modified content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Quadratic Equations Interactive Lesson",
                      type: "Lesson",
                      class: "Advanced Mathematics",
                      modified: "2 hours ago",
                    },
                    {
                      title: "Newton's Laws Quiz",
                      type: "Quiz",
                      class: "Physics Fundamentals",
                      modified: "1 day ago",
                    },
                    {
                      title: "Calculus Practice Problems",
                      type: "Assignment",
                      class: "AP Calculus",
                      modified: "3 days ago",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium text-secondary-800">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {item.type}
                          </Badge>
                          <span className="text-xs text-secondary-500">
                            {item.class} • {item.modified}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-secondary-800">
                Teaching Analytics
              </h3>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Class Performance Overview</CardTitle>
                  <CardDescription>
                    Average scores across your classes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {classes.map((classItem) => (
                      <div key={classItem.id}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-secondary-800">
                            {classItem.name}
                          </span>
                          <span className="text-sm text-secondary-600">
                            {classItem.avgProgress}%
                          </span>
                        </div>
                        <Progress
                          value={classItem.avgProgress}
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>AI Intervention Summary</CardTitle>
                  <CardDescription>
                    How often you override AI recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-warning-600 mb-1">
                        12%
                      </div>
                      <p className="text-sm text-secondary-600">
                        Override Rate This Month
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-secondary-600">
                          Content Difficulty
                        </span>
                        <span className="text-sm font-medium">45%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-secondary-600">
                          Pacing Adjustments
                        </span>
                        <span className="text-sm font-medium">30%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-secondary-600">
                          Student Grouping
                        </span>
                        <span className="text-sm font-medium">25%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Student Progress Trends</CardTitle>
                <CardDescription>
                  Track how your students are progressing over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-accent-50 rounded-lg">
                    <div className="text-2xl font-bold text-accent-600">
                      85%
                    </div>
                    <p className="text-sm text-secondary-600">On Track</p>
                  </div>
                  <div className="p-4 bg-warning-50 rounded-lg">
                    <div className="text-2xl font-bold text-warning-600">
                      10%
                    </div>
                    <p className="text-sm text-secondary-600">Need Support</p>
                  </div>
                  <div className="p-4 bg-primary-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary-600">
                      5%
                    </div>
                    <p className="text-sm text-secondary-600">Advanced</p>
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
