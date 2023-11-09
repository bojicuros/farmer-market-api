import { prisma } from "../../src/utils/db.server";

export async function dashboardInfo() {
  const numberOfMarkets = await prisma.market.count();

  const numberOfProducts = await prisma.product.count();

  const numberOfEmployees = await prisma.userMarket.count();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const numberOfPricesToday = await prisma.productPriceHistory.count({
    where: {
      price_date: {
        gte: startOfToday,
        lte: endOfToday,
      },
    },
  });

  const markets = await prisma.market.findMany();
  const marketPricePercentages = [];

  for (const market of markets) {
    const numberOfProductsInMarket = await prisma.userMarketProduct.count({
      where: {
        market_id: market.id,
      },
    });

    const pricesToday = await prisma.productPriceHistory.count({
      where: {
        market_id: market.id,
        price_date: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    });

    console.log(market.name, numberOfProductsInMarket, pricesToday);

    const percentage = Math.round(
      (pricesToday / numberOfProductsInMarket) * 100
    );

    marketPricePercentages.push({
      market: market.name,
      percentage,
    });
  }

  return {
    num_of_markets: numberOfMarkets,
    num_of_products: numberOfProducts,
    num_of_employees: numberOfEmployees,
    num_of_price_today: numberOfPricesToday,
    market_price_percentage: marketPricePercentages,
  };
}
