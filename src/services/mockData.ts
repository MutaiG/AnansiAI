// Development Mock Data Fallback Service
// This provides mock data when the API is not available during development

import type {
  ApiResponse,
  School,
  SystemStats,
  SystemAlert,
  Notification,
  SuperAdminInfo,
} from "./api";

// Mock delay to simulate network requests
const mockDelay = (ms: number = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Mock Schools Data
const mockSchools: School[] = [
  {
    id: "SCH001",
    name: "Nairobi Academy",
    code: "NAC",
    county: "Nairobi",
    subcounty: "Westlands",
    ward: "Parklands",
    students: 1250,
    teachers: 85,
    status: "active",
    performance: 89,
    aiAccuracy: 94,
    lastSync: "2 min ago",
    adminName: "Dr. Sarah Johnson",
    adminEmail: "admin@nairobiacademy.ac.ke",
    adminPhone: "+254 701 234 567",
    establishedYear: 1985,
    type: "secondary",
    createdAt: "2023-01-15T10:30:00Z",
    updatedAt: "2024-01-15T14:20:00Z",
  },
  {
    id: "SCH002",
    name: "Mombasa International School",
    code: "MIS",
    county: "Mombasa",
    subcounty: "Nyali",
    ward: "Frere Town",
    students: 890,
    teachers: 62,
    status: "active",
    performance: 86,
    aiAccuracy: 91,
    lastSync: "5 min ago",
    adminName: "Mr. James Kiprotich",
    adminEmail: "admin@mis.ac.ke",
    adminPhone: "+254 722 345 678",
    establishedYear: 1992,
    type: "mixed",
    createdAt: "2023-02-10T09:15:00Z",
    updatedAt: "2024-01-14T16:45:00Z",
  },
  {
    id: "SCH003",
    name: "Kakamega Girls High School",
    code: "KGH",
    county: "Kakamega",
    subcounty: "Lurambi",
    ward: "Mahiakalo",
    students: 980,
    teachers: 68,
    status: "maintenance",
    performance: 91,
    aiAccuracy: 96,
    lastSync: "1 hour ago",
    adminName: "Mrs. Grace Wanjiku",
    adminEmail: "admin@kgh.ac.ke",
    adminPhone: "+254 733 456 789",
    establishedYear: 1956,
    type: "secondary",
    createdAt: "2023-01-20T11:00:00Z",
    updatedAt: "2024-01-13T08:30:00Z",
  },
];

// Mock System Stats
const mockSystemStats: SystemStats = {
  totalSchools: 247,
  totalStudents: 156780,
  totalTeachers: 8945,
  avgPerformance: 84.2,
  systemUptime: 99.8,
  dataStorage: 72.3,
  activeUsers: 89542,
  dailyLogins: 45620,
};

// Mock Super Admin Info
const mockSuperAdminInfo: SuperAdminInfo = {
  name: "Dr. Robert Martinez",
  id: "SUP-ADM-001",
  role: "Super Administrator",
  avatar: "",
  lastLogin: "Today at 8:45 AM",
  region: "National Education Authority",
  permissions: ["full_access", "user_management", "system_config"],
};

// Mock System Alerts
const mockSystemAlerts: SystemAlert[] = [
  {
    id: "1",
    type: "critical",
    title: "Development Mode Active",
    message: "API server not available. Using mock data for development.",
    school: "System Notice",
    time: "Just now",
    priority: "high",
    actionRequired: false,
  },
  {
    id: "2",
    type: "warning",
    title: "Storage Capacity Warning",
    message:
      "Regional data centers approaching 85% capacity - expansion planning required",
    time: "45 min ago",
    priority: "medium",
    actionRequired: true,
  },
];

// Mock Notifications
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "system",
    title: "Development Mode",
    message: "Frontend is running in development mode with mock data fallback",
    time: "Just now",
    read: false,
    priority: "high",
  },
  {
    id: "2",
    type: "school",
    title: "New School Registration",
    message:
      "Meru Science Academy has completed registration and is pending final approval",
    time: "2 hours ago",
    read: false,
    priority: "medium",
  },
];

// Mock API Service
export class MockApiService {
  static async login(
    userId: string,
    password: string,
  ): Promise<ApiResponse<any>> {
    await mockDelay();

    // Mock validation
    if (userId && password) {
      // Determine role from user ID
      let role = "student";
      if (userId.includes("ADM")) role = "admin";
      else if (userId.includes("TCH")) role = "teacher";
      else if (userId.includes("STU")) role = "student";

      const schoolCode = userId.split("-")[0];
      const mockSchool =
        mockSchools.find((s) => s.code === schoolCode) || mockSchools[0];

      return {
        success: true,
        data: {
          token: "mock_jwt_token_" + Date.now(),
          user: {
            id: userId,
            name: `Mock User ${userId}`,
            email: `${userId.toLowerCase()}@school.ac.ke`,
            role: role,
            schoolId: mockSchool.id,
            status: "active",
            lastActive: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          school: mockSchool,
        },
      };
    }

    return {
      success: false,
      error: "Invalid credentials",
    };
  }

  static async superAdminLogin(
    loginId: string,
    password: string,
  ): Promise<ApiResponse<any>> {
    await mockDelay();

    // Mock super admin validation
    const validCredentials = [
      { id: "SUP-ADM-001", password: "admin123" },
      { id: "SUP-ADM-002", password: "superadmin456" },
    ];

    const isValid = validCredentials.some(
      (cred) => cred.id === loginId && cred.password === password,
    );

    if (isValid) {
      return {
        success: true,
        data: {
          token: "mock_super_admin_token_" + Date.now(),
          user: {
            id: loginId,
            name: "Dr. Robert Martinez",
            email: "superadmin@education.go.ke",
            role: "superadmin",
            schoolId: "",
            status: "active",
            lastActive: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
      };
    }

    return {
      success: false,
      error: "Invalid super admin credentials",
    };
  }

  static async getSchools(): Promise<ApiResponse<School[]>> {
    await mockDelay();
    return {
      success: true,
      data: mockSchools,
    };
  }

  static async getSystemStats(): Promise<ApiResponse<SystemStats>> {
    await mockDelay();
    return {
      success: true,
      data: mockSystemStats,
    };
  }

  static async getSuperAdminInfo(): Promise<ApiResponse<SuperAdminInfo>> {
    await mockDelay();
    return {
      success: true,
      data: mockSuperAdminInfo,
    };
  }

  static async getSystemAlerts(): Promise<ApiResponse<SystemAlert[]>> {
    await mockDelay();
    return {
      success: true,
      data: mockSystemAlerts,
    };
  }

  static async getNotifications(): Promise<ApiResponse<Notification[]>> {
    await mockDelay();
    return {
      success: true,
      data: mockNotifications,
    };
  }

  static async registerSchool(schoolData: any): Promise<ApiResponse<any>> {
    await mockDelay();

    const newSchool: School = {
      id: `SCH${String(mockSchools.length + 1).padStart(3, "0")}`,
      ...schoolData,
      students: 0,
      teachers: 0,
      status: "pending" as const,
      performance: 0,
      aiAccuracy: 0,
      lastSync: "Never",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const adminCredentials = {
      loginId: `${schoolData.code}-ADM-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      password: Math.random().toString(36).slice(-8).toUpperCase(),
    };

    // Add to mock data
    mockSchools.push(newSchool);

    return {
      success: true,
      data: {
        school: newSchool,
        adminCredentials,
      },
    };
  }

  static async resetPassword(
    email: string,
  ): Promise<ApiResponse<{ message: string }>> {
    await mockDelay();
    return {
      success: true,
      data: {
        message: `Password reset instructions sent to ${email}`,
      },
    };
  }
}
