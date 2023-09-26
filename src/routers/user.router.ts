import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllUnapprovedUsers,
} from "../controllers/user.controller";
import { validate } from "../middleware/validation.middleware";
import {
  userCreateSchema,
  userUpdateSchema,
  userIdSchema,
} from "../validation/user.schema";

const router = express.Router();

router.get("/get-all", getAllUsers);
router.get("/get-by-id", validate(userIdSchema), getUserById);
router.get("/get-all-unapproved", getAllUnapprovedUsers);
router.post("/create", validate(userCreateSchema), createUser);
router.put("/update", validate(userUpdateSchema), updateUser);
router.delete("/delete", validate(userIdSchema), deleteUser);

const userRouter = router;
export default userRouter;
