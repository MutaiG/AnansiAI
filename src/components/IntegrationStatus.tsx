import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { teacherStudentIntegration } from "@/services/teacherStudentIntegration";
import {
  Users,
  BookOpen,
  GraduationCap,
  CheckCircle,
  ArrowRight,
  Activity,
} from "lucide-react";

interface IntegrationStatusProps {
  className?: string;
}

export const IntegrationStatus: React.FC<IntegrationStatusProps> = ({
  className = "",
}) => {
  const [status, setStatus] = useState(
    teacherStudentIntegration.getIntegrationStatus(),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(teacherStudentIntegration.getIntegrationStatus());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Card
      className={`bg-gradient-to-r from-green-50 to-blue-50 border-green-200 ${className}`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-green-700 text-sm">
          <Activity className="w-4 h-4" />
          Teacher-Student Integration Status
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-2 bg-white rounded-lg border">
            <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
              <GraduationCap className="w-4 h-4" />
              <span className="font-bold">{status.totalClasses}</span>
            </div>
            <p className="text-xs text-gray-600">Classes</p>
          </div>
          <div className="p-2 bg-white rounded-lg border">
            <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
              <BookOpen className="w-4 h-4" />
              <span className="font-bold">{status.totalContent}</span>
            </div>
            <p className="text-xs text-gray-600">Content</p>
          </div>
          <div className="p-2 bg-white rounded-lg border">
            <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
              <Users className="w-4 h-4" />
              <span className="font-bold">{status.totalEnrollments}</span>
            </div>
            <p className="text-xs text-gray-600">Enrollments</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-500" />
            <span>Content flows from Teachers to Students</span>
          </div>
          <ArrowRight className="w-3 h-3" />
        </div>

        <div className="text-xs text-gray-500 text-center">
          Last updated: {new Date(status.lastUpdated).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationStatus;
