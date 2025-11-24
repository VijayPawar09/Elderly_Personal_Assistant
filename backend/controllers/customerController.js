import User from "../models/User.js";

// Get all customers (admin only)
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" })
      .select("-password") // Exclude password field
      .sort({ createdAt: -1 }); // Sort by newest first
    
    res.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get customer by ID (admin only)
export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const customer = await User.findOne({ _id: id, role: "customer" })
      .select("-password"); // Exclude password field
    
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    
    res.json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
