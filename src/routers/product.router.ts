import express from "express";
import { validate } from "../middleware/validation.middleware";
import {
  addProductSchema,
  userIdSchema,
  productIdSchema,
  updateProductSchema,
  userProductAddSchema,
  userProductDeleteSchema,
  vendorsSellingProductSchema,
} from "../validation/product.schema";
import {
  addNewProduct,
  addUserProducts,
  deleteProduct,
  deleteUserProducts,
  getAllProducts,
  getProductsNotAssociatedWithUser,
  getSellers,
  getUsersProducts,
  updateProduct,
} from "../controllers/product.controller";
import { authorize } from "../middleware/authorization.middleware";
import { UserRole } from "../utils/enums";

const router = express.Router();

router.get("/get-all-products", authorize([UserRole.Admin]), getAllProducts);
router.post(
  "/add-new-product",
  authorize([UserRole.Admin]),
  validate(addProductSchema),
  addNewProduct
);
router.put(
  "/update-product",
  authorize([UserRole.Admin]),
  validate(updateProductSchema),
  updateProduct
);
router.delete(
  "/delete-product",
  authorize([UserRole.Admin]),
  validate(productIdSchema),
  deleteProduct
);
router.get(
  "/get-users-products",
  authorize([UserRole.Vendor]),
  validate(userIdSchema),
  getUsersProducts
);
router.get(
  "/users-who-sell-product",
  authorize([UserRole.Vendor]),
  validate(vendorsSellingProductSchema),
  getSellers
);
router.get(
  "/get-products-not-associated-with-user",
  authorize([UserRole.Vendor]),
  validate(userIdSchema),
  getProductsNotAssociatedWithUser
);
router.post(
  "/add-user-product",
  authorize([UserRole.Vendor]),
  validate(userProductAddSchema),
  addUserProducts
);
router.delete(
  "/delete-user-product",
  authorize([UserRole.Vendor]),
  validate(userProductDeleteSchema),
  deleteUserProducts
);

const productRouter = router;
export default productRouter;
