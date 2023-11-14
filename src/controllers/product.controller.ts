import { Request, Response } from "express";
import {
  addProduct,
  addUsersProducts,
  deleteProductById,
  deleteUsersProducts,
  getProducts,
  getProductsNotSoldByUser,
  getUserProducts,
  getVendorsWhoSellsProduct,
  updateProductById,
} from "../services/product.service";
import {
  AddProductDto,
  ProductIdDto,
  UpdateProductDto,
  UserIdDto,
  UserProductAddDto,
  UserProductDeleteDto,
  VendorsSellingProductDto,
} from "../validation/product.schema";

export async function getAllProducts(_: Request, res: Response) {
  try {
    const allProducts = await getProducts();
    res.status(200).json(allProducts);
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "Error fetching all products",
    });
  }
}

export async function addNewProduct(req: Request, res: Response) {
  const { name, unit_of_measurement } = req.body as AddProductDto;
  try {
    const addedProduct = await addProduct(name, unit_of_measurement);
    res.status(201).json(addedProduct);
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "Error adding a new product",
    });
  }
}

export async function updateProduct(req: Request, res: Response) {
  const { id, name, unit_of_measurement } = req.body as UpdateProductDto;
  try {
    const updatedProduct = await updateProductById(
      id,
      name,
      unit_of_measurement
    );
    if (updatedProduct) {
      res.status(200).json(updatedProduct);
    } else {
      res
        .status(404)
        .json({ error: "Not Found", message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "Error updating the product",
    });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  const id = (req.query as ProductIdDto).id;
  try {
    const deletedProduct = deleteProductById(id);
    if (deletedProduct) {
      res.status(204).json(deletedProduct);
    } else {
      res
        .status(404)
        .json({ error: "Not Found", message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "Error deleting the product",
    });
  }
}

export async function getUsersProducts(req: Request, res: Response) {
  const userId = (req.query as UserIdDto).user_id;
  try {
    const products = await getUserProducts(userId);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "Error fetching products by market",
    });
  }
}

export async function getSellers(req: Request, res: Response) {
  const { user_id, market_id, product_id } =
    req.query as VendorsSellingProductDto;
  try {
    const sellers = await getVendorsWhoSellsProduct(
      product_id,
      user_id,
      market_id
    );
    res.status(200).json(sellers);
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "Error fetching products by market",
    });
  }
}

export async function getProductsNotAssociatedWithUser(
  req: Request,
  res: Response
) {
  const userId = (req.query as UserIdDto).user_id;
  try {
    const products = await getProductsNotSoldByUser(userId);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "Error fetching products not associated with the user",
    });
  }
}

export async function addUserProducts(req: Request, res: Response) {
  const { user_id, market_id, product_id } = req.body as UserProductAddDto;
  try {
    const addedProduct = await addUsersProducts(user_id, market_id, product_id);
    res.status(201).json(addedProduct);
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "Error adding user products",
    });
  }
}

export async function deleteUserProducts(req: Request, res: Response) {
  const { user_id, market_id, product_id } = req.query as UserProductDeleteDto;
  try {
    const deletedProducts = deleteUsersProducts(user_id, market_id, product_id);
    if (deletedProducts) {
      res.status(204).json(deletedProducts);
    } else {
      res
        .status(404)
        .json({ error: "Not Found", message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "Error deleting user products",
    });
  }
}
