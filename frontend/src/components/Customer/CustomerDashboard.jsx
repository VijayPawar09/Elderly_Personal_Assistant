import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Users,
  Star,
  Phone,
  Mail,
} from "lucide-react";
import { appointmentAPI } from "../../API/appointments.js";
import Navbar from "../Navbar/NAvbar.jsx";
import axios from "axios";

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [assistants, setAssistants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assistantsLoading, setAssistantsLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check current authentication status
    const currentToken = localStorage.getItem("token");
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    
    console.log("Current token:", currentToken);
    console.log("Current user:", currentUser);
    
    // Only set up mock customer if there's NO token at all
    if (!currentToken) {
      console.log("No token found, setting up mock customer");
      const mockCustomerToken = 'mock_customer_token_' + Date.now();
      const mockCustomerUser = {
        _id: "507f1f77bcf86cd799439012",
        name: "John Doe",
        email: "customer@elderlycare.com",
        role: "customer",
        MobileNumber: "9876543210"
      };
      
      localStorage.setItem('token', mockCustomerToken);
      localStorage.setItem('user', JSON.stringify(mockCustomerUser));
    } else if (currentUser.role !== "customer") {
      // If user is not a customer (e.g., admin), redirect them
      console.log("Non-customer user trying to access customer dashboard");
      alert("This page is only accessible to customers. Please login as a customer.");
      // Don't redirect, just show a message
    }
    
    fetchCustomerAppointments();
  }, []);

  const fetchCustomerAppointments = async () => {
    try {
      setLoading(true);
      console.log("Fetching appointments from backend...");
      console.log("Current token:", localStorage.getItem("token"));
      console.log("Current user:", localStorage.getItem("user"));
      
      const data = await appointmentAPI.getCustomerAppointments();
      console.log("Received appointments from backend:", data);
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      console.error("Error details:", error.response?.data || error.message);
      
      // Only show mock data if it's a network error or server is down
      if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        console.log("Network error detected, showing mock data as fallback");
        const mockAppointments = [
          {
            _id: "1",
            assistant: "Dr. Sarah Johnson",
            service: "Medications",
            hours: 2,
            time: "09:00",
            charges: 200,
            details: "123 Oak Street, Apt 4B, New York, NY 10001",
            status: "confirmed",
            dateBooked: new Date("2024-01-15T10:30:00Z"),
          },
          {
            _id: "2",
            assistant: "Nurse Robert Wilson",
            service: "Doctor Appointment",
            hours: 3,
            time: "14:00",
            charges: 300,
            details: "456 Pine Avenue, Suite 12, Brooklyn, NY 11201",
            status: "completed",
            dateBooked: new Date("2024-01-14T15:45:00Z"),
          },
          {
            _id: "3",
            assistant: "Care Assistant Margaret",
            service: "Health Checkup",
            hours: 1,
            time: "11:30",
            charges: 100,
            details: "789 Elm Road, Floor 3, Queens, NY 11375",
            status: "pending",
            dateBooked: new Date("2024-01-16T09:15:00Z"),
          },
        ];
        setAppointments(mockAppointments);
      } else {
        // For other errors, show empty appointments array
        setAppointments([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAssistants = async () => {
    try {
      setAssistantsLoading(true);
      const response = await axios.get('http://localhost:5000/api/assistants');
      setAssistants(response.data);
    } catch (error) {
      console.error("Error fetching assistants:", error);
      // Fallback mock data if API fails
      const mockAssistants = [
        {
          _id: "1",
          name: "Aarav Sharma",
          email: "aarav.sharma@example.com",
          MobileNumber: "+91 98765 43210",
          rating: 4.6,
          reviewCount: 25
        },
        {
          _id: "2", 
          name: "Priya Verma",
          email: "priya.verma@example.com",
          MobileNumber: "+91 99887 66534",
          rating: 4.8,
          reviewCount: 32
        },
        {
          _id: "3",
          name: "Rahul Mehta", 
          email: "rahul.mehta@example.com",
          MobileNumber: "+91 91234 56789",
          rating: 4.3,
          reviewCount: 18
        }
      ];
      setAssistants(mockAssistants);
    } finally {
      setAssistantsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <AlertCircle size={16} />;
      case "confirmed":
        return <CheckCircle size={16} />;
      case "in-progress":
        return <Clock size={16} />;
      case "completed":
        return <CheckCircle size={16} />;
      case "cancelled":
        return <XCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const stats = {
    total: appointments.length,
    pending: appointments.filter((apt) => apt.status === "pending").length,
    confirmed: appointments.filter((apt) => apt.status === "confirmed").length,
    completed: appointments.filter((apt) => apt.status === "completed").length,
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {activeTab === 'appointments' ? 'My Appointments' : 'Available Assistants'}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {activeTab === 'appointments' 
                  ? 'Track your care service appointments'
                  : 'Browse and connect with our qualified care assistants'
                }
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  Welcome back, {JSON.parse(localStorage.getItem("user") || '{"name": "Customer"}').name}!
                </p>
                <p className="text-sm text-gray-500">
                  How can we help you today?
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('appointments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'appointments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Calendar size={18} />
              <span>My Appointments</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('assistants');
                if (assistants.length === 0) {
                  fetchAssistants();
                }
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'assistants'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users size={18} />
              <span>Available Assistants</span>
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Appointments Tab Content */}
        {activeTab === 'appointments' && (
          <>
            {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar size={24} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Appointments
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle size={24} className="text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pending}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle size={24} className="text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Confirmed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.confirmed}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.completed}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Your Appointments
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {appointments.length === 0 ? (
              <div className="p-6 text-center">
                <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No appointments found</p>
                <p className="text-sm text-gray-400 mt-2">
                  Book your first appointment to get started
                </p>
              </div>
            ) : (
              appointments.map((appointment) => (
                <div key={appointment._id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User size={24} className="text-blue-600" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {appointment.assistant}
                          </p>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              appointment.status
                            )}`}
                          >
                            {getStatusIcon(appointment.status)}
                            <span className="ml-1">{appointment.status}</span>
                          </span>
                        </div>

                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {new Date(
                              appointment.dateBooked
                            ).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            {appointment.time} ({appointment.hours} hours)
                          </span>
                          <span className="flex items-center">
                            <MapPin size={14} className="mr-1" />
                            {appointment.service}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-gray-600 truncate">
                          {appointment.details}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setShowModal(true);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
            </>
          )}

          {/* Assistants Tab Content */}
          {activeTab === 'assistants' && (
            <div>
              {assistantsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {assistants.map((assistant) => (
                    <div key={assistant._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                          <User size={32} className="text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{assistant.name}</h3>
                          <div className="flex items-center space-x-1 mt-1">
                            <Star size={16} className="text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">
                              {assistant.rating || 0} ({assistant.reviewCount || 0} reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Mail size={16} />
                          <span>{assistant.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Phone size={16} />
                          <span>{assistant.MobileNumber}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                          Contact
                        </button>
                        <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                          View Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {!assistantsLoading && assistants.length === 0 && (
                <div className="text-center py-8">
                  <Users size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No assistants available at the moment</p>
                </div>
              )}
            </div>
          )}
        </div>

      {/* Appointment Detail Modal */}
      {showModal && selectedAppointment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Appointment Details
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Assistant Information
                  </h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <User size={16} className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        {selectedAppointment.assistant}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Service Details</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <Calendar size={16} className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        {new Date(
                          selectedAppointment.dateBooked
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        {selectedAppointment.time} ({selectedAppointment.hours}{" "}
                        hours)
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin size={16} className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        {selectedAppointment.service}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-600 mr-2">
                        Charges:
                      </span>
                      <span className="text-sm text-gray-600">
                        ₹{selectedAppointment.charges}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Address</h4>
                  <p className="mt-2 text-sm text-gray-600">
                    {selectedAppointment.details}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Status</h4>
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        selectedAppointment.status
                      )}`}
                    >
                      {getStatusIcon(selectedAppointment.status)}
                      <span className="ml-1">{selectedAppointment.status}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default CustomerDashboard;
