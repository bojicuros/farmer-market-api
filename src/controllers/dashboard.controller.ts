import { Request, Response } from "express";
import { dashboardInfo } from "../services/dashboard.service";

export async function getDashboardInfo(_: Request, res: Response) {
  try {
    const results = await dashboardInfo();
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "Error while getting dashboard info",
    });
  }
}
