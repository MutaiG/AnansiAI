import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
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

      <div className="relative text-center space-y-8 max-w-md">
        <div className="space-y-4">
          <div className="mx-auto p-4 bg-primary-100 rounded-2xl w-fit">
            <img
              src="https://cdn.builder.io/api/v1/assets/2d09da496e544a1eab05e596d02031d8/twinternet-logo-b18833?format=webp&width=800"
              alt="AnansiAI Logo"
              className="w-24 h-24 object-contain"
            />
          </div>
          <h1 className="text-6xl font-bold text-gradient">404</h1>
          <h2 className="text-2xl font-bold text-secondary-800">
            Page Not Found
          </h2>
          <p className="text-secondary-600">
            Sorry, we couldn't find the page you're looking for. It might have
            been moved or doesn't exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/login">
            <Button className="btn-primary w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" />
              Go to Login
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>

        <div className="pt-6 border-t border-secondary-200">
          <p className="text-sm text-secondary-500">
            Need help? Contact your administrator or IT support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
