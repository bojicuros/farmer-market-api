import express from "express";
import { getDashboardInfo } from "../controllers/dashboard.controller";

const router = express.Router();

router.get("/", getDashboardInfo);

const dashboardRouter = router;
export default dashboardRouter;
