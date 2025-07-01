import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  School,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Lock,
  CheckCircle,
  AlertTriangle,
  Copy,
  ExternalLink,
  Wifi,
  WifiOff,
} from "lucide-react";
import { apiService } from "@/services/apiService";
import { useApiStatus } from "@/hooks/useApiService";

interface SchoolRegistrationProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const kenyanCounties = [
  "Nairobi",
  "Mombasa",
  "Kwale",
  "Kilifi",
  "Tana River",
  "Lamu",
  "Taita Taveta",
  "Garissa",
  "Wajir",
  "Mandera",
  "Marsabit",
  "Isiolo",
  "Meru",
  "Tharaka Nithi",
  "Embu",
  "Kitui",
  "Machakos",
  "Makueni",
  "Nyandarua",
  "Nyeri",
  "Kirinyaga",
  "Murang'a",
  "Kiambu",
  "Turkana",
  "West Pokot",
  "Samburu",
  "Trans Nzoia",
  "Uasin Gishu",
  "Elgeyo Marakwet",
  "Nandi",
  "Baringo",
  "Laikipia",
  "Nakuru",
  "Narok",
  "Kajiado",
  "Kericho",
  "Bomet",
  "Kakamega",
  "Vihiga",
  "Bungoma",
  "Busia",
  "Siaya",
  "Kisumu",
  "Homa Bay",
  "Migori",
  "Kisii",
  "Nyamira",
];

const SchoolRegistration: React.FC<SchoolRegistrationProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { isConnected, baseURL } = useApiStatus();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    county: "",
    subcounty: "",
    adminName: "",
    adminEmail: "",
    adminPhone: "",
    establishedYear: new Date().getFullYear(),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    school: any;
    credentials: {
      email: string;
      password: string;
      loginUrl: string;
    };
    message?: string;
  } | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const required = [
      "name",
      "address",
      "county",
      "adminName",
      "adminEmail",
      "adminPhone",
    ];
    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        return `${field.replace(/([A-Z])/g, " $1").toLowerCase()} is required`;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.adminEmail)) {
      return "Please enter a valid email address";
    }

    // Phone validation (Kenyan format)
    const phoneRegex = /^(\+254|0)[7][0-9]{8}$/;
    if (!phoneRegex.test(formData.adminPhone)) {
      return "Please enter a valid Kenyan phone number (+254XXXXXXXXX or 07XXXXXXXX)";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      console.log("🎯 Submitting school registration...");
      const response = await apiService.registerSchoolWithCredentials(formData);

      if (response.success && response.data) {
        console.log("✅ Registration successful:", response);
        setSuccess({
          ...response.data,
          message: response.message,
        });

        // Show additional info for manual setup scenarios
        if (response.message?.includes("Manual Setup Required")) {
          console.warn("⚠��� Manual setup mode activated");
        }
      } else {
        console.error("❌ Registration failed:", response);
        setError(response.error || "Failed to register school");
      }
    } catch (err: any) {
      console.error("💥 Unexpected registration error:", err);

      let friendlyMessage = "An unexpected error occurred during registration.";

      // Handle timeout errors specifically
      if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
        friendlyMessage = `⏱️ Request Timeout\n\nThe server took too long to respond. This might be due to:\n• Server overload or slow processing\n• Network latency issues\n• The backend processing large amounts of data\n\n💡 Try again in a few moments, or the system will use demo mode.`;
      } else if (
        err.message?.includes("fetch") ||
        err.message?.includes("Network") ||
        err.message?.includes("Failed to fetch") ||
        err.code === "ERR_NETWORK"
      ) {
        friendlyMessage = `🌐 Network Connection Failed\n\nCannot reach the API server. This might be due to:\n• Server not running at ${apiService.getConfig().getBaseURL()}\n• Network connectivity issues\n• CORS configuration problems\n\n💡 The system can still work in demo mode where you'll get credentials for testing.`;
      } else if (err.response?.status >= 500) {
        friendlyMessage = `🔧 Server Error (${err.response.status})\n\nThe API server encountered an internal error:\n${err.response.data?.message || err.response.statusText}\n\n💡 Please try again later or contact the system administrator.`;
      } else if (err.response?.status >= 400) {
        friendlyMessage = `❌ Request Error (${err.response.status})\n\n${err.response.data?.message || err.response.statusText}\n\n💡 Please check your input and try again.`;
      } else {
        friendlyMessage = `Unexpected error: ${err.message || "Please try again or contact support"}`;
      }

      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (success) {
      onSuccess();
    }
    setFormData({
      name: "",
      address: "",
      county: "",
      subcounty: "",
      adminName: "",
      adminEmail: "",
      adminPhone: "",
      establishedYear: new Date().getFullYear(),
    });
    setError(null);
    setSuccess(null);
    onClose();
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
    console.log(`${label} copied to clipboard`);
  };

  const testApiConnection = async () => {
    setTestingConnection(true);
    setError(null);

    try {
      console.log("🔍 Testing API connection via apiService...");

      // Use the apiService's test method instead of direct fetch
      const testResult = await apiService.testCurrentConfiguration();

      if (testResult.success) {
        console.log("✅ API connection successful");
        alert(
          `✅ API Connection Successful!\n\n${testResult.message}\nEndpoint: ${baseURL}\n\nYou can now register schools normally.`,
        );
      } else {
        console.log("ℹ️ Connection test failed:", testResult.message);

        // Check if this is a mixed content issue
        const isMixedContent =
          window.location.protocol === "https:" && baseURL.startsWith("http:");

        let informativeMessage = "";

        if (isMixedContent && testResult.message.includes("Mixed Content")) {
          informativeMessage =
            `🔒 Browser Security Issue Detected\n\n` +
            `Your browser is blocking the request because:\n` +
            `• Frontend: ${window.location.origin} (HTTPS)\n` +
            `• API: ${baseURL} (HTTP)\n\n` +
            `🛠️ Quick Solutions:\n\n` +
            `1. ALLOW MIXED CONTENT:\n` +
            `   • Click the 🔒 lock icon in address bar\n` +
            `   • Click "Site settings"\n` +
            `   • Change "Insecure content" to "Allow"\n` +
            `   • Refresh and try again\n\n` +
            `2. OR USE HTTP FRONTEND:\n` +
            `   • Access via: http://${window.location.host}\n\n` +
            `3. OR SET UP HTTPS API:\n` +
            `   • Configure your .NET API for HTTPS`;
        } else {
          informativeMessage =
            `📡 Connection Test: Server Unreachable\n\n` +
            `❌ ${testResult.message}\n\n` +
            `🔍 Endpoint tested: ${baseURL}/Institutions\n\n` +
            `📋 Possible causes:\n` +
            `• API server is not running\n` +
            `• CORS configuration issues\n` +
            `• School registration will automatically use manual setup mode\n` +
            `• You'll get credentials to manually add to your database\n\n` +
            `💡 Next steps:\n` +
            `• Proceed with school registration (it will work!)\n` +
            `• Or fix the API server if you want automatic registration`;
        }

        // Don't set as error since this is expected behavior
        console.log(
          "📊 Test complete - API unavailable, manual mode available",
        );
        alert(informativeMessage);
      }
    } catch (error: any) {
      console.error("❌ Unexpected error during API test:", error);

      const errorMessage = error.message || "Unknown API connection error";
      alert(
        `❌ API Connection Test Failed!\n\n${errorMessage}\n\nThis may indicate a configuration issue. Please check the console for more details.`,
      );
    } finally {
      setTestingConnection(false);
    }
  };

  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-6 h-6" />
              School Registration Successful!
            </DialogTitle>
            <DialogDescription>
              {success.school.name} has been registered and credentials have
              been generated.
            </DialogDescription>
          </DialogHeader>

          {/* Manual Setup Warning */}
          {success.message?.includes("Manual Setup Required") && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium text-yellow-800">
                    Manual Database Setup Required
                  </p>
                  <p className="text-sm text-yellow-700">
                    The API server was unreachable, so the school needs to be
                    manually added to your database. The credentials below have
                    been generated and can be used once you complete the manual
                    setup.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            {/* School Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">School Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      School Name
                    </Label>
                    <p className="font-semibold">{success.school.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Status
                    </Label>
                    <p className="text-green-600 font-semibold">
                      {success.school.status}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Address
                  </Label>
                  <p>{success.school.address}</p>
                </div>
              </CardContent>
            </Card>

            {/* Generated Credentials */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Administrator Login Credentials
                </CardTitle>
                <CardDescription>
                  These credentials have been sent to the administrator's email
                  address.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Email
                      </Label>
                      <p className="font-mono text-sm">
                        {success.credentials.email}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(success.credentials.email, "Email")
                      }
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Password
                      </Label>
                      <p className="font-mono text-sm">
                        {success.credentials.password}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          success.credentials.password,
                          "Password",
                        )
                      }
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Login URL
                      </Label>
                      <p className="font-mono text-sm text-blue-600">
                        {success.credentials.loginUrl}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            success.credentials.loginUrl,
                            "Login URL",
                          )
                        }
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(success.credentials.loginUrl, "_blank")
                        }
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Alert>
                  <Mail className="w-4 h-4" />
                  <AlertDescription>
                    {success.message?.includes("Manual Setup Required") ? (
                      <>
                        <strong>Manual Setup Mode:</strong> Credentials have
                        been generated but email sending was not possible.
                        Please manually send these credentials to{" "}
                        <strong>{success.credentials.email}</strong> and ensure
                        they change the password after first login.
                      </>
                    ) : (
                      <>
                        An email with these credentials has been sent to{" "}
                        <strong>{success.credentials.email}</strong>. The
                        administrator should change the password immediately
                        after first login.
                      </>
                    )}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button onClick={handleClose}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <School className="w-6 h-6" />
            Register New School
          </DialogTitle>
          <DialogDescription>
            Create a new school account with administrator credentials.
          </DialogDescription>
        </DialogHeader>

        {/* API Status Indicator */}
        <Alert
          className={
            isConnected
              ? "border-green-200 bg-green-50"
              : "border-yellow-200 bg-yellow-50"
          }
        >
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="w-4 h-4 text-green-600" />
            ) : (
              <WifiOff className="w-4 h-4 text-yellow-600" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium">
                {isConnected
                  ? "API Server Connected"
                  : "API Server Unreachable"}
              </p>
              <p className="text-xs text-gray-600">
                Server: {baseURL || "Unknown"}
              </p>
            </div>
          </div>
          {!isConnected && (
            <AlertDescription className="mt-2">
              <p className="text-sm mb-2">
                Registration will work in manual setup mode. The system will
                generate credentials that you can use to manually configure the
                school in your database.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={testApiConnection}
                disabled={testingConnection}
                className="text-xs"
              >
                {testingConnection ? (
                  <>
                    <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin mr-1" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Wifi className="w-3 h-3 mr-1" />
                    Check API Status
                  </>
                )}
              </Button>
            </AlertDescription>
          )}
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* School Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">School Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="name">School Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter school name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="county">County *</Label>
                <Select
                  value={formData.county}
                  onValueChange={(value) => handleInputChange("county", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select county" />
                  </SelectTrigger>
                  <SelectContent>
                    {kenyanCounties.map((county) => (
                      <SelectItem key={county} value={county}>
                        {county}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="subcounty">Sub-County</Label>
                <Input
                  id="subcounty"
                  value={formData.subcounty}
                  onChange={(e) =>
                    handleInputChange("subcounty", e.target.value)
                  }
                  placeholder="Enter sub-county"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter complete school address"
                  required
                />
              </div>

              <div>
                <Label htmlFor="establishedYear">Established Year</Label>
                <Input
                  id="establishedYear"
                  type="number"
                  value={formData.establishedYear}
                  onChange={(e) =>
                    handleInputChange(
                      "establishedYear",
                      parseInt(e.target.value),
                    )
                  }
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>
          </div>

          {/* Administrator Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Administrator Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="adminName">Administrator Name *</Label>
                <Input
                  id="adminName"
                  value={formData.adminName}
                  onChange={(e) =>
                    handleInputChange("adminName", e.target.value)
                  }
                  placeholder="Enter administrator full name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="adminEmail">Administrator Email *</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={formData.adminEmail}
                  onChange={(e) =>
                    handleInputChange("adminEmail", e.target.value)
                  }
                  placeholder="admin@school.ac.ke"
                  required
                />
              </div>

              <div>
                <Label htmlFor="adminPhone">Administrator Phone *</Label>
                <Input
                  id="adminPhone"
                  value={formData.adminPhone}
                  onChange={(e) =>
                    handleInputChange("adminPhone", e.target.value)
                  }
                  placeholder="+254 700 000 000"
                  required
                />
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                <div className="whitespace-pre-line text-sm">{error}</div>
              </AlertDescription>
            </Alert>
          )}

          <Alert>
            <Lock className="w-4 h-4" />
            <AlertDescription>
              Secure login credentials will be automatically generated.
              {!isConnected ? (
                <>
                  {" "}
                  Since the API server is unreachable, the system will operate
                  in manual setup mode and provide credentials for manual
                  database configuration.
                </>
              ) : (
                <>
                  {" "}
                  Credentials will be sent to the administrator's email address.
                </>
              )}
            </AlertDescription>
          </Alert>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {isConnected ? "Registering..." : "Preparing Setup..."}
                </>
              ) : (
                <>
                  {isConnected
                    ? "Register School"
                    : "Generate Setup & Credentials"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SchoolRegistration;
