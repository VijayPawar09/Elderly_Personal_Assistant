import express from "express";
import { login, registerUser } from "../controllers/authController.js";
import upload from "../middleware/upload.js";
const router = express.Router();

router.post("/login", login);
router.post("/register", upload.single("photo"), registerUser);

export default router;
