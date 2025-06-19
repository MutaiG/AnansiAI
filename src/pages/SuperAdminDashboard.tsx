import { useState, useEffect } from "react";
import usePageTitle from "@/hooks/usePageTitle";
import {
  useSchools,
  useSystemStats,
  useSystemAlerts,
  useNotifications,
  useSuperAdminInfo,
  useAuth,
} from "@/hooks/useApi";
import { apiWithFallback } from "@/services/apiWithFallback";
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
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Brain,
  Building,
  Users,
  GraduationCap,
  Settings,
  Shield,
  BarChart3,
  Bell,
  LogOut,
  Plus,
  Edit,
  Eye,
  MapPin,
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle,
  Download,
  Search,
  Filter,
  Globe,
  Database,
  Zap,
  Calendar,
  FileText,
  Monitor,
  Trash2,
  Activity,
  Star,
  School,
  BookOpen,
  Target,
  Lightbulb,
  Clock,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  ServerCrash,
  AlertCircle,
  Info,
  CheckSquare,
  Key,
  Mail,
  Phone,
  Link,
  ExternalLink,
  RefreshCw,
  CloudUpload,
  BarChart,
  PieChart,
  LineChart,
  TrendingDown,
  UserPlus,
  Upload,
  Copy,
  Save,
  X,
  Home,
  Navigation,
  Bookmark,
  History,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface School {
  id: string;
  name: string;
  code: string;
  county: string;
  subcounty: string;
  ward: string;
  students: number;
  teachers: number;
  status: "active" | "maintenance" | "inactive" | "pending";
  performance: number;
  aiAccuracy: number;
  lastSync: string;
  adminName: string;
  adminEmail: string;
  establishedYear: number;
  type: "primary" | "secondary" | "mixed";
}

interface SystemStats {
  totalSchools: number;
  totalStudents: number;
  totalTeachers: number;
  avgPerformance: number;
  systemUptime: number;
  dataStorage: number;
  activeUsers: number;
  dailyLogins: number;
}

interface SystemAlert {
  id: string;
  type: "critical" | "warning" | "info" | "success";
  title: string;
  message: string;
  school?: string;
  time: string;
  priority: "high" | "medium" | "low";
  actionRequired: boolean;
}

interface Notification {
  id: string;
  type: "system" | "school" | "performance" | "security" | "maintenance";
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: "high" | "medium" | "low";
}

interface BreadcrumbItem {
  label: string;
  href?: string;
}

// Kenya Counties and Subcounties data
const kenyanCountiesData = {
  Nairobi: [
    "Westlands",
    "Dagoretti North",
    "Dagoretti South",
    "Langata",
    "Kibra",
    "Roysambu",
    "Kasarani",
    "Ruaraka",
    "Embakasi South",
    "Embakasi North",
    "Embakasi Central",
    "Embakasi East",
    "Embakasi West",
    "Makadara",
    "Kamukunji",
    "Starehe",
    "Mathare",
  ],
  Mombasa: ["Changamwe", "Jomba", "Kisauni", "Nyali", "Likoni", "Mvita"],
  Kwale: ["Matuga", "Lungalunga", "Msambweni", "Kinango"],
  Kilifi: [
    "Kilifi North",
    "Kilifi South",
    "Kaloleni",
    "Rabai",
    "Ganze",
    "Malindi",
    "Magarini",
  ],
  "Tana River": ["Garsen", "Galole", "Bura"],
  Lamu: ["Lamu East", "Lamu West"],
  "Taita Taveta": ["Taveta", "Wundanyi", "Mwatate", "Voi"],
  Garissa: [
    "Garissa Township",
    "Balambala",
    "Lagdera",
    "Dadaab",
    "Fafi",
    "Ijara",
  ],
  Wajir: [
    "Wajir North",
    "Wajir East",
    "Tarbaj",
    "Wajir West",
    "Eldas",
    "Wajir South",
  ],
  Mandera: [
    "Mandera West",
    "Banissa",
    "Mandera North",
    "Mandera South",
    "Mandera East",
    "Lafey",
  ],
  Marsabit: ["Moyale", "North Horr", "Saku", "Laisamis"],
  Isiolo: ["Isiolo North", "Isiolo South"],
  Meru: [
    "Igembe South",
    "Igembe Central",
    "Igembe North",
    "Tigania West",
    "Tigania East",
    "North Imenti",
    "Buuri",
    "Central Imenti",
    "South Imenti",
  ],
  "Tharaka Nithi": ["Tharaka", "Chuka/Igambang'ombe", "Maara"],
  Embu: ["Manyatta", "Runyenjes", "Mbeere South", "Mbeere North"],
  Kitui: [
    "Mwingi North",
    "Mwingi West",
    "Mwingi Central",
    "Kitui West",
    "Kitui Rural",
    "Kitui Central",
    "Kitui East",
    "Kitui South",
  ],
  Machakos: [
    "Masinga",
    "Yatta",
    "Kangundo",
    "Matungulu",
    "Kathiani",
    "Mavoko",
    "Machakos Town",
    "Mwala",
  ],
  Makueni: ["Makueni", "Kibwezi West", "Kibwezi East", "Kilome", "Kaiti"],
  Nyandarua: ["Kinangop", "Kipipiri", "Ol Kalou", "Ol Joro Orok", "Ndaragwa"],
  Nyeri: ["Tetu", "Kieni", "Mathira", "Othaya", "Mukurweini", "Nyeri Town"],
  Kirinyaga: ["Mwea", "Gichugu", "Ndia", "Kirinyaga Central"],
  "Murang'a": [
    "Gatanga",
    "Kang'ema",
    "Mathioya",
    "Kiharu",
    "Kigumo",
    "Maragwa",
    "Kandara",
  ],
  Kiambu: [
    "Gatundu South",
    "Gatundu North",
    "Juja",
    "Thika Town",
    "Ruiru",
    "Githunguri",
    "Kiambu",
    "Kiambaa",
    "Kabete",
    "Kikuyu",
    "Limuru",
    "Lari",
  ],
  Turkana: [
    "Loima",
    "Turkana South",
    "Turkana West",
    "Turkana North",
    "Turkana East",
    "Turkana Central",
  ],
  "West Pokot": ["Kacheliba", "Kapenguria", "Sigor", "West Pokot"],
  Samburu: ["Samburu West", "Samburu North", "Samburu East"],
  "Trans Nzoia": ["Kwanza", "Endebess", "Saboti", "Kiminini", "Cherangany"],
  "Uasin Gishu": ["Soy", "Turbo", "Moiben", "Ainabkoi", "Kapseret", "Kesses"],
  "Elgeyo Marakwet": [
    "Marakwet East",
    "Marakwet West",
    "Keiyo North",
    "Keiyo South",
  ],
  Nandi: ["Tinderet", "Aldai", "Nandi Hills", "Chesumei", "Emgwen", "Mosop"],
  Baringo: [
    "Tiaty",
    "Baringo North",
    "Baringo Central",
    "Baringo South",
    "Mogotio",
    "Eldama Ravine",
  ],
  Laikipia: ["Laikipia West", "Laikipia East", "Laikipia North"],
  Nakuru: [
    "Molo",
    "Njoro",
    "Naivasha",
    "Gilgil",
    "Kuresoi South",
    "Kuresoi North",
    "Subukia",
    "Rongai",
    "Bahati",
    "Nakuru Town West",
    "Nakuru Town East",
  ],
  Narok: [
    "Kilgoris",
    "Emurua Dikirr",
    "Narok North",
    "Narok East",
    "Narok South",
    "Narok West",
  ],
  Kajiado: [
    "Kajiado North",
    "Kajiado Central",
    "Kajiado East",
    "Kajiado West",
    "Kajiado South",
  ],
  Kericho: [
    "Kipkelion East",
    "Kipkelion West",
    "Ainamoi",
    "Bureti",
    "Belgut",
    "Sigowet/Soin",
  ],
  Bomet: ["Sotik", "Chepalungu", "Bomet East", "Bomet Central", "Konoin"],
  Kakamega: [
    "Lugari",
    "Likuyani",
    "Malava",
    "Lurambi",
    "Navakholo",
    "Mumias West",
    "Mumias East",
    "Matungu",
    "Butere",
    "Khwisero",
    "Shinyalu",
    "Ikolomani",
  ],
  Vihiga: ["Sabatia", "Hamisi", "Luanda", "Emuhaya", "Vihiga"],
  Bungoma: [
    "Mt. Elgon",
    "Sirisia",
    "Kabuchai",
    "Bumula",
    "Kanduyi",
    "Webuye East",
    "Webuye West",
    "Kimilili",
    "Tongaren",
  ],
  Busia: [
    "Teso North",
    "Teso South",
    "Nambale",
    "Matayos",
    "Butula",
    "Funyula",
    "Budalangi",
  ],
  Siaya: ["Ugenya", "Ugunja", "Alego Usonga", "Gem", "Bondo", "Rarieda"],
  Kisumu: [
    "Kisumu East",
    "Kisumu West",
    "Kisumu Central",
    "Seme",
    "Nyando",
    "Muhoroni",
    "Nyakach",
  ],
  "Homa Bay": [
    "Kasipul",
    "Kabondo Kasipul",
    "Karachuonyo",
    "Rangwe",
    "Homa Bay Town",
    "Ndhiwa",
    "Suba North",
    "Suba South",
  ],
  Migori: [
    "Rongo",
    "Awendo",
    "Suna East",
    "Suna West",
    "Uriri",
    "Nyatike",
    "Kuria West",
    "Kuria East",
  ],
  Kisii: [
    "Bonchari",
    "South Mugirango",
    "Bomachoge Borabu",
    "Bobasi",
    "Bomachoge Chache",
    "Nyaribari Masaba",
    "Nyaribari Chache",
    "Kitutu Chache North",
    "Kitutu Chache South",
  ],
  Nyamira: ["Kitutu Masaba", "West Mugirango", "North Mugirango", "Borabu"],
};

const SuperAdminDashboard = () => {
  usePageTitle("Super Admin Dashboard");

  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isCreateSchoolOpen, setIsCreateSchoolOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCounty, setFilterCounty] = useState("all");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  const [newSchool, setNewSchool] = useState({
    name: "",
    code: "",
    county: "",
    subcounty: "",
    ward: "",
    type: "mixed" as "primary" | "secondary" | "mixed",
    adminName: "",
    adminEmail: "",
    adminPhone: "",
    establishedYear: new Date().getFullYear(),
  });

  // Update breadcrumbs based on current tab
  useEffect(() => {
    const baseBreadcrumb: BreadcrumbItem = {
      label: "Super Admin Portal",
      href: "/super-admin-dashboard",
    };

    switch (selectedTab) {
      case "overview":
        setBreadcrumbs([baseBreadcrumb, { label: "Overview" }]);
        break;
      case "schools":
        setBreadcrumbs([baseBreadcrumb, { label: "School Management" }]);
        break;
      case "analytics":
        setBreadcrumbs([baseBreadcrumb, { label: "Analytics & Reports" }]);
        break;
      case "infrastructure":
        setBreadcrumbs([baseBreadcrumb, { label: "Infrastructure" }]);
        break;
      case "settings":
        setBreadcrumbs([baseBreadcrumb, { label: "Platform Settings" }]);
        break;
      default:
        setBreadcrumbs([baseBreadcrumb]);
    }
  }, [selectedTab]);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // API data hooks
  const { logout } = useAuth();
  const {
    data: superAdminInfo,
    loading: adminInfoLoading,
    error: adminInfoError,
  } = useSuperAdminInfo();
  const {
    data: systemStats,
    loading: statsLoading,
    error: statsError,
  } = useSystemStats();
  const {
    data: schools,
    loading: schoolsLoading,
    error: schoolsError,
    refetch: refetchSchools,
  } = useSchools();
  const {
    data: systemAlerts,
    loading: alertsLoading,
    error: alertsError,
  } = useSystemAlerts();
  const {
    data: notifications,
    loading: notificationsLoading,
    error: notificationsError,
  } = useNotifications();

  // Fallback data handling
  const schoolsData = schools || [];
  const systemStatsData = systemStats || {
    totalSchools: 0,
    totalStudents: 0,
    totalTeachers: 0,
    avgPerformance: 0,
    systemUptime: 0,
    dataStorage: 0,
    activeUsers: 0,
    dailyLogins: 0,
  };
  const systemAlertsData = systemAlerts || [];
  const notificationsData = notifications || [];

  const handleLogout = () => {
    logout();
    navigate("/super-admin-login");
  };

  const handleCreateSchool = async () => {
    if (
      !newSchool.name ||
      !newSchool.code ||
      !newSchool.county ||
      !newSchool.subcounty
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (!newSchool.adminName || !newSchool.adminEmail) {
      alert("Please provide administrator details");
      return;
    }

    try {
      const response = await apiWithFallback.registerSchool({
        name: newSchool.name,
        code: newSchool.code,
        county: newSchool.county,
        subcounty: newSchool.subcounty,
        ward: newSchool.ward || "Central",
        type: newSchool.type,
        adminName: newSchool.adminName,
        adminEmail: newSchool.adminEmail,
        adminPhone: newSchool.adminPhone,
        establishedYear: newSchool.establishedYear,
      });

      if (response.success) {
        const { school, adminCredentials } = response.data;

        alert(
          `School registered successfully!\n\n` +
            `School ID: ${school.id}\n` +
            `School Code: ${school.code}\n\n` +
            `Administrator Login Credentials:\n` +
            `Login ID: ${adminCredentials.loginId}\n` +
            `Temporary Password: ${adminCredentials.password}\n\n` +
            `The administrator must change their password on first login.\n` +
            `School status: Pending Approval`,
        );

        // Reset form
        setNewSchool({
          name: "",
          code: "",
          county: "",
          subcounty: "",
          ward: "",
          type: "mixed",
          adminName: "",
          adminEmail: "",
          adminPhone: "",
          establishedYear: new Date().getFullYear(),
        });

        // Refresh schools list
        refetchSchools();
        setIsCreateSchoolOpen(false);
      } else {
        alert(`Registration failed: ${response.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("School registration error:", error);
      alert("Network error occurred. Please try again.");
    }
  };

  const handleRemoveSchool = (schoolId: string, schoolName: string) => {
    if (
      window.confirm(
        `Are you sure you want to remove ${schoolName}?\n\n` +
          `This action will:\n` +
          `• Permanently delete all school data\n` +
          `• Remove access for all students and teachers\n` +
          `• Cannot be undone\n\n` +
          `Type "DELETE" to confirm this action.`,
      )
    ) {
      const userInput = prompt(
        `Please type "DELETE" to confirm removal of ${schoolName}:`,
      );
      if (userInput === "DELETE") {
        console.log(`Removing school: ${schoolId} - ${schoolName}`);
        alert(
          `${schoolName} has been successfully removed from the AnansiAI platform.`,
        );
      } else {
        alert("School removal cancelled - verification failed.");
      }
    }
  };

  const handleViewSchool = (schoolId: string) => {
    navigate(`/super-admin/schools/${schoolId}/details`);
  };

  const handleEditSchool = (schoolId: string) => {
    navigate(`/super-admin/schools/${schoolId}/edit`);
  };

  const handleSchoolSettings = (schoolId: string) => {
    navigate(`/super-admin/schools/${schoolId}/settings`);
  };

  const handleExportReport = () => {
    console.log("Exporting comprehensive schools report...");
    alert(
      "Schools analytics report exported successfully! Check your downloads folder.",
    );
  };

  const handleScheduleReports = () => {
    navigate("/super-admin/reports/schedule");
  };

  const handleSystemStatus = () => {
    navigate("/super-admin/system/status");
  };

  const handleManageInfrastructure = () => {
    navigate("/super-admin/infrastructure");
  };

  const handleSecurityCenter = () => {
    navigate("/super-admin/security");
  };

  const handleAdvancedSettings = () => {
    navigate("/super-admin/settings");
  };

  const handleCopyCredentials = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const filteredSchools = schoolsData.filter((school) => {
    const matchesSearch =
      school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.county.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.adminName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || school.status === filterStatus;
    const matchesCounty =
      filterCounty === "all" || school.county === filterCounty;

    return matchesSearch && matchesStatus && matchesCounty;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-accent-100 text-accent-700";
      case "maintenance":
        return "bg-warning-100 text-warning-700";
      case "inactive":
        return "bg-secondary-100 text-secondary-700";
      case "pending":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-secondary-100 text-secondary-700";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "primary":
        return "bg-primary-100 text-primary-700";
      case "secondary":
        return "bg-accent-100 text-accent-700";
      case "mixed":
        return "bg-warning-100 text-warning-700";
      default:
        return "bg-secondary-100 text-secondary-700";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertCircle className="w-4 h-4 text-destructive-600" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-warning-600" />;
      case "info":
        return <Info className="w-4 h-4 text-blue-600" />;
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
      case "system":
        return <Settings className="w-4 h-4 text-destructive-600" />;
      case "school":
        return <School className="w-4 h-4 text-primary-600" />;
      case "performance":
        return <TrendingUp className="w-4 h-4 text-accent-600" />;
      case "security":
        return <Shield className="w-4 h-4 text-warning-600" />;
      case "maintenance":
        return <Monitor className="w-4 h-4 text-blue-600" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const unreadNotifications = notificationsData.filter((n) => !n.read).length;
  const criticalAlerts = systemAlerts.filter(
    (alert) => alert.type === "critical",
  ).length;
  const availableSubcounties = newSchool.county
    ? kenyanCountiesData[newSchool.county] || []
    : [];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
        {/* Enhanced Header */}
        <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <img
                  src="https://cdn.builder.io/api/v1/assets/2d09da496e544a1eab05e596d02031d8/twinternet-logo-b18833?format=webp&width=800"
                  alt="AnansiAI Logo"
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <h1 className="font-bold text-xl text-secondary-800">
                    AnansiAI
                  </h1>
                  <p className="text-xs text-secondary-500">
                    Super Admin Portal
                  </p>
                </div>

                {/* Breadcrumb Navigation */}
                <div className="hidden md:flex items-center gap-2 ml-4">
                  <Navigation className="w-4 h-4 text-secondary-400" />
                  {breadcrumbs.map((crumb, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {index > 0 && (
                        <span className="text-secondary-400">/</span>
                      )}
                      {crumb.href ? (
                        <button
                          onClick={() => navigate(crumb.href!)}
                          className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
                        >
                          {crumb.label}
                        </button>
                      ) : (
                        <span className="text-sm text-secondary-600">
                          {crumb.label}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* System Status Indicator */}
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-2 px-3 py-1 bg-accent-50 rounded-full">
                      <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-accent-700">
                        System Online
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Platform Status: All systems operational</p>
                    <p>Uptime: {systemStatsData.systemUptime}%</p>
                  </TooltipContent>
                </Tooltip>

                {/* Real-time Clock */}
                <div className="hidden sm:block text-xs text-secondary-600">
                  <div>{currentTime.toLocaleDateString()}</div>
                  <div className="font-mono">
                    {currentTime.toLocaleTimeString()}
                  </div>
                </div>

                {/* Enhanced Notifications */}
                <Dialog
                  open={isNotificationOpen}
                  onOpenChange={setIsNotificationOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="w-5 h-5" />
                      {unreadNotifications > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive-500 text-white text-xs rounded-full flex items-center justify-center animate-bounce">
                          {unreadNotifications}
                        </span>
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        System Notifications
                      </DialogTitle>
                      <DialogDescription>
                        {unreadNotifications > 0
                          ? `${unreadNotifications} unread notifications requiring attention`
                          : "All notifications reviewed"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 rounded-lg border transition-all duration-200 ${
                            notification.read
                              ? "bg-secondary-50 border-secondary-200"
                              : "bg-blue-50 border-blue-200 shadow-sm"
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
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-secondary-500">
                                  {notification.time}
                                </p>
                                {!notification.read && (
                                  <Badge className="bg-blue-100 text-blue-700">
                                    New
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Enhanced User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={superAdminInfo.avatar} />
                        <AvatarFallback className="bg-primary-100 text-primary-700">
                          {superAdminInfo.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden sm:block text-left">
                        <p className="text-sm font-medium text-secondary-800">
                          {superAdminInfo.name}
                        </p>
                        <p className="text-xs text-secondary-500">
                          {superAdminInfo.role}
                        </p>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary-100 text-primary-700">
                            {superAdminInfo.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{superAdminInfo.name}</p>
                          <p className="text-xs text-secondary-500">
                            {superAdminInfo.id}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleAdvancedSettings}>
                      <Settings className="w-4 h-4 mr-2" />
                      System Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSecurityCenter}>
                      <Shield className="w-4 h-4 mr-2" />
                      Security Center
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleManageInfrastructure}>
                      <Database className="w-4 h-4 mr-2" />
                      Infrastructure
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <History className="w-4 h-4 mr-2" />
                      Activity Log
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-destructive-600"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Enhanced Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-secondary-800 mb-2">
                  Super Admin Command Center
                </h2>
                <p className="text-secondary-600 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Welcome back, {superAdminInfo.name} • {superAdminInfo.region}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-secondary-600">Last access</p>
                <p className="font-medium text-secondary-800">
                  {superAdminInfo.lastLogin}
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
              <TabsTrigger value="schools" className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                Schools
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="infrastructure"
                className="flex items-center gap-2"
              >
                <Database className="w-4 h-4" />
                Infrastructure
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Enhanced National Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="card-elevated hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-secondary-600">
                          Total Schools
                        </p>
                        <p className="text-2xl font-bold text-secondary-800">
                          {systemStatsData.totalSchools.toLocaleString()}
                        </p>
                        <p className="text-xs text-accent-600 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          +8 this month
                        </p>
                      </div>
                      <div className="p-3 bg-primary-100 rounded-lg">
                        <Building className="w-6 h-6 text-primary-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-elevated hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-secondary-600">
                          National Students
                        </p>
                        <p className="text-2xl font-bold text-secondary-800">
                          {systemStatsData.totalStudents.toLocaleString()}
                        </p>
                        <p className="text-xs text-accent-600 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          +2.3% growth
                        </p>
                      </div>
                      <div className="p-3 bg-accent-100 rounded-lg">
                        <GraduationCap className="w-6 h-6 text-accent-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-elevated hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-secondary-600">
                          Total Teachers
                        </p>
                        <p className="text-2xl font-bold text-secondary-800">
                          {systemStats.totalTeachers.toLocaleString()}
                        </p>
                        <p className="text-xs text-accent-600 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          1:17.5 ratio
                        </p>
                      </div>
                      <div className="p-3 bg-warning-100 rounded-lg">
                        <Users className="w-6 h-6 text-warning-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-elevated hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-secondary-600">
                          System Uptime
                        </p>
                        <p className="text-2xl font-bold text-secondary-800">
                          {systemStats.systemUptime}%
                        </p>
                        <p className="text-xs text-accent-600 flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          Excellent status
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
                {/* Enhanced Critical System Alerts */}
                <div className="lg:col-span-2">
                  <Card className="card-elevated">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-destructive-600" />
                            National System Alerts
                            {criticalAlerts > 0 && (
                              <Badge className="bg-destructive-100 text-destructive-700 ml-2 animate-pulse">
                                {criticalAlerts} Critical
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription>
                            Platform-wide alerts requiring immediate attention
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSystemStatus}
                              >
                                <Monitor className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>System Status</TooltipContent>
                          </Tooltip>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View All
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {systemAlerts.map((alert) => (
                        <div
                          key={alert.id}
                          className="p-4 bg-secondary-50 rounded-lg border border-secondary-100 hover:shadow-sm transition-all duration-200"
                        >
                          <div className="flex items-start gap-3">
                            {getAlertIcon(alert.type)}
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-medium text-secondary-800">
                                    {alert.title}
                                  </h4>
                                  {alert.school && (
                                    <p className="text-xs text-blue-600 mt-1">
                                      {alert.school}
                                    </p>
                                  )}
                                </div>
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
                                    <Eye className="w-4 h-4 mr-1" />
                                    Investigate
                                  </Button>
                                  {alert.actionRequired && (
                                    <Button size="sm" className="btn-primary">
                                      <RefreshCw className="w-4 h-4 mr-1" />
                                      Resolve
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

                {/* Enhanced Quick Actions */}
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common super admin tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Dialog
                      open={isCreateSchoolOpen}
                      onOpenChange={setIsCreateSchoolOpen}
                    >
                      <DialogTrigger asChild>
                        <Button className="btn-primary w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          Register School
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Register a New School</DialogTitle>
                          <DialogDescription>
                            Add a new educational institution to the AnansiAI
                            platform
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                          {/* School Information */}
                          <div className="space-y-4">
                            <h4 className="font-medium text-secondary-800">
                              School Information
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="schoolName">
                                  School Name *
                                </Label>
                                <Input
                                  id="schoolName"
                                  value={newSchool.name}
                                  onChange={(e) =>
                                    setNewSchool({
                                      ...newSchool,
                                      name: e.target.value,
                                    })
                                  }
                                  placeholder="Enter full school name"
                                />
                              </div>
                              <div>
                                <Label htmlFor="schoolCode">
                                  School Code *
                                </Label>
                                <Input
                                  id="schoolCode"
                                  value={newSchool.code}
                                  onChange={(e) =>
                                    setNewSchool({
                                      ...newSchool,
                                      code: e.target.value.toUpperCase(),
                                    })
                                  }
                                  placeholder="3-4 letter code (e.g., NAC)"
                                  maxLength={4}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="schoolType">School Type</Label>
                                <Select
                                  value={newSchool.type}
                                  onValueChange={(value) =>
                                    setNewSchool({
                                      ...newSchool,
                                      type: value as
                                        | "primary"
                                        | "secondary"
                                        | "mixed",
                                    })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="primary">
                                      Primary School
                                    </SelectItem>
                                    <SelectItem value="secondary">
                                      Secondary School
                                    </SelectItem>
                                    <SelectItem value="mixed">
                                      Mixed (Primary & Secondary)
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="establishedYear">
                                  Established Year
                                </Label>
                                <Input
                                  id="establishedYear"
                                  type="number"
                                  value={newSchool.establishedYear}
                                  onChange={(e) =>
                                    setNewSchool({
                                      ...newSchool,
                                      establishedYear: parseInt(e.target.value),
                                    })
                                  }
                                  min={1900}
                                  max={new Date().getFullYear()}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Location Information */}
                          <div className="space-y-4">
                            <h4 className="font-medium text-secondary-800">
                              Location Information
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="county">County *</Label>
                                <Select
                                  value={newSchool.county}
                                  onValueChange={(value) =>
                                    setNewSchool({
                                      ...newSchool,
                                      county: value,
                                      subcounty: "",
                                    })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select county" />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-60">
                                    {Object.keys(kenyanCountiesData).map(
                                      (county) => (
                                        <SelectItem key={county} value={county}>
                                          {county}
                                        </SelectItem>
                                      ),
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="subcounty">Sub-County *</Label>
                                <Select
                                  value={newSchool.subcounty}
                                  onValueChange={(value) =>
                                    setNewSchool({
                                      ...newSchool,
                                      subcounty: value,
                                    })
                                  }
                                  disabled={!newSchool.county}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select sub-county" />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-60">
                                    {availableSubcounties.map((subcounty) => (
                                      <SelectItem
                                        key={subcounty}
                                        value={subcounty}
                                      >
                                        {subcounty}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="ward">Ward</Label>
                              <Input
                                id="ward"
                                value={newSchool.ward}
                                onChange={(e) =>
                                  setNewSchool({
                                    ...newSchool,
                                    ward: e.target.value,
                                  })
                                }
                                placeholder="Enter ward name"
                              />
                            </div>
                          </div>

                          {/* Administrator Information */}
                          <div className="space-y-4">
                            <h4 className="font-medium text-secondary-800">
                              School Administrator
                            </h4>
                            <div>
                              <Label htmlFor="adminName">
                                Administrator Name *
                              </Label>
                              <Input
                                id="adminName"
                                value={newSchool.adminName}
                                onChange={(e) =>
                                  setNewSchool({
                                    ...newSchool,
                                    adminName: e.target.value,
                                  })
                                }
                                placeholder="Full name of school administrator"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="adminEmail">
                                  Email Address *
                                </Label>
                                <Input
                                  id="adminEmail"
                                  type="email"
                                  value={newSchool.adminEmail}
                                  onChange={(e) =>
                                    setNewSchool({
                                      ...newSchool,
                                      adminEmail: e.target.value,
                                    })
                                  }
                                  placeholder="admin@school.ac.ke"
                                />
                              </div>
                              <div>
                                <Label htmlFor="adminPhone">Phone Number</Label>
                                <Input
                                  id="adminPhone"
                                  value={newSchool.adminPhone}
                                  onChange={(e) =>
                                    setNewSchool({
                                      ...newSchool,
                                      adminPhone: e.target.value,
                                    })
                                  }
                                  placeholder="+254 700 000 000"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setIsCreateSchoolOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleCreateSchool}>
                            Register School
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={handleExportReport}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export Report
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Generate comprehensive schools report
                      </TooltipContent>
                    </Tooltip>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleSystemStatus}
                    >
                      <Monitor className="w-4 h-4 mr-2" />
                      System Status
                    </Button>

                    <Button variant="outline" className="w-full">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Sync
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleManageInfrastructure}
                    >
                      <Database className="w-4 h-4 mr-2" />
                      Infrastructure
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Performance Overview */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle>National Performance Metrics</CardTitle>
                    <CardDescription>
                      Key performance indicators across all schools
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">
                          Average School Performance
                        </span>
                        <span className="font-bold">
                          {systemStats.avgPerformance}%
                        </span>
                      </div>
                      <Progress
                        value={systemStats.avgPerformance}
                        className="h-3"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">System Utilization</span>
                        <span className="font-bold">
                          {systemStats.dataStorage}%
                        </span>
                      </div>
                      <Progress
                        value={systemStats.dataStorage}
                        className="h-3"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center p-4 bg-primary-50 rounded-lg">
                        <div className="text-2xl font-bold text-primary-600">
                          {systemStats.activeUsers.toLocaleString()}
                        </div>
                        <p className="text-xs text-secondary-600">
                          Active Users Today
                        </p>
                      </div>
                      <div className="text-center p-4 bg-accent-50 rounded-lg">
                        <div className="text-2xl font-bold text-accent-600">
                          {systemStats.dailyLogins.toLocaleString()}
                        </div>
                        <p className="text-xs text-secondary-600">
                          Daily Logins
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle>Regional Distribution</CardTitle>
                    <CardDescription>
                      School distribution across Kenya
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Central Region
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-secondary-200 rounded">
                            <div className="w-16 h-2 bg-primary-500 rounded"></div>
                          </div>
                          <span className="text-xs">85 schools</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Western Region
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-secondary-200 rounded">
                            <div className="w-14 h-2 bg-accent-500 rounded"></div>
                          </div>
                          <span className="text-xs">67 schools</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Coast Region
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-secondary-200 rounded">
                            <div className="w-12 h-2 bg-warning-500 rounded"></div>
                          </div>
                          <span className="text-xs">52 schools</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Northern Region
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-secondary-200 rounded">
                            <div className="w-8 h-2 bg-blue-500 rounded"></div>
                          </div>
                          <span className="text-xs">43 schools</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-secondary-200">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-secondary-800 mb-1">
                          {schoolsData.length}
                        </div>
                        <p className="text-sm text-secondary-600">
                          Total Active Schools
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="schools" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-secondary-800">
                    School Management
                  </h3>
                  <p className="text-sm text-secondary-600">
                    {filteredSchools.length} of {schoolsData.length} schools •
                    National education platform
                  </p>
                </div>
                <Button
                  className="btn-primary"
                  onClick={() => setIsCreateSchoolOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Register School
                </Button>
              </div>

              {/* Enhanced Search and Filters */}
              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
                        <Input
                          placeholder="Search schools by name, code, county, or administrator..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
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
                          <SelectItem value="maintenance">
                            Maintenance
                          </SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Select
                        value={filterCounty}
                        onValueChange={setFilterCounty}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by county" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          <SelectItem value="all">All Counties</SelectItem>
                          {Object.keys(kenyanCountiesData).map((county) => (
                            <SelectItem key={county} value={county}>
                              {county}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Schools Table */}
              <Card className="card-elevated">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>School</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Teachers</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Administrator</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSchools.map((school) => (
                      <TableRow
                        key={school.id}
                        className="hover:bg-secondary-50"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary-100 rounded-lg">
                              <Building className="w-4 h-4 text-primary-600" />
                            </div>
                            <div>
                              <p className="font-medium text-secondary-800">
                                {school.name}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-secondary-500">
                                <Badge className={getTypeColor(school.type)}>
                                  {school.type}
                                </Badge>
                                <span>• {school.code}</span>
                                <span>• Est. {school.establishedYear}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm font-medium">
                              <MapPin className="w-3 h-3" />
                              {school.county}
                            </div>
                            <p className="text-xs text-secondary-500">
                              {school.subcounty} • {school.ward}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <p className="text-sm font-medium">
                              {school.students.toLocaleString()}
                            </p>
                            <p className="text-xs text-secondary-500">
                              enrolled
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <p className="text-sm font-medium">
                              {school.teachers}
                            </p>
                            <p className="text-xs text-secondary-500">
                              faculty
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {school.performance > 0 ? (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {school.performance}%
                              </span>
                              <div className="w-16 h-2 bg-secondary-200 rounded">
                                <div
                                  className="h-full bg-accent-500 rounded"
                                  style={{ width: `${school.performance}%` }}
                                ></div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-secondary-500">
                              Not available
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge className={getStatusColor(school.status)}>
                              {school.status}
                            </Badge>
                            <p className="text-xs text-secondary-500">
                              Sync: {school.lastSync}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              {school.adminName}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-secondary-500">
                              <Mail className="w-3 h-3" />
                              {school.adminEmail}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewSchool(school.id)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View Details</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditSchool(school.id)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit School</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleSchoolSettings(school.id)
                                  }
                                >
                                  <Settings className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Settings</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive-600 hover:text-destructive-700 hover:bg-destructive-50"
                                  onClick={() =>
                                    handleRemoveSchool(school.id, school.name)
                                  }
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Remove School</TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-secondary-800">
                    Schools Analytics
                  </h3>
                  <p className="text-sm text-secondary-600">
                    Comprehensive insights across all educational institutions
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
                {/* Performance by School */}
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle>Top Performing Schools</CardTitle>
                    <CardDescription>
                      Academic performance leaders nationwide
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {schools
                        .filter((school) => school.performance > 0)
                        .sort((a, b) => b.performance - a.performance)
                        .slice(0, 6)
                        .map((school, index) => (
                          <div
                            key={school.id}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary-50 transition-colors"
                          >
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100">
                              <span className="text-sm font-bold text-primary-600">
                                {index + 1}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-secondary-800">
                                  {school.name}
                                </span>
                                <span className="text-sm text-secondary-600">
                                  {school.performance}%
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-full bg-secondary-200 rounded-full h-2">
                                  <div
                                    className="bg-accent-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${school.performance}%` }}
                                  ></div>
                                </div>
                                <Badge className="text-xs">
                                  {school.county}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                {/* National Trends */}
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle>National Education Trends</CardTitle>
                    <CardDescription>
                      Key metrics and growth indicators
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-accent-600 mb-1">
                          +18.5%
                        </div>
                        <p className="text-sm text-secondary-600">
                          Average Performance Growth This Year
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-4 bg-primary-50 rounded-lg">
                          <div className="text-xl font-bold text-primary-600">
                            96.8%
                          </div>
                          <p className="text-xs text-secondary-600">
                            Student Engagement
                          </p>
                        </div>
                        <div className="text-center p-4 bg-warning-50 rounded-lg">
                          <div className="text-xl font-bold text-warning-600">
                            93.2%
                          </div>
                          <p className="text-xs text-secondary-600">
                            AI Effectiveness
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Teacher Satisfaction</span>
                          <span className="font-medium">94%</span>
                        </div>
                        <Progress value={94} className="h-2" />

                        <div className="flex justify-between text-sm">
                          <span>Platform Adoption</span>
                          <span className="font-medium">89%</span>
                        </div>
                        <Progress value={89} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Analytics */}
              <div className="grid lg:grid-cols-3 gap-6">
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle>Student Analytics</CardTitle>
                    <CardDescription>National student metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600 mb-1">
                        97.3%
                      </div>
                      <p className="text-sm text-secondary-600">
                        Average Attendance Rate
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Active Students</span>
                        <span className="text-sm font-medium">
                          {systemStats.totalStudents.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Avg. Study Hours/Day</span>
                        <span className="text-sm font-medium">5.2 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">AI Interactions/Day</span>
                        <span className="text-sm font-medium">2.8M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Assignments Completed</span>
                        <span className="text-sm font-medium">156.7K</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle>Teacher Analytics</CardTitle>
                    <CardDescription>
                      Faculty engagement metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-accent-600 mb-1">
                        {systemStats.totalTeachers.toLocaleString()}
                      </div>
                      <p className="text-sm text-secondary-600">
                        Active Teachers
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Courses Created</span>
                        <span className="text-sm font-medium">12.8K</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Avg. Classes/Week</span>
                        <span className="text-sm font-medium">18.5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Feedback Provided</span>
                        <span className="text-sm font-medium">89.2K</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Platform Usage</span>
                        <span className="text-sm font-medium">94.6%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle>Infrastructure Metrics</CardTitle>
                    <CardDescription>System performance data</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-warning-600 mb-1">
                        {systemStats.systemUptime}%
                      </div>
                      <p className="text-sm text-secondary-600">
                        System Uptime
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Data Centers</span>
                        <span className="text-sm font-medium">12 Active</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Avg. Response Time</span>
                        <span className="text-sm font-medium">0.8s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Daily API Calls</span>
                        <span className="text-sm font-medium">24.7M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Storage Used</span>
                        <span className="text-sm font-medium">
                          {systemStats.dataStorage}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="infrastructure" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-secondary-800">
                    Infrastructure Overview
                  </h3>
                  <p className="text-sm text-secondary-600">
                    National platform infrastructure monitoring and management
                  </p>
                </div>
                <Button onClick={handleManageInfrastructure}>
                  <Database className="w-4 h-4 mr-2" />
                  Manage Infrastructure
                </Button>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Enhanced System Health */}
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle>System Health Status</CardTitle>
                    <CardDescription>
                      Real-time infrastructure monitoring
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-accent-50 rounded-lg">
                        <CheckCircle className="w-8 h-8 text-accent-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-accent-600">
                          99.8%
                        </div>
                        <p className="text-xs text-secondary-600">Uptime</p>
                      </div>
                      <div className="text-center p-4 bg-primary-50 rounded-lg">
                        <Zap className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-primary-600">
                          0.8s
                        </div>
                        <p className="text-xs text-secondary-600">
                          Avg Response
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-accent-100 rounded-lg">
                            <Database className="w-4 h-4 text-accent-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              Database Clusters
                            </p>
                            <p className="text-xs text-secondary-600">
                              Primary and backup operational
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-accent-100 text-accent-700">
                          Healthy
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary-100 rounded-lg">
                            <Globe className="w-4 h-4 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">CDN Network</p>
                            <p className="text-xs text-secondary-600">
                              Global content delivery active
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-accent-100 text-accent-700">
                          Optimal
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-warning-100 rounded-lg">
                            <Brain className="w-4 h-4 text-warning-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">AI Processing</p>
                            <p className="text-xs text-secondary-600">
                              ML models responding normally
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-accent-100 text-accent-700">
                          Active
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Resource Utilization */}
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle>Resource Utilization</CardTitle>
                    <CardDescription>
                      National infrastructure resource consumption
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="flex items-center gap-2">
                          <Cpu className="w-4 h-4" />
                          CPU Usage
                        </span>
                        <span>67%</span>
                      </div>
                      <Progress value={67} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="flex items-center gap-2">
                          <MemoryStick className="w-4 h-4" />
                          Memory Usage
                        </span>
                        <span>74%</span>
                      </div>
                      <Progress value={74} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="flex items-center gap-2">
                          <HardDrive className="w-4 h-4" />
                          Storage
                        </span>
                        <span>{systemStats.dataStorage}%</span>
                      </div>
                      <Progress
                        value={systemStats.dataStorage}
                        className="h-2"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="flex items-center gap-2">
                          <Network className="w-4 h-4" />
                          Network
                        </span>
                        <span>45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>

                    <div className="pt-4 mt-4 border-t border-secondary-200">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-primary-600">
                            12
                          </div>
                          <p className="text-xs text-secondary-600">
                            Data Centers
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-accent-600">
                            847
                          </div>
                          <p className="text-xs text-secondary-600">Servers</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Infrastructure Management */}
              <div className="grid lg:grid-cols-3 gap-6">
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle>Data Centers</CardTitle>
                    <CardDescription>
                      Regional data center status
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Nairobi Primary</span>
                      <Badge className="bg-accent-100 text-accent-700">
                        Online
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mombasa Secondary</span>
                      <Badge className="bg-accent-100 text-accent-700">
                        Online
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Kisumu Backup</span>
                      <Badge className="bg-accent-100 text-accent-700">
                        Online
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Nakuru Edge</span>
                      <Badge className="bg-warning-100 text-warning-700">
                        Maintenance
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle>Security Status</CardTitle>
                    <CardDescription>
                      Infrastructure security monitoring
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Firewall Status</span>
                      <Badge className="bg-accent-100 text-accent-700">
                        Protected
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">DDoS Protection</span>
                      <Badge className="bg-accent-100 text-accent-700">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SSL Certificates</span>
                      <Badge className="bg-accent-100 text-accent-700">
                        Valid
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Intrusion Detection</span>
                      <Badge className="bg-accent-100 text-accent-700">
                        Monitoring
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle>Backup Systems</CardTitle>
                    <CardDescription>
                      Data backup and recovery status
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Daily Backups</span>
                      <Badge className="bg-accent-100 text-accent-700">
                        Complete
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Offsite Storage</span>
                      <Badge className="bg-accent-100 text-accent-700">
                        Synced
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Recovery Testing</span>
                      <Badge className="bg-accent-100 text-accent-700">
                        Passed
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Retention Policy</span>
                      <Badge className="bg-blue-100 text-blue-700">
                        7 Years
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-secondary-800">
                    Platform Settings
                  </h3>
                  <p className="text-sm text-secondary-600">
                    Configure national platform settings and policies
                  </p>
                </div>
                <Button onClick={handleAdvancedSettings}>
                  <Settings className="w-4 h-4 mr-2" />
                  Advanced Configuration
                </Button>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Global Policies */}
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle>Global Education Policies</CardTitle>
                    <CardDescription>
                      Platform-wide educational policies and standards
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
                      <div>
                        <p className="font-medium text-secondary-800">
                          National Curriculum Standards
                        </p>
                        <p className="text-sm text-secondary-600">
                          Kenya Certificate of Education compliance
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
                      <div>
                        <p className="font-medium text-secondary-800">
                          Assessment Guidelines
                        </p>
                        <p className="text-sm text-secondary-600">
                          Standardized evaluation criteria
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
                      <div>
                        <p className="font-medium text-secondary-800">
                          Student Privacy Protection
                        </p>
                        <p className="text-sm text-secondary-600">
                          Data protection and COPPA compliance
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Update
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
                      <div>
                        <p className="font-medium text-secondary-800">
                          AI Content Moderation
                        </p>
                        <p className="text-sm text-secondary-600">
                          Automated content filtering policies
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Technical Configuration */}
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle>Technical Configuration</CardTitle>
                    <CardDescription>
                      System-wide technical settings and parameters
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
                      <div>
                        <p className="font-medium text-secondary-800">
                          API Rate Limiting
                        </p>
                        <p className="text-sm text-secondary-600">
                          Request throttling and quota management
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Adjust
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
                      <div>
                        <p className="font-medium text-secondary-800">
                          Cache Configuration
                        </p>
                        <p className="text-sm text-secondary-600">
                          Content delivery optimization
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Optimize
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
                      <div>
                        <p className="font-medium text-secondary-800">
                          Database Scaling
                        </p>
                        <p className="text-sm text-secondary-600">
                          Auto-scaling parameters
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
                      <div>
                        <p className="font-medium text-secondary-800">
                          Backup Scheduling
                        </p>
                        <p className="text-sm text-secondary-600">
                          Automated backup frequency
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Schedule
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Integration Management */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Third-Party Integrations</CardTitle>
                  <CardDescription>
                    External service connections and API integrations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-secondary-800">
                        Educational Services
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                              <GraduationCap className="w-4 h-4 text-primary-600" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">
                                Kenya Institute of Education
                              </p>
                              <p className="text-xs text-secondary-600">
                                Curriculum alignment
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-accent-100 text-accent-700">
                            Connected
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center">
                              <BookOpen className="w-4 h-4 text-accent-600" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">
                                Kenya Library Service
                              </p>
                              <p className="text-xs text-secondary-600">
                                Digital resources
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-accent-100 text-accent-700">
                            Active
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                              <Award className="w-4 h-4 text-warning-600" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">
                                KNEC Assessment Portal
                              </p>
                              <p className="text-xs text-secondary-600">
                                Examination integration
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-warning-100 text-warning-700">
                            Pending
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-secondary-800">
                        Technology Partners
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Brain className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">OpenAI API</p>
                              <p className="text-xs text-secondary-600">
                                AI language processing
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-accent-100 text-accent-700">
                            Connected
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                              <Database className="w-4 h-4 text-primary-600" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">
                                AWS Infrastructure
                              </p>
                              <p className="text-xs text-secondary-600">
                                Cloud hosting services
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-accent-100 text-accent-700">
                            Active
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                              <Shield className="w-4 h-4 text-warning-600" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">
                                Cloudflare Security
                              </p>
                              <p className="text-xs text-secondary-600">
                                DDoS protection
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-accent-100 text-accent-700">
                            Protected
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </TooltipProvider>
  );
};

export default SuperAdminDashboard;
