// AnansiAI Admin Dashboard API Service
// Comprehensive integration with all available API endpoints

import axiosClient from "./axiosClient";
import { AxiosResponse } from "axios";
import MixedContentHelper from "./mixedContentHelper";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

// Enum types from the API
export interface ApprovalStatus {
  key: number;
  value: string;
}

export interface QuestionType {
  key: number;
  value: string;
}

export interface ReviewStatus {
  key: number;
  value: string;
}

export interface LevelStudentStatus {
  key: number;
  value: string;
}

export interface BehaviorActionType {
  key: number;
  value: string;
}

export interface EnumsResponse {
  Success: boolean;
  data: {
    ApprovalStatus: ApprovalStatus[];
    BehaviorActionTypes: BehaviorActionType[];
    ContentTypeEnums: { key: number; value: string }[];
    DataSharingLevels: { key: number; value: string }[];
    LevelStudentStatus: LevelStudentStatus[];
    QuestionTypes: QuestionType[];
    ReviewPrioritys: { key: number; value: string }[];
    ReviewStatus: ReviewStatus[];
    TwinInteractionType: { key: number; value: string }[];
  };
}

// Assignment types
export interface Assignment {
  modifiedDate?: string;
  createdBy?: string;
  modifiedBy?: string;
  isDeleted?: boolean;
  assignmentId: number;
  lessonId: number;
  lesson?: any;
  title: string;
  questionType: number;
  content: string;
  rubric?: string;
  deadline?: string;
  approvalStatus: number;
  approvedById?: string;
  approvedAt?: string;
  isActive: boolean;
  submissions?: Submission[];
}

export interface CreateAssignmentDto {
  lessonId: number;
  title: string;
  questionType: number;
  content: string;
  rubric?: string;
  deadline?: string;
  approvalStatus?: number;
  approvedAt?: string;
  isActive?: boolean;
}

export interface UpdateAssignmentDto {
  lessonId?: number;
  title: string;
  questionType: number;
  content?: string;
  rubric?: string;
  deadline?: string;
  approvalStatus?: number;
  approvedAt?: string;
  isActive?: boolean;
}

// Curriculum types
export interface Curriculum {
  modifiedDate?: string;
  createdBy?: string;
  modifiedBy?: string;
  isDeleted?: boolean;
  curriculumId: number;
  name: string;
  description: string;
  institutionId: number;
  institution?: Institution;
  milestones?: Milestone[];
  goals?: Goal[];
  subjects?: Subject[];
}

export interface CreateCurriculumDto {
  name: string;
  description: string;
  institutionId: number;
}

export interface UpdateCurriculumDto {
  name: string;
  description: string;
}

// Goal types
export interface Goal {
  modifiedDate?: string;
  createdBy?: string;
  modifiedBy?: string;
  isDeleted?: boolean;
  goalId: number;
  description: string;
  subjectId: number;
  subject?: Subject;
  curriculumId: number;
  curriculum?: Curriculum;
  termId: number;
  term?: Term;
  institutionId: number;
  institution?: Institution;
}

export interface CreateGoalDto {
  description: string;
  subjectId: number;
  curriculumId: number;
  termId: number;
  institutionId: number;
}

export interface UpdateGoalDto {
  description: string;
  subjectId: number;
  curriculumId: number;
  termId: number;
  institutionId: number;
}

// Institution types
export interface Institution {
  modifiedDate?: string;
  createdBy?: string;
  modifiedBy?: string;
  isDeleted?: boolean;
  institutionId: number;
  name: string;
  address: string;
  curriculums?: Curriculum[];
  terms?: Term[];
  subjects?: Subject[];
  milestones?: Milestone[];
  goals?: Goal[];
}

// Lesson types
export interface Lesson {
  modifiedDate?: string;
  createdBy?: string;
  modifiedBy?: string;
  isDeleted?: boolean;
  lessonId: number;
  subjectId: number;
  subject?: Subject;
  title: string;
  content: string;
  difficultyLevel: number;
  approvalStatus: number;
  approvedById?: string;
  approvedAt?: string;
  isActive: boolean;
  assignments?: Assignment[];
  behaviorLogs?: BehaviorLog[];
}

export interface CreateLessonDto {
  subjectId: number;
  title: string;
  content: string;
  difficultyLevel?: number;
  approvalStatus?: number;
  approvedAt?: string;
  isActive?: boolean;
}

export interface UpdateLessonDto {
  lessonId: number;
  title: string;
  content: string;
  difficultyLevel?: number;
  approvalStatus?: number;
  approvedAt?: string;
  isActive?: boolean;
}

// Milestone types
export interface Milestone {
  modifiedDate?: string;
  createdBy?: string;
  modifiedBy?: string;
  isDeleted?: boolean;
  milestoneId: number;
  description: string;
  curriculumId: number;
  curriculum?: Curriculum;
  subjectId: number;
  subject?: Subject;
  termId: number;
  term?: Term;
  institutionId: number;
  institution?: Institution;
}

export interface CreateMilestoneDto {
  description: string;
  curriculumId: number;
  subjectId: number;
  termId: number;
  institutionId: number;
}

export interface UpdateMilestoneDto {
  description: string;
  curriculumId: number;
  subjectId: number;
  termId: number;
}

// Subject types
export interface Subject {
  modifiedDate?: string;
  createdBy?: string;
  modifiedBy?: string;
  isDeleted?: boolean;
  subjectId: number;
  subjectName: string;
  description: string;
  isActive: boolean;
  institutionId: number;
  institution?: Institution;
  curriculumId: number;
  curriculum?: Curriculum;
  levels?: Level[];
  lessons?: Lesson[];
  milestones?: Milestone[];
  goals?: Goal[];
}

export interface CreateSubjectDto {
  institutionId: number;
  subjectName: string;
  description: string;
  isActive?: boolean;
  curriculumId: number;
}

export interface UpdateSubjectDto {
  subjectName: string;
  description: string;
  isActive?: boolean;
  curriculumId: number;
}

// Term types
export interface Term {
  modifiedDate?: string;
  createdBy?: string;
  modifiedBy?: string;
  isDeleted?: boolean;
  termId: number;
  termName: string;
  institutionId: number;
  institution?: Institution;
  milestones?: Milestone[];
  goals?: Goal[];
}

export interface CreateTermDto {
  termId?: number;
  termName: string;
  institutionId: number;
}

export interface UpdateTermDto {
  termName: string;
}

// User types
export interface Role {
  id: string;
  name: string;
}

export interface UserRegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phoneNumber?: string;
  institutionName: string;
  role: Role;
}

export interface RegisterUserDto {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phoneNumber?: string;
  institutionId?: number;
  role: Role;
}

export interface LoginDto {
  email: string;
  password: string;
}

// Level and Student types
export interface Level {
  modifiedDate?: string;
  createdBy?: string;
  modifiedBy?: string;
  isDeleted?: boolean;
  levelId: number;
  levelName: string;
  subjectId: number;
  subject?: Subject;
  teacherId: string;
  isActive: boolean;
  maxStudents: number;
  levelStudents?: LevelStudent[];
}

export interface LevelStudent {
  modifiedDate?: string;
  createdBy?: string;
  modifiedBy?: string;
  isDeleted?: boolean;
  levelId: number;
  level?: Level;
  studentId: string;
  enrolledAt: string;
  status: number;
}

// Submission types
export interface Submission {
  modifiedDate?: string;
  createdBy?: string;
  modifiedBy?: string;
  isDeleted?: boolean;
  submissionId: number;
  assignmentId: number;
  assignment?: Assignment;
  studentId: string;
  content: string;
  autoGrade?: number;
  teacherGrade?: number;
  finalGrade?: number;
  feedback?: string;
  reviewStatus: number;
  reviewedById?: string;
  reviewedAt?: string;
  flagged?: boolean;
  flagReason?: string;
  submittedAt?: string;
}

// Behavior Log types
export interface BehaviorLog {
  modifiedDate?: string;
  createdBy?: string;
  modifiedBy?: string;
  isDeleted?: boolean;
  behaviorLogId: number;
  studentId: string;
  lessonId: number;
  lesson?: Lesson;
  sessionId: string;
  actionType: number;
  details: string;
  riskScore?: number;
  flagged?: boolean;
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  success?: boolean;
  message?: string;
  error?: string;
}

// ============================================================================
// API SERVICE CLASS
// ============================================================================

export class AdminApiService {
  private static instance: AdminApiService;
  private mixedContentHelper: MixedContentHelper;

  private constructor() {
    this.mixedContentHelper = MixedContentHelper.getInstance();
  }

  static getInstance(): AdminApiService {
    if (!AdminApiService.instance) {
      AdminApiService.instance = new AdminApiService();
    }
    return AdminApiService.instance;
  }

  // Check for mixed content issues and provide user guidance
  checkMixedContentIssues(): {
    hasMixedContent: boolean;
    errorMessage?: string;
    solutions?: string[];
  } {
    const hasMixedContent = this.mixedContentHelper.hasMixedContentIssue();

    if (hasMixedContent) {
      return {
        hasMixedContent: true,
        errorMessage: this.mixedContentHelper.getMixedContentErrorMessage(),
        solutions: [
          "Configure SSL certificate on your API server (13.60.98.134)",
          "Deploy this application on HTTP for development",
          "Use a reverse proxy with HTTPS support",
        ],
      };
    }

    return { hasMixedContent: false };
  }

  // Enhanced error handling for API calls
  private async handleApiCall<T>(apiCall: () => Promise<T>): Promise<T> {
    try {
      return await apiCall();
    } catch (error: any) {
      // Check if this is a mixed content error
      const mixedContentIssue = this.checkMixedContentIssues();

      if (
        mixedContentIssue.hasMixedContent &&
        (error.code === "ERR_NETWORK" || error.message === "Network Error")
      ) {
        console.error("🚫 Mixed Content Error Detected:");
        console.error(mixedContentIssue.errorMessage);

        // Enhance error with mixed content guidance
        const enhancedError = new Error(
          `Mixed Content Security Error: ${error.message}`,
        );
        (enhancedError as any).mixedContent = true;
        (enhancedError as any).solutions = mixedContentIssue.solutions;
        throw enhancedError;
      }

      throw error;
    }
  }

  // ============================================================================
  // ASSIGNMENTS ENDPOINTS
  // ============================================================================

  /**
   * Get all assignments
   */
  async getAssignments(): Promise<Assignment[]> {
    return this.handleApiCall(async () => {
      const response: AxiosResponse<Assignment[]> =
        await axiosClient.get("/api/assignments");
      return response.data;
    });
  }

  /**
   * Get assignment by ID
   */
  async getAssignment(assignmentId: number): Promise<Assignment> {
    try {
      const response: AxiosResponse<Assignment> = await axiosClient.get(
        `/api/assignments/${assignmentId}`,
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching assignment ${assignmentId}:`, error);
      throw error;
    }
  }

  /**
   * Create new assignment
   */
  async createAssignment(
    assignmentData: CreateAssignmentDto,
  ): Promise<Assignment> {
    try {
      const response: AxiosResponse<Assignment> = await axiosClient.post(
        "/api/assignments/add-assignment",
        assignmentData,
      );
      return response.data;
    } catch (error) {
      console.error("Error creating assignment:", error);
      throw error;
    }
  }

  /**
   * Update assignment
   */
  async updateAssignment(
    assignmentId: number,
    assignmentData: UpdateAssignmentDto,
  ): Promise<Assignment> {
    try {
      const response: AxiosResponse<Assignment> = await axiosClient.put(
        `/api/assignments/${assignmentId}`,
        assignmentData,
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating assignment ${assignmentId}:`, error);
      throw error;
    }
  }

  /**
   * Delete assignment
   */
  async deleteAssignment(assignmentId: number): Promise<void> {
    try {
      await axiosClient.delete(`/api/assignments/${assignmentId}`);
    } catch (error) {
      console.error(`Error deleting assignment ${assignmentId}:`, error);
      throw error;
    }
  }

  // ============================================================================
  // AUTHENTICATION ENDPOINTS
  // ============================================================================

  /**
   * User registration
   */
  async register(userData: UserRegisterDto): Promise<any> {
    try {
      const response: AxiosResponse<any> = await axiosClient.post(
        "/api/Auth/register",
        userData,
      );
      return response.data;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  }

  /**
   * User login
   */
  async login(loginData: LoginDto): Promise<any> {
    try {
      const response: AxiosResponse<any> = await axiosClient.post(
        "/api/Auth/login",
        loginData,
      );
      return response.data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }

  // ============================================================================
  // CURRICULUM ENDPOINTS
  // ============================================================================

  /**
   * Get all curriculums
   */
  async getCurriculums(): Promise<Curriculum[]> {
    try {
      const response: AxiosResponse<Curriculum[]> =
        await axiosClient.get("/api/curriculums");
      return response.data;
    } catch (error) {
      console.error("Error fetching curriculums:", error);
      throw error;
    }
  }

  /**
   * Get curriculum by ID
   */
  async getCurriculum(curriculumId: number): Promise<Curriculum> {
    try {
      const response: AxiosResponse<Curriculum> = await axiosClient.get(
        `/api/curriculums/${curriculumId}`,
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching curriculum ${curriculumId}:`, error);
      throw error;
    }
  }

  /**
   * Create new curriculum
   */
  async createCurriculum(
    curriculumData: CreateCurriculumDto,
  ): Promise<Curriculum> {
    try {
      const response: AxiosResponse<Curriculum> = await axiosClient.post(
        "/api/curriculums/add-curriculum",
        curriculumData,
      );
      return response.data;
    } catch (error) {
      console.error("Error creating curriculum:", error);
      throw error;
    }
  }

  /**
   * Update curriculum
   */
  async updateCurriculum(
    curriculumId: number,
    curriculumData: UpdateCurriculumDto,
  ): Promise<Curriculum> {
    try {
      const response: AxiosResponse<Curriculum> = await axiosClient.put(
        `/api/curriculums/${curriculumId}`,
        curriculumData,
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating curriculum ${curriculumId}:`, error);
      throw error;
    }
  }

  /**
   * Delete curriculum
   */
  async deleteCurriculum(curriculumId: number): Promise<void> {
    try {
      await axiosClient.delete(`/api/curriculums/${curriculumId}`);
    } catch (error) {
      console.error(`Error deleting curriculum ${curriculumId}:`, error);
      throw error;
    }
  }

  /**
   * Get curriculums by institution
   */
  async getCurriculumsByInstitution(
    institutionId: number,
  ): Promise<Curriculum[]> {
    try {
      const response: AxiosResponse<Curriculum[]> = await axiosClient.get(
        `/api/curriculums/by-institution?institutionId=${institutionId}`,
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching curriculums for institution ${institutionId}:`,
        error,
      );
      throw error;
    }
  }

  // ============================================================================
  // ENUMS ENDPOINTS
  // ============================================================================

  /**
   * Get all system enums
   */
  async getAllEnums(): Promise<EnumsResponse> {
    try {
      const response: AxiosResponse<EnumsResponse> = await axiosClient.get(
        "/api/enums/all-enums",
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching enums:", error);
      throw error;
    }
  }

  // ============================================================================
  // GOALS ENDPOINTS
  // ============================================================================

  /**
   * Get all goals
   */
  async getGoals(): Promise<Goal[]> {
    try {
      const response: AxiosResponse<Goal[]> =
        await axiosClient.get("/api/goals");
      return response.data;
    } catch (error) {
      console.error("Error fetching goals:", error);
      throw error;
    }
  }

  /**
   * Get goal by ID
   */
  async getGoal(goalId: number): Promise<Goal> {
    try {
      const response: AxiosResponse<Goal> = await axiosClient.get(
        `/api/goals/${goalId}`,
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching goal ${goalId}:`, error);
      throw error;
    }
  }

  /**
   * Create new goal
   */
  async createGoal(goalData: CreateGoalDto): Promise<Goal> {
    try {
      const response: AxiosResponse<Goal> = await axiosClient.post(
        "/api/goals/add-goal",
        goalData,
      );
      return response.data;
    } catch (error) {
      console.error("Error creating goal:", error);
      throw error;
    }
  }

  /**
   * Update goal
   */
  async updateGoal(goalId: number, goalData: UpdateGoalDto): Promise<Goal> {
    try {
      const response: AxiosResponse<Goal> = await axiosClient.put(
        `/api/goals/${goalId}`,
        goalData,
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating goal ${goalId}:`, error);
      throw error;
    }
  }

  /**
   * Delete goal
   */
  async deleteGoal(goalId: number): Promise<void> {
    try {
      await axiosClient.delete(`/api/goals/${goalId}`);
    } catch (error) {
      console.error(`Error deleting goal ${goalId}:`, error);
      throw error;
    }
  }

  // ============================================================================
  // INSTITUTIONS ENDPOINTS
  // ============================================================================

  /**
   * Get all institutions
   */
  async getInstitutions(): Promise<Institution[]> {
    try {
      const response: AxiosResponse<Institution[]> =
        await axiosClient.get("/api/Institutions");
      return response.data;
    } catch (error) {
      console.error("Error fetching institutions:", error);
      throw error;
    }
  }

  /**
   * Get institution by ID
   */
  async getInstitution(institutionId: number): Promise<Institution> {
    try {
      const response: AxiosResponse<Institution> = await axiosClient.get(
        `/api/Institutions/${institutionId}`,
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching institution ${institutionId}:`, error);
      throw error;
    }
  }

  /**
   * Create new institution
   */
  async createInstitution(
    institutionData: Partial<Institution>,
  ): Promise<Institution> {
    try {
      const response: AxiosResponse<Institution> = await axiosClient.post(
        "/api/Institutions",
        institutionData,
      );
      return response.data;
    } catch (error) {
      console.error("Error creating institution:", error);
      throw error;
    }
  }

  /**
   * Update institution
   */
  async updateInstitution(
    institutionId: number,
    institutionData: Partial<Institution>,
  ): Promise<Institution> {
    try {
      const response: AxiosResponse<Institution> = await axiosClient.put(
        `/api/Institutions/${institutionId}`,
        institutionData,
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating institution ${institutionId}:`, error);
      throw error;
    }
  }

  /**
   * Delete institution
   */
  async deleteInstitution(institutionId: number): Promise<void> {
    try {
      await axiosClient.delete(`/api/Institutions/${institutionId}`);
    } catch (error) {
      console.error(`Error deleting institution ${institutionId}:`, error);
      throw error;
    }
  }

  // ============================================================================
  // LESSONS ENDPOINTS
  // ============================================================================

  /**
   * Get all lessons
   */
  async getLessons(): Promise<Lesson[]> {
    try {
      const response: AxiosResponse<Lesson[]> =
        await axiosClient.get("/api/lessons");
      return response.data;
    } catch (error) {
      console.error("Error fetching lessons:", error);
      throw error;
    }
  }

  /**
   * Get lesson by ID
   */
  async getLesson(lessonId: number): Promise<Lesson> {
    try {
      const response: AxiosResponse<Lesson> = await axiosClient.get(
        `/api/lessons/${lessonId}`,
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching lesson ${lessonId}:`, error);
      throw error;
    }
  }

  /**
   * Create new lesson
   */
  async createLesson(lessonData: CreateLessonDto): Promise<Lesson> {
    try {
      const response: AxiosResponse<Lesson> = await axiosClient.post(
        "/api/lessons/add-lesson",
        lessonData,
      );
      return response.data;
    } catch (error) {
      console.error("Error creating lesson:", error);
      throw error;
    }
  }

  /**
   * Update lesson
   */
  async updateLesson(
    lessonId: number,
    lessonData: UpdateLessonDto,
  ): Promise<Lesson> {
    try {
      const response: AxiosResponse<Lesson> = await axiosClient.put(
        `/api/lessons/${lessonId}`,
        lessonData,
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating lesson ${lessonId}:`, error);
      throw error;
    }
  }

  /**
   * Delete lesson
   */
  async deleteLesson(lessonId: number): Promise<void> {
    try {
      await axiosClient.delete(`/api/lessons?lessonId=${lessonId}`);
    } catch (error) {
      console.error(`Error deleting lesson ${lessonId}:`, error);
      throw error;
    }
  }

  // ============================================================================
  // MILESTONES ENDPOINTS
  // ============================================================================

  /**
   * Get all milestones
   */
  async getMilestones(): Promise<Milestone[]> {
    try {
      const response: AxiosResponse<Milestone[]> =
        await axiosClient.get("/api/milestones");
      return response.data;
    } catch (error) {
      console.error("Error fetching milestones:", error);
      throw error;
    }
  }

  /**
   * Get milestone by ID
   */
  async getMilestone(milestoneId: number): Promise<Milestone> {
    try {
      const response: AxiosResponse<Milestone> = await axiosClient.get(
        `/api/milestones/${milestoneId}`,
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching milestone ${milestoneId}:`, error);
      throw error;
    }
  }

  /**
   * Create new milestone
   */
  async createMilestone(milestoneData: CreateMilestoneDto): Promise<Milestone> {
    try {
      const response: AxiosResponse<Milestone> = await axiosClient.post(
        "/api/milestones/add-milestone",
        milestoneData,
      );
      return response.data;
    } catch (error) {
      console.error("Error creating milestone:", error);
      throw error;
    }
  }

  /**
   * Update milestone
   */
  async updateMilestone(
    milestoneId: number,
    milestoneData: UpdateMilestoneDto,
  ): Promise<Milestone> {
    try {
      const response: AxiosResponse<Milestone> = await axiosClient.put(
        `/api/milestones/${milestoneId}`,
        milestoneData,
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating milestone ${milestoneId}:`, error);
      throw error;
    }
  }

  /**
   * Delete milestone
   */
  async deleteMilestone(milestoneId: number): Promise<void> {
    try {
      await axiosClient.delete(`/api/milestones/${milestoneId}`);
    } catch (error) {
      console.error(`Error deleting milestone ${milestoneId}:`, error);
      throw error;
    }
  }

  // ============================================================================
  // SUBJECTS ENDPOINTS
  // ============================================================================

  /**
   * Get all subjects
   */
  async getSubjects(): Promise<Subject[]> {
    try {
      const response: AxiosResponse<Subject[]> =
        await axiosClient.get("/api/subjects");
      return response.data;
    } catch (error) {
      console.error("Error fetching subjects:", error);
      throw error;
    }
  }

  /**
   * Get subject by ID
   */
  async getSubject(subjectId: number): Promise<Subject> {
    try {
      const response: AxiosResponse<Subject> = await axiosClient.get(
        `/api/subjects/${subjectId}`,
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching subject ${subjectId}:`, error);
      throw error;
    }
  }

  /**
   * Create new subject
   */
  async createSubject(subjectData: CreateSubjectDto): Promise<Subject> {
    try {
      const response: AxiosResponse<Subject> = await axiosClient.post(
        "/api/subjects/add-subject",
        subjectData,
      );
      return response.data;
    } catch (error) {
      console.error("Error creating subject:", error);
      throw error;
    }
  }

  /**
   * Update subject
   */
  async updateSubject(
    subjectId: number,
    subjectData: UpdateSubjectDto,
  ): Promise<Subject> {
    try {
      const response: AxiosResponse<Subject> = await axiosClient.put(
        `/api/subjects/${subjectId}`,
        subjectData,
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating subject ${subjectId}:`, error);
      throw error;
    }
  }

  /**
   * Delete subject
   */
  async deleteSubject(subjectId: number): Promise<void> {
    try {
      await axiosClient.delete(`/api/subjects/${subjectId}`);
    } catch (error) {
      console.error(`Error deleting subject ${subjectId}:`, error);
      throw error;
    }
  }

  /**
   * Get subjects by institution
   */
  async getSubjectsByInstitution(institutionId: number): Promise<Subject[]> {
    try {
      const response: AxiosResponse<Subject[]> = await axiosClient.get(
        `/api/subjects/by-institution?institutionId=${institutionId}`,
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching subjects for institution ${institutionId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Get subjects by curriculum
   */
  async getSubjectsByCurriculum(
    curriculumId: number,
    institutionId: number,
  ): Promise<Subject[]> {
    try {
      const response: AxiosResponse<Subject[]> = await axiosClient.get(
        `/api/subjects/by-curriculum?curriculumId=${curriculumId}&institutionId=${institutionId}`,
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching subjects for curriculum ${curriculumId}:`,
        error,
      );
      throw error;
    }
  }

  // ============================================================================
  // TERMS ENDPOINTS
  // ============================================================================

  /**
   * Get all terms
   */
  async getTerms(): Promise<Term[]> {
    try {
      const response: AxiosResponse<Term[]> =
        await axiosClient.get("/api/terms");
      return response.data;
    } catch (error) {
      console.error("Error fetching terms:", error);
      throw error;
    }
  }

  /**
   * Get term by ID
   */
  async getTerm(termId: number): Promise<Term> {
    try {
      const response: AxiosResponse<Term> = await axiosClient.get(
        `/api/terms/${termId}`,
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching term ${termId}:`, error);
      throw error;
    }
  }

  /**
   * Create new term
   */
  async createTerm(termData: CreateTermDto): Promise<Term> {
    try {
      const response: AxiosResponse<Term> = await axiosClient.post(
        "/api/terms/add-term",
        termData,
      );
      return response.data;
    } catch (error) {
      console.error("Error creating term:", error);
      throw error;
    }
  }

  /**
   * Update term
   */
  async updateTerm(termId: number, termData: UpdateTermDto): Promise<Term> {
    try {
      const response: AxiosResponse<Term> = await axiosClient.put(
        `/api/terms/${termId}`,
        termData,
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating term ${termId}:`, error);
      throw error;
    }
  }

  /**
   * Delete term
   */
  async deleteTerm(termId: number): Promise<void> {
    try {
      await axiosClient.delete(`/api/terms/${termId}`);
    } catch (error) {
      console.error(`Error deleting term ${termId}:`, error);
      throw error;
    }
  }

  /**
   * Get terms by institution
   */
  async getTermsByInstitution(institutionId: number): Promise<Term[]> {
    try {
      const response: AxiosResponse<Term[]> = await axiosClient.get(
        `/api/terms/by-institution?institutionId=${institutionId}`,
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching terms for institution ${institutionId}:`,
        error,
      );
      throw error;
    }
  }

  // ============================================================================
  // USERS ENDPOINTS
  // ============================================================================

  /**
   * Get users by role
   */
  async getUsersByRole(roleName: string): Promise<any[]> {
    try {
      const response: AxiosResponse<any[]> = await axiosClient.get(
        `/api/Users/get-users-by-role?roleName=${roleName}`,
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching users by role ${roleName}:`, error);
      throw error;
    }
  }

  /**
   * Add user as admin
   */
  async addUserAsAdmin(userData: UserRegisterDto): Promise<any> {
    try {
      const response: AxiosResponse<any> = await axiosClient.post(
        "/api/Users/add-users-as-admin",
        userData,
      );
      return response.data;
    } catch (error) {
      console.error("Error adding user as admin:", error);
      throw error;
    }
  }

  /**
   * Add user as super admin
   */
  async addUserAsSuperAdmin(userData: RegisterUserDto): Promise<any> {
    try {
      const response: AxiosResponse<any> = await axiosClient.post(
        "/api/Users/add-users-as-super-admin",
        userData,
      );
      return response.data;
    } catch (error) {
      console.error("Error adding user as super admin:", error);
      throw error;
    }
  }

  /**
   * Get all available roles
   */
  async getAllRoles(): Promise<Role[]> {
    try {
      const response: AxiosResponse<Role[]> = await axiosClient.get(
        "/api/Users/all-roles",
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching roles:", error);
      throw error;
    }
  }

  // ============================================================================
  // DASHBOARD DATA AGGREGATION METHODS
  // ============================================================================

  /**
   * Get comprehensive dashboard data
   */
  async getDashboardData(): Promise<{
    institutions: Institution[];
    subjects: Subject[];
    lessons: Lesson[];
    assignments: Assignment[];
    users: { teachers: any[]; students: any[]; admins: any[] };
    enums: EnumsResponse;
    stats: {
      totalInstitutions: number;
      totalSubjects: number;
      totalLessons: number;
      totalAssignments: number;
      totalUsers: number;
    };
  }> {
    return this.handleApiCall(async () => {
      console.log("🔄 Fetching comprehensive dashboard data...");

      // Check for mixed content issues before making requests
      const mixedContentCheck = this.checkMixedContentIssues();
      if (mixedContentCheck.hasMixedContent) {
        console.warn("⚠️ Mixed Content Issue Detected - API calls may fail");
        console.warn(mixedContentCheck.errorMessage);
      }

      // Fetch all data in parallel for better performance
      const [
        institutions,
        subjects,
        lessons,
        assignments,
        teachers,
        students,
        admins,
        enums,
      ] = await Promise.allSettled([
        this.getInstitutions(),
        this.getSubjects(),
        this.getLessons(),
        this.getAssignments(),
        this.getUsersByRole("Teacher"),
        this.getUsersByRole("Student"),
        this.getUsersByRole("Admin"),
        this.getAllEnums(),
      ]);

      // Helper function to extract data from settled promises
      const extractData = <T>(
        result: PromiseSettledResult<T>,
        fallback: T,
      ): T => {
        return result.status === "fulfilled" ? result.value : fallback;
      };

      const institutionsData = extractData(institutions, [] as Institution[]);
      const subjectsData = extractData(subjects, [] as Subject[]);
      const lessonsData = extractData(lessons, [] as Lesson[]);
      const assignmentsData = extractData(assignments, [] as Assignment[]);
      const teachersData = extractData(teachers, [] as any[]);
      const studentsData = extractData(students, [] as any[]);
      const adminsData = extractData(admins, [] as any[]);
      const enumsData = extractData(enums, {
        Success: false,
        data: {},
      } as EnumsResponse);

      const dashboardData = {
        institutions: institutionsData,
        subjects: subjectsData,
        lessons: lessonsData,
        assignments: assignmentsData,
        users: {
          teachers: teachersData,
          students: studentsData,
          admins: adminsData,
        },
        enums: enumsData,
        stats: {
          totalInstitutions: institutionsData.length,
          totalSubjects: subjectsData.length,
          totalLessons: lessonsData.length,
          totalAssignments: assignmentsData.length,
          totalUsers:
            teachersData.length + studentsData.length + adminsData.length,
        },
      };

      console.log("✅ Dashboard data fetched successfully:", {
        institutions: dashboardData.stats.totalInstitutions,
        subjects: dashboardData.stats.totalSubjects,
        lessons: dashboardData.stats.totalLessons,
        assignments: dashboardData.stats.totalAssignments,
        users: dashboardData.stats.totalUsers,
      });

      return dashboardData;
    });
  }

  /**
   * Get institution-specific data
   */
  async getInstitutionData(institutionId: number): Promise<{
    institution: Institution;
    curriculums: Curriculum[];
    subjects: Subject[];
    terms: Term[];
  }> {
    try {
      const [institution, curriculums, subjects, terms] = await Promise.all([
        this.getInstitution(institutionId),
        this.getCurriculumsByInstitution(institutionId),
        this.getSubjectsByInstitution(institutionId),
        this.getTermsByInstitution(institutionId),
      ]);

      return {
        institution,
        curriculums,
        subjects,
        terms,
      };
    } catch (error) {
      console.error(
        `Error fetching data for institution ${institutionId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Search across multiple entities
   */
  async searchAll(query: string): Promise<{
    institutions: Institution[];
    subjects: Subject[];
    lessons: Lesson[];
    assignments: Assignment[];
  }> {
    try {
      const [institutions, subjects, lessons, assignments] = await Promise.all([
        this.getInstitutions(),
        this.getSubjects(),
        this.getLessons(),
        this.getAssignments(),
      ]);

      const lowerQuery = query.toLowerCase();

      return {
        institutions: institutions.filter(
          (inst) =>
            inst.name.toLowerCase().includes(lowerQuery) ||
            inst.address.toLowerCase().includes(lowerQuery),
        ),
        subjects: subjects.filter(
          (subject) =>
            subject.subjectName.toLowerCase().includes(lowerQuery) ||
            subject.description.toLowerCase().includes(lowerQuery),
        ),
        lessons: lessons.filter(
          (lesson) =>
            lesson.title.toLowerCase().includes(lowerQuery) ||
            lesson.content.toLowerCase().includes(lowerQuery),
        ),
        assignments: assignments.filter(
          (assignment) =>
            assignment.title.toLowerCase().includes(lowerQuery) ||
            assignment.content.toLowerCase().includes(lowerQuery),
        ),
      };
    } catch (error) {
      console.error("Error performing search:", error);
      throw error;
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Test API connection
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const enums = await this.getAllEnums();
      return {
        success: true,
        message: "API connection successful",
      };
    } catch (error) {
      return {
        success: false,
        message: `API connection failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  }

  /**
   * Get API health status
   */
  async getHealthStatus(): Promise<{
    api: boolean;
    endpoints: {
      institutions: boolean;
      subjects: boolean;
      lessons: boolean;
      assignments: boolean;
      users: boolean;
    };
  }> {
    const healthStatus = {
      api: false,
      endpoints: {
        institutions: false,
        subjects: false,
        lessons: false,
        assignments: false,
        users: false,
      },
    };

    try {
      // Test critical endpoints
      const tests = await Promise.allSettled([
        this.getInstitutions(),
        this.getSubjects(),
        this.getLessons(),
        this.getAssignments(),
        this.getAllRoles(),
      ]);

      healthStatus.endpoints.institutions = tests[0].status === "fulfilled";
      healthStatus.endpoints.subjects = tests[1].status === "fulfilled";
      healthStatus.endpoints.lessons = tests[2].status === "fulfilled";
      healthStatus.endpoints.assignments = tests[3].status === "fulfilled";
      healthStatus.endpoints.users = tests[4].status === "fulfilled";

      // API is healthy if at least 3 endpoints work
      const workingEndpoints = Object.values(healthStatus.endpoints).filter(
        Boolean,
      ).length;
      healthStatus.api = workingEndpoints >= 3;

      return healthStatus;
    } catch (error) {
      console.error("Error checking health status:", error);
      return healthStatus;
    }
  }
}

// Export singleton instance
export const adminApiService = AdminApiService.getInstance();
export default adminApiService;
