import express from "express";
import { getUserProfile, updateUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
// import registerUser from "../controllers/userController.js"
import { registerUser } from "../controllers/userController.js";


const router = express.Router();

router.get("/profile", protect, getUserProfile);
router.get("/update-profile", protect, updateUser);
router.post("/register", upload.single("photo"), registerUser);

export default router;
