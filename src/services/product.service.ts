import { prisma } from "../../src/utils/db.server";

export async function getProductsByMarket(marketId: string) {
  return await prisma.price.findMany({
    where: {
      market_id: marketId,
    },
    distinct: ["product_id"],
    select: {
      product: {
        select: {
          id: true,
          name: true,
          description: true,
          created_at: true,
          unit_of_measurement: true,
        },
      },
    },
  });
}
