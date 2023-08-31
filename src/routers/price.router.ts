import express from "express";
import { validate } from "../middleware/validation.middleware";
import { marketIdSchema } from "../validation/price.schema";
import { getLatestPrices } from "../controllers/price.controller";

const router = express.Router();

router.get("/get-latest-prices", validate(marketIdSchema), getLatestPrices);

const priceRouter = router;
export default priceRouter;
