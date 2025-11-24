import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Helper to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, MobileNumber, role, age } = req.body;
    
    console.log("Registration attempt:", { name, email, MobileNumber, role, age });
    
    // Get the uploaded file path if it exists
    const profilePhoto = req.file ? req.file.filename : null;

    // Validate required fields
    if (!name || !email || !password || !MobileNumber || !role || !age) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Age restrictions: only users with age > 50 can register
    if (!age || Number(age) <= 50) {
      return res.status(400).json({ message: "Only users above age 50 can register for this service" });
    }

    // Check if email, name, or mobile number already exists
    const existingUser = await User.findOne({ $or: [{ email }, { name }, { MobileNumber }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already exists" });
      }
      if (existingUser.name === name) {
        return res.status(400).json({ message: "Username already exists" });
      }
      if (existingUser.MobileNumber === MobileNumber) {
        return res.status(400).json({ message: "Mobile number already exists" });
      }
    }

    const user = new User({
      name,
      email,
      password,
      MobileNumber,
      role,
      age: Number(age),
      profilePhoto, // save file name
    });

    await user.save();
    console.log("User registered successfully:", user.name);
    
    // Return user without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      MobileNumber: user.MobileNumber,
      role: user.role,
      age: user.age,
      profilePhoto: user.profilePhoto
    };
    
    res.status(201).json({ message: "User registered successfully", user: userResponse });
  } catch (err) {
    console.error("Registration error:", err);
    
    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    
    // Handle duplicate key errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ message: `${field} already exists` });
    }
    
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    res.json({ user: { id: user._id, name: user.name, email, role: user.role, MobileNumber: user.MobileNumber}, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
