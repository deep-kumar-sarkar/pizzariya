import express from 'express';
import { getOutletsByCity } from '../controllers/outlet.controller.js';

const router = express.Router();

router.get('/', getOutletsByCity);

export default router;
