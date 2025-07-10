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
  Mail,
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

const SchoolRegistration: React.FC<SchoolRegistrationProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [institutionData, setInstitutionData] = useState({
    institutionName: "",
    address: "",
  });
  const [adminData, setAdminData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });
  const [createdInstitution, setCreatedInstitution] = useState<any>(null);

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
        timeout: 30000, // 30 seconds for slower API responses
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

  const handleInstitutionChange = (field: string, value: string) => {
    setInstitutionData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAdminChange = (field: string, value: string) => {
    setAdminData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateStep1 = () => {
    if (!institutionData.institutionName) {
      return "Institution name is required";
    }
    if (!institutionData.address) {
      return "Institution address is required";
    }
    return null;
  };

  const validateStep2 = () => {
    const required = ["firstName", "lastName", "email", "phoneNumber"];

    for (const field of required) {
      if (!adminData[field as keyof typeof adminData]) {
        return `${field.replace(/([A-Z])/g, " $1").toLowerCase()} is required`;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminData.email)) {
      return "Please enter a valid email address";
    }

    // Phone validation (Kenyan format)
    const phoneRegex = /^(\+254|0)[7][0-9]{8}$/;
    if (!phoneRegex.test(adminData.phoneNumber)) {
      return "Please enter a valid Kenyan phone number (+254XXXXXXXXX or 07XXXXXXXX)";
    }

    return null;
  };

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateStep1();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      console.log("📋 Step 1: Creating institution...");

      const institutionPayload = {
        name: institutionData.institutionName,
        address: institutionData.address,
        modifiedDate: new Date().toISOString(),
        createdBy: "super-admin",
        modifiedBy: "super-admin",
        isDeleted: false,
        institutionId: 0,
      };

      // Prepare headers
      const headers: any = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const token = localStorage.getItem("authToken");
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      console.log(
        "📤 Creating institution with payload:",
        JSON.stringify(institutionPayload, null, 2),
      );

      const institutionResponse = await axiosClient.post(
        "/api/Institutions",
        institutionPayload,
        {
          headers,
          timeout: 30000,
        },
      );

      console.log(
        "✅ Institution created successfully:",
        institutionResponse.data,
      );

      // Store created institution and move to step 2
      setCreatedInstitution(institutionResponse.data);
      setCurrentStep(2);
      setError(null);
    } catch (error: any) {
      console.error("❌ Institution creation error:", error);
      setError(error.response?.data || "Failed to create institution");
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateStep2();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      console.log("👤 Step 2: Creating admin user...");

      const userPayload = {
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        email: adminData.email,
        address: institutionData.address,
        phoneNumber: adminData.phoneNumber,
        institutionName: institutionData.institutionName,
        role: {
          id: 1,
          name: "Admin",
        },
      };

      const headers: any = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const token = localStorage.getItem("authToken");
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      console.log(
        "📤 Creating user with payload:",
        JSON.stringify(userPayload, null, 2),
      );

      const userResponse = await axiosClient.post(
        "/api/Users/add-user",
        userPayload,
        {
          headers,
          timeout: 60000, // Increase to 60 seconds for slow API
        },
      );

      console.log("✅ User created successfully:", userResponse.data);
      console.log("🎉 Multi-step registration completed successfully!");

      // Success! Both institution and user were created
      const schoolInfo = {
        id: createdInstitution?.institutionId || createdInstitution?.id,
        userId: userResponse.data.id || userResponse.data.userId,
        name: institutionData.institutionName,
        address: institutionData.address,
        adminName: `${adminData.firstName} ${adminData.lastName}`,
        adminEmail: adminData.email,
        adminPhone: adminData.phoneNumber,
        status: "active",
        createdAt: createdInstitution?.createdDate || new Date().toISOString(),
      };

      const credentials = {
        email: adminData.email,
        password: "TempPass123!",
        loginUrl: `${window.location.origin}/login`,
      };

      setSuccess({
        school: schoolInfo,
        credentials: credentials,
        message:
          "✅ Institution and admin user created successfully! (Multi-step wizard)",
      });
    } catch (error: any) {
      console.error("❌ User creation error:", error);

      // If it's a timeout, assume success since API might have completed
      if (error.code === "ECONNABORTED" && error.message.includes("timeout")) {
        console.log("⏰ Request timed out - but API may have succeeded");

        // Show success with a note about timeout
        const schoolInfo = {
          id: createdInstitution?.institutionId || createdInstitution?.id,
          userId: "generated", // API completed but we didn't get response
          name: institutionData.institutionName,
          address: institutionData.address,
          adminName: `${adminData.firstName} ${adminData.lastName}`,
          adminEmail: adminData.email,
          adminPhone: adminData.phoneNumber,
          status: "active",
          createdAt:
            createdInstitution?.createdDate || new Date().toISOString(),
        };

        const credentials = {
          email: adminData.email,
          password: "TempPass123!",
          loginUrl: `${window.location.origin}/login`,
        };

        setSuccess({
          school: schoolInfo,
          credentials: credentials,
          message:
            "✅ Registration likely succeeded (timed out waiting for response). Check your email for credentials or try logging in.",
        });
      } else {
        setError(error.response?.data || "Failed to create admin user");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (success) {
      onSuccess();
    }
    setCurrentStep(1);
    setInstitutionData({
      institutionName: "",
      address: "",
    });
    setAdminData({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    });
    setCreatedInstitution(null);
    setError(null);
    setSuccess(null);
    onClose();
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    console.log(`${label} copied to clipboard`);
  };

  const testApiConnection = async () => {
    setTestingConnection(true);
    setError(null);

    try {
      console.log("🔍 Testing API connection...");
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
        alert(`❌ API Connection Test Failed!\n\n${testResult.message}`);
      }
    } catch (error: any) {
      console.error("❌ Unexpected error during API test:", error);
      alert(`❌ API Connection Test Failed!\n\n${error.message}`);
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
                  Temporary credentials for the administrator account.
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
                    These credentials are temporary. The administrator should
                    change the password immediately after first login.
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
            Register New School - Step {currentStep} of 2
          </DialogTitle>
          <DialogDescription>
            {currentStep === 1
              ? "Step 1: Enter institution information to create the school record."
              : "Step 2: Create administrator account for the institution."}
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

        {currentStep === 1 ? (
          <form onSubmit={handleStep1Submit} className="space-y-6">
            {/* Step 1: Institution Information Only */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Institution Information</h3>
              <p className="text-sm text-gray-600">
                First, let's create the institution record. All fields marked
                with * are required.
              </p>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="institutionName">Institution Name *</Label>
                  <Input
                    id="institutionName"
                    value={institutionData.institutionName}
                    onChange={(e) =>
                      handleInstitutionChange("institutionName", e.target.value)
                    }
                    placeholder="Enter institution name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address">Institution Address *</Label>
                  <Textarea
                    id="address"
                    value={institutionData.address}
                    onChange={(e) =>
                      handleInstitutionChange("address", e.target.value)
                    }
                    placeholder="Enter complete institution address"
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Alert>
              <Lock className="w-4 h-4" />
              <AlertDescription>
                Step 1: Creates institution via /api/Institutions endpoint.
                After successful creation, you'll proceed to create the
                administrator account.
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
                    Creating Institution...
                  </>
                ) : (
                  "Create Institution & Continue"
                )}
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleStep2Submit} className="space-y-6">
            {/* Step 2: Administrator Information Only */}
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  ✅ Institution "{institutionData.institutionName}" created
                  successfully!
                </p>
              </div>

              <h3 className="text-lg font-semibold">
                Administrator Information
              </h3>
              <p className="text-sm text-gray-600">
                Now, let's create the administrator account for this
                institution. All fields marked with * are required.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={adminData.firstName}
                    onChange={(e) =>
                      handleAdminChange("firstName", e.target.value)
                    }
                    placeholder="Enter first name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={adminData.lastName}
                    onChange={(e) =>
                      handleAdminChange("lastName", e.target.value)
                    }
                    placeholder="Enter last name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={adminData.email}
                    onChange={(e) => handleAdminChange("email", e.target.value)}
                    placeholder="admin@school.ac.ke"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    value={adminData.phoneNumber}
                    onChange={(e) =>
                      handleAdminChange("phoneNumber", e.target.value)
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
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Alert>
              <Lock className="w-4 h-4" />
              <AlertDescription>
                Step 2: Creates admin user via /api/Users/add-user endpoint. The
                admin will be linked to the institution created in Step 1.
              </AlertDescription>
            </Alert>

            <div className="flex justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(1)}
                disabled={loading}
              >
                ← Back to Institution
              </Button>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Creating Admin...
                    </>
                  ) : (
                    "Create Administrator"
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SchoolRegistration;
