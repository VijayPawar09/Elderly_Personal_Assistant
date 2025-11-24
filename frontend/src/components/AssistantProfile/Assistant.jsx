import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfilePhotoUrl, handleImageError } from "../../utils/imageUtils.js";

const AssistantProfile = () => {
  const [assistants, setAssistants] = useState([]);
  const navigate = useNavigate();
  const currentUser = useMemo(() => {
    const remembered = localStorage.getItem("rememberedUser");
    if (!remembered) return null;
    try {
      return JSON.parse(remembered);
    } catch (e) {
      return null;
    }
  }, []);

  const isAdmin = currentUser?.role === "admin";
  const isCustomer = currentUser?.role === "customer";

  // Local assistants used if API fails or returns empty
  const LOCAL_ASSISTANTS = [
    {
      _id: "hard-1",
      name: "Aarav Sharma",
      age: 29,
      email: "aarav.sharma@example.com",
      MobileNumber: "+91 98765 43210",
      rating: 4.6,
      profilePhoto: "",
    },
    {
      _id: "hard-2",
      name: "Priya Verma",
      age: 32,
      email: "priya.verma@example.com",
      MobileNumber: "+91 99887 66554",
      rating: 4.8,
      profilePhoto: "",
    },
    {
      _id: "hard-3",
      name: "Rahul Mehta",
      age: 35,
      email: "rahul.mehta@example.com",
      MobileNumber: "+91 91234 56789",
      rating: 4.3,
      profilePhoto: "",
    },
    {
      _id: "hard-4",
      name: "Sanya Kapoor",
      age: 28,
      email: "sanya.kapoor@example.com",
      MobileNumber: "+91 98111 22334",
      rating: 4.7,
      profilePhoto: "",
    },
    {
      _id: "hard-5",
      name: "Vikram Rao",
      age: 41,
      email: "vikram.rao@example.com",
      MobileNumber: "+91 99000 11122",
      rating: 4.4,
      profilePhoto: "",
    },
  ];

  useEffect(() => {
    // Always use local assistants list
    setAssistants(LOCAL_ASSISTANTS);
  }, []);

  const handleAssign = (assistant) => {
    if (!isAdmin) return;
    // Simple assignment store: map customerEmail -> assistantId
    const customerEmail = prompt("Enter customer email to assign this assistant:");
    if (!customerEmail) return;
    const key = "assistantAssignments";
    const raw = localStorage.getItem(key);
    const map = raw ? JSON.parse(raw) : {};
    map[customerEmail.trim().toLowerCase()] = assistant._id || assistant.email || assistant.name;
    localStorage.setItem(key, JSON.stringify(map));
    alert("Assistant assigned to " + customerEmail);
  };

const handleChat = (assistant) => {
  navigate("/dashboard/chat", { state: { assistant } });
}

  return (
    <div className="bg-gradient-to-b from-indigo-50 to-white py-16 px-4">
      <h1 className="text-4xl font-bold text-center text-indigo-700 mb-12">
        Meet Our Trusted Assistants
      </h1>

      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {assistants.map((assistant, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 text-center"
          >
            <img
              src={getProfilePhotoUrl(assistant.profilePhoto, assistant.name)}
              alt={assistant.name}
              className="w-28 h-28 object-cover rounded-full mx-auto border-4 border-indigo-500 mb-4"
              onError={(e) => handleImageError(e, assistant.name)}
            />
            <h2 className="text-xl font-semibold text-gray-800">
              {assistant.name}
            </h2>
            <p className="text-gray-500">Age: {assistant.age}</p>
            {assistant.email && (
              <p className="text-gray-500">✉️ {assistant.email}</p>
            )}
            <p className="text-gray-500">📱 {assistant.MobileNumber}</p>

            <div className="mt-3 flex justify-center items-center">
              <span className="text-gray-600 mr-2">Rating:</span>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      fill={i < Math.floor(assistant.rating) ? "gold" : "lightgray"}
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                    >
                      <path d="M12 .587l3.668 7.453L24 9.576l-6 5.84 1.414 8.243L12 18.896l-7.414 4.763L6 15.416 0 9.576l8.332-1.536z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-700">{Number(assistant.rating).toFixed(1)}</span>
              </div>
            </div>

            {isAdmin && (
              <button
                onClick={() => handleAssign(assistant)}
                className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm transition"
              >
                Assign Assistant
              </button>
            )}

            {isCustomer && (
              <CustomerChatControl assistant={assistant} currentUser={currentUser} onChat={() => handleChat(assistant)} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const CustomerChatControl = ({ assistant, currentUser, onChat }) => {
  // A customer can chat only if assigned to this assistant
  const key = "assistantAssignments";
  let assigned = false;
  try {
    const raw = localStorage.getItem(key);
    const map = raw ? JSON.parse(raw) : {};
    const custEmail = (currentUser?.email || "").trim().toLowerCase();
    const assignedId = map[custEmail];
    const thisId = assistant._id || assistant.email || assistant.name;
    assigned = !!custEmail && assignedId === thisId;
  } catch (e) {
    assigned = false;
  }

  if (!assigned) {
    return (
      <div className="mt-3 text-xs text-gray-500">Chat will be available once you are assigned to this assistant.</div>
    );
  }

  return (
    <button
      onClick={onChat}
      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm transition"
    >
      Chat
    </button>
  );
};

export default AssistantProfile;
