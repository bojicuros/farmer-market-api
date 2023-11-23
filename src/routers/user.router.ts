import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllUnapprovedUsers,
  approveUser,
  toggleActiveStatus,
  rejectUser,
  updateUserInformation,
  addUserMarkets,
} from "../controllers/user.controller";
import { validate } from "../middleware/validation.middleware";
import {
  userCreateSchema,
  userUpdateSchema,
  userIdSchema,
  userInfoUpdateSchema,
  marketsIdSchema,
} from "../validation/user.schema";
import { authorize } from "../middleware/authorization.middleware";
import { UserRole } from "../utils/enums";

const router = express.Router();

router.get("/get-all-approved", authorize([UserRole.Admin]), getAllUsers);
router.get(
  "/get-by-id",
  authorize([UserRole.Admin, UserRole.Vendor]),
  validate(userIdSchema),
  getUserById
);
router.get(
  "/get-all-unapproved",
  authorize([UserRole.Admin]),
  getAllUnapprovedUsers
);
router.post(
  "/create",
  authorize([UserRole.Admin]),
  validate(userCreateSchema),
  createUser
);
router.put(
  "/update",
  authorize([UserRole.Admin, UserRole.Vendor]),
  validate(userUpdateSchema),
  updateUser
);
router.post(
  "/update-user-info",
  authorize([UserRole.Admin]),
  validate(userInfoUpdateSchema),
  updateUserInformation
);
router.post(
  "/add-markets-to-user",
  authorize([UserRole.Admin]),
  validate(marketsIdSchema),
  addUserMarkets
);
router.delete(
  "/delete",
  authorize([UserRole.Admin]),
  validate(userIdSchema),
  deleteUser
);
router.put(
  "/approve",
  authorize([UserRole.Admin]),
  validate(userIdSchema),
  approveUser
);
router.put(
  "/reject",
  authorize([UserRole.Admin]),
  validate(userIdSchema),
  rejectUser
);
router.put(
  "/toggle-active-status",
  authorize([UserRole.Admin]),
  validate(userIdSchema),
  toggleActiveStatus
);

const userRouter = router;
export default userRouter;
