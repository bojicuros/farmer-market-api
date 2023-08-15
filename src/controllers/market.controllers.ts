import { Request, Response } from "express";
import { getAll, getById } from "../services/market.service";

export async function getAllMarkets(_, res: Response) {
  try {
    const markets = await getAll();
    res.status(200).json(markets);
  } catch (error) {
    res.status(500).json({ error: "Error fetching markets" });
  }
}

export async function getMarketById(req: Request, res: Response) {
  const marketId = req.query.id as string;
  try {
    const market = await getById(marketId);
    if (market) {
      res.status(200).json(market);
    } else {
      res.status(404).json({ error: "Market not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching market" });
  }
}
