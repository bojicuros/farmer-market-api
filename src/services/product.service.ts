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
          id: true,
          name: true,
          unit_of_measurement: true,
        },
      },
    },
  });
}

export async function getProductPricesByMarket(marketId: string) {
  return await prisma.price.findMany({
    where: {
      market_id: marketId,
    },
    orderBy: {
      price_date: "desc",
    },
    distinct: ["product_id"],
    select: {
      id: true,
      price_value: true,
      price_date: true,
      product: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function updateProductById(
  id: string,
  name: string,
  description: string,
  unit_of_measurement: string
) {
  const product = await prisma.product.findUnique({
    where: { id: id },
  });

  if (!product) {
    throw new Error("Product with this id do not exists");
  }

  return await prisma.product.update({
    where: { id: product.id },
    data: {
      name: name,
      description: description,
      unit_of_measurement: unit_of_measurement,
    },
  });
}

export async function updateProductPriceById(
  id: string,
  price_value: number,
  user_id: string
) {
  const priceInfo = await prisma.price.findUnique({
    where: { id: id },
  });

  if (!priceInfo) {
    throw new Error("Price with this id do not exists");
  }

  return await prisma.price.create({
    data: {
      market_id: priceInfo.market_id,
      product_id: priceInfo.product_id,
      price_value: price_value,
      price_date: new Date(),
      user_id: user_id,
    },
  });
}

export async function deleteProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id: id },
  });

  if (!product) {
    throw new Error("Product with this id do not exists");
  }
  await prisma.product.delete({
    where: { id: product.id },
  });
}
