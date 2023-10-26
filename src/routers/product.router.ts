import express from "express";
import { validate } from "../middleware/validation.middleware";
import {
  marketIdSchema,
  productUpdateSchema,
} from "../validation/product.schema";
import {
  getLatestPrices,
  getProductPrices,
  getProducts,
  updateProductPrice,
} from "../controllers/product.controller";

const router = express.Router();

router.get("/get-products", validate(marketIdSchema), getProducts);
router.get("/get-product-prices", validate(marketIdSchema), getProductPrices);
router.get("/get-latest-prices", validate(marketIdSchema), getLatestPrices);
router.post(
  "/update-product-price",
  validate(productUpdateSchema),
  updateProductPrice
);

const productRouter = router;
export default productRouter;
