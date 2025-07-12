import express from 'express';
import { submitReview, getReviews, getAverageRating } from '../controllers/review.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';

const router = express.Router();
router.post('/', authenticateJWT, submitReview);
router.get('/', getReviews);
router.get('/average', getAverageRating);

export default router;