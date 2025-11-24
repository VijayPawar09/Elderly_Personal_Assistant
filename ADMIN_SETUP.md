# Admin Setup Guide

## 🔐 Admin Credentials

To access the admin portal, you need to create an admin user first.

### Quick Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies (if not already done):**
   ```bash
   npm install
   ```

3. **Create environment file (if not exists):**
   ```bash
   node setup-env.js
   ```

4. **Start MongoDB:**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

5. **Create admin user:**
   ```bash
   npm run create-admin
   ```

6. **Start the backend server:**
   ```bash
   npm run dev
   ```

7. **Start the frontend (in another terminal):**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

### 🎯 Admin Login Credentials

After running the `create-admin` script, use these credentials:

- **Email:** `admin@elderlycare.com`
- **Password:** `admin123`

⚠️ **Important:** Change the password after first login for security.

### 🌐 Access URLs

- **Frontend:** http://localhost:5173
- **Admin Portal:** http://localhost:5173/admin
- **Backend API:** http://localhost:5000

### 🔧 Troubleshooting

**If admin creation fails:**
1. Make sure MongoDB is running
2. Check if `.env` file exists with correct MONGO_URI
3. Verify no existing admin user exists

**If login fails:**
1. Ensure backend server is running on port 5000
2. Check browser console for errors
3. Verify the admin user was created successfully

**If you need to reset admin password:**
1. Delete the admin user from MongoDB
2. Run `npm run create-admin` again

### 📱 Admin Portal Features

Once logged in, you can access:
- Dashboard Overview
- Resident Management
- Staff Directory
- Appointment Management
- Care Scheduling
- Communications
- Reports & Analytics
- System Settings

### 🔄 Database Management

**To view admin user in MongoDB:**
```bash
mongo
use elderly_care
db.users.find({role: "admin"})
```

**To delete admin user (if needed):**
```bash
mongo
use elderly_care
db.users.deleteOne({role: "admin"})
```
