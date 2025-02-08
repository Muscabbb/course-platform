import { getUserIdTag } from "@/features/users/db/cache";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Role } from "@prisma/client";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { prisma } from "@/lib/prisma";
const client = await clerkClient();

export async function getCurrentUser({ allData = false } = {}) {
  const { userId, sessionClaims, redirectToSignIn } = await auth();
  return {
    clerkUserId: userId,
    userId: sessionClaims?.dbId,
    data:
      allData && sessionClaims?.dbId != null
        ? await getUser(sessionClaims.dbId as string)
        : null,
    role: sessionClaims?.role,
    redirectToSignIn,
  };
}

export function syncClerkUserMetadata(user: {
  id: string;
  clerkUserId: string;
  role: Role;
}) {
  return client.users.updateUserMetadata(user.clerkUserId, {
    publicMetadata: {
      dbId: user.id,
      role: user.role,
    },
  });
}

async function getUser(id: string) {
  "use cache";
  cacheTag(getUserIdTag(id));
  console.log("called", "color: green");
  return await prisma.user.findFirst({
    where: {
      id,
    },
  });
}
