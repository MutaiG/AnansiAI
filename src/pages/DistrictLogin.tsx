import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, ArrowLeft, Globe, Shield, Database } from "lucide-react";
import { Link } from "react-router-dom";

const DistrictLogin = () => {
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (formData.userId && formData.password) {
        // Validate Super Admin format
        const userIdParts = formData.userId.split("-");
        if (
          userIdParts.length === 3 &&
          userIdParts[0] === "DIST" &&
          userIdParts[1] === "SUP"
        ) {
          navigate("/district-dashboard", {
            state: { userId: formData.userId },
          });
        } else {
          setError(
            "School users cannot login through Super Admin portal. Please use the school login page.",
          );
        }
      } else {
        setError("Please fill in all fields.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"
          style={{ animationDelay: "-2s" }}
        ></div>
        <div
          className="absolute top-40 left-1/2 w-80 h-80 bg-secondary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"
          style={{ animationDelay: "-4s" }}
        ></div>
      </div>

      <div className="relative w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - District Branding */}
        <div className="hidden lg:block space-y-8 px-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="https://cdn.builder.io/api/v1/assets/2d09da496e544a1eab05e596d02031d8/twinternet-logo-b18833?format=webp&width=800"
                alt="AnansiAI Logo"
                className="w-24 h-24 object-contain"
              />
              <h1 className="text-4xl font-bold text-gradient">AnansiAI</h1>
            </div>
            <p className="text-xl text-secondary-600 font-medium">
              Super Admin Portal
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4 group">
              <div className="p-2 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                <Globe className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-800">
                  Platform-Wide Management
                </h3>
                <p className="text-secondary-600">
                  Oversee and manage all schools using your AnansiAI platform
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="p-2 bg-accent-100 rounded-lg group-hover:bg-accent-200 transition-colors">
                <Shield className="w-6 h-6 text-accent-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-800">
                  Platform Administration
                </h3>
                <p className="text-secondary-600">
                  Control security, users, and platform-wide policies
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="p-2 bg-warning-100 rounded-lg group-hover:bg-warning-200 transition-colors">
                <Database className="w-6 h-6 text-warning-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-800">
                  Global Analytics
                </h3>
                <p className="text-secondary-600">
                  Platform-wide performance and AI effectiveness metrics
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <Card className="card-elevated">
            <CardHeader className="space-y-2 text-center">
              <div className="mx-auto p-6 bg-primary-100 rounded-xl w-fit lg:hidden mb-4">
                <img
                  src="https://cdn.builder.io/api/v1/assets/2d09da496e544a1eab05e596d02031d8/twinternet-logo-b18833?format=webp&width=800"
                  alt="AnansiAI Logo"
                  className="w-24 h-24 object-contain"
                />
              </div>
              <CardTitle className="text-2xl font-bold text-secondary-800">
                Super Admin Access
              </CardTitle>
              <CardDescription className="text-secondary-600">
                Sign in to manage your AnansiAI platform
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  School User Login
                </Link>
              </div>

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
                    Super Admin ID
                  </Label>
                  <Input
                    id="userId"
                    name="userId"
                    type="text"
                    placeholder="DIST-SUP-001"
                    value={formData.userId}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                  <div className="text-xs text-secondary-500 space-y-1">
                    <p>Super Admin Format: DIST-SUP-NUMBER</p>
                    <p>Example: DIST-SUP-001</p>
                    <p>Access: Complete platform administration</p>
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
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Access Super Admin Portal"}
                </Button>
              </form>

              <div className="pt-4 border-t border-secondary-200 text-center">
                <p className="text-sm text-secondary-500">
                  Super Admins have complete control over the entire AnansiAI
                  ecosystem.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DistrictLogin;
