// Simple Axios Client - Direct API Integration
import axios from "axios";

// Force HTTP for IP address - IP addresses cannot have valid SSL certificates
const getOptimalApiUrl = () => {
  // IP addresses cannot obtain valid SSL certificates, so always use HTTP
  // Note: This will cause mixed content warnings on HTTPS sites, but it's the only way
  return "http://13.60.98.134/anansiai";
};

const API_BASE_URL = getOptimalApiUrl();

// Debug: Log the URL being used
console.log("🔧 API Base URL:", API_BASE_URL);
console.log("🔧 Protocol Selection:", {
  currentProtocol: window.location.protocol,
  selectedApiUrl: API_BASE_URL,
  reason:
    window.location.protocol === "https:"
      ? "HTTPS required (mixed content)"
      : "HTTP preferred (development)",
});

// Create axios instance with base configuration
export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds for slower server responses
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add request interceptor for auth tokens and debugging
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Debug: Log every request URL to confirm correct endpoint
    console.log("🌐 Making API request to:", config.baseURL + config.url);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add response interceptor for error handling
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error);

    // Log detailed error information for debugging
    if (error.code === "ECONNABORTED" && error.message.includes("timeout")) {
      console.error("⏰ Request Timeout - API server is responding slowly");
      console.error("• Server:", API_BASE_URL);
      console.error("• Timeout exceeded, server not responding fast enough");
      console.error(
        "💡 Suggestion: Check if API server supports HTTPS at this IP",
      );
    } else if (
      error.code === "ERR_NETWORK" ||
      error.message === "Network Error"
    ) {
      console.error("🚫 Network Error - Most likely HTTPS certificate issue");
      console.error("• Trying to connect to:", API_BASE_URL);
      console.error(
        "• Issue: IP address",
        API_BASE_URL.replace(/https?:\/\//, "").split("/")[0],
        "may not have valid HTTPS certificate",
      );
      console.error("💡 Solutions:");
      console.error("  1. Configure SSL certificate on your API server");
      console.error("  2. Use a domain name instead of IP address");
      console.error("  3. Set up a reverse proxy with proper SSL");
      console.error("  4. For development: consider using HTTP instead");
    }

    return Promise.reject(error);
  },
);

// Connection test function to help diagnose issues
export const testApiConnection = async () => {
  const protocols = ["https", "http"];
  const baseUrl = "13.60.98.134/anansiai";

  console.log("🔍 Testing API connection with different protocols...");

  for (const protocol of protocols) {
    const testUrl = `${protocol}://${baseUrl}/api/Institutions`;
    try {
      console.log(`🧪 Testing ${protocol.toUpperCase()}:`, testUrl);
      const response = await axios.get(testUrl, {
        timeout: 10000,
        headers: { Accept: "application/json" },
      });

      if (response.status >= 200 && response.status < 300) {
        console.log(`✅ ${protocol.toUpperCase()} connection successful!`);
        console.log(
          `💡 Recommendation: Use ${protocol}://${baseUrl} as your API URL`,
        );
        return { success: true, protocol, url: testUrl, data: response.data };
      }
    } catch (error: any) {
      console.log(`❌ ${protocol.toUpperCase()} failed:`, error.message);
    }
  }

  console.log("❌ All protocols failed - API server may be down");
  return { success: false };
};

export default axiosClient;
