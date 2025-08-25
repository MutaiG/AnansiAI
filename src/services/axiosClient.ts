// Simple Axios Client - Direct API Integration
import axios from "axios";

// Get API URL from environment variable or fallback
const getOptimalApiUrl = () => {
  const isHttps = window.location.protocol === "https:";
  const isDevelopment =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  // Use environment variable if available, otherwise fallback
  const envApiUrl = import.meta.env.VITE_API_URL;
  const fallbackUrl = "http://13.61.176.255/anansiai";

  const apiUrl = envApiUrl && envApiUrl !== "https://api-not-available.example.com/api"
    ? envApiUrl
    : fallbackUrl;

  console.log("🔧 API Configuration:", {
    currentProtocol: window.location.protocol,
    hostname: window.location.hostname,
    isDevelopment,
    isHttps,
    envApiUrl,
    selectedApiUrl: apiUrl,
    source: envApiUrl ? "environment variable" : "fallback"
  });

  // Check for mixed content issues
  const apiProtocol = apiUrl.startsWith("https:") ? "https:" : "http:";
  if (isHttps && apiProtocol === "http:" && !isDevelopment) {
    console.warn("⚠️ Mixed Content Warning: HTTPS frontend -> HTTP API");
    console.warn("💡 This will be blocked by browser security policy");
    console.warn("🔧 Solutions:");
    console.warn("  1. Configure HTTPS on API server (recommended)");
    console.warn("  2. Deploy frontend on HTTP for development");
    console.warn("  3. Use a CORS proxy service");
  }

  return apiUrl;
};

const API_BASE_URL = getOptimalApiUrl();

// Debug: Log the URL being used
console.log("🔧 API Base URL:", API_BASE_URL);
console.log("🔧 Protocol Selection:", {
  currentProtocol: window.location.protocol,
  selectedApiUrl: API_BASE_URL,
  reason: "HTTP forced for development - API server doesn't support HTTPS",
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
    // Check multiple possible token keys
    const token = localStorage.getItem("anansi_token") ||
                  localStorage.getItem("authToken") ||
                  localStorage.getItem("auth_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔐 Using auth token for request");
    } else {
      console.warn("⚠️ No auth token found - API may return 401 Unauthorized");
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
        "�� Suggestion: Check if API server supports HTTPS at this IP",
      );
    } else if (
      error.code === "ERR_NETWORK" ||
      error.message === "Network Error"
    ) {
      console.error("🚫 Network Error - Most likely HTTPS certificate issue");
      console.error("• Trying to connect to:", API_BASE_URL);
      console.error(
        "�� Issue: IP address",
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
    const baseUrl = "13.61.176.255/anansiai";
  const isHttps = window.location.protocol === "https:";

  // Test order: prioritize HTTPS if we're on HTTPS, otherwise HTTP first
  const protocols = isHttps ? ["https", "http"] : ["http", "https"];

  console.log("🔍 Testing API connection with different protocols...");
  console.log(`🌐 Current page protocol: ${window.location.protocol}`);

  for (const protocol of protocols) {
    const testUrl = `${protocol}://${baseUrl}/api/Institutions`;
    try {
      console.log(`🧪 Testing ${protocol.toUpperCase()}:`, testUrl);

      // For mixed content scenarios, we need to handle differently
      if (isHttps && protocol === "http") {
        console.log("⚠️ Mixed content detected - HTTPS page trying HTTP API");
        console.log("💡 This will be blocked by browser security policy");
        continue; // Skip HTTP test when on HTTPS to avoid blocked requests
      }

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

      // Provide specific guidance for mixed content errors
      if (isHttps && protocol === "http") {
        console.log(
          "🚫 Mixed Content Error: HTTPS pages cannot access HTTP APIs",
        );
        console.log("💡 Solutions:");
        console.log("  1. Configure SSL certificate on your API server");
        console.log("  2. Use a reverse proxy with HTTPS");
        console.log("  3. Deploy frontend on HTTP for development");
      }
    }
  }

  // Special handling for mixed content scenarios
  if (isHttps) {
    console.log("🔄 Mixed content detected - suggesting fallback solutions");
    console.log("💡 Fallback options:");
    console.log("  1. Configure API server with HTTPS support");
    console.log("  2. Use a CORS proxy service");
    console.log("  3. Deploy this app on HTTP for development");
    return {
      success: false,
      mixedContent: true,
      suggestion:
        "Configure HTTPS on API server or use HTTP deployment for development",
    };
  }

  console.log("❌ All protocols failed - API server may be down");
  return { success: false };
};

export default axiosClient;
