import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, BookOpen, Target, Award, GraduationCap } from "lucide-react";
import CurriculumManagement from "@/components/CurriculumManagement";
import SubjectManagement from "@/components/SubjectManagement";
import MilestoneManagement from "@/components/MilestoneManagement";
import GoalManagement from "@/components/GoalManagement";

interface UnifiedCurriculumManagementProps {
  onDataChange?: () => void;
}

const UnifiedCurriculumManagement: React.FC<
  UnifiedCurriculumManagementProps
> = ({ onDataChange }) => {
  const [activeSubTab, setActiveSubTab] = useState("curriculums");

  const handleDataChange = () => {
    onDataChange?.();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-primary-600" />
            Curriculum Management
          </h2>
          <p className="text-gray-600 mt-2">
            Comprehensive curriculum planning and management system
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setActiveSubTab("curriculums")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Curriculums</CardTitle>
            <Globe className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">3</div>
            <p className="text-xs text-gray-600">Education systems</p>
          </CardContent>
        </Card>

        <Card
          className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setActiveSubTab("subjects")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">12</div>
            <p className="text-xs text-gray-600">Academic subjects</p>
          </CardContent>
        </Card>

        <Card
          className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setActiveSubTab("milestones")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Milestones</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">24</div>
            <p className="text-xs text-gray-600">Content milestones</p>
          </CardContent>
        </Card>

        <Card
          className="border-l-4 border-l-orange-500 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setActiveSubTab("goals")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goals</CardTitle>
            <Award className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">18</div>
            <p className="text-xs text-gray-600">Learning goals</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Curriculum Planning & Management</CardTitle>
          <CardDescription>
            Manage all aspects of your curriculum from education systems to
            learning goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger
                value="curriculums"
                className="flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                Curriculums
              </TabsTrigger>
              <TabsTrigger value="subjects" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Subjects
              </TabsTrigger>
              <TabsTrigger
                value="milestones"
                className="flex items-center gap-2"
              >
                <Target className="w-4 h-4" />
                Milestones
              </TabsTrigger>
              <TabsTrigger value="goals" className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                Goals
              </TabsTrigger>
            </TabsList>

            <TabsContent value="curriculums" className="mt-6">
              <CurriculumManagement onCurriculumChange={handleDataChange} />
            </TabsContent>

            <TabsContent value="subjects" className="mt-6">
              <SubjectManagement onSubjectChange={handleDataChange} />
            </TabsContent>

            <TabsContent value="milestones" className="mt-6">
              <MilestoneManagement onMilestoneChange={handleDataChange} />
            </TabsContent>

            <TabsContent value="goals" className="mt-6">
              <GoalManagement onGoalChange={handleDataChange} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedCurriculumManagement;
