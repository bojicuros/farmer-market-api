import { Request, Response } from "express";
import {
  create,
  getById,
  update,
  toggleOpenStatus,
  getAllOpen,
} from "../services/market.service";
import {
  MarketDto,
  MarketIdDto,
  MarketUpdateDto,
} from "../validation/market.schema";
import { getAll } from "../services/market.service";

export async function getAllMarkets(_, res: Response) {
  try {
    const markets = await getAll();
    res.status(200).json(markets);
  } catch (error) {
    res.status(500).json({ error: "Error fetching markets" });
  }
}

export async function getAllOpenMarkets(_, res: Response) {
  try {
    const markets = await getAllOpen();
    res.status(200).json(markets);
  } catch (error) {
    res.status(500).json({ error: "Error fetching markets" });
  }
}

export async function getMarketById(req: Request, res: Response) {
  const marketId = (req.query as MarketIdDto).id;
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

export async function createMarket(req: Request, res: Response) {
  const market = req.body as MarketDto;
  try {
    const createdMarket = await create(market);
    if (createdMarket) {
      res.status(200).json(createdMarket);
    }
  } catch (error) {
    res.status(500).json({ error: "Error creating market" });
  }
}

export async function updateMarket(req: Request, res: Response) {
  const market = req.body as MarketUpdateDto;
  try {
    const updatedMarket = await update(market);
    if (updatedMarket) {
      res.status(200).json(updatedMarket);
    }
  } catch (error) {
    res.status(500).json({ error: "Error creating market" });
  }
}

export async function toggleMarketOpenStatus(req: Request, res: Response) {
  const marketId = (req.query as MarketIdDto).id;
  try {
    const market = await toggleOpenStatus(marketId);
    if (market) {
      res.status(200).json({ message: "Successfully changed" });
    } else {
      res.status(404).json({ error: "Market not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching market" });
  }
}
