import express from "express";
import { getAllCustomers, getCustomerById } from "../controllers/customerController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all customers (admin only)
router.get("/", protect, authorizeRoles('admin'), getAllCustomers);

// Get customer by ID (admin only)
router.get("/:id", protect, authorizeRoles('admin'), getCustomerById);

export default router;
