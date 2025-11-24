import mongoose from "mongoose";

const AssistantSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  specializations: {
    type: [String],
    required: true
  },
  availability: {
    type: [String],
    required: true
  },
  certifications: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  backgroundCheckDate: {
    type: Date
  },
  profilePicture: {
    type: String
  },
  bio: {
    type: String
  },
  hourlyRate: {
    type: Number
  }
});

export default mongoose.model('Assistant', AssistantSchema);