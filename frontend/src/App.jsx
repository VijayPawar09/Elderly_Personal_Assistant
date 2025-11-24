// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import AdminPortal from "./components/Admin/AdminPortal";
import AppointmentPage from "./components/AppointmentPage/Appointment";
import AssistantProfile from "./components/AssistantProfile/Assistant";
import Dashboard from "./components/Dashboard";
import AssistantDashboard from "./components/Assistant/AssistantDashboard";
import CustomerDashboard from "./components/Customer/CustomerDashboard";

import ChatPage from "./components/Chat/chat";

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPortal />} />
        <Route path="/appointment" element={<AppointmentPage />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assistant-dashboard" element={<AssistantDashboard />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/dashboard/chat" element={<ChatPage />} />
        <Route path="*" element={<div>Page Not Found</div>} />
        <Route path="dashboard/book" element={<Dashboard />} />
        <Route path="/dashboard/appointment" element={<AppointmentPage />} />
        <Route path="/dashboard/assistant" element={<AssistantProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
