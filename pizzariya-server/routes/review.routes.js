import express from "express";
import {
  submitReview,
  getReviews,
  getAverageRating,
} from "../controllers/review.controller.js";
import { authenticateJWT } from "../middleware/auth.middleware.js";

const router = express.Router();
router.post("/", authenticateJWT, submitReview);
// Get all reviews for a menu item
router.get("/:menu_item_id", getReviews);
// Get average rating for a menu item
router.get("/average/:menu_item_id", getAverageRating);

export default router;
