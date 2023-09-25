import express from "express";
import {
  login,
  register,
  refreshAccessToken,
  forgotPassword,
  confirmEmailToken,
  confirmPasswordToken,
  validateResetToken,
  emailAvailable,
  requireConfirmationToken,
} from "../controllers/auth.controller";
import { validate } from "../middleware/validation.middleware";
import {
  emailSchema,
  emailTokenSchema,
  loginSchema,
  passwordTokenSchema,
  refreshTokenSchema,
  registerSchema,
  resetTokenSchema,
} from "../validation/auth.schema";

const router = express.Router();

router.post("/login", validate(loginSchema), login);
router.post("/register", validate(registerSchema), register);
router.post("/refresh", validate(refreshTokenSchema), refreshAccessToken);
router.post("/email-available", validate(emailSchema), emailAvailable);
router.post(
  "/email-token-confirm",
  validate(emailTokenSchema),
  confirmEmailToken
);
router.post("/forgot-password", validate(emailSchema), forgotPassword);
router.post(
  "/validate-reset-token",
  validate(resetTokenSchema),
  validateResetToken
);
router.post(
  "/password-token-confirm",
  validate(passwordTokenSchema),
  confirmPasswordToken
);
router.post("/require-token", validate(emailSchema), requireConfirmationToken);

const authRouter = router;
export default authRouter;
