import { useEffect, useState } from "react";
import LoginPage from "./LoginPage";
import Dashboard from "./AdminDashboard";
import { authAPI } from "../../API/auth.js";

export default function AdminPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = authAPI.getCurrentUser();
    setIsLoggedIn(!!user);
    setIsAdmin(user?.role === 'admin');
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {!isLoggedIn || !isAdmin ? (
        <LoginPage onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <Dashboard
          sidebarOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onLogout={() => { setIsLoggedIn(false); setIsAdmin(false); }}
        />
      )}
    </div>
  );
}
