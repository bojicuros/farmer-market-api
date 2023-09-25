import { User } from "@prisma/client";
import { prisma } from "../../src/utils/db.server";
import bcrypt from "bcrypt";
import { RegisterInfoDto } from "../validation/auth.schema";
import { MAX_FAILED_ATTEMPTS_EMAIL } from "../controllers/auth.controller";

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

export async function createUser(user: RegisterInfoDto) {
  const hashedPassword = await bcrypt.hash(user.password, 10);

  return prisma.user.create({
    data: {
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      password: hashedPassword,
      phone_number: user.phone_number,
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
    return session;
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

  await prisma.confirmationToken.deleteMany({
    where: { user_id: user_id },
  });

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
      await deleteConfirmationToken(tokenData.id);

      await prisma.user.update({
        where: { id: user_id },
        data: { confirmed: true },
      });
    }
  } catch (e) {
    throw e;
  }
}

export async function deleteConfirmationToken(id: string) {
  await prisma.confirmationToken.delete({
    where: {
      id: id,
    },
  });
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

    if (updatedToken.failed_attempts === MAX_FAILED_ATTEMPTS_EMAIL) {
      await prisma.confirmationToken.delete({ where: { user_id: user_id } });
      await prisma.user.delete({ where: { id: user_id } });
    }

    return updatedToken;
  } catch (e) {
    throw e;
  }
}

export async function updatePassword(user_id: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });

    if (!user) throw new Error("No user found");

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: { id: user_id },
      data: { password: hashedPassword },
    });

    return updatedUser;
  } catch (e) {
    throw e;
  }
}
