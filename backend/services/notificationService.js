import Notification from '../models/Notification.js';
import { emailService } from './emailService.js';

export const notificationService = {
  // Create notification for appointment assignment
  createAppointmentAssignmentNotifications: async (appointment, assistant, customer) => {
    try {
      const notifications = [];

      // Create notification for assistant
      const assistantNotification = new Notification({
        recipient: assistant._id,
        recipientRole: 'assistant',
        type: 'appointment_assigned',
        title: 'New Appointment Assignment',
        message: `You have been assigned to a ${appointment.service} appointment with ${customer.name} on ${appointment.date} at ${appointment.time}.`,
        appointmentId: appointment._id,
        link: `/assistant/appointments/${appointment._id}`,
        priority: 'high'
      });

      // Create notification for customer
      const customerNotification = new Notification({
        recipient: customer._id,
        recipientRole: 'customer',
        type: 'appointment_assigned',
        title: 'Assistant Assigned to Your Appointment',
        message: `${assistant.name} has been assigned to your ${appointment.service} appointment on ${appointment.date} at ${appointment.time}.`,
        appointmentId: appointment._id,
        link: `/customer/appointments/${appointment._id}`,
        priority: 'high'
      });

      // Save notifications to database
      const savedNotifications = await Promise.all([
        assistantNotification.save(),
        customerNotification.save()
      ]);

      notifications.push(...savedNotifications);

      // Send email notifications
      const appointmentDetails = {
        service: appointment.service,
        customerName: customer.name,
        date: appointment.date,
        time: appointment.time,
        hours: appointment.hours
      };

      // Send emails (don't wait for them to complete to avoid blocking)
      Promise.all([
        emailService.sendAssignmentNotificationToAssistant(
          assistant.email,
          assistant.name,
          appointmentDetails
        ),
        emailService.sendAssignmentNotificationToCustomer(
          customer.email,
          customer.name,
          appointmentDetails,
          assistant.name
        )
      ]).catch(error => {
        console.error('Error sending email notifications:', error);
      });

      console.log(`✅ Created ${notifications.length} notifications for appointment assignment`);
      return notifications;
    } catch (error) {
      console.error('❌ Error creating appointment assignment notifications:', error);
      throw error;
    }
  },

  // Get notifications for a specific user
  getUserNotifications: async (userId, limit = 20) => {
    try {
      const notifications = await Notification.find({ recipient: userId })
        .populate('appointmentId')
        .sort({ createdAt: -1 })
        .limit(limit);
      
      return notifications;
    } catch (error) {
      console.error('❌ Error fetching user notifications:', error);
      throw error;
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const notification = await Notification.findByIdAndUpdate(
        notificationId,
        { read: true },
        { new: true }
      );
      return notification;
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read for a user
  markAllAsRead: async (userId) => {
    try {
      const result = await Notification.updateMany(
        { recipient: userId, read: false },
        { read: true }
      );
      return result;
    } catch (error) {
      console.error('❌ Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Get unread notification count for a user
  getUnreadCount: async (userId) => {
    try {
      const count = await Notification.countDocuments({
        recipient: userId,
        read: false
      });
      return count;
    } catch (error) {
      console.error('❌ Error getting unread notification count:', error);
      throw error;
    }
  }
};

export default notificationService;
