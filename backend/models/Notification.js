import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // recipient user
  recipientRole: { type: String, enum: ['customer', 'assistant', 'admin'], required: true },
  type: { 
    type: String, 
    enum: ['appointment_assigned', 'appointment_confirmed', 'appointment_cancelled', 'general'], 
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }, // optional: related appointment
  link: String, // optional: to direct to specific page
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
