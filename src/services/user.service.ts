import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { prisma } from "../../src/utils/db.server";

export async function getAll() {
  return prisma.user.findMany();
}

export async function getById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      first_name: true,
      last_name: true,
      confirmed: true,
      is_active: true,
      UserRole: {
        select: {
          is_approved: true,
        },
      },
    },
  });
}

export async function getAllUnapproved() {
  return prisma.user.findMany({
    where: {
      UserRole: {
        some: {
          is_approved: false,
        },
      },
    },
  });
}

export async function create(user: User) {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  return prisma.user.create({
    data: {
      ...user,
      password: hashedPassword,
    },
  });
}

export async function updateById(user) {
  const existingUser = await getById(user.id);

  if (!existingUser) {
    throw new Error("User with that id is not found");
  }

  return prisma.user.update({
    where: { id: user.id },
    data: user,
  });
}

export async function deleteById(userId: string) {
  const existingUser = await getById(userId);

  if (!existingUser) {
    throw new Error("User with that id is not found");
  }

  return prisma.user.delete({
    where: { id: userId },
  });
}

export async function getMarketByVendor(userId: string) {
  const existingUser = await getById(userId);

  if (!existingUser) {
    throw new Error("User with that id is not found");
  }
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      UserMarket: {
        select: {
          market_id: true,
        },
      },
    },
  });
}
