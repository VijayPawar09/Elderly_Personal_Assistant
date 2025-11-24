import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { notificationService } from "../services/notificationService.js";

export const bookAppointment = async (req, res) => {
  try {
    const { hours, time, service, charges, details } = req.body;
    const customerId = req.user._id; // from auth middleware

    console.log("Booking appointment for customer:", customerId);
    console.log("Customer ID type:", typeof customerId);
    console.log("Appointment data:", { hours, time, service, charges, details });

    // Ensure customerId is properly converted to ObjectId if it's a string
    const customerObjectId = typeof customerId === 'string' ? 
      new mongoose.Types.ObjectId(customerId) : customerId;

    const newAppointment = new Appointment({
      hours,
      time,
      service,
      charges,
      details,
      customer: customerObjectId,
    });

    await newAppointment.save();
    console.log("Appointment saved successfully:", newAppointment);

    // Notify customer that booking was created
    try {
      await Notification.create({
        recipient: customerId,
        recipientRole: 'customer',
        type: 'general',
        title: 'Appointment Booked',
        message: `Your appointment for ${service} has been created. We will assign an assistant shortly.`,
        appointmentId: newAppointment._id,
        link: `/appointments/${newAppointment._id}`,
      });
    } catch (err) {
      // Non-blocking notification failure
      console.error("Failed to create booking notification:", err);
    }
    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ message: "Failed to book appointment" });
  }
};

// Admin: assign assistant to an appointment
export const assignAssistant = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { assistantId } = req.body;

    const assistantUser = await User.findById(assistantId);
    if (!assistantUser || assistantUser.role !== "assistant") {
      return res.status(400).json({ message: "Invalid assistant" });
    }

    const updated = await Appointment.findByIdAndUpdate(
      appointmentId,
      { assistant: assistantUser.name, assistantId: assistantUser._id, status: 'confirmed' },
      { new: true }
    ).populate("customer", "name email MobileNumber");

    if (!updated) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Create notifications for both assistant and customer
    try {
      await notificationService.createAppointmentAssignmentNotifications(
        updated,
        assistantUser,
        updated.customer
      );
    } catch (err) {
      console.error("Failed to create assignment notifications:", err);
    }

    res.status(200).json({ message: "Assistant assigned successfully", appointment: updated });
  } catch (error) {
    console.error("Error assigning assistant:", error);
    res.status(500).json({ message: "Failed to assign assistant" });
  }
};

// Get appointments for a specific assistant
export const getAssistantAppointments = async (req, res) => {
  try {
    const { assistantId } = req.params;
    const appointments = await Appointment.find({ assistantId: assistantId })
      .populate("customer", "name email MobileNumber")
      .sort({ dateBooked: -1 });

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching assistant appointments:", error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

// Get all appointments (for admin/overview)
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("customer", "name email MobileNumber")
      .sort({ dateBooked: -1 });

    console.log("All appointments in database:", appointments);
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching all appointments:", error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    ).populate("customer", "name email MobileNumber");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res
      .status(200)
      .json({ message: "Appointment status updated", appointment });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ message: "Failed to update appointment status" });
  }
};

// Get appointment by ID
export const getAppointmentById = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await Appointment.findById(appointmentId).populate(
      "customer",
      "name email MobileNumber"
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({ message: "Failed to fetch appointment" });
  }
};

// Get appointments for current customer
export const getCustomerAppointments = async (req, res) => {
  try {
    const customerId = req.user._id; // from auth middleware
    
    // Check if user is admin trying to access customer appointments
    if (req.user.role === 'admin') {
      return res.status(403).json({ 
        message: "Admin users cannot access customer appointments directly. Use /appointments/all instead." 
      });
    }
    
    // Validate that the user is a customer
    if (req.user.role !== 'customer') {
      return res.status(403).json({ 
        message: "Only customers can access their appointments" 
      });
    }

    console.log("Fetching appointments for customer:", customerId);
    console.log("Customer ID type:", typeof customerId);

    // Ensure customerId is properly converted to ObjectId for the query
    const customerObjectId = typeof customerId === 'string' ? 
      new mongoose.Types.ObjectId(customerId) : customerId;

    // First, try to get real appointments from the database
    const appointments = await Appointment.find({ customer: customerObjectId }).sort({
      dateBooked: -1,
    });

    console.log("Found appointments in database:", appointments);

    // If no real appointments found, check if we should return mock data
    if (appointments.length === 0) {
      // Only return mock data for the specific mock customer ID
      if (customerId === "507f1f77bcf86cd799439012") {
        console.log("No real appointments found for mock customer, returning mock data");
        const mockAppointments = [
          {
            _id: "507f1f77bcf86cd799439021",
            assistant: "Dr. Sarah Johnson",
            assistantId: "507f1f77bcf86cd799439013",
            service: "Medications",
            hours: 2,
            time: "09:00",
            charges: 200,
            details: "123 Oak Street, Apt 4B, New York, NY 10001",
            status: "confirmed",
            dateBooked: new Date("2024-01-15T10:30:00Z"),
            customer: customerId
          },
          {
            _id: "507f1f77bcf86cd799439022",
            assistant: "Nurse Robert Wilson",
            assistantId: "507f1f77bcf86cd799439014",
            service: "Doctor Appointment",
            hours: 3,
            time: "14:00",
            charges: 300,
            details: "456 Pine Avenue, Suite 12, Brooklyn, NY 11201",
            status: "completed",
            dateBooked: new Date("2024-01-14T15:45:00Z"),
            customer: customerId
          },
          {
            _id: "507f1f77bcf86cd799439023",
            assistant: "Care Assistant Margaret",
            assistantId: "507f1f77bcf86cd799439015",
            service: "Health Checkup",
            hours: 1,
            time: "11:30",
            charges: 100,
            details: "789 Elm Road, Floor 3, Queens, NY 11375",
            status: "pending",
            dateBooked: new Date("2024-01-16T09:15:00Z"),
            customer: customerId
          },
        ];
        return res.status(200).json(mockAppointments);
      } else {
        // For real customers with no appointments, return empty array
        console.log("No appointments found for real customer:", customerId);
      }
    }

    // Return the real appointments (could be empty array if none found)

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching customer appointments:", error);
    
    // Handle ObjectId casting errors specifically
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({ 
        message: "Invalid customer ID format" 
      });
    }
    
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

// Get appointments for current logged-in assistant
export const getCurrentAssistantAppointments = async (req, res) => {
  try {
    const assistantId = req.user._id; // from auth middleware
    console.log("Fetching appointments for assistant:", assistantId);
    console.log("Assistant user:", req.user);

    const appointments = await Appointment.find({ assistantId: assistantId })
      .populate("customer", "name email MobileNumber")
      .sort({ dateBooked: -1 });

    console.log("Found appointments:", appointments);
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching current assistant appointments:", error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};
