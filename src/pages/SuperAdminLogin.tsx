import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import usePageTitle from "@/hooks/usePageTitle";
import { useLogin } from "@/hooks/useApiService";
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
import { Eye, EyeOff, Shield, AlertCircle } from "lucide-react";

const SuperAdminLogin = () => {
  usePageTitle("Super Admin Login");

  const [formData, setFormData] = useState({
    loginId: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const navigate = useNavigate();
  const {
    superAdminLogin,
    loading: authLoading,
    error: authError,
    isAuthenticated,
  } = useLogin();

  // Redirect if already authenticated as super admin
  useEffect(() => {
    if (isAuthenticated && authService.getState().userRole === "SUPER_ADMIN") {
      navigate("/super-admin-dashboard");
    }
  }, [isAuthenticated, navigate]);

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

    if (!formData.loginId || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    // Validate login ID format for Super Admin
    const loginIdPattern = /^SUP-ADM-\d{3}$/;
    if (!loginIdPattern.test(formData.loginId.toUpperCase())) {
      setError(
        "Invalid Super Admin ID format. Use format: SUP-ADM-XXX (e.g., SUP-ADM-001)",
      );
      return;
    }

    try {
      const result = await superAdminLogin(
        formData.loginId.toUpperCase(),
        formData.password,
      );

      if (result) {
        navigate("/super-admin-dashboard");
      } else {
        setError(
          authError ||
            "Invalid credentials. Please check your Super Admin ID and password.",
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error occurred. Please try again.");
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
                <Label htmlFor="loginId">Super Admin ID</Label>
                <Input
                  id="loginId"
                  name="loginId"
                  type="text"
                  placeholder="SUP-ADM-001"
                  value={formData.loginId}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="text-center font-mono"
                />
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

            <div className="pt-6 border-t border-secondary-200">
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
