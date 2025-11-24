import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "./models/User.js";
import Customer from "./models/Customer.js";
import Assistant from "./models/Assistant.js";
import Appointment from "./models/Appointment.js";

const debugDatabase = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/elderly_care";
    console.log("🔗 Connecting to:", mongoUri);
    
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");
    
    // Get database name
    const dbName = mongoose.connection.db.databaseName;
    console.log("📊 Database Name:", dbName);
    
    // Check collections and count documents
    console.log("\n📋 Collection Statistics:");
    console.log("========================");
    
    const userCount = await User.countDocuments();
    console.log(`👥 Users: ${userCount} documents`);
    
    const customerCount = await Customer.countDocuments();
    console.log(`🧓 Customers: ${customerCount} documents`);
    
    const assistantCount = await Assistant.countDocuments();
    console.log(`👨‍⚕️ Assistants: ${assistantCount} documents`);
    
    const appointmentCount = await Appointment.countDocuments();
    console.log(`📅 Appointments: ${appointmentCount} documents`);
    
    // Show sample data
    console.log("\n📝 Sample Data:");
    console.log("===============");
    
    if (userCount > 0) {
      const sampleUser = await User.findOne().select('name email role');
      console.log("Sample User:", sampleUser);
    }
    
    if (appointmentCount > 0) {
      const sampleAppointment = await Appointment.findOne().select('service hours charges status');
      console.log("Sample Appointment:", sampleAppointment);
    }
    
    // List all collections in the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("\n🗂️ All Collections in Database:");
    console.log("==============================");
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
  }
};

debugDatabase();
