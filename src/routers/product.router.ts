import express from "express";
import { validate } from "../middleware/validation.middleware";
import {
  addProductSchema,
  userIdSchema,
  productIdSchema,
  updateProductSchema,
  userProductAddSchema,
  userProductDeleteSchema,
} from "../validation/product.schema";
import {
  addNewProduct,
  addUserProducts,
  deleteProduct,
  deleteUserProducts,
  getAllProducts,
  getProductsNotAssociatedWithUser,
  getUsersProducts,
  updateProduct,
} from "../controllers/product.controller";

const router = express.Router();

router.get("/get-all-products", getAllProducts);
router.post("/add-new-product", validate(addProductSchema), addNewProduct);
router.put("/update-product", validate(updateProductSchema), updateProduct);
router.delete("/delete-product", validate(productIdSchema), deleteProduct);
router.get("/get-users-products", validate(userIdSchema), getUsersProducts);
router.get(
  "/get-products-not-associated-with-user",
  validate(userIdSchema),
  getProductsNotAssociatedWithUser
);
router.post(
  "/add-user-product",
  validate(userProductAddSchema),
  addUserProducts
);
router.delete(
  "/delete-user-product",
  validate(userProductDeleteSchema),
  deleteUserProducts
);

const productRouter = router;
export default productRouter;
