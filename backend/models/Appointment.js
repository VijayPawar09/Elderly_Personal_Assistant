import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  assistant: {
    type: String,
    required: false,
    default: "Not Assigned",
  },
  assistantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  hours: {
    type: Number,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  service: {
    type: String,
    required: true,
  },
  charges: {
    type: Number,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  dateBooked: {
    type: Date,
    default: Date.now,
  },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
