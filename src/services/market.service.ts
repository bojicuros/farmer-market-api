import { prisma } from "../../src/utils/db.server";

export async function getAll() {
  return prisma.market.findMany({
    select: {
      id: true,
      name: true,
      address: true,
      is_open: true,
      created_at: true,
    },
  });
}

export async function getAllOpen() {
  return prisma.market.findMany({
    select: { id: true, name: true, image_url: true },
    where: { is_open: true },
  });
}

export async function getById(marketId: string) {
  return prisma.market.findUnique({
    select: {
      name: true,
      image_url: true,
      address: true,
      is_open: true,
      lat: true,
      lng: true,
    },
    where: { id: marketId },
  });
}

export async function create(market) {
  return prisma.market.create({
    data: market,
  });
}

export async function update(market) {
  return prisma.market.update({
    where: { id: market.id },
    data: market,
  });
}

export async function toggleOpenStatus(marketId: string) {
  const market = await getById(marketId);

  if (!market) throw new Error("No market with this id found");

  return prisma.market.update({
    where: { id: marketId },
    data: { is_open: !market.is_open },
  });
}
