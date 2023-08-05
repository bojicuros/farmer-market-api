import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";

const router = express.Router();

router.get("/get-all", getAllUsers);
router.get("/get", getUserById);
router.post("/create", createUser);
router.put("/update", updateUser);
router.delete("/delete", deleteUser);

const userRouter = router;
export default userRouter;
