import express from "express";
import { 
  bookAppointment, 
  getAssistantAppointments, 
  getAllAppointments, 
  updateAppointmentStatus, 
  getAppointmentById,
  getCustomerAppointments,
  getCurrentAssistantAppointments,
  assignAssistant
} from "../controllers/appointmentControlller.js";
import {protect, authorizeRoles} from "../middleware/authMiddleware.js";

const router = express.Router();

// Book a new appointment
router.post("/book", protect, bookAppointment);

// Get appointments for current logged-in assistant (must come before /assistant/:assistantId)
router.get("/assistant/me", protect, getCurrentAssistantAppointments);

// Get appointments for a specific assistant
router.get("/assistant/:assistantId", protect, getAssistantAppointments);

// Get all appointments (for admin)
router.get("/all", protect, getAllAppointments);

// Get appointments for current customer
router.get("/customer", protect, getCustomerAppointments);

// Get appointment by ID
router.get("/:appointmentId", protect, getAppointmentById);

// Update appointment status
router.put("/:appointmentId/status", protect, updateAppointmentStatus);

// Admin: assign assistant to an appointment
router.put("/:appointmentId/assign", protect, authorizeRoles('admin'), assignAssistant);

export default router;
