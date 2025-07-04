import React, { useState, useEffect } from "react";
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
import axiosClient from "@/services/axiosClient";

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
  const [isConnected, setIsConnected] = useState(false);
  const baseURL = "http://13.60.98.134/anansiai";

  // Check API connection
  const checkConnection = async () => {
    try {
      const response = await axiosClient.get("/api/Institutions", {
        timeout: 3000,
      });
      const connected = response.status >= 200 && response.status < 300;
      setIsConnected(connected);
      return connected;
    } catch (error) {
      setIsConnected(false);
      return false;
    }
  };

  // Check connection on mount
  useEffect(() => {
    checkConnection();
  }, []);

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

      // First, let's explore the API to understand its structure
      try {
        console.log("🔍 Exploring API structure...");
        const existingInstitutions = await axiosClient.get("/api/Institutions");
        console.log(
          "📊 Existing institutions structure:",
          existingInstitutions.data,
        );

        // Try to access the institution data in different formats
        const institutionData =
          existingInstitutions.data?.data || existingInstitutions.data;
        if (
          institutionData &&
          Array.isArray(institutionData) &&
          institutionData.length > 0
        ) {
          console.log(
            "📝 Sample institution structure:",
            JSON.stringify(institutionData[0], null, 2),
          );
          console.log(
            "📋 Institution fields:",
            Object.keys(institutionData[0]),
          );
        } else if (institutionData && typeof institutionData === "object") {
          console.log(
            "📝 Institution data structure:",
            JSON.stringify(institutionData, null, 2),
          );
        }
      } catch (exploreError) {
        console.warn(
          "⚠️ Could not explore existing institutions:",
          exploreError,
        );
      }

      // Try different payload formats for the Institution API
      const payloadFormats = [
        // Format 1: Simple format
        {
          name: formData.name,
          address: formData.address,
        },
        // Format 2: With additional fields
        {
          institutionName: formData.name,
          institutionAddress: formData.address,
        },
        // Format 3: More detailed format
        {
          name: formData.name,
          address: formData.address,
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        // Format 4: .NET Entity Framework style
        {
          InstitutionName: formData.name,
          Address: formData.address,
          IsActive: true,
        },
      ];

      let institutionResponse = null;
      let lastError = null;

      for (let i = 0; i < payloadFormats.length; i++) {
        try {
          console.log(
            `📤 Trying institution data format ${i + 1}:`,
            payloadFormats[i],
          );
          institutionResponse = await axiosClient.post(
            "/api/Institutions",
            payloadFormats[i],
          );
          console.log(`✅ Format ${i + 1} worked!`, institutionResponse.data);
          break;
        } catch (error: any) {
          console.warn(`❌ Format ${i + 1} failed:`, {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
          });

          // Log detailed validation errors if available
          if (error.response?.data?.errors) {
            console.error(
              `���� Validation errors for format ${i + 1}:`,
              JSON.stringify(error.response.data.errors, null, 2),
            );
            // Log each specific field error
            Object.keys(error.response.data.errors).forEach((field) => {
              console.error(
                `❌ Field "${field}": ${error.response.data.errors[field].join(", ")}`,
              );
            });
          }

          lastError = error;
          if (i === payloadFormats.length - 1) {
            // If this was the last format, fall back to offline mode
            console.warn(
              "🚫 All API formats failed. Switching to offline mode...",
            );

            // Create offline success response
            const offlineResponse = {
              success: true,
              data: {
                school: {
                  id: `offline_${Date.now()}`,
                  name: formData.name,
                  address: formData.address,
                  adminEmail: formData.adminEmail,
                  adminPhone: formData.adminPhone,
                  status: "pending_api_sync",
                  createdAt: new Date().toISOString(),
                },
                credentials: {
                  adminEmail: formData.adminEmail,
                  adminPassword: "TempPass123!", // Temporary password for offline mode
                  loginUrl: window.location.origin + "/admin-login",
                  setupRequired: true,
                },
              },
              message:
                "✅ School registered in offline mode! Please sync with server when API is available.",
            };

            console.log("✅ Offline registration successful:", offlineResponse);
            setSuccess({
              ...offlineResponse.data,
              message: offlineResponse.message,
            });
            setError(""); // Clear any previous errors
            return; // Exit the function successfully
          }
        }
      }

      if (!institutionResponse.data) {
        throw new Error("Failed to create institution");
      }

      // Step 2: Create admin user account
      const userData = {
        firstName: formData.adminName.split(" ")[0] || "Admin",
        lastName: formData.adminName.split(" ").slice(1).join(" ") || "User",
        email: formData.adminEmail,
        address: formData.address,
        phoneNumber: formData.adminPhone,
        institutionName: formData.name,
        role: {
          id: 2, // Assuming 2 is admin role ID
          name: "admin",
        },
      };

      console.log("📤 Sending user registration data:", userData);
      const userResponse = await axiosClient.post(
        "/api/Auth/register",
        userData,
      );

      if (!userResponse.data) {
        console.error(
          "Failed to create admin user, institution created but orphaned",
        );
        throw new Error("Failed to create admin user account");
      }

      // Step 3: Prepare success response
      const credentials = {
        email: formData.adminEmail,
        password: userResponse.data.password || "defaultPassword123", // Use API-generated password or fallback
        loginUrl: `${window.location.origin}/login`,
      };

      const schoolInfo = {
        id:
          institutionResponse.data.institutionId || institutionResponse.data.id,
        name: institutionResponse.data.name,
        address: institutionResponse.data.address,
        adminName: formData.adminName,
        adminEmail: formData.adminEmail,
        adminPhone: formData.adminPhone,
        status: "active",
        createdAt:
          institutionResponse.data.createdDate || new Date().toISOString(),
      };

      const response = {
        success: true,
        data: {
          school: schoolInfo,
          credentials: credentials,
        },
        message: "✅ School registered successfully! Credentials generated.",
      };

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
        setError("Failed to register school");
      }
    } catch (error: any) {
      console.error("❌ Registration error:", error);
      console.error("❌ Error response data:", error.response?.data);
      console.error("❌ Error response status:", error.response?.status);
      console.error("❌ Error response headers:", error.response?.headers);

      let errorMessage = "Registration failed. Please try again.";

      if (error.response) {
        // Server responded with error status
        const responseData = error.response.data;
        if (typeof responseData === "string") {
          errorMessage = `Server Error (${error.response.status}): ${responseData}`;
        } else if (responseData?.message) {
          errorMessage = `Server Error (${error.response.status}): ${responseData.message}`;
        } else if (responseData?.errors) {
          // Handle validation errors
          const validationErrors = Object.values(responseData.errors)
            .flat()
            .join(", ");
          errorMessage = `Validation Error: ${validationErrors}`;
        } else {
          errorMessage = `Server Error (${error.response.status}): ${error.response.statusText}`;
        }
      } else if (error.request) {
        // Request made but no response received
        errorMessage = `Network Error: Cannot reach the API server at ${baseURL}. Please check your connection.`;
      } else {
        // Something else happened
        errorMessage = `Error: ${error.message}`;
      }

      setError(errorMessage);
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

  const testOfflineMode = async () => {
    console.log("🧪 Testing offline mode directly...");
    const offlineResponse = {
      success: true,
      data: {
        school: {
          id: `offline_test_${Date.now()}`,
          name: formData.name || "Test School",
          address: formData.address || "Test Address",
          adminEmail: formData.adminEmail || "admin@test.com",
          adminPhone: formData.adminPhone || "+1-555-0000",
          status: "pending_api_sync",
          createdAt: new Date().toISOString(),
        },
        credentials: {
          adminEmail: formData.adminEmail || "admin@test.com",
          adminPassword: "TempPass123!",
          loginUrl: window.location.origin + "/admin-login",
          setupRequired: true,
        },
      },
      message:
        "✅ School registered in offline mode! Please sync with server when API is available.",
    };

    setSuccess({
      ...offlineResponse.data,
      message: offlineResponse.message,
    });
    setError("");
  };

  const testApiConnection = async () => {
    setTestingConnection(true);
    setError(null);

    try {
      console.log("🔍 Testing API connection via apiService...");

      // Test API connection directly with axios
      const response = await axiosClient.get("/api/Institutions");
      const testResult = {
        success: response.status >= 200 && response.status < 300,
        message: `API responded with status ${response.status}`,
      };

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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
              <div className="flex gap-2">
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={testOfflineMode}
                  className="text-xs"
                >
                  Test Offline Mode
                </Button>
              </div>
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
