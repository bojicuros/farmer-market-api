import express from "express";
import {
  login,
  register,
  refreshAccessToken,
  forgotPassword,
  confirmEmailToken,
  confirmPasswordToken,
} from "../controllers/auth.controller";
import { validate } from "../middleware/validation.middleware";
import {
  emailSchema,
  emailTokenSchema,
  loginSchema,
  passwordTokenSchema,
  refreshTokenSchema,
  registerSchema,
} from "../validation/auth.schema";

const router = express.Router();

router.post("/login", validate(loginSchema), login);
router.post("/register", validate(registerSchema), register);
router.post("/refresh", validate(refreshTokenSchema), refreshAccessToken);
router.post(
  "/email-token-confirm",
  validate(emailTokenSchema),
  confirmEmailToken
);
router.post("/forgot-password", validate(emailSchema), forgotPassword);
router.post(
  "/password-token-confirm",
  validate(passwordTokenSchema),
  confirmPasswordToken
);

const authRouter = router;
export default authRouter;
