// Mixed Content Helper - Handles HTTPS -> HTTP API connection issues
// Provides fallback mechanisms for production deployments with mixed content restrictions

export interface MixedContentSolution {
  type: "proxy" | "fallback" | "https";
  url: string;
  description: string;
  available: boolean;
}

export class MixedContentHelper {
  private static instance: MixedContentHelper;

  static getInstance(): MixedContentHelper {
    if (!MixedContentHelper.instance) {
      MixedContentHelper.instance = new MixedContentHelper();
    }
    return MixedContentHelper.instance;
  }

  // Check if current environment has mixed content issues
  hasMixedContentIssue(): boolean {
    const isHttps = window.location.protocol === "https:";
    const apiUrl = "http://13.60.98.134/anansiai"; // Current API is HTTP only
    const apiIsHttp = apiUrl.startsWith("http://");

    return isHttps && apiIsHttp;
  }

  // Get available solutions for mixed content
  getAvailableSolutions(): MixedContentSolution[] {
    const solutions: MixedContentSolution[] = [
      {
        type: "https",
        url: "https://13.60.98.134/anansiai",
        description:
          "Try HTTPS version of the API (requires SSL certificate on server)",
        available: true,
      },
      {
        type: "proxy",
        url: `${window.location.origin}/api-proxy`,
        description:
          "Use server-side proxy to forward requests (requires backend implementation)",
        available: false, // Would need backend proxy setup
      },
      {
        type: "fallback",
        url: "demo-mode",
        description: "Use demo mode with sample data (for testing only)",
        available: true,
      },
    ];

    return solutions;
  }

  // Attempt to resolve mixed content by testing HTTPS version
  async testHttpsApi(): Promise<{ success: boolean; error?: string }> {
    try {
      const httpsUrl = "https://13.60.98.134/anansiai/api/Institutions";

      const response = await fetch(httpsUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        // Don't include credentials for CORS preflight
        mode: "cors",
      });

      if (response.ok) {
        return { success: true };
      } else {
        return {
          success: false,
          error: `HTTPS API returned ${response.status}: ${response.statusText}`,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "HTTPS API connection failed",
      };
    }
  }

  // Create a fallback axios instance that tries HTTPS first
  async createFallbackClient() {
    const { default: axios } = await import("axios");

    // Test if HTTPS version works
    const httpsTest = await this.testHttpsApi();

    const baseURL = httpsTest.success
      ? "https://13.60.98.134/anansiai"
      : "http://13.60.98.134/anansiai"; // This will fail in HTTPS context but provides clear error

    console.log(`🔄 Mixed Content Helper: Using ${baseURL}`);

    if (!httpsTest.success && this.hasMixedContentIssue()) {
      console.warn("⚠️ Mixed Content Issue: HTTPS page cannot access HTTP API");
      console.warn(
        "💡 Consider: 1) Configure SSL on API server, 2) Use HTTP deployment for development",
      );
    }

    const client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // Add auth interceptor
    client.interceptors.request.use((config) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return client;
  }

  // Generate user-friendly error message for mixed content
  getMixedContentErrorMessage(): string {
    if (!this.hasMixedContentIssue()) {
      return "No mixed content issue detected.";
    }

    return `
🚫 Mixed Content Security Error

Your application is running on HTTPS but trying to connect to an HTTP API, which browsers block for security.

Quick Solutions:
1. 🔧 Configure SSL certificate on your API server (13.60.98.134)
2. 🌐 Deploy this application on HTTP for development (not recommended for production)
3. 🔄 Use a reverse proxy with HTTPS support

Technical Details:
• App URL: ${window.location.origin} (HTTPS)
• API URL: http://13.60.98.134/anansiai (HTTP)
• Issue: Browser blocks HTTPS → HTTP requests
    `.trim();
  }

  // Check if demo mode should be enabled
  shouldUseDemoMode(): boolean {
    return (
      this.hasMixedContentIssue() &&
      localStorage.getItem("forceDemoMode") === "true"
    );
  }

  // Enable/disable demo mode
  setDemoMode(enabled: boolean): void {
    if (enabled) {
      localStorage.setItem("forceDemoMode", "true");
      console.log("📱 Demo mode enabled - using sample data");
    } else {
      localStorage.removeItem("forceDemoMode");
      console.log("🌐 Demo mode disabled - attempting real API connection");
    }
  }
}

export default MixedContentHelper;
