# Backend Troubleshooting Guide

## 🔧 Common Errors and Solutions

### 1. "stream is not readable" Error

**Error Message:**

```
InternalServerError: stream is not readable
    at readStream (node_modules/express/node_modules/raw-body/index.js:185:17)
    at getRawBody (node_modules/express/node_modules/raw-body/index.js:116:12)
```

**Cause:** Conflicting middleware configuration with both `bodyParser` and `express.json()`

**Solution:** ✅ **FIXED** - Removed deprecated `bodyParser` and kept only `express.json()`

### 2. MongoDB Connection Error

**Error Message:**

```
MongoDB connection error: [Error]
```

**Solutions:**

1. **Start MongoDB service:**

   ```bash
   # Windows
   net start MongoDB

   # macOS/Linux
   sudo systemctl start mongod
   ```

2. **Check MongoDB installation:**

   ```bash
   mongod --version
   ```

3. **Verify connection string in .env:**
   ```env
   MONGO_URI=mongodb://localhost:27017/elderly_care
   ```

### 3. JWT Secret Error

**Error Message:**

```
JWT_SECRET is not defined
```

**Solution:**

1. Create `.env` file:

   ```bash
   node setup-env.js
   ```

2. Update JWT_SECRET with a secure random string:
   ```env
   JWT_SECRET=your_secure_random_string_here
   ```

### 4. Port Already in Use

**Error Message:**

```
EADDRINUSE: address already in use :::5000
```

**Solutions:**

1. **Kill process using port 5000:**

   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F

   # macOS/Linux
   lsof -ti:5000 | xargs kill -9
   ```

2. **Change port in .env:**
   ```env
   PORT=5001
   ```

### 5. Module Import Errors

**Error Message:**

```
Cannot find module './models/User.js'
```

**Solutions:**

1. **Check file extensions:** All imports must include `.js` extension
2. **Verify file paths:** Ensure all files exist in correct locations
3. **Clear node_modules and reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## 🚀 Setup Instructions

### 1. Environment Setup

```bash
# Create .env file
node setup-env.js

# Install dependencies
npm install
```

### 2. Database Setup

```bash
# Start MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGO_URI in .env with your Atlas connection string
```

### 3. Start Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 🔍 Debug Mode

Enable debug logging by adding to `.env`:

```env
DEBUG=express:*
NODE_ENV=development
```

## 📋 Health Check Endpoints

Test these endpoints to verify server health:

1. **Server Status:** `GET http://localhost:5000/`
2. **Health Check:** `GET http://localhost:5000/health`
3. **API Status:** `GET http://localhost:5000/api/status`

## 🛠️ Common Fixes

### Fix 1: Clear Cache

```bash
# Clear npm cache
npm cache clean --force

# Clear node_modules
rm -rf node_modules package-lock.json
npm install
```

### Fix 2: Update Dependencies

```bash
# Update all dependencies
npm update

# Check for outdated packages
npm outdated
```

### Fix 3: Check Node Version

```bash
# Verify Node.js version (should be 14+)
node --version

# Use nvm to switch versions if needed
nvm use 16
```

## 📞 Support

If you encounter other errors:

1. **Check the console logs** for detailed error messages
2. **Verify all environment variables** are set correctly
3. **Ensure MongoDB is running** and accessible
4. **Check file permissions** and paths
5. **Review the server logs** for specific error details

## 🔄 Restart Process

If all else fails:

```bash
# 1. Stop the server (Ctrl+C)
# 2. Clear cache
npm cache clean --force

# 3. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# 4. Restart MongoDB
# 5. Start server
npm run dev
```
