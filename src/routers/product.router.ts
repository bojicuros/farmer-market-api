import express from "express";
import { validate } from "../middleware/validation.middleware";
import {
  addProductSchema,
  marketIdSchema,
  productIdSchema,
  productPriceAddSchema,
  updateProductSchema,
} from "../validation/product.schema";
import {
  addNewProduct,
  addProductPrice,
  deleteProduct,
  getLatestPrices,
  getProductPrices,
  getProducts,
  updateProduct,
} from "../controllers/product.controller";

const router = express.Router();

router.get("/get-products", validate(marketIdSchema), getProducts);
router.get("/get-product-prices", validate(marketIdSchema), getProductPrices);
router.get("/get-latest-prices", validate(marketIdSchema), getLatestPrices);
router.post("/add-new-product", validate(addProductSchema), addNewProduct);
router.put("/update-product", validate(updateProductSchema), updateProduct);
router.delete("/delete-product", validate(productIdSchema), deleteProduct);
router.post(
  "/add-product-price",
  validate(productPriceAddSchema),
  addProductPrice
);

const productRouter = router;
export default productRouter;
