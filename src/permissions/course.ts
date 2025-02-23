import { Role } from "@prisma/client";

export function canCreate({ role }: { role: Role | unknown }) {
  return role === "admin";
}
