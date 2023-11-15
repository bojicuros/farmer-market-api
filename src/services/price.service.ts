import { format, isSameDay } from "date-fns";
import { prisma } from "../../src/utils/db.server";

export async function getPricesForCertainDay(date: Date, marketId: string) {
  const pricesHistory = await prisma.productPriceHistory.findMany({
    where: { market_id: marketId },
    include: {
      UserMarketProduct: {
        include: {
          product: {
            select: {
              name: true,
              unit_of_measurement: true,
            },
          },
          userMarket: {
            include: {
              user: {
                select: {
                  first_name: true,
                  last_name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const requestedDay = new Date(date.toString());
  const pricesOnRequestedDay = pricesHistory
    .filter((item) =>
      isSameDay(new Date(item.price_date.toString()), requestedDay)
    )
    .map((item) => ({
      id: item.id,
      price_date: item.price_date,
      price_value: parseFloat(item.price_value.toFixed(2)),
      vendors_name: `${item.UserMarketProduct.userMarket.user.first_name} ${item.UserMarketProduct.userMarket.user.last_name}`,
      product: {
        name: item.UserMarketProduct.product.name,
        unit_of_measurement: item.UserMarketProduct.product.unit_of_measurement,
      },
    }))
    .sort((a, b) => a.product.name.localeCompare(b.product.name));

  return pricesOnRequestedDay;
}

export async function getUserPricesForToday(userId: string) {
  const pricesHistory = await prisma.productPriceHistory.findMany({
    where: { user_id: userId },
    select: {
      id: true,
      price_value: true,
      price_date: true,
      UserMarketProduct: {
        include: {
          product: {
            select: {
              name: true,
            },
          },
          userMarket: {
            include: {
              market: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const today = new Date();
  const todaysPrices = pricesHistory
    .filter((item) => isSameDay(new Date(item.price_date.toString()), today))
    .map((item) => ({
      id: item.id,
      price_value: item.price_value,
      price_date: item.price_date,
      product_name: item.UserMarketProduct.product.name,
      market_name: item.UserMarketProduct.userMarket.market.name,
    }));

  return todaysPrices;
}

export async function getUserMarketProductsWithoutPriceToday(userId: string) {
  const today = new Date();

  const userMarketProducts = await prisma.userMarketProduct.findMany({
    select: {
      user_id: true,
      market_id: true,
      product_id: true,
      product: {
        select: {
          name: true,
        },
      },
      userMarket: {
        include: {
          market: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    where: { user_id: userId },
  });

  const userMarketProductsWithoutPriceToday = [];

  for (const userMarketProduct of userMarketProducts) {
    const priceEntryToday = await prisma.productPriceHistory.findFirst({
      where: {
        user_id: userId,
        market_id: userMarketProduct.market_id,
        product_id: userMarketProduct.product_id,
        price_date: {
          gte: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            0,
            0,
            0
          ),
          lte: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            23,
            59,
            59
          ),
        },
      },
    });

    const latestPrice = await prisma.productPriceHistory.findFirst({
      select: {
        price_value: true,
      },
      where: {
        user_id: userId,
        market_id: userMarketProduct.market_id,
        product_id: userMarketProduct.product_id,
      },
      orderBy: { price_date: "desc" },
    });

    if (!priceEntryToday) {
      userMarketProductsWithoutPriceToday.push({
        ...userMarketProduct,
        latest_price: latestPrice ? latestPrice.price_value : null,
      });
    }
  }

  const productsWithoutPriceToday = userMarketProductsWithoutPriceToday.map(
    (userMarketProduct) => ({
      product_id: userMarketProduct.product_id,
      product_name: userMarketProduct.product.name,
      market_id: userMarketProduct.market_id,
      market_name: userMarketProduct.userMarket.market.name,
      latest_price: userMarketProduct.latest_price,
    })
  );

  return productsWithoutPriceToday;
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

export async function getPricesPerMonth(
  marketId: string,
  userId: string,
  productId: string
) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const priceHistory = await prisma.productPriceHistory.findMany({
    where: {
      user_id: userId,
      market_id: marketId,
      product_id: productId,
      price_date: {
        gte: thirtyDaysAgo,
      },
    },
    orderBy: {
      price_date: "asc",
    },
    select: {
      price_date: true,
      price_value: true,
    },
  });

  const formattedPriceHistory = priceHistory.map((entry) => {
    const formattedDate = format(new Date(entry.price_date), "dd-MM");
    const roundedPrice = parseFloat(entry.price_value.toFixed(2));
    return {
      price_date: formattedDate,
      price_value: roundedPrice,
    };
  });

  return formattedPriceHistory;
}
