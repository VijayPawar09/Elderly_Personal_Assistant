import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assistant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceType: String,
  date: Date,
  status: { type: String, default: 'pending' }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
