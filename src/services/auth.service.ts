import { ConfirmationToken, User } from "@prisma/client";
import { prisma } from "../../src/utils/db.server";
import bcrypt from "bcrypt";

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

export async function createConfirmationToken(token: string, user_id: string) {
  const hashedToken = await bcrypt.hash(token, 10);

  await prisma.confirmationToken.create({
    data: {
      token: hashedToken,
      user_id: user_id,
    },
  });
}

export async function getConfirmationToken(user_id: string) {
  try {
    const confToken = await prisma.confirmationToken.findUnique({
      where: {
        user_id: user_id,
      },
    });

    return confToken;
  } catch (e) {
    throw e;
  }
}

export async function rightConfirmationToken(user_id: string) {
  try {
    const tokenData = await prisma.confirmationToken.findUnique({
      where: {
        user_id: user_id,
      },
    });

    if (tokenData) {
      await prisma.confirmationToken.delete({
        where: {
          id: tokenData.id,
        },
      });

      await prisma.user.update({
        where: { id: user_id },
        data: { confirmed: true },
      });
    }
  } catch (e) {
    throw e;
  }
}

export async function wrongConfirmationToken(user_id: string) {
  try {
    const confToken = await prisma.confirmationToken.findUnique({
      where: {
        user_id: user_id,
      },
    });

    const updatedToken = await prisma.confirmationToken.update({
      where: { user_id: user_id },
      data: { failed_attempts: confToken.failed_attempts + 1 },
    });

    if (updatedToken.failed_attempts === 3)
      await prisma.confirmationToken.delete({ where: { user_id: user_id } });

    return updatedToken;
  } catch (e) {
    throw e;
  }
}
