import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  RefreshCw,
  Search,
  Calendar,
  Mail,
  Phone,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  UserCheck,
  UserX,
  Download,
} from "lucide-react";
import axiosClient from "@/services/axiosClient";

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: string;
  schoolName?: string;
  schoolCode?: string;
  county?: string;
  isActive: boolean;
  lastLogin?: string;
  createdDate?: string;
  photoUrl?: string;
}

interface UsersManagementProps {
  onShowMessage?: (message: any) => void;
}

const UsersManagement: React.FC<UsersManagementProps> = ({ onShowMessage }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dialog states
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("👥 Fetching users from API...");

      // Fetch users from multiple roles since this is Super Admin Dashboard
      const roleRequests = ["admin", "teacher", "student", "superadmin"].map(
        (role) =>
          axiosClient
            .get(`/api/Users/get-users-by-role?roleName=${role}`)
            .catch((error) => {
              console.warn(`⚠️ Failed to fetch ${role} users:`, error.message);
              return { data: [] };
            }),
      );

      const responses = await Promise.all(roleRequests);
      console.log(
        "✅ Users API responses:",
        responses.map((r) => r.data),
      );

      // Combine all user data from different roles
      const allUsersData = responses.reduce((acc, response) => {
        // Handle different possible response structures
        let userData = response.data;

        // If response.data is already an array, use it directly
        if (Array.isArray(userData)) {
          return acc.concat(userData);
        }

        // If response.data has a 'data' property, use that
        if (userData && userData.data && Array.isArray(userData.data)) {
          return acc.concat(userData.data);
        }

        // If response.data is a single object, wrap it in an array
        if (userData && typeof userData === "object") {
          return acc.concat([userData]);
        }

        // If nothing valid, skip this response
        return acc;
      }, []);

      // Transform API data to match UI expectations
      const transformedUsers = Array.isArray(allUsersData)
        ? allUsersData.map((user, index) => ({
            id: user.id || user.userId || String(index + 1),
            fullName:
              `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
              "Unknown User",
            email: user.email || "N/A",
            phoneNumber: user.phoneNumber || "",
            role: user.role?.name || user.roleName || "Unknown",
            schoolName: user.schoolName || "N/A",
            schoolCode: user.schoolCode || "N/A",
            county: user.county || "N/A",
            isActive: user.isActive !== undefined ? user.isActive : true,
            lastLogin: user.lastLogin
              ? new Date(user.lastLogin).toLocaleDateString()
              : "Never",
            createdDate: user.createdDate || new Date().toISOString(),
            photoUrl: user.photoUrl || "",
          }))
        : [];

      setUsers(transformedUsers);
      console.log(
        `✅ Successfully loaded ${transformedUsers.length} users from API`,
      );

      onShowMessage?.({
        id: Date.now().toString(),
        type: "success",
        priority: "medium",
        title: "Users Loaded",
        message: `✅ Loaded ${transformedUsers.length} users from API`,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error("❌ Failed to fetch users:", error);
      setError("Failed to load users");
      setUsers([]);

      onShowMessage?.({
        id: Date.now().toString(),
        type: "error",
        priority: "high",
        title: "API Error",
        message: `❌ Failed to load users: ${error.message}`,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setLoading(true);
    try {
      console.log(`🗑️ Attempting to delete user ${selectedUser.id}`);

      // The API doesn't have a delete endpoint, so we show an error message
      console.warn("⚠️ Delete endpoint not available in API");

      setIsDeleteDialogOpen(false);
      setSelectedUser(null);

      onShowMessage?.({
        id: Date.now().toString(),
        type: "error",
        priority: "high",
        title: "Delete Not Available",
        message:
          "User deletion is not supported by the current API. Contact system administrator to add a DELETE /api/Users/{id} endpoint.",
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error("❌ Failed to delete user:", error);

      onShowMessage?.({
        id: Date.now().toString(),
        type: "error",
        priority: "high",
        title: "Deletion Failed",
        message: error.response?.data?.message || "Failed to delete user",
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (user: User) => {
    setLoading(true);
    try {
      const newStatus = !user.isActive;
      console.log(
        `🔄 Attempting to toggle user ${user.id} status to ${newStatus ? "active" : "inactive"}`,
      );

      // The API doesn't have a status update endpoint, so we show an error message
      console.warn("⚠️ Status update endpoint not available in API");

      onShowMessage?.({
        id: Date.now().toString(),
        type: "error",
        priority: "high",
        title: "Status Update Not Available",
        message:
          "User status updates are not supported by the current API. Contact system administrator to add a PUT /api/Users/{id}/status endpoint.",
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error("❌ Failed to update user status:", error);
      onShowMessage?.({
        id: Date.now().toString(),
        type: "error",
        priority: "high",
        title: "Update Failed",
        message:
          error.response?.data?.message || "Failed to update user status",
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const openView = (user: User) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  const openDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleExportUsers = () => {
    const csvContent =
      "data:text/csv;charset=utf-8,Name,Email,Phone,Role,School,Status,Last Login\n" +
      filteredUsers
        .map(
          (user) =>
            `"${user.fullName}","${user.email}","${user.phoneNumber}","${user.role}","${user.schoolName}","${user.isActive ? "Active" : "Inactive"}","${user.lastLogin}"`,
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `anansiai_users_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onShowMessage?.({
      id: Date.now().toString(),
      type: "success",
      priority: "medium",
      title: "Export Complete",
      message: `Successfully exported ${filteredUsers.length} users to CSV file.`,
      timestamp: new Date().toISOString(),
    });
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.schoolName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      filterRole === "all" ||
      user.role.toLowerCase().includes(filterRole.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && user.isActive) ||
      (filterStatus === "inactive" && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "superadmin":
        return "bg-purple-100 text-purple-800";
      case "admin":
        return "bg-blue-100 text-blue-800";
      case "teacher":
        return "bg-green-100 text-green-800";
      case "student":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Users Management</h3>
          <p className="text-gray-600">
            Manage all system users across institutions. View, edit, and manage
            user accounts and permissions.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExportUsers}
            disabled={loading || filteredUsers.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Users
          </Button>
          <Button variant="outline" onClick={fetchUsers} disabled={loading}>
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search users</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by name, email, or school..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div>
                <Label htmlFor="role-filter">Role</Label>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="superadmin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status-filter">Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Users ({filteredUsers.length})
          </CardTitle>
          <CardDescription>
            Manage users and assign permissions across institutions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>School</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Loading users...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="w-8 h-8 text-gray-400" />
                        <p className="text-gray-500">No users found</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={fetchUsers}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Refresh Users
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.photoUrl} />
                            <AvatarFallback className="bg-blue-600 text-white text-xs">
                              {user.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">
                              {user.fullName}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">
                            {user.schoolName}
                          </p>
                          <p className="text-xs text-gray-600">
                            {user.schoolCode} • {user.county}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.isActive)}>
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-3 h-3" />
                          {user.lastLogin}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openView(user)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              disabled
                              className="text-gray-400"
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              Status Toggle (Not Available)
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled
                              className="text-gray-400"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete (Not Available)
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredUsers.length)} of{" "}
                {filteredUsers.length} users
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum =
                      Math.max(1, Math.min(totalPages - 4, currentPage - 2)) +
                      i;
                    if (pageNum > totalPages) return null;

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View User Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information for {selectedUser?.fullName}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.photoUrl} />
                  <AvatarFallback className="bg-blue-600 text-white">
                    {selectedUser.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-lg">
                    {selectedUser.fullName}
                  </h4>
                  <Badge className={getRoleColor(selectedUser.role)}>
                    {selectedUser.role}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Email
                  </Label>
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {selectedUser.email}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Phone
                  </Label>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {selectedUser.phoneNumber || "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    School
                  </Label>
                  <p>{selectedUser.schoolName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    County
                  </Label>
                  <p>{selectedUser.county}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Status
                  </Label>
                  <Badge className={getStatusColor(selectedUser.isActive)}>
                    {selectedUser.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Last Login
                  </Label>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {selectedUser.lastLogin}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedUser?.fullName}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersManagement;
