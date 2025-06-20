# AnansiAI .NET Backend API

A production-ready .NET 8 Web API backend for the AnansiAI educational platform.

## 🚀 Quick Start

### Prerequisites

- .NET 8 SDK (Download from: https://dotnet.microsoft.com/download/dotnet/8.0)
- SQL Server LocalDB (included with Visual Studio) or SQL Server

### Setup & Run

1. **Navigate to the API directory:**

   ```bash
   cd AnansiAI.Api
   ```

2. **Restore packages:**

   ```bash
   dotnet restore
   ```

3. **Run the application:**

   ```bash
   dotnet run
   ```

4. **Access the API:**
   - Swagger UI: https://localhost:5001
   - API Base URL: https://localhost:5001/api
   - Health Check: https://localhost:5001/health

## 🧪 Test the API

### 1. Test Super Admin Login

```bash
curl -X POST https://localhost:5001/api/auth/super-admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "loginId": "SUP-ADM-001",
    "password": "admin123"
  }'
```

### 2. Test Protected Endpoint (use token from login)

```bash
curl -X GET https://localhost:5001/api/super-admin/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Test School Management

```bash
curl -X GET https://localhost:5001/api/schools \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔧 Connect to Frontend

Update your React app's `.env` file:

```bash
VITE_API_URL=https://localhost:5001/api
```

Your frontend will now connect to the real backend instead of using mock data!

## 📊 Default Data

The API comes pre-seeded with:

### Super Admin Account

- **Login ID:** SUP-ADM-001
- **Password:** admin123
- **Email:** superadmin@education.go.ke

### Sample Schools

- Nairobi Academy (NAC)
- Mombasa International School (MIS)
- Kisumu Primary School (KPS)

### Sample Alerts & Notifications

- System alerts for monitoring
- User notifications for testing

## 🏗️ API Endpoints

### Authentication

- `POST /api/auth/login` - School user login
- `POST /api/auth/super-admin/login` - Super admin login

### Super Admin

- `GET /api/super-admin/profile` - Get admin profile
- `GET /api/super-admin/stats` - Get system statistics
- `GET /api/super-admin/alerts` - Get system alerts

### Schools Management

- `GET /api/schools` - Get all schools (Super Admin)
- `GET /api/schools/{id}` - Get specific school
- `POST /api/schools` - Create new school (Super Admin)
- `PUT /api/schools/{id}` - Update school (Super Admin)
- `DELETE /api/schools/{id}` - Delete school (Super Admin)

### Notifications

- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/{id}/read` - Mark notification as read

### System

- `GET /health` - Health check endpoint

## 🗄️ Database

The API uses **SQL Server LocalDB** by default (automatically created on first run).

### Connection String

```
Server=(localdb)\mssqllocaldb;Database=AnansiAI_Dev;Trusted_Connection=true;MultipleActiveResultSets=true
```

### Manual Database Commands (if needed)

```bash
# Create migration
dotnet ef migrations add InitialCreate

# Update database
dotnet ef database update

# Drop database (reset)
dotnet ef database drop
```

## 🔒 Security Features

- **JWT Authentication:** Secure token-based auth
- **Role-based Authorization:** SuperAdmin, Admin, Teacher, Student
- **CORS Configuration:** Configured for frontend integration
- **Input Validation:** Comprehensive model validation
- **Error Handling:** Structured error responses

## 📝 Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message",
  "error": "Optional error message"
}
```

## 🚀 Production Deployment

### Environment Variables

```bash
ConnectionStrings__DefaultConnection="Your production database connection"
JwtSettings__Key="Your production JWT secret key"
Cors__AllowedOrigins__0="https://your-frontend-domain.com"
```

### Deploy to Azure

1. Create Azure App Service
2. Create Azure SQL Database
3. Configure connection strings
4. Deploy using Visual Studio or GitHub Actions

## 🔧 Development

### Project Structure

```
AnansiAI.Api/
├── Controllers/         # API endpoints
├── Models/
│   ├── Entities/       # Database entities
│   └── DTOs/           # Data transfer objects
├── Data/               # Database context
├── Services/           # Business logic
└── Program.cs          # Application startup
```

### Adding New Features

1. Create entity models in `Models/Entities/`
2. Add DbSet to `AnansiDbContext`
3. Create DTOs in `Models/DTOs/`
4. Implement business logic in `Services/`
5. Create controller in `Controllers/`

## 🎯 What's Next?

Your React frontend should now seamlessly connect to this backend:

1. **Replace mock data** with real API calls
2. **Authentication** works with real JWT tokens
3. **CRUD operations** for schools and users
4. **Real-time data** from SQL Server database
5. **Production-ready** scalability and security

The API is fully compatible with your existing frontend code - just update the environment variable and you're ready to go!
