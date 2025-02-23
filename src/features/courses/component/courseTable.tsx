"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, GraduationCap } from "lucide-react";
import { formatDate } from "@/lib/utils";

import Link from "next/link";
import { deleteCourse } from "../db/course";
import { CourseWithRelations } from "@/types/course";

interface CourseTableProps {
  courses: CourseWithRelations[];
}

export function CoursesTable({ courses }: CourseTableProps) {
  if (!courses.length) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/5">
          <GraduationCap className="h-10 w-10 text-primary" />
        </div>
        <h2 className="mt-6 text-xl font-semibold">No courses created</h2>
        <p className="mt-2 text-center text-sm leading-6 text-muted-foreground">
          You haven&apos;t created any courses yet. Start by creating your first
          course.
        </p>
      </div>
    );
  }

  async function handleDeleteCourse(id: string) {
    await deleteCourse(id);
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Course</TableHead>
            <TableHead>students</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id} className="hover:bg-muted/50">
              <TableCell className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{course.name}</span>
                </div>
                <div className="text-muted-foreground">
                  Section: {course.sections.length}
                </div>
              </TableCell>
              <TableCell>
                <p className="truncate text-sm text-muted-foreground">
                  {course.users.length}
                </p>
              </TableCell>
              <TableCell>
                <time
                  className="text-sm text-muted-foreground"
                  dateTime={course.createdAt.toISOString()}
                >
                  {formatDate(course.createdAt)}
                </time>
              </TableCell>
              <TableCell>
                <time
                  className="text-sm text-muted-foreground"
                  dateTime={course.updatedAt.toISOString()}
                >
                  {formatDate(course.updatedAt)}
                </time>
              </TableCell>
              <TableCell>
                <div className="flex w-full justify-around items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-primary/5 hover:text-primary"
                    asChild
                  >
                    <Link href={`/admin/courses/${course.id}/editCourse`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <span className="">
                        <Trash2 className="h-4 w-4 text-destructive hover:text-destructive/80 cursor-pointer" />
                      </span>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Course</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete &quot;{course.name}
                          &quot;? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive hover:bg-destructive/90"
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
