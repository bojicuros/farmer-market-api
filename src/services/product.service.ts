import { prisma } from "../../src/utils/db.server";

export async function getProducts() {
  return await prisma.product.findMany({});
}

export async function getUserProducts(userId: string) {
  const userMarketProducts = await prisma.userMarketProduct.findMany({
    where: { user_id: userId },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          unit_of_measurement: true,
        },
      },
      userMarket: {
        include: {
          market: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      market_id: "asc",
    },
  });

  const productList = userMarketProducts.map((item) => ({
    id: item.product.id,
    name: item.product.name,
    unit_of_measurement: item.product.unit_of_measurement,
    market: item.userMarket.market.name,
    market_id: item.userMarket.market.id,
  }));

  return productList;
}

export async function getProductsNotSoldByUser(userId: string) {
  const userMarkets = await prisma.userMarket.findMany({
    where: { user_id: userId },
    select: { market_id: true, market: true },
  });

  const userSellingProducts = await prisma.userMarketProduct.findMany({
    where: { user_id: userId },
    select: { market_id: true, product_id: true },
  });

  const usersMarkets = userMarkets.map((market) => ({
    market_id: market.market_id,
    name: market.market.name,
  }));

  const productsUserIsSelling = userSellingProducts.map((userProduct) => ({
    market_id: userProduct.market_id,
    product_id: userProduct.product_id,
  }));

  const productsUserIsNotSelling = [];

  for (const market of usersMarkets) {
    const productsInMarket = await prisma.product.findMany();

    const productsSellingInMarket = productsUserIsSelling.filter(
      (userProduct) => userProduct.market_id === market.market_id
    );

    const productsNotSellingInMarket = productsInMarket.filter(
      (product) =>
        !productsSellingInMarket.some(
          (userProduct) => userProduct.product_id === product.id
        )
    );

    productsNotSellingInMarket.forEach((product) => {
      const productWithMarketId = {
        id: product.id,
        name: product.name,
        unit_of_measurement: product.unit_of_measurement,
        market: market.name,
        market_id: market.market_id,
      };
      productsUserIsNotSelling.push(productWithMarketId);
    });
  }

  return productsUserIsNotSelling;
}

export async function addProduct(name: string, unit_of_measurement: string) {
  return await prisma.product.create({
    data: {
      name: name,
      unit_of_measurement: unit_of_measurement,
    },
  });
}

export async function updateProductById(
  id: string,
  name: string,
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
      unit_of_measurement: unit_of_measurement,
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

  await prisma.userMarketProduct.deleteMany({
    where: { product_id: product.id },
  });

  await prisma.product.delete({
    where: { id: product.id },
  });
}

export async function addUsersProducts(
  user_id: string,
  market_id: string,
  product_id: string
) {
  const addedRecords = await prisma.userMarketProduct.create({
    data: {
      user_id: user_id,
      product_id: product_id,
      market_id: market_id,
    },
  });

  return addedRecords;
}

export async function deleteUsersProducts(
  user_id: string,
  market_id: string,
  product_id: string
) {
  await prisma.productPriceHistory.deleteMany({
    where: {
      user_id: user_id,
      market_id: market_id,
      product_id: product_id,
    },
  });

  return await prisma.userMarketProduct.deleteMany({
    where: {
      user_id,
      market_id,
      product_id: product_id,
    },
  });
}
