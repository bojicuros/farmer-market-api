import express from "express";
import {
  addProductPrice,
  deleteProductPrice,
  getPriceForDate,
  getTodaysPrices,
  updateProductPrice,
} from "../controllers/price.controller";
import {
  addProductPriceSchema,
  marketIdSchema,
  priceIdSchema,
  pricePerDaySchema,
  updateProductPriceSchema,
} from "../validation/price.schema";
import { validate } from "../middleware/validation.middleware";

const router = express.Router();

router.get("/get-todays-prices", validate(marketIdSchema), getTodaysPrices);
router.get("/get-prices-by-date", validate(pricePerDaySchema), getPriceForDate);
router.post(
  "/add-product-price",
  validate(addProductPriceSchema),
  addProductPrice
);
router.put(
  "/update-product-price",
  validate(updateProductPriceSchema),
  updateProductPrice
);
router.delete(
  "/delete-product-price",
  validate(priceIdSchema),
  deleteProductPrice
);

const priceRouter = router;
export default priceRouter;
