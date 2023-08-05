import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

declare global {
  var _prisma: PrismaClient | undefined;
}

if (!global.global.db) {
  _prisma = new PrismaClient();
}

prisma = global._prisma;

export { prisma };
