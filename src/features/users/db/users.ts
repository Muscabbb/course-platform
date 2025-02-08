import { Prisma } from "@prisma/client";
import { revalidateUserCache } from "./cache";
import { prisma } from "@/lib/prisma";

export async function InsertUser(userData: Prisma.UserCreateInput) {
  const user = await prisma.user.findFirst({
    where: {
      clerkUserId: userData.clerkUserId,
    },
  });
  if (user) {
    return await prisma.user.update({
      where: {
        id: user.id,
      },
      data: userData,
    });
  }

  const newUser = await prisma.user.create({
    data: userData,
  });
  revalidateUserCache(newUser.id);
  return newUser;
}

export async function GetUser(clerkUserId: string) {
  return await prisma.user.findFirst({
    where: {
      clerkUserId,
    },
  });
}

export async function GetUsers() {
  return await prisma.user.findMany();
}

export async function updateUser(
  clerkUserId: string,
  userData: Prisma.UserUpdateInput
) {
  const user = await prisma.user.findFirst({
    where: {
      clerkUserId,
    },
  });

  if (!user) {
    return await prisma.user.create({
      data: userData as Prisma.UserCreateInput,
    });
  }
  const updatedUser = await prisma.user.update({
    where: {
      clerkUserId,
    },
    data: userData,
  });
  revalidateUserCache(updatedUser.id);
  return updatedUser;
}

export async function DeleteUser(clerkUserId: string) {
  const deletedUser = await prisma.user.update({
    where: {
      clerkUserId,
    },
    data: {
      deletedAt: new Date(),
      email: "removed@deleted.com",
      name: "Removed",
      imageUrl: null,
      clerkUserId: "deleted",
    },
  });

  if (deletedUser == null) throw new Error("failed to delete user");
  revalidateUserCache(deletedUser.id);
  return deletedUser;
}
