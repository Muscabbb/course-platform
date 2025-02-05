import { Role } from "@prisma/client";

export function canAccessAdminPage(role: Role) {
  return role === "admin";
}
