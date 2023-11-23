import express from "express";
import { getDashboardInfo } from "../controllers/dashboard.controller";
import { authorize } from "../middleware/authorization.middleware";
import { UserRole } from "../utils/enums";

const router = express.Router();

router.get("/", authorize([UserRole.Admin]), getDashboardInfo);

const dashboardRouter = router;
export default dashboardRouter;
