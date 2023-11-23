import express from "express";
import { searchHandler } from "../controllers/search.controller";
import { validate } from "../middleware/validation.middleware";
import { searchSchema } from "../validation/search.schema";

const router = express.Router();

router.get("/", validate(searchSchema), searchHandler);

const searchRouter = router;
export default searchRouter;
