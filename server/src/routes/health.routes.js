import { Router } from "express";
import { healthController, supabaseHealthController } from "../controllers/health.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

const router = Router();

router.get("/", healthController);
router.get("/supabase", asyncHandler(supabaseHealthController));

export default router;
