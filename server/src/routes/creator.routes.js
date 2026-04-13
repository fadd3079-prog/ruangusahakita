import { Router } from "express";
import {
  getCreatorController,
  listCreatorServicesController,
  listCreatorsController,
} from "../controllers/discovery.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

const router = Router();

router.get("/", asyncHandler(listCreatorsController));
router.get("/:slug", asyncHandler(getCreatorController));
router.get("/:slug/services", asyncHandler(listCreatorServicesController));

export default router;
