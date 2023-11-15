import express from "express";
import {
  addProductPrice,
  deleteProductPrice,
  getMonthlyPrices,
  getPriceForDate,
  getTodaysUsersPrices,
  getUsersProductWithoutTodaysPrice,
  updateProductPrice,
} from "../controllers/price.controller";
import {
  addProductPriceSchema,
  monthlyPricesSchema,
  priceIdSchema,
  pricePerDaySchema,
  updateProductPriceSchema,
  userIdSchema,
} from "../validation/price.schema";
import { validate } from "../middleware/validation.middleware";

const router = express.Router();

router.get("/get-prices-by-date", validate(pricePerDaySchema), getPriceForDate);
router.get(
  "/get-todays-user-prices",
  validate(userIdSchema),
  getTodaysUsersPrices
);
router.get(
  "/get-products-without-todays-prices",
  validate(userIdSchema),
  getUsersProductWithoutTodaysPrice
);
router.get(
  "/get-monthly-prices",
  validate(monthlyPricesSchema),
  getMonthlyPrices
);
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
