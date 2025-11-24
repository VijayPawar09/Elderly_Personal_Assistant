import { useEffect, useState } from "react";
import {
  Check,
  X,
  ChevronDown,
  Search,
  Filter,
  FileText,
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import axios from "axios";

export default function AssistantRegistrationHandler() {
  const [registrationRequests, setRegistrationRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  useEffect(() => {
    getPending();
  }, []);

  // Format the data for our UI
  const formatRequestData = (rawData) => {
    return rawData.map((item) => ({
      id: item._id,
      userId: item.userId,
      name: item.user?.username || "Unknown",
      email: item.user?.email || "No email provided",
      phone: item.user?.phoneNumber || "No phone provided",
      address: "Address not available", // Add if available in your data
      role: "Care Assistant", // Default role
      experience: item.experience || "Not specified",
      status: item.isVerified ? "Approved" : "Pending",
      availability: Array.isArray(item.availability)
        ? item.availability.join(", ")
        : "Not specified",
      backgroundCheck: item.isVerified ? "Passed" : "Pending",
      date:
        new Date(item.user?.createdAt).toLocaleDateString() || "Unknown date",
      certifications:
        Array.isArray(item.certifications) && item.certifications.length > 0
          ? item.certifications
          : ["No certifications provided"],
      specializations: Array.isArray(item.specializations)
        ? item.specializations
        : [],
      documents: ["Resume.pdf", "ID.pdf"], // Placeholder for documents (add real data if available)
      references: [
        {
          name: "Reference information not available",
          contact: "Contact not provided",
        },
      ], // Placeholder for references (add real data if available)
    }));
  };

  // Filter applications based on search and status
  const filteredRequests = registrationRequests?.filter((request) => {
    const matchesSearch =
      request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (request.role &&
        request.role.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      filterStatus === "all" || request.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Approve application
  const approveApplication = async (id) => {
    setIsLoadingAction(true);
    try {
      // Make API call to approve the assistant
      await axios.put(`https://pa-backend-wprc.onrender.com/admin/verify-assistant/${id}`, {
        isVerified: true,
      });

      // Update local state
      setRegistrationRequests((requests) =>
        requests.map((req) =>
          req.id === id
            ? { ...req, status: "Approved", backgroundCheck: "Passed" }
            : req
        )
      );
    } catch (error) {
      console.error("Error approving application:", error);
      alert("Failed to approve application");
    } finally {
      setIsLoadingAction(false);
    }
  };

  // Schedule interview
  const scheduleInterview = (id) => {
    setIsLoadingAction(true);
    // Simulate API call - implement actual API when available
    setTimeout(() => {
      setRegistrationRequests((requests) =>
        requests.map((req) =>
          req.id === id ? { ...req, status: "Interview Scheduled" } : req
        )
      );
      setIsLoadingAction(false);
    }, 1000);
  };

  // Reject application
  const rejectApplication = async (id) => {
    setIsLoadingAction(true);
    try {
      // You'll need to implement this endpoint on your backend
      await axios.put(`https://pa-backend-wprc.onrender.com/admin/reject-assistant/${id}`);

      // Update local state
      setRegistrationRequests((requests) =>
        requests.map((req) =>
          req.id === id ? { ...req, status: "Rejected" } : req
        )
      );
    } catch (error) {
      console.error("Error rejecting application:", error);
      alert("Failed to reject application");
    } finally {
      setIsLoadingAction(false);
    }
  };

  const getPending = async () => {
    try {
      const res = await axios.get(
        "https://pa-backend-wprc.onrender.com/admin/pending-assistants"
      );
      console.log("API Response:", res.data);
      const formattedData = formatRequestData(res.data);
      setRegistrationRequests(formattedData);
    } catch (err) {
      console.error("Error fetching pending assistants:", err);
      alert("Failed to load pending assistants");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="px-6 py-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-gray-800">
          Assistant Registration Requests
        </h1>
        <p className="text-gray-600">
          Review and manage care provider registration applications
        </p>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Applications List Panel */}
        <div className="flex flex-col w-1/3 bg-white border-r">
          {/* Search and Filter */}
          <div className="p-4 border-b">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search applications..."
                className="w-full px-4 py-2 pl-10 text-sm border rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search
                size={18}
                className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
              />
            </div>

            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-500">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-md"
              >
                <option value="all">All Applications</option>
                <option value="Pending">Pending</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Applications List */}
          <div className="flex-1 overflow-y-auto">
            {filteredRequests?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-gray-500">
                <FileText size={48} className="mb-2 text-gray-300" />
                <p>No applications match your search criteria</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredRequests?.map((request) => (
                  <button
                    key={request.id}
                    className={`w-full text-left p-4 hover:bg-gray-50 ${
                      selectedRequest?.id === request.id ? "bg-blue-50" : ""
                    }`}
                    onClick={() => setSelectedRequest(request)}
                  >
                    <div className="flex justify-between">
                      <h3 className="font-medium">{request.name}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          request.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : request.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : request.status === "Interview Scheduled"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {request.status}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      Care Assistant
                    </div>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Calendar size={14} className="mr-1" />
                      Applied: {request.date}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Application Details Panel */}
        <div className="flex-1 overflow-y-auto">
          {!selectedRequest ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-gray-500">
              <User size={64} className="mb-4 text-gray-300" />
              <p className="text-lg">Select an application to view details</p>
            </div>
          ) : (
            <div className="p-6">
              {/* Header with action buttons */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold">{selectedRequest.name}</h2>
                  <p className="text-lg text-gray-600">Care Assistant</p>
                </div>

                <div className="flex space-x-3">
                  {selectedRequest.status === "Pending" && (
                    <>
                      <button
                        onClick={() => scheduleInterview(selectedRequest.id)}
                        disabled={isLoadingAction}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        Schedule Interview
                      </button>
                      <button
                        onClick={() => approveApplication(selectedRequest.id)}
                        disabled={isLoadingAction}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectApplication(selectedRequest.id)}
                        disabled={isLoadingAction}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {selectedRequest.status === "Interview Scheduled" && (
                    <>
                      <button
                        onClick={() => approveApplication(selectedRequest.id)}
                        disabled={isLoadingAction}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectApplication(selectedRequest.id)}
                        disabled={isLoadingAction}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Application details */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Personal Information */}
                <div className="p-6 bg-white rounded-lg shadow">
                  <h3 className="mb-4 text-lg font-semibold border-b pb-2">
                    Personal Information
                  </h3>

                  <div className="space-y-4">
                    <div className="flex">
                      <div className="w-1/3 text-gray-600">
                        <User size={16} className="inline mr-2" />
                        Username:
                      </div>
                      <div className="w-2/3 font-medium">
                        {selectedRequest.name}
                      </div>
                    </div>

                    <div className="flex">
                      <div className="w-1/3 text-gray-600">
                        <Mail size={16} className="inline mr-2" />
                        Email:
                      </div>
                      <div className="w-2/3">{selectedRequest.email}</div>
                    </div>

                    <div className="flex">
                      <div className="w-1/3 text-gray-600">
                        <Phone size={16} className="inline mr-2" />
                        Phone:
                      </div>
                      <div className="w-2/3">{selectedRequest.phone}</div>
                    </div>

                    <div className="flex">
                      <div className="w-1/3 text-gray-600">
                        <MapPin size={16} className="inline mr-2" />
                        Account Created:
                      </div>
                      <div className="w-2/3">{selectedRequest.date}</div>
                    </div>
                  </div>
                </div>

                {/* Professional Details */}
                <div className="p-6 bg-white rounded-lg shadow">
                  <h3 className="mb-4 text-lg font-semibold border-b pb-2">
                    Professional Details
                  </h3>

                  <div className="space-y-4">
                    <div className="flex">
                      <div className="w-1/3 text-gray-600">Role:</div>
                      <div className="w-2/3 font-medium">Care Assistant</div>
                    </div>

                    <div className="flex">
                      <div className="w-1/3 text-gray-600">Experience:</div>
                      <div className="w-2/3">
                        {selectedRequest.experience} years
                      </div>
                    </div>

                    <div className="flex">
                      <div className="w-1/3 text-gray-600">
                        <Clock size={16} className="inline mr-2" />
                        Availability:
                      </div>
                      <div className="w-2/3">
                        {selectedRequest.availability}
                      </div>
                    </div>

                    <div className="flex">
                      <div className="w-1/3 text-gray-600">
                        Verification Status:
                      </div>
                      <div className="w-2/3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            selectedRequest.backgroundCheck === "Passed"
                              ? "bg-green-100 text-green-800"
                              : selectedRequest.backgroundCheck === "Failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {selectedRequest.backgroundCheck}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Specializations & Certifications */}
                <div className="p-6 bg-white rounded-lg shadow">
                  <h3 className="mb-4 text-lg font-semibold border-b pb-2">
                    Specializations & Certifications
                  </h3>

                  <div>
                    <h4 className="mb-2 font-medium">Specializations:</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedRequest.specializations.map((spec, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-md"
                        >
                          {spec}
                        </span>
                      ))}
                      {selectedRequest.specializations.length === 0 && (
                        <span className="text-gray-500">
                          No specializations provided
                        </span>
                      )}
                    </div>

                    <h4 className="mb-2 font-medium">Certifications:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRequest.certifications.map((cert, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-sm bg-green-100 text-green-800 rounded-md"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Rating & Reviews (Will be empty for new applications) */}
                <div className="p-6 bg-white rounded-lg shadow">
                  <h3 className="mb-4 text-lg font-semibold border-b pb-2">
                    Rating & Reviews
                  </h3>

                  <div className="text-center py-6">
                    <p className="text-gray-500">
                      {selectedRequest.reviewCount > 0
                        ? `Rating: ${selectedRequest.rating}/5 (${selectedRequest.reviewCount} reviews)`
                        : "No reviews yet"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes or comments section */}
              <div className="p-6 mt-6 bg-white rounded-lg shadow">
                <h3 className="mb-4 text-lg font-semibold border-b pb-2">
                  Admin Notes
                </h3>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="Add notes about this application..."
                  rows={4}
                ></textarea>
                <div className="flex justify-end mt-3">
                  <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    Save Notes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
