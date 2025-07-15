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
  Target,
  Filter,
  BookOpen,
  Calendar,
} from "lucide-react";
import {
  Milestone,
  Curriculum,
  Subject,
  MilestoneFormData,
  MilestoneFilter,
  TERM_OPTIONS,
} from "@/types/curriculum";

interface MilestoneManagementProps {
  onMilestoneChange?: () => void;
}

const MilestoneManagement: React.FC<MilestoneManagementProps> = ({
  onMilestoneChange,
}) => {
  // State management
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [relations, setRelations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(
    null,
  );
  const [filter, setFilter] = useState<MilestoneFilter>({});

  // Form state
  const [formData, setFormData] = useState<MilestoneFormData>({
    curriculumId: "",
    subjectId: "",
    term: "",
    milestone: "",
  });

  // Load data on mount
  useEffect(() => {
    loadMilestones();
    loadCurriculums();
    loadSubjects();
    loadRelations();
  }, []);

  const loadMilestones = async () => {
    setLoading(true);
    try {
      // Always use mock data for now to avoid API issues
      const mockMilestones: Milestone[] = [
        {
          id: "1",
          curriculumId: "1",
          subjectId: "1",
          term: "Term 1",
          milestone:
            "Introduction to algebra concepts, linear equations, and basic geometry shapes",
          isActive: true,
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-15T10:00:00Z",
        },
        {
          id: "2",
          curriculumId: "1",
          subjectId: "1",
          term: "Term 2",
          milestone:
            "Advanced algebra, quadratic equations, and geometric calculations",
          isActive: true,
          createdAt: "2024-01-16T10:00:00Z",
          updatedAt: "2024-01-16T10:00:00Z",
        },
        {
          id: "3",
          curriculumId: "1",
          subjectId: "2",
          term: "Term 1",
          milestone:
            "Reading comprehension, basic grammar, and creative writing introduction",
          isActive: true,
          createdAt: "2024-01-17T10:00:00Z",
          updatedAt: "2024-01-17T10:00:00Z",
        },
        {
          id: "4",
          curriculumId: "2",
          subjectId: "1",
          term: "Semester 1",
          milestone:
            "IGCSE Mathematics syllabus covering Number, Algebra, and Geometry",
          isActive: true,
          createdAt: "2024-01-18T10:00:00Z",
          updatedAt: "2024-01-18T10:00:00Z",
        },
      ];

      setMilestones(mockMilestones);
      console.log(
        "✅ Loaded milestones (using fallback data):",
        mockMilestones.length,
      );
    } catch (error) {
      console.error("❌ Error loading milestones:", error);
      // Set empty array as fallback
      setMilestones([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCurriculums = async () => {
    try {
      // Always use mock data for now to avoid API issues
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
      ];

      setCurriculums(mockCurriculums);
      console.log(
        "✅ Loaded curriculums (using fallback data):",
        mockCurriculums.length,
      );
    } catch (error) {
      console.error("❌ Error loading curriculums:", error);
      setCurriculums([]);
    }
  };

  const loadSubjects = async () => {
    try {
      // Always use mock data for now to avoid API issues
      const mockSubjects: Subject[] = [
        {
          id: "1",
          name: "Mathematics",
          description: "Core mathematics",
          code: "MATH",
          isActive: true,
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-15T10:00:00Z",
        },
        {
          id: "2",
          name: "English Language",
          description: "English language and literature",
          code: "ENG",
          isActive: true,
          createdAt: "2024-01-16T10:00:00Z",
          updatedAt: "2024-01-16T10:00:00Z",
        },
        {
          id: "3",
          name: "Science",
          description: "Integrated science",
          code: "SCI",
          isActive: true,
          createdAt: "2024-01-17T10:00:00Z",
          updatedAt: "2024-01-17T10:00:00Z",
        },
      ];

      setSubjects(mockSubjects);
      console.log(
        "✅ Loaded subjects (using fallback data):",
        mockSubjects.length,
      );
    } catch (error) {
      console.error("❌ Error loading subjects:", error);
      setSubjects([]);
    }
  };

  const loadRelations = async () => {
    try {
      // Always use mock data for now to avoid API issues
      const mockRelations = [
        { id: "r1", subjectId: "1", curriculumId: "1" },
        { id: "r2", subjectId: "1", curriculumId: "2" },
        { id: "r3", subjectId: "2", curriculumId: "1" },
        { id: "r4", subjectId: "3", curriculumId: "1" },
      ];
      setRelations(mockRelations);
      console.log(
        "✅ Loaded relations (using fallback data):",
        mockRelations.length,
      );
    } catch (error) {
      console.error("❌ Error loading relations:", error);
      setRelations([]);
    }
  };

  const handleAdd = async () => {
    if (
      !formData.curriculumId ||
      !formData.subjectId ||
      !formData.term ||
      !formData.milestone.trim()
    ) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "All fields are required",
      });
      return;
    }

    // Check for duplicates
    const duplicate = milestones.find(
      (m) =>
        m.curriculumId === formData.curriculumId &&
        m.subjectId === formData.subjectId &&
        m.term === formData.term,
    );
    if (duplicate) {
      toast({
        variant: "destructive",
        title: "Duplicate Milestone",
        description:
          "A milestone for this curriculum, subject, and term already exists",
      });
      return;
    }

    const newMilestone: Milestone = {
      id: Date.now().toString(),
      curriculumId: formData.curriculumId,
      subjectId: formData.subjectId,
      term: formData.term,
      milestone: formData.milestone,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setMilestones([...milestones, newMilestone]);
    setIsAddDialogOpen(false);
    resetForm();

    toast({
      title: "Success",
      description: "Milestone created successfully",
    });

    onMilestoneChange?.();
  };

  const handleEdit = async () => {
    if (
      !selectedMilestone ||
      !formData.curriculumId ||
      !formData.subjectId ||
      !formData.term ||
      !formData.milestone.trim()
    ) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "All fields are required",
      });
      return;
    }

    // Check for duplicates (excluding current item)
    const duplicate = milestones.find(
      (m) =>
        m.id !== selectedMilestone.id &&
        m.curriculumId === formData.curriculumId &&
        m.subjectId === formData.subjectId &&
        m.term === formData.term,
    );
    if (duplicate) {
      toast({
        variant: "destructive",
        title: "Duplicate Milestone",
        description:
          "A milestone for this curriculum, subject, and term already exists",
      });
      return;
    }

    const updatedMilestone: Milestone = {
      ...selectedMilestone,
      curriculumId: formData.curriculumId,
      subjectId: formData.subjectId,
      term: formData.term,
      milestone: formData.milestone,
      updatedAt: new Date().toISOString(),
    };

    setMilestones(
      milestones.map((m) =>
        m.id === selectedMilestone.id ? updatedMilestone : m,
      ),
    );
    setIsEditDialogOpen(false);
    setSelectedMilestone(null);
    resetForm();

    toast({
      title: "Success",
      description: "Milestone updated successfully",
    });

    onMilestoneChange?.();
  };

  const handleDelete = async () => {
    if (!selectedMilestone) return;

    setMilestones(milestones.filter((m) => m.id !== selectedMilestone.id));
    setIsDeleteDialogOpen(false);
    setSelectedMilestone(null);

    toast({
      title: "Success",
      description: "Milestone deleted successfully",
    });

    onMilestoneChange?.();
  };

  const resetForm = () => {
    setFormData({
      curriculumId: "",
      subjectId: "",
      term: "",
      milestone: "",
    });
  };

  const openAddDialog = () => {
    console.log("🔥 MilestoneManagement: Opening add dialog");
    resetForm();
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setFormData({
      curriculumId: milestone.curriculumId,
      subjectId: milestone.subjectId,
      term: milestone.term,
      milestone: milestone.milestone,
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setIsViewDialogOpen(true);
  };

  const openDeleteDialog = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setIsDeleteDialogOpen(true);
  };

  const toggleStatus = (milestone: Milestone) => {
    const updated = {
      ...milestone,
      isActive: !milestone.isActive,
      updatedAt: new Date().toISOString(),
    };

    setMilestones(milestones.map((m) => (m.id === milestone.id ? updated : m)));

    toast({
      title: "Success",
      description: `Milestone ${updated.isActive ? "activated" : "deactivated"} successfully`,
    });

    onMilestoneChange?.();
  };

  // Get curriculum and subject names for display
  const getCurriculumName = (id: string) =>
    curriculums.find((c) => c.id === id)?.name || "Unknown";
  const getSubjectName = (id: string) =>
    subjects.find((s) => s.id === id)?.name || "Unknown";

  // Filter milestones
  const filteredMilestones = milestones.filter((milestone) => {
    const matchesSearch =
      !filter.search ||
      milestone.milestone.toLowerCase().includes(filter.search.toLowerCase()) ||
      getCurriculumName(milestone.curriculumId)
        .toLowerCase()
        .includes(filter.search.toLowerCase()) ||
      getSubjectName(milestone.subjectId)
        .toLowerCase()
        .includes(filter.search.toLowerCase()) ||
      milestone.term.toLowerCase().includes(filter.search.toLowerCase());

    const matchesCurriculum =
      !filter.curriculumId || milestone.curriculumId === filter.curriculumId;
    const matchesSubject =
      !filter.subjectId || milestone.subjectId === filter.subjectId;
    const matchesTerm = !filter.term || milestone.term === filter.term;

    return matchesSearch && matchesCurriculum && matchesSubject && matchesTerm;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">
            Milestone Management
          </h3>
          <p className="text-gray-600">
            Define what content is to be covered in subjects during terms
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => openAddDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Milestone
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <Label htmlFor="search">Search Milestones</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Search milestones..."
                  value={filter.search || ""}
                  onChange={(e) =>
                    setFilter({ ...filter, search: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
            </div>
            <div>
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
                  {curriculums
                    .filter((c) => c.isActive)
                    .map((curriculum) => (
                      <SelectItem key={curriculum.id} value={curriculum.id}>
                        {curriculum.code}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Select
                value={filter.subjectId || "all"}
                onValueChange={(value) =>
                  setFilter({
                    ...filter,
                    subjectId: value === "all" ? undefined : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects
                    .filter((s) => s.isActive)
                    .map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="term">Term</Label>
              <Select
                value={filter.term || "all"}
                onValueChange={(value) =>
                  setFilter({
                    ...filter,
                    term: value === "all" ? undefined : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Terms</SelectItem>
                  {TERM_OPTIONS.map((term) => (
                    <SelectItem key={term} value={term}>
                      {term}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Milestones Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Milestones ({filteredMilestones.length})
          </CardTitle>
          <CardDescription>
            Content coverage milestones organized by curriculum, subject, and
            term
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
                  <TableHead>Curriculum</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>Milestone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMilestones.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-gray-500"
                    >
                      No milestones found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMilestones.map((milestone) => (
                    <TableRow key={milestone.id}>
                      <TableCell>
                        <Badge variant="outline">
                          {
                            curriculums.find(
                              (c) => c.id === milestone.curriculumId,
                            )?.code
                          }
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {getSubjectName(milestone.subjectId)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{milestone.term}</Badge>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="truncate" title={milestone.milestone}>
                          {milestone.milestone}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={milestone.isActive ? "default" : "secondary"}
                          className={
                            milestone.isActive
                              ? "bg-green-100 text-green-700"
                              : ""
                          }
                        >
                          {milestone.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(milestone.createdAt).toLocaleDateString()}
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
                              onClick={() => openViewDialog(milestone)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openEditDialog(milestone)}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => toggleStatus(milestone)}
                            >
                              {milestone.isActive ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => openDeleteDialog(milestone)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
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
            <DialogTitle>Add New Milestone</DialogTitle>
            <DialogDescription>
              Define content coverage for a specific curriculum, subject, and
              term
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="curriculum">Curriculum *</Label>
                <Select
                  value={formData.curriculumId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, curriculumId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select curriculum" />
                  </SelectTrigger>
                  <SelectContent>
                    {curriculums
                      .filter((c) => c.isActive)
                      .map((curriculum) => (
                        <SelectItem key={curriculum.id} value={curriculum.id}>
                          {curriculum.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Select
                  value={formData.subjectId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, subjectId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.curriculumId ? (
                      subjects
                        .filter((s) => {
                          // Only show subjects assigned to the selected curriculum
                          const isAssignedToCurriculum = relations.some(
                            (r) =>
                              r.subjectId === s.id &&
                              r.curriculumId === formData.curriculumId,
                          );
                          return s.isActive && isAssignedToCurriculum;
                        })
                        .map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))
                    ) : (
                      <SelectItem value="no-curriculum" disabled>
                        Please select a curriculum first
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {formData.curriculumId &&
                  subjects.filter((s) => {
                    const isAssignedToCurriculum = relations.some(
                      (r) =>
                        r.subjectId === s.id &&
                        r.curriculumId === formData.curriculumId,
                    );
                    return s.isActive && isAssignedToCurriculum;
                  }).length === 0 && (
                    <p className="text-sm text-orange-600 mt-2">
                      ⚠️ No subjects found for this curriculum. Please add
                      subjects to this curriculum first.
                    </p>
                  )}
              </div>
            </div>
            <div>
              <Label htmlFor="term">Term/Duration *</Label>
              <Select
                value={formData.term}
                onValueChange={(value) =>
                  setFormData({ ...formData, term: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select term/duration" />
                </SelectTrigger>
                <SelectContent>
                  {TERM_OPTIONS.map((term) => (
                    <SelectItem key={term} value={term}>
                      {term}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="milestone">Milestone Content *</Label>
              <Textarea
                id="milestone"
                value={formData.milestone}
                onChange={(e) =>
                  setFormData({ ...formData, milestone: e.target.value })
                }
                placeholder="Describe what content should be covered during this term..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Create Milestone</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Milestone</DialogTitle>
            <DialogDescription>Update milestone information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-curriculum">Curriculum *</Label>
                <Select
                  value={formData.curriculumId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, curriculumId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select curriculum" />
                  </SelectTrigger>
                  <SelectContent>
                    {curriculums
                      .filter((c) => c.isActive)
                      .map((curriculum) => (
                        <SelectItem key={curriculum.id} value={curriculum.id}>
                          {curriculum.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-subject">Subject *</Label>
                <Select
                  value={formData.subjectId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, subjectId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.curriculumId ? (
                      subjects
                        .filter((s) => {
                          // Only show subjects assigned to the selected curriculum
                          const isAssignedToCurriculum = relations.some(
                            (r) =>
                              r.subjectId === s.id &&
                              r.curriculumId === formData.curriculumId,
                          );
                          return s.isActive && isAssignedToCurriculum;
                        })
                        .map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))
                    ) : (
                      <SelectItem value="no-curriculum" disabled>
                        Please select a curriculum first
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-term">Term/Duration *</Label>
              <Select
                value={formData.term}
                onValueChange={(value) =>
                  setFormData({ ...formData, term: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select term/duration" />
                </SelectTrigger>
                <SelectContent>
                  {TERM_OPTIONS.map((term) => (
                    <SelectItem key={term} value={term}>
                      {term}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-milestone">Milestone Content *</Label>
              <Textarea
                id="edit-milestone"
                value={formData.milestone}
                onChange={(e) =>
                  setFormData({ ...formData, milestone: e.target.value })
                }
                placeholder="Describe what content should be covered during this term..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEdit}>Update Milestone</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Milestone Details</DialogTitle>
            <DialogDescription>View milestone information</DialogDescription>
          </DialogHeader>
          {selectedMilestone && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Curriculum</Label>
                  <p className="text-sm font-medium">
                    {getCurriculumName(selectedMilestone.curriculumId)}
                  </p>
                </div>
                <div>
                  <Label>Subject</Label>
                  <p className="text-sm font-medium">
                    {getSubjectName(selectedMilestone.subjectId)}
                  </p>
                </div>
              </div>
              <div>
                <Label>Term</Label>
                <Badge variant="secondary">{selectedMilestone.term}</Badge>
              </div>
              <div>
                <Label>Milestone Content</Label>
                <p className="text-sm border rounded p-3 bg-gray-50">
                  {selectedMilestone.milestone}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <Badge
                    variant={
                      selectedMilestone.isActive ? "default" : "secondary"
                    }
                    className={
                      selectedMilestone.isActive
                        ? "bg-green-100 text-green-700"
                        : ""
                    }
                  >
                    {selectedMilestone.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div>
                  <Label>Created</Label>
                  <p className="text-sm">
                    {new Date(selectedMilestone.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div>
                <Label>Last Updated</Label>
                <p className="text-sm">
                  {new Date(selectedMilestone.updatedAt).toLocaleDateString()}
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
            <AlertDialogTitle>Delete Milestone</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this milestone? This action cannot
              be undone.
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
    </div>
  );
};

export default MilestoneManagement;
