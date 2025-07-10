import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import usePageTitle from "@/hooks/usePageTitle";
import axiosClient from "@/services/axiosClient";
import { authService } from "@/services/auth";
import { ApiStatusIndicator } from "@/components/ApiStatusIndicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Shield, AlertCircle, Wifi } from "lucide-react";

const SuperAdminLogin = () => {
  usePageTitle("Super Admin Login");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const navigate = useNavigate();

  // Clear any existing authentication on component mount (force re-login)
  useEffect(() => {
    // Clear all auth data to force fresh login
    localStorage.removeItem("authToken");
    localStorage.removeItem("anansi_token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userData");
    console.log("🔄 Cleared existing auth data - ready for fresh login");
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const loginData = {
        email: formData.email.toLowerCase(),
        password: formData.password,
      };

      console.log("🔐 Attempting super admin login...", {
        email: loginData.email,
      });

      // Test API connection first
      try {
        await axiosClient.get("/api/Institutions", { timeout: 5000 });
        console.log("✅ API connection verified");
      } catch (connError) {
        console.log("⚠️ API connection issue:", connError);
      }

      const response = await axiosClient.post("/api/Auth/login", loginData, {
        timeout: 10000,
      });

      console.log("🔍 API Response:", response.data);

      if (
        response.data &&
        (response.data.token ||
          response.data.access_token ||
          response.status === 200)
      ) {
        console.log("✅ Super admin login successful");

        // Extract token from various possible response formats
        const token =
          response.data.token ||
          response.data.access_token ||
          response.data.authToken ||
          "authenticated";

        // Store auth data - production authentication only
        localStorage.setItem("authToken", token);
        localStorage.setItem("anansi_token", token);
        localStorage.setItem("userRole", "superadmin");
        localStorage.setItem("userEmail", formData.email.toLowerCase());
        localStorage.setItem(
          "userData",
          JSON.stringify({
            email: formData.email.toLowerCase(),
            role: "superadmin",
            loginTime: new Date().toISOString(),
          }),
        );

        console.log("🎯 Authentication successful - redirecting to dashboard");
        navigate("/super-admin-dashboard");
      } else {
        console.log("❌ Invalid response format:", response.data);
        setError("Invalid credentials. Please check your email and password.");
      }
    } catch (error: any) {
      console.error("❌ Super admin login error:", error);
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        code: error.code,
      });

      if (error.response?.status === 401 || error.response?.status === 400) {
        setError("Invalid credentials. Please check your email and password.");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (
        error.code === "ERR_NETWORK" ||
        error.message === "Network Error"
      ) {
        setError(
          "Network error: Cannot connect to API server. Please check your connection or contact support.",
        );
      } else {
        setError("Authentication failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail.trim()) {
      setError("Please enter your email address");
      return;
    }

    try {
      const result = await authService.resetPassword(resetEmail);

      if (result.success) {
        setResetSent(true);
        setTimeout(() => {
          setForgotPasswordOpen(false);
          setResetSent(false);
          setResetEmail("");
        }, 3000);
      } else {
        setError(
          result.error || "Failed to send reset email. Please try again.",
        );
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animate-delay-2s"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-secondary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animate-delay-4s"></div>
      </div>

      <div className="relative w-full max-w-md">
        <Card className="card-elevated">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto p-3 bg-primary-100 rounded-2xl w-fit">
              <img
                src="https://cdn.builder.io/api/v1/assets/2d09da496e544a1eab05e596d02031d8/twinternet-logo-b18833?format=webp&width=800"
                alt="AnansiAI Logo"
                className="w-12 h-12 object-contain"
              />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-secondary-800">
                Super Admin Portal
              </CardTitle>
              <CardDescription className="text-secondary-600">
                National Education Platform Access
              </CardDescription>
            </div>

            {/* API Status Indicator */}
            <div className="flex justify-center">
              <ApiStatusIndicator showDetails={false} />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="super.admin@education.go.ke"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Production authentication required
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="btn-primary w-full"
                disabled={isLoading}
              >
                <Shield className="w-4 h-4 mr-2" />
                {isLoading ? "Authenticating..." : "Access Portal"}
              </Button>
            </form>

            <div className="text-center">
              <Dialog
                open={forgotPasswordOpen}
                onOpenChange={setForgotPasswordOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="link" className="text-sm">
                    Forgot your password?
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reset Super Admin Password</DialogTitle>
                    <DialogDescription>
                      Enter your registered email address to receive password
                      reset instructions.
                    </DialogDescription>
                  </DialogHeader>

                  {!resetSent ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="resetEmail">Email Address</Label>
                        <Input
                          id="resetEmail"
                          type="email"
                          placeholder="super.admin@education.go.ke"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                        />
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setForgotPasswordOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleForgotPassword}>
                          Send Reset Link
                        </Button>
                      </DialogFooter>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <div className="mx-auto w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mb-4">
                        <Shield className="w-6 h-6 text-accent-600" />
                      </div>
                      <h3 className="font-medium text-secondary-800 mb-2">
                        Reset Link Sent!
                      </h3>
                      <p className="text-sm text-secondary-600">
                        Check your email for password reset instructions.
                      </p>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>

            <div className="pt-6 border-t border-secondary-200 space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Super Admin Access
                </h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• National education platform oversight</p>
                  <p>• School registration and management</p>
                  <p>• System administration privileges</p>
                  <p>• Infrastructure monitoring access</p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Production Authentication
                </h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• Secure HTTPS connection to API server</p>
                  <p>• Authentication required for all operations</p>
                  <p>• Contact system administrator for credentials</p>
                  <p>• All sessions are logged and monitored</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-secondary-500">
          <p>Ministry of Education • Republic of Kenya</p>
          <p className="mt-1">Secure access for authorized personnel only</p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
