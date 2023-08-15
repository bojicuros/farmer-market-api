import { prisma } from "../../src/utils/db.server";

export async function getAll() {
  return prisma.market.findMany({
    select: { name: true, image_url: true },
    where: { is_open: true },
  });
}

export async function getById(marketId: string) {
  return prisma.market.findUnique({
    select: { name: true, image_url: true, location: true, is_open: true },
    where: { id: marketId },
  });
}
