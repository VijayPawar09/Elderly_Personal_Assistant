import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Search,
  Eye,
  Edit,
  Check,
  X,
} from "lucide-react";
import axios from "axios";
import { authAPI } from "../../API/auth.js";
import Navbar from "../Navbar/NAvbar.jsx";

const AssistantDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      // Check if user is authenticated
      if (!authAPI.isAuthenticated()) {
        console.error("User not authenticated");
        return;
      }

      // Get current user info
      const currentUser = authAPI.getCurrentUser();
      console.log("Current user:", currentUser);

      // Get token for API request
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      // Fetch appointments for current assistant
      const response = await axios.get(
        "http://localhost:5000/api/appointments/assistant/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Appointments response:", response.data);
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      console.error("Error details:", error.response?.data);
      // Set empty array if no appointments found
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      // Get token for API request
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      // Update appointment status via API
      await axios.put(
        `http://localhost:5000/api/appointments/${appointmentId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state
      setAppointments((prev) =>
        prev.map((apt) =>
          apt._id === appointmentId ? { ...apt, status: newStatus } : apt
        )
      );

      // Close modal if open
      setShowModal(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error("Error updating appointment status:", error);
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

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesFilter = filter === "all" || appointment.status === filter;
    const matchesSearch =
      appointment.customer.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.service.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
                Assistant Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your appointments and care services
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  Welcome back!
                </p>
                <p className="text-sm text-gray-500">Ready to help today?</p>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter size={20} className="text-gray-400" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Appointments</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="relative">
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Appointments
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredAppointments.length === 0 ? (
              <div className="p-6 text-center">
                <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No appointments found</p>
                <p className="text-sm text-gray-400 mt-2">
                  When customers book appointments with you, they will appear
                  here.
                </p>
              </div>
            ) : (
              filteredAppointments.map((appointment) => (
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
                            {appointment.customer.name}
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
                      >
                        <Eye size={16} />
                      </button>

                      {appointment.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              updateAppointmentStatus(
                                appointment._id,
                                "confirmed"
                              )
                            }
                            className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md"
                            title="Confirm Appointment"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() =>
                              updateAppointmentStatus(
                                appointment._id,
                                "cancelled"
                              )
                            }
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                            title="Cancel Appointment"
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}

                      {appointment.status === "confirmed" && (
                        <button
                          onClick={() =>
                            updateAppointmentStatus(
                              appointment._id,
                              "in-progress"
                            )
                          }
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Start
                        </button>
                      )}

                      {appointment.status === "in-progress" && (
                        <button
                          onClick={() =>
                            updateAppointmentStatus(
                              appointment._id,
                              "completed"
                            )
                          }
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
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
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Customer Information
                  </h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <User size={16} className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        {selectedAppointment.customer.name}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Mail size={16} className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        {selectedAppointment.customer.email}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Phone size={16} className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        {selectedAppointment.customer.MobileNumber}
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

export default AssistantDashboard;
