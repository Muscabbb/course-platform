import { auth, clerkClient } from "@clerk/nextjs/server";
import { Role } from "@prisma/client";

const client = clerkClient();

export async function getCurrentUser() {
  const { userId, sessionClaims, redirectToSignIn } = await auth();
  return {
    clerkUserId: userId,
    userId: sessionClaims?.dbId,
    role: sessionClaims?.role,
    redirectToSignIn,
  };
}

export async function syncClerkUserMeteData(user: {
  id: string;
  clerkUserId: string;
  role: Role;
}) {
  return (await client).users.updateUserMetadata(user.clerkUserId, {
    publicMetadata: { dbId: user.id, role: user.role },
  });
}
