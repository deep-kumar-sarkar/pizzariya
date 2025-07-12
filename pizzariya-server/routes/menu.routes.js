import express from 'express';
import { getMenuByOutlet } from '../controllers/menu.controller.js';

const router = express.Router();

router.get('/', getMenuByOutlet);

export default router;
