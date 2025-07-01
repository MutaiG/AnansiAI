// Modern React Hooks for Direct API Integration
import { useState, useEffect, useCallback } from "react";
import { apiService, type ApiResponse } from "@/services/apiService";

// Generic API Hook
export function useApiCall<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = [],
  immediate: boolean = true,
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(immediate);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();

      if (response.success) {
        setData(response.data);
      } else {
        setError(response.error || "Unknown error occurred");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    data,
    loading,
    error,
    refetch: execute,
    isBackendConnected: apiService.getConfig().isBackendAvailable(),
  };
}

// Authentication Hooks
export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.login(email, password);

      if (response.success) {
        apiService.setAuthToken(response.data.token);
        return response.data;
      } else {
        setError(response.error || "Login failed");
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const superAdminLogin = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiService.superAdminLogin(email, password);

        if (response.success) {
          apiService.setAuthToken(response.data.token);
          return response.data;
        } else {
          setError(response.error || "Super admin login failed");
          return null;
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Super admin login failed",
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(() => {
    apiService.clearAuthToken();
  }, []);

  return {
    login,
    superAdminLogin,
    logout,
    loading,
    error,
    isAuthenticated: !!apiService.getAuthToken(),
  };
}

// School Management Hooks
export function useSchools() {
  return useApiCall(() => apiService.getSchools(), []);
}

export function useCreateSchool() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSchool = useCallback(async (schoolData: any) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.createSchool(schoolData);

      if (response.success) {
        return response.data;
      } else {
        setError(response.error || "Failed to create school");
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create school");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createSchool,
    loading,
    error,
  };
}

// System Statistics Hook
export function useSystemStats() {
  return useApiCall(() => apiService.getSystemStats(), []);
}

// System Alerts Hook
export function useSystemAlerts() {
  return useApiCall(() => apiService.getSystemAlerts(), []);
}

// Super Admin Profile Hook
export function useSuperAdminProfile() {
  return useApiCall(() => apiService.getSuperAdminProfile(), []);
}

// Connection Status Hook
export function useApiStatus() {
  const [isConnected, setIsConnected] = useState(
    apiService.getConfig().isBackendAvailable(),
  );
  const [lastChecked, setLastChecked] = useState(new Date());

  const checkConnection = useCallback(async () => {
    const connected = await apiService.healthCheck();
    setIsConnected(connected);
    setLastChecked(new Date());
    return connected;
  }, []);

  useEffect(() => {
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, [checkConnection]);

  return {
    isConnected,
    lastChecked,
    checkConnection,
    baseURL: apiService.getConfig().getBaseURL(),
    isProduction: apiService.getConfig().isProductionMode(),
  };
}

// Real-time Data Hook with Auto-refresh
export function useRealTimeData<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  refreshInterval: number = 30000, // 30 seconds default
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const response = await apiCall();

      if (response.success) {
        setData(response.data);
        setLastUpdated(new Date());
      } else {
        setError(response.error || "Failed to fetch data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Set up auto-refresh
    const interval = setInterval(fetchData, refreshInterval);

    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refetch: fetchData,
  };
}

// Form Submission Hook
export function useApiSubmit<TRequest, TResponse>(
  apiCall: (data: TRequest) => Promise<ApiResponse<TResponse>>,
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = useCallback(
    async (data: TRequest) => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(false);

        const response = await apiCall(data);

        if (response.success) {
          setSuccess(true);
          return response.data;
        } else {
          setError(response.error || "Submission failed");
          return null;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Submission failed");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiCall],
  );

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return {
    submit,
    loading,
    error,
    success,
    reset,
  };
}
