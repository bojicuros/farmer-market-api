import { Request, Response } from "express";
import { SearchQueryDto } from "../validation/search.schema";
import { search } from "../services/search.service";

export async function searchHandler(req: Request, res: Response) {
  try {
    const query = (req.query as SearchQueryDto).query;
    const results = await search(query);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Error while searching" });
  }
}
