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
