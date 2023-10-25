import express from "express";
import { validate } from "../middleware/validation.middleware";
import { marketIdSchema } from "../validation/product.schema";
import { getProducts } from "../controllers/product.controller";

const router = express.Router();

router.get("/get-products", validate(marketIdSchema), getProducts);

const productRouter = router;
export default productRouter;
