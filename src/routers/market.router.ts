import express from "express";
import {
  getAllMarkets,
  getMarketById,
} from "../controllers/market.controllers";

const router = express.Router();

router.get("/get-all", getAllMarkets);
router.get("/get", getMarketById);

const marketRouter = router;
export default marketRouter;
