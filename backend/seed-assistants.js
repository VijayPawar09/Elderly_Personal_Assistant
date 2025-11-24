import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "./models/User.js";

const seedAssistants = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/Elderly_Personal_Assistance");
    console.log("✅ Connected to MongoDB");

    // Clear existing assistants (optional)
    await User.deleteMany({ role: "assistant" });
    console.log("🗑️ Cleared existing assistants");

    // Assistant data from the image
    const assistantsData = [
      {
        name: "Aarav Sharma",
        email: "aarav.sharma@example.com",
        phone: "+91 98765 43210",
        age: 29,
        rating: 4.6,
        experience: "5 years",
        specialization: "Elder Care & Medical Assistance",
        availability: "Full-time",
        location: "Mumbai, Maharashtra"
      },
      {
        name: "Priya Verma",
        email: "priya.verma@example.com",
        phone: "+91 99887 66534",
        age: 32,
        rating: 4.8,
        experience: "7 years",
        specialization: "Personal Care & Companionship",
        availability: "Full-time",
        location: "Delhi, NCR"
      },
      {
        name: "Rahul Mehta",
        email: "rahul.mehta@example.com",
        phone: "+91 91234 56789",
        age: 35,
        rating: 4.3,
        experience: "8 years",
        specialization: "Medical Care & Physiotherapy",
        availability: "Part-time",
        location: "Bangalore, Karnataka"
      },
      {
        name: "Sanya Kapoor",
        email: "sanya.kapoor@example.com",
        phone: "+91 98111 22334",
        age: 28,
        rating: 4.7,
        experience: "4 years",
        specialization: "Companion Care & Daily Activities",
        availability: "Full-time",
        location: "Pune, Maharashtra"
      },
      {
        name: "Vikram Rao",
        email: "vikram.rao@example.com",
        phone: "+91 99000 11122",
        age: 41,
        rating: 4.4,
        experience: "12 years",
        specialization: "Senior Care & Emergency Response",
        availability: "Full-time",
        location: "Chennai, Tamil Nadu"
      }
    ];

    // Create assistants (as Users with role "assistant")
    for (const assistantData of assistantsData) {
      // Create user account for assistant
      const user = new User({
        name: assistantData.name,
        email: assistantData.email,
        MobileNumber: assistantData.phone,
        password: "assistant123", // Will be hashed by the pre-save hook
        role: "assistant",
        age: assistantData.age
      });
      
      await user.save();
      console.log(`👨‍⚕️ Created assistant: ${assistantData.name} (${assistantData.email})`);
    }

    console.log("\n🎉 Successfully seeded assistants!");
    console.log("📊 Summary:");
    console.log(`   - Created ${assistantsData.length} assistant users`);
    console.log("\n🔑 Default login credentials:");
    console.log("   Password for all assistants: assistant123");
    console.log("\n📧 Assistant emails:");
    assistantsData.forEach((assistant, index) => {
      console.log(`   ${index + 1}. ${assistant.email}`);
    });

  } catch (error) {
    console.error("❌ Error seeding assistants:", error.message);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
  }
};

// Run the seeding function
seedAssistants();
