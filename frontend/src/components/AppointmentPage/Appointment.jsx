import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { appointmentAPI } from "../../API/appointments.js";
import { authAPI } from "../../API/auth.js";
import Navbar from "../Navbar/NAvbar.jsx";

const AppointmentPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading, true = authenticated, false = not authenticated
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    hours: "",
    time: "",
    service: "",
    customService: "",
    charges: "",
    details: "",
  });

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authAPI.isAuthenticated();
      const currentUser = authAPI.getCurrentUser();
      
      console.log("Authentication status:", authenticated);
      console.log("Current user:", currentUser);
      
      if (!authenticated) {
        alert("Please login to book an appointment");
        navigate("/"); // Go back to home page where they can login
        return;
      }
      
      // Check if user is a customer
      if (currentUser && currentUser.role !== "customer") {
        alert("Only customers can book appointments. Please login as a customer.");
        navigate("/");
        return;
      }
      
      setIsAuthenticated(authenticated);
      setUser(currentUser);
    };
    
    checkAuth();
  }, [navigate]);

  // Calculate charges automatically when hours change
  useEffect(() => {
    if (formData.hours && !isNaN(formData.hours)) {
      const calculatedCharges = parseInt(formData.hours) * 100; // ₹100 per hour
      setFormData(prev => ({ ...prev, charges: calculatedCharges.toString() }));
    } else {
      setFormData(prev => ({ ...prev, charges: "" }));
    }
  }, [formData.hours]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check authentication before submitting
    if (!isAuthenticated) {
      alert("Please login to book an appointment");
      return;
    }

    if (!formData.details || String(formData.details).trim().length < 5) {
      alert("Please provide your address (min 5 characters)");
      return;
    }

    if (!formData.hours || formData.hours < 1 || formData.hours > 12) {
      alert("Please enter a valid number of hours (1-12)");
      return;
    }

    const selectedService =
      formData.service === "Other" ? formData.customService : formData.service;

    const finalData = {
      ...formData,
      service: selectedService,
    };

    try {
      await appointmentAPI.bookAppointment(finalData);
      alert("✅ Appointment booked! You will receive notifications once an assistant is assigned.");
      navigate("/customer-dashboard");
    } catch (err) {
      console.error(err);
      if (err.message === "No token found" || err.message?.includes("Unauthorized")) {
        alert("❌ Please login to book an appointment");
      } else {
        alert("❌ Failed to book appointment: " + (err.message || "Unknown error"));
      }
    }
  };

  const services = [
    "Medications",
    "Doctor Appointment",
    "Health Checkup",
    "Drinking",
    "Watch Movie",
    "Grocery",
    "Electricity Bill",
    "Mobile Bill",
    "Other",
  ];


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (isAuthenticated === null) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Checking authentication...</p>
          </div>
        </div>
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="text-center">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
              <p className="text-gray-600 mb-6">Please login to book an appointment</p>
              <button
                onClick={() => navigate("/")}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Go to Home Page
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 mt-14">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Book an Appointment
        </h2>

        {user && (
          <div className="mb-4 p-4 bg-green-100 rounded-md shadow-sm text-center">
            <h3 className="text-lg font-semibold text-green-700">
              Welcome, {user.name}!
            </h3>
            <p className="text-gray-600">You are logged in as: {user.role}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Number of Hours
            </label>
            <input
              type="number"
              name="hours"
              value={formData.hours}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              min="1"
              max="12"
              placeholder="Enter number of hours (1-12)"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Preferred Time
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Select Service
            </label>
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="" disabled>
                Select a service
              </option>
              {services.map((service, idx) => (
                <option key={idx} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>

          {formData.service === "Other" && (
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Specify Your Service
              </label>
              <input
                type="text"
                name="customService"
                value={formData.customService}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter your service..."
                required
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Charges (₹100 per hour)
            </label>
            <div className="w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-700">
              {formData.charges ? `₹${formData.charges}` : "Enter hours to calculate charges"}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Charges are automatically calculated at ₹100 per hour
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Address
            </label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter your address..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
          >
            Book Appointment
          </button>
        </form>
      </div>
      </div>
    </>
  );
};

export default AppointmentPage;
