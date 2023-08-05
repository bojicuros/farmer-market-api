import { User } from "@prisma/client";
import { prisma } from "../../src/utils/db.server";

export async function getAll() {
  return prisma.user.findMany();
}

export async function getById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
  });
}

export async function create(user: User) {
  return prisma.user.create({
    data: user,
  });
}

export async function updateById(user: User) {
  const existingUser = prisma.user.findUnique({
    where: { id: user.id },
  });
  if (!existingUser) {
    throw new Error("User with that id is not found");
  }
  return prisma.user.update({
    where: { id: user.id },
    data: user,
  });
}

export async function deleteById(userId: string) {
  const existingUser = prisma.user.findUnique({
    where: { id: userId },
  });
  if (!existingUser) {
    throw new Error("User with that id is not found");
  }
  return prisma.user.delete({
    where: { id: userId },
  });
}
