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
  UserPlus,
  RefreshCw,
  ClipboardList,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Milestone, Goal } from "@/types/curriculum";
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
import usePageTitle from "@/hooks/usePageTitle";
import axiosClient from "@/services/axiosClient";
import { toast } from "@/hooks/use-toast";

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
  schoolId: string;
  schoolName: string;
}

interface Lesson {
  lessonId: number;
  subjectId: number;
  title: string;
  content: string;
  difficultyLevel: number;
  approvalStatus: number;
  approvedAt?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Assignment {
  assignmentId: number;
  lessonId: number;
  title: string;
  questionType: number;
  content: string;
  rubric: string;
  deadline: string;
  approvalStatus: number;
  approvedAt?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Subject {
  subjectId: number;
  subjectName: string;
  description: string;
  isActive: boolean;
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
  status: "active" | "completed" | "draft";
  description: string;
  studentsEnrolled: number;
  averageGrade: number;
  lastUpdated: string;
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
  courses: string[];
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
  description: string;
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

interface AITwinInsight {
  id: string;
  studentId: string;
  studentName: string;
  twinLearningStage: "initializing" | "learning" | "adapting" | "optimized";
  personalityTraits: {
    learningStyle: string;
    motivation: string;
    strengths: string[];
    challenges: string[];
  };
  learningPreferences: {
    preferredPace: "slow" | "medium" | "fast";
    preferredFormat: string[];
    optimalStudyTime: string;
    difficultyPreference: number; // 1-10
  };
  emotionalState: {
    currentMood: string;
    stressLevel: number; // 1-10
    confidenceLevel: number; // 1-10
    engagementLevel: number; // 1-10
  };
  behaviorAnalysis: {
    riskScore: number;
    flaggedBehaviors: string[];
    positivePatterns: string[];
    lastSessionQuality: number; // 1-10
  };
  twinAdaptations: {
    contentAdjustments: string[];
    pacingChanges: string[];
    supportStrategies: string[];
    nextRecommendations: string[];
  };
  privacySettings: {
    allowPersonalityAnalysis: boolean;
    allowBehaviorTracking: boolean;
    allowInteractionRecording: boolean;
    parentNotificationEnabled: boolean;
  };
  lastTwinInteraction: string;
  twinEffectivenessScore: number; // 1-100
}

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  userId: string;
  userName: string;
}

interface TeacherDashboardData {
  teacherProfile: TeacherProfile;
  stats: TeacherStats;
  classes: ClassData[];
  students: StudentData[];
  aiAlerts: AIAlert[];
  aiTwinInsights: AITwinInsight[];
  recentActivity: RecentActivity[];
  lessonContent: LessonContent[];
  milestones: Milestone[];
  goals: Goal[];
  loading: boolean;
  error: string | null;
}

export default function TeacherDashboard() {
  usePageTitle("Teacher Dashboard - Anansi AI");
  const navigate = useNavigate();

  // State management
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardData, setDashboardData] =
    useState<TeacherDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [showCreateLesson, setShowCreateLesson] = useState(false);
  const [showEditLesson, setShowEditLesson] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);

  // Assignments state
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [showEditAssignment, setShowEditAssignment] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);

  // Subjects state
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [lastAction, setLastAction] = useState<{
    type: string;
    message: string;
  } | null>(null);

  // Form states
  const [classForm, setClassForm] = useState({
    name: "",
    subject: "",
    grade: "",
    description: "",
    schedule: "",
  });

  const [lessonForm, setLessonForm] = useState({
    title: "",
    content: "",
    subjectId: 0,
    difficultyLevel: 1,
    approvalStatus: 1,
    isActive: true,
  });

  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    content: "",
    rubric: "",
    lessonId: 0,
    questionType: 1,
    deadline: "",
    approvalStatus: 1,
    isActive: true,
  });

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    subject: "",
    bio: "",
    certifications: [] as string[],
  });

  // Notification system
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);

  // Get notification system
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
    dismissMessage,
    clearAll,
    getMessageById,
  } = useNotifications();

  // Subjects CRUD Functions
  const fetchSubjects = async () => {
    try {
      setSubjectsLoading(true);
      const response = await axiosClient.get("/api/subjects/all-subjects");
      setSubjects(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch subjects",
      });
    } finally {
      setSubjectsLoading(false);
    }
  };

  // Assignments CRUD Functions
  const fetchAssignments = async () => {
    try {
      setAssignmentsLoading(true);
      const response = await axiosClient.get(
        "/api/assignments/all-assignments",
      );
      setAssignments(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch assignments",
      });
    } finally {
      setAssignmentsLoading(false);
    }
  };

  const createAssignment = async () => {
    if (!assignmentForm.title.trim() || !assignmentForm.content.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in both title and content",
      });
      return;
    }

    if (!assignmentForm.deadline) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please set a deadline for the assignment",
      });
      return;
    }

    try {
      const response = await axiosClient.post(
        "/api/assignments/add-assignment",
        {
          ...assignmentForm,
          deadline: new Date(assignmentForm.deadline).toISOString(),
        },
      );
      if (response.data) {
        toast({
          title: "Success",
          description: "Assignment created successfully",
        });
        fetchAssignments(); // Refresh assignments
        setShowCreateAssignment(false);
        setAssignmentForm({
          title: "",
          content: "",
          rubric: "",
          lessonId: 0,
          questionType: 1,
          deadline: "",
          approvalStatus: 1,
          isActive: true,
        });
      }
    } catch (error) {
      console.error("Error creating assignment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create assignment",
      });
    }
  };

  const updateAssignment = async () => {
    if (
      !selectedAssignment ||
      !assignmentForm.title.trim() ||
      !assignmentForm.content.trim()
    ) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in both title and content",
      });
      return;
    }

    try {
      const response = await axiosClient.put(
        `/api/assignments/${selectedAssignment.assignmentId}`,
        {
          ...assignmentForm,
          deadline: new Date(assignmentForm.deadline).toISOString(),
        },
      );
      if (response.data) {
        toast({
          title: "Success",
          description: "Assignment updated successfully",
        });
        fetchAssignments(); // Refresh assignments
        setShowEditAssignment(false);
        setSelectedAssignment(null);
        setAssignmentForm({
          title: "",
          content: "",
          rubric: "",
          lessonId: 0,
          questionType: 1,
          deadline: "",
          approvalStatus: 1,
          isActive: true,
        });
      }
    } catch (error) {
      console.error("Error updating assignment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update assignment",
      });
    }
  };

  const deleteAssignment = async (assignmentId: number) => {
    try {
      const response = await axiosClient.delete(
        `/api/assignments/${assignmentId}`,
      );
      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Assignment deleted successfully",
        });
        fetchAssignments(); // Refresh assignments
      }
    } catch (error) {
      console.error("Error deleting assignment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete assignment",
      });
    }
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setAssignmentForm({
      title: assignment.title,
      content: assignment.content,
      rubric: assignment.rubric,
      lessonId: assignment.lessonId,
      questionType: assignment.questionType,
      deadline: assignment.deadline
        ? new Date(assignment.deadline).toISOString().slice(0, 16)
        : "",
      approvalStatus: assignment.approvalStatus,
      isActive: assignment.isActive,
    });
    setShowEditAssignment(true);
  };

  const getQuestionTypeLabel = (type: number) => {
    switch (type) {
      case 1:
        return "Multiple Choice";
      case 2:
        return "Short Answer";
      case 3:
        return "Essay";
      case 4:
        return "True/False";
      default:
        return "Unknown";
    }
  };

  const getSubjectName = (subjectId: number) => {
    const subject = subjects.find((s) => s.subjectId === subjectId);
    return subject ? subject.subjectName : `Subject ${subjectId}`;
  };

  const handleLogout = () => {
    // Clear all stored authentication data
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("authToken");

    // Redirect to login page
    navigate("/login");
  };

  // Authentication check
  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (!userRole || !["TEACHER", "ADMIN", "SUPER_ADMIN"].includes(userRole)) {
      // Auto-set teacher role for development
      localStorage.setItem("userRole", "TEACHER");
      localStorage.setItem("userId", "teacher_001");
      localStorage.setItem("userName", "Dr. Sarah Johnson");
      console.log("Setting teacher role for development");
    }
    // Immediate load for development
    loadDashboardData();
  }, []);

  // Auto-clear action feedback
  useEffect(() => {
    if (lastAction) {
      const timer = setTimeout(() => setLastAction(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastAction]);

  // Load lessons, assignments, and subjects when component mounts
  useEffect(() => {
    fetchLessons();
    fetchAssignments();
    fetchSubjects();
  }, []);

  // Load dashboard data
  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call with realistic mock data
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockData: TeacherDashboardData = {
        teacherProfile: {
          id: "teacher_001",
          name: "Dr. Sarah Johnson",
          email: "s.johnson@nairobiacademy.ac.ke",
          avatar: "",
          subject: "Mathematics",
          experience: "8 years",
          rating: 4.8,
          certifications: [
            "PhD Mathematics",
            "Certified AI Educator",
            "STEM Teaching Certificate",
          ],
          bio: "Passionate mathematics educator with expertise in AI-powered learning techniques.",
          schoolId: "school_001",
          schoolName: "Nairobi Academy",
        },
        stats: {
          totalStudents: 124,
          activeClasses: 5,
          pendingSubmissions: 18,
          averageProgress: 78,
          strugglingStudents: 8,
          excellingStudents: 32,
          weeklyEngagement: 89,
          completionRate: 82,
        },
        classes: [
          {
            id: "class_001",
            name: "Mathematics 10A",
            subject: "Mathematics",
            grade: "Grade 10",
            studentCount: 28,
            progress: 85,
            nextLesson: "Quadratic Equations",
            schedule: "Mon, Wed, Fri - 10:00 AM",
            status: "active",
            description:
              "Advanced mathematics course focusing on algebra and geometry",
            studentsEnrolled: 28,
            averageGrade: 84,
            lastUpdated: "2 hours ago",
          },
          {
            id: "class_002",
            name: "Calculus Advanced",
            subject: "Mathematics",
            grade: "Grade 12",
            studentCount: 22,
            progress: 72,
            nextLesson: "Integration Techniques",
            schedule: "Tue, Thu - 2:00 PM",
            status: "active",
            description:
              "Comprehensive calculus course for university preparation",
            studentsEnrolled: 22,
            averageGrade: 88,
            lastUpdated: "1 day ago",
          },
          {
            id: "class_003",
            name: "Statistics & Probability",
            subject: "Mathematics",
            grade: "Grade 11",
            studentCount: 26,
            progress: 91,
            nextLesson: "Normal Distribution",
            schedule: "Mon, Wed - 1:00 PM",
            status: "active",
            description: "Introduction to statistics and probability theory",
            studentsEnrolled: 26,
            averageGrade: 79,
            lastUpdated: "3 hours ago",
          },
        ],
        students: [
          {
            id: "student_001",
            name: "Emma Johnson",
            email: "emma.j@student.nairobiacademy.ac.ke",
            avatar: "",
            grade: "Grade 10",
            class: "Mathematics 10A",
            overallProgress: 92,
            lastActive: "2 hours ago",
            status: "excelling",
            currentMood: "Focused",
            riskScore: 2,
            aiRecommendations: [
              "Advanced problem sets",
              "Peer tutoring opportunities",
            ],
            recentSubmissions: 5,
            averageGrade: 94,
            courses: ["Mathematics 10A"],
          },
          {
            id: "student_002",
            name: "Marcus Williams",
            email: "marcus.w@student.nairobiacademy.ac.ke",
            avatar: "",
            grade: "Grade 12",
            class: "Calculus Advanced",
            overallProgress: 68,
            lastActive: "1 day ago",
            status: "struggling",
            currentMood: "Stressed",
            riskScore: 7,
            aiRecommendations: [
              "Extra practice sessions",
              "One-on-one tutoring",
            ],
            recentSubmissions: 2,
            averageGrade: 71,
            courses: ["Calculus Advanced"],
          },
          {
            id: "student_003",
            name: "Sophia Chen",
            email: "sophia.c@student.nairobiacademy.ac.ke",
            avatar: "",
            grade: "Grade 11",
            class: "Statistics & Probability",
            overallProgress: 87,
            lastActive: "30 minutes ago",
            status: "active",
            currentMood: "Engaged",
            riskScore: 3,
            aiRecommendations: [
              "Challenge problems",
              "Statistical software training",
            ],
            recentSubmissions: 4,
            averageGrade: 86,
            courses: ["Statistics & Probability"],
          },
        ],
        aiAlerts: [
          {
            id: "alert_001",
            studentId: "student_002",
            studentName: "Marcus Williams",
            type: "academic",
            severity: "high",
            title: "AI Twin Detected Learning Struggle",
            message:
              "Marcus's AI Twin has identified difficulty with calculus concepts and has automatically adjusted learning pace",
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            actionTaken: false,
            recommendations: [
              "Review AI Twin's suggested intervention strategies",
              "Schedule guided practice session",
              "Check AI Twin's emotional support recommendations",
            ],
          },
          {
            id: "alert_002",
            studentId: "student_004",
            studentName: "Alex Thompson",
            type: "behavioral",
            severity: "critical",
            title: "Unusual Behavioral Pattern Detected",
            message:
              "AI Twin flagged significant deviation from normal interaction patterns - possible academic integrity concern",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            actionTaken: false,
            recommendations: [
              "Review behavior log details",
              "Investigate AI Twin interaction history",
              "Consider privacy-compliant monitoring increase",
            ],
          },
          {
            id: "alert_003",
            studentId: "student_001",
            studentName: "Emma Johnson",
            type: "emotional",
            severity: "medium",
            title: "AI Twin Emotional State Alert",
            message:
              "Emma's AI Twin detected increased stress levels during recent math sessions",
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            actionTaken: false,
            recommendations: [
              "Review AI Twin's stress mitigation strategies",
              "Consider workload adjustment",
              "Enable enhanced emotional support mode",
            ],
          },
        ],
        aiTwinInsights: [
          {
            id: "twin_001",
            studentId: "student_001",
            studentName: "Emma Johnson",
            twinLearningStage: "optimized",
            personalityTraits: {
              learningStyle: "Visual-Kinesthetic",
              motivation: "Achievement-oriented",
              strengths: [
                "Pattern recognition",
                "Logical reasoning",
                "Persistence",
              ],
              challenges: ["Time pressure anxiety", "Perfectionism"],
            },
            learningPreferences: {
              preferredPace: "fast",
              preferredFormat: [
                "Interactive diagrams",
                "Step-by-step tutorials",
                "Practice problems",
              ],
              optimalStudyTime: "Morning (8-10 AM)",
              difficultyPreference: 8,
            },
            emotionalState: {
              currentMood: "Focused and confident",
              stressLevel: 3,
              confidenceLevel: 9,
              engagementLevel: 9,
            },
            behaviorAnalysis: {
              riskScore: 2,
              flaggedBehaviors: [],
              positivePatterns: [
                "Consistent study habits",
                "Help-seeking when needed",
                "Collaborative learning",
              ],
              lastSessionQuality: 9,
            },
            twinAdaptations: {
              contentAdjustments: [
                "Increased difficulty level",
                "Added advanced problems",
              ],
              pacingChanges: [
                "Accelerated through basics",
                "More time on complex concepts",
              ],
              supportStrategies: [
                "Confidence boosting",
                "Stress management techniques",
              ],
              nextRecommendations: [
                "Leadership opportunities",
                "Peer tutoring role",
                "Advanced placement preparation",
              ],
            },
            privacySettings: {
              allowPersonalityAnalysis: true,
              allowBehaviorTracking: true,
              allowInteractionRecording: true,
              parentNotificationEnabled: true,
            },
            lastTwinInteraction: "5 minutes ago",
            twinEffectivenessScore: 94,
          },
          {
            id: "twin_002",
            studentId: "student_002",
            studentName: "Marcus Williams",
            twinLearningStage: "adapting",
            personalityTraits: {
              learningStyle: "Auditory-Sequential",
              motivation: "Socially-motivated",
              strengths: [
                "Verbal communication",
                "Collaborative work",
                "Creative thinking",
              ],
              challenges: [
                "Mathematical anxiety",
                "Processing speed",
                "Self-confidence",
              ],
            },
            learningPreferences: {
              preferredPace: "slow",
              preferredFormat: [
                "Audio explanations",
                "Group discussions",
                "Real-world examples",
              ],
              optimalStudyTime: "Afternoon (2-4 PM)",
              difficultyPreference: 4,
            },
            emotionalState: {
              currentMood: "Anxious but determined",
              stressLevel: 7,
              confidenceLevel: 4,
              engagementLevel: 6,
            },
            behaviorAnalysis: {
              riskScore: 6,
              flaggedBehaviors: [
                "Avoidance patterns",
                "Help-seeking hesitation",
              ],
              positivePatterns: [
                "Improved consistency",
                "Better question asking",
              ],
              lastSessionQuality: 5,
            },
            twinAdaptations: {
              contentAdjustments: [
                "Simplified explanations",
                "More examples",
                "Reduced complexity",
              ],
              pacingChanges: [
                "Slower progression",
                "More review time",
                "Bite-sized lessons",
              ],
              supportStrategies: [
                "Encouragement messaging",
                "Progress celebration",
                "Anxiety reduction techniques",
              ],
              nextRecommendations: [
                "Confidence building exercises",
                "Peer study groups",
                "Alternative assessment methods",
              ],
            },
            privacySettings: {
              allowPersonalityAnalysis: true,
              allowBehaviorTracking: true,
              allowInteractionRecording: false,
              parentNotificationEnabled: true,
            },
            lastTwinInteraction: "2 hours ago",
            twinEffectivenessScore: 67,
          },
          {
            id: "twin_003",
            studentId: "student_003",
            studentName: "Sophia Chen",
            twinLearningStage: "learning",
            personalityTraits: {
              learningStyle: "Visual-Global",
              motivation: "Curiosity-driven",
              strengths: [
                "Pattern synthesis",
                "Big picture thinking",
                "Research skills",
              ],
              challenges: [
                "Detail focus",
                "Sequential tasks",
                "Time management",
              ],
            },
            learningPreferences: {
              preferredPace: "medium",
              preferredFormat: [
                "Mind maps",
                "Concept connections",
                "Project-based learning",
              ],
              optimalStudyTime: "Evening (6-8 PM)",
              difficultyPreference: 7,
            },
            emotionalState: {
              currentMood: "Curious and engaged",
              stressLevel: 4,
              confidenceLevel: 7,
              engagementLevel: 8,
            },
            behaviorAnalysis: {
              riskScore: 3,
              flaggedBehaviors: ["Occasional procrastination"],
              positivePatterns: [
                "Deep thinking",
                "Creative solutions",
                "Active participation",
              ],
              lastSessionQuality: 8,
            },
            twinAdaptations: {
              contentAdjustments: [
                "Connected concepts",
                "Real-world applications",
                "Visual representations",
              ],
              pacingChanges: [
                "Flexible deadlines",
                "Self-paced modules",
                "Interest-driven sequences",
              ],
              supportStrategies: [
                "Exploration encouragement",
                "Time management tools",
                "Goal setting",
              ],
              nextRecommendations: [
                "Independent research projects",
                "Cross-subject connections",
                "Statistical software introduction",
              ],
            },
            privacySettings: {
              allowPersonalityAnalysis: true,
              allowBehaviorTracking: true,
              allowInteractionRecording: true,
              parentNotificationEnabled: false,
            },
            lastTwinInteraction: "15 minutes ago",
            twinEffectivenessScore: 81,
          },
        ],
        recentActivity: [
          {
            id: "activity_001",
            type: "submission",
            title: "Assignment Submitted",
            description:
              "Emma Johnson submitted 'Quadratic Functions Assignment'",
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            userId: "student_001",
            userName: "Emma Johnson",
          },
          {
            id: "activity_002",
            type: "content_created",
            title: "New Lesson Created",
            description:
              "Created lesson 'Integration by Parts' for Calculus Advanced",
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            userId: "teacher_001",
            userName: "Dr. Sarah Johnson",
          },
          {
            id: "activity_003",
            type: "grade_posted",
            title: "Grades Posted",
            description: "Posted grades for Statistics Quiz #3",
            timestamp: new Date(Date.now() - 14400000).toISOString(),
            userId: "teacher_001",
            userName: "Dr. Sarah Johnson",
          },
        ],
        lessonContent: [
          {
            id: "content_001",
            title: "Quadratic Functions",
            subject: "Mathematics",
            type: "lesson" as const,
            difficulty: "medium" as const,
            status: "published" as const,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            studentsCompleted: 24,
            averageScore: 87,
            estimatedDuration: 45,
            description:
              "Introduction to quadratic functions and their properties",
          },
          {
            id: "content_002",
            title: "Calculus Integration Assignment",
            subject: "Mathematics",
            type: "assignment" as const,
            difficulty: "hard" as const,
            status: "published" as const,
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            studentsCompleted: 18,
            averageScore: 79,
            estimatedDuration: 90,
            description: "Complex integration problems for advanced students",
          },
          {
            id: "content_003",
            title: "Probability Distributions Quiz",
            subject: "Mathematics",
            type: "quiz",
            difficulty: "medium",
            status: "draft",
            createdAt: new Date(Date.now() - 259200000).toISOString(),
            studentsCompleted: 0,
            averageScore: 0,
            estimatedDuration: 30,
            description: "Assessment on normal and binomial distributions",
          },
        ],
        milestones: [
          {
            id: "1",
            curriculumId: "1",
            subjectId: "1",
            term: "Term 1",
            milestone:
              "Introduction to algebra concepts, linear equations, and basic geometry shapes",
            isActive: true,
            createdAt: "2024-01-15T10:00:00Z",
            updatedAt: "2024-01-15T10:00:00Z",
          },
          {
            id: "2",
            curriculumId: "1",
            subjectId: "1",
            term: "Term 2",
            milestone:
              "Advanced algebra, quadratic equations, and geometric calculations",
            isActive: true,
            createdAt: "2024-01-16T10:00:00Z",
            updatedAt: "2024-01-16T10:00:00Z",
          },
          {
            id: "3",
            curriculumId: "1",
            subjectId: "1",
            term: "Term 3",
            milestone:
              "Advanced calculus concepts, derivatives and integrals for university preparation",
            isActive: true,
            createdAt: "2024-01-17T10:00:00Z",
            updatedAt: "2024-01-17T10:00:00Z",
          },
        ],
        goals: [
          {
            id: "1",
            curriculumId: "1",
            subjectId: "1",
            term: "Term 1",
            goal: "Students should be able to solve linear equations and understand basic geometric principles with 80% accuracy",
            isActive: true,
            createdAt: "2024-01-15T10:00:00Z",
            updatedAt: "2024-01-15T10:00:00Z",
          },
          {
            id: "2",
            curriculumId: "1",
            subjectId: "1",
            term: "Term 2",
            goal: "Students should master quadratic equations and apply geometric calculations in real-world scenarios with 85% accuracy",
            isActive: true,
            createdAt: "2024-01-16T10:00:00Z",
            updatedAt: "2024-01-16T10:00:00Z",
          },
          {
            id: "3",
            curriculumId: "1",
            subjectId: "1",
            term: "Term 3",
            goal: "Students should demonstrate mastery of calculus concepts and be ready for advanced university mathematics with 90% accuracy",
            isActive: true,
            createdAt: "2024-01-17T10:00:00Z",
            updatedAt: "2024-01-17T10:00:00Z",
          },
        ],
        loading: false,
        error: null,
      };

      setDashboardData(mockData);

      // Convert AI alerts to notifications
      mockData.aiAlerts.forEach((alert) => {
        if (!alert.actionTaken) {
          addNotification({
            type: "ai",
            priority: alert.severity as "low" | "medium" | "high" | "critical",
            title: alert.title,
            message: alert.message,
            isRead: false,
            actionRequired: true,
            metadata: {
              studentId: alert.studentId,
              studentName: alert.studentName,
            },
            actions: [
              {
                id: "view_student",
                label: "View Student",
                variant: "default",
                action: () => handleViewStudent(alert.studentId),
              },
              {
                id: "resolve_alert",
                label: "Mark Resolved",
                variant: "secondary",
                action: () => handleResolveAlert(alert.id),
              },
            ],
          });
        }
      });
      setDashboardData(mockData);
      console.log("✅ Dashboard data loaded successfully", mockData);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error("Dashboard data loading error:", err);
    }

    setLoading(false);
  };

  // Handlers for various actions
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Add to dashboard data
      const newClass: ClassData = {
        id: `class_${Date.now()}`,
        name: classForm.name,
        subject: classForm.subject,
        grade: classForm.grade,
        studentCount: 0,
        progress: 0,
        nextLesson: "Introduction",
        schedule: classForm.schedule,
        status: "active",
        description: classForm.description,
        studentsEnrolled: 0,
        averageGrade: 0,
        lastUpdated: "Just now",
      };

      if (dashboardData) {
        setDashboardData({
          ...dashboardData,
          classes: [...dashboardData.classes, newClass],
          stats: {
            ...dashboardData.stats,
            activeClasses: dashboardData.stats.activeClasses + 1,
          },
        });
      }

      // Reset form and close dialog
      setClassForm({
        name: "",
        subject: "",
        grade: "",
        description: "",
        schedule: "",
      });
      setShowCreateClass(false);
      setLastAction({
        type: "success",
        message: `Class "${classForm.name}" created successfully!`,
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update dashboard data
      if (dashboardData) {
        setDashboardData({
          ...dashboardData,
          teacherProfile: {
            ...dashboardData.teacherProfile,
            name: profileForm.name,
            email: profileForm.email,
            subject: profileForm.subject,
            bio: profileForm.bio,
            certifications: profileForm.certifications,
          },
        });
      }

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
    } catch (error) {
      setLastAction({
        type: "error",
        message: "Failed to update profile. Please try again.",
      });
    }
  };

  // Additional button handlers
  const handleViewClass = (classId: string) => {
    const classData = dashboardData?.classes.find((c) => c.id === classId);
    if (classData) {
      // Show detailed class information
      addMessage({
        type: "info",
        priority: "medium",
        title: `${classData.name} - Class Details`,
        message: `Complete overview of ${classData.name}`,
        details: `📚 Class: ${classData.name}
📖 Subject: ${classData.subject}
🎓 Grade: ${classData.grade}
👥 Students: ${classData.studentCount}
��� Progress: ${classData.progress}%
📅 Schedule: ${classData.schedule}
📝 Next Lesson: ${classData.nextLesson}
📋 Status: ${classData.status.charAt(0).toUpperCase() + classData.status.slice(1)}

Description:
${classData.description}

Recent Activities:
• Last updated: ${classData.lastUpdated || "Recently"}
• Average grade: ${classData.averageGrade || "Not yet available"}%
• Students enrolled: ${classData.studentsEnrolled || classData.studentCount}

Quick Actions Available:
• Edit class details
• Manage students
• View analytics
• Export class data`,
        from: {
          type: "system",
          name: "Class Management System",
        },
        category: "Class Details",
        metadata: {
          classId: classId,
          className: classData.name,
        },
      });

      setSelectedMessage(null);
      setShowMessageModal(true);

      setLastAction({
        type: "info",
        message: `Viewing detailed information for ${classData.name}`,
      });
    }
  };

  const handleEditClass = (classId: string) => {
    const classData = dashboardData?.classes.find((c) => c.id === classId);
    if (classData) {
      setClassForm({
        name: classData.name,
        subject: classData.subject,
        grade: classData.grade,
        description: classData.description,
        schedule: classData.schedule,
      });
      setShowCreateClass(true);
      setLastAction({
        type: "info",
        message: `Editing ${classData.name} - Update details and save changes`,
      });
    }
  };

  const handleViewStudent = (studentId: string) => {
    const student = dashboardData?.students.find((s) => s.id === studentId);
    if (student) {
      setActiveTab("students");
      setLastAction({
        type: "info",
        message: `Viewing ${student.name}'s profile`,
      });
      // In a real app, this would open student details modal or page
    }
  };

  const handleSendMessageToStudent = (studentId: string) => {
    const student = dashboardData?.students.find((s) => s.id === studentId);
    if (student) {
      setLastAction({
        type: "info",
        message: `Opening message dialog for ${student.name}`,
      });
      // In a real app, this would open messaging interface
      addNotification({
        type: "student",
        priority: "low",
        title: "Message Sent",
        message: `Message sent to ${student.name}`,
        isRead: false,
      });
    }
  };

  const handleViewAITwinDetails = (studentId: string) => {
    const twinInsight = dashboardData?.aiTwinInsights?.find(
      (insight) => insight.studentId === studentId,
    );
    const student = dashboardData?.students.find((s) => s.id === studentId);

    if (twinInsight && student) {
      setLastAction({
        type: "info",
        message: `Viewing ${student.name}'s AI Twin analytics`,
      });

      // Create detailed message about AI Twin
      addMessage({
        type: "ai_insight",
        priority: "medium",
        title: `${student.name}'s AI Twin Analysis`,
        message: `Comprehensive AI Twin learning analysis for ${student.name}`,
        details: `AI Twin Stage: ${twinInsight.twinLearningStage}

Learning Style: ${twinInsight.personalityTraits.learningStyle}
Effectiveness Score: ${twinInsight.twinEffectivenessScore}%
Current Mood: ${twinInsight.emotionalState.currentMood}
Stress Level: ${twinInsight.emotionalState.stressLevel}/10

Recent Recommendations:
${twinInsight.twinAdaptations.nextRecommendations.join("\n")}`,
        from: {
          type: "ai",
          name: "AI Twin Analytics",
        },
        category: "AI Twin Insights",
        metadata: {
          studentId: studentId,
          studentName: student.name,
        },
      });

      setShowMessageModal(true);
    }
  };

  const handleViewContent = (contentId: string) => {
    const content = dashboardData?.lessonContent.find(
      (c) => c.id === contentId,
    );
    if (content) {
      setLastAction({
        type: "info",
        message: `Viewing ${content.title}`,
      });
      // In a real app, this would navigate to content editor/viewer
    }
  };

  const handleEditContent = (contentId: string) => {
    const content = dashboardData?.lessonContent.find(
      (c) => c.id === contentId,
    );
    if (content) {
      setContentForm({
        title: content.title,
        type: content.type,
        subject: content.subject,
        description: content.title, // Using title as description fallback
        difficulty: content.difficulty,
        estimatedDuration: content.estimatedDuration || 45,
        content: "", // Content body would come from API
      });
      setShowCreateContent(true);
      setLastAction({
        type: "info",
        message: `Editing ${content.title} - Make changes and save`,
      });
    }
  };

  const handlePublishContent = (contentId: string) => {
    const content = dashboardData?.lessonContent.find(
      (c) => c.id === contentId,
    );
    if (content && dashboardData) {
      const updatedContent = dashboardData.lessonContent.map((c) =>
        c.id === contentId ? { ...c, status: "published" as const } : c,
      );

      setDashboardData({
        ...dashboardData,
        lessonContent: updatedContent,
      });

      setLastAction({
        type: "success",
        message: `${content.title} published successfully!`,
      });

      addNotification({
        type: "content",
        priority: "medium",
        title: "Content Published",
        message: `${content.title} is now available to students`,
        isRead: false,
      });
    }
  };

  const handleDownloadAnalytics = () => {
    setLastAction({
      type: "info",
      message: "Generating comprehensive analytics report...",
    });

    setTimeout(() => {
      setLastAction({
        type: "info",
        message: "Analyzing student performance data...",
      });
    }, 500);

    setTimeout(() => {
      setLastAction({
        type: "info",
        message: "Compiling teaching effectiveness metrics...",
      });
    }, 1000);

    setTimeout(() => {
      // Create comprehensive analytics report
      const analyticsReport = {
        reportTitle: "Teacher Analytics Report",
        teacherName: dashboardData?.teacherProfile?.name || "Teacher",
        reportDate: new Date().toISOString(),
        reportPeriod: "Current Academic Term",

        summary: {
          totalStudents: dashboardData?.stats?.totalStudents || 0,
          activeClasses: dashboardData?.stats?.activeClasses || 0,
          averageProgress: dashboardData?.stats?.averageProgress || 0,
          completionRate: dashboardData?.stats?.completionRate || 0,
          excellingStudents: dashboardData?.stats?.excellingStudents || 0,
          strugglingStudents: dashboardData?.stats?.strugglingStudents || 0,
        },

        classPerformance:
          dashboardData?.classes?.map((cls) => ({
            className: cls.name,
            subject: cls.subject,
            studentCount: cls.studentCount,
            progress: cls.progress,
            nextLesson: cls.nextLesson,
            status: cls.status,
          })) || [],

        studentAnalytics:
          dashboardData?.students?.map((student) => ({
            name: student.name,
            class: student.class,
            progress: student.overallProgress,
            averageGrade: student.averageGrade,
            status: student.status,
            riskScore: student.riskScore,
            aiRecommendations: student.aiRecommendations,
          })) || [],

        aiInsights: [
          "Visual learning methods show 23% higher engagement",
          "Morning sessions demonstrate better focus and retention",
          "Interactive content increases completion rates by 31%",
          "Students respond well to immediate feedback",
          "Collaborative projects boost motivation significantly",
        ],

        recommendations: [
          "Increase interactive content for struggling students",
          "Schedule challenging topics during peak engagement hours",
          "Implement more visual aids in mathematics lessons",
          "Consider peer tutoring for excelling students",
          "Use AI recommendations for personalized learning paths",
        ],
      };

      // Create and download the report
      const reportContent = `# Teacher Analytics Report

## Report Summary
- **Teacher:** ${analyticsReport.teacherName}
- **Date:** ${new Date(analyticsReport.reportDate).toLocaleDateString()}
- **Period:** ${analyticsReport.reportPeriod}

## Key Metrics
- **Total Students:** ${analyticsReport.summary.totalStudents}
- **Active Classes:** ${analyticsReport.summary.activeClasses}
- **Average Progress:** ${analyticsReport.summary.averageProgress}%
- **Completion Rate:** ${analyticsReport.summary.completionRate}%
- **Excelling Students:** ${analyticsReport.summary.excellingStudents}
- **Students Needing Support:** ${analyticsReport.summary.strugglingStudents}

## Class Performance
${analyticsReport.classPerformance
  .map(
    (cls) =>
      `### ${cls.className}
- Subject: ${cls.subject}
- Students: ${cls.studentCount}
- Progress: ${cls.progress}%
- Status: ${cls.status}
- Next Lesson: ${cls.nextLesson}
`,
  )
  .join("\n")}

## AI Insights
${analyticsReport.aiInsights.map((insight) => `- ${insight}`).join("\n")}

## Recommendations
${analyticsReport.recommendations.map((rec) => `- ${rec}`).join("\n")}

---
*Report generated by Anansi AI Teaching Analytics*`;

      const blob = new Blob([reportContent], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Teacher_Analytics_Report_${new Date().toISOString().split("T")[0]}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setLastAction({
        type: "success",
        message: "Analytics report downloaded! Check your downloads folder.",
      });

      addNotification({
        type: "system",
        priority: "medium",
        title: "Analytics Report Downloaded",
        message: "Your comprehensive teaching analytics report is ready",
        isRead: false,
      });
    }, 1500);
  };

  const handleExportClassData = (classId: string) => {
    const classData = dashboardData?.classes.find((c) => c.id === classId);
    if (classData) {
      setLastAction({
        type: "info",
        message: `Preparing export for ${classData.name}...`,
      });

      // Simulate export process with realistic steps
      setTimeout(() => {
        setLastAction({
          type: "info",
          message: `Gathering student data and grades...`,
        });
      }, 500);

      setTimeout(() => {
        setLastAction({
          type: "info",
          message: `Compiling attendance records...`,
        });
      }, 1000);

      setTimeout(() => {
        setLastAction({
          type: "info",
          message: `Generating PDF report...`,
        });
      }, 1500);

      setTimeout(() => {
        // Create downloadable content simulation
        const exportData = {
          className: classData.name,
          subject: classData.subject,
          grade: classData.grade,

          progress: classData.progress,
          schedule: classData.schedule,
          description: classData.description,
          exportDate: new Date().toISOString(),
          students: dashboardData?.students
            .filter((s) => s.class === classData.name)
            .map((s) => ({
              name: s.name,
              email: s.email,
              progress: s.overallProgress,
              averageGrade: s.averageGrade,
              status: s.status,
              lastActive: s.lastActive,
            })),
        };

        // Create blob and download
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${classData.name.replace(/\s+/g, "_")}_class_data_${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setLastAction({
          type: "success",
          message: `${classData.name} data exported successfully! Check downloads.`,
        });

        addNotification({
          type: "class",
          priority: "medium",
          title: "Class Data Exported",
          message: `${classData.name} data has been exported to your downloads folder`,
          isRead: false,
        });
      }, 2000);
    }
  };

  const handleBulkAction = (action: string, selectedItems: string[]) => {
    setLastAction({
      type: "info",
      message: `Performing ${action} on ${selectedItems.length} items...`,
    });

    setTimeout(() => {
      setLastAction({
        type: "success",
        message: `${action} completed for ${selectedItems.length} items!`,
      });
    }, 1000);
  };

  const handleQuickAssignment = () => {
    setShowCreateContent(true);
    setContentForm({
      ...contentForm,
      type: "assignment",
      title: "Quick Assignment",
    });
    setLastAction({
      type: "info",
      message: "Creating quick assignment...",
    });
  };

  const handleScheduleMeeting = (studentId: string) => {
    const student = dashboardData?.students.find((s) => s.id === studentId);
    if (student) {
      setLastAction({
        type: "success",
        message: `Meeting scheduled with ${student.name}`,
      });

      addNotification({
        type: "student",
        priority: "medium",
        title: "Meeting Scheduled",
        message: `One-on-one meeting scheduled with ${student.name} for tomorrow at 2:00 PM`,
        isRead: false,
      });
    }
  };

  const handleSendToParent = (studentId: string) => {
    const student = dashboardData?.students.find((s) => s.id === studentId);
    if (student) {
      setLastAction({
        type: "success",
        message: `Progress report sent to ${student.name}'s parents`,
      });

      addNotification({
        type: "student",
        priority: "low",
        title: "Parent Communication",
        message: `Progress report sent to ${student.name}'s parents`,
        isRead: false,
      });
    }
  };

  // Additional missing handlers
  const handleCreateQuiz = () => {
    setContentForm({
      ...contentForm,
      type: "quiz",
      title: "New Quiz",
      estimatedDuration: 30,
    });
    setShowCreateContent(true);
    setLastAction({
      type: "info",
      message: "Creating new quiz...",
    });
  };

  const handleCreateProject = () => {
    setContentForm({
      ...contentForm,
      type: "project",
      title: "New Project",
      estimatedDuration: 120,
    });
    setShowCreateContent(true);
    setLastAction({
      type: "info",
      message: "Creating new project...",
    });
  };

  const handleBulkGrade = () => {
    setLastAction({
      type: "info",
      message: "Opening bulk grading interface...",
    });

    setTimeout(() => {
      setLastAction({
        type: "success",
        message: "Bulk grading interface ready",
      });
    }, 1000);
  };

  const handleClassSchedule = (classId: string) => {
    const classData = dashboardData?.classes.find((c) => c.id === classId);
    if (classData) {
      setLastAction({
        type: "info",
        message: `Opening schedule for ${classData.name}`,
      });
    }
  };

  const handleStudentProgress = (studentId: string) => {
    const student = dashboardData?.students.find((s) => s.id === studentId);
    if (student) {
      setActiveTab("analytics");
      setLastAction({
        type: "info",
        message: `Viewing detailed progress for ${student.name}`,
      });
    }
  };

  // Advanced action handlers
  const handleBulkMessage = () => {
    setLastAction({
      type: "info",
      message: "Opening bulk messaging interface...",
    });

    setTimeout(() => {
      addNotification({
        type: "system",
        priority: "medium",
        title: "Bulk Message Sent",
        message: "Message sent to all students in selected classes",
        isRead: false,
      });

      setLastAction({
        type: "success",
        message: "Bulk message sent to all students successfully!",
      });
    }, 1500);
  };

  const handleImportStudents = () => {
    setLastAction({
      type: "info",
      message: "Opening student import wizard...",
    });

    // Simulate file import process
    setTimeout(() => {
      setLastAction({
        type: "success",
        message: "Student import completed! 15 new students added.",
      });

      addNotification({
        type: "class",
        priority: "medium",
        title: "Students Imported",
        message: "15 new students have been successfully imported",
        isRead: false,
      });
    }, 2000);
  };

  const handleBackupData = () => {
    setLastAction({
      type: "info",
      message: "Creating comprehensive data backup...",
    });

    setTimeout(() => {
      const backupData = {
        timestamp: new Date().toISOString(),
        teacherProfile: dashboardData?.teacherProfile,
        classes: dashboardData?.classes,
        students: dashboardData?.students,
        stats: dashboardData?.stats,
        version: "1.0.0",
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Teacher_Data_Backup_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setLastAction({
        type: "success",
        message: "Data backup created and downloaded successfully!",
      });
    }, 1500);
  };

  // Advanced Class Management Functions
  const handleDeleteClass = async (classId: string) => {
    const classData = dashboardData?.classes.find((c) => c.id === classId);
    if (!classData || !dashboardData) return;

    // Confirmation dialog simulation
    const confirmed = window.confirm(
      `Are you sure you want to delete "${classData.name}"?\n\nThis action cannot be undone and will:\n- Remove all class data\n- Unenroll all students\n- Archive associated content\n\nType "DELETE" to confirm this action.`,
    );

    if (!confirmed) return;

    try {
      // Simulate API call with loading state
      setLastAction({
        type: "info",
        message: `Deleting ${classData.name}...`,
      });

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Remove class from dashboard data
      const updatedClasses = dashboardData.classes.filter(
        (c) => c.id !== classId,
      );
      const updatedStats = {
        ...dashboardData.stats,
        activeClasses: dashboardData.stats.activeClasses - 1,
        totalStudents:
          dashboardData.stats.totalStudents - classData.studentCount,
      };

      setDashboardData({
        ...dashboardData,
        classes: updatedClasses,
        stats: updatedStats,
      });

      setLastAction({
        type: "success",
        message: `${classData.name} has been permanently deleted`,
      });

      addNotification({
        type: "class",
        priority: "high",
        title: "Class Deleted",
        message: `${classData.name} and all associated data have been permanently removed`,
        isRead: false,
      });
    } catch (error) {
      setLastAction({
        type: "error",
        message: `Failed to delete ${classData.name}. Please try again.`,
      });
    }
  };

  const handleDuplicateClass = (classId: string) => {
    const classData = dashboardData?.classes.find((c) => c.id === classId);
    if (!classData || !dashboardData) return;

    const duplicatedClass: ClassData = {
      ...classData,
      id: `class_${Date.now()}`,
      name: `${classData.name} (Copy)`,
      studentCount: 0,
      progress: 0,
      status: "draft" as const,
      lastUpdated: "Just now",
    };

    setDashboardData({
      ...dashboardData,
      classes: [...dashboardData.classes, duplicatedClass],
      stats: {
        ...dashboardData.stats,
        activeClasses: dashboardData.stats.activeClasses + 1,
      },
    });

    setLastAction({
      type: "success",
      message: `${classData.name} duplicated successfully`,
    });

    addNotification({
      type: "class",
      priority: "medium",
      title: "Class Duplicated",
      message: `${duplicatedClass.name} has been created as a copy`,
      isRead: false,
    });
  };

  const handleArchiveClass = (classId: string) => {
    const classData = dashboardData?.classes.find((c) => c.id === classId);
    if (!classData || !dashboardData) return;

    const updatedClasses = dashboardData.classes.map((c) =>
      c.id === classId ? { ...c, status: "completed" as const } : c,
    );

    setDashboardData({
      ...dashboardData,
      classes: updatedClasses,
    });

    setLastAction({
      type: "success",
      message: `${classData.name} has been archived`,
    });

    addNotification({
      type: "class",
      priority: "medium",
      title: "Class Archived",
      message: `${classData.name} is now archived and hidden from students`,
      isRead: false,
    });
  };

  const handleManageStudents = (classId: string) => {
    const classData = dashboardData?.classes.find((c) => c.id === classId);
    if (classData) {
      // Filter students for this specific class
      const classStudents =
        dashboardData?.students?.filter((s) => s.class === classData.name) ||
        [];

      addMessage({
        type: "info",
        priority: "medium",
        title: `Student Management - ${classData.name}`,
        message: `Managing ${classStudents.length} students in ${classData.name}`,
        details: `👥 **Students in ${classData.name}:**

${
  classStudents.length === 0
    ? "No students enrolled yet."
    : classStudents
        .map(
          (student, index) =>
            `${index + 1}. **${student.name}**
   📧 ${student.email}
   📊 Progress: ${student.overallProgress}%
   ⭐ Average Grade: ${student.averageGrade}%
   📈 Status: ${student.status.charAt(0).toUpperCase() + student.status.slice(1)}
   ⏰ Last Active: ${student.lastActive}
   ${student.status === "struggling" ? "���️ Needs attention" : ""}
   ${student.status === "excelling" ? "🌟 Top performer" : ""}

   **AI Recommendations:**
   ${student.aiRecommendations.map((rec) => `   • ${rec}`).join("\n")}
`,
        )
        .join("\n---\n")
}

**Management Actions Available:**
• Add new students to class
• Remove students from class
• Send messages to students
• Schedule individual meetings
• View detailed progress reports
• Export student data
• Generate parent reports

**Class Statistics:**
• Total Enrolled: ${classStudents.length}
• Average Progress: ${classStudents.reduce((sum, s) => sum + s.overallProgress, 0) / (classStudents.length || 1)}%
• Students Excelling: ${classStudents.filter((s) => s.status === "excelling").length}
• Students Struggling: ${classStudents.filter((s) => s.status === "struggling").length}`,
        from: {
          type: "system",
          name: "Student Management System",
        },
        category: "Student Management",
        metadata: {
          classId: classId,
          className: classData.name,
        },
      });

      setSelectedMessage(null);
      setShowMessageModal(true);
      setActiveTab("students");

      setLastAction({
        type: "info",
        message: `Managing ${classStudents.length} students in ${classData.name}`,
      });
    }
  };

  const handleClassAnalytics = (classId: string) => {
    const classData = dashboardData?.classes.find((c) => c.id === classId);
    if (classData) {
      setActiveTab("analytics");
      setLastAction({
        type: "info",
        message: `Viewing analytics for ${classData.name}`,
      });

      addMessage({
        type: "ai_insight",
        priority: "medium",
        title: `${classData.name} - Class Analytics Report`,
        message: `Comprehensive performance analysis for ${classData.name}`,
        details: `Class Performance Summary:

📊 Overall Progress: ${classData.progress}%
👥 Total Students: ${classData.studentCount}
📈 Engagement Rate: 87%
⭐ Average Grade: ${classData.averageGrade}%

Recent Trends:
• Student participation increased by 15%
• Assignment completion rate: 92%
• Most challenging topic: ${classData.nextLesson}
• Recommended focus areas identified

AI Insights:
• Visual learners perform 23% better
• Morning sessions show higher engagement
• Interactive content increases retention by 31%`,
        from: {
          type: "ai",
          name: "Class Analytics AI",
        },
        category: "Class Performance",
        metadata: {
          classId: classId,
          className: classData.name,
        },
      });

      setShowMessageModal(true);
    }
  };

  // Advanced Content Management Functions
  const handleDeleteContent = async (contentId: string) => {
    const content = dashboardData?.lessonContent.find(
      (c) => c.id === contentId,
    );
    if (!content || !dashboardData) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${content.title}"?\n\nThis will permanently remove:\n- The content and all materials\n- Student progress data\n- Associated assignments\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setLastAction({
        type: "info",
        message: `Deleting ${content.title}...`,
      });

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const updatedContent = dashboardData.lessonContent.filter(
        (c) => c.id !== contentId,
      );

      setDashboardData({
        ...dashboardData,
        lessonContent: updatedContent,
      });

      setLastAction({
        type: "success",
        message: `${content.title} has been permanently deleted`,
      });

      addNotification({
        type: "content",
        priority: "high",
        title: "Content Deleted",
        message: `${content.title} and all associated data have been removed`,
        isRead: false,
      });
    } catch (error) {
      setLastAction({
        type: "error",
        message: `Failed to delete ${content.title}. Please try again.`,
      });
    }
  };

  const handleDuplicateContent = (contentId: string) => {
    const content = dashboardData?.lessonContent.find(
      (c) => c.id === contentId,
    );
    if (!content || !dashboardData) return;

    const duplicatedContent: LessonContent = {
      ...content,
      id: `content_${Date.now()}`,
      title: `${content.title} (Copy)`,
      status: "draft",
      studentsCompleted: 0,
      averageScore: 0,
      createdAt: new Date().toISOString(),
    };

    setDashboardData({
      ...dashboardData,
      lessonContent: [...dashboardData.lessonContent, duplicatedContent],
    });

    setLastAction({
      type: "success",
      message: `${content.title} duplicated successfully`,
    });

    addNotification({
      type: "content",
      priority: "medium",
      title: "Content Duplicated",
      message: `${duplicatedContent.title} has been created as a copy`,
      isRead: false,
    });
  };

  const handleArchiveContent = (contentId: string) => {
    const content = dashboardData?.lessonContent.find(
      (c) => c.id === contentId,
    );
    if (!content || !dashboardData) return;

    const updatedContent = dashboardData.lessonContent.map((c) =>
      c.id === contentId ? { ...c, status: "archived" as const } : c,
    );

    setDashboardData({
      ...dashboardData,
      lessonContent: updatedContent,
    });

    setLastAction({
      type: "success",
      message: `${content.title} has been archived`,
    });

    addNotification({
      type: "content",
      priority: "medium",
      title: "Content Archived",
      message: `${content.title} is now archived`,
      isRead: false,
    });
  };

  const handleContentAnalytics = (contentId: string) => {
    const content = dashboardData?.lessonContent.find(
      (c) => c.id === contentId,
    );
    if (content) {
      addMessage({
        type: "ai_insight",
        priority: "medium",
        title: `${content.title} - Content Performance Report`,
        message: `Detailed analytics for ${content.title}`,
        details: `Content Performance Summary:

📊 Completion Rate: ${Math.round((content.studentsCompleted / (dashboardData?.stats.totalStudents || 1)) * 100)}%
👥 Students Completed: ${content.studentsCompleted}
⭐ Average Score: ${content.averageScore}%
⏱️ Estimated Duration: ${content.estimatedDuration} minutes

Learning Effectiveness:
• Content Difficulty: ${content.difficulty}
• Student Engagement: High
• Time to Complete: ${content.estimatedDuration} min avg
�� Improvement Areas: None identified

AI Recommendations:
• Content is well-suited for current difficulty level
• Consider adding interactive elements
• Students respond well to visual components
• Optimal for ${content.difficulty === "easy" ? "beginner" : content.difficulty === "medium" ? "intermediate" : "advanced"} learners`,
        from: {
          type: "ai",
          name: "Content Analytics AI",
        },
        category: "Content Performance",
        metadata: {
          contentId: contentId,
        },
      });

      setShowMessageModal(true);
      setLastAction({
        type: "info",
        message: `Viewing analytics for ${content.title}`,
      });
    }
  };

  const handleShareContent = (contentId: string) => {
    const content = dashboardData?.lessonContent.find(
      (c) => c.id === contentId,
    );
    if (content) {
      // Simulate sharing functionality
      const shareUrl = `https://anansi.ai/content/${contentId}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        setLastAction({
          type: "success",
          message: `Share link for ${content.title} copied to clipboard`,
        });
      });

      addNotification({
        type: "content",
        priority: "low",
        title: "Content Shared",
        message: `Share link for ${content.title} has been generated`,
        isRead: false,
      });
    }
  };

  const handleCreateContent = async () => {
    if (!contentForm.title.trim() || !contentForm.content.trim()) {
      setLastAction({
        type: "error",
        message: "Please fill in required fields",
      });
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Add to dashboard data
      const newContent: LessonContent = {
        id: `content_${Date.now()}`,
        title: contentForm.title,
        subject: dashboardData?.teacherProfile.subject || "General",
        type: contentForm.type as "assignment" | "quiz" | "lesson" | "project",
        difficulty: contentForm.difficulty as "easy" | "medium" | "hard",
        status: "draft",
        createdAt: new Date().toISOString(),
        studentsCompleted: 0,
        averageScore: 0,
        estimatedDuration: contentForm.estimatedDuration,
        description: contentForm.description,
      };

      if (dashboardData) {
        setDashboardData({
          ...dashboardData,
          lessonContent: [...dashboardData.lessonContent, newContent],
        });
      }

      // Reset form and close dialog
      setContentForm({
        title: "",
        type: "lesson",
        subject: "",
        description: "",
        difficulty: "medium",
        estimatedDuration: 45,
        content: "",
      });
      setShowCreateContent(false);
      setLastAction({
        type: "success",
        message: `${contentForm.type} "${contentForm.title}" created successfully!`,
      });

      addNotification({
        type: "content",
        priority: "medium",
        title: "Content Created Successfully",
        message: `${contentForm.title} has been created and is ready for students.`,
        isRead: false,
      });
    } catch (error) {
      setLastAction({
        type: "error",
        message: "Failed to create content. Please try again.",
      });
    }
  };

  // Lessons CRUD Functions
  const fetchLessons = async () => {
    try {
      setLessonsLoading(true);
      const response = await axiosClient.get("/api/lessons/all-lessons");
      setLessons(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch lessons",
      });
    } finally {
      setLessonsLoading(false);
    }
  };

  const createLesson = async () => {
    if (!lessonForm.title.trim() || !lessonForm.content.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in both title and content",
      });
      return;
    }

    try {
      const response = await axiosClient.post("/api/lessons", lessonForm);
      if (response.data) {
        toast({
          title: "Success",
          description: "Lesson created successfully",
        });
        fetchLessons(); // Refresh lessons
        setShowCreateLesson(false);
        setLessonForm({
          title: "",
          content: "",
          subjectId: 0,
          difficultyLevel: 1,
          approvalStatus: 1,
          isActive: true,
        });
      }
    } catch (error) {
      console.error("Error creating lesson:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create lesson",
      });
    }
  };

  const updateLesson = async () => {
    if (
      !selectedLesson ||
      !lessonForm.title.trim() ||
      !lessonForm.content.trim()
    ) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in both title and content",
      });
      return;
    }

    try {
      const response = await axiosClient.put(
        `/api/lessons/${selectedLesson.lessonId}`,
        {
          lessonId: selectedLesson.lessonId,
          ...lessonForm,
        },
      );
      if (response.data) {
        toast({
          title: "Success",
          description: "Lesson updated successfully",
        });
        fetchLessons(); // Refresh lessons
        setShowEditLesson(false);
        setSelectedLesson(null);
        setLessonForm({
          title: "",
          content: "",
          subjectId: 0,
          difficultyLevel: 1,
          approvalStatus: 1,
          isActive: true,
        });
      }
    } catch (error) {
      console.error("Error updating lesson:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update lesson",
      });
    }
  };

  const deleteLesson = async (lessonId: number) => {
    try {
      const response = await axiosClient.delete(`/api/lessons`, {
        params: { lessonId },
      });
      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Lesson deleted successfully",
        });
        fetchLessons(); // Refresh lessons
      }
    } catch (error) {
      console.error("Error deleting lesson:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete lesson",
      });
    }
  };

  const handleEditLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setLessonForm({
      title: lesson.title,
      content: lesson.content,
      subjectId: lesson.subjectId,
      difficultyLevel: lesson.difficultyLevel,
      approvalStatus: lesson.approvalStatus,
      isActive: lesson.isActive,
    });
    setShowEditLesson(true);
  };

  const getDifficultyLabel = (level: number) => {
    switch (level) {
      case 1:
        return "Easy";
      case 2:
        return "Medium";
      case 3:
        return "Hard";
      default:
        return "Unknown";
    }
  };

  const getApprovalStatusLabel = (status: number) => {
    switch (status) {
      case 0:
        return "Draft";
      case 1:
        return "Pending";
      case 2:
        return "Approved";
      case 3:
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  // Helper functions
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "struggling":
        return "bg-red-100 text-red-800";
      case "excelling":
        return "bg-blue-100 text-blue-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredStudents =
    dashboardData?.students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        filterStatus === "all" || student.status === filterStatus;
      return matchesSearch && matchesFilter;
    }) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg font-medium text-gray-600">
            Loading Teacher Dashboard...
          </p>
        </div>
      </div>
    );
  }

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
                <img
                  src="https://cdn.builder.io/api/v1/assets/2d09da496e544a1eab05e596d02031d8/twinternet-logo-b18833?format=webp&width=800"
                  alt="AnansiAI Logo"
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-bold text-xl text-gray-800">
                      AnansiAI
                    </h1>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Brain className="w-3 h-3" />
                      Teacher Portal
                    </p>
                  </div>
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
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-96 p-0" align="end">
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
                  <DropdownMenuItem onClick={handleLogout}>
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
          <TabsList className="grid w-full grid-cols-7">
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
              <Calendar className="h-4 w-4" />
              <span>Classes</span>
            </TabsTrigger>
            <TabsTrigger
              value="content"
              className="flex items-center space-x-2"
            >
              <BookOpen className="h-4 w-4" />
              <span>Lessons</span>
            </TabsTrigger>
            <TabsTrigger
              value="assignments"
              className="flex items-center space-x-2"
            >
              <ClipboardList className="h-4 w-4" />
              <span>Assignments</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center space-x-2"
            >
              <Target className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger
              value="curriculum"
              className="flex items-center space-x-2"
            >
              <Award className="h-4 w-4" />
              <span>Curriculum</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold">Dashboard Overview</h2>
              <p className="text-gray-600">
                Monitor your teaching performance and student engagement
              </p>
            </div>

            {/* Quick Stats */}
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
                    +{dashboardData?.stats?.excellingStudents || 0} excelling
                    this week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Classes
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
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
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {dashboardData?.aiTwinInsights?.map((insight) => (
                        <div
                          key={insight.id}
                          className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                <Brain className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">
                                  {insight.studentName}
                                </p>
                                <p className="text-xs text-gray-600">
                                  AI Twin: {insight.twinLearningStage}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant={
                                  insight.twinEffectivenessScore >= 80
                                    ? "default"
                                    : insight.twinEffectivenessScore >= 60
                                      ? "secondary"
                                      : "destructive"
                                }
                                className="text-xs"
                              >
                                {insight.twinEffectivenessScore}% Effective
                              </Badge>
                              <Badge
                                variant={
                                  insight.emotionalState.stressLevel <= 3
                                    ? "default"
                                    : insight.emotionalState.stressLevel <= 6
                                      ? "secondary"
                                      : "destructive"
                                }
                                className="text-xs"
                              >
                                Stress: {insight.emotionalState.stressLevel}/10
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="font-medium text-purple-700">
                                Learning Style:
                              </span>
                              <p className="text-gray-600">
                                {insight.personalityTraits.learningStyle}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium text-blue-700">
                                Current Mood:
                              </span>
                              <p className="text-gray-600">
                                {insight.emotionalState.currentMood}
                              </p>
                            </div>
                          </div>

                          {insight.twinAdaptations.nextRecommendations.length >
                            0 && (
                            <div className="mt-2 p-2 bg-white/50 rounded text-xs">
                              <span className="font-medium text-green-700">
                                AI Twin Recommendations:
                              </span>
                              <p className="text-gray-600 mt-1">
                                {insight.twinAdaptations.nextRecommendations[0]}
                              </p>
                            </div>
                          )}

                          {insight.behaviorAnalysis.flaggedBehaviors.length >
                            0 && (
                            <div className="mt-2 p-2 bg-red-50 rounded text-xs">
                              <span className="font-medium text-red-700">
                                Behavioral Flags:
                              </span>
                              <p className="text-red-600 mt-1">
                                {insight.behaviorAnalysis.flaggedBehaviors.join(
                                  ", ",
                                )}
                              </p>
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                            <span>
                              Last interaction: {insight.lastTwinInteraction}
                            </span>
                            <span>
                              Risk Score: {insight.behaviorAnalysis.riskScore}
                              /10
                            </span>
                          </div>
                        </div>
                      )) || (
                        <div className="text-center py-8 text-gray-500">
                          <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No AI Twin data available</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Quick Actions Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-green-500" />
                    <span>Quick Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full justify-start"
                    onClick={() => setShowCreateLesson(true)}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Create Lesson
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setShowCreateAssignment(true)}
                  >
                    <ClipboardList className="mr-2 h-4 w-4" />
                    Create Assignment
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setShowCreateClass(true)}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Class
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                    onClick={() => {
                      setLastAction({
                        type: "info",
                        message: "Opening milestone creation dialog",
                      });
                    }}
                  >
                    <Target className="mr-2 h-4 w-4" />
                    Set Student Milestones
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setActiveTab("students")}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Review Student Progress
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setActiveTab("analytics")}
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Student Dashboard Preview - Responsive */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                  <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                  <span className="truncate">Student Dashboard Preview</span>
                </CardTitle>
                <div className="text-sm text-gray-600 mt-2">
                  Live preview of content your students see in their dashboards
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                {/* Active Assignments */}
                <div className="bg-white/80 rounded-lg p-3 sm:p-4 border border-blue-200">
                  <h4 className="font-medium text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500 flex-shrink-0" />
                    <span className="truncate">
                      Active Assignments (Student View)
                    </span>
                  </h4>
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 bg-orange-50 rounded border border-orange-200 space-y-1 sm:space-y-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium truncate">
                          Mathematics Quiz - Algebra
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-orange-700 border-orange-300 text-xs self-start sm:self-center"
                      >
                        Due: 2 days
                      </Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 bg-blue-50 rounded border border-blue-200 space-y-1 sm:space-y-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium truncate">
                          Science Project Submission
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-blue-700 border-blue-300 text-xs self-start sm:self-center"
                      >
                        Due: 1 week
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Student Milestones */}
                <div className="bg-white/80 rounded-lg p-3 sm:p-4 border border-purple-200">
                  <h4 className="font-medium text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <Target className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" />
                    <span className="truncate">
                      Learning Milestones (Student View)
                    </span>
                  </h4>
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 bg-purple-50 rounded border border-purple-200 space-y-2 sm:space-y-0">
                      <span className="text-xs sm:text-sm font-medium">
                        Complete Chapter 3 - Linear Equations
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-8 sm:w-12 bg-gray-200 rounded-full h-1.5">
                          <div className="bg-purple-600 h-1.5 rounded-full w-3/4"></div>
                        </div>
                        <span className="text-xs text-purple-600">75%</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 bg-green-50 rounded border border-green-200 space-y-1 sm:space-y-0">
                      <span className="text-xs sm:text-sm font-medium">
                        AI Twin Practice Sessions
                      </span>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700 text-xs self-start sm:self-center"
                      >
                        2/5 completed
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs sm:text-sm"
                    onClick={() => {
                      setLastAction({
                        type: "info",
                        message: "Opening full student dashboard preview",
                      });
                      // Simulate opening student view
                    }}
                  >
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">
                      Preview Full Student View
                    </span>
                    <span className="sm:hidden">Preview Student View</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs sm:text-sm"
                    onClick={() => {
                      setLastAction({
                        type: "info",
                        message: "Opening milestone management interface",
                      });
                      // Simulate milestone management
                    }}
                  >
                    <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Manage Milestones</span>
                    <span className="sm:hidden">Milestones</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-purple-500" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {dashboardData?.recentActivity?.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-3 p-2 rounded-lg bg-gray-50"
                      >
                        <div className="flex-shrink-0">
                          {activity.type === "submission" && (
                            <Send className="h-4 w-4 text-green-600" />
                          )}
                          {activity.type === "content_created" && (
                            <BookOpen className="h-4 w-4 text-blue-600" />
                          )}
                          {activity.type === "grade_posted" && (
                            <Award className="h-4 w-4 text-yellow-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">
                            {activity.title}
                          </p>
                          <p className="text-xs text-gray-600">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-gray-500">
                        <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No recent activity</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab with AI Twin Insights */}
          <TabsContent value="students" className="space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold">Student Management</h2>
              <p className="text-gray-600">
                Monitor student progress and AI-powered insights
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="struggling">Struggling</SelectItem>
                  <SelectItem value="excelling">Excelling</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* AI Twin Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dashboardData?.aiTwinInsights?.map((insight) => (
                <Card
                  key={insight.id}
                  className="border-l-4 border-l-purple-500"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="h-6 w-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                          <Brain className="h-3 w-3 text-white" />
                        </div>
                        <CardTitle className="text-base">
                          {insight.studentName}
                        </CardTitle>
                      </div>
                      <Badge
                        variant={
                          insight.twinLearningStage === "optimized"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {insight.twinLearningStage}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="font-medium">Effectiveness:</span>
                        <Progress
                          value={insight.twinEffectivenessScore}
                          className="h-2 mt-1"
                        />
                        <span className="text-gray-600">
                          {insight.twinEffectivenessScore}%
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Engagement:</span>
                        <Progress
                          value={insight.emotionalState.engagementLevel * 10}
                          className="h-2 mt-1"
                        />
                        <span className="text-gray-600">
                          {insight.emotionalState.engagementLevel}/10
                        </span>
                      </div>
                    </div>

                    <div className="text-xs">
                      <span className="font-medium">Learning Style:</span>
                      <p className="text-gray-600">
                        {insight.personalityTraits.learningStyle}
                      </p>
                    </div>

                    <div className="text-xs">
                      <span className="font-medium">Current State:</span>
                      <p className="text-gray-600">
                        {insight.emotionalState.currentMood}
                      </p>
                    </div>

                    {insight.behaviorAnalysis.riskScore > 5 && (
                      <div className="bg-red-50 p-2 rounded text-xs">
                        <span className="font-medium text-red-700">
                          ⚠��� Risk Score: {insight.behaviorAnalysis.riskScore}
                          /10
                        </span>
                      </div>
                    )}

                    {insight.twinAdaptations.nextRecommendations.length > 0 && (
                      <div className="bg-green-50 p-2 rounded text-xs">
                        <span className="font-medium text-green-700">
                          💡 AI Recommendation:
                        </span>
                        <p className="text-green-600 mt-1">
                          {insight.twinAdaptations.nextRecommendations[0]}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Last Twin Interaction:</span>
                      <span>{insight.lastTwinInteraction}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Traditional Student Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Student Overview & AI Twin Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>AI Twin Status</TableHead>
                      <TableHead>Emotional State</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => {
                      const twinInsight = dashboardData?.aiTwinInsights?.find(
                        (insight) => insight.studentId === student.id,
                      );

                      return (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={student.avatar} />
                                <AvatarFallback>
                                  {student.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{student.name}</p>
                                <p className="text-sm text-gray-500">
                                  {student.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{student.class}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Progress
                                value={student.overallProgress}
                                className="w-16"
                              />
                              <span className="text-sm">
                                {student.overallProgress}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {twinInsight ? (
                              <div className="flex items-center space-x-2">
                                <div className="h-4 w-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                  <Brain className="h-2 w-2 text-white" />
                                </div>
                                <div>
                                  <Badge variant="outline" className="text-xs">
                                    {twinInsight.twinLearningStage}
                                  </Badge>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {twinInsight.twinEffectivenessScore}%
                                    effective
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <Badge variant="secondary" className="text-xs">
                                Twin Initializing
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {twinInsight ? (
                              <div>
                                <p className="text-sm">
                                  {twinInsight.emotionalState.currentMood}
                                </p>
                                <div className="flex items-center space-x-1 mt-1">
                                  <span className="text-xs text-gray-500">
                                    Stress:
                                  </span>
                                  <Badge
                                    variant={
                                      twinInsight.emotionalState.stressLevel <=
                                      3
                                        ? "default"
                                        : twinInsight.emotionalState
                                              .stressLevel <= 6
                                          ? "secondary"
                                          : "destructive"
                                    }
                                    className="text-xs"
                                  >
                                    {twinInsight.emotionalState.stressLevel}/10
                                  </Badge>
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">
                                Analyzing...
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {twinInsight ? (
                              <Badge
                                variant={
                                  twinInsight.behaviorAnalysis.riskScore <= 3
                                    ? "default"
                                    : twinInsight.behaviorAnalysis.riskScore <=
                                        6
                                      ? "secondary"
                                      : "destructive"
                                }
                                className="text-xs"
                              >
                                {twinInsight.behaviorAnalysis.riskScore}/10
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">
                                Pending
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                title="View AI Twin Details"
                                onClick={() =>
                                  handleViewAITwinDetails(student.id)
                                }
                              >
                                <Brain className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                title="View Student Profile"
                                onClick={() => handleViewStudent(student.id)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                title="Send Message"
                                onClick={() =>
                                  handleSendMessageToStudent(student.id)
                                }
                              >
                                <Send className="h-3 w-3" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <MoreHorizontal className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleScheduleMeeting(student.id)
                                    }
                                  >
                                    <Calendar className="mr-2 h-3 w-3" />
                                    Schedule Meeting
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleSendToParent(student.id)
                                    }
                                  >
                                    <MessageSquare className="mr-2 h-3 w-3" />
                                    Contact Parents
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <FileText className="mr-2 h-3 w-3" />
                                    Generate Report
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <UserCheck className="mr-2 h-3 w-3" />
                                    Mark as Excelling
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <UserX className="mr-2 h-3 w-3" />
                                    Flag for Support
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Classes Tab */}
          <TabsContent value="classes" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">My Classes</h2>
                <p className="text-gray-600">Manage your active classes</p>
              </div>
              <Button onClick={() => setShowCreateClass(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Class
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData?.classes?.map((classItem) => (
                <Card key={classItem.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {classItem.name}
                      </CardTitle>
                      <Badge variant="outline">{classItem.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {classItem.subject} • {classItem.grade}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Students:</span>
                      <span className="font-medium">
                        {classItem.studentCount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress:</span>
                      <span className="font-medium">{classItem.progress}%</span>
                    </div>
                    <Progress value={classItem.progress} />
                    <div className="flex items-center justify-between text-sm">
                      <span>Next Lesson:</span>
                      <span className="font-medium">
                        {classItem.nextLesson}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleViewClass(classItem.id)}
                      >
                        <Eye className="mr-2 h-3 w-3" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleEditClass(classItem.id)}
                      >
                        <Edit className="mr-2 h-3 w-3" />
                        Edit
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => handleManageStudents(classItem.id)}
                          >
                            <Users className="mr-2 h-3 w-3" />
                            Manage Students
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleClassAnalytics(classItem.id)}
                          >
                            <BarChart3 className="mr-2 h-3 w-3" />
                            View Analytics
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleExportClassData(classItem.id)}
                          >
                            <Download className="mr-2 h-3 w-3" />
                            Export Data
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDuplicateClass(classItem.id)}
                          >
                            <Copy className="mr-2 h-3 w-3" />
                            Duplicate Class
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleQuickAssignment()}
                          >
                            <Plus className="mr-2 h-3 w-3" />
                            Quick Assignment
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleArchiveClass(classItem.id)}
                          >
                            <Archive className="mr-2 h-3 w-3" />
                            Archive Class
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteClass(classItem.id)}
                          >
                            <Trash2 className="mr-2 h-3 w-3" />
                            Delete Class
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              )) || (
                <div className="col-span-full text-center py-8 text-gray-500">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No classes created yet</p>
                  <Button
                    className="mt-2"
                    onClick={() => setShowCreateClass(true)}
                  >
                    Create Your First Class
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Lessons Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Lesson Management</h2>
                <p className="text-gray-600">
                  Create and manage your lessons with full CRUD operations
                </p>
              </div>
              <Button onClick={() => setShowCreateLesson(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Lesson
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Lesson Library</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchLessons}
                      disabled={lessonsLoading}
                    >
                      <RefreshCw
                        className={`h-4 w-4 mr-2 ${lessonsLoading ? "animate-spin" : ""}`}
                      />
                      Refresh
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {lessonsLoading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin text-gray-400" />
                    <p className="text-gray-500">Loading lessons...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Active</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lessons.length > 0 ? (
                        lessons.map((lesson) => (
                          <TableRow key={lesson.lessonId}>
                            <TableCell className="font-medium">
                              {lesson.title}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {getSubjectName(lesson.subjectId)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  lesson.difficultyLevel === 3
                                    ? "destructive"
                                    : lesson.difficultyLevel === 2
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {getDifficultyLabel(lesson.difficultyLevel)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  lesson.approvalStatus === 2
                                    ? "default"
                                    : lesson.approvalStatus === 1
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {getApprovalStatusLabel(lesson.approvalStatus)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  lesson.isActive ? "default" : "secondary"
                                }
                              >
                                {lesson.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditLesson(lesson)}
                                  title="Edit Lesson"
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button size="sm" variant="outline">
                                      <MoreHorizontal className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem
                                      onClick={() => handleEditLesson(lesson)}
                                    >
                                      <Edit className="mr-2 h-3 w-3" />
                                      Edit Lesson
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Eye className="mr-2 h-3 w-3" />
                                      Preview Lesson
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Copy className="mr-2 h-3 w-3" />
                                      Duplicate
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Download className="mr-2 h-3 w-3" />
                                      Export
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() =>
                                        deleteLesson(lesson.lessonId)
                                      }
                                    >
                                      <Trash2 className="mr-2 h-3 w-3" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-8 text-gray-500"
                          >
                            <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No lessons created yet</p>
                            <Button
                              className="mt-2"
                              onClick={() => setShowCreateLesson(true)}
                            >
                              Create Your First Lesson
                            </Button>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Assignment Management</h2>
                <p className="text-gray-600">
                  Create and manage assignments with deadlines and rubrics
                </p>
              </div>
              <Button onClick={() => setShowCreateAssignment(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Assignment
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Assignment Library</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchAssignments}
                      disabled={assignmentsLoading}
                    >
                      <RefreshCw
                        className={`h-4 w-4 mr-2 ${assignmentsLoading ? "animate-spin" : ""}`}
                      />
                      Refresh
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {assignmentsLoading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin text-gray-400" />
                    <p className="text-gray-500">Loading assignments...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Lesson ID</TableHead>
                        <TableHead>Question Type</TableHead>
                        <TableHead>Deadline</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Active</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignments.length > 0 ? (
                        assignments.map((assignment) => (
                          <TableRow key={assignment.assignmentId}>
                            <TableCell className="font-medium">
                              {assignment.title}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                Lesson {assignment.lessonId}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {getQuestionTypeLabel(assignment.questionType)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {assignment.deadline
                                ? new Date(
                                    assignment.deadline,
                                  ).toLocaleDateString()
                                : "No deadline"}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  assignment.approvalStatus === 2
                                    ? "default"
                                    : assignment.approvalStatus === 1
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {getApprovalStatusLabel(
                                  assignment.approvalStatus,
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  assignment.isActive ? "default" : "secondary"
                                }
                              >
                                {assignment.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleEditAssignment(assignment)
                                  }
                                  title="Edit Assignment"
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button size="sm" variant="outline">
                                      <MoreHorizontal className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleEditAssignment(assignment)
                                      }
                                    >
                                      <Edit className="mr-2 h-3 w-3" />
                                      Edit Assignment
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Eye className="mr-2 h-3 w-3" />
                                      Preview Assignment
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Copy className="mr-2 h-3 w-3" />
                                      Duplicate
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Download className="mr-2 h-3 w-3" />
                                      Export
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() =>
                                        deleteAssignment(
                                          assignment.assignmentId,
                                        )
                                      }
                                    >
                                      <Trash2 className="mr-2 h-3 w-3" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center py-8 text-gray-500"
                          >
                            <ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">
                              No assignments created yet
                            </p>
                            <Button
                              className="mt-2"
                              onClick={() => setShowCreateAssignment(true)}
                            >
                              Create Your First Assignment
                            </Button>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Teaching Analytics</h2>
              <p className="text-gray-600">
                Insights into your teaching effectiveness
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Class Performance Overview</CardTitle>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDownloadAnalytics}
                    >
                      <Download className="mr-2 h-3 w-3" />
                      Export Report
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Average Completion Rate</span>
                      <span className="font-bold">
                        {dashboardData?.stats?.completionRate || 0}%
                      </span>
                    </div>
                    <Progress
                      value={dashboardData?.stats?.completionRate || 0}
                    />

                    <div className="flex justify-between items-center">
                      <span>Weekly Engagement</span>
                      <span className="font-bold">
                        {dashboardData?.stats?.weeklyEngagement || 0}%
                      </span>
                    </div>
                    <Progress
                      value={dashboardData?.stats?.weeklyEngagement || 0}
                    />

                    <div className="pt-3 border-t">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setActiveTab("students")}
                      >
                        <BarChart3 className="mr-2 h-4 w-4" />
                        View Detailed Analytics
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>AI Teaching Insights</CardTitle>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        addMessage({
                          type: "ai_insight",
                          priority: "medium",
                          title: "Weekly AI Teaching Report",
                          message:
                            "Your personalized teaching insights are ready",
                          details:
                            "Comprehensive analysis of your teaching effectiveness this week:\n\n• Interactive lessons showed 23% better engagement\n• Visual learning approaches increased retention by 18%\n• Student participation increased across all classes\n• Recommended focus areas identified for optimal learning",
                          from: {
                            type: "ai",
                            name: "AI Teaching Assistant",
                          },
                          category: "Teaching Analytics",
                        });
                        setShowMessageModal(true);
                      }}
                    >
                      <FileText className="mr-2 h-3 w-3" />
                      Full Report
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">
                        Interactive lessons yield 23% better engagement
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm">
                        Student participation increased this week
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">
                        Focus on visual learners in Class 10A
                      </span>
                    </div>

                    <div className="pt-3 border-t">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setActiveTab("students");
                          setLastAction({
                            type: "info",
                            message:
                              "Viewing AI Twin analytics for all students",
                          });
                        }}
                      >
                        <Brain className="mr-2 h-4 w-4" />
                        View AI Twin Analytics
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Curriculum Tab - Milestones & Goals */}
          <TabsContent value="curriculum" className="space-y-8">
            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold">Curriculum Overview</h2>
              <p className="text-gray-600">
                Stay aligned with curriculum standards and track progress
                against learning objectives
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">
                      Content Milestones
                    </p>
                    <p className="text-2xl font-bold text-purple-800">
                      {dashboardData?.milestones?.length || 0}
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-600 text-sm font-medium">
                      Learning Goals
                    </p>
                    <p className="text-2xl font-bold text-orange-800">
                      {dashboardData?.goals?.length || 0}
                    </p>
                  </div>
                  <Award className="w-8 h-8 text-orange-600" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">
                      Active Items
                    </p>
                    <p className="text-2xl font-bold text-green-800">
                      {(dashboardData?.milestones?.filter((m) => m.isActive)
                        .length || 0) +
                        (dashboardData?.goals?.filter((g) => g.isActive)
                          .length || 0)}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">
                      Current Term
                    </p>
                    <p className="text-lg font-bold text-blue-800">Term 2</p>
                    <p className="text-xs text-blue-600">In Progress</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Main Content - Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Milestones Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-800">
                      Content Milestones
                    </h4>
                    <p className="text-gray-600 text-sm">
                      What content should be covered
                    </p>
                  </div>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {dashboardData?.milestones?.map((milestone, index) => (
                    <div
                      key={milestone.id}
                      className="group relative bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-purple-300 transition-all duration-200"
                    >
                      <div className="absolute top-4 right-4">
                        <Badge
                          variant={milestone.isActive ? "default" : "secondary"}
                          className={
                            milestone.isActive
                              ? "bg-purple-100 text-purple-700 border-purple-200"
                              : ""
                          }
                        >
                          {milestone.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
                            {index + 1}
                          </div>
                          <Badge
                            variant="outline"
                            className="border-purple-200 text-purple-700"
                          >
                            {milestone.term}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-gray-700 leading-relaxed mb-3 pr-16">
                        {milestone.milestone}
                      </p>

                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {new Date(milestone.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}

                  {(!dashboardData?.milestones ||
                    dashboardData.milestones.length === 0) && (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                      <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <h5 className="font-semibold text-gray-700 mb-2">
                        No Milestones Set
                      </h5>
                      <p className="text-gray-500 text-sm max-w-sm mx-auto">
                        Your administrator hasn't set up content milestones for
                        your subjects yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Goals Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Award className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-800">
                      Learning Goals
                    </h4>
                    <p className="text-gray-600 text-sm">
                      What students should achieve
                    </p>
                  </div>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {dashboardData?.goals?.map((goal, index) => (
                    <div
                      key={goal.id}
                      className="group relative bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-orange-300 transition-all duration-200"
                    >
                      <div className="absolute top-4 right-4">
                        <Badge
                          variant={goal.isActive ? "default" : "secondary"}
                          className={
                            goal.isActive
                              ? "bg-orange-100 text-orange-700 border-orange-200"
                              : ""
                          }
                        >
                          {goal.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">
                            {index + 1}
                          </div>
                          <Badge
                            variant="outline"
                            className="border-orange-200 text-orange-700"
                          >
                            {goal.term}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-gray-700 leading-relaxed mb-3 pr-16">
                        {goal.goal}
                      </p>

                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {new Date(goal.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}

                  {(!dashboardData?.goals ||
                    dashboardData.goals.length === 0) && (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                      <Award className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <h5 className="font-semibold text-gray-700 mb-2">
                        No Goals Set
                      </h5>
                      <p className="text-gray-500 text-sm max-w-sm mx-auto">
                        Your administrator hasn't defined learning goals for
                        your subjects yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Class Dialog */}
      <Dialog open={showCreateClass} onOpenChange={setShowCreateClass}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Class</DialogTitle>
            <DialogDescription>
              Set up a new class for your students
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
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
            <div>
              <Label htmlFor="class-subject">Subject *</Label>
              <Input
                id="class-subject"
                value={classForm.subject}
                onChange={(e) =>
                  setClassForm({ ...classForm, subject: e.target.value })
                }
                placeholder="e.g., Mathematics"
              />
            </div>
            <div>
              <Label htmlFor="class-grade">Grade</Label>
              <Input
                id="class-grade"
                value={classForm.grade}
                onChange={(e) =>
                  setClassForm({ ...classForm, grade: e.target.value })
                }
                placeholder="e.g., Grade 10"
              />
            </div>
            <div>
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
            <div>
              <Label htmlFor="class-schedule">Schedule</Label>
              <Input
                id="class-schedule"
                value={classForm.schedule}
                onChange={(e) =>
                  setClassForm({ ...classForm, schedule: e.target.value })
                }
                placeholder="e.g., Mon, Wed, Fri - 10:00 AM"
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

      {/* Create Lesson Dialog */}
      <Dialog open={showCreateLesson} onOpenChange={setShowCreateLesson}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Lesson</DialogTitle>
            <DialogDescription>
              Create a new lesson with structured content for your students
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="lesson-title">Title *</Label>
              <Input
                id="lesson-title"
                value={lessonForm.title}
                onChange={(e) =>
                  setLessonForm({ ...lessonForm, title: e.target.value })
                }
                placeholder="e.g., Introduction to Algebra"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lesson-subjectId">Subject *</Label>
                <Select
                  value={lessonForm.subjectId.toString()}
                  onValueChange={(value) =>
                    setLessonForm({
                      ...lessonForm,
                      subjectId: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjectsLoading ? (
                      <SelectItem value="0" disabled>
                        Loading subjects...
                      </SelectItem>
                    ) : subjects.length > 0 ? (
                      subjects.map((subject) => (
                        <SelectItem
                          key={subject.subjectId}
                          value={subject.subjectId.toString()}
                        >
                          {subject.subjectName} (ID: {subject.subjectId})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="0" disabled>
                        No subjects available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="lesson-difficulty">Difficulty Level</Label>
                <Select
                  value={lessonForm.difficultyLevel.toString()}
                  onValueChange={(value) =>
                    setLessonForm({
                      ...lessonForm,
                      difficultyLevel: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Easy</SelectItem>
                    <SelectItem value="2">Medium</SelectItem>
                    <SelectItem value="3">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="lesson-content">Lesson Content *</Label>
              <Textarea
                id="lesson-content"
                value={lessonForm.content}
                onChange={(e) =>
                  setLessonForm({ ...lessonForm, content: e.target.value })
                }
                placeholder="Enter the detailed lesson content, objectives, and materials..."
                rows={8}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lesson-approval">Approval Status</Label>
                <Select
                  value={lessonForm.approvalStatus.toString()}
                  onValueChange={(value) =>
                    setLessonForm({
                      ...lessonForm,
                      approvalStatus: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Draft</SelectItem>
                    <SelectItem value="1">Pending</SelectItem>
                    <SelectItem value="2">Approved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="lesson-active"
                  checked={lessonForm.isActive}
                  onChange={(e) =>
                    setLessonForm({ ...lessonForm, isActive: e.target.checked })
                  }
                  className="rounded"
                />
                <Label htmlFor="lesson-active">Active Lesson</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateLesson(false)}
            >
              Cancel
            </Button>
            <Button onClick={createLesson}>Create Lesson</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Lesson Dialog */}
      <Dialog open={showEditLesson} onOpenChange={setShowEditLesson}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Lesson</DialogTitle>
            <DialogDescription>
              Update lesson information and content
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-lesson-title">Title *</Label>
              <Input
                id="edit-lesson-title"
                value={lessonForm.title}
                onChange={(e) =>
                  setLessonForm({ ...lessonForm, title: e.target.value })
                }
                placeholder="e.g., Introduction to Algebra"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-lesson-subjectId">Subject *</Label>
                <Select
                  value={lessonForm.subjectId.toString()}
                  onValueChange={(value) =>
                    setLessonForm({
                      ...lessonForm,
                      subjectId: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjectsLoading ? (
                      <SelectItem value="0" disabled>
                        Loading subjects...
                      </SelectItem>
                    ) : subjects.length > 0 ? (
                      subjects.map((subject) => (
                        <SelectItem
                          key={subject.subjectId}
                          value={subject.subjectId.toString()}
                        >
                          {subject.subjectName} (ID: {subject.subjectId})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="0" disabled>
                        No subjects available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-lesson-difficulty">Difficulty Level</Label>
                <Select
                  value={lessonForm.difficultyLevel.toString()}
                  onValueChange={(value) =>
                    setLessonForm({
                      ...lessonForm,
                      difficultyLevel: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Easy</SelectItem>
                    <SelectItem value="2">Medium</SelectItem>
                    <SelectItem value="3">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-lesson-content">Lesson Content *</Label>
              <Textarea
                id="edit-lesson-content"
                value={lessonForm.content}
                onChange={(e) =>
                  setLessonForm({ ...lessonForm, content: e.target.value })
                }
                placeholder="Enter the detailed lesson content, objectives, and materials..."
                rows={8}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-lesson-approval">Approval Status</Label>
                <Select
                  value={lessonForm.approvalStatus.toString()}
                  onValueChange={(value) =>
                    setLessonForm({
                      ...lessonForm,
                      approvalStatus: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Draft</SelectItem>
                    <SelectItem value="1">Pending</SelectItem>
                    <SelectItem value="2">Approved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="edit-lesson-active"
                  checked={lessonForm.isActive}
                  onChange={(e) =>
                    setLessonForm({ ...lessonForm, isActive: e.target.checked })
                  }
                  className="rounded"
                />
                <Label htmlFor="edit-lesson-active">Active Lesson</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEditLesson(false);
                setSelectedLesson(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={updateLesson}>Update Lesson</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Assignment Dialog */}
      <Dialog
        open={showCreateAssignment}
        onOpenChange={setShowCreateAssignment}
      >
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create New Assignment</DialogTitle>
            <DialogDescription>
              Create a new assignment with questions, rubric, and deadline
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="assignment-title">Title *</Label>
              <Input
                id="assignment-title"
                value={assignmentForm.title}
                onChange={(e) =>
                  setAssignmentForm({
                    ...assignmentForm,
                    title: e.target.value,
                  })
                }
                placeholder="e.g., Algebra Problem Set 1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="assignment-lessonId">Lesson ID *</Label>
                <Input
                  id="assignment-lessonId"
                  type="number"
                  value={assignmentForm.lessonId || ""}
                  onChange={(e) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      lessonId: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="Enter lesson ID"
                />
              </div>
              <div>
                <Label htmlFor="assignment-questionType">Question Type</Label>
                <Select
                  value={assignmentForm.questionType.toString()}
                  onValueChange={(value) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      questionType: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Multiple Choice</SelectItem>
                    <SelectItem value="2">Short Answer</SelectItem>
                    <SelectItem value="3">Essay</SelectItem>
                    <SelectItem value="4">True/False</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="assignment-content">Assignment Content *</Label>
              <Textarea
                id="assignment-content"
                value={assignmentForm.content}
                onChange={(e) =>
                  setAssignmentForm({
                    ...assignmentForm,
                    content: e.target.value,
                  })
                }
                placeholder="Enter the assignment instructions, questions, and requirements..."
                rows={6}
              />
            </div>
            <div>
              <Label htmlFor="assignment-rubric">Rubric</Label>
              <Textarea
                id="assignment-rubric"
                value={assignmentForm.rubric}
                onChange={(e) =>
                  setAssignmentForm({
                    ...assignmentForm,
                    rubric: e.target.value,
                  })
                }
                placeholder="Enter grading criteria and rubric details..."
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="assignment-deadline">Deadline *</Label>
                <Input
                  id="assignment-deadline"
                  type="datetime-local"
                  value={assignmentForm.deadline}
                  onChange={(e) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      deadline: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="assignment-approval">Approval Status</Label>
                <Select
                  value={assignmentForm.approvalStatus.toString()}
                  onValueChange={(value) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      approvalStatus: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Draft</SelectItem>
                    <SelectItem value="1">Pending</SelectItem>
                    <SelectItem value="2">Approved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="assignment-active"
                checked={assignmentForm.isActive}
                onChange={(e) =>
                  setAssignmentForm({
                    ...assignmentForm,
                    isActive: e.target.checked,
                  })
                }
                className="rounded"
              />
              <Label htmlFor="assignment-active">Active Assignment</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateAssignment(false)}
            >
              Cancel
            </Button>
            <Button onClick={createAssignment}>Create Assignment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Assignment Dialog */}
      <Dialog open={showEditAssignment} onOpenChange={setShowEditAssignment}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Assignment</DialogTitle>
            <DialogDescription>
              Update assignment information, content, and settings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-assignment-title">Title *</Label>
              <Input
                id="edit-assignment-title"
                value={assignmentForm.title}
                onChange={(e) =>
                  setAssignmentForm({
                    ...assignmentForm,
                    title: e.target.value,
                  })
                }
                placeholder="e.g., Algebra Problem Set 1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-assignment-lessonId">Lesson ID *</Label>
                <Input
                  id="edit-assignment-lessonId"
                  type="number"
                  value={assignmentForm.lessonId || ""}
                  onChange={(e) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      lessonId: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="Enter lesson ID"
                />
              </div>
              <div>
                <Label htmlFor="edit-assignment-questionType">
                  Question Type
                </Label>
                <Select
                  value={assignmentForm.questionType.toString()}
                  onValueChange={(value) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      questionType: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Multiple Choice</SelectItem>
                    <SelectItem value="2">Short Answer</SelectItem>
                    <SelectItem value="3">Essay</SelectItem>
                    <SelectItem value="4">True/False</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-assignment-content">
                Assignment Content *
              </Label>
              <Textarea
                id="edit-assignment-content"
                value={assignmentForm.content}
                onChange={(e) =>
                  setAssignmentForm({
                    ...assignmentForm,
                    content: e.target.value,
                  })
                }
                placeholder="Enter the assignment instructions, questions, and requirements..."
                rows={6}
              />
            </div>
            <div>
              <Label htmlFor="edit-assignment-rubric">Rubric</Label>
              <Textarea
                id="edit-assignment-rubric"
                value={assignmentForm.rubric}
                onChange={(e) =>
                  setAssignmentForm({
                    ...assignmentForm,
                    rubric: e.target.value,
                  })
                }
                placeholder="Enter grading criteria and rubric details..."
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-assignment-deadline">Deadline *</Label>
                <Input
                  id="edit-assignment-deadline"
                  type="datetime-local"
                  value={assignmentForm.deadline}
                  onChange={(e) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      deadline: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-assignment-approval">
                  Approval Status
                </Label>
                <Select
                  value={assignmentForm.approvalStatus.toString()}
                  onValueChange={(value) =>
                    setAssignmentForm({
                      ...assignmentForm,
                      approvalStatus: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Draft</SelectItem>
                    <SelectItem value="1">Pending</SelectItem>
                    <SelectItem value="2">Approved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-assignment-active"
                checked={assignmentForm.isActive}
                onChange={(e) =>
                  setAssignmentForm({
                    ...assignmentForm,
                    isActive: e.target.checked,
                  })
                }
                className="rounded"
              />
              <Label htmlFor="edit-assignment-active">Active Assignment</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEditAssignment(false);
                setSelectedAssignment(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={updateAssignment}>Update Assignment</Button>
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
            >
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Development Banner */}
      <DevelopmentBanner />
    </div>
  );
}
