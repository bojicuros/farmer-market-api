import { Request, Response } from "express";
import { MarketIdDto } from "../validation/price.schema";
import { getProductsByMarket } from "../services/product.service";

export async function getProducts(req: Request, res: Response) {
  const marketId = (req.query as MarketIdDto).market_id;
  try {
    const products = await getProductsByMarket(marketId);
    if (products) {
      res.status(200).json(products);
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching prices" });
  }
}
