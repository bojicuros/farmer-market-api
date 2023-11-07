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
} from "../controllers/user.controller";
import { validate } from "../middleware/validation.middleware";
import {
  userCreateSchema,
  userUpdateSchema,
  userIdSchema,
  userInfoUpdateSchema,
} from "../validation/user.schema";

const router = express.Router();

router.get("/get-all-approved", getAllUsers);
router.get("/get-by-id", validate(userIdSchema), getUserById);
router.get("/get-all-unapproved", getAllUnapprovedUsers);
router.post("/create", validate(userCreateSchema), createUser);
router.put("/update", validate(userUpdateSchema), updateUser);
router.post(
  "/update-user-info",
  validate(userInfoUpdateSchema),
  updateUserInformation
);
router.delete("/delete", validate(userIdSchema), deleteUser);
router.put("/approve", validate(userIdSchema), approveUser);
router.put("/reject", validate(userIdSchema), rejectUser);
router.put("/toggle-active-status", validate(userIdSchema), toggleActiveStatus);

const userRouter = router;
export default userRouter;
