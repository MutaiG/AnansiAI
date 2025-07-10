import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import axiosClient from "@/services/axiosClient";

interface UserFormProps {
  user?: any;
  onSave: (userData: any) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phoneNumber: "",
    institutionId: "",
    role: { id: "", name: "" },
  });

  const [institutions, setInstitutions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch institutions and roles
    fetchInstitutions();
    fetchRoles();

    // Pre-fill form if editing user
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        address: user.address || "",
        phoneNumber: user.phoneNumber || "",
        institutionId: user.institutionId || "",
        role: {
          id: user.role?.id || "",
          name: user.role?.name || user.role || "",
        },
      });
    }
  }, [user]);

  const fetchInstitutions = async () => {
    try {
      const response = await axiosClient.get("/api/Institutions");
      const institutionsData = response.data.data || response.data || [];
      setInstitutions(institutionsData);
    } catch (error) {
      console.error("Failed to fetch institutions:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axiosClient.get("/api/Users/get-roles");
      const rolesData = response.data.data || response.data || [];
      setRoles(rolesData);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRoleChange = (roleId: string) => {
    const selectedRole = roles.find((role: any) => role.id === roleId);
    setFormData((prev) => ({
      ...prev,
      role: {
        id: roleId,
        name: selectedRole?.name || "",
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.role.id
    ) {
      alert("Please fill in all required fields");
      setLoading(false);
      return;
    }

    onSave(formData);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="institution">Institution</Label>
        <Select
          value={formData.institutionId.toString()}
          onValueChange={(value) => handleInputChange("institutionId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select institution" />
          </SelectTrigger>
          <SelectContent>
            {institutions.map((institution: any) => (
              <SelectItem
                key={institution.institutionId || institution.id}
                value={(institution.institutionId || institution.id).toString()}
              >
                {institution.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role *</Label>
        <Select value={formData.role.id} onValueChange={handleRoleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role: any) => (
              <SelectItem key={role.id} value={role.id}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : user ? "Update User" : "Create User"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default UserForm;
