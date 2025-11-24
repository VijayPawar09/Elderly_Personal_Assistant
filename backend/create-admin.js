import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

// Load environment variables
dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/elderly_care");
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("⚠️  Admin user already exists:");
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Name: ${existingAdmin.name}`);
      return;
    }

    // Admin user details
    const adminData = {
      name: "Admin User",
      email: "admin@elderlycare.com",
      password: "admin123", // This will be hashed automatically by the User model
      MobileNumber: "1234567890",
      role: "admin",
      age: 35 // Admin can be any age
    };

    // Create admin user
    const adminUser = new User(adminData);
    await adminUser.save();

    console.log("🎉 Admin user created successfully!");
    console.log("📧 Email: admin@elderlycare.com");
    console.log("🔑 Password: admin123");
    console.log("⚠️  Please change the password after first login");

  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
};

// Run the script
createAdminUser();
