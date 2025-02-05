import { auth, clerkClient } from "@clerk/nextjs/server";
import { Role } from "@prisma/client";

const client = await clerkClient();

export async function getCurrentUser() {
  const { userId, sessionClaims, redirectToSignIn } = await auth();
  return {
    clerkUserId: userId,
    userId: sessionClaims?.dbId,
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
