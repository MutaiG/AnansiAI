import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X, Server, Code } from "lucide-react";
import { apiWithFallback } from "@/services/apiWithFallback";

const DevelopmentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  useEffect(() => {
    const isDev =
      import.meta.env.DEV || import.meta.env.VITE_ENVIRONMENT === "development";

    if (isDev) {
      setIsVisible(true);

      // Check if using fallback periodically
      const checkFallback = () => {
        setIsUsingFallback(apiWithFallback.isUsingFallback());
      };

      checkFallback();
      const interval = setInterval(checkFallback, 2000);

      return () => clearInterval(interval);
    }
  }, []);

  const handleRetryAPI = () => {
    apiWithFallback.resetFallbackMode();
    setIsUsingFallback(false);
  };

  if (!isVisible) return null;

  return (
    <Alert className="border-amber-200 bg-amber-50 text-amber-800 mb-4">
      <Code className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-medium">🚧 Development Mode</span>
          {isUsingFallback ? (
            <div className="flex items-center gap-2">
              <span className="text-sm">
                Using mock data - API server not available
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRetryAPI}
                className="h-6 text-xs border-amber-300 hover:bg-amber-100"
              >
                <Server className="w-3 h-3 mr-1" />
                Retry API
              </Button>
            </div>
          ) : (
            <span className="text-sm">Connected to live API</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="h-6 w-6 p-0 text-amber-600 hover:bg-amber-200"
        >
          <X className="h-3 w-3" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default DevelopmentBanner;
