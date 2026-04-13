import { Router } from "express";
import { getServiceController } from "../controllers/discovery.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

const router = Router();

router.get("/:slug", asyncHandler(getServiceController));

export default router;
