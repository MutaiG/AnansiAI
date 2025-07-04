import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  Brain,
  Lock,
  User,
  BookOpen,
  Users,
  Shield,
  Sparkles,
  Building,
} from "lucide-react";
import axiosClient from "@/services/axiosClient";
import { ApiStatusBadge } from "@/components/ApiStatusIndicator";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    try {
      // Login with direct axios call
      const loginData = {
        email: formData.email,
        password: formData.password,
      };

      const response = await axiosClient.post("/api/Auth/login", loginData);

      if (response.data) {
        // Store auth data
        localStorage.setItem("authToken", response.data.token || "");
        localStorage.setItem("anansi_token", response.data.token || "");
        localStorage.setItem("userRole", response.data.role || "user");
        localStorage.setItem("userEmail", formData.email);

        // Navigate based on role or email pattern
        if (
          formData.email.includes("admin") ||
          formData.email.includes("superadmin") ||
          response.data.role === "superadmin"
        ) {
          navigate("/super-admin-dashboard");
        } else if (response.data.role === "student") {
          navigate("/student-dashboard");
        } else if (response.data.role === "teacher") {
          navigate("/teacher-dashboard");
        } else if (response.data.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          // Default to student dashboard
          navigate("/student-dashboard");
        }
      } else {
        setError("Login failed - invalid response");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.response?.status === 401) {
        setError("Invalid email or password");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center gap-3 justify-center mb-4">
            <img
              src="https://cdn.builder.io/api/v1/assets/2d09da496e544a1eab05e596d02031d8/twinternet-logo-b18833?format=webp&width=800"
              alt="AnansiAI Logo"
              className="w-16 h-16 object-contain"
            />
            <h1 className="text-3xl font-bold text-gradient">AnansiAI</h1>
          </div>
          <p className="text-lg text-secondary-600 font-medium">
            Intelligent Learning Platform
          </p>
          <div className="mt-3">
            <ApiStatusBadge />
          </div>
        </div>

        {/* Login Card */}
        <Card className="card-elevated">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-secondary-800 flex items-center gap-2 justify-center">
              <Building className="w-6 h-6" />
              Sign In
            </CardTitle>
            <CardDescription className="text-secondary-600">
              Access your AnansiAI account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your-email@school.ac.ke"
                    className="pl-10"
                    required
                  />
                </div>
                <div className="text-xs text-secondary-500 space-y-1">
                  <p>
                    <strong>Super Admin:</strong> admin@education.go.ke
                  </p>
                  <p>
                    <strong>Teachers/Students:</strong> user@school.ac.ke
                  </p>
                  <p>Use your institutional email address</p>
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing In...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Sign In
                  </div>
                )}
              </Button>
            </form>

            {/* Additional Options */}
            <div className="pt-4 border-t border-secondary-200 text-center space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-3 bg-primary-50 rounded-lg">
                  <Users className="w-5 h-5 text-primary-600 mx-auto mb-1" />
                  <p className="text-xs text-secondary-600">Students</p>
                </div>
                <div className="text-center p-3 bg-accent-50 rounded-lg">
                  <BookOpen className="w-5 h-5 text-accent-600 mx-auto mb-1" />
                  <p className="text-xs text-secondary-600">Teachers</p>
                </div>
                <div className="text-center p-3 bg-secondary-50 rounded-lg">
                  <Shield className="w-5 h-5 text-secondary-600 mx-auto mb-1" />
                  <p className="text-xs text-secondary-600">Admins</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button variant="ghost" size="sm" className="text-xs">
                  Forgot Password?
                </Button>
                <Button variant="ghost" size="sm" className="text-xs">
                  Contact Support
                </Button>
              </div>
            </div>

            {/* AI Features Notice */}
            <div className="bg-gradient-to-r from-primary-50 to-accent-50 p-3 rounded-lg text-center">
              <div className="flex items-center gap-2 justify-center mb-1">
                <Sparkles className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-medium text-secondary-800">
                  AI-Powered Learning
                </span>
              </div>
              <p className="text-xs text-secondary-600">
                Personalized education with intelligent insights
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
