import React, { useState } from "react";
import { authAPI } from "../../API/auth.js";

const RegisterModal = ({ isOpen, onClose, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    MobileNumber: "",
    password: "",
    role: "customer", // fixed to customer; assistant self-registration disabled
    age: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isCustomer = true; // only customer registration is allowed
  const isAssistant = false; // assistant self-registration disabled

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setError("Please select a valid image file (JPG, JPEG, or PNG)");
        return;
      }
      
      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError("File size must be less than 5MB");
        return;
      }
      
      setSelectedFile(file);
      setError(""); // Clear any previous errors
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate form data
      if (!formData.name || !formData.email || !formData.password || !formData.MobileNumber || !formData.age) {
        setError("All fields are required");
        setLoading(false);
        return;
      }

      // Enforce role-based minimum ages
      const numericAge = Number(formData.age);
      if (isCustomer && (!numericAge || numericAge <= 50)) {
        setLoading(false);
        setError("Customers must be above 50 years old to register for this service.");
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address");
        setLoading(false);
        return;
      }

      // Validate mobile number (basic validation)
      if (formData.MobileNumber.length < 10) {
        setError("Please enter a valid mobile number");
        setLoading(false);
        return;
      }

      // Validate password length
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long");
        setLoading(false);
        return;
      }

      console.log("Submitting registration with data:", formData);
      const response = await authAPI.register(formData, selectedFile);
      console.log("Registration successful:", response);
      
      // Call the success callback
      onRegisterSuccess(response.user);
      
      // Clear form
      setFormData({
        name: "",
        email: "",
        MobileNumber: "",
        password: "",
        role: "customer",
        age: "",
      });
      setSelectedFile(null);
      setPreviewUrl(null);
      setError("");
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl"
        >
          ×
        </button>
        
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              Age {isCustomer ? "(Customers must be 50+)" : isAssistant ? "(Assistants must be 21+)" : ""}
            </label>
            <input
              type="number"
              name="age"
              min={isCustomer ? 50 : isAssistant ? 21 : 1}
              placeholder="Enter your age"
              value={formData.age}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="MobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              name="MobileNumber"
              placeholder="Enter your mobile number"
              value={formData.MobileNumber}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Role selection removed: assistants cannot self-register */}

          {/* Profile Photo Upload - Show only for assistants */}
          {formData.role === "assistant" && (
            <div>
              <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
                Profile Photo
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                  />
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Upload a clear photo of yourself (JPG, PNG)
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal; 