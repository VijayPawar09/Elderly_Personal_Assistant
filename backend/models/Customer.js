import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  emergencyContact: {
    type: String,
    required: true
  },
  medicalConditions: {
    type: String
  },
  assistanceNeeded: {
    type: [String],
    required: true
  },
  preferredSchedule: {
    type: String
  },
  healthNotes: {
    type: String
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  primaryCareDoctor: {
    name: String,
    phoneNumber: String
  },
  insuranceInfo: {
    provider: String,
    policyNumber: String
  }
});

export default mongoose.model('Customer', CustomerSchema);