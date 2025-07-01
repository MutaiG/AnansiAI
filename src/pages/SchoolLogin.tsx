import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import usePageTitle from "@/hooks/usePageTitle";
import { useLogin } from "@/hooks/useApiService";
import { ApiStatusBadge } from "@/components/ApiStatusIndicator";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  GraduationCap,
  Users,
  BookOpen,
  Shield,
  Mail,
} from "lucide-react";

const SchoolLogin = () => {
  usePageTitle("School Login");

  const [formData, setFormData] = useState({
    userId: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const navigate = useNavigate();
  const {
    login,
    loading: authLoading,
    error: authError,
    isAuthenticated,
  } = useLogin();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const role = localStorage.getItem("userRole");
      switch (role) {
        case "ADMIN":
          navigate("/admin-dashboard");
          break;
        case "TEACHER":
          navigate("/teacher-dashboard");
          break;
        case "STUDENT":
          navigate("/student-dashboard");
          break;
        default:
          break;
      }
    }
  }, [isAuthenticated, navigate]);

  // Secret keyboard shortcut for platform owner access
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Secret combination: Ctrl + Shift + O (Owner)
      if (e.ctrlKey && e.shiftKey && e.key === "O") {
        e.preventDefault();
        navigate("/super-admin-login");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!formData.userId || !formData.password) {
        setError("Please fill in all fields.");
        setIsLoading(false);
        return;
      }

      // Check if it's super admin trying to login here
      if (formData.userId.includes("SUP-ADM")) {
        setError("Super administrators should use the Super Admin portal.");
        setIsLoading(false);
        return;
      }

      const result = await schoolLogin(formData.userId, formData.password);

      if (result.success) {
        const { user, school } = result;

        // Navigate based on user role
        switch (user?.role?.toUpperCase()) {
          case "ADMIN":
            navigate("/admin-dashboard");
            break;
          case "TEACHER":
            navigate("/teacher-dashboard");
            break;
          case "STUDENT":
            navigate("/student-dashboard");
            break;
          default:
            setError("Invalid user role. Please contact administrator.");
        }
      } else {
        setError(
          result.error || "Login failed. Please check your credentials.",
        );
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getSchoolName = (code: string) => {
    const schoolNames: { [key: string]: string } = {
      LHS: "Lincoln High School",
      WES: "Washington Elementary",
      RMS: "Roosevelt Middle School",
      KHS: "Kennedy High School",
      JEA: "Jefferson Academy",
    };
    return schoolNames[code] || `${code} School`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail) {
      alert("Please enter your email address");
      return;
    }

    try {
      const result = await resetPassword(forgotPasswordEmail);

      if (result.success) {
        alert(
          `Password reset instructions have been sent to ${forgotPasswordEmail}`,
        );
        setIsForgotPasswordOpen(false);
        setForgotPasswordEmail("");
      } else {
        alert(result.error || "Failed to send reset email. Please try again.");
      }
    } catch (error) {
      alert("Network error. Please try again.");
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

      <div className="relative w-full max-w-md mx-auto">
        <Card className="card-elevated">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto p-6 bg-primary-100 rounded-xl w-fit mb-4">
              <img
                src="https://cdn.builder.io/api/v1/assets/2d09da496e544a1eab05e596d02031d8/twinternet-logo-b18833?format=webp&width=800"
                alt="AnansiAI Logo"
                className="w-24 h-24 object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-gradient mb-2">AnansiAI</h1>
            <CardTitle className="text-xl font-bold text-secondary-800">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-secondary-600">
              Sign in to access your school account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert className="border-destructive-200 bg-destructive-50">
                <AlertDescription className="text-destructive-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="userId"
                  className="text-secondary-700 font-medium"
                >
                  School User ID
                </Label>
                <Input
                  id="userId"
                  name="userId"
                  type="text"
                  placeholder="LHS-STU-001 or LHS-TCH-001"
                  value={formData.userId}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
                <div className="text-xs text-secondary-500 space-y-1">
                  <p>Format: SCHOOL-ROLE-NUMBER</p>
                  <p>Roles: STU (Student), TCH (Teacher), ADM (School Admin)</p>
                  <p>Example: LHS-STU-001, WES-TCH-005</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-secondary-700 font-medium"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="input-field pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="btn-primary w-full"
                disabled={isLoading || authLoading}
              >
                {isLoading || authLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center">
              <Dialog
                open={isForgotPasswordOpen}
                onOpenChange={setIsForgotPasswordOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="link" className="text-sm text-primary-600">
                    Forgot your password?
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reset Password</DialogTitle>
                    <DialogDescription>
                      Enter your email address and we'll send you instructions
                      to reset your password.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsForgotPasswordOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleForgotPassword} className="flex-1">
                        <Mail className="w-4 h-4 mr-2" />
                        Send Instructions
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="text-center pt-4 border-t border-secondary-200">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors hover:underline"
              >
                <Users className="w-4 h-4" />
                Need an account? Contact your school administrator
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SchoolLogin;
