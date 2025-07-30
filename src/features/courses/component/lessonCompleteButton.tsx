"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { markLessonComplete } from "../db/enrollment";
import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";

type Props = {
  lessonId: string;
  isCompleted: boolean;
  isEnrolled: boolean;
};

export function LessonCompleteButton({ lessonId, isCompleted, isEnrolled }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleMarkComplete = async () => {
    if (!isEnrolled || isCompleted) return;

    setIsLoading(true);
    
    try {
      await markLessonComplete(lessonId);
      toast({
        title: "Lesson completed!",
        description: "Great job! You've completed this lesson.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isEnrolled) {
    return null;
  }

  if (isCompleted) {
    return (
      <Button variant="outline" disabled className="w-full">
        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
        Completed
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleMarkComplete} 
      className="w-full"
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <CheckCircle className="w-4 h-4 mr-2" />
      )}
      {isLoading ? "Marking Complete..." : "Mark as Complete"}
    </Button>
  );
}