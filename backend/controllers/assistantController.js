import User from '../models/User.js';
import Assistant from '../models/Assistant.js';

export const getAllAssistants = async (req, res) => {
  try {
    const users = await User.find({ role: 'assistant' }).select('-password');
    const userIds = users.map(u => u._id);
    const profiles = await Assistant.find({ userId: { $in: userIds } });

    const merged = users.map(u => {
      const profile = profiles.find(p => String(p.userId) === String(u._id));
      return {
        _id: u._id,
        name: u.name,
        email: u.email,
        MobileNumber: u.MobileNumber,
        profilePhoto: u.profilePhoto,
        rating: profile?.rating || 0,
        reviewCount: profile?.reviewCount || 0,
      };
    });

    res.status(200).json(merged);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch assistants" });
  }
};
