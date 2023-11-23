import express from "express";
import {
  createMarket,
  getAllMarkets,
  getAllOpenMarkets,
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
import { authorize } from "../middleware/authorization.middleware";
import { UserRole } from "../utils/enums";

const router = express.Router();

router.get("/get-all-open", getAllOpenMarkets);
router.get("/get-all", authorize([UserRole.Admin]), getAllMarkets);
router.get(
  "/get-by-id",
  authorize([UserRole.Admin]),
  validate(marketIdSchema),
  getMarketById
);
router.post(
  "/create",
  authorize([UserRole.Admin]),
  validate(marketCreateSchema),
  createMarket
);
router.put(
  "/update-by-id",
  authorize([UserRole.Admin]),
  validate(marketUpdateSchema),
  updateMarket
);
router.put(
  "/toggle-open-status",
  authorize([UserRole.Admin]),
  validate(marketIdSchema),
  toggleMarketOpenStatus
);

const marketRouter = router;
export default marketRouter;
