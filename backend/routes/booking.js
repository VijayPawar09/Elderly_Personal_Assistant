import express from 'express';
import { bookService } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/book', protect, bookService);

export default router;
