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
  Award,
  Filter,
  Download,
  Upload,
  BookOpen,
  Calendar,
  Trophy,
} from "lucide-react";
import {
  Goal,
  Curriculum,
  Subject,
  GoalFormData,
  GoalFilter,
  TERM_OPTIONS,
} from "@/types/curriculum";

interface GoalManagementProps {
  onGoalChange?: () => void;
}

const GoalManagement: React.FC<GoalManagementProps> = ({ onGoalChange }) => {
  // State management
  const [goals, setGoals] = useState<Goal[]>([]);
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [relations, setRelations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [filter, setFilter] = useState<GoalFilter>({});

  // Form state
  const [formData, setFormData] = useState<GoalFormData>({
    curriculumId: "",
    subjectId: "",
    term: "",
    goal: "",
  });

  // Load data on mount
  useEffect(() => {
    loadGoals();
    loadCurriculums();
    loadSubjects();
    loadRelations();
  }, []);

  const loadGoals = async () => {
    setLoading(true);
    try {
      // Always use mock data for now to avoid API issues
      const mockGoals: Goal[] = [
        {
          id: "1",
          curriculumId: "1",
          subjectId: "1",
          term: "Term 1",
          goal: "Students should be able to solve linear equations and understand basic geometric principles",
          isActive: true,
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-15T10:00:00Z",
        },
        {
          id: "2",
          curriculumId: "1",
          subjectId: "1",
          term: "Term 2",
          goal: "Students should master quadratic equations and apply geometric calculations in real-world scenarios",
          isActive: true,
          createdAt: "2024-01-16T10:00:00Z",
          updatedAt: "2024-01-16T10:00:00Z",
        },
        {
          id: "3",
          curriculumId: "1",
          subjectId: "2",
          term: "Term 1",
          goal: "Students should demonstrate improved reading comprehension and produce coherent written work",
          isActive: true,
          createdAt: "2024-01-17T10:00:00Z",
          updatedAt: "2024-01-17T10:00:00Z",
        },
        {
          id: "4",
          curriculumId: "2",
          subjectId: "1",
          term: "Semester 1",
          goal: "Students should achieve IGCSE Mathematics grade C or above in core topics",
          isActive: true,
          createdAt: "2024-01-18T10:00:00Z",
          updatedAt: "2024-01-18T10:00:00Z",
        },
        {
          id: "5",
          curriculumId: "1",
          subjectId: "3",
          term: "Term 1",
          goal: "Students should understand scientific method and conduct basic experiments",
          isActive: true,
          createdAt: "2024-01-19T10:00:00Z",
          updatedAt: "2024-01-19T10:00:00Z",
        },
      ];

      setGoals(mockGoals);
      console.log("✅ Loaded goals (using fallback data):", mockGoals.length);
    } catch (error) {
      console.error("❌ Error loading goals:", error);
      setGoals([]);
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
          updatedAt: "2024-17T10:00:00Z",
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
      !formData.goal.trim()
    ) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "All fields are required",
      });
      return;
    }

    // Check for duplicates
    const duplicate = goals.find(
      (g) =>
        g.curriculumId === formData.curriculumId &&
        g.subjectId === formData.subjectId &&
        g.term === formData.term,
    );
    if (duplicate) {
      toast({
        variant: "destructive",
        title: "Duplicate Goal",
        description:
          "A goal for this curriculum, subject, and term already exists",
      });
      return;
    }

    const newGoal: Goal = {
      id: Date.now().toString(),
      curriculumId: formData.curriculumId,
      subjectId: formData.subjectId,
      term: formData.term,
      goal: formData.goal,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setGoals([...goals, newGoal]);
    setIsAddDialogOpen(false);
    resetForm();

    toast({
      title: "Success",
      description: "Goal created successfully",
    });

    onGoalChange?.();
  };

  const handleEdit = async () => {
    if (
      !selectedGoal ||
      !formData.curriculumId ||
      !formData.subjectId ||
      !formData.term ||
      !formData.goal.trim()
    ) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "All fields are required",
      });
      return;
    }

    // Check for duplicates (excluding current item)
    const duplicate = goals.find(
      (g) =>
        g.id !== selectedGoal.id &&
        g.curriculumId === formData.curriculumId &&
        g.subjectId === formData.subjectId &&
        g.term === formData.term,
    );
    if (duplicate) {
      toast({
        variant: "destructive",
        title: "Duplicate Goal",
        description:
          "A goal for this curriculum, subject, and term already exists",
      });
      return;
    }

    const updatedGoal: Goal = {
      ...selectedGoal,
      curriculumId: formData.curriculumId,
      subjectId: formData.subjectId,
      term: formData.term,
      goal: formData.goal,
      updatedAt: new Date().toISOString(),
    };

    setGoals(goals.map((g) => (g.id === selectedGoal.id ? updatedGoal : g)));
    setIsEditDialogOpen(false);
    setSelectedGoal(null);
    resetForm();

    toast({
      title: "Success",
      description: "Goal updated successfully",
    });

    onGoalChange?.();
  };

  const handleDelete = async () => {
    if (!selectedGoal) return;

    setGoals(goals.filter((g) => g.id !== selectedGoal.id));
    setIsDeleteDialogOpen(false);
    setSelectedGoal(null);

    toast({
      title: "Success",
      description: "Goal deleted successfully",
    });

    onGoalChange?.();
  };

  const resetForm = () => {
    setFormData({
      curriculumId: "",
      subjectId: "",
      term: "",
      goal: "",
    });
  };

  const openAddDialog = () => {
    console.log("🔥 GoalManagement: Opening add dialog");
    resetForm();
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (goal: Goal) => {
    setSelectedGoal(goal);
    setFormData({
      curriculumId: goal.curriculumId,
      subjectId: goal.subjectId,
      term: goal.term,
      goal: goal.goal,
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsViewDialogOpen(true);
  };

  const openDeleteDialog = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsDeleteDialogOpen(true);
  };

  const toggleStatus = (goal: Goal) => {
    const updated = {
      ...goal,
      isActive: !goal.isActive,
      updatedAt: new Date().toISOString(),
    };

    setGoals(goals.map((g) => (g.id === goal.id ? updated : g)));

    toast({
      title: "Success",
      description: `Goal ${updated.isActive ? "activated" : "deactivated"} successfully`,
    });

    onGoalChange?.();
  };

  // Get curriculum and subject names for display
  const getCurriculumName = (id: string) =>
    curriculums.find((c) => c.id === id)?.name || "Unknown";
  const getSubjectName = (id: string) =>
    subjects.find((s) => s.id === id)?.name || "Unknown";

  // Filter goals
  const filteredGoals = goals.filter((goal) => {
    const matchesSearch =
      !filter.search ||
      goal.goal.toLowerCase().includes(filter.search.toLowerCase()) ||
      getCurriculumName(goal.curriculumId)
        .toLowerCase()
        .includes(filter.search.toLowerCase()) ||
      getSubjectName(goal.subjectId)
        .toLowerCase()
        .includes(filter.search.toLowerCase()) ||
      goal.term.toLowerCase().includes(filter.search.toLowerCase());

    const matchesCurriculum =
      !filter.curriculumId || goal.curriculumId === filter.curriculumId;
    const matchesSubject =
      !filter.subjectId || goal.subjectId === filter.subjectId;
    const matchesTerm = !filter.term || goal.term === filter.term;

    return matchesSearch && matchesCurriculum && matchesSubject && matchesTerm;
  });

  // Quick filter functions
  const applyQuickFilter = (filterType: string, value: string) => {
    switch (filterType) {
      case "curriculum":
        setFilter({ ...filter, curriculumId: value });
        break;
      case "subject":
        setFilter({ ...filter, subjectId: value });
        break;
      case "term":
        setFilter({ ...filter, term: value });
        break;
      default:
        break;
    }
  };

  const clearFilters = () => {
    setFilter({});
  };

  // Get unique terms for quick filter
  const availableTerms = [...new Set(goals.map((g) => g.term))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Goal Management</h3>
          <p className="text-gray-600">
            Define learning achievements and outcomes for students
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
          <Button onClick={() => openAddDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Goal
          </Button>
        </div>
      </div>

      {/* Quick Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Quick Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="mb-2"
            >
              All Goals ({goals.length})
            </Button>
            {curriculums
              .filter((c) => c.isActive)
              .map((curriculum) => {
                const count = goals.filter(
                  (g) => g.curriculumId === curriculum.id,
                ).length;
                return (
                  <Button
                    key={curriculum.id}
                    variant={
                      filter.curriculumId === curriculum.id
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      applyQuickFilter("curriculum", curriculum.id)
                    }
                    className="mb-2"
                  >
                    {curriculum.code} ({count})
                  </Button>
                );
              })}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {subjects
              .filter((s) => s.isActive)
              .map((subject) => {
                const count = goals.filter(
                  (g) => g.subjectId === subject.id,
                ).length;
                return (
                  <Button
                    key={subject.id}
                    variant={
                      filter.subjectId === subject.id ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => applyQuickFilter("subject", subject.id)}
                    className="mb-2"
                  >
                    {subject.name} ({count})
                  </Button>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Advanced Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <Label htmlFor="search">Search Goals</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Search goals..."
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
                  {availableTerms.map((term) => (
                    <SelectItem key={term} value={term}>
                      {term}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {Object.keys(filter).length > 0 && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-gray-500">Active filters:</span>
              {filter.search && (
                <Badge variant="secondary">Search: "{filter.search}"</Badge>
              )}
              {filter.curriculumId && (
                <Badge variant="secondary">
                  Curriculum: {getCurriculumName(filter.curriculumId)}
                </Badge>
              )}
              {filter.subjectId && (
                <Badge variant="secondary">
                  Subject: {getSubjectName(filter.subjectId)}
                </Badge>
              )}
              {filter.term && (
                <Badge variant="secondary">Term: {filter.term}</Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs"
              >
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Goals Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Learning Goals ({filteredGoals.length})
          </CardTitle>
          <CardDescription>
            Achievement targets organized by curriculum, subject, and term
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
                  <TableHead>Learning Goal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGoals.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-gray-500"
                    >
                      No goals found
                      {Object.keys(filter).length > 0 && (
                        <div className="mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={clearFilters}
                          >
                            Clear filters
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredGoals.map((goal) => (
                    <TableRow key={goal.id}>
                      <TableCell>
                        <Badge variant="outline">
                          {
                            curriculums.find((c) => c.id === goal.curriculumId)
                              ?.code
                          }
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {getSubjectName(goal.subjectId)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{goal.term}</Badge>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="truncate" title={goal.goal}>
                          {goal.goal}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={goal.isActive ? "default" : "secondary"}
                          className={
                            goal.isActive ? "bg-green-100 text-green-700" : ""
                          }
                        >
                          {goal.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(goal.createdAt).toLocaleDateString()}
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
                              onClick={() => openViewDialog(goal)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openEditDialog(goal)}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => toggleStatus(goal)}
                            >
                              {goal.isActive ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => openDeleteDialog(goal)}
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
            <DialogTitle>Add New Goal</DialogTitle>
            <DialogDescription>
              Define learning achievements for a specific curriculum, subject,
              and term
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
                      <SelectItem value="" disabled>
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
              <Label htmlFor="goal">Learning Goal *</Label>
              <Textarea
                id="goal"
                value={formData.goal}
                onChange={(e) =>
                  setFormData({ ...formData, goal: e.target.value })
                }
                placeholder="Describe what learners should achieve after covering the milestone..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Create Goal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
            <DialogDescription>Update goal information</DialogDescription>
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
                      <SelectItem value="" disabled>
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
              <Label htmlFor="edit-goal">Learning Goal *</Label>
              <Textarea
                id="edit-goal"
                value={formData.goal}
                onChange={(e) =>
                  setFormData({ ...formData, goal: e.target.value })
                }
                placeholder="Describe what learners should achieve after covering the milestone..."
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
            <Button onClick={handleEdit}>Update Goal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Goal Details</DialogTitle>
            <DialogDescription>View goal information</DialogDescription>
          </DialogHeader>
          {selectedGoal && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Curriculum</Label>
                  <p className="text-sm font-medium">
                    {getCurriculumName(selectedGoal.curriculumId)}
                  </p>
                </div>
                <div>
                  <Label>Subject</Label>
                  <p className="text-sm font-medium">
                    {getSubjectName(selectedGoal.subjectId)}
                  </p>
                </div>
              </div>
              <div>
                <Label>Term</Label>
                <Badge variant="secondary">{selectedGoal.term}</Badge>
              </div>
              <div>
                <Label>Learning Goal</Label>
                <p className="text-sm border rounded p-3 bg-gray-50">
                  {selectedGoal.goal}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <Badge
                    variant={selectedGoal.isActive ? "default" : "secondary"}
                    className={
                      selectedGoal.isActive ? "bg-green-100 text-green-700" : ""
                    }
                  >
                    {selectedGoal.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div>
                  <Label>Created</Label>
                  <p className="text-sm">
                    {new Date(selectedGoal.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div>
                <Label>Last Updated</Label>
                <p className="text-sm">
                  {new Date(selectedGoal.updatedAt).toLocaleDateString()}
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
            <AlertDialogTitle>Delete Goal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this goal? This action cannot be
              undone.
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

export default GoalManagement;
