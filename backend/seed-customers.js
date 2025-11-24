import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

// Load environment variables
dotenv.config();

const sampleCustomers = [
  {
    name: "John Smith",
    email: "john.smith@email.com",
    password: "customer123",
    MobileNumber: "555-0101",
    role: "customer",
    age: 72
  },
  {
    name: "Mary Johnson", 
    email: "mary.johnson@email.com",
    password: "customer123",
    MobileNumber: "555-0102",
    role: "customer",
    age: 68
  },
  {
    name: "Robert Davis",
    email: "robert.davis@email.com",
    password: "customer123", 
    MobileNumber: "555-0103",
    role: "customer",
    age: 75
  },
  {
    name: "Elizabeth Brown",
    email: "elizabeth.brown@email.com",
    password: "customer123",
    MobileNumber: "555-0104", 
    role: "customer",
    age: 69
  },
  {
    name: "William Wilson",
    email: "william.wilson@email.com",
    password: "customer123",
    MobileNumber: "555-0105",
    role: "customer", 
    age: 78
  }
];

const seedCustomers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/elderly_care");
    console.log("✅ Connected to MongoDB");

    // Clear existing customers (optional)
    await User.deleteMany({ role: "customer" });
    console.log("🗑️  Cleared existing customers");

    // Insert sample customers
    const customers = await User.insertMany(sampleCustomers);
    console.log(`🎉 Created ${customers.length} sample customers:`);
    
    customers.forEach(customer => {
      console.log(`   - ${customer.name} (${customer.email})`);
    });

  } catch (error) {
    console.error("❌ Error seeding customers:", error.message);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
};

// Run the script
seedCustomers();
