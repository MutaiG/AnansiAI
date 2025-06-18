import { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Brain, Search, MapPin, GraduationCap } from "lucide-react";

interface School {
  id: string;
  name: string;
  district: string;
  city: string;
  state: string;
  code: string;
}

interface SchoolSelectorProps {
  onSchoolSelect: (school: School) => void;
}

const SchoolSelector = ({ onSchoolSelect }: SchoolSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  // Mock school data - in real app, this would come from an API
  const schools: School[] = [
    {
      id: "SCH001",
      name: "Lincoln High School",
      district: "Metro District",
      city: "Springfield",
      state: "CA",
      code: "LHS",
    },
    {
      id: "SCH002",
      name: "Washington Elementary",
      district: "Metro District",
      city: "Springfield",
      state: "CA",
      code: "WES",
    },
    {
      id: "SCH003",
      name: "Roosevelt Middle School",
      district: "Central District",
      city: "Riverside",
      state: "CA",
      code: "RMS",
    },
    {
      id: "SCH004",
      name: "Kennedy High School",
      district: "North District",
      city: "Oakland",
      state: "CA",
      code: "KHS",
    },
    {
      id: "SCH005",
      name: "Jefferson Academy",
      district: "East District",
      city: "San Jose",
      state: "CA",
      code: "JEA",
    },
  ];

  const districts = [...new Set(schools.map((school) => school.district))];

  const filteredSchools = schools.filter((school) => {
    const matchesSearch =
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict =
      !selectedDistrict ||
      selectedDistrict === "all" ||
      school.district === selectedDistrict;
    return matchesSearch && matchesDistrict;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"
          style={{ animationDelay: "-2s" }}
        ></div>
        <div
          className="absolute top-40 left-1/2 w-80 h-80 bg-secondary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"
          style={{ animationDelay: "-4s" }}
        ></div>
      </div>

      <div className="relative w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center gap-3 justify-center mb-4">
            <img
              src="https://cdn.builder.io/api/v1/assets/2d09da496e544a1eab05e596d02031d8/twinternet-logo-b18833?format=webp&width=800"
              alt="AnansiAI Logo"
              className="w-24 h-24 object-contain"
            />
            <h1 className="text-4xl font-bold text-gradient">AnansiAI</h1>
          </div>
          <p className="text-xl text-secondary-600 font-medium">
            Select Your School to Continue
          </p>
        </div>

        <Card className="card-elevated">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-secondary-800">
              School Directory
            </CardTitle>
            <CardDescription className="text-secondary-600">
              Find and select your school to access your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Search and Filter */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Schools</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <Input
                    id="search"
                    placeholder="School name or city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">Filter by District</Label>
                <Select
                  value={selectedDistrict}
                  onValueChange={setSelectedDistrict}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Districts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Districts</SelectItem>
                    {districts.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* School List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredSchools.length === 0 ? (
                <div className="text-center py-8">
                  <GraduationCap className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
                  <p className="text-secondary-600">
                    No schools found matching your criteria
                  </p>
                </div>
              ) : (
                filteredSchools.map((school) => (
                  <Card
                    key={school.id}
                    className="card-interactive cursor-pointer hover:bg-primary-50"
                    onClick={() => onSchoolSelect(school)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary-100 rounded-lg">
                            <GraduationCap className="w-5 h-5 text-primary-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-secondary-800">
                              {school.name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-secondary-600 mt-1">
                              <MapPin className="w-3 h-3" />
                              <span>
                                {school.city}, {school.state}
                              </span>
                              <span>•</span>
                              <span>{school.district}</span>
                            </div>
                            <p className="text-xs text-secondary-500 mt-1">
                              School Code: {school.code}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Select
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-secondary-200 text-center space-y-3">
              <p className="text-sm text-secondary-500">
                Don't see your school? Contact your district administrator.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button variant="outline" className="text-sm">
                  Contact Support
                </Button>
                <Button
                  variant="ghost"
                  className="text-sm text-primary-600 hover:text-primary-700"
                  onClick={() =>
                    onSchoolSelect({
                      id: "DISTRICT",
                      name: "District Administration",
                      district: "District Level",
                      city: "Central",
                      state: "Admin",
                      code: "DIST",
                    })
                  }
                >
                  District Admin Login
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SchoolSelector;
