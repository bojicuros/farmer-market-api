import express from "express";
import {
  createMarket,
  getAllMarkets,
  getMarketById,
  toggleMarketOpenStatus,
  updateMarket,
} from "../controllers/market.controllers";
import { validate } from "../middleware/validation.middleware";
import {
  marketCreateSchema,
  marketIdSchema,
  marketUpdateSchema,
} from "../validation/market.schema";

const router = express.Router();

router.get("/get-all", getAllMarkets);
router.get("/get-by-id", validate(marketIdSchema), getMarketById);
router.post("/create", validate(marketCreateSchema), createMarket);
router.put("/update-by-id", validate(marketUpdateSchema), updateMarket);
router.put(
  "/toggle-open-status",
  validate(marketIdSchema),
  toggleMarketOpenStatus
);

const marketRouter = router;
export default marketRouter;
