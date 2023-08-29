import express from "express";
import {
  login,
  register,
  refreshAccessToken,
  confirmToken,
} from "../controllers/auth.controller";
import { validate } from "../middleware/validation.middleware";
import {
  confirmationTokenSchema,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
} from "../validation/auth.schema";

const router = express.Router();

router.post("/login", validate(loginSchema), login);
router.post("/register", validate(registerSchema), register);
router.post("/refresh", validate(refreshTokenSchema), refreshAccessToken);
router.post("/email-confirm", validate(confirmationTokenSchema), confirmToken);

const authRouter = router;
export default authRouter;
