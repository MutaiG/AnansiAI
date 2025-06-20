# Frontend Integration Guide

## 🛡️ System Stability & Error Handling

### Recent Improvements

The frontend now includes robust error handling and fallback mechanisms:

- ✅ **Automatic API Fallback**: When backend is unavailable, system automatically uses mock data
- ✅ **Null Safety**: All components use proper fallback data patterns
- ✅ **Development Mode**: Graceful degradation with comprehensive mock data
- ✅ **Error Prevention**: Fixed all null reference errors in dashboard components

### Error Handling Best Practices

```typescript
// ✅ CORRECT: Always use fallback data
const schoolsData = schools || [];
const systemStatsData = systemStats || defaultStats;

// ❌ INCORRECT: Direct API data usage
schools.filter(...) // Can cause null reference errors
```

### Expected Development Behavior

- **API Network Errors**: Normal when no backend is running
- **Console Warnings**: Informational messages about fallback mode
- **Application Stability**: Continues working with mock data
- **Zero Crashes**: System handles all error states gracefully

## 🔧 Step 3: Connect Frontend to Real API

### 1. Update Environment Variables

Create `.env` file in your React project:

```bash
# Your API URL
REACT_APP_API_URL=http://localhost:3001/api

# Or production URL
# REACT_APP_API_URL=https://your-api-domain.com/api
```

### 2. Test API Connection

Update one component to use real data:

#### Example: District Dashboard with Real Schools

```typescript
// src/pages/DistrictDashboard.tsx
import { useSchools } from '@/hooks/useApi';

const DistrictDashboard = () => {
  // Replace mock data with real API call
  const { data: schools, loading, error, refetch } = useSchools();

  // Handle real school deletion
  const handleRemoveSchool = async (schoolId: string, schoolName: string) => {
    if (window.confirm(`Are you sure you want to remove ${schoolName}?`)) {
      try {
        await apiClient.deleteSchool(schoolId);
        // Refresh the schools list
        refetch();
        alert(`${schoolName} has been successfully removed!`);
      } catch (error) {
        alert('Failed to remove school. Please try again.');
      }
    }
  };

  if (loading) return <div>Loading schools...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    // Your existing dashboard JSX, but using real 'schools' data
  );
};
```

### 3. Update Login to Use Real Authentication

```typescript
// src/pages/SchoolLogin.tsx
import { useAuth } from "@/hooks/useApi";

const SchoolLogin = () => {
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Use real API login instead of mock
    const result = await login(formData.userId, formData.password);

    if (result.success) {
      // Navigate based on user role from API response
      const { user, school } = result.data;

      switch (user.role) {
        case "student":
          navigate("/student-dashboard", {
            state: { school, userId: user.userId },
          });
          break;
        case "teacher":
          navigate("/teacher-dashboard", {
            state: { school, userId: user.userId },
          });
          break;
        case "admin":
          navigate("/admin-dashboard", {
            state: { school, userId: user.userId },
          });
          break;
        case "superadmin":
          navigate("/district-dashboard", { state: { userId: user.userId } });
          break;
        default:
          setError("Invalid user role");
      }
    } else {
      setError(result.error || "Login failed");
    }

    setIsLoading(false);
  };

  // Rest of your component...
};
```

### 4. Replace All Mock Data Gradually

#### Priority Order:

1. **Authentication** - Login/logout with real tokens
2. **Schools Management** - CRUD operations for Super Admin
3. **User Management** - Create/edit/delete users
4. **Analytics** - Real performance data
5. **AI Twin Chat** - Connect to AI service

### 5. Enhanced Error Handling & Fallback System

The system now includes comprehensive error handling:

#### Automatic API Fallback

```typescript
// src/services/apiWithFallback.ts
export const apiWithFallback = {
  async getSchools() {
    return withFallback(
      () => apiClient.getSchools(),
      () => MockApiService.getSchools(),
      "Get Schools",
    );
  },
  // ... other methods
};
```

#### Component-Level Error Handling

```typescript
// ✅ RECOMMENDED: Use fallback data pattern
const SuperAdminDashboard = () => {
  const { data: schools, loading, error } = useSchools();

  // Always use processed fallback data
  const schoolsData = schools || [];
  const systemStatsData = systemStats || {
    totalSchools: 0,
    totalStudents: 0,
    totalTeachers: 0,
    // ... other defaults
  };

  // Use fallback data in render
  return (
    <div>
      {schoolsData.filter(school => school.active).map(school => (
        <SchoolCard key={school.id} school={school} />
      ))}
    </div>
  );
};
```

#### Error Boundary for Unexpected Errors

```typescript
// src/components/ErrorBoundary.tsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('API Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">
              Please refresh the page or contact support
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

#### Development Mode Benefits

- **Immediate Development**: Start building without backend setup
- **Realistic Data**: Comprehensive mock data for all features
- **Error Prevention**: Null reference errors eliminated
- **Smooth Transition**: Easy migration to real API when ready

### 6. Loading States

```typescript
// src/components/LoadingSpinner.tsx
export const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
  </div>
);

// Usage in components
if (loading) return <LoadingSpinner />;
```

### 7. Real-time Updates (Optional)

```typescript
// src/hooks/useRealTimeUpdates.ts
import { useEffect } from "react";
import io from "socket.io-client";

export const useRealTimeUpdates = (userId: string) => {
  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL);

    socket.on("school-updated", (data) => {
      // Refresh school data
      console.log("School updated:", data);
    });

    socket.on("user-created", (data) => {
      // Refresh user list
      console.log("New user:", data);
    });

    return () => socket.disconnect();
  }, [userId]);
};
```

## ���� Migration Strategy

### Week 1: Core Infrastructure

- [x] Set up backend API
- [x] Database setup
- [x] Authentication endpoints
- [ ] Test with Postman/Insomnia

### Week 2: Authentication

- [ ] Replace mock login with real API
- [ ] JWT token management
- [ ] Protected routes

### Week 3: Data Management

- [ ] Schools CRUD (Super Admin)
- [ ] Users CRUD
- [ ] Real data in dashboards

### Week 4: Advanced Features

- [ ] Analytics API
- [ ] AI Twin integration
- [ ] Real-time updates
- [ ] File uploads

## 🧪 Testing Your API

### Using curl:

```bash
# Test login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userId":"DIST-SUP-001","password":"password"}'

# Test schools (with token)
curl -X GET http://localhost:3001/api/schools \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman:

1. Create collection for AnansiAI API
2. Add requests for each endpoint
3. Test authentication flow
4. Verify data responses

## 🚀 Production Deployment

### Backend (API):

- **Heroku**: Easy deployment
- **Railway**: Modern platform
- **DigitalOcean**: App platform
- **AWS**: EC2 + RDS

### Database:

- **MongoDB Atlas**: Managed MongoDB
- **Supabase**: PostgreSQL + API
- **PlanetScale**: MySQL
- **AWS RDS**: Managed SQL

### Frontend:

- **Vercel**: Automatic React deployment
- **Netlify**: JAMstack platform
- **AWS S3 + CloudFront**: Custom setup
