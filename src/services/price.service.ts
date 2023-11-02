import { isSameDay } from "date-fns";
import { prisma } from "../../src/utils/db.server";

export async function getPricesForToday(marketId: string) {
  const pricesHistory = await prisma.productPriceHistory.findMany({
    where: { market_id: marketId },
  });

  const today = new Date();
  const todaysPrices = pricesHistory.filter((item) =>
    isSameDay(new Date(item.price_date.toString()), today)
  );

  return todaysPrices;
}

export async function getPricesForCurtainDay(date: Date, marketId: string) {
  const pricesHistory = await prisma.productPriceHistory.findMany({
    where: { market_id: marketId },
  });

  const requestedDay = new Date(date.toString());
  const pricesOnRequestedDay = pricesHistory.filter((item) =>
    isSameDay(new Date(item.price_date.toString()), requestedDay)
  );

  return pricesOnRequestedDay;
}

export async function addPriceOfProduct(
  market_id: string,
  user_id: string,
  product_id: string,
  price_value: number
) {
  return await prisma.productPriceHistory.create({
    data: {
      market_id: market_id,
      user_id: user_id,
      product_id: product_id,
      price_value: price_value,
    },
  });
}

export async function updatePriceOfProduct(
  price_id: string,
  price_value: number
) {
  return await prisma.productPriceHistory.update({
    where: { id: price_id },
    data: {
      price_value: price_value,
    },
  });
}

export async function deletePrice(price_id: string) {
  return await prisma.productPriceHistory.delete({
    where: { id: price_id },
  });
}
