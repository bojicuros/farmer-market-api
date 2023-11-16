import { Request, Response } from "express";
import {
  addPriceOfProduct,
  deletePrice,
  getPricesForCertainDay,
  getPricesPerMonth,
  getUserMarketProductsWithoutPriceToday,
  getUserPricesForToday,
  keepAllPrices,
  updatePriceOfProduct,
} from "../services/price.service";
import {
  AddProductPriceDto,
  MonthlyPricesDto,
  PriceIdDto,
  PricePerDayDto,
  UpdateProductPriceDto,
  UserIdDto,
} from "../validation/price.schema";

export async function getPriceForDate(req: Request, res: Response) {
  const { date, market_id } = req.query as PricePerDayDto;
  try {
    const prices = await getPricesForCertainDay(date, market_id);
    if (prices) {
      res.status(200).json(prices);
    } else {
      res.status(404).json({
        error: "Not Found",
        message: "No prices found for today",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "Error while performing the search",
    });
  }
}

export async function getTodaysUsersPrices(req: Request, res: Response) {
  const userId = (req.query as UserIdDto).user_id;
  try {
    const prices = await getUserPricesForToday(userId);
    if (prices) {
      res.status(200).json(prices);
    } else {
      res.status(404).json({
        error: "Not Found",
        message: "No prices found for today",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "Error while performing the search",
    });
  }
}

export async function getUsersProductWithoutTodaysPrice(
  req: Request,
  res: Response
) {
  const userId = (req.query as UserIdDto).user_id;
  try {
    const prices = await getUserMarketProductsWithoutPriceToday(userId);
    if (prices) {
      res.status(200).json(prices);
    } else {
      res.status(404).json({
        error: "Not Found",
        message: "No prices found for today",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "Error while performing the search",
    });
  }
}

export async function addProductPrice(req: Request, res: Response) {
  const { market_id, user_id, product_id, price_value } =
    req.body as AddProductPriceDto;
  try {
    const addedPrice = await addPriceOfProduct(
      market_id,
      user_id,
      product_id,
      price_value
    );
    if (addedPrice) {
      res.status(200).json(addedPrice);
    } else {
      res.status(400).json({
        error: "Bad Request",
        message: "No prices were added. Please check your request data.",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while processing your request.",
    });
  }
}

export async function updateProductPrice(req: Request, res: Response) {
  const { id, price_value } = req.body as UpdateProductPriceDto;
  try {
    const updatedPrice = await updatePriceOfProduct(id, price_value);
    if (updatedPrice) {
      res.status(200).json(updatedPrice);
    } else {
      res.status(400).json({
        error: "Bad Request",
        message: "No prices were added. Please check your request data.",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while processing your request.",
    });
  }
}

export async function deleteProductPrice(req: Request, res: Response) {
  const price_id = (req.query as PriceIdDto).id;
  try {
    await deletePrice(price_id);
    res.status(200).json({ message: "Price deleted successfully" });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "Error while deleting the price.",
    });
  }
}

export async function getMonthlyPrices(req: Request, res: Response) {
  const { market_id, user_id, product_id } = req.query as MonthlyPricesDto;
  try {
    const prices = await getPricesPerMonth(market_id, user_id, product_id);
    if (prices) {
      res.status(200).json(prices);
    } else {
      res.status(400).json({
        error: "Bad Request",
        message: "No prices.",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "An error occurred while processing your request.",
    });
  }
}

export async function keepProductPrices(req: Request, res: Response) {
  const userId = (req.query as UserIdDto).user_id;
  try {
    await keepAllPrices(userId);
    res.status(200).json({ message: "Successfully added prices" });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "Error while performing the search",
    });
  }
}
