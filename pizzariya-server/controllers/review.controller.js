import { Review } from "../models/index.js";
import db from "../config/db.config.js";

export const submitReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { menu_item_id, rating, comment } = req.body;
    console.log("[submitReview] userId:", userId);
    console.log(
      "[submitReview] menu_item_id:",
      menu_item_id,
      "rating:",
      rating,
      "comment:",
      comment
    );

    // Verify user has ordered this item
    const [orders] = await db.execute(
      `SELECT 1 FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       WHERE o.user_id = ? AND oi.menu_item_id = ?`,
      [userId, menu_item_id]
    );
    console.log("[submitReview] order check result:", orders);
    if (!orders.length) {
      console.log("[submitReview] Not eligible to review");
      return res.status(403).json({ message: "Not eligible to review" });
    }

    const reviewId = await Review.create(
      userId,
      menu_item_id,
      1, // Hardcoded outlet_id for item-based reviews
      rating,
      comment ?? null
    );
    console.log("[submitReview] Review inserted with id:", reviewId);
    res.status(201).json({ reviewId });
  } catch (err) {
    console.error("[submitReview] Review submission error:", err);
    res.status(500).json({ message: "Review submission failed" });
  }
};

export const getReviews = async (req, res) => {
  try {
    const menu_item_id = req.params.menu_item_id;
    const reviews = await Review.findByItem(menu_item_id);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

export const getAverageRating = async (req, res) => {
  try {
    const menu_item_id = req.params.menu_item_id;
    const avg = await Review.getAverage(menu_item_id);
    res.json(avg);
  } catch (err) {
    res.status(500).json({ message: "Failed to compute average rating" });
  }
};
