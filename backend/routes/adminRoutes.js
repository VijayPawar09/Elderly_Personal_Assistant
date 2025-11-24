import express from "express";
import {
  getPendingAssistants,
  verifyAssistant,
} from "../controllers/adminController.js";

const router = express.Router();
router.get("/pending-assistants", getPendingAssistants);
router.put("/verify-assistant/:id", verifyAssistant);
export default router;
