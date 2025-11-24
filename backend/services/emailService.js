import nodemailer from 'nodemailer';

// Create transporter (you'll need to configure with your email service)
const createTransporter = () => {
  // For development, you can use a service like Gmail, Outlook, or a service like SendGrid
  // For production, use environment variables for credentials
  return nodemailer.createTransporter({
    service: 'gmail', // or your preferred email service
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });
};

export const emailService = {
  // Send appointment assignment notification to assistant
  sendAssignmentNotificationToAssistant: async (assistantEmail, assistantName, appointmentDetails) => {
    try {
      const transporter = createTransporter();
      
      const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@elderlycare.com',
        to: assistantEmail,
        subject: 'New Appointment Assignment - Elderly Personal Assistance',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">New Appointment Assignment</h2>
            <p>Dear ${assistantName},</p>
            <p>You have been assigned a new appointment:</p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #374151;">Appointment Details</h3>
              <p><strong>Service:</strong> ${appointmentDetails.service}</p>
              <p><strong>Customer:</strong> ${appointmentDetails.customerName}</p>
              <p><strong>Date:</strong> ${appointmentDetails.date}</p>
              <p><strong>Time:</strong> ${appointmentDetails.time}</p>
              <p><strong>Duration:</strong> ${appointmentDetails.hours} hours</p>
            </div>
            
            <p>Please log in to your dashboard to view more details and confirm your availability.</p>
            <p>Thank you for your service!</p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
              Elderly Personal Assistance<br>
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        `
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Assignment email sent to assistant:', result.messageId);
      return result;
    } catch (error) {
      console.error('❌ Error sending assignment email to assistant:', error);
      throw error;
    }
  },

  // Send appointment assignment notification to customer
  sendAssignmentNotificationToCustomer: async (customerEmail, customerName, appointmentDetails, assistantName) => {
    try {
      const transporter = createTransporter();
      
      const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@elderlycare.com',
        to: customerEmail,
        subject: 'Assistant Assigned to Your Appointment - Elderly Personal Assistance',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Assistant Assigned to Your Appointment</h2>
            <p>Dear ${customerName},</p>
            <p>Great news! We have assigned an assistant to your upcoming appointment.</p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #374151;">Appointment Details</h3>
              <p><strong>Service:</strong> ${appointmentDetails.service}</p>
              <p><strong>Assigned Assistant:</strong> ${assistantName}</p>
              <p><strong>Date:</strong> ${appointmentDetails.date}</p>
              <p><strong>Time:</strong> ${appointmentDetails.time}</p>
              <p><strong>Duration:</strong> ${appointmentDetails.hours} hours</p>
            </div>
            
            <p>Your assistant will contact you shortly to confirm the appointment details.</p>
            <p>If you have any questions, please don't hesitate to contact us.</p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
              Elderly Personal Assistance<br>
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        `
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Assignment email sent to customer:', result.messageId);
      return result;
    } catch (error) {
      console.error('❌ Error sending assignment email to customer:', error);
      throw error;
    }
  }
};

export default emailService;
