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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  BookOpen,
  Filter,
  Download,
  Upload,
  Link,
} from "lucide-react";
import {
  Subject,
  Curriculum,
  SubjectFormData,
  SubjectFilter,
  SubjectCurriculumRelation,
} from "@/types/curriculum";

interface SubjectManagementProps {
  onSubjectChange?: () => void;
}

const SubjectManagement: React.FC<SubjectManagementProps> = ({
  onSubjectChange,
}) => {
  // State management
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [relations, setRelations] = useState<SubjectCurriculumRelation[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRelationDialogOpen, setIsRelationDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [filter, setFilter] = useState<SubjectFilter>({});

  // Form state
  const [formData, setFormData] = useState<SubjectFormData>({
    name: "",
    description: "",
    code: "",
    curriculumIds: [], // Single curriculum selection via dropdown
  });

  // Load data on mount
  useEffect(() => {
    loadSubjects();
    loadCurriculums();
    loadRelations();
  }, []);

  const loadSubjects = async () => {
    setLoading(true);
    try {
      // Mock data - will be replaced with API calls
      const mockSubjects: Subject[] = [
        {
          id: "1",
          name: "Mathematics",
          description:
            "Core mathematics covering algebra, geometry, and calculus",
          code: "MATH",
          isActive: true,
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-15T10:00:00Z",
        },
        {
          id: "2",
          name: "English Language",
          description: "English language and literature studies",
          code: "ENG",
          isActive: true,
          createdAt: "2024-01-16T10:00:00Z",
          updatedAt: "2024-01-16T10:00:00Z",
        },
        {
          id: "3",
          name: "Science",
          description:
            "Integrated science covering physics, chemistry, and biology",
          code: "SCI",
          isActive: true,
          createdAt: "2024-01-17T10:00:00Z",
          updatedAt: "2024-01-17T10:00:00Z",
        },
        {
          id: "4",
          name: "History",
          description: "World and regional history studies",
          code: "HIST",
          isActive: false,
          createdAt: "2024-01-18T10:00:00Z",
          updatedAt: "2024-01-18T10:00:00Z",
        },
      ];

      setSubjects(mockSubjects);
      console.log("✅ Loaded subjects:", mockSubjects.length);
    } catch (error) {
      console.error("❌ Error loading subjects:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load subjects",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCurriculums = async () => {
    try {
      // Mock curriculum data
      const mockCurriculums: Curriculum[] = [
        {
          id: "1",
          name: "CBC (Competency Based Curriculum)",
          description: "Kenya's current education system",
          code: "CBC",
          isActive: true,
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-15T10:00:00Z",
        },
        {
          id: "2",
          name: "IGCSE",
          description: "Cambridge International curriculum",
          code: "IGCSE",
          isActive: true,
          createdAt: "2024-01-16T10:00:00Z",
          updatedAt: "2024-01-16T10:00:00Z",
        },
        {
          id: "3",
          name: "8-4-4 System",
          description: "Former Kenyan education system",
          code: "8-4-4",
          isActive: false,
          createdAt: "2024-01-17T10:00:00Z",
          updatedAt: "2024-01-17T10:00:00Z",
        },
      ];

      setCurriculums(mockCurriculums);
    } catch (error) {
      console.error("❌ Error loading curriculums:", error);
    }
  };

  const loadRelations = async () => {
    try {
      // Mock relationship data
      const mockRelations: SubjectCurriculumRelation[] = [
        {
          id: "r1",
          subjectId: "1",
          curriculumId: "1",
          createdAt: "2024-01-15T10:00:00Z",
        },
        {
          id: "r2",
          subjectId: "1",
          curriculumId: "2",
          createdAt: "2024-01-15T10:00:00Z",
        },
        {
          id: "r3",
          subjectId: "2",
          curriculumId: "1",
          createdAt: "2024-01-16T10:00:00Z",
        },
        {
          id: "r4",
          subjectId: "3",
          curriculumId: "1",
          createdAt: "2024-01-17T10:00:00Z",
        },
      ];

      setRelations(mockRelations);
    } catch (error) {
      console.error("❌ Error loading relations:", error);
    }
  };

  const getSubjectCurriculums = (subjectId: string): Curriculum[] => {
    const subjectRelations = relations.filter((r) => r.subjectId === subjectId);
    return curriculums.filter((c) =>
      subjectRelations.some((r) => r.curriculumId === c.id),
    );
  };

  const handleAdd = async () => {
    if (!formData.name.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Subject name is required",
      });
      return;
    }

    if (!formData.curriculumIds || formData.curriculumIds.length === 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please select a curriculum for this subject",
      });
      return;
    }

    // Check for duplicates
    const duplicate = subjects.find(
      (s) => s.name.toLowerCase() === formData.name.toLowerCase(),
    );
    if (duplicate) {
      toast({
        variant: "destructive",
        title: "Duplicate Subject",
        description: "A subject with this name already exists",
      });
      return;
    }

    const newSubject: Subject = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      code: formData.code || formData.name.substring(0, 3).toUpperCase(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSubjects([...subjects, newSubject]);

    // Create curriculum relationships
    if (formData.curriculumIds && formData.curriculumIds.length > 0) {
      const newRelations = formData.curriculumIds.map((curriculumId) => ({
        id: `${newSubject.id}_${curriculumId}_${Date.now()}`,
        subjectId: newSubject.id,
        curriculumId,
        createdAt: new Date().toISOString(),
      }));
      setRelations([...relations, ...newRelations]);
    }

    setIsAddDialogOpen(false);
    resetForm();

    toast({
      title: "Success",
      description: "Subject created successfully",
    });

    onSubjectChange?.();
  };

  const handleEdit = async () => {
    if (!selectedSubject || !formData.name.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Subject name is required",
      });
      return;
    }

    // Check for duplicates (excluding current item)
    const duplicate = subjects.find(
      (s) =>
        s.id !== selectedSubject.id &&
        s.name.toLowerCase() === formData.name.toLowerCase(),
    );
    if (duplicate) {
      toast({
        variant: "destructive",
        title: "Duplicate Subject",
        description: "A subject with this name already exists",
      });
      return;
    }

    const updatedSubject: Subject = {
      ...selectedSubject,
      name: formData.name,
      description: formData.description,
      code: formData.code || formData.name.substring(0, 3).toUpperCase(),
      updatedAt: new Date().toISOString(),
    };

    setSubjects(
      subjects.map((s) => (s.id === selectedSubject.id ? updatedSubject : s)),
    );

    // Update curriculum relationships
    const existingRelations = relations.filter(
      (r) => r.subjectId !== selectedSubject.id,
    );
    const newRelations = (formData.curriculumIds || []).map((curriculumId) => ({
      id: `${selectedSubject.id}_${curriculumId}_${Date.now()}`,
      subjectId: selectedSubject.id,
      curriculumId,
      createdAt: new Date().toISOString(),
    }));
    setRelations([...existingRelations, ...newRelations]);

    setIsEditDialogOpen(false);
    setSelectedSubject(null);
    resetForm();

    toast({
      title: "Success",
      description: "Subject updated successfully",
    });

    onSubjectChange?.();
  };

  const handleDelete = async () => {
    if (!selectedSubject) return;

    setSubjects(subjects.filter((s) => s.id !== selectedSubject.id));
    // Remove associated relations
    setRelations(relations.filter((r) => r.subjectId !== selectedSubject.id));
    setIsDeleteDialogOpen(false);
    setSelectedSubject(null);

    toast({
      title: "Success",
      description: "Subject deleted successfully",
    });

    onSubjectChange?.();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      code: "",
      curriculumIds: [],
    });
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (subject: Subject) => {
    setSelectedSubject(subject);
    const subjectCurriculums = getSubjectCurriculums(subject.id);
    setFormData({
      name: subject.name,
      description: subject.description || "",
      code: subject.code || "",
      curriculumIds: subjectCurriculums.map((c) => c.id),
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsViewDialogOpen(true);
  };

  const openDeleteDialog = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsDeleteDialogOpen(true);
  };

  const openRelationDialog = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsRelationDialogOpen(true);
  };

  const toggleStatus = (subject: Subject) => {
    const updated = {
      ...subject,
      isActive: !subject.isActive,
      updatedAt: new Date().toISOString(),
    };

    setSubjects(subjects.map((s) => (s.id === subject.id ? updated : s)));

    toast({
      title: "Success",
      description: `Subject ${updated.isActive ? "activated" : "deactivated"} successfully`,
    });

    onSubjectChange?.();
  };

  // Filter subjects
  const filteredSubjects = subjects.filter((subject) => {
    const matchesSearch =
      !filter.search ||
      subject.name.toLowerCase().includes(filter.search.toLowerCase()) ||
      subject.description
        ?.toLowerCase()
        .includes(filter.search.toLowerCase()) ||
      subject.code?.toLowerCase().includes(filter.search.toLowerCase());

    const matchesStatus =
      filter.isActive === undefined || subject.isActive === filter.isActive;

    const matchesCurriculum =
      !filter.curriculumId ||
      getSubjectCurriculums(subject.id).some(
        (c) => c.id === filter.curriculumId,
      );

    return matchesSearch && matchesStatus && matchesCurriculum;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">
            Subject Management
          </h3>
          <p className="text-gray-600">
            Manage subjects and their curriculum relationships
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={openAddDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Add Subject
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Subjects</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Search by name, description, or code..."
                  value={filter.search || ""}
                  onChange={(e) =>
                    setFilter({ ...filter, search: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Label htmlFor="curriculum">Curriculum</Label>
              <Select
                value={filter.curriculumId || "all"}
                onValueChange={(value) =>
                  setFilter({
                    ...filter,
                    curriculumId: value === "all" ? undefined : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Curriculums</SelectItem>
                  {curriculums.map((curriculum) => (
                    <SelectItem key={curriculum.id} value={curriculum.id}>
                      {curriculum.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-48">
              <Label htmlFor="status">Status</Label>
              <Select
                value={
                  filter.isActive === undefined
                    ? "all"
                    : filter.isActive
                      ? "active"
                      : "inactive"
                }
                onValueChange={(value) =>
                  setFilter({
                    ...filter,
                    isActive: value === "all" ? undefined : value === "active",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subjects Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Subjects ({filteredSubjects.length})
          </CardTitle>
          <CardDescription>
            Manage subjects and their curriculum assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Curriculum</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubjects.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-gray-500"
                    >
                      No subjects found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubjects.map((subject) => {
                    const subjectCurriculums = getSubjectCurriculums(
                      subject.id,
                    );
                    return (
                      <TableRow key={subject.id}>
                        <TableCell className="font-medium">
                          {subject.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{subject.code}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {subject.description || "No description"}
                        </TableCell>
                        <TableCell>
                          {subjectCurriculums.length === 0 ? (
                            <span className="text-gray-500 text-xs">
                              No assignment
                            </span>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              {subjectCurriculums[0].code}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={subject.isActive ? "default" : "secondary"}
                            className={
                              subject.isActive
                                ? "bg-green-100 text-green-700"
                                : ""
                            }
                          >
                            {subject.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(subject.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => openViewDialog(subject)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openEditDialog(subject)}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openRelationDialog(subject)}
                              >
                                <Link className="w-4 h-4 mr-2" />
                                Manage Curriculums
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => toggleStatus(subject)}
                              >
                                {subject.isActive ? "Deactivate" : "Activate"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => openDeleteDialog(subject)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Subject</DialogTitle>
            <DialogDescription>
              Create a new subject and assign it to curriculums
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Subject Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter subject name"
              />
            </div>
            <div>
              <Label htmlFor="code">Subject Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="Enter subject code (e.g., MATH, ENG)"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter subject description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="curriculum">Select Curriculum *</Label>
              {curriculums.length === 0 ? (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3 mt-2">
                  ⚠️ No curriculums available. Please create curriculums first
                  before adding subjects.
                </div>
              ) : (
                <Select
                  value={(formData.curriculumIds || [])[0] || ""}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      curriculumIds: value ? [value] : [],
                    })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select curriculum" />
                  </SelectTrigger>
                  <SelectContent>
                    {curriculums
                      .filter((c) => c.isActive)
                      .map((curriculum) => (
                        <SelectItem key={curriculum.id} value={curriculum.id}>
                          {curriculum.name} ({curriculum.code})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Create Subject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
            <DialogDescription>Update subject information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Subject Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter subject name"
              />
            </div>
            <div>
              <Label htmlFor="edit-code">Subject Code</Label>
              <Input
                id="edit-code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="Enter subject code"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter subject description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-curriculum">Select Curriculum *</Label>
              <Select
                value={(formData.curriculumIds || [])[0] || ""}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    curriculumIds: value ? [value] : [],
                  })
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select curriculum" />
                </SelectTrigger>
                <SelectContent>
                  {curriculums
                    .filter((c) => c.isActive)
                    .map((curriculum) => (
                      <SelectItem key={curriculum.id} value={curriculum.id}>
                        {curriculum.name} ({curriculum.code})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEdit}>Update Subject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Subject Details</DialogTitle>
            <DialogDescription>View subject information</DialogDescription>
          </DialogHeader>
          {selectedSubject && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <p className="text-sm font-medium">{selectedSubject.name}</p>
                </div>
                <div>
                  <Label>Code</Label>
                  <p className="text-sm font-medium">{selectedSubject.code}</p>
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <p className="text-sm">
                  {selectedSubject.description || "No description provided"}
                </p>
              </div>
              <div>
                <Label>Assigned Curriculum</Label>
                <div className="mt-1">
                  {getSubjectCurriculums(selectedSubject.id).length === 0 ? (
                    <span className="text-gray-500 text-sm">
                      No curriculum assignment
                    </span>
                  ) : (
                    <Badge variant="secondary">
                      {getSubjectCurriculums(selectedSubject.id)[0].name}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <Badge
                    variant={selectedSubject.isActive ? "default" : "secondary"}
                    className={
                      selectedSubject.isActive
                        ? "bg-green-100 text-green-700"
                        : ""
                    }
                  >
                    {selectedSubject.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div>
                  <Label>Created</Label>
                  <p className="text-sm">
                    {new Date(selectedSubject.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div>
                <Label>Last Updated</Label>
                <p className="text-sm">
                  {new Date(selectedSubject.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subject</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedSubject?.name}"? This
              action cannot be undone and will affect all associated milestones
              and goals.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Curriculum Relations Dialog */}
      <Dialog
        open={isRelationDialogOpen}
        onOpenChange={setIsRelationDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Curriculum Assignment</DialogTitle>
            <DialogDescription>
              {selectedSubject?.name} - Update curriculum assignment
            </DialogDescription>
          </DialogHeader>
          {selectedSubject && (
            <div className="space-y-4">
              <div>
                <Label>Current Assignment</Label>
                <div className="mt-1">
                  {getSubjectCurriculums(selectedSubject.id).length === 0 ? (
                    <span className="text-gray-500 text-sm">
                      No curriculum assignment
                    </span>
                  ) : (
                    <Badge variant="default">
                      {getSubjectCurriculums(selectedSubject.id)[0].name}
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <Label>Available Curriculums</Label>
                <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
                  {curriculums.map((curriculum) => {
                    const isAssigned = getSubjectCurriculums(
                      selectedSubject.id,
                    ).some((c) => c.id === curriculum.id);
                    return (
                      <div
                        key={curriculum.id}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <div>
                          <p className="font-medium">{curriculum.name}</p>
                          <p className="text-sm text-gray-500">
                            {curriculum.code}
                          </p>
                        </div>
                        <Badge
                          variant={isAssigned ? "default" : "outline"}
                          className={
                            isAssigned ? "bg-green-100 text-green-700" : ""
                          }
                        >
                          {isAssigned ? "Assigned" : "Available"}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsRelationDialogOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                if (selectedSubject) {
                  openEditDialog(selectedSubject);
                  setIsRelationDialogOpen(false);
                }
              }}
            >
              Edit Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubjectManagement;
