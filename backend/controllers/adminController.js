import Assistant from "../models/Assistant.js";
import User from "../models/User.js";

export const getPendingAssistants =

  async (req, res) => {
    try {
      // Find all assistants that are not verified
      const pendingAssistants = await Assistant.find({ isVerified: false });

      // Get user details for each pending assistant
      const assistantsWithDetails = await Promise.all(
        pendingAssistants.map(async (assistant) => {
          const user = await User.findById(assistant.userId).select(
            "-password"
          );
          return {
            ...assistant.toObject(),
            user: user.toObject(),
          };
        })
      );

      res.json(assistantsWithDetails);
    } catch (err) {
      console.error("Error fetching pending assistants:", err.message);
      res.status(500).send("Server error");
    }
  };



export const verifyAssistant=  async (req, res) => {
    try {
      const assistant = await Assistant.findById(req.params.id);
      
      if (!assistant) {
        return res.status(404).json({ message: 'Assistant not found' });
      }
      
      assistant.isVerified = true;
      assistant.backgroundCheckDate = new Date();
      await assistant.save();
      
      // Send email notification to assistant (would implement with email service)
      
      res.json({ message: 'Assistant verified successfully', assistant });
    } catch (err) {
      console.error('Error verifying assistant:', err.message);
      res.status(500).send('Server error');
    }
  };
