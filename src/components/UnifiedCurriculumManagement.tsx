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
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    📚 Education Systems
                  </h4>
                  <p className="text-blue-700 text-sm">
                    Define the foundational education systems (CBC, IGCSE, IB,
                    etc.) that will be used throughout your institution.
                  </p>
                </div>
                <CurriculumManagement onCurriculumChange={handleDataChange} />
              </div>
            </TabsContent>

            <TabsContent value="subjects" className="mt-6">
              <SubjectManagement onSubjectChange={handleDataChange} />
            </TabsContent>

            <TabsContent value="milestones" className="mt-6">
              <div className="space-y-4">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">
                    🎯 Content Milestones
                  </h4>
                  <p className="text-purple-700 text-sm">
                    Define what content should be covered for subjects that were
                    added to curriculums. Select curriculum first, then choose
                    from available subjects.
                  </p>
                </div>
                <MilestoneManagement onMilestoneChange={handleDataChange} />
              </div>
            </TabsContent>

            <TabsContent value="goals" className="mt-6">
              <div className="space-y-4">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">
                    🏆 Learning Goals
                  </h4>
                  <p className="text-orange-700 text-sm">
                    Set achievement targets for subjects that were created and
                    assigned to curriculums. Goals reference the subjects and
                    milestones already established.
                  </p>
                </div>
                <GoalManagement onGoalChange={handleDataChange} />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Actions Footer */}
      <Card className="bg-gradient-to-r from-primary-50 to-accent-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-800">
                Need help getting started?
              </h4>
              <p className="text-sm text-gray-600">
                Follow our curriculum planning workflow for best results
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Globe className="w-4 h-4 text-blue-600" />
                1. Curriculums
              </span>
              <span>→</span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4 text-green-600" />
                2. Subjects
              </span>
              <span>→</span>
              <span className="flex items-center gap-1">
                <Target className="w-4 h-4 text-purple-600" />
                3. Milestones
              </span>
              <span>→</span>
              <span className="flex items-center gap-1">
                <Award className="w-4 h-4 text-orange-600" />
                4. Goals
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedCurriculumManagement;
