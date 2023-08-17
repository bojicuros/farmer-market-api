import express from "express";
import {
  login,
  register,
  refreshAccessToken,
} from "../controllers/auth.controller";
import { validate } from "../middleware/validation.middleware";
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
} from "../validation/auth.schema";

const router = express.Router();

router.post("/login", validate(loginSchema), login);
router.post("/register", validate(registerSchema), register);
router.post("/refresh", validate(refreshTokenSchema), refreshAccessToken);

const authRouter = router;
export default authRouter;
