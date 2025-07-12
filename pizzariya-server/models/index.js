import db from '../config/db.config.js';
import UserModel from './user.model.js';
import ReviewModel from './review.model.js';

export const User = UserModel(db);
export const Review = ReviewModel(db);


