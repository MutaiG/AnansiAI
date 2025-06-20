import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X, Server, Code, Cloud } from "lucide-react";
import { apiWithFallback } from "@/services/apiWithFallback";
import { autoApiService } from "@/services/cloudApiService";

const DevelopmentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  useEffect(() => {
    const isDev =
      import.meta.env.DEV || import.meta.env.VITE_ENVIRONMENT === "development";

    // Check if we're in a cloud environment
    const isCloudEnv =
      window.location.hostname.includes("builder.codes") ||
      window.location.hostname.includes("fly.dev") ||
      window.location.hostname.includes("netlify.app") ||
      window.location.hostname.includes("vercel.app");

    if (isDev) {
      setIsVisible(true);

      // In cloud environments, assume fallback mode
      if (isCloudEnv) {
        setIsUsingFallback(true);
      } else {
        // Check if using fallback periodically for local development
        const checkFallback = () => {
          setIsUsingFallback(apiWithFallback.isUsingFallback());
        };

        checkFallback();
        const interval = setInterval(checkFallback, 2000);

        return () => clearInterval(interval);
      }
    }
  }, []);

  const handleRetryAPI = () => {
    // Only allow retry if not in cloud mode
    if (!autoApiService) {
      apiWithFallback.resetFallbackMode();
      setIsUsingFallback(false);
    }
  };

  if (!isVisible) return null;

  return (
    <Alert className="border-blue-200 bg-blue-50 text-blue-800 mb-4">
      {autoApiService ? (
        <Cloud className="h-4 w-4" />
      ) : (
        <Code className="h-4 w-4" />
      )}
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {autoApiService ? (
            <>
              <span className="font-medium">🌐 Cloud Development Mode</span>
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  ✨ Premium mock data - Zero network calls
                </span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  Fly.dev
                </span>
              </div>
            </>
          ) : (
            <>
              <span className="font-medium">🚧 Development Mode</span>
              {isUsingFallback ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    🧪 Using comprehensive mock data - Perfect for development
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRetryAPI}
                    className="h-6 text-xs border-blue-300 hover:bg-blue-100"
                  >
                    <Server className="w-3 h-3 mr-1" />
                    Retry API
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm">🚀 Connected to Live Backend</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    Real Data
                  </span>
                </div>
              )}
            </>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-200"
        >
          <X className="h-3 w-3" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default DevelopmentBanner;
