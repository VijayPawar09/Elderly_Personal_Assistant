import { Bell, Calendar, ChevronRight, Clock, FileText, Home, LogOut, Menu, MessageSquare, PieChart, Settings, User, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentAPI } from '../../API/appointments.js';
import { assistantsAPI } from '../../API/index.js';
import { customerAPI } from '../../API/customers.js';
import { notificationAPI } from '../../API/notifications.js';
import AssistantRegistrationHandler from './AssistantRequestHandler'

export default function AdminDashboard({ sidebarOpen, toggleSidebar, onLogout }) {
    const [activeTab, setActiveTab] = useState('overview');
    
    return (
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */} 
        <aside 
          className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-blue-800 text-white`}
        >
          <div className="flex items-center justify-between p-4 border-b border-blue-700">
            {sidebarOpen && (
              <h2 className="text-xl font-bold">Elderly Personal Assistance</h2>
            )}
            <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-blue-700">
              <Menu size={24} />
            </button>
          </div>
          
          <nav className="mt-6">
            <SidebarLink 
              icon={<Home size={24} />}
              text="Overview"
              isActive={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
              sidebarOpen={sidebarOpen}
            />
            <SidebarLink 
              icon={<Users size={24} />}
              text="Residents"
              isActive={activeTab === 'residents'}
              onClick={() => setActiveTab('residents')}
              sidebarOpen={sidebarOpen}
            />
            <SidebarLink 
              icon={<User size={24} />}
              text="Staff"
              isActive={activeTab === 'staff'}
              onClick={() => setActiveTab('staff')}
              sidebarOpen={sidebarOpen}
            />
            <SidebarLink 
              icon={<Calendar size={24} />}
              text="Schedule"
              isActive={activeTab === 'schedule'}
              onClick={() => setActiveTab('schedule')}
              sidebarOpen={sidebarOpen}
            />
            <SidebarLink 
              icon={<Calendar size={24} />}
              text="Appointments"
              isActive={activeTab === 'appointments'}
              onClick={() => setActiveTab('appointments')}
              sidebarOpen={sidebarOpen}
            />
            <SidebarLink 
              icon={<Bell size={24} />}
              text="Notifications"
              isActive={activeTab === 'notifications'}
              onClick={() => setActiveTab('notifications')}
              sidebarOpen={sidebarOpen}
            />
            <SidebarLink 
              icon={<MessageSquare size={24} />}
              text="Messages"
              isActive={activeTab === 'messages'}
              onClick={() => setActiveTab('messages')}
              sidebarOpen={sidebarOpen}
            />
            <SidebarLink 
              icon={<FileText size={24} />}
              text="Reports"
              isActive={activeTab === 'reports'}
              onClick={() => setActiveTab('reports')}
              sidebarOpen={sidebarOpen}
            />
            <SidebarLink 
              icon={<Settings size={24} />}
              text="Settings"
              isActive={activeTab === 'settings'}
              onClick={() => setActiveTab('settings')}
              sidebarOpen={sidebarOpen}
            />
            <SidebarLink 
              icon={<LogOut size={24} />}
              text="Logout"
              onClick={onLogout}
              sidebarOpen={sidebarOpen}
            />
          </nav>
        </aside>
        
        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
            <h1 className="text-2xl font-bold text-gray-800">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'residents' && 'Customer Management'}
              {activeTab === 'staff' && 'Staff Directory'}
              {activeTab === 'schedule' && 'Care Schedule'}
              {activeTab === 'appointments' && 'Appointment Management'}
              {activeTab === 'notifications' && 'Notifications'}
              {activeTab === 'messages' && 'Communications'}
              {activeTab === 'reports' && 'Reports & Analytics'}
              {activeTab === 'settings' && 'System Settings'}
            </h1>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 bg-gray-100 rounded-full hover:bg-gray-200">
                <Bell size={20} />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-blue-600 rounded-full"></div>
                <span className="font-medium text-gray-700">Admin User</span>
              </div>
            </div>
          </header>
          
          {/* Dashboard Content */}
          <main className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'residents' && <ResidentsTab />}
            {activeTab === 'staff' && <StaffTab />}
            {activeTab === 'schedule' && <ScheduleTab />}
            {activeTab === 'appointments' && <AppointmentsTab />}
            {activeTab === 'notifications' && <NotificationsTab />}
            {activeTab === 'messages' && <MessagesTab />}
            {activeTab === 'reports' && <ReportsTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </main>
        </div>
      </div>
    );
  }
  
  // Sidebar Link Component
  function SidebarLink({ icon, text, isActive, onClick, sidebarOpen }) {
    return (
      <button
        onClick={onClick}
        className={`flex items-center w-full px-4 py-3 transition-colors ${
          isActive ? 'bg-blue-700' : 'hover:bg-blue-700'
        }`}
      >
        <span className="flex items-center justify-center">{icon}</span>
        {sidebarOpen && <span className="ml-4">{text}</span>}
      </button>
    );
  }
  
  // Dashboard Tabs
  function OverviewTab() {
    const stats = [
      { label: 'Total Residents', value: '68', icon: <Users size={24} className="text-blue-600" /> },
      { label: 'Staff Members', value: '24', icon: <User size={24} className="text-green-600" /> },
      { label: 'Active Care Plans', value: '54', icon: <FileText size={24} className="text-purple-600" /> },
      { label: 'Today\'s Activities', value: '8', icon: <Calendar size={24} className="text-yellow-600" /> },
    ];
  
    const recentActivities = [
      { user: 'Martha Lewis', activity: 'Morning Medication', time: '8:30 AM', status: 'Completed' },
      { user: 'Robert Johnson', activity: 'Doctor Visit', time: '10:15 AM', status: 'Scheduled' },
      { user: 'Helen Davis', activity: 'Group Exercise', time: '11:00 AM', status: 'In Progress' },
      { user: 'William Smith', activity: 'Lunch Service', time: '12:30 PM', status: 'Upcoming' },
    ];
  
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className="p-3 bg-gray-100 rounded-full">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="col-span-2 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Recent Activities</h2>
              <button className="text-sm text-blue-600 hover:underline">View all</button>
            </div>
            <div className="p-4">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="p-2">Resident</th>
                    <th className="p-2">Activity</th>
                    <th className="p-2">Time</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivities.map((activity, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{activity.user}</td>
                      <td className="p-2">{activity.activity}</td>
                      <td className="p-2">{activity.time}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          activity.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          activity.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                          activity.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {activity.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Today's Schedule</h2>
            </div>
            <div className="p-4 space-y-4">
              <ScheduleItem time="8:00 AM" event="Breakfast Service" />
              <ScheduleItem time="9:30 AM" event="Morning Medication" />
              <ScheduleItem time="10:30 AM" event="Physical Therapy" />
              <ScheduleItem time="12:00 PM" event="Lunch Service" />
              <ScheduleItem time="2:00 PM" event="Arts & Crafts" />
              <ScheduleItem time="4:00 PM" event="Afternoon Tea" />
              <ScheduleItem time="5:30 PM" event="Dinner Service" />
              <ScheduleItem time="7:00 PM" event="Evening Activities" />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Emergency Contacts</h2>
            </div>
            <div className="p-4 space-y-3">
              <ContactCard name="Dr. Sarah Johnson" role="Medical Director" phone="(555) 123-4567" />
              <ContactCard name="Ambulance Service" role="Emergency Medical" phone="(555) 911-0000" />
              <ContactCard name="Security Office" role="Building Security" phone="(555) 987-6543" />
              <ContactCard name="Maintenance" role="Facility Issues" phone="(555) 456-7890" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Recent Alerts</h2>
            </div>
            <div className="p-4 space-y-3">
              <AlertItem 
                type="warning" 
                message="Medication supply for resident #1023 running low" 
                time="2 hours ago" 
              />
              <AlertItem 
                type="info" 
                message="New dietary requirements uploaded for 3 residents" 
                time="4 hours ago" 
              />
              <AlertItem 
                type="error" 
                message="Maintenance request: Elevator #2 not working properly" 
                time="Yesterday" 
              />
              <AlertItem 
                type="success" 
                message="Staff schedule for next month approved" 
                time="Yesterday" 
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  function ScheduleItem({ time, event }) {
    return (
      <div className="flex items-center p-2 rounded-md hover:bg-gray-50">
        <div className="flex items-center justify-center w-12 h-12 mr-4 bg-blue-100 rounded-full">
          <Clock size={20} className="text-blue-600" />
        </div>
        <div>
          <p className="font-medium">{event}</p>
          <p className="text-sm text-gray-500">{time}</p>
        </div>
      </div>
    );
  }
  
  function ContactCard({ name, role, phone }) {
    return (
      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
        <div className="flex items-center">
          <p className="mr-2 font-medium">{phone}</p>
          <ChevronRight size={16} className="text-gray-400" />
        </div>
      </div>
    );
  }
  
  function AlertItem({ type, message, time }) {
    return (
      <div className={`p-3 rounded-md ${
        type === 'warning' ? 'bg-yellow-50 border-l-4 border-yellow-400' :
        type === 'error' ? 'bg-red-50 border-l-4 border-red-400' :
        type === 'success' ? 'bg-green-50 border-l-4 border-green-400' :
        'bg-blue-50 border-l-4 border-blue-400'
      }`}>
        <p className="font-medium">{message}</p>
        <p className="text-sm text-gray-500">{time}</p>
      </div>
    );
  }
  
  // Customers/Residents Tab
  function ResidentsTab() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await customerAPI.getAllCustomers();
        setCustomers(data);
      } catch (err) {
        setError('Failed to fetch customers');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchCustomers();
    }, []);

    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Customer Directory</h2>
            <p className="text-gray-500">Manage registered customers</p>
          </div>
          <button 
            onClick={fetchCustomers}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
        
        {error && (
          <div className="p-3 text-red-800 bg-red-100 rounded-md">
            {error}
          </div>
        )}
        
        <div className="p-4 bg-white rounded-lg shadow">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Age</th>
                <th className="p-2">Role</th>
                <th className="p-2">Registered</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    No customers registered yet
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer._id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{customer.name}</td>
                    <td className="p-2">{customer.email}</td>
                    <td className="p-2">{customer.MobileNumber}</td>
                    <td className="p-2">{customer.age}</td>
                    <td className="p-2">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {customer.role}
                      </span>
                    </td>
                    <td className="p-2 text-sm text-gray-500">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  
  function StaffTab() {
    const [activeStaffTab, setActiveStaffTab] = useState('assistants');
    const [assistants, setAssistants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchAssistants = async () => {
      try {
        setLoading(true);
        const data = await assistantsAPI.list();
        setAssistants(data);
      } catch (err) {
        setError('Failed to fetch assistants');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      if (activeStaffTab === 'assistants') {
        fetchAssistants();
      }
    }, [activeStaffTab]);

    return (
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-4 border-b">
          <button
            onClick={() => setActiveStaffTab('assistants')}
            className={`px-4 py-2 font-medium ${
              activeStaffTab === 'assistants'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Registered Assistants
          </button>
          <button
            onClick={() => setActiveStaffTab('requests')}
            className={`px-4 py-2 font-medium ${
              activeStaffTab === 'requests'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Registration Requests
          </button>
        </div>

        {/* Tab Content */}
        {activeStaffTab === 'assistants' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Registered Assistants</h2>
                <p className="text-gray-500">Manage verified assistant staff</p>
              </div>
              <button 
                onClick={fetchAssistants}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Refresh
              </button>
            </div>

            {error && (
              <div className="p-3 text-red-800 bg-red-100 rounded-md">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="p-4 bg-white rounded-lg shadow">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="p-2">Name</th>
                      <th className="p-2">Email</th>
                      <th className="p-2">Phone</th>
                      <th className="p-2">Age</th>
                      <th className="p-2">Status</th>
                      <th className="p-2">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assistants.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-4 text-center text-gray-500">
                          No assistants registered yet
                        </td>
                      </tr>
                    ) : (
                      assistants.map((assistant) => (
                        <tr key={assistant._id} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">{assistant.name}</td>
                          <td className="p-2">{assistant.email}</td>
                          <td className="p-2">{assistant.MobileNumber}</td>
                          <td className="p-2">{assistant.age}</td>
                          <td className="p-2">
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="p-2 text-sm text-gray-500">
                            {new Date(assistant.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeStaffTab === 'requests' && (
          <AssistantRegistrationHandler />
        )}
      </div>
    );
  }
  
  function ScheduleTab() {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Calendar size={64} className="text-blue-600" />
        <h2 className="mt-4 text-2xl font-bold">Care Schedule</h2>
        <p className="mt-2 text-gray-600">Manage activities, medication schedules, and appointments</p>
      </div>
    );
  }

  function AppointmentsTab() {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [assistants, setAssistants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [assigningId, setAssigningId] = useState(null);

    const fetchData = async () => {
      try {
        setLoading(true);
        const [apts, assts] = await Promise.all([
          appointmentAPI.getAllAppointments(),
          assistantsAPI.list(),
        ]);
        setAppointments(apts);
        setAssistants(assts);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchData();
    }, []);

    const handleAssign = async (appointmentId, assistantId) => {
      try {
        setAssigningId(appointmentId);
        const response = await appointmentAPI.assignAssistant(appointmentId, assistantId);
        console.log("Assignment response:", response);
        
        // Refresh the data to show updated assignment
        await fetchData();
        
        // Show success message with navigation option
        const shouldRedirect = window.confirm(
          "Assistant assigned successfully! Would you like to view the customer dashboard to see the assignment?"
        );
        
        if (shouldRedirect) {
          navigate('/customer-dashboard');
        }
        
      } catch (e) {
        console.error("Assignment error:", e);
        alert("Failed to assign assistant. Please try again.");
      } finally {
        setAssigningId(null);
      }
    };

    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Appointment Management</h2>
            <p className="text-gray-500">Assign assistants to customer appointments</p>
          </div>
          <button 
            onClick={fetchData} 
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Customer Appointments</h3>
          </div>
          
          {appointments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
              <p>No appointments booked yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500 border-b bg-gray-50">
                    <th className="p-4">Service</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">Duration</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Assigned Assistant</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt) => (
                    <tr key={apt._id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-medium">{apt.service}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{apt.customer?.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{apt.customer?.email}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{apt.date}</div>
                        <div className="text-sm text-gray-500">{apt.time}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {apt.hours}h
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          apt.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {apt.status || 'pending'}
                        </span>
                      </td>
                      <td className="p-4">
                        {apt.assistant ? (
                          <div>
                            <div className="font-medium">{apt.assistant}</div>
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              Assigned
                            </span>
                          </div>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                            Not Assigned
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="space-y-2">
                          <select
                            className="border rounded px-3 py-1 text-sm min-w-[150px] w-full"
                            value={apt.assistantId || ''}
                            onChange={(e) => handleAssign(apt._id, e.target.value)}
                            disabled={assigningId === apt._id}
                          >
                            <option value="">Select Assistant</option>
                            {assistants.map((asst) => (
                              <option key={asst._id} value={asst._id}>
                                {asst.name}
                              </option>
                            ))}
                          </select>
                          {assigningId === apt._id && (
                            <div className="text-xs text-blue-600">Assigning...</div>
                          )}
                          <button
                            onClick={() => navigate('/customer-dashboard')}
                            className="w-full px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                            title="View Customer Dashboard"
                          >
                            View Dashboard
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{appointments.length}</div>
            <div className="text-sm text-gray-500">Total Appointments</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">
              {appointments.filter(apt => apt.assistant).length}
            </div>
            <div className="text-sm text-gray-500">Assigned</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-red-600">
              {appointments.filter(apt => !apt.assistant).length}
            </div>
            <div className="text-sm text-gray-500">Unassigned</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">{assistants.length}</div>
            <div className="text-sm text-gray-500">Available Assistants</div>
          </div>
        </div>
      </div>
    );
  }

  // Notifications Tab
  function NotificationsTab() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all'); // all, unread, read

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await notificationAPI.getAllNotifications();
        setNotifications(data);
      } catch (err) {
        setError('Failed to fetch notifications');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchNotifications();
    }, []);

    const handleMarkAsRead = async (notificationId) => {
      try {
        await notificationAPI.markAsRead(notificationId);
        // Update local state
        setNotifications(prev => 
          prev.map(notif => 
            notif._id === notificationId ? { ...notif, read: true } : notif
          )
        );
      } catch (err) {
        console.error('Error marking notification as read:', err);
      }
    };

    const filteredNotifications = notifications.filter(notif => {
      if (filter === 'unread') return !notif.read;
      if (filter === 'read') return notif.read;
      return true;
    });

    const getNotificationIcon = (type) => {
      switch (type) {
        case 'appointment_assigned':
          return <Calendar size={20} className="text-blue-600" />;
        case 'appointment_confirmed':
          return <Clock size={20} className="text-green-600" />;
        case 'appointment_cancelled':
          return <X size={20} className="text-red-600" />;
        default:
          return <Bell size={20} className="text-gray-600" />;
      }
    };

    const getPriorityColor = (priority) => {
      switch (priority) {
        case 'high':
          return 'border-l-red-500 bg-red-50';
        case 'medium':
          return 'border-l-yellow-500 bg-yellow-50';
        case 'low':
          return 'border-l-green-500 bg-green-50';
        default:
          return 'border-l-gray-500 bg-gray-50';
      }
    };

    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">System Notifications</h2>
            <p className="text-gray-500">Monitor all notifications sent to users</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded px-3 py-1"
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
            </select>
            <button 
              onClick={fetchNotifications}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 text-red-800 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        {/* Notification Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{notifications.length}</div>
            <div className="text-sm text-gray-500">Total Notifications</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-red-600">
              {notifications.filter(n => !n.read).length}
            </div>
            <div className="text-sm text-gray-500">Unread</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">
              {notifications.filter(n => n.read).length}
            </div>
            <div className="text-sm text-gray-500">Read</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">
              {notifications.filter(n => n.priority === 'high').length}
            </div>
            <div className="text-sm text-gray-500">High Priority</div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Recent Notifications</h3>
          </div>
          
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell size={48} className="mx-auto mb-4 text-gray-400" />
              <p>No notifications found</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 border-l-4 ${getPriorityColor(notification.priority)} ${
                    !notification.read ? 'bg-blue-50' : 'bg-white'
                  } hover:bg-gray-50 transition-colors`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              New
                            </span>
                          )}
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            notification.priority === 'high' ? 'bg-red-100 text-red-800' :
                            notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {notification.priority}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1">{notification.message}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>To: {notification.recipient?.name} ({notification.recipientRole})</span>
                          <span>•</span>
                          <span>{new Date(notification.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification._id)}
                          className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Mark Read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
  
  function MessagesTab() {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <MessageSquare size={64} className="text-blue-600" />
        <h2 className="mt-4 text-2xl font-bold">Communication Center</h2>
        <p className="mt-2 text-gray-600">Send notifications to staff and family members</p>
      </div>
    );
  }
  
  function ReportsTab() {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <PieChart size={64} className="text-blue-600" />
        <h2 className="mt-4 text-2xl font-bold">Reports & Analytics</h2>
        <p className="mt-2 text-gray-600">Generate insights and reports on resident care</p>
      </div>
    );
  }
  
  function SettingsTab() {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Settings size={64} className="text-blue-600" />
        <h2 className="mt-4 text-2xl font-bold">System Settings</h2>
        <p className="mt-2 text-gray-600">Configure system preferences and user permissions</p>
      </div>
    );
  }