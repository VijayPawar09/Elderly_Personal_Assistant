import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "./models/User.js";
import Appointment from "./models/Appointment.js";

const showData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/Elderly_Personal_Assistance");
    console.log("✅ Connected to MongoDB");
    
    console.log("\n👥 Recent Users:");
    console.log("================");
    const users = await User.find().limit(3).select('name email role createdAt');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
    });
    
    console.log("\n📅 Recent Appointments:");
    console.log("=======================");
    const appointments = await Appointment.find().limit(3).select('service hours charges status dateBooked');
    appointments.forEach((apt, index) => {
      console.log(`${index + 1}. ${apt.service} - ${apt.hours}h - ₹${apt.charges} - ${apt.status}`);
    });
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.connection.close();
  }
};

showData();
