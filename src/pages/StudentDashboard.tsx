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
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  date?: string;
}

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("overview");

  // Mock data
  const studentInfo = {
    name: "Alex Johnson",
    id: "STU001",
    grade: "10th Grade",
    avatar: "",
  };

  const courses: Course[] = [
    {
      id: "1",
      title: "Advanced Mathematics",
      subject: "Mathematics",
      progress: 75,
      nextLesson: "Calculus Fundamentals",
      difficulty: "Advanced",
      aiRecommended: true,
    },
    {
      id: "2",
      title: "World History",
      subject: "History",
      progress: 60,
      nextLesson: "Industrial Revolution",
      difficulty: "Intermediate",
      aiRecommended: false,
    },
    {
      id: "3",
      title: "Biology Basics",
      subject: "Science",
      progress: 90,
      nextLesson: "Cell Division",
      difficulty: "Beginner",
      aiRecommended: true,
    },
  ];

  const achievements: Achievement[] = [
    {
      id: "1",
      title: "Quick Learner",
      description: "Completed 5 lessons in a day",
      icon: "⚡",
      earned: true,
      date: "2024-01-15",
    },
    {
      id: "2",
      title: "Perfect Score",
      description: "Got 100% on a quiz",
      icon: "🎯",
      earned: true,
      date: "2024-01-10",
    },
    {
      id: "3",
      title: "Consistency Champion",
      description: "7-day learning streak",
      icon: "🔥",
      earned: false,
    },
  ];

  const recentActivity = [
    {
      id: "1",
      type: "lesson_completed",
      title: "Completed 'Quadratic Equations'",
      time: "2 hours ago",
      score: 95,
    },
    {
      id: "2",
      type: "quiz_taken",
      title: "Biology Quiz #3",
      time: "5 hours ago",
      score: 88,
    },
    {
      id: "3",
      type: "ai_recommendation",
      title: "AI suggested review for Chemistry basics",
      time: "1 day ago",
      score: null,
    },
  ];

  const handleLogout = () => {
    navigate("/login");
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
                <p className="text-xs text-secondary-500">Student Portal</p>
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
                        {studentInfo.id}
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
            Welcome back, {studentInfo.name.split(" ")[0]}!
          </h2>
          <p className="text-secondary-600">
            Ready to continue your learning journey?
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="twin-chat" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              AI Twin
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Progress
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              Achievements
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
                        Courses Active
                      </p>
                      <p className="text-2xl font-bold text-secondary-800">3</p>
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
                      <p className="text-sm text-secondary-600">Avg. Score</p>
                      <p className="text-2xl font-bold text-secondary-800">
                        87%
                      </p>
                    </div>
                    <div className="p-3 bg-accent-100 rounded-lg">
                      <Target className="w-6 h-6 text-accent-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-secondary-600">Study Streak</p>
                      <p className="text-2xl font-bold text-secondary-800">
                        5 days
                      </p>
                    </div>
                    <div className="p-3 bg-warning-100 rounded-lg">
                      <Zap className="w-6 h-6 text-warning-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-secondary-600">Time Today</p>
                      <p className="text-2xl font-bold text-secondary-800">
                        2.5h
                      </p>
                    </div>
                    <div className="p-3 bg-secondary-100 rounded-lg">
                      <Clock className="w-6 h-6 text-secondary-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* AI Recommendations */}
              <div className="lg:col-span-2">
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-primary-600" />
                      AI Recommendations
                    </CardTitle>
                    <CardDescription>
                      Personalized suggestions based on your learning patterns
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-primary-50 rounded-lg border border-primary-100">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary-500 rounded-lg">
                          <Star className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-secondary-800">
                            Review Quadratic Functions
                          </h4>
                          <p className="text-sm text-secondary-600 mt-1">
                            You've shown great progress in algebra. Let's
                            strengthen your foundation in quadratics before
                            moving to calculus.
                          </p>
                          <Button size="sm" className="mt-3">
                            Start Review
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-accent-50 rounded-lg border border-accent-100">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-accent-500 rounded-lg">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-secondary-800">
                            Join Study Group
                          </h4>
                          <p className="text-sm text-secondary-600 mt-1">
                            Connect with peers studying Biology. Collaborative
                            learning could boost your understanding by 25%.
                          </p>
                          <Button size="sm" variant="outline" className="mt-3">
                            Find Groups
                          </Button>
                        </div>
                      </div>
                    </div>
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
                        {activity.type === "lesson_completed" && (
                          <CheckCircle className="w-4 h-4 text-accent-600" />
                        )}
                        {activity.type === "quiz_taken" && (
                          <Target className="w-4 h-4 text-primary-600" />
                        )}
                        {activity.type === "ai_recommendation" && (
                          <Brain className="w-4 h-4 text-warning-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-secondary-800">
                          {activity.title}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-secondary-500">
                            {activity.time}
                          </p>
                          {activity.score && (
                            <Badge variant="secondary" className="text-xs">
                              {activity.score}%
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="twin-chat" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Chat Interface */}
              <div className="lg:col-span-2">
                <Card className="card-elevated h-[600px] flex flex-col">
                  <CardHeader className="border-b border-secondary-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-500 rounded-full">
                          <Brain className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            Your AI Twin
                          </CardTitle>
                          <CardDescription className="text-sm">
                            Your personal learning assistant
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                        <span className="text-xs text-secondary-600">
                          Online
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Chat Messages */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {/* AI Twin Welcome Message */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary-100 rounded-full">
                        <Brain className="w-4 h-4 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-primary-50 rounded-lg p-3 max-w-sm">
                          <p className="text-sm text-secondary-800">
                            Hi {studentInfo.name.split(" ")[0]}! I'm your AI
                            Twin, here to help you learn and grow. What would
                            you like to work on today?
                          </p>
                        </div>
                        <p className="text-xs text-secondary-500 mt-1">
                          Just now
                        </p>
                      </div>
                    </div>

                    {/* Sample conversation */}
                    <div className="flex items-start gap-3 justify-end">
                      <div className="flex-1 flex justify-end">
                        <div className="bg-accent-500 text-white rounded-lg p-3 max-w-sm">
                          <p className="text-sm">
                            I'm struggling with quadratic equations. Can you
                            help me understand them better?
                          </p>
                        </div>
                      </div>
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-accent-100 text-accent-700 text-xs">
                          {studentInfo.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary-100 rounded-full">
                        <Brain className="w-4 h-4 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-primary-50 rounded-lg p-3 max-w-sm">
                          <p className="text-sm text-secondary-800">
                            Absolutely! Quadratic equations are like puzzles.
                            Let me break it down: A quadratic equation has the
                            form ax² + bx + c = 0 Think of it as finding where a
                            parabola crosses the x-axis. Would you like me to
                            show you a visual example?
                          </p>
                        </div>
                        <p className="text-xs text-secondary-500 mt-1">
                          2 min ago
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 justify-end">
                      <div className="flex-1 flex justify-end">
                        <div className="bg-accent-500 text-white rounded-lg p-3 max-w-sm">
                          <p className="text-sm">
                            Yes, that would be great! Can you also give me some
                            practice problems?
                          </p>
                        </div>
                      </div>
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-accent-100 text-accent-700 text-xs">
                          {studentInfo.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary-100 rounded-full">
                        <Brain className="w-4 h-4 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-primary-50 rounded-lg p-3 max-w-lg">
                          <p className="text-sm text-secondary-800 mb-3">
                            Perfect! Here's a visual representation and some
                            practice:
                          </p>

                          {/* Math visualization placeholder */}
                          <div className="bg-white rounded border-2 border-dashed border-primary-200 p-4 mb-3 text-center">
                            <p className="text-xs text-secondary-500">
                              Interactive Math Visualization
                            </p>
                            <p className="text-lg font-mono mt-2">
                              y = x² - 4x + 3
                            </p>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm font-medium">
                              Practice Problems:
                            </p>
                            <div className="text-sm space-y-1">
                              <p>1. x² - 5x + 6 = 0</p>
                              <p>2. 2x² + 7x - 15 = 0</p>
                              <p>3. x² - 9 = 0</p>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-secondary-500 mt-1">
                          1 min ago
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Chat Input */}
                  <div className="border-t border-secondary-200 p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          placeholder="Ask your AI Twin anything..."
                          className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <Button size="sm" className="btn-primary">
                        Send
                      </Button>
                    </div>
                    <p className="text-xs text-secondary-500 mt-2">
                      Your AI Twin remembers your learning style and adapts to
                      help you better
                    </p>
                  </div>
                </Card>
              </div>

              {/* Twin Info Panel */}
              <div className="space-y-6">
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-warning-600" />
                      Twin Capabilities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-accent-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-secondary-800">
                          Instant Help
                        </p>
                        <p className="text-xs text-secondary-600">
                          Get immediate answers to your questions
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-accent-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-secondary-800">
                          Personalized Learning
                        </p>
                        <p className="text-xs text-secondary-600">
                          Adapts to your learning style and pace
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-accent-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-secondary-800">
                          24/7 Availability
                        </p>
                        <p className="text-xs text-secondary-600">
                          Always here when you need help
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-accent-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-secondary-800">
                          Visual Learning
                        </p>
                        <p className="text-xs text-secondary-600">
                          Interactive diagrams and examples
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-primary-600" />
                      Learning Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-secondary-800">
                        Today's Interaction
                      </p>
                      <div className="text-2xl font-bold text-primary-600">
                        12 questions
                      </div>
                      <p className="text-xs text-secondary-600">
                        +3 from yesterday
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-secondary-800">
                        Most Helped With
                      </p>
                      <div className="space-y-1">
                        <Badge variant="secondary" className="text-xs">
                          Mathematics
                        </Badge>
                        <Badge variant="secondary" className="text-xs ml-1">
                          Science
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-secondary-800">
                        Learning Streak
                      </p>
                      <div className="text-2xl font-bold text-accent-600">
                        7 days
                      </div>
                      <p className="text-xs text-secondary-600">
                        Keep chatting daily!
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-secondary-600" />
                      Twin Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full text-sm">
                      Adjust Learning Style
                    </Button>
                    <Button variant="outline" className="w-full text-sm">
                      Set Study Reminders
                    </Button>
                    <Button variant="outline" className="w-full text-sm">
                      View Chat History
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="grid gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="card-interactive">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-secondary-800">
                            {course.title}
                          </h3>
                          {course.aiRecommended && (
                            <Badge className="bg-primary-100 text-primary-700 hover:bg-primary-100">
                              <Brain className="w-3 h-3 mr-1" />
                              AI Recommended
                            </Badge>
                          )}
                        </div>
                        <p className="text-secondary-600 mb-1">
                          {course.subject}
                        </p>
                        <Badge variant="outline">{course.difficulty}</Badge>
                      </div>
                      <Button className="btn-primary">
                        <Play className="w-4 h-4 mr-2" />
                        Continue
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-secondary-600">Progress</span>
                        <span className="font-medium text-secondary-800">
                          {course.progress}%
                        </span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>

                    <div className="mt-4 p-3 bg-secondary-50 rounded-lg">
                      <p className="text-sm text-secondary-600">
                        Next: {course.nextLesson}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Weekly Progress</CardTitle>
                  <CardDescription>
                    Your learning activity this week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">
                        Lessons Completed
                      </span>
                      <span className="font-medium">12/15</span>
                    </div>
                    <Progress value={80} />

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">
                        Quizzes Taken
                      </span>
                      <span className="font-medium">8/10</span>
                    </div>
                    <Progress value={80} />

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">
                        Study Time
                      </span>
                      <span className="font-medium">18h/20h</span>
                    </div>
                    <Progress value={90} />
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>How you're doing overall</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600 mb-1">
                        87%
                      </div>
                      <p className="text-sm text-secondary-600">
                        Average Score
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-xl font-semibold text-accent-600">
                          95%
                        </div>
                        <p className="text-xs text-secondary-600">Best Score</p>
                      </div>
                      <div>
                        <div className="text-xl font-semibold text-warning-600">
                          +12%
                        </div>
                        <p className="text-xs text-secondary-600">
                          vs Last Month
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className={`card-elevated ${
                    achievement.earned
                      ? "ring-2 ring-accent-200 bg-accent-50"
                      : "opacity-60"
                  }`}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">{achievement.icon}</div>
                    <h3 className="font-semibold text-secondary-800 mb-2">
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-secondary-600 mb-4">
                      {achievement.description}
                    </p>
                    {achievement.earned ? (
                      <Badge className="bg-accent-500">
                        Earned {achievement.date}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Not Earned</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StudentDashboard;
