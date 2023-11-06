import { UserMarketProduct } from "@prisma/client";
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
    },
  });

  const productList = userMarketProducts.map((item) => item.product);
  return productList;
}

export async function getProductsNotSoldByUser(userId: string) {
  const productsSoldByUser = await prisma.userMarketProduct.findMany({
    where: { user_id: userId },
    select: {
      product_id: true,
    },
  });

  const productIdsSoldByUser = productsSoldByUser.map(
    (product) => product.product_id
  );

  return await prisma.product.findMany({
    where: {
      NOT: {
        id: { in: productIdsSoldByUser },
      },
    },
    select: {
      id: true,
      name: true,
      unit_of_measurement: true,
    },
  });
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
  product_ids: string[]
) {
  const recordsToAdd = product_ids.map((product_id) => ({
    user_id,
    market_id,
    product_id,
  }));

  const addedRecords = await prisma.userMarketProduct.createMany({
    data: recordsToAdd,
  });

  return addedRecords;
}

export async function deleteUsersProducts(
  user_id: string,
  market_id: string,
  product_ids: string[]
) {
  await prisma.productPriceHistory.deleteMany({
    where: {
      user_id: user_id,
      market_id: market_id,
      product_id: {
        in: product_ids,
      },
    },
  });

  return await prisma.userMarketProduct.deleteMany({
    where: {
      user_id,
      market_id,
      product_id: {
        in: product_ids,
      },
    },
  });
}
