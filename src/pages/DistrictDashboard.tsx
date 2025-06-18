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
  Upload,
  Search,
  Filter,
  Globe,
  Database,
  Zap,
  Calendar,
  FileText,
  Monitor,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface School {
  id: string;
  name: string;
  code: string;
  district: string;
  city: string;
  state: string;
  students: number;
  teachers: number;
  status: "active" | "maintenance" | "inactive";
  performance: number;
  aiAccuracy: number;
  lastSync: string;
}

interface DistrictStats {
  totalSchools: number;
  totalStudents: number;
  totalTeachers: number;
  avgPerformance: number;
  systemUptime: number;
  dataStorage: number;
}

const DistrictDashboard = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isCreateSchoolOpen, setIsCreateSchoolOpen] = useState(false);
  const [newSchool, setNewSchool] = useState({
    name: "",
    code: "",
    city: "",
    state: "",
    district: "Metro District",
  });

  // Mock data
  const superAdminInfo = {
    name: "Dr. Robert Martinez",
    id: "DIST-SUP-001",
    role: "District Superintendent",
    avatar: "",
  };

  const schools: School[] = [
    {
      id: "SCH001",
      name: "Lincoln High School",
      code: "LHS",
      district: "Metro District",
      city: "Springfield",
      state: "CA",
      students: 1250,
      teachers: 85,
      status: "active",
      performance: 78,
      aiAccuracy: 92,
      lastSync: "2 min ago",
    },
    {
      id: "SCH002",
      name: "Washington Elementary",
      code: "WES",
      district: "Metro District",
      city: "Springfield",
      state: "CA",
      students: 680,
      teachers: 45,
      status: "active",
      performance: 85,
      aiAccuracy: 94,
      lastSync: "5 min ago",
    },
    {
      id: "SCH003",
      name: "Roosevelt Middle School",
      code: "RMS",
      district: "Central District",
      city: "Riverside",
      state: "CA",
      students: 950,
      teachers: 62,
      status: "maintenance",
      performance: 72,
      aiAccuracy: 88,
      lastSync: "1 hour ago",
    },
    {
      id: "SCH004",
      name: "Kennedy High School",
      code: "KHS",
      district: "North District",
      city: "Oakland",
      state: "CA",
      students: 1480,
      teachers: 98,
      status: "active",
      performance: 81,
      aiAccuracy: 91,
      lastSync: "3 min ago",
    },
  ];

  const districtStats: DistrictStats = {
    totalSchools: schools.length,
    totalStudents: schools.reduce((sum, school) => sum + school.students, 0),
    totalTeachers: schools.reduce((sum, school) => sum + school.teachers, 0),
    avgPerformance: Math.round(
      schools.reduce((sum, school) => sum + school.performance, 0) /
        schools.length,
    ),
    systemUptime: 99.8,
    dataStorage: 78.5,
  };

  const alerts = [
    {
      id: "1",
      type: "warning",
      school: "Roosevelt Middle School",
      message: "System maintenance required - AI accuracy below threshold",
      time: "30 min ago",
    },
    {
      id: "2",
      type: "success",
      school: "Washington Elementary",
      message: "Performance improvement of 12% this month",
      time: "2 hours ago",
    },
    {
      id: "3",
      type: "info",
      school: "Kennedy High School",
      message: "New teacher onboarding completed successfully",
      time: "1 day ago",
    },
  ];

  const handleLogout = () => {
    navigate("/login");
  };

  const handleCreateSchool = () => {
    const newSchoolData = {
      ...newSchool,
      id: `SCH${String(schools.length + 1).padStart(3, "0")}`,
      students: 0,
      teachers: 0,
      status: "active" as const,
      performance: 0,
      aiAccuracy: 90,
      lastSync: "Just now",
    };

    console.log("Creating school:", newSchoolData);
    // In a real app, this would make an API call to create the school

    setIsCreateSchoolOpen(false);
    setNewSchool({
      name: "",
      code: "",
      city: "",
      state: "",
      district: "Metro District",
    });

    // Show success message
    alert(
      `${newSchool.name} has been successfully added to your AnansiAI platform!`,
    );
  };

  const handleRemoveSchool = (schoolId: string, schoolName: string) => {
    if (
      window.confirm(
        `Are you sure you want to remove ${schoolName}? This action cannot be undone and will affect all students and teachers in this school.`,
      )
    ) {
      console.log(`Removing school: ${schoolId} - ${schoolName}`);
      // In a real app, this would make an API call to remove the school
      // For now, we'll just log it
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-accent-100 text-accent-700";
      case "maintenance":
        return "bg-warning-100 text-warning-700";
      case "inactive":
        return "bg-destructive-100 text-destructive-700";
      default:
        return "bg-secondary-100 text-secondary-700";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-warning-600" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-accent-600" />;
      case "info":
        return <Brain className="w-4 h-4 text-primary-600" />;
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
                <p className="text-xs text-secondary-500">District Portal</p>
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
                        {superAdminInfo.id}
                      </p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>District Admin</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    System Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Shield className="w-4 h-4 mr-2" />
                    Security Center
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
            District Command Center
          </h2>
          <p className="text-secondary-600">
            Manage schools, monitor district-wide performance, and oversee
            system operations
          </p>
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
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              System
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* District Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-secondary-600">
                        Total Schools
                      </p>
                      <p className="text-2xl font-bold text-secondary-800">
                        {districtStats.totalSchools}
                      </p>
                    </div>
                    <div className="p-3 bg-primary-100 rounded-lg">
                      <Building className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-secondary-600">
                        District Students
                      </p>
                      <p className="text-2xl font-bold text-secondary-800">
                        {districtStats.totalStudents.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-accent-100 rounded-lg">
                      <GraduationCap className="w-6 h-6 text-accent-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-secondary-600">
                        District Teachers
                      </p>
                      <p className="text-2xl font-bold text-secondary-800">
                        {districtStats.totalTeachers}
                      </p>
                    </div>
                    <div className="p-3 bg-warning-100 rounded-lg">
                      <Users className="w-6 h-6 text-warning-600" />
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
                        {districtStats.avgPerformance}%
                      </p>
                    </div>
                    <div className="p-3 bg-secondary-100 rounded-lg">
                      <Award className="w-6 h-6 text-secondary-600" />
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
                        {districtStats.systemUptime}%
                      </p>
                    </div>
                    <div className="p-3 bg-accent-100 rounded-lg">
                      <Zap className="w-6 h-6 text-accent-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-secondary-600">Data Storage</p>
                      <p className="text-2xl font-bold text-secondary-800">
                        {districtStats.dataStorage}%
                      </p>
                    </div>
                    <div className="p-3 bg-primary-100 rounded-lg">
                      <Database className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* District Alerts */}
              <div className="lg:col-span-2">
                <Card className="card-elevated">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Bell className="w-5 h-5 text-primary-600" />
                          District Alerts
                        </CardTitle>
                        <CardDescription>
                          Important notifications from across all schools
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="p-4 bg-secondary-50 rounded-lg border border-secondary-100"
                      >
                        <div className="flex items-start gap-3">
                          {getAlertIcon(alert.type)}
                          <div className="flex-1">
                            <h4 className="font-medium text-secondary-800">
                              {alert.school}
                            </h4>
                            <p className="text-sm text-secondary-600 mt-1">
                              {alert.message}
                            </p>
                            <p className="text-xs text-secondary-500 mt-2">
                              {alert.time}
                            </p>
                          </div>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
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
                </CardHeader>
                <CardContent className="space-y-3">
                  <Dialog
                    open={isCreateSchoolOpen}
                    onOpenChange={setIsCreateSchoolOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="btn-primary w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Add School
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New School</DialogTitle>
                        <DialogDescription>
                          Register a new school in the district
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="schoolName">School Name</Label>
                          <Input
                            id="schoolName"
                            value={newSchool.name}
                            onChange={(e) =>
                              setNewSchool({
                                ...newSchool,
                                name: e.target.value,
                              })
                            }
                            placeholder="Enter school name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="schoolCode">School Code</Label>
                          <Input
                            id="schoolCode"
                            value={newSchool.code}
                            onChange={(e) =>
                              setNewSchool({
                                ...newSchool,
                                code: e.target.value,
                              })
                            }
                            placeholder="3-letter code (e.g., LHS)"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              value={newSchool.city}
                              onChange={(e) =>
                                setNewSchool({
                                  ...newSchool,
                                  city: e.target.value,
                                })
                              }
                              placeholder="City"
                            />
                          </div>
                          <div>
                            <Label htmlFor="state">State</Label>
                            <Input
                              id="state"
                              value={newSchool.state}
                              onChange={(e) =>
                                setNewSchool({
                                  ...newSchool,
                                  state: e.target.value,
                                })
                              }
                              placeholder="State"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="district">District</Label>
                          <Select
                            value={newSchool.district}
                            onValueChange={(value) =>
                              setNewSchool({ ...newSchool, district: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Metro District">
                                Metro District
                              </SelectItem>
                              <SelectItem value="Central District">
                                Central District
                              </SelectItem>
                              <SelectItem value="North District">
                                North District
                              </SelectItem>
                              <SelectItem value="East District">
                                East District
                              </SelectItem>
                            </SelectContent>
                          </Select>
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
                          Create School
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    District Report
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Monitor className="w-4 h-4 mr-2" />
                    System Status
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Sync
                  </Button>
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
                  {schools.length} schools using your AnansiAI platform
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
                <Button
                  className="btn-primary"
                  size="sm"
                  onClick={() => setIsCreateSchoolOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add School
                </Button>
              </div>
            </div>

            <Card className="card-elevated">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>School</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Teachers</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>AI Accuracy</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schools.map((school) => (
                    <TableRow key={school.id}>
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
                              <MapPin className="w-3 h-3" />
                              <span>
                                {school.city}, {school.state} • {school.code}
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {school.students.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {school.teachers}
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">
                          {school.aiAccuracy}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(school.status)}>
                          {school.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Edit School">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="School Settings"
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive-600 hover:text-destructive-700 hover:bg-destructive-50"
                            title="Remove School"
                            onClick={() =>
                              handleRemoveSchool(school.id, school.name)
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

          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-secondary-800">
                District Analytics
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
                  <CardTitle>Performance by School</CardTitle>
                  <CardDescription>
                    Academic performance comparison across schools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {schools
                      .sort((a, b) => b.performance - a.performance)
                      .map((school) => (
                        <div key={school.id}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-secondary-800">
                              {school.name}
                            </span>
                            <span className="text-sm text-secondary-600">
                              {school.performance}%
                            </span>
                          </div>
                          <div className="w-full bg-secondary-200 rounded-full h-2">
                            <div
                              className="bg-accent-500 h-2 rounded-full"
                              style={{ width: `${school.performance}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>District Trends</CardTitle>
                  <CardDescription>
                    Key metrics and growth indicators
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-accent-600 mb-1">
                        +15.2%
                      </div>
                      <p className="text-sm text-secondary-600">
                        Performance Growth This Year
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-4 bg-primary-50 rounded-lg">
                        <div className="text-xl font-bold text-primary-600">
                          94.2%
                        </div>
                        <p className="text-xs text-secondary-600">
                          Student Engagement
                        </p>
                      </div>
                      <div className="p-4 bg-warning-50 rounded-lg">
                        <div className="text-xl font-bold text-warning-600">
                          91.5%
                        </div>
                        <p className="text-xs text-secondary-600">
                          AI Effectiveness
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-secondary-800">
                System Overview
              </h3>
              <Button variant="outline">
                <Monitor className="w-4 h-4 mr-2" />
                Full System Status
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Infrastructure Status</CardTitle>
                  <CardDescription>
                    Real-time system health monitoring
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-secondary-800">
                        API Services
                      </p>
                      <p className="text-sm text-secondary-600">
                        All endpoints operational
                      </p>
                    </div>
                    <Badge className="bg-accent-100 text-accent-700">
                      Healthy
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-secondary-800">
                        Database Cluster
                      </p>
                      <p className="text-sm text-secondary-600">
                        Primary and backup operational
                      </p>
                    </div>
                    <Badge className="bg-accent-100 text-accent-700">
                      Online
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-secondary-800">
                        AI Processing
                      </p>
                      <p className="text-sm text-secondary-600">
                        ML models responding normally
                      </p>
                    </div>
                    <Badge className="bg-accent-100 text-accent-700">
                      Active
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-secondary-800">
                        Data Sync
                      </p>
                      <p className="text-sm text-secondary-600">
                        School synchronization complete
                      </p>
                    </div>
                    <Badge className="bg-accent-100 text-accent-700">
                      Synced
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Resource Utilization</CardTitle>
                  <CardDescription>
                    System resource consumption and capacity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>CPU Usage</span>
                      <span>42%</span>
                    </div>
                    <div className="w-full bg-secondary-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: "42%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Memory Usage</span>
                      <span>67%</span>
                    </div>
                    <div className="w-full bg-secondary-200 rounded-full h-2">
                      <div
                        className="bg-warning-500 h-2 rounded-full"
                        style={{ width: "67%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Storage</span>
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
                      <span>Network</span>
                      <span>23%</span>
                    </div>
                    <div className="w-full bg-secondary-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: "23%" }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-secondary-800">
                District Settings
              </h3>
              <Button>
                <Settings className="w-4 h-4 mr-2" />
                Advanced Configuration
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Global Policies</CardTitle>
                  <CardDescription>
                    District-wide configuration and policies
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-secondary-800">
                        Data Retention
                      </p>
                      <p className="text-sm text-secondary-600">
                        Student data storage period
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-secondary-800">
                        AI Model Updates
                      </p>
                      <p className="text-sm text-secondary-600">
                        Automatic ML model deployment
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-secondary-800">
                        Privacy Controls
                      </p>
                      <p className="text-sm text-secondary-600">
                        Data collection and sharing policies
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Update
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Integration Settings</CardTitle>
                  <CardDescription>
                    Third-party services and integrations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-secondary-800">
                        Student Information System
                      </p>
                      <p className="text-sm text-secondary-600">
                        SIS data synchronization
                      </p>
                    </div>
                    <Badge className="bg-accent-100 text-accent-700">
                      Connected
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-secondary-800">
                        Learning Management System
                      </p>
                      <p className="text-sm text-secondary-600">
                        LMS integration status
                      </p>
                    </div>
                    <Badge className="bg-accent-100 text-accent-700">
                      Active
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-secondary-800">
                        Parent Portal
                      </p>
                      <p className="text-sm text-secondary-600">
                        Parent communication platform
                      </p>
                    </div>
                    <Badge className="bg-warning-100 text-warning-700">
                      Pending
                    </Badge>
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

export default DistrictDashboard;
