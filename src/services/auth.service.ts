import { User } from "@prisma/client";
import { prisma } from "../../src/utils/db.server";

export async function getUser(userEmail: string) {
  return prisma.user.findUnique({
    where: { email: userEmail },
    include: {
      UserRole: {
        include: {
          role: true,
        },
      },
    },
  });
}

export async function createUser(user) {
  return prisma.user.create({
    data: {
      ...user,
      UserRole: {
        create: [
          {
            role: {
              connect: { name: "Vendor" },
            },
          },
        ],
      },
    },
  });
}

export async function getUserByRefreshToken(refreshToken: string) {
  try {
    const session = await prisma.userSession.findUnique({
      where: {
        refresh_token: refreshToken,
      },
      include: {
        user: {
          include: {
            UserRole: {
              include: {
                role: true,
              },
            },
          },
        },
      },
    });
    return session.user;
  } catch (error) {
    throw error;
  }
}

export async function createUserSession(user: User, refreshToken: string) {
  await prisma.userSession.deleteMany({
    where: {
      user_id: user.id,
    },
  });
  await prisma.userSession.create({
    data: {
      user_id: user.id,
      refresh_token: refreshToken,
    },
  });
}
