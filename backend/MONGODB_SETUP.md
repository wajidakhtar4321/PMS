# MongoDB Setup Guide for PMS Project

## 🎯 Overview

This guide will help you set up MongoDB for the Project Management System (PMS) after migrating from MySQL.

---

## ✅ Migration Complete

The following changes have been successfully implemented:

### 1. **Dependencies Updated**
- ✅ Removed: `mysql2`, `sequelize`
- ✅ Added: `mongoose@^8.0.3`

### 2. **Database Configuration**
- ✅ Updated `.env` file with MongoDB URI
- ✅ Rewrote `config/db.js` for Mongoose connection

### 3. **Models Converted**
- ✅ `User.js` - Mongoose schema with bcrypt password hashing
- ✅ `Project.js` - Mongoose schema with ObjectId references
- ✅ `Task.js` - Mongoose schema with status enum
- ✅ `Comment.js` - Mongoose schema with user/project references

### 4. **Controllers Updated**
- ✅ `userController.js` - MongoDB query syntax
- ✅ `authMiddleware.js` - Mongoose user lookup
- ✅ `projectController.js` - Complete rewrite for Mongoose
- ✅ `taskController.js` - Complete rewrite for Mongoose
- ✅ `commentController.js` - Complete rewrite for Mongoose

---

## 📋 MongoDB Installation

### Option 1: Using Homebrew (Recommended for macOS)

```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community@7.0

# Start MongoDB service
brew services start mongodb-community@7.0

# Verify installation
mongod --version
mongo --version
```

### Option 2: Manual Installation

1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Extract and install according to your OS
3. Add MongoDB to your PATH

---

## 🚀 Starting MongoDB

### Start as a Service (Recommended)

```bash
# Start MongoDB
brew services start mongodb-community@7.0

# Check status
brew services list | grep mongodb

# Stop MongoDB (when needed)
brew services stop mongodb-community@7.0
```

### Start Manually

```bash
# Create data directory (if not exists)
sudo mkdir -p /usr/local/var/mongodb
sudo mkdir -p /usr/local/var/log/mongodb

# Start MongoDB manually
mongod --config /usr/local/etc/mongod.conf
```

---

## 🔧 Configuration

### Environment Variables (.env)

Your `.env` file is already configured with:

```env
MONGODB_URI=mongodb://localhost:27017/pms_mobiloitte
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
```

### Database Name

- Database: `pms_mobiloitte`
- Collections will be auto-created on first use:
  - `users`
  - `projects`
  - `tasks`
  - `comments`

---

## 🧪 Testing the Connection

### 1. Start MongoDB Service

```bash
brew services start mongodb-community@7.0
```

### 2. Start the Backend

```bash
cd /Users/admin/Desktop/PMS/backend
npm start
```

### 3. Expected Output

```
✅ MongoDB Connected Successfully
📍 Database Host: localhost
📊 Database Name: pms_mobiloitte
🚀 Server running on port 5000
```

---

## 🗄️ Database Management

### Using MongoDB Shell (mongosh)

```bash
# Connect to MongoDB
mongosh

# Switch to your database
use pms_mobiloitte

# View collections
show collections

# View users
db.users.find().pretty()

# View projects
db.projects.find().pretty()

# Count documents
db.users.countDocuments()
db.projects.countDocuments()

# Exit
exit
```

### Using MongoDB Compass (GUI)

1. Install MongoDB Compass: `brew install --cask mongodb-compass`
2. Open Compass and connect to: `mongodb://localhost:27017`
3. Navigate to `pms_mobiloitte` database

---

## 🔑 Key Differences from MySQL

### 1. **Primary Keys**
- **Before (MySQL):** `id` (integer, auto-increment)
- **After (MongoDB):** `_id` (ObjectId, auto-generated)

### 2. **Query Syntax**
```javascript
// Before (Sequelize)
User.findOne({ where: { email: 'user@example.com' } })
User.findByPk(1)

// After (Mongoose)
User.findOne({ email: 'user@example.com' })
User.findById('507f1f77bcf86cd799439011')
```

### 3. **Relationships**
```javascript
// Before (Sequelize)
Project.findAll({
  include: [{ model: User, as: 'assignedTo' }]
})

// After (Mongoose)
Project.find()
  .populate('assignedTo', 'name email')
```

### 4. **Password Handling**
```javascript
// Before (Sequelize)
User.findOne({ 
  where: { email },
  attributes: { exclude: ['password'] }
})

// After (Mongoose)
User.findOne({ email }) // password excluded by default (select: false)
User.findOne({ email }).select('+password') // include password when needed
```

---

## 🐛 Troubleshooting

### Issue 1: "MongoDB Connection Error"

**Solution:**
```bash
# Check if MongoDB is running
brew services list | grep mongodb

# If not running, start it
brew services start mongodb-community@7.0

# Check logs
tail -f /usr/local/var/log/mongodb/mongo.log
```

### Issue 2: "connect ECONNREFUSED 127.0.0.1:27017"

**Solution:**
- MongoDB service is not running
- Start MongoDB: `brew services start mongodb-community@7.0`

### Issue 3: "Database Connection Timeout"

**Solution:**
- Check your `.env` file has correct `MONGODB_URI`
- Verify MongoDB is accessible: `mongosh`
- Check firewall settings

### Issue 4: "Authentication Failed"

**Solution:**
- Default MongoDB installation has no authentication
- If you enabled auth, update `.env`:
  ```env
  MONGODB_URI=mongodb://username:password@localhost:27017/pms_mobiloitte
  ```

---

## 📊 Schema Overview

### User Schema
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin/manager/developer),
  createdAt: Date,
  updatedAt: Date
}
```

### Project Schema
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  status: String (planning/in-progress/testing/completed/on-hold),
  startDate: Date,
  endDate: Date,
  assignedTo: ObjectId (ref: User),
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Task Schema
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  status: String (todo/in-progress/in-review/done),
  priority: String (low/medium/high/urgent),
  dueDate: Date,
  projectId: ObjectId (ref: Project),
  assignedTo: ObjectId (ref: User),
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Schema
```javascript
{
  _id: ObjectId,
  content: String,
  projectId: ObjectId (ref: Project),
  userId: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔄 Frontend Updates

### API Response Changes

The frontend may need minor updates if it relies on `id` instead of `_id`:

```javascript
// Before
const projectId = project.id;

// After
const projectId = project._id;
```

**Note:** Most modern frameworks handle this automatically when mapping data.

---

## ✨ Next Steps

1. ✅ MongoDB installation (in progress)
2. ⏳ Start MongoDB service
3. ⏳ Test backend connection
4. ⏳ Create initial admin user
5. ⏳ Test authentication flow
6. ⏳ Verify all CRUD operations
7. ⏳ Update frontend if needed

---

## 📚 Useful Commands

```bash
# Backend commands
npm install          # Install dependencies
npm start           # Start backend server
npm run dev         # Start with nodemon

# MongoDB commands
mongosh                           # Open MongoDB shell
brew services start mongodb-community@7.0   # Start MongoDB
brew services stop mongodb-community@7.0    # Stop MongoDB
brew services restart mongodb-community@7.0 # Restart MongoDB

# Database operations
mongosh
use pms_mobiloitte
db.users.find()
db.projects.find()
db.tasks.find()
db.comments.find()
```

---

## 🎉 Success Checklist

- [ ] MongoDB installed successfully
- [ ] MongoDB service running
- [ ] Backend connects to MongoDB
- [ ] Can create users (registration works)
- [ ] Can login and get JWT token
- [ ] Can create/read/update/delete projects
- [ ] Can create/read/update/delete tasks
- [ ] Can create/read comments
- [ ] Frontend displays data correctly

---

## 📞 Support

If you encounter any issues:
1. Check MongoDB logs: `/usr/local/var/log/mongodb/mongo.log`
2. Check backend logs in terminal
3. Verify `.env` configuration
4. Ensure MongoDB service is running

---

**Migration Date:** 2025-10-15
**MongoDB Version:** 7.0
**Mongoose Version:** 8.0.3
