import Notification from '../models/Notification.js';
import { notificationService } from '../services/notificationService.js';

// Get notifications for the current user
export const getUserNotifications = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const notifications = await notificationService.getUserNotifications(req.user._id, limit);
    res.json({ success: true, notifications });
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// Get all notifications (admin only)
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate('recipient', 'name email role')
      .populate('appointmentId')
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json({ success: true, notifications });
  } catch (err) {
    console.error('Error fetching all notifications:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await notificationService.markAsRead(notificationId);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json({ success: true, notification });
  } catch (err) {
    console.error('Error marking notification as read:', err);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

// Mark all notifications as read for current user
export const markAllAsRead = async (req, res) => {
  try {
    const result = await notificationService.markAllAsRead(req.user._id);
    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error('Error marking all notifications as read:', err);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
};

// Get unread notification count
export const getUnreadCount = async (req, res) => {
  try {
    const count = await notificationService.getUnreadCount(req.user._id);
    res.json({ success: true, count });
  } catch (err) {
    console.error('Error getting unread count:', err);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
};
