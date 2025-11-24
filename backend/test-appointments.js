import mongoose from "mongoose";
import dotenv from "dotenv";
import Appointment from "./models/Appointment.js";
import User from "./models/User.js";

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

async function testAppointments() {
  try {
    console.log("=== Testing Appointments ===");

    // Check if there are any users
    const users = await User.find();
    console.log("Total users:", users.length);
    users.forEach((user) => {
      console.log(`- ${user.name} (${user.role}) - ID: ${user._id}`);
    });

    // Check if there are any appointments
    const appointments = await Appointment.find();
    console.log("Total appointments:", appointments.length);
    appointments.forEach((apt) => {
      console.log(
        `- ${apt.service} for ${apt.assistant} - Status: ${apt.status}`
      );
    });

    // Create a test appointment if we have users
    if (users.length >= 2) {
      const assistant = users.find((u) => u.role === "assistant");
      const customer = users.find((u) => u.role === "customer");

      if (assistant && customer) {
        console.log("\n=== Creating Test Appointment ===");

        const testAppointment = new Appointment({
          assistant: assistant.name,
          assistantId: assistant._id,
          hours: 2,
          time: "10:00",
          service: "Test Service",
          charges: 200,
          details: "Test Address",
          customer: customer._id,
          status: "pending",
        });

        await testAppointment.save();
        console.log("Test appointment created successfully!");

        // Verify the appointment was created
        const newAppointments = await Appointment.find().populate(
          "customer",
          "name email MobileNumber"
        );
        console.log("Updated appointments:", newAppointments.length);
      }
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
  }
}

testAppointments();
