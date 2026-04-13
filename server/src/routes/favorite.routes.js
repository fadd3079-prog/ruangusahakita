import { Router } from "express";
import {
  addFavoriteController,
  listFavoritesController,
  removeFavoriteController,
} from "../controllers/favorite.controller.js";
import { requireAuth } from "../middlewares/auth.js";
import { asyncHandler } from "../utils/async-handler.js";

const router = Router();

router.use(requireAuth);
router.get("/", asyncHandler(listFavoritesController));
router.post("/:creatorId", asyncHandler(addFavoriteController));
router.delete("/:creatorId", asyncHandler(removeFavoriteController));

export default router;
