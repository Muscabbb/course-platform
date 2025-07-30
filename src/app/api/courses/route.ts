import { getCoursesName } from "@/features/courses/db/course";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const courses = await getCoursesName();
    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
