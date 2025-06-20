import { useState, useEffect, useCallback } from "react";
import { apiClient, handleApiError, type ApiResponse } from "../services/api";
import { apiWithFallback } from "../services/apiWithFallback";
import { autoApiService } from "../services/cloudApiService";
import { authService } from "../services/auth";

// Use cloud service if available, otherwise use fallback service
const apiService = autoApiService || apiWithFallback;

// Generic API hook for any endpoint
export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = [],
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();

      if (response.success) {
        setData(response.data);
      } else {
        setError(response.error || "Failed to fetch data");
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

// Schools hook for Super Admin
export function useSchools() {
  return useApi(() => apiService.getSchools());
}

// Users hook for School Admin
export function useUsers(schoolId?: string) {
  return useApi(() => apiClient.getUsers(schoolId), [schoolId]);
}

// Students hook for Teachers
export function useStudents(schoolId: string) {
  return useApi(() => apiClient.getStudents(schoolId), [schoolId]);
}

// Analytics hook
export function usePlatformAnalytics() {
  return useApi(() => apiClient.getPlatformAnalytics());
}

export function useSchoolAnalytics(schoolId: string) {
  return useApi(() => apiClient.getSchoolAnalytics(schoolId), [schoolId]);
}

// AI Overrides hook
export function useAIOverrides(schoolId?: string) {
  return useApi(() => apiClient.getAIOverrides(schoolId), [schoolId]);
}

// System Status hook
export function useSystemStatus() {
  return useApi(() => apiClient.getSystemStatus());
}

// Super Admin specific hooks
export function useSuperAdminInfo() {
  return useApi(() => apiService.getSuperAdminInfo());
}

export function useSystemStats() {
  return useApi(() => apiService.getSystemStats());
}

export function useSystemAlerts() {
  return useApi(() => apiService.getSystemAlerts());
}

export function useNotifications() {
  return useApi(() => apiService.getNotifications());
}

// Authentication hook using AuthService
export function useAuth() {
  const [authState, setAuthState] = useState(() => authService.getState());

  useEffect(() => {
    const unsubscribe = authService.subscribe(setAuthState);
    return unsubscribe;
  }, []);

  const schoolLogin = async (userId: string, password: string) => {
    return await authService.schoolLogin(userId, password);
  };

  const superAdminLogin = async (loginId: string, password: string) => {
    return await authService.superAdminLogin(loginId, password);
  };

  const logout = () => {
    authService.logout();
  };

  const resetPassword = async (email: string) => {
    return await authService.resetPassword(email);
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    return await authService.changePassword(currentPassword, newPassword);
  };

  return {
    ...authState,
    schoolLogin,
    superAdminLogin,
    logout,
    resetPassword,
    changePassword,
    getRedirectPath: () => authService.getRedirectPath(),
  };
}

// CRUD operations hook
export function useCrud<T>(basePath: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await apiClient["request"]<T[]>(basePath);
      if (response.success) {
        setItems(response.data);
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (data: Partial<T>) => {
    try {
      setLoading(true);
      const response = await apiClient["request"]<T>(basePath, {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (response.success) {
        setItems((prev) => [...prev, response.data]);
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (err) {
      return { success: false, error: handleApiError(err) };
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id: string, data: Partial<T>) => {
    try {
      setLoading(true);
      const response = await apiClient["request"]<T>(`${basePath}/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      if (response.success) {
        setItems((prev) =>
          prev.map((item) => ((item as any).id === id ? response.data : item)),
        );
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (err) {
      return { success: false, error: handleApiError(err) };
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      setLoading(true);
      const response = await apiClient["request"](`${basePath}/${id}`, {
        method: "DELETE",
      });

      if (response.success) {
        setItems((prev) => prev.filter((item) => (item as any).id !== id));
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (err) {
      return { success: false, error: handleApiError(err) };
    } finally {
      setLoading(false);
    }
  };

  return {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  };
}
