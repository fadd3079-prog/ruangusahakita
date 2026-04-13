import { Router } from "express";
import authRoutes from "./auth.routes.js";
import creatorRoutes from "./creator.routes.js";
import favoriteRoutes from "./favorite.routes.js";
import healthRoutes from "./health.routes.js";
import profileRoutes from "./profile.routes.js";
import requestRoutes from "./request.routes.js";
import serviceRoutes from "./service.routes.js";
import { healthController } from "../controllers/health.controller.js";

const router = Router();

router.get("/", healthController);
router.use("/api/health", healthRoutes);
router.use("/api/auth", authRoutes);
router.use("/api/profile", profileRoutes);
router.use("/api/creators", creatorRoutes);
router.use("/api/services", serviceRoutes);
router.use("/api/favorites", favoriteRoutes);
router.use("/api/requests", requestRoutes);

export default router;
