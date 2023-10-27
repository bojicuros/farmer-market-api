import express from "express";
import { validate } from "../middleware/validation.middleware";
import {
  addProductSchema,
  marketIdSchema,
  productIdSchema,
  productUpdateSchema,
  updateProductSchema,
} from "../validation/product.schema";
import {
  addNewProduct,
  deleteProduct,
  getLatestPrices,
  getProductPrices,
  getProducts,
  updateProduct,
  updateProductPrice,
} from "../controllers/product.controller";

const router = express.Router();

router.get("/get-products", validate(marketIdSchema), getProducts);
router.get("/get-product-prices", validate(marketIdSchema), getProductPrices);
router.get("/get-latest-prices", validate(marketIdSchema), getLatestPrices);
router.post("/add-new-product", validate(addProductSchema), addNewProduct);
router.post("/update-product", validate(updateProductSchema), updateProduct);
router.post(
  "/update-product-price",
  validate(productUpdateSchema),
  updateProductPrice
);
router.delete("/delete-product", validate(productIdSchema), deleteProduct);

const productRouter = router;
export default productRouter;
