import { Role } from "@prisma/client";

export function canCreateCourse({ role }: { role: Role | unknown }) {
  return role === "admin";
}
