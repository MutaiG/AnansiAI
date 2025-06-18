import { useState, useEffect, useCallback } from "react";
import { apiClient, handleApiError, type ApiResponse } from "../services/api";

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
  return useApi(() => apiClient.getSchools());
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

// Authentication hook
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (userId: string, password: string) => {
    try {
      setLoading(true);
      const response = await apiClient.login(userId, password);

      if (response.success) {
        setIsAuthenticated(true);
        setUser(response.data.user);
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    apiClient.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
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
