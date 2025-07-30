"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { enrollInCourse, unenrollFromCourse } from "../db/enrollment";
import { useState } from "react";
import { Loader2, UserCheck, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  courseId: string;
  isEnrolled: boolean;
  isSignedIn: boolean;
};

export function EnrollmentButton({ courseId, isEnrolled, isSignedIn }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleEnrollment = async () => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    setIsLoading(true);
    
    try {
      if (isEnrolled) {
        await unenrollFromCourse(courseId);
        toast({
          title: "Unenrolled successfully",
          description: "You have been unenrolled from this course.",
        });
      } else {
        await enrollInCourse(courseId);
        toast({
          title: "Enrolled successfully",
          description: "You are now enrolled in this course!",
        });
      }
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

  if (!isSignedIn) {
    return (
      <Button onClick={handleEnrollment} className="w-full" size="lg">
        <UserPlus className="w-4 h-4 mr-2" />
        Sign in to Enroll
      </Button>
    );
  }

  if (isEnrolled) {
    return (
      <Button 
        onClick={handleEnrollment} 
        variant="outline" 
        className="w-full" 
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <UserCheck className="w-4 h-4 mr-2" />
        )}
        {isLoading ? "Processing..." : "Unenroll"}
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleEnrollment} 
      className="w-full" 
      size="lg"
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <UserPlus className="w-4 h-4 mr-2" />
      )}
      {isLoading ? "Enrolling..." : "Enroll Now"}
    </Button>
  );
}