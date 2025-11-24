import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginModal from "../Auth/login";
import RegisterModal from "../Auth/Register";
import { authAPI } from "../../API/auth.js";
import { notificationAPI } from "../../API/notifications.js";
import { Bell, User, Calendar } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for authenticated user from both sources
    const remembered = JSON.parse(localStorage.getItem("rememberedUser"));
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (remembered && token) {
      setCurrentUser(remembered);
    } else if (user && token) {
      const userData = JSON.parse(user);
      setCurrentUser(userData);
      localStorage.setItem("rememberedUser", JSON.stringify(userData));
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchUserNotifications();
    }
  }, [currentUser]);

  const fetchUserNotifications = async () => {
    try {
      const userNotifications = await notificationAPI.getUserNotifications(5); // Get last 5 notifications
      setNotifications(userNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // Fallback to empty array if API fails
      setNotifications([]);
    }
  };

  const toggleNav = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("rememberedUser");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleNotificationClick = async (notification) => {
    try {
      // Mark notification as read
      await notificationAPI.markAsRead(notification._id);
      
      // Update local state to remove the notification or mark as read
      setNotifications((prev) => 
        prev.map(n => n._id === notification._id ? { ...n, read: true } : n)
      );

      // Navigate based on notification type
      if (notification.link) {
        navigate(notification.link);
      } else if (notification.type === 'appointment_assigned') {
        navigate('/customer-dashboard'); // or appropriate dashboard
      }
    } catch (error) {
      console.error("Error handling notification click:", error);
    }
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-indigo-600 via-blue-500 to-teal-400 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="text-white text-2xl font-bold">
              Elderly Personal Assistance
            </div>
            {/* Mobile hamburger button */}
            <button
              className="md:hidden text-white focus:outline-none"
              aria-label="Toggle navigation menu"
              onClick={toggleNav}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Desktop menu */}
            <div className="hidden md:flex space-x-4 items-center">
              <a
                href="#Main"
                className="text-white hover:bg-white hover:text-indigo-600 px-4 py-2 rounded-lg"
              >
                Home
              </a>
              <a
                href="#services"
                className="text-white hover:bg-white hover:text-indigo-600 px-4 py-2 rounded-lg"
              >
                Services
              </a>
              <a
                href="#about"
                className="text-white hover:bg-white hover:text-indigo-600 px-4 py-2 rounded-lg"
              >
                About
              </a>
              <a
                href="#Contact"
                className="text-white hover:bg-white hover:text-indigo-600 px-4 py-2 rounded-lg"
              >
                Contact
              </a>
              <Link
                to="/appointment"
                className="text-white hover:bg-white hover:text-indigo-600 px-4 py-2 rounded-lg"
              >
                Book Appointment
              </Link>

              {currentUser && (
                <Link
                  to="/customer-dashboard"
                  className="text-white hover:bg-white hover:text-indigo-600 px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <Calendar size={18} />
                  <span>My Appointments</span>
                </Link>
              )}

              <Link
                to="/dashboard/assistant"
                className="text-white hover:bg-white hover:text-indigo-600 px-4 py-2 rounded-lg"
              >
                Assistants
              </Link>

              <Link
                to="/admin"
                className="text-white hover:bg-white hover:text-indigo-600 px-4 py-2 rounded-lg"
              >
                Admin
              </Link>

              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu((prev) => !prev)}
                    className="flex items-center gap-2 text-white font-semibold"
                  >
                    <User className="h-5 w-5" />
                    {currentUser.name || currentUser.email}
                  </button>

                  {/* Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-20">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        View Profile
                      </Link>
                      <div className="border-t"></div>
                      <div className="p-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Notifications</span>
                          <div className="flex items-center">
                            <Bell className="h-5 w-5 text-indigo-600" />
                            {notifications.filter(n => !n.read).length > 0 && (
                              <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                                {notifications.filter(n => !n.read).length}
                              </span>
                            )}
                          </div>
                        </div>
                        {notifications.length > 0 ? (
                          <div className="max-h-48 overflow-y-auto">
                            {notifications.slice(0, 5).map((notification) => (
                              <button
                                key={notification._id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`text-sm text-left w-full px-2 py-2 hover:bg-indigo-100 rounded mb-1 ${
                                  !notification.read ? 'bg-blue-50 border-l-2 border-blue-500' : ''
                                }`}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900 text-xs">
                                      {notification.title}
                                    </div>
                                    <div className="text-gray-600 text-xs mt-1 line-clamp-2">
                                      {notification.message}
                                    </div>
                                    <div className="text-gray-400 text-xs mt-1">
                                      {new Date(notification.createdAt).toLocaleDateString()}
                                    </div>
                                  </div>
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500 py-2">
                            No notifications
                          </p>
                        )}
                      </div>
                      <div className="border-t"></div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setShowLogin(true)}
                    className="text-white hover:bg-white hover:text-indigo-600 px-4 py-2 rounded-lg"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setShowRegister(true)}
                    className="text-white hover:bg-white hover:text-indigo-600 px-4 py-2 rounded-lg"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isOpen && (
          <div className="md:hidden px-4 pb-4 space-y-2">
            <a href="#Main" className="block text-white">
              Home
            </a>
            <a href="#services" className="block text-white">
              Services
            </a>
            <a href="#about" className="block text-white">
              About
            </a>
            <a href="#Contact" className="block text-white">
              Contact
            </a>
            <Link to="/appointment" className="block text-white">
              Book Appointment
            </Link>

            {currentUser && (
              <Link to="/customer-dashboard" className="block text-white flex items-center space-x-2">
                <Calendar size={18} />
                <span>My Appointments</span>
              </Link>
            )}

            <Link to="/dashboard/assistant" className="block text-white">
              Assistants
            </Link>

            <Link to="/admin" className="block text-white">
              Admin
            </Link>

            {currentUser ? (
              <>
                <span className="block text-white font-semibold">
                  Hello, {currentUser.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 mt-2 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block bg-white text-indigo-600 px-4 py-2 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block bg-white text-indigo-600 px-4 py-2 rounded-lg"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}

        {/* Modals */}
        <RegisterModal
          isOpen={showRegister}
          onClose={() => {
            setShowRegister(false);
            setShowLogin(true); // optional
          }}
          onRegisterSuccess={(user) => {
            // Don't set current user or store in localStorage
            // Just redirect to homepage where they can login
            alert("✅ Registration successful! Please login to continue.");
            navigate("/");
            setShowRegister(false);
          }}
        />

        <LoginModal
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            localStorage.setItem("rememberedUser", JSON.stringify(user));
            setShowLogin(false);

            // Redirect based on user role
            if (user.role === "assistant") {
              navigate("/assistant-dashboard");
            } else if (user.role === "customer") {
              navigate("/customer-dashboard");
            }
          }}
        />
      </nav>
    </>
  );
};

export default Navbar;
