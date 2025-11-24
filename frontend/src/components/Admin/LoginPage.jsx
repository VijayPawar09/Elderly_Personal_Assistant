import { Bell, Calendar, ChevronRight, Clock, FileText, Home, LogOut, Menu, MessageSquare, PieChart, Settings, User, Users } from 'lucide-react';
import { useState } from 'react';
import { authAPI } from '../../API/auth.js';

export default function LoginPage({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Hardcoded admin credentials for quick access
      const HARDCODED_ADMIN = {
        email: 'admin@elderlycare.com',
        password: 'admin123'
      };
      
      // Check hardcoded credentials first
      if (username === HARDCODED_ADMIN.email && password === HARDCODED_ADMIN.password) {
        // Create mock admin user data
        const mockAdminUser = {
          id: 'admin_001',
          name: 'Admin User',
          email: HARDCODED_ADMIN.email,
          role: 'admin',
          MobileNumber: '1234567890'
        };
        
        // Create mock token
        const mockToken = 'mock_admin_token_' + Date.now();
        
        // Store in localStorage
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockAdminUser));
        
        // Redirect to admin dashboard
        onLogin();
        window.location.href = '/admin';
        return;
      }
      
      // If not hardcoded credentials, try API login
      try {
        const res = await authAPI.login({ email: username, password });
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        if (res.user.role !== 'admin') {
          setError('Only admins can access this portal');
          return;
        }
        onLogin();
        window.location.href = '/admin';
      } catch (err) {
        setError(err.message || 'Login failed');
      }
    };
  
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-blue-700">Elderly Personal Assistance Admin Portal</h1>
            <p className="mt-2 text-sm text-gray-600">Please login to access the dashboard</p>
          </div>
          
          {error && (
            <div className="p-3 text-sm text-red-800 bg-red-100 rounded-md">
              {error}
            </div>
          )}
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-lg font-medium text-gray-700">
                Admin Email
              </label>
              <input
                id="username"
                name="username"
                type="email"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full px-4 py-3 mt-1 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter admin email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-lg font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 mt-1 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>
            
            <div>
              <button
                type="submit"
                className="flex justify-center w-full px-4 py-3 text-lg font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in
              </button>
            </div>
            
            <div className="text-center">
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Forgot password?
              </a>
            </div>
          </form>
          
          {/* Admin Credentials Hint */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800 font-medium">Demo Admin Credentials:</p>
            <p className="text-sm text-blue-700">Email: admin@elderlycare.com</p>
            <p className="text-sm text-blue-700">Password: admin123</p>
          </div>
        </div>
      </div>
    );
  }
  