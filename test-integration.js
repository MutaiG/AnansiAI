// AnansiAI Frontend-Backend Integration Test
// This script tests the communication between React frontend and .NET backend

const axios = require("axios");

const BACKEND_URL = "https://localhost:5001/api";
const FRONTEND_URL = "http://localhost:8080";

// Test credentials
const TEST_CREDENTIALS = {
  loginId: "SUP-ADM-001",
  password: "admin123",
};

class IntegrationTester {
  constructor() {
    this.token = null;
    this.testResults = [];
  }

  log(message, type = "info") {
    const timestamp = new Date().toISOString();
    const symbols = { info: "📋", success: "✅", error: "❌", warning: "⚠️" };
    const symbol = symbols[type] || "📋";

    console.log(`${symbol} [${timestamp}] ${message}`);
    this.testResults.push({ timestamp, message, type });
  }

  async testBackendHealth() {
    try {
      this.log("Testing backend health endpoint...");
      const response = await axios.get(
        `${BACKEND_URL.replace("/api", "")}/health`,
        {
          httpsAgent: new (require("https").Agent)({
            rejectUnauthorized: false,
          }),
        },
      );

      if (response.status === 200) {
        this.log(
          `Backend health check passed: ${JSON.stringify(response.data)}`,
          "success",
        );
        return true;
      }
    } catch (error) {
      this.log(`Backend health check failed: ${error.message}`, "error");
      return false;
    }
  }

  async testSuperAdminLogin() {
    try {
      this.log("Testing super admin login...");
      const response = await axios.post(
        `${BACKEND_URL}/auth/super-admin/login`,
        TEST_CREDENTIALS,
        {
          httpsAgent: new (require("https").Agent)({
            rejectUnauthorized: false,
          }),
          headers: { "Content-Type": "application/json" },
        },
      );

      if (response.data.success && response.data.data.token) {
        this.token = response.data.data.token;
        this.log("Super admin login successful", "success");
        this.log(`Token received: ${this.token.substring(0, 20)}...`, "info");
        return true;
      } else {
        this.log(
          `Login failed: ${response.data.error || "Unknown error"}`,
          "error",
        );
        return false;
      }
    } catch (error) {
      this.log(`Login request failed: ${error.message}`, "error");
      return false;
    }
  }

  async testProtectedEndpoint() {
    if (!this.token) {
      this.log("No token available for protected endpoint test", "error");
      return false;
    }

    try {
      this.log("Testing protected endpoint (super-admin/profile)...");
      const response = await axios.get(`${BACKEND_URL}/super-admin/profile`, {
        httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }),
        headers: { Authorization: `Bearer ${this.token}` },
      });

      if (response.data.success) {
        this.log(
          `Profile data received: ${response.data.data.name}`,
          "success",
        );
        return true;
      } else {
        this.log(`Profile request failed: ${response.data.error}`, "error");
        return false;
      }
    } catch (error) {
      this.log(`Protected endpoint test failed: ${error.message}`, "error");
      return false;
    }
  }

  async testSystemStats() {
    if (!this.token) {
      this.log("No token available for system stats test", "error");
      return false;
    }

    try {
      this.log("Testing system stats endpoint...");
      const response = await axios.get(`${BACKEND_URL}/super-admin/stats`, {
        httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }),
        headers: { Authorization: `Bearer ${this.token}` },
      });

      if (response.data.success) {
        const stats = response.data.data;
        this.log(
          `Stats received - Schools: ${stats.totalSchools}, Students: ${stats.totalStudents}`,
          "success",
        );
        return true;
      } else {
        this.log(`Stats request failed: ${response.data.error}`, "error");
        return false;
      }
    } catch (error) {
      this.log(`System stats test failed: ${error.message}`, "error");
      return false;
    }
  }

  async testSchoolsEndpoint() {
    if (!this.token) {
      this.log("No token available for schools test", "error");
      return false;
    }

    try {
      this.log("Testing schools endpoint...");
      const response = await axios.get(`${BACKEND_URL}/schools`, {
        httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }),
        headers: { Authorization: `Bearer ${this.token}` },
      });

      if (response.data.success) {
        const schools = response.data.data;
        this.log(
          `Schools received: ${schools.length} schools found`,
          "success",
        );
        if (schools.length > 0) {
          this.log(
            `First school: ${schools[0].name} (${schools[0].code})`,
            "info",
          );
        }
        return true;
      } else {
        this.log(`Schools request failed: ${response.data.error}`, "error");
        return false;
      }
    } catch (error) {
      this.log(`Schools endpoint test failed: ${error.message}`, "error");
      return false;
    }
  }

  async testFrontendConnectivity() {
    try {
      this.log("Testing frontend connectivity...");
      const response = await axios.get(FRONTEND_URL, { timeout: 5000 });

      if (response.status === 200) {
        this.log("Frontend is accessible", "success");
        return true;
      }
    } catch (error) {
      this.log(`Frontend connectivity test failed: ${error.message}`, "error");
      return false;
    }
  }

  async runAllTests() {
    console.log("🧪 AnansiAI Integration Test Suite");
    console.log("=====================================\n");

    const tests = [
      { name: "Backend Health", fn: () => this.testBackendHealth() },
      {
        name: "Frontend Connectivity",
        fn: () => this.testFrontendConnectivity(),
      },
      { name: "Super Admin Login", fn: () => this.testSuperAdminLogin() },
      { name: "Protected Endpoint", fn: () => this.testProtectedEndpoint() },
      { name: "System Stats", fn: () => this.testSystemStats() },
      { name: "Schools Endpoint", fn: () => this.testSchoolsEndpoint() },
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
      try {
        const result = await test.fn();
        if (result) {
          passed++;
        } else {
          failed++;
        }
      } catch (error) {
        this.log(
          `Test "${test.name}" threw an exception: ${error.message}`,
          "error",
        );
        failed++;
      }
      console.log(""); // Add spacing between tests
    }

    console.log("=====================================");
    console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);

    if (failed === 0) {
      console.log(
        "🎉 All tests passed! Frontend and backend are properly integrated.",
      );
      console.log("\n🚀 Your application is ready for development!");
      console.log("\n📱 Frontend: http://localhost:8080");
      console.log("🔗 Backend: https://localhost:5001");
      console.log("📋 Swagger: https://localhost:5001/swagger");
    } else {
      console.log("⚠️  Some tests failed. Please check the logs above.");
      console.log("\n🔧 Troubleshooting tips:");
      console.log("1. Make sure both frontend and backend are running");
      console.log("2. Check if ports 8080 and 5001 are available");
      console.log(
        "3. Verify .NET backend is running with: dotnet run (in AnansiAI.Api folder)",
      );
      console.log("4. Verify frontend is running with: npm run dev");
    }

    return failed === 0;
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new IntegrationTester();
  tester
    .runAllTests()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error("❌ Integration test suite failed:", error.message);
      process.exit(1);
    });
}

module.exports = IntegrationTester;
