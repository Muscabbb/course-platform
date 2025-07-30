"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, PlayCircle } from "lucide-react";

type Props = {
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  totalDuration: number;
};

export function ProgressTracker({ 
  totalLessons, 
  completedLessons, 
  progressPercentage, 
  totalDuration 
}: Props) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlayCircle className="w-5 h-5" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Course Progress</span>
            <span className="font-medium">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
              <CheckCircle className="w-4 h-4" />
              <span className="font-semibold">{completedLessons}</span>
            </div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
              <Clock className="w-4 h-4" />
              <span className="font-semibold">{totalLessons - completedLessons}</span>
            </div>
            <p className="text-xs text-muted-foreground">Remaining</p>
          </div>
        </div>

        {/* Course Info */}
        <div className="pt-2 border-t space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Lessons</span>
            <span className="font-medium">{totalLessons}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Duration</span>
            <span className="font-medium">{formatDuration(totalDuration)}</span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="pt-2">
          {progressPercentage === 100 ? (
            <Badge className="w-full justify-center bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-3 h-3 mr-1" />
              Course Completed!
            </Badge>
          ) : progressPercentage > 0 ? (
            <Badge variant="outline" className="w-full justify-center">
              <PlayCircle className="w-3 h-3 mr-1" />
              In Progress
            </Badge>
          ) : (
            <Badge variant="secondary" className="w-full justify-center">
              <Clock className="w-3 h-3 mr-1" />
              Not Started
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}