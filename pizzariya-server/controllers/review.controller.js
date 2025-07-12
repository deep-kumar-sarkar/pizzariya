import { Review } from '../models/index.js';
import db from '../config/db.config.js';

export const submitReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { menu_item_id, outlet_id, rating, comment } = req.body;

    // Verify user has ordered this item from this outlet
    const [orders] = await db.execute(
      `SELECT 1 FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       WHERE o.user_id = ? AND oi.menu_item_id = ?`,
      [userId, menu_item_id]
    );
    if (!orders.length) return res.status(403).json({ message: 'Not eligible to review' });

    const reviewId = await Review.create(userId, menu_item_id, outlet_id, rating, comment);
    res.status(201).json({ reviewId });
  } catch (err) {
    res.status(500).json({ message: 'Review submission failed' });
  }
};

export const getReviews = async (req, res) => {
  try {
    const { menu_item_id, outlet_id } = req.query;
    const reviews = await Review.findByItemOutlet(menu_item_id, outlet_id);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};

export const getAverageRating = async (req, res) => {
  try {
    const { menu_item_id, outlet_id } = req.query;
    const avg = await Review.getAverage(menu_item_id, outlet_id);
    res.json(avg);
  } catch (err) {
    res.status(500).json({ message: 'Failed to compute average rating' });
  }
};