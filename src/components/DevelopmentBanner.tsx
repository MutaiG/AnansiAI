import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X, Server, Cloud, Wifi, WifiOff } from "lucide-react";
import { useApiStatus } from "@/hooks/useApiService";

const DevelopmentBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { isConnected, baseURL, isProduction, checkConnection } =
    useApiStatus();

  // Auto-hide banner in production after 5 seconds
  useEffect(() => {
    if (isProduction) {
      const timer = setTimeout(() => setIsVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isProduction]);

  if (!isVisible) return null;

  const getStatusInfo = () => {
    if (isConnected) {
      return {
        icon: isProduction ? Cloud : Server,
        status: isProduction ? "🚀 Live API Connected" : "🔧 Backend Connected",
        description: `Connected to ${baseURL}`,
        badge: isProduction ? "Production" : "Development",
        color: "text-green-600",
        bgColor: "bg-green-50 border-green-200",
      };
    } else {
      return {
        icon: WifiOff,
        status: "🌐 Mock Data Mode",
        description:
          "✨ Using comprehensive mock data - All features available",
        badge: isProduction ? "Offline" : "Dev Mode",
        color: "text-blue-600",
        bgColor: "bg-blue-50 border-blue-200",
      };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <Alert className={`mb-4 ${statusInfo.bgColor}`}>
      <StatusIcon className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between -translate-y-0.5">
        <div className="flex items-center gap-4">
          <span className="font-medium">{statusInfo.status}</span>
          <div className="flex items-center gap-2">
            <span>{statusInfo.description}</span>
            <span
              className={`px-2 py-1 rounded text-xs font-medium bg-blue-200 text-blue-800`}
            >
              {statusInfo.badge}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isConnected && !isProduction && (
            <Button
              variant="ghost"
              size="sm"
              onClick={checkConnection}
              className="h-6 px-2 text-blue-600 hover:text-blue-700"
            >
              <Wifi className="w-3 h-3 mr-1" />
              Retry
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default DevelopmentBanner;
