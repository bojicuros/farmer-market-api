import { prisma } from "../../src/utils/db.server";

export async function getLastPrices(marketId: string) {
  return await prisma.price.findMany({
    where: {
      market_id: marketId,
    },
    orderBy: {
      price_date: "desc",
    },
    distinct: ["product_id"],
    select: {
      price_value: true,
      price_date: true,
      product: {
        select: {
          name: true,
          unit_of_measurement: true,
        },
      },
    },
  });
}
