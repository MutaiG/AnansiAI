// AnansiAI Platform API Service Layer

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001/api";

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface School {
  id: string;
  name: string;
  code: string;
  district: string;
  city: string;
  state: string;
  students: number;
  teachers: number;
  status: "active" | "maintenance" | "inactive";
  performance: number;
  aiAccuracy: number;
  lastSync: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin" | "superadmin";
  schoolId: string;
  status: "active" | "inactive" | "suspended";
  lastActive: string;
  createdAt: string;
  updatedAt: string;
}

export interface Student extends User {
  role: "student";
  grade: string;
  overallProgress: number;
  courses: string[];
}

export interface Teacher extends User {
  role: "teacher";
  subjects: string[];
  classes: string[];
}

export interface AdminUser extends User {
  role: "admin";
  permissions: string[];
}

export interface AuthResponse {
  token: string;
  user: User;
  school?: School;
}

// API Client Class
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem("anansi_token");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`,
        );
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Authentication Methods
  async login(
    userId: string,
    password: string,
  ): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ userId, password }),
    });

    if (response.success && response.data.token) {
      this.token = response.data.token;
      localStorage.setItem("anansi_token", this.token);
    }

    return response;
  }

  async logout(): Promise<void> {
    this.token = null;
    localStorage.removeItem("anansi_token");
  }

  // School Management Methods (Super Admin)
  async getSchools(): Promise<ApiResponse<School[]>> {
    return this.request<School[]>("/schools");
  }

  async getSchool(schoolId: string): Promise<ApiResponse<School>> {
    return this.request<School>(`/schools/${schoolId}`);
  }

  async createSchool(
    schoolData: Partial<School>,
  ): Promise<ApiResponse<School>> {
    return this.request<School>("/schools", {
      method: "POST",
      body: JSON.stringify(schoolData),
    });
  }

  async updateSchool(
    schoolId: string,
    updates: Partial<School>,
  ): Promise<ApiResponse<School>> {
    return this.request<School>(`/schools/${schoolId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  async deleteSchool(
    schoolId: string,
  ): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/schools/${schoolId}`, {
      method: "DELETE",
    });
  }

  // User Management Methods
  async getUsers(schoolId?: string): Promise<ApiResponse<User[]>> {
    const endpoint = schoolId ? `/schools/${schoolId}/users` : "/users";
    return this.request<User[]>(endpoint);
  }

  async getUser(userId: string): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${userId}`);
  }

  async createUser(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async updateUser(
    userId: string,
    updates: Partial<User>,
  ): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  async deleteUser(userId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/users/${userId}`, {
      method: "DELETE",
    });
  }

  // Student-specific Methods
  async getStudents(schoolId: string): Promise<ApiResponse<Student[]>> {
    return this.request<Student[]>(`/schools/${schoolId}/students`);
  }

  async getStudentProgress(studentId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/students/${studentId}/progress`);
  }

  // Teacher-specific Methods
  async getTeachers(schoolId: string): Promise<ApiResponse<Teacher[]>> {
    return this.request<Teacher[]>(`/schools/${schoolId}/teachers`);
  }

  async getTeacherClasses(teacherId: string): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/teachers/${teacherId}/classes`);
  }

  // Analytics Methods
  async getSchoolAnalytics(schoolId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/schools/${schoolId}/analytics`);
  }

  async getPlatformAnalytics(): Promise<ApiResponse<any>> {
    return this.request<any>("/analytics/platform");
  }

  // AI Management Methods
  async getAIOverrides(schoolId?: string): Promise<ApiResponse<any[]>> {
    const endpoint = schoolId
      ? `/schools/${schoolId}/ai-overrides`
      : "/ai-overrides";
    return this.request<any[]>(endpoint);
  }

  async approveAIOverride(
    overrideId: string,
  ): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(
      `/ai-overrides/${overrideId}/approve`,
      {
        method: "POST",
      },
    );
  }

  async rejectAIOverride(
    overrideId: string,
  ): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(
      `/ai-overrides/${overrideId}/reject`,
      {
        method: "POST",
      },
    );
  }

  // System Health Methods
  async getSystemStatus(): Promise<ApiResponse<any>> {
    return this.request<any>("/system/status");
  }

  async getSystemMetrics(): Promise<ApiResponse<any>> {
    return this.request<any>("/system/metrics");
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Utility functions
export const handleApiError = (error: any) => {
  console.error("API Error:", error);

  if (
    error.message?.includes("401") ||
    error.message?.includes("Unauthorized")
  ) {
    // Redirect to login
    apiClient.logout();
    window.location.href = "/login";
  }

  return error.message || "An unexpected error occurred";
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("anansi_token");
};

export default apiClient;
