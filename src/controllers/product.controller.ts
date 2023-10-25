import { Request, Response } from "express";
import { MarketIdDto } from "../validation/price.schema";
import {
  getLastPrices,
  getProductPricesByMarket,
  getProductsByMarket,
} from "../services/product.service";
import { isSameDay, parseISO } from "date-fns";

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

export async function getProductPrices(req: Request, res: Response) {
  const marketId = (req.query as MarketIdDto).market_id;
  try {
    const productPrices = await getProductPricesByMarket(marketId);
    if (productPrices) {
      const today = new Date();
      const detailedProductPrices = productPrices
        .filter(
          (item) => !isSameDay(new Date(item.price_date.toString()), today)
        )
        .map((item) => ({
          id: item.product.id,
          name: item.product.name,
          price_value: item.price_value,
          updated_at: item.price_date,
        }));

      res.status(200).json(detailedProductPrices);
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching prices" });
  }
}
