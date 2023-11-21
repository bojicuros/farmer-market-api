import express from "express";
import {
  addProductPrice,
  deleteProductPrice,
  getMonthlyPrices,
  getPriceForDate,
  getTodaysUsersPrices,
  getUsersProductWithoutTodaysPrice,
  keepProductPrices,
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
import { authorize } from "../middleware/authorization.middleware";
import { UserRole } from "../utils/enums";

const router = express.Router();

router.get("/get-prices-by-date", validate(pricePerDaySchema), getPriceForDate);
router.get(
  "/get-todays-user-prices",
  authorize([UserRole.Vendor]),
  validate(userIdSchema),
  getTodaysUsersPrices
);
router.get(
  "/get-products-without-todays-prices",
  authorize([UserRole.Vendor]),
  validate(userIdSchema),
  getUsersProductWithoutTodaysPrice
);
router.get(
  "/get-monthly-prices",
  authorize([UserRole.Vendor]),
  validate(monthlyPricesSchema),
  getMonthlyPrices
);
router.post(
  "/add-product-price",
  authorize([UserRole.Vendor]),
  validate(addProductPriceSchema),
  addProductPrice
);
router.put(
  "/update-product-price",
  authorize([UserRole.Vendor]),
  validate(updateProductPriceSchema),
  updateProductPrice
);
router.delete(
  "/delete-product-price",
  authorize([UserRole.Vendor]),
  validate(priceIdSchema),
  deleteProductPrice
);
router.post(
  "/keep-prices",
  authorize([UserRole.Vendor]),
  validate(userIdSchema),
  keepProductPrices
);

const priceRouter = router;
export default priceRouter;
