import express from "express";
import { validate } from "../middleware/validation.middleware";
import { marketIdSchema } from "../validation/product.schema";
import {
  getLatestPrices,
  getProducts,
} from "../controllers/product.controller";

const router = express.Router();

router.get("/get-products", validate(marketIdSchema), getProducts);
router.get("/get-product-prices", validate(marketIdSchema), getProducts);
router.get("/get-latest-prices", validate(marketIdSchema), getLatestPrices);

const productRouter = router;
export default productRouter;
