import { Request, Response } from "express";
import { MarketIdDto } from "../validation/price.schema";
import {
  getLastPrices,
  getProductsByMarket,
} from "../services/product.service";

export async function getProducts(req: Request, res: Response) {
  const marketId = (req.query as MarketIdDto).market_id;
  try {
    const products = await getProductsByMarket(marketId);
    if (products) {
      const productList = products.map((item) => item.product);
      res.status(200).json(productList);
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching prices" });
  }
}

export async function getLatestPrices(req: Request, res: Response) {
  const marketId = (req.query as MarketIdDto).market_id;
  try {
    const prices = await getLastPrices(marketId);
    if (prices) {
      res.status(200).json(prices);
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching prices" });
  }
}
