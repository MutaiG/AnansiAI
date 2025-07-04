import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "@/services/axiosClient";
import usePageTitle from "@/hooks/usePageTitle";
import SchoolRegistration from "@/components/SchoolRegistration";
import DevelopmentBanner from "@/components/DevelopmentBanner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  School,
  Users,
  GraduationCap,
  MapPin,
  Plus,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

interface MessageModal {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
}

interface Institution {
  institutionId?: number;
  id?: number;
  name: string;
  address: string;
  createdDate?: string;
  modifiedDate?: string;
  isDeleted?: boolean;
}

interface SystemStats {
  totalSchools: number;
  totalStudents: number;
  totalTeachers: number;
  totalSubjects: number;
  avgPerformance: number;
  systemUptime: number;
  dataStorage: number;
  activeUsers: number;
  dailyLogins: number;
  lastUpdated: string;
}

const SuperAdminDashboard = () => {
  usePageTitle("Super Admin Dashboard - AnansiAI");
  const navigate = useNavigate();

  // State management
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats>({
    totalSchools: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalSubjects: 0,
    avgPerformance: 0,
    systemUptime: 0,
    dataStorage: 0,
    activeUsers: 0,
    dailyLogins: 0,
    lastUpdated: new Date().toISOString(),
  });
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [institutionsLoading, setInstitutionsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [institutionsError, setInstitutionsError] = useState<string | null>(
    null,
  );
  const [messageModal, setMessageModal] = useState<MessageModal | null>(null);
  const [isSchoolRegistrationOpen, setIsSchoolRegistrationOpen] =
    useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Show message helper
  const showMessage = (message: MessageModal) => {
    setMessageModal(message);
    setTimeout(() => setMessageModal(null), 5000);
  };

  // Fetch institutions from API
  const fetchInstitutions = async () => {
    try {
      setInstitutionsLoading(true);
      setInstitutionsError(null);
      console.log("📚 Fetching institutions from API...");

      const response = await axiosClient
        .get("/api/Institutions")
        .catch(() => ({ data: [] }));
      console.log("✅ Institutions response:", response.data);

      if (Array.isArray(response.data)) {
        setInstitutions(response.data);
        showMessage({
          id: Date.now().toString(),
          type: "success",
          title: "Success",
          message: `✅ Loaded ${response.data.length} institutions from API`,
        });
      } else {
        setInstitutions([]);
      }
    } catch (error: any) {
      console.error("❌ Error fetching institutions:", error);
      setInstitutionsError(`Failed to fetch institutions: ${error.message}`);
      setInstitutions([]);
      showMessage({
        id: Date.now().toString(),
        type: "error",
        title: "API Error",
        message: `❌ Cannot connect to API: ${error.message}`,
      });
    } finally {
      setInstitutionsLoading(false);
    }
  };

  // Fetch subjects from API
  const fetchSubjects = async () => {
    try {
      console.log("📖 Fetching subjects from API...");
      const response = await axiosClient.get("/api/subjects");
      console.log("✅ Subjects response:", response.data);

      if (Array.isArray(response.data)) {
        setSubjects(response.data);
        return response.data.length;
      }
      return 0;
    } catch (error: any) {
      console.error("❌ Error fetching subjects:", error);
      return 0;
    }
  };

  // Calculate system stats
  const calculateSystemStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get institutions count
      const institutionsCount = institutions.length;

      // Get subjects count
      const subjectsCount = await fetchSubjects();

      // Calculate stats from available data
      const calculatedStats: SystemStats = {
        totalSchools: institutionsCount,
        totalStudents: 0, // Would need student endpoint
        totalTeachers: 0, // Would need teacher endpoint
        totalSubjects: subjectsCount,
        avgPerformance: 0, // Would need performance data
        systemUptime: 99.9, // Default value
        dataStorage: 0, // Would need system metrics
        activeUsers: 0, // Would need user activity data
        dailyLogins: 0, // Would need login metrics
        lastUpdated: new Date().toISOString(),
      };

      setSystemStats(calculatedStats);
      console.log("📊 System stats calculated:", calculatedStats);
    } catch (error: any) {
      console.error("❌ Error calculating system stats:", error);
      setError(`Failed to calculate system stats: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchInstitutions();
  }, []);

  // Calculate stats when institutions change
  useEffect(() => {
    if (!institutionsLoading) {
      calculateSystemStats();
    }
  }, [institutions, institutionsLoading]);

  // Handle school registration success
  const handleSchoolRegistrationSuccess = () => {
    setIsSchoolRegistrationOpen(false);
    fetchInstitutions(); // Refresh the institutions list
    showMessage({
      id: Date.now().toString(),
      type: "success",
      title: "Success",
      message: "🎉 School registered successfully!",
    });
  };

  // Filter institutions based on search
  const filteredInstitutions = institutions.filter((institution) =>
    institution.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Get status badge color
  const getStatusColor = (isDeleted?: boolean) => {
    return isDeleted
      ? "bg-red-100 text-red-800"
      : "bg-green-100 text-green-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <DevelopmentBanner />

      {/* Message Modal */}
      {messageModal && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <Alert
            className={`border-l-4 ${
              messageModal.type === "success"
                ? "border-l-green-500 bg-green-50"
                : messageModal.type === "warning"
                  ? "border-l-yellow-500 bg-yellow-50"
                  : messageModal.type === "error"
                    ? "border-l-red-500 bg-red-50"
                    : "border-l-blue-500 bg-blue-50"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{messageModal.title}</h4>
                <p className="text-sm mt-1">{messageModal.message}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMessageModal(null)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
          </Alert>
        </div>
      )}

      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Super Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Comprehensive platform management and oversight
            </p>
          </div>
          <Button
            onClick={() => setIsSchoolRegistrationOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Register School
          </Button>
        </div>

        {/* System Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Schools
              </CardTitle>
              <School className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {systemStats.totalSchools}
              </div>
              <p className="text-xs text-muted-foreground">
                {loading ? "Calculating..." : "Active institutions"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subjects</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {systemStats.totalSubjects}
              </div>
              <p className="text-xs text-muted-foreground">
                Available subjects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                System Uptime
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {systemStats.systemUptime}%
              </div>
              <p className="text-xs text-muted-foreground">
                Platform availability
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Last Updated
              </CardTitle>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold">
                {new Date(systemStats.lastUpdated).toLocaleTimeString()}
              </div>
              <p className="text-xs text-muted-foreground">Data refresh time</p>
            </CardContent>
          </Card>
        </div>

        {/* Institutions Table */}
        <Card className="bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Schools & Institutions</CardTitle>
                <CardDescription>
                  Manage and monitor all registered educational institutions
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Search schools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
                <Button
                  onClick={fetchInstitutions}
                  variant="outline"
                  size="sm"
                  disabled={institutionsLoading}
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-2 ${institutionsLoading ? "animate-spin" : ""}`}
                  />
                  {institutionsLoading ? "Loading..." : "Refresh"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {institutionsError && (
              <div className="p-6">
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertTitle className="text-red-800">
                    Cannot Load Institutions
                  </AlertTitle>
                  <AlertDescription className="text-red-700">
                    <div className="space-y-2">
                      <p>API Error: {institutionsError}</p>
                      <p>
                        API URL: http://13.60.98.134/anansiai/api/Institutions
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button
                          onClick={fetchInstitutions}
                          variant="outline"
                          size="sm"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Retry Connection
                        </Button>
                        <Button
                          onClick={() =>
                            window.open(
                              "http://13.60.98.134/anansiai/swagger/index.html",
                              "_blank",
                            )
                          }
                          variant="outline"
                          size="sm"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View API Docs
                        </Button>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {filteredInstitutions.length === 0 && !institutionsError ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">
                  {searchTerm
                    ? "No institutions match your search."
                    : "No institutions found."}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Institution Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInstitutions.map((institution, index) => (
                    <TableRow
                      key={institution.institutionId || institution.id || index}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <School className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">
                            {institution.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-3 h-3" />
                          <span>{institution.address}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getStatusColor(institution.isDeleted)}
                        >
                          {institution.isDeleted ? "Inactive" : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {institution.createdDate
                          ? new Date(
                              institution.createdDate,
                            ).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* School Registration Modal */}
      <SchoolRegistration
        isOpen={isSchoolRegistrationOpen}
        onClose={() => setIsSchoolRegistrationOpen(false)}
        onSuccess={handleSchoolRegistrationSuccess}
      />
    </div>
  );
};

export default SuperAdminDashboard;
