import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import {
  Eye,
  EyeOff,
  GraduationCap,
  Brain,
  Users,
  Sparkles,
  ArrowLeft,
  Building,
} from "lucide-react";
import SchoolSelector from "@/components/SchoolSelector";

interface School {
  id: string;
  name: string;
  district: string;
  city: string;
  state: string;
  code: string;
}

const Login = () => {
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSchoolSelect = (school: School) => {
    setSelectedSchool(school);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate authentication
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock authentication logic with school-specific user IDs
      if (formData.userId && formData.password && selectedSchool) {
        // Extract school code and user info from ID format: SCH-ROLE-NUMBER
        // Example: LHS-STU-001, LHS-TCH-001, LHS-ADM-001, DIST-SUP-001
        const userIdParts = formData.userId.split("-");

        if (userIdParts.length === 3) {
          const [schoolCode, role, number] = userIdParts;

          // Check if user belongs to selected school (except for district super admins)
          if (
            role !== "SUP" &&
            schoolCode !== selectedSchool.code &&
            selectedSchool.code !== "DIST"
          ) {
            setError(
              `This user ID doesn't belong to ${selectedSchool.name}. Please check your credentials.`,
            );
            setIsLoading(false);
            return;
          }

          // Validate district admin access
          if (role === "SUP" && schoolCode !== "DIST") {
            setError("District Super Admin must use DIST-SUP-XXX format.");
            setIsLoading(false);
            return;
          }

          // Validate school-specific users don't use district login
          if (role !== "SUP" && selectedSchool.code === "DIST") {
            setError(
              "School users cannot login through District Admin portal. Please select your school first.",
            );
            setIsLoading(false);
            return;
          }

          // Determine user type and navigate accordingly
          switch (role) {
            case "STU":
              navigate("/student-dashboard", {
                state: { school: selectedSchool, userId: formData.userId },
              });
              break;
            case "TCH":
              navigate("/teacher-dashboard", {
                state: { school: selectedSchool, userId: formData.userId },
              });
              break;
            case "ADM":
              navigate("/admin-dashboard", {
                state: { school: selectedSchool, userId: formData.userId },
              });
              break;
            case "SUP":
              navigate("/district-dashboard", {
                state: { userId: formData.userId },
              });
              break;
            default:
              setError("Invalid user role. Please check your credentials.");
          }
        } else {
          setError(
            "Invalid ID format. Use format: SCHOOL-ROLE-NUMBER (e.g., LHS-STU-001) or DIST-SUP-001 for district admin",
          );
        }
      } else {
        setError("Please fill in all fields and select a school.");
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

  // Show school selector if no school is selected
  if (!selectedSchool) {
    return <SchoolSelector onSchoolSelect={handleSchoolSelect} />;
  }

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
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8 px-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="https://cdn.builder.io/api/v1/assets/2d09da496e544a1eab05e596d02031d8/twinternet-logo-b18833?format=webp&width=800"
                alt="AnansiAI Logo"
                className="w-12 h-12 object-contain"
              />
              <h1 className="text-4xl font-bold text-gradient">AnansiAI</h1>
            </div>
            <p className="text-xl text-secondary-600 font-medium">
              Intelligent Learning, Personalized Teaching
            </p>
          </div>

          {/* Selected School Info */}
          <div className="p-4 bg-primary-50 rounded-xl border border-primary-200">
            <div className="flex items-center gap-3 mb-2">
              <Building className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-secondary-800">
                Selected School
              </h3>
            </div>
            <p className="text-secondary-800 font-medium">
              {selectedSchool.name}
            </p>
            <p className="text-sm text-secondary-600">
              {selectedSchool.city}, {selectedSchool.state} •{" "}
              {selectedSchool.district}
            </p>
            <p className="text-xs text-secondary-500 mt-1">
              School Code: {selectedSchool.code}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4 group">
              <div className="p-2 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                <GraduationCap className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-800">
                  AI-Powered Learning
                </h3>
                <p className="text-secondary-600">
                  Personalized content that adapts to your learning style
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="p-2 bg-accent-100 rounded-lg group-hover:bg-accent-200 transition-colors">
                <Users className="w-6 h-6 text-accent-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-800">
                  School-Specific Environment
                </h3>
                <p className="text-secondary-600">
                  Secure access to your school's courses and community
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="p-2 bg-warning-100 rounded-lg group-hover:bg-warning-200 transition-colors">
                <Sparkles className="w-6 h-6 text-warning-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-800">
                  Smart Analytics
                </h3>
                <p className="text-secondary-600">
                  Track progress within your school's curriculum
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <Card className="card-elevated">
            <CardHeader className="space-y-2 text-center">
              <div className="mx-auto p-3 bg-primary-100 rounded-xl w-fit lg:hidden mb-4">
                <Brain className="w-8 h-8 text-primary-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-secondary-800">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-secondary-600">
                Sign in to {selectedSchool.name}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* School Change Option */}
              <div className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSchool(null)}
                  className="text-primary-600 hover:text-primary-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Change School
                </Button>
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
                    User ID
                  </Label>
                  <Input
                    id="userId"
                    name="userId"
                    type="text"
                    placeholder={
                      selectedSchool.code === "DIST"
                        ? "DIST-SUP-001"
                        : `${selectedSchool.code}-STU-001 or ${selectedSchool.code}-TCH-001`
                    }
                    value={formData.userId}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                  <div className="text-xs text-secondary-500 space-y-1">
                    {selectedSchool.code === "DIST" ? (
                      <>
                        <p>District Administrator Format: DIST-SUP-NUMBER</p>
                        <p>Example: DIST-SUP-001</p>
                        <p>Access: All schools in the district</p>
                      </>
                    ) : (
                      <>
                        <p>Format: SCHOOL-ROLE-NUMBER</p>
                        <p>Roles: STU (Student), TCH (Teacher), ADM (Admin)</p>
                        <p>Example: {selectedSchool.code}-STU-001</p>
                      </>
                    )}
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
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-secondary-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-secondary-500">
                      Need help?
                    </span>
                  </div>
                </div>

                <Link
                  to="/signup"
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  Contact your school administrator for access
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
