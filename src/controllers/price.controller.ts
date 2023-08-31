import { Request, Response } from "express";
import { MarketIdDto } from "../validation/price.schema";
import { getLastPrices } from "../services/price.service";

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
