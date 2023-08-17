import express from "express";
import { login, register } from "../controllers/auth.controller";
import { validate } from "../middleware/validation.middleware";
import { loginSchema, registerSchema } from "../validation/auth.schema";

const router = express.Router();

router.post("/login", validate(loginSchema), login);
router.post("/register", validate(registerSchema), register);

const authRouter = router;
export default authRouter;
