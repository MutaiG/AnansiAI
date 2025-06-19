// API Service with Development Fallback
// This wrapper automatically falls back to mock data when the API is unavailable

import { apiClient, type ApiResponse } from "./api";
import { MockApiService } from "./mockData";

const IS_DEVELOPMENT =
  import.meta.env.VITE_ENVIRONMENT === "development" || import.meta.env.DEV;

// Helper to determine if we should use fallback
let useFallback = false;
let fallbackWarningShown = false;

const showFallbackWarning = () => {
  if (!fallbackWarningShown && IS_DEVELOPMENT) {
    console.warn("🔄 API Fallback Mode Activated");
    console.warn("📡 Backend API server is not available");
    console.warn("🧪 Using mock data for development");
    console.warn("💡 Start your backend server to use real API calls");
    fallbackWarningShown = true;
  }
};

// Generic wrapper function
async function withFallback<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  fallbackCall: () => Promise<ApiResponse<T>>,
  operationName: string = "API operation",
): Promise<ApiResponse<T>> {
  // If we already know to use fallback, skip API call
  if (useFallback && IS_DEVELOPMENT) {
    showFallbackWarning();
    return fallbackCall();
  }

  try {
    return await apiCall();
  } catch (error) {
    if (IS_DEVELOPMENT) {
      console.warn(
        `⚠️ ${operationName} failed, falling back to mock data:`,
        error,
      );
      useFallback = true; // Remember for future calls
      showFallbackWarning();
      return fallbackCall();
    } else {
      // In production, throw the error normally
      throw error;
    }
  }
}

// Enhanced API client with fallback
export const apiWithFallback = {
  // Authentication
  async login(userId: string, password: string) {
    return withFallback(
      () => apiClient.login(userId, password),
      () => MockApiService.login(userId, password),
      "Login",
    );
  },

  async superAdminLogin(loginId: string, password: string) {
    return withFallback(
      () => apiClient.superAdminLogin(loginId, password),
      () => MockApiService.superAdminLogin(loginId, password),
      "Super Admin Login",
    );
  },

  async resetPassword(email: string) {
    return withFallback(
      () => apiClient.resetPassword(email),
      () => MockApiService.resetPassword(email),
      "Password Reset",
    );
  },

  // Data fetching
  async getSchools() {
    return withFallback(
      () => apiClient.getSchools(),
      () => MockApiService.getSchools(),
      "Get Schools",
    );
  },

  async getSystemStats() {
    return withFallback(
      () => apiClient.getSystemStats(),
      () => MockApiService.getSystemStats(),
      "Get System Stats",
    );
  },

  async getSuperAdminInfo() {
    return withFallback(
      () => apiClient.getSuperAdminInfo(),
      () => MockApiService.getSuperAdminInfo(),
      "Get Super Admin Info",
    );
  },

  async getSystemAlerts() {
    return withFallback(
      () => apiClient.getSystemAlerts(),
      () => MockApiService.getSystemAlerts(),
      "Get System Alerts",
    );
  },

  async getNotifications() {
    return withFallback(
      () => apiClient.getNotifications(),
      () => MockApiService.getNotifications(),
      "Get Notifications",
    );
  },

  async registerSchool(schoolData: any) {
    return withFallback(
      () => apiClient.registerSchool(schoolData),
      () => MockApiService.registerSchool(schoolData),
      "Register School",
    );
  },

  // Utility methods
  logout() {
    return apiClient.logout();
  },

  // Reset fallback mode (useful for retrying real API)
  resetFallbackMode() {
    useFallback = false;
    fallbackWarningShown = false;
    console.info("🔄 API fallback mode reset - will retry real API calls");
  },

  // Check if currently using fallback
  isUsingFallback() {
    return useFallback;
  },
};

// Export for backward compatibility
export { apiClient };
export default apiWithFallback;
