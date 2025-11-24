import express from 'express';
import { 
  getUserNotifications, 
  getAllNotifications, 
  markAsRead, 
  markAllAsRead, 
  getUnreadCount 
} from '../controllers/notificationController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get notifications for current user
router.get('/', protect, getUserNotifications);

// Get all notifications (admin only)
router.get('/all', protect, authorizeRoles('admin'), getAllNotifications);

// Get unread count for current user
router.get('/unread-count', protect, getUnreadCount);

// Mark specific notification as read
router.put('/:notificationId/read', protect, markAsRead);

// Mark all notifications as read for current user
router.put('/mark-all-read', protect, markAllAsRead);

export default router;
